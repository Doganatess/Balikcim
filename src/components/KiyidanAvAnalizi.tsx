import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Waves, 
  Wind, 
  Thermometer, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  Clock, 
  CheckCircle2, 
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import { PointClassificationResult, VerifiedCoastalSpot } from '../data/samsunOrduMapData';
import { BathymetryResult, fetchBathymetry } from '../services/bathymetryService';
import { CoastalAccessAssessment, assessCoastalAccess } from '../services/coastalAccessService';
import { LiveConditionsData } from '../services/openMeteoService';
import { FishSpecies } from '../data/fishData';
import { 
  SCIENTIFIC_FISH_DATABASE, 
  evaluateScientificFishingCondition, 
  ConditionEvaluationResult 
} from '../data/scientificFishData';

interface KiyidanAvAnaliziProps {
  coord: { lat: number; lng: number };
  selectedSpot: VerifiedCoastalSpot | null;
  geoAnalysis: PointClassificationResult;
  selectedFish: FishSpecies;
  liveConditions: LiveConditionsData | null;
}

export const KiyidanAvAnalizi: React.FC<KiyidanAvAnaliziProps> = ({
  coord,
  selectedSpot,
  geoAnalysis,
  selectedFish,
  liveConditions
}) => {
  const [bathymetry, setBathymetry] = useState<BathymetryResult | null>(null);
  const [isLoadingBathy, setIsLoadingBathy] = useState(false);
  const [selectedMetaModal, setSelectedMetaModal] = useState<{
    title: string;
    sourceName: string;
    sourceUrl: string;
    dataType: string;
    spatialResolution: string;
    dataDate: string;
    verificationStatus: 'DOGRULANDI' | 'KISMI' | 'DOGRULANAMADI';
    limitations: string[];
  } | null>(null);

  // Koordinat veya analiz bölgesi değiştikçe gerçek batimetriyi çek
  useEffect(() => {
    let isMounted = true;
    setIsLoadingBathy(true);

    fetchBathymetry(coord.lat, coord.lng, geoAnalysis.distanceToCoastKm, geoAnalysis.zoneType)
      .then((res) => {
        if (isMounted) {
          setBathymetry(res);
          setIsLoadingBathy(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingBathy(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [coord.lat, coord.lng, geoAnalysis.distanceToCoastKm, geoAnalysis.zoneType]);

  // OSM Kıyı erişim ve altyapı değerlendirmesi
  const coastalAccess: CoastalAccessAssessment = assessCoastalAccess(
    coord.lat,
    coord.lng,
    geoAnalysis.distanceToCoastKm,
    geoAnalysis.zoneType
  );

  // Bilimsel balık türü koşul değerlendirmesi (Yapay % yerine gerekçeli ekolojik analiz)
  const fishCondition: ConditionEvaluationResult = evaluateScientificFishingCondition(
    selectedFish.id,
    {
      airTemp: liveConditions?.airTemp ?? 15,
      waterTemp: liveConditions?.waterTemp ?? null,
      windSpeed: liveConditions?.windSpeed ?? 10,
      windDirection: liveConditions?.windDirection ?? 'K',
      waveHeight: liveConditions?.waveHeight ?? 0.5,
      precipitationMm: liveConditions?.precipitationMm ?? 0
    },
    geoAnalysis.zoneType
  );

  const scientificProfile = SCIENTIFIC_FISH_DATABASE[selectedFish.id] || SCIENTIFIC_FISH_DATABASE['levrek'];

  // Grid koordinatı ile hedef koordinat sapma kontrolü (Open-Meteo model hücresi)
  const marineGrid = liveConditions?.marineGridCoord;
  const weatherGrid = liveConditions?.weatherGridCoord;

  return (
    <div className="mt-4 rounded-3xl bg-[#09111e] border border-cyan-500/30 p-4 sm:p-5 shadow-2xl space-y-4 text-slate-200">
      
      {/* 1. Üst Başlık: Koordinat, Kıyı Çizgisi Mesafesi ve Coğrafi Sınıf */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>Bütünleşik Kıyıdan Av Analizi</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Gerçek Veri Analiz Motoru
              </span>
            </h3>
          </div>
          <div className="text-xs font-mono text-cyan-300 flex items-center gap-2 mt-1 flex-wrap">
            <span>📍 {coord.lat.toFixed(4)}°K, {coord.lng.toFixed(4)}°D</span>
            <span className="text-slate-500">•</span>
            {geoAnalysis.distanceToCoastKm !== null ? (
              <span className="text-slate-300">
                Kıyı çizgisine mesafe: <strong className="text-cyan-400">
                  {geoAnalysis.distanceToCoastKm >= 1 
                    ? `${geoAnalysis.distanceToCoastKm.toFixed(2)} km` 
                    : `${Math.round(geoAnalysis.distanceToCoastKm * 1000)} metre`}
                </strong>
              </span>
            ) : (
              <span className="text-slate-400">Kıyı mesafesi: Kapsam Dışı</span>
            )}
            {selectedSpot && (
              <span className="text-emerald-400 font-sans font-semibold">
                (Teyitli Kıyı Noktası: {selectedSpot.name})
              </span>
            )}
          </div>
        </div>

        {/* Coğrafi Sınıf Rozeti */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            geoAnalysis.zoneType === 'kiyi'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
              : geoAnalysis.zoneType === 'deniz'
              ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
              : geoAnalysis.zoneType === 'kara'
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
              : 'bg-slate-900 text-slate-300 border-slate-700'
          }`}>
            {geoAnalysis.zone}
          </span>
          <button
            onClick={() => setSelectedMetaModal({
              title: 'Kıyı Çizgisi & Kara/Deniz Geometrisi',
              sourceName: 'Samsun-Ordu Yüksek Çözünürlüklü Kıyı GeoJSON Poligonu',
              sourceUrl: 'https://www.openstreetmap.org/',
              dataType: 'Sayısal Arazi/Batimetri Modeli (DEM/DTM)',
              spatialResolution: 'Vektör Kıyı Çizgisi (~5-15 m hassasiyet)',
              dataDate: '2024 Doğrulanmış Kıyı Geometrisi',
              verificationStatus: 'DOGRULANDI',
              limitations: [
                'Kıyı çizgisi 450 metre tolerans bandı, amatör kıyı olta atış menzili eşiğidir.',
                'Falezli dik yamaçlarda geometrik olarak kıyıda olmak güvenli sahil inişi olduğunu garanti etmez.'
              ]
            })}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Kıyı Geometrisi Kaynağını İncele"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* 2. Grid: 3 Temel Sütun (Altyapı/Erişim, Derinlik/Zemin, Bilimsel Tür Durumu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* KART A: Kıyı Yapısı ve Fiziksel Erişim */}
        <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>⚓ Kıyı Yapısı & Fiziksel Erişim</span>
              </span>
              <button
                onClick={() => setSelectedMetaModal({
                  title: 'OpenStreetMap Kıyı Altyapı Verisi',
                  sourceName: coastalAccess.osmSourceInfo.source,
                  sourceUrl: coastalAccess.osmSourceInfo.url,
                  dataType: 'Sayısal Arazi/Batimetri Modeli (DEM/DTM)',
                  spatialResolution: 'Noktasal / Vektör Çizgi (OSM Way/Node)',
                  dataDate: coastalAccess.osmSourceInfo.verificationDate,
                  verificationStatus: coastalAccess.nearestFeature ? 'DOGRULANDI' : 'KISMI',
                  limitations: coastalAccess.osmSourceInfo.limitations
                })}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>Kaynak</span>
                <Info className="w-3 h-3" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5">
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] leading-relaxed">
                {coastalAccess.accessSummary}
              </div>

              {coastalAccess.nearestFeature && (
                <div className="text-[10px] space-y-1 pt-1">
                  <div>
                    <span className="text-slate-400">Erişim Tipi: </span>
                    <strong className="text-cyan-300">{coastalAccess.nearestFeature.accessStatus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Mevzuat: </span>
                    <span className="text-slate-300">{coastalAccess.nearestFeature.legalNotice}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-amber-300 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
            <span>{coastalAccess.groundSafetyWarning}</span>
          </div>
        </div>

        {/* KART B: Derinlik ve Deniz Tabanı (Batimetri) */}
        <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>🌊 Derinlik & Deniz Tabanı</span>
              </span>
              <button
                onClick={() => setSelectedMetaModal({
                  title: 'GEBCO & Open-Meteo Batimetri Modeli',
                  sourceName: bathymetry?.metadata.sourceName || 'GEBCO 2023 Grid / Open-Meteo DEM',
                  sourceUrl: bathymetry?.metadata.sourceUrl || 'https://www.gebco.net/',
                  dataType: bathymetry?.metadata.dataType || 'Sayısal Arazi/Batimetri Modeli (DEM/DTM)',
                  spatialResolution: bathymetry?.metadata.spatialResolution || '15 arc-sec (~450m)',
                  dataDate: bathymetry?.metadata.dataDate || '2023-2024',
                  verificationStatus: bathymetry?.metadata.verificationStatus || 'KISMI',
                  limitations: bathymetry?.metadata.limitations || [
                    'Kıyı kırılma bandında (<10m) çözünürlük düşüktür.',
                    'Dip yapısı jeolojik harita kaydına dayanır; sahada kontrol edilmelidir.'
                  ]
                })}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>Kaynak</span>
                <Info className="w-3 h-3" />
              </button>
            </div>

            {isLoadingBathy ? (
              <div className="text-xs text-cyan-400 py-4 flex items-center gap-2 justify-center">
                <span className="animate-spin">⏳</span>
                <span>Batimetri modeli sorgulanıyor...</span>
              </div>
            ) : (
              <div className="text-xs text-slate-300 space-y-1.5">
                <div className="flex items-baseline justify-between p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Modellenen Derinlik:</span>
                  <span className="text-sm font-mono font-bold text-cyan-300">
                    {bathymetry?.depthMeters !== null && bathymetry?.depthMeters !== undefined
                      ? `~${bathymetry.depthMeters} m`
                      : 'Kıyı Çözünürlüğü Sınırlı'}
                  </span>
                </div>

                <div className="text-[10.5px] text-slate-300 leading-snug">
                  {bathymetry?.depthNote}
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 text-[10.5px]">
                  <div className="text-slate-400 font-semibold mb-0.5">Dip Yapısı (Zemin):</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-200">{bathymetry?.seabedSubstrate}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {bathymetry?.substrateConfidence}
                    </span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1">
                    {bathymetry?.substrateNote}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 text-[9px] text-slate-500 pt-1.5 border-t border-slate-800/60 font-mono">
            * Sayısal model çözünürlüğü: ~450m (Sığ kıyıda yerel iskandil ölçümü gereklidir).
          </div>
        </div>

        {/* KART C: Hedef Tür ve Bilimsel Koşul Değerlendirmesi */}
        <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>🐟 {selectedFish.name} Bilimsel Analiz</span>
              </span>
              <button
                onClick={() => setSelectedMetaModal({
                  title: `${selectedFish.name} Bilimsel Profili & Tebliğ 5/2`,
                  sourceName: 'FishBase & T.C. Tarım ve Orman Bakanlığı 5/2 Tebliğ',
                  sourceUrl: scientificProfile.scientificReferences[0]?.url || 'https://www.fishbase.se',
                  dataType: 'Sayısal Arazi/Batimetri Modeli (DEM/DTM)',
                  spatialResolution: 'Akademik Taksonomi & Oşinografik Literatür',
                  dataDate: '2024 Güncel',
                  verificationStatus: 'DOGRULANDI',
                  limitations: [
                    'Biyokütle veya sonar garantisi değildir; türün su sıcaklığı ve dalga toleransı rehberidir.',
                    'Yasal asgari boy ve adet sınırlamalarına uymak zorunludur.'
                  ]
                })}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>Kaynak</span>
                <Info className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Koşul Değerlendirme Rozeti */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  fishCondition.badgeTone === 'emerald'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                    : fishCondition.badgeTone === 'amber'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                    : 'bg-red-950 text-red-300 border-red-500/50'
                }`}>
                  {fishCondition.rating}
                </span>
                <span className="text-[10px] text-slate-400 italic">
                  {scientificProfile.scientificName}
                </span>
              </div>

              {/* Gerekçeli Açıklama */}
              <p className="text-[11px] text-slate-300 leading-relaxed p-2 rounded-lg bg-slate-900/90 border border-slate-800">
                {fishCondition.scientificJustification}
              </p>

              {/* Yasal Mevzuat ve Asgari Boy Kuralı */}
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px]">
                <strong className="text-amber-300 block mb-0.5">Yasal Asgari Boy & Tebliğ 5/2:</strong>
                <span className="text-slate-300">{fishCondition.regulatoryNotice}</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[9px] text-slate-500 pt-1.5 border-t border-slate-800/60 font-mono">
            * FishBase trofik seviyesi: {scientificProfile.trophicLevel} · {scientificProfile.blackSeaSeasonality}
          </div>
        </div>

      </div>

      {/* 3. Canlı Meteorolojik & Oşinografik Model Doğrulaması (Grid Koordinatları ve Birimler) */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open-Meteo Atmosferik & Deniz Modeli Doğrulama Bilgileri</span>
          </span>
          <button
            onClick={() => setSelectedMetaModal({
              title: 'Open-Meteo Weather & Marine API Entegrasyonu',
              sourceName: 'Open-Meteo European/Global Sayısal Hava & Marine Dalga Modeli',
              sourceUrl: 'https://open-meteo.com/en/docs',
              dataType: 'Sayısal Arazi/Batimetri Modeli (DEM/DTM)',
              spatialResolution: '~2-11 km atmosferik grid / ~5-8 km Copernicus Marine grid',
              dataDate: liveConditions?.modelTime || 'Güncel Saatlik Döngü',
              verificationStatus: liveConditions?.hasValidMarineData ? 'DOGRULANDI' : 'KISMI',
              limitations: [
                'Açık deniz hidrodinamik modelleri sahil bandındaki mikroklima, dalga kırılması ve mendirek sekmesini birebir yansıtmaz.',
                'Yerinde fiziksel kıyı ölçüm şamandırası olmayıp sayısal tahmin çıktısıdır.'
              ]
            })}
            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Model Doğrulama Kartı</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Hedef Koordinat:</span>
            <span className="font-mono text-cyan-300 font-bold">{coord.lat.toFixed(3)}°K, {coord.lng.toFixed(3)}°D</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Hava Model Grid Hücresi:</span>
            <span className="font-mono text-slate-200 font-bold">
              {weatherGrid ? `${weatherGrid.lat.toFixed(3)}°K, ${weatherGrid.lng.toFixed(3)}°D` : 'Teyitsiz'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Marine Model Grid Hücresi:</span>
            <span className="font-mono text-slate-200 font-bold">
              {marineGrid ? `${marineGrid.lat.toFixed(3)}°K, ${marineGrid.lng.toFixed(3)}°D (Deniz)` : 'Karasal Grid'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block text-[9.5px]">Dalga Veri Kaynağı:</span>
            <span className={`font-bold block truncate ${
              liveConditions?.waveSource.includes('Marine') ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {liveConditions?.waveSource || 'Referans Model'}
            </span>
          </div>
        </div>

        {/* Dalga ve Rüzgâr Detay Bileşenleri */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800/80 text-[10.5px] text-slate-300">
          <div>
            <span>Belirgin Dalga (Hm0): </span>
            <strong className="text-cyan-400 font-mono">{liveConditions?.waveHeight ?? '--'} m</strong>
            {liveConditions?.windWaveHeight !== null && liveConditions?.windWaveHeight !== undefined && (
              <span className="text-slate-400 ml-1.5">
                (Rüzgâr Dalgası: <span className="text-slate-200 font-mono">{liveConditions.windWaveHeight} m</span>)
              </span>
            )}
            {liveConditions?.swellWaveHeight !== null && liveConditions?.swellWaveHeight !== undefined && (
              <span className="text-slate-400 ml-1.5">
                (Ölü Dalga/Swell: <span className="text-slate-200 font-mono">{liveConditions.swellWaveHeight} m</span>)
              </span>
            )}
          </div>

          <div>
            <span>Rüzgâr: </span>
            <strong className="text-cyan-400 font-mono">
              {liveConditions?.windSpeed ?? '--'} km/sa {liveConditions?.windDirection ?? ''}
            </strong>
            {liveConditions?.windGusts !== null && liveConditions?.windGusts !== undefined && (
              <span className="text-amber-400 font-mono ml-1">
                (Hamle: {liveConditions.windGusts} km/sa)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Veri Doğrulama ve Kaynaklar Modal Çekmecesi */}
      {selectedMetaModal && (
        <div 
          onClick={() => setSelectedMetaModal(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0e1728] border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-3.5 text-xs text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-sm">{selectedMetaModal.title}</h4>
              </div>
              <button
                onClick={() => setSelectedMetaModal(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Veri Kaynağı & URL:</span>
                <a
                  href={selectedMetaModal.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-semibold flex items-center gap-1 mt-0.5"
                >
                  <span>{selectedMetaModal.sourceName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9.5px]">Veri Tipi:</span>
                  <span className="font-bold text-slate-200">{selectedMetaModal.dataType}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9.5px]">Mekânsal Çözünürlük:</span>
                  <span className="font-bold text-slate-200">{selectedMetaModal.spatialResolution}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9.5px]">Veri Tarihi:</span>
                  <span className="font-bold text-slate-200">{selectedMetaModal.dataDate}</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[9.5px]">Doğrulama Durumu:</span>
                  <span className={`font-bold ${
                    selectedMetaModal.verificationStatus === 'DOGRULANDI'
                      ? 'text-emerald-400'
                      : selectedMetaModal.verificationStatus === 'KISMI'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}>
                    {selectedMetaModal.verificationStatus}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1">
                <span className="font-bold text-amber-300 block text-[10.5px]">Sınırlamalar ve Belirsizlikler:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[10px]">
                  {selectedMetaModal.limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedMetaModal(null)}
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition text-xs"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
