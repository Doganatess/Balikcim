import { 
  VERIFIED_COASTAL_SPOTS, 
  VerifiedCoastalSpot, 
  SpotEvidenceLevel,
  CoastalStructureType,
  CoastalLocationType 
} from './samsunOrduMapData';

export interface MeraSpot {
  id: string;
  name: string;
  province: 'Samsun' | 'Ordu';
  district: string;
  distanceKm: number;
  activityScore?: number; // Kaldırıldı / şeffaflık amacıyla tutulmuyor
  isTrending: boolean;
  type: 'Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı' | 'Kıyı';
  kiyiYapisi: CoastalStructureType;
  kanitSeviyesi: SpotEvidenceLevel;
  kanitSeviyesiBadge: string;
  haritadaAktifMi: boolean;
  aktifOlmamaGerekcesi?: string;
  eskiKoordinat?: { lat: number; lng: number };
  cografiDogrulamaDurumu: 'DOGRULANDI' | 'KISMI';
  cografiKaynak: string;
  osmId?: string;
  osmUrl?: string;
  cografiKaynakNotu: string;
  fizikselKiyiErisimi: string;
  avlanmaIzinDurumu: string;
  turVerisiKaynagi: string;
  kaynak: string;
  erisimDurumu: string;
  kisitlarVeRiskler: string;
  belirsizlikler: string;
  balikcilikGerekcesi: string;
  popularFish: string[];
  depthDesc: string;
  bottomType: string;
  lat: number;
  lng: number;
  verificationStatus: SpotEvidenceLevel;
  verificationBadge: string;
  verificationNote: string;
  cautions: string;
}

/**
 * Haversine formülü ile iki koordinat arası kuş uçuşu mesafe (km)
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Ünye Körfezi merkez referans koordinatı (varsayılan kıyaslama için)
const DEFAULT_CENTER_LAT = 41.132;
const DEFAULT_CENTER_LNG = 37.283;

// Kıyı yapısını arayüz kategorisine dönüştürme
function mapStructureToDisplayType(kiyiYapisi: CoastalStructureType): 'Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı' | 'Kıyı' {
  if (kiyiYapisi === 'mendirek' || kiyiYapisi === 'limanici') return 'Liman';
  if (kiyiYapisi === 'kayalik_burun') return 'Kayalık';
  if (kiyiYapisi === 'kumsal') return 'Kumsal';
  if (kiyiYapisi === 'dere_agzi') return 'Dere Ağzı';
  return 'Kıyı';
}

/**
 * VERIFIED_COASTAL_SPOTS (30 kıyı noktası) üzerinden üretilen tekil ve birleşik mera listesi
 */
export const MERALAR_LIST: MeraSpot[] = VERIFIED_COASTAL_SPOTS.map((spot) => {
  const distanceKm = calculateDistanceKm(DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG, spot.lat, spot.lng);
  const isTrending = spot.kanitSeviyesi === 'DOGRULANDI';

  return {
    id: spot.id,
    name: spot.name,
    province: spot.il,
    district: spot.ilce,
    distanceKm,
    isTrending,
    type: mapStructureToDisplayType(spot.kiyiYapisi),
    kiyiYapisi: spot.kiyiYapisi,
    kanitSeviyesi: spot.kanitSeviyesi,
    kanitSeviyesiBadge: spot.kanitSeviyesiBadge,
    haritadaAktifMi: spot.haritadaAktifMi,
    aktifOlmamaGerekcesi: spot.aktifOlmamaGerekcesi,
    eskiKoordinat: spot.eskiKoordinat,
    cografiDogrulamaDurumu: spot.cografiDogrulamaDurumu,
    cografiKaynak: spot.cografiKaynak,
    osmId: spot.osmId,
    osmUrl: spot.osmUrl,
    cografiKaynakNotu: spot.cografiKaynakNotu,
    fizikselKiyiErisimi: spot.fizikselKiyiErisimi,
    avlanmaIzinDurumu: spot.avlanmaIzinDurumu,
    turVerisiKaynagi: spot.turVerisiKaynagi,
    kaynak: spot.kaynak,
    erisimDurumu: spot.erisimDurumu,
    kisitlarVeRiskler: spot.kisitlarVeRiskler,
    belirsizlikler: spot.belirsizlikler,
    balikcilikGerekcesi: spot.balikcilikGerekcesi,
    popularFish: spot.hedeflenenTurler,
    depthDesc: spot.derinlikDurumu,
    bottomType: spot.verifiedGeoFeature,
    lat: spot.lat,
    lng: spot.lng,
    verificationStatus: spot.kanitSeviyesi,
    verificationBadge: spot.kanitSeviyesiBadge,
    verificationNote: spot.verificationNote,
    cautions: spot.cautions
  };
});

// İstatistik sayaçları (Arayüzde gerçek veriden dinamik hesaplanır)
export const MERA_STATS = {
  total: MERALAR_LIST.length,
  activeCount: MERALAR_LIST.filter(m => m.haritadaAktifMi).length,
  inactiveCount: MERALAR_LIST.filter(m => !m.haritadaAktifMi).length,
  samsunCount: MERALAR_LIST.filter(m => m.province === 'Samsun').length,
  orduCount: MERALAR_LIST.filter(m => m.province === 'Ordu').length,
  dogrulandiCount: MERALAR_LIST.filter(m => m.kanitSeviyesi === 'DOGRULANDI').length,
  adayCount: MERALAR_LIST.filter(m => m.kanitSeviyesi === 'ADAY').length,
  yetersizVeriCount: MERALAR_LIST.filter(m => m.kanitSeviyesi === 'YETERSIZ_VERI').length,
  kisitliRiskliCount: MERALAR_LIST.filter(m => m.kanitSeviyesi === 'ERISIM_KISITLI_VEYA_RISKLI').length,
  // Geriye dönük uyumluluk alanları
  fizikiYapiTeyitliCount: MERALAR_LIST.filter(m => m.kanitSeviyesi === 'DOGRULANDI').length,
  cografiReferansCount: MERALAR_LIST.filter(m => m.kanitSeviyesi === 'ADAY').length,
};

const CUSTOM_MERALAR_KEY = 'balik_custom_meralar';

export function getStoredCustomMeralar(): MeraSpot[] {
  try {
    const raw = localStorage.getItem(CUSTOM_MERALAR_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveCustomMera(spot: MeraSpot): MeraSpot[] {
  try {
    const existing = getStoredCustomMeralar();
    const updated = [spot, ...existing.filter(s => s.id !== spot.id)];
    localStorage.setItem(CUSTOM_MERALAR_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function deleteCustomMera(id: string): MeraSpot[] {
  try {
    const existing = getStoredCustomMeralar();
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem(CUSTOM_MERALAR_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

