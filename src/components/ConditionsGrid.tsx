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
  CheckCircle2
} from 'lucide-react';
import { Region } from '../data/regionsData';
import { 
  fetchLiveMarineAndWeather, 
  LiveConditionsData,
  HourlyForecastItem 
} from '../services/openMeteoService';

interface ConditionsGridProps {
  region: Region;
  onOpenRegionPicker?: () => void;
  onOpenHourlyModal?: () => void;
}

export const ConditionsGrid: React.FC<ConditionsGridProps> = ({
  region,
  onOpenRegionPicker,
  onOpenHourlyModal
}) => {
  const [activeMode, setActiveMode] = useState<'simdi' | 'planla'>('simdi');
  const [activeLocationType, setActiveLocationType] = useState<'kiyi' | 'tekne'>('kiyi');
  const [showHourlySlider, setShowHourlySlider] = useState(false);
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

  // Sayısal model çıktısı varsa kullan, yoksa yerel referans modeli şeffaf olarak göster
  const c: LiveConditionsData = liveData || {
    airTemp: region.conditions.airTemp,
    waterTemp: region.conditions.waterTemp,
    waterTempNote: 'NASA GIBS & Copernicus referans modeli',
    rainChance: region.conditions.rainChance,
    precipitationMm: 0,
    waveHeight: region.conditions.waveHeight,
    wavePeriod: region.conditions.wavePeriod,
    waveDirection: region.conditions.windDirection,
    waveSource: 'Referans Model',
    windSpeed: region.conditions.windSpeed,
    windDirection: region.conditions.windDirection,
    windDirectionDeg: 180,
    currentSpeed: region.conditions.currentSpeed,
    currentDirection: region.conditions.currentDirection,
    cloudCoverage: region.conditions.cloudCoverage,
    pressure: region.conditions.pressure,
    pressureTrend: region.conditions.pressureTrend,
    moonPhase: region.conditions.moonPhase,
    moonPhaseIcon: region.conditions.moonPhaseIcon,
    solunarRating: region.conditions.solunarRating as any,
    safetyStatus: region.conditions.safetyStatus,
    bestWindow: region.conditions.bestWindow,
    sourceStatus: 'YEDEK_MODEL',
    modelTime: '--:--',
    fetchTime: '--:--',
    lastUpdatedText: 'Yedek Bölgesel Model (API Yanıt Vermedi)',
    hourlyForecast: [
      { hour: '05:00', score: 78, desc: 'Sabah suyu başlangıcı' },
      { hour: '06:00', score: 94, desc: '★ Zirve Beslenme Pencerisi' },
      { hour: '07:00', score: 96, desc: '★ En Yüksek Verim' },
      { hour: '08:00', score: 88, desc: 'Yüksek aktivite' },
      { hour: '12:00', score: 55, desc: 'Öğle durgunluğu' },
      { hour: '17:00', score: 76, desc: 'İkindi hareketi' },
      { hour: '18:00', score: 91, desc: '★ Akşam Suyu' },
      { hour: '19:00', score: 93, desc: '★ Zirve Akşam Saati' },
      { hour: '21:00', score: 82, desc: 'Gece avı' }
    ],
    apiNotice: 'Canlı model verisi bekleniyor...'
  };

  return (
    <div id="kosullar" className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Top Toggle Bar (Directly matching mobile UX) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-2.5">
        {/* Şimdi / Planla Pill Toggle */}
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
            <span>Şimdi</span>
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
            <span>Planla</span>
          </button>
        </div>

        {/* Secondary Toggles: Kıyı / Tekne & Location Pill */}
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

          {/* Region Pill */}
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

      {/* Gerçek Veri Durumu Bildirim Çubuğu (Şeffaflık) */}
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
              : c.lastUpdatedText}
          </span>
        </div>

        <div className="text-slate-400 font-mono text-[9.5px]">
          {region.lat.toFixed(2)}°N, {region.lng.toFixed(2)}°E
        </div>
      </div>

      {/* "En iyi av saati" Star Banner */}
      <div 
        onClick={() => setShowHourlySlider(!showHourlySlider)}
        className="w-full mb-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#171a18] via-[#1a1c1d] to-[#171a18] border border-amber-950/40 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition group"
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs sm:text-sm font-bold text-amber-400">En iyi av saati</span>
          <span className="text-xs text-slate-300 hidden sm:inline">· Bugün {c.bestWindow}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            c.safetyStatus === 'Güvenli' 
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
              : c.safetyStatus === 'Orta Dalgalı'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
              : 'bg-red-950/80 text-red-300 border border-red-800/60'
          }`}>
            {c.safetyStatus}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-300 group-hover:text-amber-300 transition">
          <span>12 Saatlik Tahmin</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showHourlySlider ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Saatlik Tahmin Genişletilmiş Paneli (Open-Meteo Hourly verisinden üretilir) */}
      {showHourlySlider && (
        <div className="mb-4 p-4 rounded-2xl bg-[#0f172a] border border-slate-800 animate-in fade-in duration-200 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <div className="text-xs font-semibold text-slate-200">
              12 Saatlik Kıyı Aktivite Pencereleri ({region.name})
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              Open-Meteo Saatlik Sayısal Model
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {c.hourlyForecast.map((h, i) => (
              <div 
                key={i}
                className={`p-2 rounded-xl text-center border transition ${
                  h.score >= 90 
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-300' 
                    : h.score >= 75 
                    ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400">{h.hour}</div>
                <div className="text-sm font-extrabold my-0.5">{h.score}</div>
                {typeof h.temp === 'number' && (
                  <div className="text-[10px] text-slate-300 font-mono">{Math.round(h.temp)}°C</div>
                )}
                {typeof h.windSpeed === 'number' && (
                  <div className="text-[9px] text-slate-400 font-mono">{h.windSpeed}k/s</div>
                )}
                <div className="text-[8.5px] truncate mt-0.5 text-slate-400">
                  {h.score >= 90 ? '★ Zirve' : h.score >= 75 ? 'Aktif' : 'Normal'}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[9.5px] text-slate-500 italic pt-1 border-t border-slate-800/60 leading-normal">
            * Sıcaklık, rüzgâr ve yağış değerleri Open-Meteo sayısal tahmin modelinden alınmaktadır; av skorları ise saat dilimi ve solunar döngüsüyle ağırlıklandırılmış teorik kural modelidir. Biyokütle veya canlı balık tespiti değildir.
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
            <span className="text-[9px] font-mono text-cyan-400">Model 2m</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {c.airTemp}°C
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            Open-Meteo NWP
          </div>
        </div>

        {/* 2. Deniz Sıcaklığı */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Deniz</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">Model L4</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {c.waterTemp}°C
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5" title={c.waterTempNote}>
            NASA / Copernicus
          </div>
        </div>

        {/* 3. Yağış */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>Yağış</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">Model</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            %{c.rainChance}
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            {c.precipitationMm > 0 ? `${c.precipitationMm} mm yağış` : 'Yağış beklenmiyor'}
          </div>
        </div>

        {/* 4. Dalga */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              <span>Dalga</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{c.wavePeriod}s</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {c.waveHeight} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5" title="Açık deniz dalga modelidir; kıyı sığlaşması/kırılması dahil değildir.">
            {c.waveSource === 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' ? 'Açık Deniz (Marine)' : c.waveSource}
          </div>
        </div>

        {/* 5. Rüzgar */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rüzgar</span>
            </div>
            <span className="text-[11px] font-bold text-slate-300 font-mono">{c.windDirection}</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {c.windSpeed} <span className="text-xs font-normal text-slate-400">km/s</span>
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            Open-Meteo 10m Modeli
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
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            Kıyı Sürüklenme Tahmini
          </div>
        </div>

        {/* 7. Bulut */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bulut</span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400">Model</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            %{c.cloudCoverage}
          </div>
          <div className="text-[9.5px] text-slate-500 truncate mt-0.5">
            Open-Meteo Bulutluluk
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
            İndirgenmiş Basınç (MSL)
          </div>
        </div>

        {/* 9. Ay */}
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
      <div className="mt-2.5 flex items-center justify-between text-[9.5px] text-slate-500 px-1">
        <span>Meteoroloji & Dalga: Open-Meteo Sayısal Tahmin Modelleri (NWP)</span>
        <span className="font-mono text-cyan-500/80">Kıyı Şamandıra Ölçümü Değildir</span>
      </div>
    </div>
  );
};
