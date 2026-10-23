import { 
  VERIFIED_COASTAL_SPOTS, 
  VerifiedCoastalSpot, 
  SpotVerificationStatus,
  CoastalLocationType 
} from './samsunOrduMapData';

export interface MeraSpot {
  id: string;
  name: string;
  province: 'Samsun' | 'Ordu';
  district: string;
  distanceKm: number;
  activityScore: number; // 0 - 100 teorik model skoru
  isTrending: boolean;
  type: 'Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı' | 'Kıyı';
  popularFish: string[];
  depthDesc: string;
  bottomType: string;
  lat: number;
  lng: number;
  verificationStatus: SpotVerificationStatus;
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

// Kıyı türünü basitleştirilmiş arayüz kategorisine dönüştürme
function mapLocationTypeToMeraType(locType: CoastalLocationType): 'Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı' | 'Kıyı' {
  if (locType.includes('Mendirek') || locType.includes('Liman')) return 'Liman';
  if (locType.includes('Kayalık')) return 'Kayalık';
  if (locType.includes('Kumsal') || locType.includes('Plaj')) return 'Kumsal';
  if (locType.includes('Dere') || locType.includes('Nehir')) return 'Dere Ağzı';
  return 'Kıyı';
}

// Kıyı yapısına göre teorik aktivite skoru hesaplayıcı
function calculateStructureActivityScore(spot: VerifiedCoastalSpot): number {
  if (spot.verificationStatus === 'GENIS_HAT_TEYITSIZ') return 78;
  if (spot.locationType.includes('Mendirek')) return 92;
  if (spot.locationType.includes('Kayalık')) return 89;
  if (spot.locationType.includes('Dere')) return 86;
  if (spot.locationType.includes('Kumsal')) return 83;
  return 85;
}

/**
 * VERIFIED_COASTAL_SPOTS (30 kıyı noktası) üzerinden üretilen tekil ve birleşik mera listesi
 */
export const MERALAR_LIST: MeraSpot[] = VERIFIED_COASTAL_SPOTS.map((spot) => {
  const distanceKm = calculateDistanceKm(DEFAULT_CENTER_LAT, DEFAULT_CENTER_LNG, spot.lat, spot.lng);
  const isTrending = spot.verificationStatus === 'FIZIKI_YAPI_TEYITLI' || spot.id.includes('yason') || spot.id.includes('camlik');

  return {
    id: spot.id,
    name: spot.name,
    province: spot.city,
    district: spot.district,
    distanceKm,
    activityScore: calculateStructureActivityScore(spot),
    isTrending,
    type: mapLocationTypeToMeraType(spot.locationType),
    popularFish: spot.commonTargetSpecies,
    depthDesc: spot.depthStatus, // 'Doğrulanmış batimetri ölçümü bulunmuyor'
    bottomType: spot.verifiedGeoFeature,
    lat: spot.lat,
    lng: spot.lng,
    verificationStatus: spot.verificationStatus,
    verificationBadge: spot.verificationBadge,
    verificationNote: spot.verificationNote,
    cautions: spot.cautions
  };
});

// İstatistik sayaçları (Arayüzde şeffaf gösterim için)
export const MERA_STATS = {
  total: MERALAR_LIST.length, // 30
  samsunCount: MERALAR_LIST.filter(m => m.province === 'Samsun').length, // 13
  orduCount: MERALAR_LIST.filter(m => m.province === 'Ordu').length, // 17
  fizikiYapiTeyitliCount: MERALAR_LIST.filter(m => m.verificationStatus === 'FIZIKI_YAPI_TEYITLI').length, // 15
  cografiReferansCount: MERALAR_LIST.filter(m => m.verificationStatus === 'COGRAFI_REFERANS_NOKTASI').length, // 14
  teyitsizHatCount: MERALAR_LIST.filter(m => m.verificationStatus === 'GENIS_HAT_TEYITSIZ').length // 1
};
