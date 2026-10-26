import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import L from 'leaflet';
import { 
  Crosshair, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
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
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Region } from '../data/regionsData';
import { FishSpecies, FISH_CATALOG } from '../data/fishData';
import { 
  VERIFIED_COASTAL_SPOTS, 
  VerifiedCoastalSpot, 
  SAMSUN_ORDU_BOUNDS, 
  SAMSUN_ORDU_CENTER,
  classifyPointGeography,
  PointClassificationResult,
  assessPointFishingSuitability,
  PointSuitabilityAssessment
} from '../data/samsunOrduMapData';

interface IdealAvSahasiMapProps {
  region: Region;
  selectedFish: FishSpecies;
  onSelectFish: (fish: FishSpecies) => void;
  targetSpotName?: string | null;
  onClearTargetSpot?: () => void;
}

export const IdealAvSahasiMap: React.FC<IdealAvSahasiMapProps> = ({
  region,
  selectedFish,
  onSelectFish,
  targetSpotName,
  onClearTargetSpot
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
  const fishDropdownRef = useRef<HTMLDivElement | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close fish dropdown when clicking or touching outside
  useEffect(() => {
    if (!fishDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (fishDropdownRef.current && !fishDropdownRef.current.contains(event.target as Node)) {
        setFishDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [fishDropdownOpen]);

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
  const [verificationFilter, setVerificationFilter] = useState<'Tümü' | 'DOGRULANDI' | 'ADAY' | 'YETERSIZ_VERI' | 'ERISIM_KISITLI_VEYA_RISKLI'>('Tümü');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Currently selected point (defaults to Ünye Liman Mendireği, perfectly synced)
  const defaultInitialSpot = useMemo(() => {
    return VERIFIED_COASTAL_SPOTS.find(s => s.id === 'unye-liman-mendirek') || VERIFIED_COASTAL_SPOTS[0];
  }, []);

  const [selectedCoord, setSelectedCoord] = useState<{ lat: number; lng: number }>({
    lat: defaultInitialSpot.lat,
    lng: defaultInitialSpot.lng
  });

  const [selectedSpot, setSelectedSpot] = useState<VerifiedCoastalSpot | null>(defaultInitialSpot);

  const [activeQuickTab, setActiveQuickTab] = useState<'mera' | 'saat' | 'yem' | 'olta' | null>(null);

  // Filtered spots based on user selection (Only active verified coastal spots are shown as map markers)
  const filteredSpots = useMemo(() => {
    return VERIFIED_COASTAL_SPOTS.filter(spot => {
      // Karada kalan, derin açık denizde kalan veya erişim yasağı olan noktalar haritada işaretçi olarak gösterilmez!
      if (!spot.haritadaAktifMi) return false;
      if (cityFilter !== 'Tümü' && spot.il !== cityFilter && spot.city !== cityFilter) return false;
      if (verificationFilter !== 'Tümü' && spot.kanitSeviyesi !== verificationFilter) return false;
      if (typeFilter !== 'Tümü') {
        if (typeFilter === 'Mendirek/Liman' && spot.kiyiYapisi !== 'mendirek' && spot.kiyiYapisi !== 'limanici') return false;
        if (typeFilter === 'Kayalık' && spot.kiyiYapisi !== 'kayalik_burun') return false;
        if (typeFilter === 'Kumsal' && spot.kiyiYapisi !== 'kumsal') return false;
        if (typeFilter === 'Dere Ağzı' && spot.kiyiYapisi !== 'dere_agzi') return false;
      }
      return true;
    });
  }, [cityFilter, typeFilter, verificationFilter]);

  // Dynamic spot counts derived directly from actual data
  const spotCounts = useMemo(() => {
    return {
      total: VERIFIED_COASTAL_SPOTS.length,
      active: VERIFIED_COASTAL_SPOTS.filter(s => s.haritadaAktifMi).length,
      inactive: VERIFIED_COASTAL_SPOTS.filter(s => !s.haritadaAktifMi).length,
      samsun: VERIFIED_COASTAL_SPOTS.filter(s => s.il === 'Samsun' && s.haritadaAktifMi).length,
      ordu: VERIFIED_COASTAL_SPOTS.filter(s => s.il === 'Ordu' && s.haritadaAktifMi).length,
      dogrulandi: VERIFIED_COASTAL_SPOTS.filter(s => s.kanitSeviyesi === 'DOGRULANDI' && s.haritadaAktifMi).length,
      aday: VERIFIED_COASTAL_SPOTS.filter(s => s.kanitSeviyesi === 'ADAY' && s.haritadaAktifMi).length,
      yetersizVeri: VERIFIED_COASTAL_SPOTS.filter(s => s.kanitSeviyesi === 'YETERSIZ_VERI').length,
      kisitli: VERIFIED_COASTAL_SPOTS.filter(s => s.kanitSeviyesi === 'ERISIM_KISITLI_VEYA_RISKLI').length,
    };
  }, []);

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
        attribution: '&copy; <a href="https://earthdata.nasa.gov/gibs" target="_blank" rel="noopener noreferrer">NASA GIBS</a> · GHRSST MUR L4 (default/default)',
        crossOrigin: true,
      });

      let loadedTiles = 0;
      let erroredTiles = 0;

      sstLayer.on('loading', () => {
        setSstLoading(true);
        setSstError(null);
        loadedTiles = 0;
        erroredTiles = 0;
      });

      sstLayer.on('tileload', () => {
        loadedTiles += 1;
      });

      sstLayer.on('tileerror', () => {
        erroredTiles += 1;
      });

      sstLayer.on('load', () => {
        setSstLoading(false);
        if (loadedTiles > 0) {
          setSstError(null);
        } else if (erroredTiles > 0) {
          setSstError('NASA GIBS uydu döşemeleri yüklenemedi. Bağlantınızı veya servis durumunu kontrol ediniz.');
        } else {
          setSstError('NASA uydu görüntüsü doğrulanamadı veya bu bölge için döşeme verisi boş döndü.');
        }
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
      const isRestricted = spot.kanitSeviyesi === 'ERISIM_KISITLI_VEYA_RISKLI';
      const isDogrulandi = spot.kanitSeviyesi === 'DOGRULANDI';
      const isAday = spot.kanitSeviyesi === 'ADAY';
      
      const iconColor = isRestricted
        ? '#ef4444'
        : isDogrulandi
        ? '#06b6d4'
        : isAday
        ? '#10b981'
        : '#f59e0b';

      const iconEmoji = spot.kiyiYapisi === 'mendirek' 
        ? '⚓' 
        : spot.kiyiYapisi === 'limanici'
        ? '🛥️'
        : spot.kiyiYapisi === 'kayalik_burun' 
        ? '🪨' 
        : spot.kiyiYapisi === 'dere_agzi' 
        ? '🌊' 
        : '🏖️';

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
        <div style="font-size: 12px; line-height: 1.45; font-family: system-ui, sans-serif; min-width: 190px;">
          <div style="font-weight: 700; color: #0284c7;">${spot.name}</div>
          <div style="color: #64748b; font-size: 11px;">${spot.city} (${spot.district})</div>
          <div style="margin-top: 3px; font-weight: 600; color: ${iconColor}; font-size: 11px;">
            ${spot.verificationBadge}
          </div>
          <div style="font-size: 10px; color: #334155; margin-top: 2px;">
            ${spot.locationType}
          </div>
          <div style="font-size: 10px; color: #475569; margin-top: 2px;">
            Ref: ${spot.kaynak}
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

  // 4b. Sync target spot when requested from other tabs (e.g., Meralar tab)
  useEffect(() => {
    if (!targetSpotName) return;
    const found = VERIFIED_COASTAL_SPOTS.find(
      s => s.name.toLowerCase() === targetSpotName.toLowerCase() || s.id === targetSpotName
    );
    if (found) {
      setSelectedCoord({ lat: found.lat, lng: found.lng });
      setSelectedSpot(found);
      setActiveQuickTab('mera');
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([found.lat, found.lng], 13, { animate: true, duration: 1 });
      }
      onClearTargetSpot?.();
    }
  }, [targetSpotName, onClearTargetSpot]);

  // 4c. Smoothly pan map when user selects a new region in navbar / picker
  useEffect(() => {
    if (mapInstanceRef.current && region) {
      mapInstanceRef.current.flyTo([region.lat, region.lng], 11, { animate: true, duration: 1 });
    }
  }, [region.id, region.lat, region.lng]);

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
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setGeoErrorMsg('Konum servisi başlatılamadı (HTTPS bağlantısı gereklidir).');
      setLocatingState(false);
      setFollowState(false);
    }
  }, [createUserLocationIcon, setFollowState, setLocatingState]);

  // Center on user location on-demand or toggle tracking
  const handleCenterOnUser = useCallback(() => {
    if (!isLocatingRef.current) {
      toggleLocationTracking();
    } else if (userCoords && mapInstanceRef.current) {
      setFollowState(true);
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 13, { animate: true });
    } else {
      toggleLocationTracking();
    }
  }, [toggleLocationTracking, userCoords, setFollowState]);

  // Toggle user following state explicitly
  const handleToggleFollow = useCallback(() => {
    const nextFollow = !isFollowingUserRef.current;
    setFollowState(nextFollow);
    if (nextFollow && userCoords && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([userCoords.lat, userCoords.lng], { animate: true });
    }
  }, [setFollowState, userCoords]);

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // ResizeObserver on map container: reliably fires Leaflet invalidateSize as soon as layout/CSS changes
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize({ debounceMoveend: true });
        }
      });
    });

    resizeObserver.observe(container);

    const handleWindowResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleWindowResize, { passive: true });
    window.addEventListener('orientationchange', handleWindowResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('orientationchange', handleWindowResize);
    };
  }, []);

  // Fullscreen effect: lock background body scrolling on iOS/desktop and listen for Escape key
  useEffect(() => {
    if (!isFullscreen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Invalidate map size on entering fullscreen
    const rafId = requestAnimationFrame(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
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

  // Compute coastline classification and amateur fishing suitability for currently selected coordinate
  const geoAnalysis: PointClassificationResult = classifyPointGeography(selectedCoord.lat, selectedCoord.lng);
  const suitability: PointSuitabilityAssessment = assessPointFishingSuitability(selectedSpot, geoAnalysis);

  return (
    <div id="av-sahasi" className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-4">
      
      {/* Fullscreen Wrapper Mode or Standard Flow */}
      <div 
        className={
          isFullscreen 
            ? "fixed inset-0 z-[60] bg-[#070c16] flex flex-col overflow-hidden w-full h-[100dvh]" 
            : "w-full"
        }
        style={
          isFullscreen 
            ? {
                paddingTop: 'max(10px, env(safe-area-inset-top, 10px))',
                paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
                paddingLeft: 'max(12px, env(safe-area-inset-left, 12px))',
                paddingRight: 'max(12px, env(safe-area-inset-right, 12px))',
              }
            : undefined
        }
      >
        
        {/* Header: Samsun – Ordu Kıyı Haritası · [Hedef Balık ▾] */}
        <div className="flex items-center justify-between mb-2 shrink-0 px-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Crosshair className="w-4 h-4 text-cyan-400 shrink-0" />
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Samsun – Ordu Kıyı Haritası
            </h2>
            <span className="text-slate-500 font-light hidden sm:inline">·</span>
            <div ref={fishDropdownRef} className="relative">
              <button
                onClick={() => setFishDropdownOpen(prev => !prev)}
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
                        <div className="text-[9px] text-slate-500">Katalog İndeksi</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Region Scope Tag */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
              <span>{filteredSpots.length} Mera Kayıtlı</span>
            </div>

            {isFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-600 shadow-md transition min-h-[36px] cursor-pointer"
                title="Tam Ekrandan Çık"
                aria-label="Tam Ekrandan Çık"
              >
                <X className="w-4 h-4 text-cyan-400" />
                <span>Kapat</span>
              </button>
            )}
          </div>
        </div>

        {/* Real Interactive Leaflet Map Container - Expands to 100% remaining vertical space in fullscreen */}
        <div className={`relative w-full overflow-hidden border border-slate-700/80 shadow-2xl bg-[#091524] ${
          isFullscreen ? 'flex-1 min-h-0 rounded-2xl' : 'h-[340px] sm:h-[410px] rounded-3xl'
        }`}>
          <div 
            ref={mapContainerRef} 
            className="w-full h-full z-10"
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

          {/* Fullscreen Overlay: Mera Filter Panel */}
          {isFullscreen && showFilterDrawer && (
            <div 
              onTouchStart={(e) => e.stopPropagation()} 
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 right-3 z-30 max-h-[50dvh] overflow-y-auto p-3 rounded-2xl bg-[#091524]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs space-y-2 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  Mera Filtreleri ({filteredSpots.length} nokta listeleniyor)
                </span>
                <div className="flex items-center gap-2.5">
                  <button 
                    onClick={() => {
                      setCityFilter('Tümü');
                      setTypeFilter('Tümü');
                      setVerificationFilter('Tümü');
                    }}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Sıfırla
                  </button>
                  <button
                    onClick={() => setShowFilterDrawer(false)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Filtre panelini kapat"
                    aria-label="Filtre panelini kapat"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                    {city} ({city === 'Samsun' ? spotCounts.samsun : city === 'Ordu' ? spotCounts.ordu : spotCounts.total})
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
                <span className="text-[10px] text-slate-400 w-16">Kanıt Durumu:</span>
                <button
                  onClick={() => setVerificationFilter('Tümü')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    verificationFilter === 'Tümü' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Tümü ({spotCounts.total})
                </button>
                <button
                  onClick={() => setVerificationFilter('DOGRULANDI')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    verificationFilter === 'DOGRULANDI' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  🛡️ Doğrulandı ({spotCounts.dogrulandi})
                </button>
                <button
                  onClick={() => setVerificationFilter('ADAY')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    verificationFilter === 'ADAY' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  🔍 Aday ({spotCounts.aday})
                </button>
                <button
                  onClick={() => setVerificationFilter('YETERSIZ_VERI')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    verificationFilter === 'YETERSIZ_VERI' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  ⚠️ Yetersiz Veri ({spotCounts.yetersizVeri})
                </button>
                <button
                  onClick={() => setVerificationFilter('ERISIM_KISITLI_VEYA_RISKLI')}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                    verificationFilter === 'ERISIM_KISITLI_VEYA_RISKLI' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  ⛔ Kısıtlı / Riskli ({spotCounts.kisitli})
                </button>
              </div>
            </div>
          )}

          {/* Fullscreen Overlay: NASA SST Info Panel */}
          {isFullscreen && isSstActive && (
            <div 
              onTouchStart={(e) => e.stopPropagation()} 
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 right-3 z-30 max-h-[50dvh] overflow-y-auto p-3 rounded-2xl bg-[#0b1322]/95 border border-rose-500/40 text-xs shadow-2xl backdrop-blur-md space-y-2 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  <span>NASA GIBS Deniz Sıcaklığı (SST)</span>
                  <span className="text-[9px] font-mono text-slate-400 ml-1">GHRSST MUR L4 · default/default</span>
                </div>
                <button
                  onClick={() => setIsSstActive(false)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Deniz sıcaklığı katmanını kapat"
                  aria-label="Deniz sıcaklığı katmanını kapat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-300">
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

              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[9.5px] text-slate-300 leading-relaxed space-y-1">
                <div>
                  <strong className="text-rose-300">Renkler hakkında:</strong> Bu ekranda NASA katmanının gerçek renk skalası ve sıcaklık değerleri doğrulanmış değildir. Bu nedenle renkleri belirli sıcaklık dereceleri olarak yorumlamayın. Katmanın görünmesi, balık yoğunluğunu veya av başarısını göstermez.
                </div>
                <div className="text-[8.5px] text-slate-500 font-mono pt-0.5 border-t border-slate-800/80">
                  * NASA GIBS GHRSST MUR L4 katmanı döşemeleri default/default ayarıyla çağrılmaktadır; anlık veya gerçek zamanlı kıyı ölçümü değildir.
                </div>
              </div>

              {sstLoading && (
                <div className="text-[9px] text-cyan-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                  <span>Uydu döşemeleri yükleniyor...</span>
                </div>
              )}

              {sstError && (
                <div className="text-[9px] text-amber-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{sstError}</span>
                </div>
              )}
            </div>
          )}

          {/* Fullscreen Overlay: Compact Floating Selected Spot / Coordinate Pill */}
          {isFullscreen && !showFilterDrawer && !isSstActive && (
            <div 
              onTouchStart={(e) => e.stopPropagation()} 
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 right-3 z-30 p-2.5 rounded-2xl bg-[#091524]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs flex items-center justify-between gap-2 animate-in fade-in duration-150"
            >
              <div className="min-w-0 flex items-center gap-2">
                <span className="text-base shrink-0">📍</span>
                <div className="min-w-0">
                  <div className="font-bold text-white text-xs truncate">
                    {selectedSpot ? selectedSpot.name : `${selectedCoord.lat.toFixed(4)}°N, ${selectedCoord.lng.toFixed(4)}°E`}
                  </div>
                  <div className="text-[10px] text-slate-300 flex items-center gap-1.5 flex-wrap">
                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-semibold ${
                      geoAnalysis.zoneType === 'kiyi' ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800' :
                      geoAnalysis.zoneType === 'deniz' ? 'text-blue-300 bg-blue-950/80 border border-blue-800' :
                      geoAnalysis.zoneType === 'kara' ? 'text-red-300 bg-red-950/80 border border-red-800' :
                      'text-slate-300 bg-slate-800 border border-slate-700'
                    }`}>
                      {geoAnalysis.zone}
                    </span>
                    {geoAnalysis.distanceToCoastKm !== null && (
                      <span className="text-slate-400 font-mono text-[9px]">
                        ~{geoAnalysis.distanceToCoastKm >= 1 ? `${geoAnalysis.distanceToCoastKm} km` : `${Math.round(geoAnalysis.distanceToCoastKm * 1000)} m`} kıyıya
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={toggleFullscreen}
                  className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-[11px] transition shadow cursor-pointer"
                  title="Tam ekrandan çıkıp detaylı analizi gör"
                >
                  Detay
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Warning and Notification Banners (Displayed Outside the Map) */}
        {isUserOutsideRegion && (
          <div className="mt-2 p-2 rounded-xl bg-slate-900/95 border border-amber-500/60 text-[11px] text-amber-300 shadow-md backdrop-blur-md flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Bölge Dışı Konum:</strong> GPS konumunuz tespit edildi ancak Samsun–Ordu kıyı analiz bölgesinin dışındasınız.
              </div>
            </div>
            <button 
              onClick={() => setIsUserOutsideRegion(false)} 
              className="p-1 text-slate-400 hover:text-white shrink-0"
              aria-label="Bildirimi Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {geoErrorMsg && (
          <div className="mt-2 p-2 rounded-xl bg-red-950/95 border border-red-500/60 text-[11px] text-red-200 shadow-md backdrop-blur-md flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{geoErrorMsg}</span>
            </div>
            <button 
              onClick={() => setGeoErrorMsg(null)} 
              className="p-1 text-slate-400 hover:text-white shrink-0"
              aria-label="Hata Mesajını Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dedicated Map Action Controls Toolbar - Sits Immediately Below the Map */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 shrink-0 px-0.5">
          {/* Left Action Group: Reset View, Location GPS, Follow Mode, Sea Temperature */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleResetView}
              className="px-2.5 py-1.5 rounded-full bg-slate-900/95 text-slate-200 border border-slate-700 hover:border-cyan-400 text-[11px] font-semibold flex items-center gap-1.5 shadow-md transition active:scale-95"
              title="Samsun - Ordu Genel Görünüme Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Samsun–Ordu</span>
            </button>

            {!isLocating ? (
              <button
                onClick={handleCenterOnUser}
                className="px-2.5 py-1.5 rounded-full bg-slate-900/95 text-slate-200 border border-slate-700 hover:border-cyan-400 text-[11px] font-semibold flex items-center gap-1.5 shadow-md transition active:scale-95"
                title="Konumumu Haritada Göster"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Konumum</span>
              </button>
            ) : (
              <div className="inline-flex items-center rounded-full bg-cyan-950/90 border border-cyan-500/60 shadow-md">
                <button
                  onClick={handleCenterOnUser}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-cyan-200 hover:text-white flex items-center gap-1.5 transition"
                  title="Mevcut GPS konumunuza odaklanın"
                >
                  <Navigation className="w-3 h-3 text-cyan-400 fill-cyan-400 animate-pulse" />
                  <span>Konum: Aktif</span>
                </button>
                <button
                  onClick={toggleLocationTracking}
                  className="pr-2.5 pl-1 py-1.5 text-cyan-400 hover:text-red-400 transition"
                  title="Konum takibini kapat"
                  aria-label="Konum takibini kapat"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {isLocating && (
              <button
                onClick={handleToggleFollow}
                className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md border transition active:scale-95 ${
                  isFollowingUser
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
                title={isFollowingUser ? 'Otomatik konum takibi açık (Kapatmak için tıklayın)' : 'Otomatik konum takibini aç'}
              >
                <Check className={`w-3 h-3 ${isFollowingUser ? 'text-white' : 'text-slate-500'}`} />
                <span>{isFollowingUser ? 'Takip: Açık' : 'Takip: Kapalı'}</span>
              </button>
            )}

            <button
              onClick={() => setIsSstActive(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md border transition active:scale-95 ${
                isSstActive
                  ? 'bg-rose-600 text-white border-rose-400 shadow-rose-500/25 ring-2 ring-rose-500/20'
                  : 'bg-slate-900/95 text-slate-200 border-slate-700 hover:border-rose-400'
              }`}
              title="NASA GIBS Gerçek Deniz Yüzeyi Sıcaklığı (SST) Uydu Termal Katmanı"
            >
              <Thermometer className={`w-3.5 h-3.5 ${isSstActive ? 'text-white' : 'text-rose-400'}`} />
              <span>{isSstActive ? 'Deniz Sıcaklığı (NASA)' : 'Deniz Sıcaklığı'}</span>
              {sstLoading && <RefreshCw className="w-2.5 h-2.5 animate-spin text-white" />}
            </button>
          </div>

          {/* Right Action Group: Filters Drawer Toggle & Fullscreen Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowFilterDrawer(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-md border transition active:scale-95 ${
                showFilterDrawer || cityFilter !== 'Tümü' || typeFilter !== 'Tümü' || verificationFilter !== 'Tümü'
                  ? 'bg-cyan-700 text-white border-cyan-400'
                  : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
              title="Mera Filtreleri Aç / Kapat"
            >
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtre</span>
              {(cityFilter !== 'Tümü' || typeFilter !== 'Tümü' || verificationFilter !== 'Tümü') && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 rounded-full bg-slate-900/90 text-slate-200 border border-slate-700 flex items-center justify-center shadow-md hover:text-white transition active:scale-95"
              title={isFullscreen ? 'Tam Ekrandan Çık' : 'Haritayı Büyüt'}
              aria-label={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-cyan-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Standard Flow (Non-Fullscreen): Mera Filter Panel */}
        {!isFullscreen && showFilterDrawer && (
          <div className="mt-2.5 p-3 rounded-2xl bg-[#091524]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Mera Filtreleri ({filteredSpots.length} nokta listeleniyor)
              </span>
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => {
                    setCityFilter('Tümü');
                    setTypeFilter('Tümü');
                    setVerificationFilter('Tümü');
                  }}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Sıfırla
                </button>
                <button
                  onClick={() => setShowFilterDrawer(false)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Filtre panelini kapat"
                  aria-label="Filtre panelini kapat"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
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
                  {city} ({city === 'Samsun' ? spotCounts.samsun : city === 'Ordu' ? spotCounts.ordu : spotCounts.total})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 w-16">Kıyı Tipi:</span>
              {(['Tümü', 'Mendirek/Liman', 'Kayalık', 'Kumsal', 'Dere Ağzı'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold transition ${
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
              <span className="text-[10px] text-slate-400 w-16">Kanıt Durumu:</span>
              <button
                onClick={() => setVerificationFilter('Tümü')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'Tümü' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Tümü ({spotCounts.total})
              </button>
              <button
                onClick={() => setVerificationFilter('DOGRULANDI')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'DOGRULANDI' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                🛡️ Doğrulandı ({spotCounts.dogrulandi})
              </button>
              <button
                onClick={() => setVerificationFilter('ADAY')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'ADAY' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                🔍 Aday ({spotCounts.aday})
              </button>
              <button
                onClick={() => setVerificationFilter('YETERSIZ_VERI')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'YETERSIZ_VERI' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ⚠️ Yetersiz Veri ({spotCounts.yetersizVeri})
              </button>
              <button
                onClick={() => setVerificationFilter('ERISIM_KISITLI_VEYA_RISKLI')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  verificationFilter === 'ERISIM_KISITLI_VEYA_RISKLI' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ⛔ Kısıtlı / Riskli ({spotCounts.kisitli})
              </button>
            </div>
          </div>
        )}

        {/* Standard Flow (Non-Fullscreen): NASA SST Info & Opacity Panel */}
        {!isFullscreen && isSstActive && (
          <div className="mt-2.5 p-3 rounded-2xl bg-[#0b1322]/95 border border-rose-500/40 text-xs shadow-2xl backdrop-blur-md space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>NASA GIBS Deniz Sıcaklığı (SST)</span>
                <span className="text-[9px] font-mono text-slate-400 ml-1">GHRSST MUR L4 · default/default</span>
              </div>
              <button
                onClick={() => setIsSstActive(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Deniz sıcaklığı katmanını kapat"
                aria-label="Deniz sıcaklığı katmanını kapat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-300">
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

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[9.5px] text-slate-300 leading-relaxed space-y-1">
              <div>
                <strong className="text-rose-300">Renkler hakkında:</strong> Bu ekranda NASA katmanının gerçek renk skalası ve sıcaklık değerleri doğrulanmış değildir. Bu nedenle renkleri belirli sıcaklık dereceleri olarak yorumlamayın. Katmanın görünmesi, balık yoğunluğunu veya av başarısını göstermez.
              </div>
              <div className="text-[8.5px] text-slate-500 font-mono pt-0.5 border-t border-slate-800/80">
                * NASA GIBS GHRSST MUR L4 katmanı döşemeleri default/default ayarıyla çağrılmaktadır; anlık veya gerçek zamanlı kıyı ölçümü değildir.
              </div>
            </div>

            {sstLoading && (
              <div className="text-[9px] text-cyan-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                <span>Uydu döşemeleri yükleniyor...</span>
              </div>
            )}

            {sstError && (
              <div className="text-[9px] text-amber-300 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{sstError}</span>
              </div>
            )}
          </div>
        )}

        {/* Standard Flow (Non-Fullscreen): Map Type Legend & Security Notice */}
        {!isFullscreen && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">⚓ <strong className="text-cyan-400 font-medium">Mendirek</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">🪨 <strong className="text-amber-400 font-medium">Kayalık</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">🏖️ <strong className="text-emerald-400 font-medium">Kumsal</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">🌊 <strong className="text-blue-400 font-medium">Dere</strong></span>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-amber-300 font-medium text-[9.5px] shadow-sm border border-amber-500/40">
              <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Güvenlik: Canlı veri yok (Sahada kontrol ediniz)</span>
              <span className="sm:hidden">Güvenlik: Teyitsiz</span>
            </div>
          </div>
        )}

      </div>

      <div className="mt-3.5 p-4 rounded-2xl bg-[#0e1626] border border-cyan-500/30 shadow-xl space-y-3">
        {/* Header: Spot Name / Free Coordinate & Classification Badge */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 text-xs shrink-0">
              📍
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                <span className="truncate">
                  {selectedSpot ? selectedSpot.name : 'Serbest Harita Koordinatı'}
                </span>

                {selectedSpot ? (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    selectedSpot.kanitSeviyesi === 'DOGRULANDI'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : selectedSpot.kanitSeviyesi === 'ADAY'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : selectedSpot.kanitSeviyesi === 'ERISIM_KISITLI_VEYA_RISKLI'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {selectedSpot.verificationBadge}
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold border border-slate-700">
                    Kayıtlı Mera Değil (Serbest Nokta)
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-2 mt-0.5 flex-wrap">
                <span>{selectedCoord.lat.toFixed(4)}° N, {selectedCoord.lng.toFixed(4)}° E</span>
                {geoAnalysis.distanceToCoastKm !== null && (
                  <span className="text-[10px] text-slate-400 font-sans">
                    (Kıyı çizgisine ~{geoAnalysis.distanceToCoastKm >= 1 ? `${geoAnalysis.distanceToCoastKm} km` : `${Math.round(geoAnalysis.distanceToCoastKm * 1000)} m`})
                  </span>
                )}
                {selectedSpot && (
                  <span className="text-[10px] text-slate-400 font-sans">
                    · {selectedSpot.city} ({selectedSpot.district})
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
                : geoAnalysis.zoneType === 'belirsiz'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {geoAnalysis.zone}
            </span>
          </div>
        </div>

        {/* Amatör Kıyı Balıkçılığı Uygunluk Değerlendirmesi */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-1.5">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <span>🎣 Kıyıdan Balıkçılık Uygunluk Değerlendirmesi</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              suitability.badgeTone === 'cyan'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                : suitability.badgeTone === 'emerald'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                : suitability.badgeTone === 'blue'
                ? 'bg-blue-950/80 text-blue-300 border-blue-500/50'
                : suitability.badgeTone === 'amber'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                : suitability.badgeTone === 'red'
                ? 'bg-red-950/80 text-red-300 border-red-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {suitability.badgeTitle}
            </span>
          </div>

          <p className="text-slate-300 text-[11.5px] leading-relaxed">
            {suitability.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px]">
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <strong className="text-slate-400 block mb-0.5">Fiziksel Yapı & Zemin:</strong>
              <span className="text-slate-300">{suitability.coastalStructureInfo}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <strong className="text-slate-400 block mb-0.5">Kıyı Koşulları & Güvenlik:</strong>
              <span className="text-slate-300">{suitability.generalFishingConditions}</span>
            </div>
          </div>

          {/* Eksik veya Doğrulanmamış Bilgiler & Sınırlamalar */}
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[10px] text-slate-300 space-y-1">
            <div className="font-semibold text-amber-300 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0 text-amber-400" />
              <span>Eksik / Doğrulanmamış Bilgiler & Sınırlamalar:</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-300">
              {suitability.missingDataWarnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          </div>

          {/* Kayıtlı Mera İçin Doğrulanmış OSM Kaynağı & Kıyı Erişim Teyidi */}
          {selectedSpot && (
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10.5px] space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span className="text-cyan-400">🗺️</span>
                  <span>Coğrafi Kaynak & Kıyı Doğrulama</span>
                </span>
                {selectedSpot.osmUrl && (
                  <a
                    href={selectedSpot.osmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-medium underline"
                  >
                    <span>OSM Haritada Aç</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 text-[10px]">
                <div>
                  <span className="text-slate-400 font-semibold">Kaynak: </span>
                  <span>{selectedSpot.cografiKaynak}</span>
                  {selectedSpot.osmId && <span className="text-slate-400 font-mono text-[9px] ml-1">({selectedSpot.osmId})</span>}
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Kıyı Erişimi: </span>
                  <span>{selectedSpot.fizikselKiyiErisimi}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Avlanma İzni: </span>
                  <span>{selectedSpot.avlanmaIzinDurumu}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Tür Verisi: </span>
                  <span className="text-slate-400">{selectedSpot.turVerisiKaynagi}</span>
                </div>
                {!selectedSpot.haritadaAktifMi && (
                  <div className="col-span-1 sm:col-span-2 p-1.5 rounded bg-red-950/60 border border-red-800/80 text-red-300 text-[10px]">
                    ⛔ <strong>Harita İşaretçisi Aktif Değil:</strong> {selectedSpot.aktifOlmamaGerekcesi}
                  </div>
                )}
                {selectedSpot.eskiKoordinat && (
                  <div className="col-span-1 sm:col-span-2 p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[9px]">
                    🗺️ <strong>Eski Yaklaşık Konum:</strong> {selectedSpot.eskiKoordinat.lat.toFixed(4)}°K, {selectedSpot.eskiKoordinat.lng.toFixed(4)}°D (Karada/açıkta kaldığı için kıyı yapısına sabitlenmiştir).
                  </div>
                )}
              </div>
            </div>
          )}

          {/* En Yakın Kayıtlı Mera Bilgisi (Serbest seçim yapıldığında gösterilir) */}
          {!selectedSpot && geoAnalysis.nearestSpot && geoAnalysis.distanceToNearestSpotKm !== null && (
            <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[10.5px] text-cyan-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
              <span>
                En yakın kayıtlı mera: <strong>{geoAnalysis.nearestSpot.name}</strong> (~{geoAnalysis.distanceToNearestSpotKm} km mesafede — <em>Tıkladığınız serbest nokta bu mera ile aynı yer değildir</em>).
              </span>
            </div>
          )}

          {/* Şeffaflık & Sorumluluk Notu */}
          <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-800/80 leading-normal">
            * {suitability.disclaimer} {geoAnalysis.dataNotice}
          </div>
        </div>

        {/* Hedef Tür ve Katalog Aktivite İndeksi Bilgisi */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{selectedFish.emoji}</span>
            <div className="min-w-0">
              <span className="font-bold text-slate-200 text-xs">
                {selectedFish.name} — Genel Tür Rehberi:
              </span>
              <div className="text-[10px] text-slate-400 leading-snug">
                {geoAnalysis.zoneType === 'deniz'
                  ? 'Açık deniz alanı: Kıyı atış menzilinin dışındadır; kıyıdan erişilemez (yalnızca tekne/sırtı avcılığı uygundur).'
                  : geoAnalysis.zoneType === 'kara'
                  ? 'Karasal alan seçildi; deniz kıyısı veya olta atış imkânı bulunmamaktadır.'
                  : geoAnalysis.zoneType === 'kiyi'
                  ? `Seçilen kıyı bandında ${selectedFish.name} için önerilen av saatleri (${selectedFish.bestHours}) ve yem tercihleri (${selectedFish.bestBaits[0]}) genel bölgesel/biyolojik tavsiyelerdir; konuma özgü doğrulanmış tahmin veya balık yakalama garantisi değildir.`
                  : 'Yeterli coğrafi veri bulunmadığından bu koordinatta türe özel kıyı tavsiyesi üretilememiştir.'}
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-mono font-bold text-cyan-400">%{selectedFish.currentScore}</div>
            <div className="text-[9px] text-slate-500 leading-tight">Katalog Aktivite İndeksi<br/>(Konuma özgü olasılık değildir)</div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] text-slate-500 border-t border-slate-800/80">
          <div>
            <strong>Harita Altlığı:</strong> OpenStreetMap Katkıda Bulunanlar · <strong>Kara-Deniz Sınırı:</strong> GeoJSON Kara Poligonu
          </div>
          <div className="text-amber-400/90 font-mono">
            ⚠ Gerçek zamanlı kıyı sensörü yoktur. Güvenlik için yerel hava durumunu kontrol ediniz.
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
