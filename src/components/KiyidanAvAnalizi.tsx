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
  AlertCircle,
  Database,
  Search,
  Anchor
} from 'lucide-react';
import { PointClassificationResult, VerifiedCoastalSpot } from '../data/samsunOrduMapData';
import { BathymetryResult, fetchBathymetry } from '../services/bathymetryService';
import { 
  CoastalAccessAssessment, 
  assessCoastalAccess, 
  assessCoastalAccessLive 
} from '../services/coastalAccessService';
import { 
  RegionalObservationResult, 
  querySpeciesObservations 
} from '../services/emodnetBiologyService';
import { 
  COPERNICUS_BLACK_SEA_PRODUCTS, 
  getCopernicusMarineAuditInfo 
} from '../services/copernicusMarineService';
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

  // Canlı OSM Overpass kıyı erişim değerlendirmesi
  const [coastalAccess, setCoastalAccess] = useState<CoastalAccessAssessment>(() =>
    assessCoastalAccess(coord.lat, coord.lng, geoAnalysis.distanceToCoastKm, geoAnalysis.zoneType)
  );
  const [isLoadingOverpass, setIsLoadingOverpass] = useState(false);

  // EMODnet Biology & OBIS bölgesel saha gözlemleri
  const [speciesObs, setSpeciesObs] = useState<RegionalObservationResult | null>(null);
  const [isLoadingObs, setIsLoadingObs] = useState(false);

  // Bilgi / Kaynak Modalı
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

  // Copernicus Marine Audit Modalı
  const [showCopernicusModal, setShowCopernicusModal] = useState(false);

  // 1. Koordinat değiştikçe gerçek EMODnet Bathymetry REST API sorgusu
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

  // 2. Canlı Overpass API Kıyı Erişim Sorgusu (sessionStorage önbellek destekli)
  useEffect(() => {
    let isMounted = true;
    setIsLoadingOverpass(true);

    assessCoastalAccessLive(coord.lat, coord.lng, geoAnalysis.distanceToCoastKm, geoAnalysis.zoneType)
      .then((res) => {
        if (isMounted) {
          setCoastalAccess(res);
          setIsLoadingOverpass(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingOverpass(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [coord.lat, coord.lng, geoAnalysis.distanceToCoastKm, geoAnalysis.zoneType]);

  // 3. EMODnet Biology / OBIS Bölgesel Saha Gözlem Sorgusu
  useEffect(() => {
    let isMounted = true;
    setIsLoadingObs(true);

    querySpeciesObservations(selectedFish.latinName, coord.lat, coord.lng)
      .then((res) => {
        if (isMounted) {
          setSpeciesObs(res);
          setIsLoadingObs(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoadingObs(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedFish.latinName, coord.lat, coord.lng]);

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
                Gerçek API & Doğrulanmış Kaynaklar
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
              dataType: 'Vektör Kıyı Çizgisi ve Poligon Sınırı',
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

      {/* 2. Grid: 3 Temel Sütun (Altyapı/Erişim, Derinlik/Zemin, Bilimsel Tür Durumu & OBIS Gözlemleri) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* KART A: Kıyı Yapısı ve Fiziksel Erişim (OpenStreetMap Overpass API) */}
        <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>⚓ Kıyı Yapısı & Fiziksel Erişim</span>
                {isLoadingOverpass && <span className="text-[10px] text-cyan-400 animate-spin">⏳</span>}
              </span>
              <button
                onClick={() => setSelectedMetaModal({
                  title: coastalAccess.isFromLiveOverpass ? 'OpenStreetMap Canlı Overpass API' : 'OpenStreetMap Kıyı Altyapı Ağı',
                  sourceName: coastalAccess.osmSourceInfo.source,
                  sourceUrl: coastalAccess.osmSourceInfo.url,
                  dataType: 'Vektör Kıyı Yapıları (Mendirek, İskele, Liman)',
                  spatialResolution: 'Noktasal / Vektör Çizgi (OSM Way/Node)',
                  dataDate: coastalAccess.osmSourceInfo.verificationDate,
                  verificationStatus: coastalAccess.isFromLiveOverpass || coastalAccess.nearestFeature ? 'DOGRULANDI' : 'KISMI',
                  limitations: coastalAccess.osmSourceInfo.limitations
                })}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>{coastalAccess.isFromLiveOverpass ? 'Canlı Overpass' : 'Kaynak'}</span>
                <Info className="w-3 h-3" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5">
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] leading-relaxed">
                {coastalAccess.accessSummary}
              </div>

              {coastalAccess.nearestFeature ? (
                <div className="text-[10px] space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Erişim Tipi: </span>
                    <strong className="text-cyan-300">{coastalAccess.nearestFeature.accessStatus}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Mevzuat: </span>
                    <span className="text-slate-300">{coastalAccess.nearestFeature.legalNotice}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-mono">
                    <span>OSM ID: {coastalAccess.nearestFeature.osmId}</span>
                    <a 
                      href={coastalAccess.nearestFeature.osmUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>İncele</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 italic pt-1">
                  1.2 km yarıçap içinde haritalanmış büyük liman/mendirek kaydı bulunamadı. (Kayıt bulunmaması yapının kesinlikle bulunmadığı anlamına gelmez; haritalanmamış olabilir.)
                </div>
              )}
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-amber-300 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
            <span>{coastalAccess.groundSafetyWarning}</span>
          </div>
        </div>

        {/* KART B: Derinlik ve Deniz Tabanı (EMODnet Bathymetry REST API) */}
        <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>🌊 Derinlik & Deniz Tabanı</span>
                {isLoadingBathy && <span className="text-[10px] text-cyan-400 animate-spin">⏳</span>}
              </span>
              <button
                onClick={() => setSelectedMetaModal({
                  title: 'EMODnet Bathymetry & GEBCO Sayısal Derinlik Modeli',
                  sourceName: bathymetry?.metadata.sourceName || 'EMODnet Bathymetry REST API / GEBCO 2024 DTM',
                  sourceUrl: bathymetry?.metadata.sourceUrl || 'https://rest.emodnet-bathymetry.eu/',
                  dataType: bathymetry?.metadata.dataType || 'Sayısal Arazi/Batimetri Modeli (DEM/DTM)',
                  spatialResolution: bathymetry?.metadata.spatialResolution || '1/16 arc-minute (~115m x 125m)',
                  dataDate: bathymetry?.metadata.dataDate || '2024 Resmî DTM',
                  verificationStatus: bathymetry?.metadata.verificationStatus || 'DOGRULANDI',
                  limitations: bathymetry?.metadata.limitations || [
                    'Sığ kıyı bandında (<10m) dalga kırılması ve kıyı sedimantasyonu nedeniyle yerel derinlik değişebilir.',
                    'Dip yapısı Karadeniz bölgesel jeolojik haritalarına dayanır; yerinde iskandil kontrolü önerilir.'
                  ]
                })}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>{bathymetry?.isFromEmodnetRest ? 'EMODnet REST' : 'Kaynak'}</span>
                <Info className="w-3 h-3" />
              </button>
            </div>

            {isLoadingBathy ? (
              <div className="text-xs text-cyan-400 py-4 flex items-center gap-2 justify-center">
                <span className="animate-spin">⏳</span>
                <span>EMODnet Bathymetry REST servisi sorgulanıyor...</span>
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

          <div className="mt-2 text-[9px] text-slate-500 pt-1.5 border-t border-slate-800/60 font-mono flex items-center justify-between">
            <span>DTM: {bathymetry?.emodnetReference?.identifier || 'GEBCO2024 / EMODnet'}</span>
            <span className="text-cyan-400">{bathymetry?.metadata.spatialResolution || '1/16 arc-min'}</span>
          </div>
        </div>

        {/* KART C: Hedef Tür ve EMODnet Biology / OBIS Saha Gözlemleri */}
        <div className="p-3.5 rounded-2xl bg-[#0e1726] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <span>🐟 {selectedFish.name} Biyolojik Analiz</span>
              </span>
              <button
                onClick={() => setSelectedMetaModal({
                  title: `${selectedFish.name} — Biyolojik Rehber & EMODnet Biology`,
                  sourceName: 'FishBase & EMODnet Biology / OBIS (api.obis.org)',
                  sourceUrl: scientificProfile.scientificReferences[0]?.url || 'https://www.fishbase.se',
                  dataType: 'Bilimsel Taksonomi ve Bölgesel Biyolojik Saha Kayıtları',
                  spatialResolution: 'Karadeniz Havzası (27°D–42°D, 40°K–47°K) Biyolojik Gözlemleri',
                  dataDate: '2024 Güncel',
                  verificationStatus: speciesObs?.hasLocalRecords ? 'DOGRULANDI' : 'KISMI',
                  limitations: [
                    'Biyokütle veya sonar garantisi değildir; türün su sıcaklığı ve dalga toleransı rehberidir.',
                    'Bölgede teyitli kayıt bulunamaması türün orada olmadığını değil, bilimsel trolleme/sefer örneği bulunmadığını gösterir.'
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

              {/* EMODnet Biology / OBIS Saha Gözlemleri Paneli */}
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-[10px] space-y-1">
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    <span>EMODnet Bio / OBIS Gözlemleri:</span>
                  </span>
                  {isLoadingObs && <span className="animate-spin text-[9px]">⏳</span>}
                </div>

                {isLoadingObs ? (
                  <span className="text-slate-400 italic">OBIS omurga veri tabanı sorgulanıyor...</span>
                ) : speciesObs?.hasLocalRecords ? (
                  <div className="space-y-0.5 text-slate-300">
                    <div>
                      <span>Havza Kaydı: </span>
                      <strong className="text-emerald-300">{speciesObs.totalRecordsCount} doğrulanmış örnek</strong>
                      {speciesObs.nearestObservationDistanceKm !== null && (
                        <span className="text-slate-400 ml-1">
                          (En yakın: ~{speciesObs.nearestObservationDistanceKm} km)
                        </span>
                      )}
                    </div>
                    {speciesObs.localRecords[0] && (
                      <div className="text-[9px] text-slate-400 truncate">
                        <span>Veri Seti: </span>
                        <span className="text-slate-300">{speciesObs.localRecords[0].datasetName}</span>
                        {speciesObs.localRecords[0].year && (
                          <span className="text-slate-500"> ({speciesObs.localRecords[0].year})</span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[9.5px] text-slate-400 leading-tight">
                    {speciesObs?.scientificDataNotice || 'Bölgede doğrudan teyitli gözlem kaydı bulunamadı (Genel biyolojik rehber geçerlidir).'}
                  </div>
                )}
              </div>

              {/* Yasal Mevzuat ve Asgari Boy Kuralı */}
              <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/60 text-[9.5px]">
                <strong className="text-amber-300">Tebliğ 5/2: </strong>
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
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCopernicusModal(true)}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60"
            >
              <span>Copernicus Marine Servisi</span>
              <Layers className="w-3 h-3" />
            </button>

            <button
              onClick={() => setSelectedMetaModal({
                title: 'Open-Meteo Weather & Marine API Entegrasyonu',
                sourceName: 'Open-Meteo European/Global Sayısal Hava & Marine Dalga Modeli',
                sourceUrl: 'https://open-meteo.com/en/docs',
                dataType: 'Atmosferik ve Oşinografik Sayısal Tahmin Modeli',
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
              <span>Model Kartı</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
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

      {/* 4. Copernicus Marine Servis İnceleme Modalı */}
      {showCopernicusModal && (
        <div 
          onClick={() => setShowCopernicusModal(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-[#0e1728] border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4 text-xs text-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-bold text-white text-sm">Copernicus Marine (CMEMS) Servis Denetimi</h4>
                  <span className="text-[10px] text-slate-400">Karadeniz Oşinografi Ürünleri ve Güvenli Veri Akışı</span>
                </div>
              </div>
              <button
                onClick={() => setShowCopernicusModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 space-y-1 text-[11px] leading-relaxed">
              <span className="font-bold text-blue-300 block">Doğrudan CMEMS API ve Kimlik Denetimi Şeffaflığı:</span>
              <p className="text-slate-300">
                Resmî Copernicus Marine Veri Mağazası (<code>data.marine.copernicus.eu</code>) doğrudan Subsetter / STAC NetCDF indirme uç noktaları için CMEMS kullanıcı adı ve CAS Token kimlik doğrulaması gerektirir. Güvenlik ilkeleri uyarınca tarayıcı istemcisine hiçbir özel anahtar veya şifre gömülmez.
              </p>
              <p className="text-emerald-300 pt-1">
                ✓ Karadeniz fiziksel hidrodinamik ve dalga modelleri kamuya açık Open-Meteo Marine API köprüsü üzerinden; yüksek çözünürlüklü deniz yüzeyi sıcaklık analizi (GHRSST L4) ise NASA GIBS açık WMTS harita katmanı üzerinden gerçek zamanlı beslenmektedir.
              </p>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-200 text-xs">Karadeniz İçin Tanımlı Resmî CMEMS Ürünleri:</h5>
              
              {Object.entries(COPERNICUS_BLACK_SEA_PRODUCTS).map(([key, prod]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-[10.5px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 font-mono">{prod.productId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[9.5px]">
                      Çözünürlük: {prod.spatialResolution}
                    </span>
                  </div>
                  <div className="text-white font-medium">{prod.title}</div>
                  <div className="text-slate-400">Sağlayıcı: {prod.provider}</div>
                  <div className="text-slate-300">
                    <strong className="text-slate-400">Değişkenler:</strong> {prod.variables.join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span>Erişim Yolu: <span className="text-emerald-300 font-medium">{prod.publicBridgeUsed}</span></span>
                    <a 
                      href={prod.catalogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Resmî Katalog</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCopernicusModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition text-xs"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* 5. Genel Veri Doğrulama ve Kaynaklar Modal Çekmecesi */}
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
