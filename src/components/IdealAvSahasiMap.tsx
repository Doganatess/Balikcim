import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { 
  Crosshair, 
  ChevronDown, 
  Maximize2, 
  MapPin, 
  X, 
  AlertCircle, 
  RotateCcw,
  HelpCircle,
  Navigation,
  Thermometer,
  Waves,
  Filter,
  Layers,
  Sliders,
  Check,
  RefreshCw
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
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const sstTileLayerRef = useRef<L.TileLayer | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);
  const spotsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // User location tracking refs
  const watchIdRef = useRef<number | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const isLocatingRef = useRef(false);
  const isFollowingUserRef = useRef(false);

  const [fishDropdownOpen, setFishDropdownOpen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Geolocation states
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [geoErrorMsg, setGeoErrorMsg] = useState<string | null>(null);
  const [isUserOutsideRegion, setIsUserOutsideRegion] = useState(false);

  const setLocatingState = useCallback((next: boolean) => {
    isLocatingRef.current = next;
    setIsLocating(next);
  }, []);

  const setFollowState = useCallback((next: boolean) => {
    isFollowingUserRef.current = next;
    setIsFollowingUser(next);
  }, []);

  useEffect(() => {
    isLocatingRef.current = isLocating;
  }, [isLocating]);

  useEffect(() => {
    isFollowingUserRef.current = isFollowingUser;
  }, [isFollowingUser]);

  // NASA GIBS Real Sea Surface Temperature (SST) Satellite Layer states
  const [isSstActive, setIsSstActive] = useState(false);
  const [sstOpacity, setSstOpacity] = useState<number>(0.65);
  const [sstLoading, setSstLoading] = useState(false);
  const [sstError, setSstError] = useState<string | null>(null);

  // Mera filtering states
  const [cityFilter, setCityFilter] = useState<'Tümü' | 'Samsun' | 'Ordu'>('Tümü');
  const [typeFilter, setTypeFilter] = useState<'Tümü' | 'Mendirek/Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı'>('Tümü');
  const [verificationFilter, setVerificationFilter] = useState<'Tümü' | 'FIZIKI_YAPI_TEYITLI' | 'COGRAFI_REFERANS_NOKTASI'>('Tümü');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Currently selected point (defaults to Ünye Liman Mendireği)
  const [selectedCoord, setSelectedCoord] = useState<{ lat: number; lng: number }>({
    lat: 41.1355,
    lng: 37.2915
  });

  const [selectedSpot, setSelectedSpot] = useState<VerifiedCoastalSpot | null>(
    VERIFIED_COASTAL_SPOTS.find(s => s.id === 'unye-liman-mendirek') || VERIFIED_COASTAL_SPOTS[17]
  );

  const [activeQuickTab, setActiveQuickTab] = useState<'mera' | 'saat' | 'yem' | 'olta' | null>(null);

  // Filtered spots based on user selection
  const filteredSpots = useMemo(() => {
    return VERIFIED_COASTAL_SPOTS.filter(spot => {
      if (cityFilter !== 'Tümü' && spot.city !== cityFilter) return false;
      if (verificationFilter !== 'Tümü' && spot.verificationStatus !== verificationFilter) return false;
      if (typeFilter !== 'Tümü') {
        if (typeFilter === 'Mendirek/Liman' && !spot.locationType.includes('Mendirek') && !spot.locationType.includes('Liman')) return false;
        if (typeFilter === 'Kayalık' && !spot.locationType.includes('Kayalık')) return false;
        if (typeFilter === 'Kumsal' && !spot.locationType.includes('Kumsal') && !spot.locationType.includes('Plaj')) return false;
        if (typeFilter === 'Dere Ağzı' && !spot.locationType.includes('Dere') && !spot.locationType.includes('Nehir')) return false;
      }
      return true;
    });
  }, [cityFilter, typeFilter, verificationFilter]);

  // Helper for red target pin icon
  const createPinIcon = useCallback((): L.DivIcon => {
    return L.divIcon({
      className: 'custom-target-pin',
      html: `
        <div style="
          position: relative;
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
            box-shadow: 0 4px 14px rgba(220, 38, 38, 0.75);
            border: 2px solid #ffffff;
          ">
            <span style="transform: rotate(45deg); font-size: 12px; font-weight: 800;">📍</span>
          </div>
          <div style="
            width: 8px;
            height: 4px;
            background: rgba(0,0,0,0.6);
            border-radius: 50%;
            margin-top: 1px;
          "></div>
        </div>
      `,
      iconSize: [28, 33],
      iconAnchor: [14, 33]
    });
  }, []);

  // Helper for user blue pulsating location icon
  const createUserLocationIcon = useCallback((): L.DivIcon => {
    return L.divIcon({
      className: 'custom-user-location-pin',
      html: `
        <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            width: 22px;
            height: 22px;
            background: rgba(14, 165, 233, 0.4);
            border-radius: 50%;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 14px;
            height: 14px;
            background: #0284c7;
            border: 2.5px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(2, 132, 199, 0.85);
            z-index: 2;
          "></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
  }, []);

  // 1. Initial Leaflet Map Setup (Runs ONCE on mount)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: SAMSUN_ORDU_CENTER,
        zoom: 10,
        minZoom: 6,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: true
      });

      // Zoom control in top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Base Tiles
      const baseTile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> Katkıda Bulunanlar',
        maxZoom: 19
      });
      baseTile.addTo(map);
      baseTileLayerRef.current = baseTile;

      // Fit to Samsun-Ordu coastal frame initially
      map.fitBounds(SAMSUN_ORDU_BOUNDS, {
        padding: [20, 20],
        maxZoom: 11
      });

      // Spots layer group
      const spotsGroup = L.layerGroup().addTo(map);
      spotsLayerGroupRef.current = spotsGroup;

      // Target selection Pin marker
      const initialPinIcon = createPinIcon();
      const targetMarker = L.marker([selectedCoord.lat, selectedCoord.lng], { 
        icon: initialPinIcon,
        zIndexOffset: 1000 
      }).addTo(map);
      selectedMarkerRef.current = targetMarker;

      // Map click handler: updates coordinates and clears spot name
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setSelectedCoord({ lat, lng });
        setSelectedSpot(null);
      });

      // If user drags map manually, disable auto-following so map doesn't fight the user
      map.on('dragstart', () => {
        setFollowState(false);
      });

      mapInstanceRef.current = map;
    } catch (err: any) {
      console.error('Leaflet initialization error:', err);
      setMapError('Harita bileşeni yüklenemedi. Lütfen sayfayı yenileyiniz.');
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [createPinIcon, setFollowState]);

  // 2. Real NASA GIBS Satellite Sea Surface Temperature (SST) Layer Management
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (sstTileLayerRef.current) {
      map.removeLayer(sstTileLayerRef.current);
      sstTileLayerRef.current = null;
    }

    if (!isSstActive) {
      setSstLoading(false);
      setSstError(null);
      return;
    }

    setSstLoading(true);
    setSstError(null);

    try {
      const sstUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/default/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png';

      const sstLayer = L.tileLayer(sstUrl, {
        maxNativeZoom: 7,
        maxZoom: 18,
        opacity: sstOpacity,
        zIndex: 5,
        attribution: '&copy; <a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener noreferrer">NASA GIBS</a> · GHRSST MUR Deniz Yüzeyi Sıcaklığı (1 km / Günlük Analiz)',
        crossOrigin: true,
      });

      sstLayer.on('load', () => {
        setSstLoading(false);
        setSstError(null);
      });

      sstLayer.on('tileload', () => {
        setSstLoading(false);
        setSstError(null);
      });

      sstLayer.on('tileerror', () => {
        setSstLoading(false);
        setSstError('NASA GIBS katmanında tekil tile hatası oluştu; bu tek bir eşleme sorunu olabilir ve tüm katmanın tamamen çöktüğü anlamına gelmeyebilir.');
      });

      sstLayer.addTo(map);
      sstTileLayerRef.current = sstLayer;
    } catch (e: any) {
      console.error('NASA GIBS SST layer error:', e);
      setSstError('Uydu katmanı servisine ulaşılamadı.');
      setSstLoading(false);
    }
  }, [isSstActive]);

  // Update opacity dynamically without re-creating layer
  useEffect(() => {
    if (sstTileLayerRef.current) {
      sstTileLayerRef.current.setOpacity(sstOpacity);
    }
  }, [sstOpacity]);

  // 3. Render and update spot markers when filteredSpots changes
  // FIX FOR ZOOM: Centered iconAnchor [14, 14] without conflicting inner translate offsets
  useEffect(() => {
    if (!mapInstanceRef.current || !spotsLayerGroupRef.current) return;
    const spotsGroup = spotsLayerGroupRef.current;
    spotsGroup.clearLayers();

    filteredSpots.forEach((spot) => {
      const isLiman = spot.locationType.includes('Mendirek') || spot.locationType.includes('Liman');
      const isKaya = spot.locationType.includes('Kayalık');
      const isUnverified = spot.verificationStatus === 'GENIS_HAT_TEYITSIZ';
      
      const iconColor = isUnverified 
        ? '#eab308' 
        : isLiman 
        ? '#06b6d4' 
        : isKaya 
        ? '#f59e0b' 
        : '#10b981';

      const iconEmoji = isLiman ? '⚓' : isKaya ? '🪨' : spot.locationType.includes('Dere') ? '🌊' : '🏖️';

      // Pixel-perfect centered Leaflet divIcon: iconAnchor matches exactly half of iconSize
      const spotIcon = L.divIcon({
        className: 'custom-spot-marker',
        html: `
          <div style="
            background: #091220;
            border: 2px solid ${iconColor};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.85);
            cursor: pointer;
            font-size: 12px;
          ">
            ${iconEmoji}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: spotIcon, zIndexOffset: 200 });
      
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedCoord({ lat: spot.lat, lng: spot.lng });
        setSelectedSpot(spot);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([spot.lat, spot.lng], { animate: true });
        }
      });

      marker.bindPopup(`
        <div style="font-size: 12px; line-height: 1.45; font-family: system-ui, sans-serif;">
          <div style="font-weight: 700; color: #0284c7;">${spot.name}</div>
          <div style="color: #64748b; font-size: 11px;">${spot.city} (${spot.district})</div>
          <div style="margin-top: 3px; font-weight: 600; color: ${iconColor}; font-size: 11px;">
            ${spot.verificationBadge}
          </div>
          <div style="font-size: 10px; color: #334155; margin-top: 2px;">
            ${spot.locationType}
          </div>
          <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 2px;">
            ${spot.lat.toFixed(4)}°N, ${spot.lng.toFixed(4)}°E
          </div>
        </div>
      `);

      marker.addTo(spotsGroup);
    });
  }, [filteredSpots]);

  // 4. Move target pin seamlessly when selectedCoord changes
  useEffect(() => {
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setLatLng([selectedCoord.lat, selectedCoord.lng]);
    }
  }, [selectedCoord]);

  // 5. Geolocation Tracker: Start / Stop Handler
  const toggleLocationTracking = useCallback(() => {
    setGeoErrorMsg(null);

    if (isLocatingRef.current) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (userAccuracyCircleRef.current) {
        userAccuracyCircleRef.current.remove();
        userAccuracyCircleRef.current = null;
      }
      setLocatingState(false);
      setFollowState(false);
      setUserCoords(null);
      setIsUserOutsideRegion(false);
      return;
    }

    if (!navigator.geolocation) {
      setGeoErrorMsg('Tarayıcınız konum servisini (Geolocation API) desteklemiyor.');
      return;
    }

    setLocatingState(true);
    setFollowState(true);

    try {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude, accuracy });
          setGeoErrorMsg(null);

          // Check if user is within Samsun - Ordu coastal sector
          const isWithin = longitude >= 35.80 && longitude <= 38.30 && latitude >= 40.70 && latitude <= 41.60;
          setIsUserOutsideRegion(!isWithin);

          const map = mapInstanceRef.current;
          if (!map) return;

          // Draw or update blue user location icon
          if (!userMarkerRef.current) {
            const userIcon = createUserLocationIcon();
            const marker = L.marker([latitude, longitude], { 
              icon: userIcon, 
              zIndexOffset: 2500 
            }).addTo(map);
            marker.bindPopup(`
              <div style="font-size: 11px; line-height: 1.4;">
                <strong style="color: #0284c7;">📍 Mevcut Konumunuz</strong><br/>
                Hassasiyet: ±${Math.round(accuracy)}m
              </div>
            `);
            userMarkerRef.current = marker;
          } else {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          }

          // Draw or update accuracy radius circle
          if (!userAccuracyCircleRef.current) {
            const circle = L.circle([latitude, longitude], {
              radius: Math.min(accuracy, 2000),
              color: '#38bdf8',
              fillColor: '#0284c7',
              fillOpacity: 0.12,
              weight: 1,
              interactive: false
            }).addTo(map);
            userAccuracyCircleRef.current = circle;
          } else {
            userAccuracyCircleRef.current.setLatLng([latitude, longitude]);
            userAccuracyCircleRef.current.setRadius(Math.min(accuracy, 2000));
          }

          // Auto-center if follow mode is active
          if (isFollowingUserRef.current) {
            map.panTo([latitude, longitude], { animate: true });
          }
        },
        (error) => {
          let msg = 'Konum alınamadı.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Konum izni reddedildi. Tarayıcı ayarlarından konuma izin veriniz.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'GPS / Konum bilgisi alınamadı. Cihazınızın konum servisini açınız.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Konum alma zaman aşımına uğradı. Tekrar deneyiniz.';
          }
          setGeoErrorMsg(msg);
          setLocatingState(false);
          setFollowState(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      );
      watchIdRef.current = watchId;
    } catch (e: any) {
      setGeoErrorMsg('Konum servisi başlatılamadı (HTTPS bağlantısı gereklidir).');
      setLocatingState(false);
      setFollowState(false);
    }
  }, [createUserLocationIcon, setFollowState, setLocatingState]);

  // Center on user location on-demand
  const handleCenterOnUser = () => {
    if (userCoords && mapInstanceRef.current) {
      setFollowState(true);
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 13, { animate: true });
    } else {
      toggleLocationTracking();
    }
  };

  // Mobile resize & visibility watcher
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

  // Handle map reset view to Samsun-Ordu
  const handleResetView = useCallback(() => {
    setFollowState(false);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(SAMSUN_ORDU_BOUNDS, {
        padding: [20, 20],
        maxZoom: 11
      });
    }
  }, [setFollowState]);

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
          <span>{filteredSpots.length} Mera Kayıtlı</span>
        </div>
      </div>

      {/* Real Interactive Leaflet Map Container */}
      <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#091524] ${
        isFullscreen ? 'fixed inset-3 z-50 max-w-none h-[calc(100vh-1.5rem)]' : 'h-[340px] sm:h-[410px]'
      }`}>
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-10"
          style={{ touchAction: 'pan-x pan-y' }}
        />

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

        {isUserOutsideRegion && (
          <div className="absolute top-12 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-xs z-30 p-2.5 rounded-xl bg-slate-900/95 border border-amber-500/60 text-[11px] text-amber-300 shadow-xl backdrop-blur-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Bölge Dışı Konum:</strong> GPS konumunuz tespit edildi ancak Samsun–Ordu kıyı analiz bölgesinin dışındasınız.
              </div>
            </div>
          </div>
        )}

        {geoErrorMsg && (
          <div className="absolute top-12 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-xs z-30 p-2.5 rounded-xl bg-red-950/95 border border-red-500/60 text-[11px] text-red-200 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>{geoErrorMsg}</span>
              </div>
              <button onClick={() => setGeoErrorMsg(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20 flex-wrap">
          <button
            onClick={handleResetView}
            className="px-2.5 py-1.5 rounded-full bg-slate-900/95 text-slate-200 border border-slate-700 hover:border-cyan-400 text-[11px] font-semibold flex items-center gap-1 shadow-md backdrop-blur-md"
            title="Samsun - Ordu Genel Görünüme Sıfırla"
          >
            <RotateCcw className="w-3 h-3 text-cyan-400" />
            <span>Samsun–Ordu</span>
          </button>

          <button
            onClick={handleCenterOnUser}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md backdrop-blur-md border transition ${
              isLocating 
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-500/20' 
                : 'bg-slate-900/95 text-slate-200 border-slate-700 hover:border-cyan-400'
            }`}
            title={isLocating ? 'Konum takibi aktif (Tıklayarak odaklanın veya kapatın)' : 'Konumumu Haritada Göster'}
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'fill-white animate-pulse' : 'text-cyan-400'}`} />
            <span>Konumum</span>
          </button>

          {isLocating && (
            <button
              onClick={() => setFollowState(!isFollowingUserRef.current)}
              className={`px-2 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-md backdrop-blur-md border transition ${
                isFollowingUser
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700'
              }`}
              title="Kullanıcı hareket ettikçe haritayı otomatik takip et"
            >
              <span>{isFollowingUser ? '✓ Takip Açık' : 'Takip'}</span>
            </button>
          )}

          <button
            onClick={() => setIsSstActive(!isSstActive)}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md backdrop-blur-md border transition ${
              isSstActive
                ? 'bg-rose-600 text-white border-rose-400 shadow-rose-500/25 ring-2 ring-rose-500/20'
                : 'bg-slate-900/95 text-slate-200 border-slate-700 hover:border-rose-400'
            }`}
            title="NASA GIBS Gerçek Deniz Yüzeyi Sıcaklığı (SST) Uydu Termal Katmanı"
          >
            <Thermometer className={`w-3 h-3 ${isSstActive ? 'text-white' : 'text-rose-400'}`} />
            <span>{isSstActive ? 'Deniz Sıcaklığı (NASA)' : 'Deniz Sıcaklığı'}</span>
            {sstLoading && <RefreshCw className="w-2.5 h-2.5 animate-spin text-white" />}
          </button>
        </div>

        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md backdrop-blur-md border transition ${
              cityFilter !== 'Tümü' || typeFilter !== 'Tümü' || verificationFilter !== 'Tümü'
                ? 'bg-cyan-700 text-white border-cyan-400'
                : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-slate-500'
            }`}
            title="Mera Filtreleri"
          >
            <Filter className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">Filtre</span>
          </button>

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

        {showFilterDrawer && (
          <div className="absolute top-14 left-3 right-3 z-30 p-3 rounded-2xl bg-[#091524]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Mera Filtreleri ({filteredSpots.length} nokta listeleniyor)
              </span>
              <button 
                onClick={() => {
                  setCityFilter('Tümü');
                  setTypeFilter('Tümü');
                  setVerificationFilter('Tümü');
                }}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                Sıfırla
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 w-16">İl:</span>
              {(['Tümü', 'Samsun', 'Ordu'] as const).map(city => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    cityFilter === city
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {city} {city === 'Samsun' ? '(13)' : city === 'Ordu' ? '(17)' : '(30)'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 w-16">Kıyı Tipi:</span>
              {(['Tümü', 'Mendirek/Liman', 'Kayalık', 'Kumsal', 'Dere Ağzı'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    typeFilter === t
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 w-16">Doğrulama:</span>
              <button
                onClick={() => setVerificationFilter('Tümü')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'Tümü' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setVerificationFilter('FIZIKI_YAPI_TEYITLI')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'FIZIKI_YAPI_TEYITLI' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ⚓ Fiziki Yapı Teyitli
              </button>
              <button
                onClick={() => setVerificationFilter('COGRAFI_REFERANS_NOKTASI')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'COGRAFI_REFERANS_NOKTASI' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                📍 Coğrafi Referans
              </button>
            </div>
          </div>
        )}

        {isSstActive && (
          <div className="absolute top-12 left-3 right-3 sm:left-auto sm:right-3 sm:max-w-sm z-30 p-2.5 rounded-2xl bg-[#0b1322]/95 border border-rose-500/40 text-xs shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>NASA GIBS Deniz Sıcaklığı (SST)</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">GHRSST MUR L4 · 1 km</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-300 mt-2">
              <span className="text-slate-400">Termal Saydamlık:</span>
              <div className="flex items-center gap-1">
                {([0.45, 0.65, 0.85] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => setSstOpacity(op)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                      sstOpacity === op ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    %{Math.round(op * 100)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-0.5 mt-2">
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>Daha Soğuk (Mavi/Yeşil)</span>
                <span>Daha Sıcak (Sarı/Kırmızı)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 via-amber-400 to-rose-600 opacity-90"></div>
            </div>

            <div className="text-[9px] text-slate-400 leading-tight mt-2">
              <strong>Bilimsel Veri:</strong> NASA GIBS kaynaklı günlük deniz yüzeyi sıcaklığı kompozitidir; 1 km çözünürlüktedir. Balık biyokütlesi veya anlık av garantisi değildir.
            </div>

            {sstError && (
              <div className="text-[9px] text-amber-300 flex items-center gap-1 mt-2">
                <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{sstError}</span>
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-2.5 left-3 z-20 flex items-center gap-2 text-[10px] text-slate-300 bg-slate-950/90 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-md">
          <span className="flex items-center gap-1">⚓ <strong className="text-cyan-400 font-medium">Mendirek</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">🪨 <strong className="text-amber-400 font-medium">Kayalık</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">🏖️ <strong className="text-emerald-400 font-medium">Kumsal</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1">🌊 <strong className="text-blue-400 font-medium">Dere</strong></span>
        </div>

        <div className="absolute bottom-2.5 right-3 z-20">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/95 text-amber-300 font-medium text-[10px] shadow-md border border-amber-500/40 backdrop-blur-md">
            <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Güvenlik: Canlı veri yok (Sahada kontrol ediniz)</span>
            <span className="sm:hidden">Güvenlik: Teyitsiz</span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 p-4 rounded-2xl bg-[#0e1626] border border-cyan-500/30 shadow-xl space-y-3">
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

                {selectedSpot ? (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    selectedSpot.verificationStatus === 'FIZIKI_YAPI_TEYITLI'
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

              <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-2 mt-0.5 flex-wrap">
                <span>{selectedCoord.lat.toFixed(4)}° N, {selectedCoord.lng.toFixed(4)}° E</span>
                {geoAnalysis.distanceToCoastKm !== null && (
                  <span className="text-[10px] text-slate-400 font-sans">
                    (Kıyı referans çizgisine ~{geoAnalysis.distanceToCoastKm >= 1 ? `${geoAnalysis.distanceToCoastKm} km` : `${Math.round(geoAnalysis.distanceToCoastKm * 1000)} m`}; eşik: ~450 m)
                  </span>
                )}
              </div>
            </div>
          </div>

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

        {selectedSpot ? (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
              <span>Mera Konum Teyit Kapsamı:</span>
              <span className="text-slate-400 font-mono">{selectedSpot.city} · {selectedSpot.district}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{selectedSpot.verificationNote}</p>
            <div className="text-[10px] text-slate-400 bg-slate-950/70 p-1.5 rounded border border-slate-800/80">
              <strong>Önemli:</strong> Coğrafi konumun doğrulanması balık veriminin, derinliğin veya güvenliğin doğrulandığı anlamına gelmez.
            </div>
            {selectedSpot.cautions && (
              <p className="text-amber-400/90 text-[10px] pt-0.5 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                <span>{selectedSpot.cautions}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400 text-[10px] font-semibold mb-0.5">Konum Analizi & Referans:</div>
            <p className="text-slate-300 text-[11px] leading-relaxed">{geoAnalysis.description}</p>
            <div className="text-[10px] text-slate-400 bg-slate-950/70 p-1.5 rounded border border-slate-800/80">
              <strong>Kıyı Eşiği:</strong> Sınıflandırma elle tanımlanmış yaklaşık referans çizgisine 450 m yakınlık eşiğiyle yapılmaktadır; resmî kadastro kıyı kenar çizgisine göre sınırlı örnek düzeyde bir yakınlık değerlendirmesidir.
            </div>
            {geoAnalysis.nearestSpot && geoAnalysis.distanceToNearestSpotKm !== null && (
              <p className="text-cyan-400 text-[10px] pt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>En yakın kayıtlı mera: <strong>{geoAnalysis.nearestSpot.name}</strong> (~{geoAnalysis.distanceToNearestSpotKm} km)</span>
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-semibold">Kıyı Yapısı / Zemin:</span>
            <div className="font-bold text-slate-200">
              {selectedSpot ? selectedSpot.locationType : (geoAnalysis.zoneType === 'kiyi' ? 'Karadeniz Kıyı Bandı' : geoAnalysis.zone)}
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              {selectedSpot ? selectedSpot.verifiedGeoFeature : geoAnalysis.dataNotice}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-semibold">Batimetri (Derinlik) & Atış Analizi:</span>
            <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{selectedSpot ? selectedSpot.depthStatus : 'Doğrulanmış batimetri ölçümü bulunmuyor'}</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Ölçülmüş sualtı derinlik haritası veya batimetri sensörü bulunmamaktadır; tahmini metre değeri verilmez. Kıyı eğimi doğrulanmadan kesin atış mesafesi tavsiye edilmez.
            </div>
          </div>
        </div>

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

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] text-slate-500 border-t border-slate-800/80">
          <div>
            <strong>Harita Altlığı:</strong> OpenStreetMap Katkıda Bulunanlar · <strong>Kıyı Çizgisi:</strong> Yaklaşık elle tanımlanmış referans çizgisi
          </div>
          <div className="text-amber-400/90 font-mono">
            ⚠ Canlı rüzgâr/dalga sensörü bağlı değildir. Güvenlik için yerel hava durumunu kontrol ediniz.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-4">
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
                <p><strong>Kapsam:</strong> 19 Mayıs, Atakum, İlkadım, Canik, Tekkeköy, Çarşamba, Terme, Ünye, Fatsa, Perşembe, Altınordu ve Gülyalı kıyıları ({VERIFIED_COASTAL_SPOTS.length} teyitli nokta)</p>
                <p><strong>Zemin Profili:</strong> Ünye ve Perşembe kıyılarında doğal falezler, kayalık burunlar ve derin koylar; Çarşamba ve Terme'de sığ kumluk kumsallar ve nehir ağızları; Gümüşhane, Çarşamba ve Terme bölgelerinde liman girişleri ve mendirekler dikkat çekmektedir.</p>
                <p className="text-[10px] text-slate-500">Not: Kıyı yapısı sahada fırtına ve debiye bağlı olarak değişebilir; sahaya inmeden önce yerinde inceleme yapınız.</p>
              </>
            )}
            {activeQuickTab === 'saat' && (
              <>
                <p><strong>Hedef Tür:</strong> {selectedFish.name} ({selectedFish.bestHours})</p>
                <p><strong>Genel Bilgi:</strong> Karadeniz kıyılarında genellikle alacakaranlık, gün doğumu ve gün batımı saatleri yırtıcı türlerin kıyılaması açısından verimli olabilir; bölgedeki rüzgar ve dalga koşulları bu saatleri değiştirebilir.</p>
              </>
            )}
            {activeQuickTab === 'yem' && (
              <>
                <p><strong>Tavsiye Yemler:</strong> {selectedFish.bestBaits.join(' • ')}</p>
                <p><strong>Kıyı İpuçları:</strong> Kumluk sahillerde deniz kurdu, teke ve sülünez; kayalık burunlarda ve mendireklerde silikon karides, küçük jig ve sahte maket balık önerilir.</p>
              </>
            )}
            {activeQuickTab === 'olta' && (
              <>
                <p><strong>Tavsiye Donanım:</strong> {selectedFish.bestTackle}</p>
                <p><strong>Yasal Asgari Boy Limiti:</strong> <span className="text-amber-400 font-semibold">{selectedFish.legalMinLength}</span> (Su Ürünleri Tebliği av limitlerine uymak zorunludur; mevzuat yerel uygulamaya göre değişebilir.)</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
