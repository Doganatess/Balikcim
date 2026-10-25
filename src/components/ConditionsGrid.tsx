import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Calendar, 
  Anchor, 
  Ship, 
  Star, 
  ChevronRight, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Waves, 
  Wind, 
  Compass, 
  Cloud, 
  Gauge, 
  Moon,
  ChevronDown,
  Info,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Layers
} from 'lucide-react';
import { Region } from '../data/regionsData';
import { 
  fetchLiveMarineAndWeather, 
  LiveConditionsData,
  HourlyForecastItem,
  evaluatePracticalSafety,
  createUnavailableSafetyAssessment,
  degreeToTurkishDirection
} from '../services/openMeteoService';

interface ConditionsGridProps {
  region: Region;
  onOpenRegionPicker?: () => void;
  onOpenHourlyModal?: () => void;
}

export const ConditionsGrid: React.FC<ConditionsGridProps> = ({
  region,
  onOpenRegionPicker
}) => {
  const [activeMode, setActiveMode] = useState<'simdi' | 'planla'>('simdi');
  const [activeLocationType, setActiveLocationType] = useState<'kiyi' | 'tekne'>('kiyi');
  const [selectedPlanHourIndex, setSelectedPlanHourIndex] = useState<number>(0);
  const [showSafetyDetails, setShowSafetyDetails] = useState(false);
  const [liveData, setLiveData] = useState<LiveConditionsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Canlı Open-Meteo verisini çek (bölge koordinatları değiştikçe tetiklenir)
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchLiveMarineAndWeather(region.lat, region.lng, region.name, {
      airTemp: region.conditions.airTemp,
      waterTemp: region.conditions.waterTemp,
      windSpeed: region.conditions.windSpeed,
      windDirection: region.conditions.windDirection,
      waveHeight: region.conditions.waveHeight,
      wavePeriod: region.conditions.wavePeriod,
      cloudCoverage: region.conditions.cloudCoverage,
      pressure: region.conditions.pressure,
      rainChance: region.conditions.rainChance,
      bestWindow: region.conditions.bestWindow,
    })
      .then((data) => {
        if (isMounted) {
          setLiveData(data);
          setIsLoading(false);
          setSelectedPlanHourIndex(0);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [region.id, region.lat, region.lng, region.name]);

  // Canlı API verisi veya geçerli güncel önbellek var mı kontrolü
  const isLiveOrCached = liveData !== null && (liveData.sourceStatus === 'MODEL_OPEN_METEO' || liveData.sourceStatus === 'ONBELLEK');

  const c: LiveConditionsData = liveData || {
    airTemp: region.conditions.airTemp,
    waterTemp: region.conditions.waterTemp,
    waterTempNote: 'Referans veri, güncel ölçüm değil (Mevsimsel kıyı modeli referansı)',
    rainChance: region.conditions.rainChance,
    precipitationMm: 0,
    waveHeight: region.conditions.waveHeight,
    wavePeriod: region.conditions.wavePeriod,
    waveDirection: region.conditions.windDirection,
    waveSource: 'Referans Model',
    hasValidMarineData: false,
    windSpeed: region.conditions.windSpeed,
    windDirection: region.conditions.windDirection,
    windDirectionDeg: 180,
    currentSpeed: region.conditions.currentSpeed,
    currentDirection: region.conditions.currentDirection,
    currentType: 'Rüzgâr ve Morfolojiden Teorik Hesaplanan Akıntı',
    cloudCoverage: region.conditions.cloudCoverage,
    pressure: region.conditions.pressure,
    pressureTrend: region.conditions.pressureTrend,
    moonPhase: region.conditions.moonPhase,
    moonPhaseIcon: region.conditions.moonPhaseIcon,
    solunarRating: region.conditions.solunarRating as any,
    safetyStatus: 'Belirsiz — veri eksik',
    safetyAssessment: createUnavailableSafetyAssessment(),
    bestWindow: region.conditions.bestWindow,
    sourceStatus: 'YEDEK_MODEL',
    modelTime: '--:--',
    fetchTime: '--:--',
    lastUpdatedText: 'Referans veri, güncel ölçüm değil (API Yanıt Vermedi)',
    hourlyForecast: [],
    apiNotice: 'Canlı hava/deniz tahmin API bağlantısı sağlanamadı. Güncel veri yok — güvenlik değerlendirilemiyor.'
  };

  // Planlama modu seçilmişse, seçilen saatin tahmin verilerini al
  const plannedHour: HourlyForecastItem | undefined =
    c.hourlyForecast && c.hourlyForecast.length > 0
      ? c.hourlyForecast[selectedPlanHourIndex] || c.hourlyForecast[0]
      : undefined;

  // Şimdi veya Planla modundaki aktif gösterge değerleri
  const displayAirTemp = activeMode === 'planla' && plannedHour?.temp !== undefined ? plannedHour.temp : c.airTemp;
  const displayRainChance = activeMode === 'planla' && plannedHour?.rainProb !== undefined ? plannedHour.rainProb : c.rainChance;
  const displayWindSpeed = activeMode === 'planla' && plannedHour?.windSpeed !== undefined ? plannedHour.windSpeed : c.windSpeed;
  const displayWindDir = activeMode === 'planla' && plannedHour?.windDirection ? plannedHour.windDirection : c.windDirection;
  const displayWaveHeight = activeMode === 'planla' && plannedHour?.waveHeight !== undefined ? plannedHour.waveHeight : c.waveHeight;
  const displayWavePeriod = activeMode === 'planla' && plannedHour?.wavePeriod !== undefined ? plannedHour.wavePeriod : c.wavePeriod;

  // Saatlik tahmin veya anlık durum için deniz verisi geçerliliği ve kaynak etiketini saat bazında takip et
  const displayHasValidMarineData = activeMode === 'planla' && plannedHour
    ? Boolean(plannedHour.hasMarineWaveData)
    : c.hasValidMarineData;

  const displayWaveSource = activeMode === 'planla' && plannedHour?.waveSource
    ? plannedHour.waveSource
    : c.waveSource;

  // Geçerli API verisi veya geçerli güncel önbellek olduğunda mevcut güvenlik değerlendirmesini koru.
  // Marine API verisi eksikse veya API'ye ulaşılamamışsa kesin "Güvenli/Uygun" sonucu verme; güvenlik Belirsiz kalsın!
  const activeSafety = isLiveOrCached
    ? evaluatePracticalSafety(
        displayWindSpeed, 
        displayWaveHeight, 
        displayWavePeriod, 
        displayRainChance, 
        activeLocationType === 'tekne',
        displayHasValidMarineData
      )
    : createUnavailableSafetyAssessment();

  return (
    <div id="kosullar" className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Kapsam Dışı Bölge Uyarısı */}
      {!region.isWithinSamsunOrduScope && (
        <div className="mb-2.5 p-2.5 rounded-2xl bg-amber-950/80 border border-amber-600/70 text-xs text-amber-200 flex items-start gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Bölge Kapsam Dışı:</strong> {region.name} Samsun–Ordu kıyı analiz sınırları dışındadır.
            <div className="text-[11px] text-amber-300/80 mt-0.5">
              Harita, kıyı bandı eşiği ve 30 kayıtlı mera yalnızca Samsun ve Ordu kıyılarına özeldir.
            </div>
          </div>
        </div>
      )}

      {/* Top Toggle Bar: Şimdi / Planla & Kıyı / Tekne & Bölge Seçimi */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-2.5">
        
        {/* Şimdi / Planla Sekmeleri */}
        <div className="flex p-1 rounded-2xl bg-[#0f172a] border border-slate-800">
          <button
            onClick={() => setActiveMode('simdi')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeMode === 'simdi'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Şimdi (Mevcut)</span>
          </button>
          <button
            onClick={() => setActiveMode('planla')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeMode === 'planla'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Planla (Saatlik)</span>
          </button>
        </div>

        {/* Kıyı / Tekne & Bölge Seçimi */}
        <div className="flex items-center gap-2">
          {/* Kıyı / Tekne */}
          <div className="flex p-1 rounded-2xl bg-[#0f172a] border border-slate-800">
            <button
              onClick={() => setActiveLocationType('kiyi')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeLocationType === 'kiyi'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Anchor className="w-3 h-3" />
              <span>Kıyı</span>
            </button>
            <button
              onClick={() => setActiveLocationType('tekne')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeLocationType === 'tekne'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ship className="w-3 h-3" />
              <span>Tekne</span>
            </button>
          </div>

          {/* Bölge Butonu */}
          <button
            onClick={onOpenRegionPicker}
            className="flex-1 sm:flex-initial flex items-center justify-between gap-1.5 px-3.5 py-2 rounded-2xl bg-[#0f172a] border border-slate-800 text-xs sm:text-sm font-medium text-slate-200 hover:border-cyan-500/50 transition"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[130px] sm:max-w-none">{region.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Veri Kaynağı ve Güncelleme Şeffaflık Çubuğu */}
      <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-[10.5px]">
        <div className="flex items-center gap-1.5">
          {isLoading ? (
            <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />
          ) : c.sourceStatus === 'MODEL_OPEN_METEO' ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          ) : c.sourceStatus === 'ONBELLEK' ? (
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
          ) : (
            <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
          )}

          <span className="font-medium text-slate-300">
            {isLoading 
              ? 'Open-Meteo sayısal tahmin modelleri sorgulanıyor...' 
              : !isLiveOrCached
              ? 'Referans veri, güncel ölçüm değil (API yanıt vermedi)'
              : activeMode === 'planla' && plannedHour
              ? `Planlanan Saat: ${plannedHour.hour} (${c.lastUpdatedText})`
              : c.lastUpdatedText}
          </span>
        </div>

        <div className="text-slate-400 font-mono text-[9.5px]">
          {!isLiveOrCached ? (
            <span className="text-amber-400 font-medium">GÜNCEL VERİ YOK</span>
          ) : (
            `${region.lat.toFixed(2)}°N, ${region.lng.toFixed(2)}°E`
          )}
        </div>
      </div>

      {/* PLANLA MODU: Saatlik Karşılaştırma ve Zaman Çizelgesi */}
      {activeMode === 'planla' && (
        <div className="mb-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#0a111e] border border-cyan-500/40 shadow-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between flex-wrap gap-1.5 border-b border-slate-800 pb-2">
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Gelecek Saatler Av Planlama & Karşılaştırma</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Bir saate dokunarak o saatteki rüzgâr, dalga, yağış ve güvenlik durumunu inceleyin.
              </div>
            </div>

            <div className="text-[10.5px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/80">
              {c.hourlyForecast.length > 0 ? `${c.hourlyForecast.length} Saatlik Projeksiyon` : 'Tahmin Yok'}
            </div>
          </div>

          {c.hourlyForecast.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl p-4 border border-slate-800">
              <AlertCircle className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
              <div className="font-bold text-slate-200">Tahmin verisi yok</div>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                Canlı Open-Meteo API bağlantısı kurulamadığında sahte gelecek saat tahminleri üretilmez. Çevrimdışı referans değerleri kullanılmaktadır.
              </p>
            </div>
          ) : (
            <>
              {/* Yatay Kaydırılabilir Saatlik Zaman Çizelgesi */}
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
                {c.hourlyForecast.map((item, idx) => {
                  const isSelected = selectedPlanHourIndex === idx;
                  const isPeak = item.score !== null && item.score >= 90;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPlanHourIndex(idx)}
                      className={`min-w-[82px] p-2.5 rounded-2xl text-center border transition shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-500/30'
                          : 'bg-[#111927] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] font-mono font-bold text-slate-300">
                        {item.hour}
                      </div>

                      {/* Aktivite Skoru */}
                      <div className="my-1">
                        {item.score !== null ? (
                          <div className={`text-base font-black ${
                            isPeak ? 'text-amber-400' : item.score >= 75 ? 'text-cyan-300' : 'text-slate-400'
                          }`}>
                            %{item.score}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500">Veri Yok</div>
                        )}
                      </div>

                      {/* Sıcaklık & Rüzgar */}
                      <div className="text-[10px] text-slate-300 font-mono">
                        {item.temp !== undefined ? `${item.temp}°C` : '--'}
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono">
                        {item.windSpeed !== undefined ? `${item.windSpeed}k/s` : '--'}
                      </div>

                      {/* Güvenlik Rozeti */}
                      <div className="mt-1">
                        <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-semibold ${
                          item.safetyRating === 'Riskli'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : item.safetyRating === 'Dikkat'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : item.safetyRating === 'Belirsiz'
                            ? 'bg-slate-800 text-slate-300 border border-slate-700'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {item.safetyRating}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Seçili Plan Saati Özeti */}
              {plannedHour && (
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span>Saat {plannedHour.hour} İçin Model Tahmini</span>
                      <span className="text-[10px] text-slate-400 font-normal italic">({plannedHour.desc})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Rüzgâr: <strong className="text-slate-200">{plannedHour.windSpeed} km/sa {plannedHour.windDirection}</strong> · 
                      Dalga: <strong className="text-slate-200">{plannedHour.waveHeight} m</strong> {!displayHasValidMarineData ? <span className="text-amber-400/90 text-[10px] font-normal">(Rüzgârdan türetilmiş tahmin; gerçek dalga ölçümü değil)</span> : null} · 
                      Yağış İhtimali: <strong className="text-slate-200">%{plannedHour.rainProb}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10.5px] px-2.5 py-1 rounded-full font-bold ${
                      plannedHour.safetyRating === 'Riskli'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : plannedHour.safetyRating === 'Dikkat'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : plannedHour.safetyRating === 'Belirsiz'
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {plannedHour.safetyRating}
                    </span>
                  </div>
                </div>
              )}

              <div className="text-[9.5px] text-slate-500 italic leading-snug">
                * Saatlik aktivite puanı Solunar döngüsü, rüzgâr ve sıcaklık toleransına dayalı teorik bir balık beslenme tahminidir; bir güvenlik değerlendirmesi değildir. Puan yüksek olsa dahi güvenli avlanma koşullarını garanti etmez; güvenlik durumu rüzgâr ve dalga verilerinden bağımsız kontrol edilmelidir.
              </div>
            </>
          )}
        </div>
      )}

      {/* ŞİMDİ MODU: "En İyi Av Saati" ve Güvenlik Durumu Çubuğu */}
      {activeMode === 'simdi' && (
        <div 
          onClick={() => setShowSafetyDetails(!showSafetyDetails)}
          className="w-full mb-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#171a18] via-[#1a1c1d] to-[#171a18] border border-amber-950/40 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {isLiveOrCached && c.hourlyForecast.length > 0 ? (
              <>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-amber-400">En iyi av saati</span>
                <span className="text-xs text-slate-300 hidden sm:inline">· Bugün {c.bestWindow}</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-slate-300">Tahmini av aralığı (Saatlik tahmin yok)</span>
                <span className="text-xs text-slate-400 hidden sm:inline">· Referans aralık: {c.bestWindow}</span>
              </>
            )}
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
              activeSafety.rating === 'Riskli'
                ? 'bg-red-950/90 text-red-300 border border-red-800'
                : activeSafety.rating === 'Dikkat'
                ? 'bg-amber-950/90 text-amber-300 border border-amber-800'
                : activeSafety.rating === 'Belirsiz'
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'bg-emerald-950/90 text-emerald-300 border border-emerald-800'
            }`}>
              {activeSafety.badgeTitle}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-300 group-hover:text-amber-300 transition shrink-0">
            <span>Saha Güvenlik Raporu</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSafetyDetails ? 'rotate-90' : ''}`} />
          </div>
        </div>
      )}

      {/* Avlanma Koşulları ve Saha Güvenliği Değerlendirme Paneli */}
      {(showSafetyDetails || activeMode === 'planla') && (
        <div className="mb-3.5 p-4 rounded-2xl bg-[#0d1624] border border-slate-800 shadow-xl space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm font-bold text-white">Avlanma Koşulları & Saha Güvenliği</span>
            </div>
            <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${
              activeSafety.rating === 'Riskli'
                ? 'bg-red-950 text-red-300 border border-red-800'
                : activeSafety.rating === 'Dikkat'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : activeSafety.rating === 'Belirsiz'
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {activeSafety.badgeTitle}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {activeSafety.summary}
          </p>

          {/* 4 Ana Faktör Durumu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <strong className="text-cyan-400">Rüzgâr Durumu:</strong> {activeSafety.factors.windStatus}
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <strong className="text-blue-400">Dalga Durumu:</strong> {activeSafety.factors.waveStatus}
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <strong className="text-indigo-400">Yağış Durumu:</strong> {activeSafety.factors.rainStatus}
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
              <strong className="text-purple-400">Akıntı (Tahmin):</strong> {activeSafety.factors.currentStatus}
            </div>
          </div>

          {/* Eksik Veriler ve Güvenlik Uyarıları */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1 text-[10px] text-slate-400">
            <div className="font-semibold text-slate-300">Eksik Veri & Sınırlandırmalar:</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              {activeSafety.dataSourceNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
            <div className="pt-1 text-amber-400/90 font-medium border-t border-slate-800/60">
              ⚠ Uyarı: Kıyıdan avlanmanın güvenliği kesin olarak garanti edilemez. Falez kenarları, mendirek kayganlığı ve ani fırtına değişimleri sahada kontrol edilmelidir.
            </div>
          </div>
        </div>
      )}

      {/* 9 Conditions Cards Grid (3 Sütun x 3 Satır) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        
        {/* 1. Hava Sıcaklığı */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              <span>Hava</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">
              {!isLiveOrCached ? 'Referans' : activeMode === 'planla' ? 'Tahmin' : 'Model 2m'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {displayAirTemp}°C
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            {!isLiveOrCached ? 'Referans veri, güncel ölçüm değil' : 'Sayısal Hava Tahmini'}
          </div>
        </div>

        {/* 2. Deniz Sıcaklığı */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deniz</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">
              {!isLiveOrCached ? 'Referans' : 'Model L4'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {c.waterTemp}°C
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5" title={c.waterTempNote}>
            {!isLiveOrCached ? 'Referans veri, güncel ölçüm değil' : 'NASA / Copernicus'}
          </div>
        </div>

        {/* 3. Yağış */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Yağış</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">
              {!isLiveOrCached ? 'Referans' : activeMode === 'planla' ? 'Olasılık' : 'Model'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            %{displayRainChance}
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            {!isLiveOrCached 
              ? 'Referans veri, güncel ölçüm değil' 
              : activeMode === 'simdi' && c.precipitationMm > 0 
              ? `${c.precipitationMm} mm yağış` 
              : 'Sayısal Model Tahmini'}
          </div>
        </div>

        {/* 4. Dalga */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              <span>Dalga</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {!isLiveOrCached 
                ? 'Referans' 
                : !displayHasValidMarineData 
                ? 'Türetilmiş' 
                : `${displayWavePeriod}s`}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {displayWaveHeight} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
          <div 
            className="text-[9.5px] truncate mt-0.5" 
            title={!isLiveOrCached ? 'Referans veri, güncel ölçüm değil' : displayWaveSource}
          >
            {!isLiveOrCached ? (
              <span className="text-slate-500">Referans veri, güncel ölçüm değil</span>
            ) : !displayHasValidMarineData ? (
              <span className="text-amber-400/90 font-medium">Rüzgârdan türetilmiş tahmin; gerçek dalga ölçümü değil</span>
            ) : (
              <span className="text-slate-500">Açık Deniz Modeli (Open-Meteo Marine)</span>
            )}
          </div>
        </div>

        {/* 5. Rüzgar */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rüzgar</span>
            </div>
            <span className="text-[11px] font-bold text-slate-300 font-mono">{displayWindDir}</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {displayWindSpeed} <span className="text-xs font-normal text-slate-400">km/s</span>
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            {!isLiveOrCached ? 'Referans veri, güncel ölçüm değil' : 'Open-Meteo 10m Modeli'}
          </div>
        </div>

        {/* 6. Akıntı */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Akıntı</span>
            </div>
            <span className="text-[11px] font-bold text-slate-300 font-mono">{c.currentDirection}</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {c.currentSpeed} <span className="text-xs font-normal text-slate-400">m/s</span>
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5" title="Rüzgâr ve morfolojiden teorik türetilmiştir; doğrudan sensör ölçümü değildir.">
            Teorik Hesaplanan Akıntı
          </div>
        </div>

        {/* 7. Bulut */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bulut</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">
              {!isLiveOrCached ? 'Referans' : 'Model'}
            </span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            %{c.cloudCoverage}
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            {!isLiveOrCached ? 'Referans veri, güncel ölçüm değil' : 'Sayısal Bulutluluk'}
          </div>
        </div>

        {/* 8. Basınç */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>Basınç</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">↘</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {c.pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            {!isLiveOrCached ? 'Referans veri, güncel ölçüm değil' : 'İndirgenmiş Basınç (MSL)'}
          </div>
        </div>

        {/* 9. Ay Fazı */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-400" />
              <span>Ay</span>
            </div>
            <span className="text-[9px] font-mono text-purple-400">{c.solunarRating}</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1">
            <span>{c.moonPhaseIcon}</span>
            <span className="truncate">{c.moonPhase}</span>
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            Astronomik Hesap
          </div>
        </div>

      </div>

      {/* Şeffaflık Alt Notu */}
      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[9.5px] text-slate-500 px-1">
        <span>Meteoroloji & Dalga: Open-Meteo Sayısal Tahmin Modelleri (NWP)</span>
        <span className="font-mono text-cyan-500/80">Kıyı Şamandıra Ölçümü Değildir · Akıntı Teorik Tahmindir</span>
      </div>
    </div>
  );
};
