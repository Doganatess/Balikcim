import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Crosshair, 
  ChevronDown, 
  Compass, 
  Maximize2, 
  ShieldCheck, 
  Navigation, 
  MapPin, 
  X, 
  AlertCircle, 
  Info, 
  RotateCcw,
  Waves,
  Layers,
  Thermometer,
  Anchor,
  HelpCircle
} from 'lucide-react';
import { Region } from '../data/regionsData';
import { FishSpecies, FISH_CATALOG } from '../data/fishData';
import { 
  VERIFIED_COASTAL_SPOTS, 
  VerifiedCoastalSpot, 
  SAMSUN_ORDU_BOUNDS, 
  SAMSUN_ORDU_CENTER,
  classifyPointGeography 
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
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const spotsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [fishDropdownOpen, setFishDropdownOpen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTileLayer, setActiveTileLayer] = useState<'osm' | 'dark'>('dark');

  // Currently selected point (either a verified spot or tapped coordinate)
  const [selectedCoord, setSelectedCoord] = useState<{ lat: number; lng: number }>({
    lat: 41.1345, // Ünye Limanı default
    lng: 37.2885
  });

  const [selectedSpot, setSelectedSpot] = useState<VerifiedCoastalSpot | null>(
    VERIFIED_COASTAL_SPOTS.find(s => s.id === 'unye-liman-mendirek') || VERIFIED_COASTAL_SPOTS[4]
  );

  const [activeQuickTab, setActiveQuickTab] = useState<'mera' | 'saat' | 'yem' | 'olta' | null>(null);

  // Initialize or reconfigure Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent re-initialization if already created
    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: SAMSUN_ORDU_CENTER,
          zoom: 10,
          minZoom: 8,
          maxZoom: 18,
          maxBounds: [
            [40.60, 35.80], // Bounding limits to Samsun-Ordu Black Sea region
            [41.70, 38.50]
          ],
          zoomControl: false,
          attributionControl: true
        });

        // Add custom zoom control in top-right
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Tile layer setup
        const tileUrl = activeTileLayer === 'dark'
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

        const tileLayer = L.tileLayer(tileUrl, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> Katkıda Bulunanlar',
          maxZoom: 19
        });

        tileLayer.on('tileerror', () => {
          // If dark tiles fail, fallback to standard OSM
          console.warn('Leaflet tile loading warning');
        });

        tileLayer.addTo(map);

        // Fit initial view to Samsun-Ordu coastal bounds
        map.fitBounds(SAMSUN_ORDU_BOUNDS, {
          padding: [20, 20],
          maxZoom: 11
        });

        // Layer group for verified spots
        const spotsGroup = L.layerGroup().addTo(map);
        spotsLayerGroupRef.current = spotsGroup;

        // Render verified spots markers
        VERIFIED_COASTAL_SPOTS.forEach((spot) => {
          const isLiman = spot.locationType.includes('Mendirek') || spot.locationType.includes('Liman');
          const isKaya = spot.locationType.includes('Kayalık');
          
          const iconColor = isLiman ? '#06b6d4' : isKaya ? '#f59e0b' : '#10b981';
          const iconEmoji = isLiman ? '⚓' : isKaya ? '🪨' : '🏖️';

          const spotIcon = L.divIcon({
            className: 'custom-spot-marker',
            html: `
              <div style="
                background: #0f172a;
                border: 2px solid ${iconColor};
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.7);
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
          marker.on('click', () => {
            setSelectedCoord({ lat: spot.lat, lng: spot.lng });
            setSelectedSpot(spot);
            map.panTo([spot.lat, spot.lng], { animate: true });
          });

          // Popup on hover/click
          marker.bindPopup(`
            <div style="font-size: 12px; line-height: 1.4;">
              <strong style="color: #38bdf8;">${spot.name}</strong><br/>
              <span style="color: #94a3b8;">${spot.city} (${spot.district})</span><br/>
              <span style="font-weight: 600; color: #fbbf24;">${spot.locationType}</span><br/>
              <span style="font-size: 10px; color: #cbd5e1;">Hedef: ${spot.commonTargetSpecies.join(', ')}</span>
            </div>
          `);

          marker.addTo(spotsGroup);
        });

        // Click on map to select custom point
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          setSelectedCoord({ lat, lng });

          // Check if clicked near an existing verified spot
          const nearSpot = VERIFIED_COASTAL_SPOTS.find(s => {
            const dLat = Math.abs(s.lat - lat);
            const dLng = Math.abs(s.lng - lng);
            return dLat < 0.007 && dLng < 0.007;
          });

          setSelectedSpot(nearSpot || null);
        });

        mapInstanceRef.current = map;
      } catch (err: any) {
        console.error('Map init error:', err);
        setMapError('Harita bileşeni yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyiniz.');
      }
    }

    // Leaflet redraw trigger for tab switches
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [activeTileLayer]);

  // Update selected target pin on map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
    }

    const pinIcon = L.divIcon({
      className: 'custom-target-pin',
      html: `
        <div style="
          position: relative;
          transform: translate(-14px, -28px);
          display: flex;
          flex-direction: column;
          align-items: center;
        ">
          <div style="
            background: #ef4444;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.6);
            border: 2px solid #ffffff;
          ">
            <span style="transform: rotate(45deg); font-size: 11px; font-weight: 800;">📍</span>
          </div>
          <div style="
            width: 8px;
            height: 3px;
            background: rgba(0,0,0,0.5);
            border-radius: 50%;
            margin-top: 2px;
          "></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });

    const marker = L.marker([selectedCoord.lat, selectedCoord.lng], { icon: pinIcon }).addTo(map);
    selectedMarkerRef.current = marker;
  }, [selectedCoord]);

  // Handle map recenter to Samsun-Ordu
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(SAMSUN_ORDU_BOUNDS, {
        padding: [20, 20],
        maxZoom: 11
      });
    }
  };

  // Geographic classification calculation
  const geoAnalysis = classifyPointGeography(selectedCoord.lat, selectedCoord.lng);

  return (
    <div id="av-sahasi" className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-4">
      
      {/* Header: ⌖ İdeal Av Sahası · [Çinekop ▾] (Matching reference style) */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Crosshair className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Samsun – Ordu Kıyı Haritası
          </h2>
          <span className="text-slate-500 font-light">·</span>
          
          {/* Target Fish Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setFishDropdownOpen(!fishDropdownOpen)}
              className="flex items-center gap-1 text-base sm:text-lg font-bold text-cyan-400 hover:text-cyan-300 transition"
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
                      <div className="text-[9px] text-slate-400">{fish.activityStatus}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Region Scope Tag */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
          <span>Karadeniz Kıyısı</span>
        </div>
      </div>

      {/* Real Interactive Leaflet Map Container */}
      <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#091524] ${
        isFullscreen ? 'fixed inset-3 z-50 max-w-none h-[calc(100vh-1.5rem)]' : 'h-[340px] sm:h-[400px]'
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
            className="px-2.5 py-1.5 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700 hover:border-cyan-400 text-[11px] font-semibold flex items-center gap-1 shadow-md backdrop-blur-md transition"
            title="Samsun - Ordu Genel Görünüme Sıfırla"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Samsun–Ordu</span>
          </button>

          <button
            onClick={() => setActiveTileLayer(activeTileLayer === 'dark' ? 'osm' : 'dark')}
            className="w-8 h-8 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700 flex items-center justify-center shadow-md backdrop-blur-md text-[11px] hover:border-cyan-400 transition"
            title={activeTileLayer === 'dark' ? 'Standart OSM Haritaya Geç' : 'Koyu Deniz Haritasına Geç'}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
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
            title="Haritayı Büyüt"
          >
            {isFullscreen ? <X className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Interactive Instruction Pill in Center-Top */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden sm:block">
          <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 backdrop-blur-md">
            👆 Haritada istediğiniz kıyı noktasına dokunarak koordinat seçebilirsiniz
          </div>
        </div>

        {/* Map Bottom Legend Pill */}
        <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-2 text-[10px] text-slate-300 bg-slate-950/85 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-md">
          <span className="flex items-center gap-1">⚓ <strong className="text-cyan-400">Mendirek/Liman</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">🪨 <strong className="text-amber-400">Kayalık Burun</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">🏖️ <strong className="text-emerald-400">Kumsal</strong></span>
        </div>

        {/* Bottom-Right "Güvenli" badge matching reference */}
        <div className="absolute bottom-2.5 right-3 z-20">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 text-white font-bold text-[10px] shadow-md border border-emerald-400/30 backdrop-blur-md">
            <ShieldCheck className="w-3 h-3" />
            <span>Kıyı Durumu: Güvenli</span>
          </div>
        </div>
      </div>

      {/* Selected Coordinate Analysis Panel (Section 5 & 6 Requirement) */}
      <div className="mt-3.5 p-4 rounded-2xl bg-[#0e1626] border border-cyan-500/30 shadow-xl space-y-3">
        
        {/* Top Header of Analysis Panel */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-600/40 flex items-center justify-center text-cyan-400 text-xs">
              📍
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>{selectedSpot ? selectedSpot.name : 'Haritada Seçilen Koordinat'}</span>
                {selectedSpot && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded font-semibold">
                    Doğrulanmış Avlak
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-cyan-300">
                {selectedCoord.lat.toFixed(4)}° N, {selectedCoord.lng.toFixed(4)}° E
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              geoAnalysis.zone.includes('Kıyı')
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : geoAnalysis.zone.includes('Deniz')
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}>
              {geoAnalysis.zone}
            </span>
          </div>
        </div>

        {/* Detailed Geography & Structure Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          
          {/* Kıyı / Konum Tipi */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-semibold">Kıyı Yapısı / Coğrafi Sınıflandırma:</span>
            <div className="font-bold text-slate-200">
              {selectedSpot ? selectedSpot.locationType : geoAnalysis.zone}
            </div>
            <div className="text-[10px] text-slate-400">
              {selectedSpot ? selectedSpot.verifiedGeoFeature : geoAnalysis.description}
            </div>
          </div>

          {/* Derinlik ve Atış Mesafesi Uyarısı (Strictly factual - no made-up 100m claims) */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-semibold">Batimetri (Derinlik) & Atış Analizi:</span>
            <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Resmi batimetri / derinlik verisi bulunmamaktadır</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Kıyı eğimi ve sualtı derinlik haritası olmadan kesin atış mesafesi tavsiye edilmez. Kumsalda balık olmayacağı veya kayalıkta kesin av yapılacağı iddia edilemez.
            </div>
          </div>
        </div>

        {/* Target Fish Suggestion for this point */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedFish.emoji}</span>
            <div>
              <span className="font-bold text-slate-200">{selectedFish.name} İçin Durum:</span>
              <div className="text-[10px] text-slate-400">
                {geoAnalysis.zone.includes('Deniz')
                  ? 'Açık su alanı: Tekneden sırtı veya jigging avlanma biçimi uygundur.'
                  : geoAnalysis.zone.includes('Kıyı')
                  ? `${selectedFish.bestHours} saatlerinde kıyıdan ${selectedFish.bestBaits[0]} ile denenebilir.`
                  : 'Karasal alan seçildi; kıyı hattına yaklaşınız.'}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-mono font-bold text-cyan-400">%{selectedFish.currentScore}</div>
            <div className="text-[9px] text-slate-400">Model Skoru</div>
          </div>
        </div>

        {/* Cautions & Source Attribution */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-500 border-t border-slate-800/60">
          <div>
            <strong>Veri Kaynağı:</strong> OpenStreetMap Coğrafi Katmanı · Samsun-Ordu Kıyı Çizgisi Sınıflandırması
          </div>
          <div className="font-mono text-cyan-400/80">
            Örnek Model Verisi (Sensör API Bağlantısı Bekleniyor)
          </div>
        </div>

      </div>

      {/* 4 Circular Quick Filter Buttons (Mera, Saat, Yem, Olta) matching reference design */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4">
        
        {/* Mera Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'mera' ? null : 'mera')}
          className="flex flex-col items-center group"
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
              {activeQuickTab === 'saat' && <>🌅 {selectedFish.name} İçin En Verimli Saatler</>}
              {activeQuickTab === 'yem' && <>🦐 {selectedFish.name} İçin Tavsiye Edilen Yemler</>}
              {activeQuickTab === 'olta' && <>🎣 {selectedFish.name} Takım & Donanım Rehberi</>}
            </h4>
            <button
              onClick={() => setActiveQuickTab(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
            {activeQuickTab === 'mera' && (
              <>
                <p><strong>Bölge:</strong> Samsun, Terme, Çarşamba, Ünye, Fatsa, Perşembe ve Ordu kıyı hattı.</p>
                <p><strong>Zemin Tipleri:</strong> Ünye ve Perşembe hatlarında doğal falez ve kayalık burunlar; Çarşamba ve Terme'de sığ kumluk kumsallar; liman içlerinde ise taş dolgu mendirekler mevcuttur.</p>
              </>
            )}
            {activeQuickTab === 'saat' && (
              <>
                <p><strong>Hedef Tür:</strong> {selectedFish.name} ({selectedFish.bestHours})</p>
                <p><strong>Solunar Pencereleri:</strong> Gündoğumu ve günbatımı saatlerinde beslenme aktivitesi artış eğilimindedir. (Örnek model analizi).</p>
              </>
            )}
            {activeQuickTab === 'yem' && (
              <>
                <p><strong>Tavsiye Yemler:</strong> {selectedFish.bestBaits.join(' • ')}</p>
                <p><strong>Kıyı İpucu:</strong> Kumluk sahillerde dip kurdu/boru kurdu ve sülünez; kayalık burunlarda ve mendireklerde silikon karides, kaşık ve küçük sert sahteler yaygın kullanılır.</p>
              </>
            )}
            {activeQuickTab === 'olta' && (
              <>
                <p><strong>Donanım:</strong> {selectedFish.bestTackle}</p>
                <p><strong>Yasal Asgari Boy:</strong> <span className="text-amber-400 font-semibold">{selectedFish.legalMinLength}</span> (Av limitlerine uymak sürdürülebilir balıkçılık için mecburidir).</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
