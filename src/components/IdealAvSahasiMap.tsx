import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { 
  Crosshair, 
  ChevronDown, 
  Compass, 
  Maximize2, 
  MapPin, 
  X, 
  AlertCircle, 
  Info, 
  RotateCcw,
  Layers,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { Region } from '../data/regionsData';
import { FishSpecies, FISH_CATALOG } from '../data/fishData';
import { 
  VERIFIED_COASTAL_SPOTS, 
  VerifiedCoastalSpot, 
  SAMSUN_ORDU_BOUNDS, 
  SAMSUN_ORDU_CENTER,
  classifyPointGeography,
  PointClassificationResult
} from '../data/samsunOrduMapData';

interface IdealAvSahasiMapProps {
  region: Region;
  selectedFish: FishSpecies;
  onSelectFish: (fish: FishSpecies) => void;
}

export const IdealAvSahasiMap: React.FC<IdealAvSahasiMapProps> = ({
  region,
  selectedFish,
  onSelectFish
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const spotsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [fishDropdownOpen, setFishDropdownOpen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTileLayer, setActiveTileLayer] = useState<'osm' | 'dark'>('dark');

  // Currently selected point (either a verified spot or tapped coordinate)
  // Default to Ünye Liman Mendireği (well-documented geographic feature)
  const [selectedCoord, setSelectedCoord] = useState<{ lat: number; lng: number }>({
    lat: 41.1345,
    lng: 37.2885
  });

  const [selectedSpot, setSelectedSpot] = useState<VerifiedCoastalSpot | null>(
    VERIFIED_COASTAL_SPOTS.find(s => s.id === 'unye-liman-mendirek') || VERIFIED_COASTAL_SPOTS[4]
  );

  const [activeQuickTab, setActiveQuickTab] = useState<'mera' | 'saat' | 'yem' | 'olta' | null>(null);

  // 1. Initial Leaflet Map Setup (Runs ONCE on mount)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    try {
      const map = L.map(mapContainerRef.current, {
        center: SAMSUN_ORDU_CENTER,
        zoom: 10,
        minZoom: 8,
        maxZoom: 18,
        maxBounds: [
          [40.50, 35.70], // Hard limits around Samsun-Ordu coastal sector
          [41.80, 38.60]
        ],
        zoomControl: false,
        attributionControl: true
      });

      // Zoom control in top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Create initial Tile Layer
      const initialTileUrl = activeTileLayer === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(initialTileUrl, {
        attribution: activeTileLayer === 'dark'
          ? '&copy; <a href="https://carto.com/" target="_blank">CARTO</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Katkıda Bulunanlar',
        maxZoom: 19
      });
      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      // Fit to Samsun-Ordu coastal frame
      map.fitBounds(SAMSUN_ORDU_BOUNDS, {
        padding: [20, 20],
        maxZoom: 11
      });

      // Layer group for spot markers
      const spotsGroup = L.layerGroup().addTo(map);
      spotsLayerGroupRef.current = spotsGroup;

      // Add spot markers
      VERIFIED_COASTAL_SPOTS.forEach((spot) => {
        const isLiman = spot.locationType.includes('Mendirek') || spot.locationType.includes('Liman');
        const isKaya = spot.locationType.includes('Kayalık');
        const isUnverified = spot.verificationStatus === 'KONUMU_KONTROL_EDILMELI';
        
        const iconColor = isUnverified 
          ? '#eab308' 
          : isLiman 
          ? '#06b6d4' 
          : isKaya 
          ? '#f59e0b' 
          : '#10b981';

        const iconEmoji = isLiman ? '⚓' : isKaya ? '🪨' : '🏖️';

        const spotIcon = L.divIcon({
          className: 'custom-spot-marker',
          html: `
            <div style="
              background: #091220;
              border: 2px solid ${iconColor};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 3px 10px rgba(0,0,0,0.8);
              cursor: pointer;
              font-size: 13px;
              transform: translate(-15px, -15px);
            ">
              ${iconEmoji}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: spotIcon });
        
        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedCoord({ lat: spot.lat, lng: spot.lng });
          setSelectedSpot(spot);
          map.panTo([spot.lat, spot.lng], { animate: true });
        });

        // Informative popup
        marker.bindPopup(`
          <div style="font-size: 12px; line-height: 1.45; font-family: system-ui, sans-serif;">
            <div style="font-weight: 700; color: #38bdf8;">${spot.name}</div>
            <div style="color: #94a3b8; font-size: 11px;">${spot.city} (${spot.district})</div>
            <div style="margin-top: 3px; font-weight: 600; color: ${iconColor}; font-size: 11px;">
              ${spot.verificationBadge}
            </div>
            <div style="font-size: 10px; color: #cbd5e1; margin-top: 2px;">
              Tür: ${spot.locationType}
            </div>
          </div>
        `);

        marker.addTo(spotsGroup);
      });

      // Target selection Pin marker
      const initialPinIcon = createPinIcon();
      const targetMarker = L.marker([selectedCoord.lat, selectedCoord.lng], { 
        icon: initialPinIcon,
        zIndexOffset: 1000 
      }).addTo(map);
      selectedMarkerRef.current = targetMarker;

      // Click on any free area on map: Updates coordinates and CLEARS previous spot
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        // Strictly sync state: red pin, panel coordinates and clear previous spot
        setSelectedCoord({ lat, lng });
        setSelectedSpot(null); // Clear previous spot name!
      });

      mapInstanceRef.current = map;
    } catch (err: any) {
      console.error('Leaflet initialization error:', err);
      setMapError('Harita bileşeni yüklenemedi. Lütfen internet bağlantınızı kontrol edip sayfayı yenileyiniz.');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Dynamic Tile Layer Switcher: Swaps layer WITHOUT restarting map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layer cleanly
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    const tileUrl = activeTileLayer === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = activeTileLayer === 'dark'
      ? '&copy; <a href="https://carto.com/" target="_blank">CARTO</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Katkıda Bulunanlar';

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19
    });

    newTileLayer.addTo(map);
    // Send tile layer to back so spot markers and pin stay on top
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [activeTileLayer]);

  // 3. Move target pin seamlessly when selectedCoord changes
  useEffect(() => {
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setLatLng([selectedCoord.lat, selectedCoord.lng]);
    }
  }, [selectedCoord]);

  // 4. Mobile resize & visibility watcher (handles tab switches & viewport adjustments)
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(handleResize, 200);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [isFullscreen]);

  // Helper for red target pin icon
  function createPinIcon(): L.DivIcon {
    return L.divIcon({
      className: 'custom-target-pin',
      html: `
        <div style="
          position: relative;
          transform: translate(-14px, -30px);
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        ">
          <div style="
            background: #dc2626;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(220, 38, 38, 0.7);
            border: 2px solid #ffffff;
          ">
            <span style="transform: rotate(45deg); font-size: 12px; font-weight: 800;">📍</span>
          </div>
          <div style="
            width: 8px;
            height: 4px;
            background: rgba(0,0,0,0.6);
            border-radius: 50%;
            margin-top: 2px;
          "></div>
        </div>
      `,
      iconSize: [28, 30],
      iconAnchor: [14, 30]
    });
  }

  // Handle map reset view
  const handleResetView = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(SAMSUN_ORDU_BOUNDS, {
        padding: [20, 20],
        maxZoom: 11
      });
    }
  }, []);

  // Compute coastline classification for currently selected coordinate
  const geoAnalysis: PointClassificationResult = classifyPointGeography(selectedCoord.lat, selectedCoord.lng);

  return (
    <div id="av-sahasi" className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-4">
      
      {/* Header: Samsun – Ordu Kıyı Haritası · [Hedef Balık ▾] */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Samsun – Ordu Kıyı Haritası
          </h2>
          <span className="text-slate-500 font-light hidden sm:inline">·</span>
          
          {/* Target Fish Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setFishDropdownOpen(!fishDropdownOpen)}
              className="flex items-center gap-1 text-sm sm:text-base font-bold text-cyan-400 hover:text-cyan-300 transition"
              aria-label="Hedef Balık Seçimi"
            >
              <span>{selectedFish.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${fishDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {fishDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#0e1626] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Hedef Balık Değiştir
                </div>
                {FISH_CATALOG.map((fish) => (
                  <button
                    key={fish.id}
                    onClick={() => {
                      onSelectFish(fish);
                      setFishDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800 transition my-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{fish.emoji}</span>
                      <div>
                        <div className="font-bold text-slate-200">{fish.name}</div>
                        <div className="text-[10px] text-slate-400">{fish.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-400">%{fish.currentScore}</div>
                      <div className="text-[9px] text-slate-500">Model skoru</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Region Scope Tag */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full shrink-0">
          <span>Karadeniz Kıyı Hattı</span>
        </div>
      </div>

      {/* Real Interactive Leaflet Map Container */}
      <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#091524] ${
        isFullscreen ? 'fixed inset-3 z-50 max-w-none h-[calc(100vh-1.5rem)]' : 'h-[330px] sm:h-[390px]'
      }`}>
        
        {/* Leaflet Mount Target */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-10"
          style={{ touchAction: 'pan-x pan-y' }}
        />

        {/* Fallback error if map fails to load */}
        {mapError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#091524] text-center">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <h3 className="text-sm font-bold text-white mb-1">Harita Yüklenemedi</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-3">{mapError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-bold"
            >
              Yeniden Dene
            </button>
          </div>
        )}

        {/* Map Top-Left Quick Actions */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
          <button
            onClick={handleResetView}
            className="px-2.5 py-1.5 rounded-full bg-slate-900/95 text-slate-200 border border-slate-700 hover:border-cyan-400 text-[11px] font-semibold flex items-center gap-1 shadow-md backdrop-blur-md transition"
            title="Samsun - Ordu Genel Görünüme Sıfırla"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Samsun–Ordu</span>
          </button>

          {/* Layer switcher button with visual indicator of current layer */}
          <button
            onClick={() => setActiveTileLayer(prev => prev === 'dark' ? 'osm' : 'dark')}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-md border transition ${
              activeTileLayer === 'osm'
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500'
                : 'bg-slate-900/95 text-slate-200 border-slate-700 hover:border-cyan-400'
            }`}
            title="Harita Altlığını Değiştir (OSM / CartoDB)"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeTileLayer === 'dark' ? 'CartoDB' : 'Standart OSM'}</span>
          </button>
        </div>

        {/* Map Top-Right: Fullscreen Toggle */}
        <div className="absolute top-3 right-12 z-20">
          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
              }, 150);
            }}
            className="w-8 h-8 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700 flex items-center justify-center shadow-md backdrop-blur-md hover:text-white transition"
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Haritayı Büyüt'}
          >
            {isFullscreen ? <X className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Interactive Instruction Pill in Center-Top (Mobile & Desktop) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
          <div className="px-3 py-1 rounded-full bg-slate-950/90 border border-slate-800 text-[10px] text-slate-300 backdrop-blur-md">
            👆 Kıyı noktasına dokunarak koordinat seçebilir veya avlak simgelerine tıklayabilirsiniz
          </div>
        </div>

        {/* Map Bottom Legend Pill */}
        <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-2 text-[10px] text-slate-300 bg-slate-950/90 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-md">
          <span className="flex items-center gap-1">⚓ <strong className="text-cyan-400 font-medium">Mendirek</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">🪨 <strong className="text-amber-400 font-medium">Kayalık</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">🏖️ <strong className="text-emerald-400 font-medium">Kumsal</strong></span>
        </div>

        {/* Bottom-Right Honest Safety Status Indicator (Replaced unconditional "Güvenli" badge) */}
        <div className="absolute bottom-2.5 right-3 z-20">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/95 text-amber-300 font-medium text-[10px] shadow-md border border-amber-500/40 backdrop-blur-md">
            <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Güvenlik: Canlı veri yok (Sahada kontrol ediniz)</span>
            <span className="sm:hidden">Güvenlik: Teyitsiz</span>
          </div>
        </div>
      </div>

      {/* Selected Coordinate & Coastal Analysis Panel */}
      <div className="mt-3.5 p-4 rounded-2xl bg-[#0e1626] border border-cyan-500/30 shadow-xl space-y-3">
        
        {/* Top Header of Analysis Panel */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 text-xs shrink-0">
              📍
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                <span className="truncate">
                  {selectedSpot ? selectedSpot.name : 'Haritada Seçilen Koordinat'}
                </span>

                {/* Spot Verification Badge or Coordinate Pill */}
                {selectedSpot ? (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    selectedSpot.verificationStatus === 'DOGRULANMIS_KIYI_YAPISI'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : selectedSpot.verificationStatus === 'COGRAFI_REFERANS_NOKTASI'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {selectedSpot.verificationBadge}
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold">
                    Serbest Seçim Noktası
                  </span>
                )}
              </div>

              {/* Exact Synchronized Coordinate Display */}
              <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-2 mt-0.5">
                <span>{selectedCoord.lat.toFixed(4)}° N, {selectedCoord.lng.toFixed(4)}° E</span>
                {geoAnalysis.distanceToCoastKm !== null && (
                  <span className="text-[10px] text-slate-400">
                    (Kıyıya ~{geoAnalysis.distanceToCoastKm >= 1 ? `${geoAnalysis.distanceToCoastKm} km` : `${Math.round(geoAnalysis.distanceToCoastKm * 1000)} m`})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Geographic Zone Classification Badge */}
          <div className="text-right shrink-0">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
              geoAnalysis.zoneType === 'kiyi'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : geoAnalysis.zoneType === 'deniz'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : geoAnalysis.zoneType === 'kara'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {geoAnalysis.zone}
            </span>
          </div>
        </div>

        {/* Verification Note (if a spot is selected) or Nearest Reference Point (if free tapped point) */}
        {selectedSpot ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="text-slate-400 text-[10px] font-semibold mb-0.5">Avlak Doğrulama Durumu:</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{selectedSpot.verificationNote}</p>
            {selectedSpot.cautions && (
              <p className="text-amber-400/90 text-[10px] mt-1 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                <span>{selectedSpot.cautions}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="text-slate-400 text-[10px] font-semibold mb-0.5">Konum Analizi & Referans:</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{geoAnalysis.description}</p>
            {geoAnalysis.nearestSpot && geoAnalysis.distanceToNearestSpotKm !== null && (
              <p className="text-cyan-400 text-[10px] mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>En yakın kayıtlı nokta: <strong>{geoAnalysis.nearestSpot.name}</strong> (~{geoAnalysis.distanceToNearestSpotKm} km)</span>
              </p>
            )}
          </div>
        )}

        {/* Detailed Structure Grid & Bathymetry Warning */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          
          {/* Kıyı Yapısı & Coğrafi Veri */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-semibold">Kıyı Yapısı / Zemin:</span>
            <div className="font-bold text-slate-200">
              {selectedSpot ? selectedSpot.locationType : (geoAnalysis.zoneType === 'kiyi' ? 'Karadeniz Kıyı Bandı' : geoAnalysis.zone)}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {selectedSpot ? selectedSpot.verifiedGeoFeature : geoAnalysis.dataNotice}
            </div>
          </div>

          {/* Derinlik / Batimetri & Atış Mesafesi Dürüstlüğü */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-semibold">Batimetri (Derinlik) & Atış Analizi:</span>
            <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Resmi batimetri / derinlik sensörü bulunmamaktadır</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Ölçülmüş sualtı derinlik haritası olmadan atış mesafesi önerisi (örn. "100m atış yap") üretilmez. Kumsalda balık olmayacağı veya kayalıkta kesin av yapılacağı iddia edilemez.
            </div>
          </div>
        </div>

        {/* General Target Fish Advisory (Separated from live promises) */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{selectedFish.emoji}</span>
            <div className="min-w-0">
              <span className="font-bold text-slate-200 text-xs">
                {selectedFish.name} — Genel Tür Tavsiyesi:
              </span>
              <div className="text-[10px] text-slate-400 leading-snug">
                {geoAnalysis.zoneType === 'deniz'
                  ? 'Açık su alanı: Kıyıdan erişilemez; tekneden sırtı veya jigging avlanma biçimi uygundur.'
                  : geoAnalysis.zoneType === 'kiyi'
                  ? `Mevsimsel olarak ${selectedFish.bestHours} saatlerinde kıyıdan ${selectedFish.bestBaits[0]} ile denenebilir.`
                  : 'Karasal alan seçildi; kıyı hattına veya liman bölgesine yaklaşınız.'}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-mono font-bold text-cyan-400">%{selectedFish.currentScore}</div>
            <div className="text-[9px] text-slate-500 leading-tight">Örnek Model Skoru<br/>(Tutulma garantisi değildir)</div>
          </div>
        </div>

        {/* Cautions, Safety & Data Source Attribution */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] text-slate-500 border-t border-slate-800/80">
          <div>
            <strong>Harita Kaynağı:</strong> {activeTileLayer === 'dark' ? 'CartoDB Voyager' : 'OpenStreetMap'} · WGS84 Koordinat Sistemi
          </div>
          <div className="text-amber-400/90 font-mono">
            ⚠ Canlı rüzgâr/dalga sensörü bağlı değildir. Güvenlik için yerel hava durumunu kontrol ediniz.
          </div>
        </div>

      </div>

      {/* 4 Circular Quick Filter Buttons (Mera, Saat, Yem, Olta) matching reference design */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4">
        
        {/* Mera Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'mera' ? null : 'mera')}
          className="flex flex-col items-center group"
          aria-label="Mera Bilgileri"
        >
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'mera'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-stone-800 to-slate-700 relative flex items-center justify-center">
              <div className="text-xl">🪨</div>
              <div className="absolute inset-0 bg-cyan-900/30 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-1.5 text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Mera
          </span>
        </button>

        {/* Saat Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'saat' ? null : 'saat')}
          className="flex flex-col items-center group"
          aria-label="Saat Bilgileri"
        >
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'saat'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-amber-900 to-indigo-950 relative flex items-center justify-center">
              <div className="text-xl">🌅</div>
              <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-1.5 text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Saat
          </span>
        </button>

        {/* Yem Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'yem' ? null : 'yem')}
          className="flex flex-col items-center group"
          aria-label="Yem Tavsiyeleri"
        >
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'yem'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-emerald-800 to-teal-950 relative flex items-center justify-center">
              <div className="text-xl">🦐</div>
              <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-1.5 text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Yem
          </span>
        </button>

        {/* Olta Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'olta' ? null : 'olta')}
          className="flex flex-col items-center group"
          aria-label="Olta Takımı Tavsiyeleri"
        >
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'olta'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-blue-900 to-slate-900 relative flex items-center justify-center">
              <div className="text-xl">🎣</div>
              <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-1.5 text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Olta
          </span>
        </button>
      </div>

      {/* Quick Details Drawer when a circle is clicked */}
      {activeQuickTab && (
        <div className="mt-3.5 p-4 rounded-2xl bg-[#0f172a] border border-cyan-500/30 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              {activeQuickTab === 'mera' && <>🪨 Samsun–Ordu Kıyı Yapısı Özellikleri</>}
              {activeQuickTab === 'saat' && <>🌅 {selectedFish.name} İçin Genel Zamanlama Rehberi</>}
              {activeQuickTab === 'yem' && <>🦐 {selectedFish.name} İçin Önerilen Yemler</>}
              {activeQuickTab === 'olta' && <>🎣 {selectedFish.name} Takım & Donanım Rehberi</>}
            </h4>
            <button
              onClick={() => setActiveQuickTab(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
            {activeQuickTab === 'mera' && (
              <>
                <p><strong>Kapsam:</strong> Samsun, Terme, Çarşamba, Ünye, Fatsa, Perşembe ve Ordu kıyı şeridi.</p>
                <p><strong>Zemin Profili:</strong> Ünye ve Perşembe kıyılarında doğal falezler, kayalık burunlar ve derin koylar; Çarşamba ve Terme'de sığ kumluk kumsallar ve nehir deltaları; liman alanlarında ise yapay taş dolgu mendirekler bulunur.</p>
                <p className="text-[10px] text-slate-500">Not: Kıyı yapısı sahada fırtına ve debiye bağlı olarak değişebilir; sahaya inmeden önce yerinde inceleme yapınız.</p>
              </>
            )}
            {activeQuickTab === 'saat' && (
              <>
                <p><strong>Hedef Tür:</strong> {selectedFish.name} ({selectedFish.bestHours})</p>
                <p><strong>Genel Bilgi:</strong> Karadeniz kıyılarında genellikle alacakaranlık, gün doğumu ve gün batımı saatleri yırtıcı türlerin kıyılaması açısından verimli kabul edilir. (Örnek/model bilgisi olup garanti değildir).</p>
              </>
            )}
            {activeQuickTab === 'yem' && (
              <>
                <p><strong>Tavsiye Yemler:</strong> {selectedFish.bestBaits.join(' • ')}</p>
                <p><strong>Kıyı İpuçları:</strong> Kumluk sahillerde deniz kurdu, teke ve sülünez; kayalık burunlarda ve mendireklerde silikon karides, küçük jig ve sahte maket balıklar yaygın kullanılır.</p>
              </>
            )}
            {activeQuickTab === 'olta' && (
              <>
                <p><strong>Tavsiye Donanım:</strong> {selectedFish.bestTackle}</p>
                <p><strong>Yasal Asgari Boy Limiti:</strong> <span className="text-amber-400 font-semibold">{selectedFish.legalMinLength}</span> (Su Ürünleri Tebliği av limitlerine uymak sürdürülebilir balıkçılık için zorunludur).</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
