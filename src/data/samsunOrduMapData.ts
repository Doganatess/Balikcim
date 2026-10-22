export type CoastalLocationType = 
  | 'Mendirek / Taş Tahkimat'
  | 'Liman / Barınak İçi'
  | 'Doğal Kayalık Burun'
  | 'Kumsal / Plaj Şeridi'
  | 'Nehir / Dere Ağzı'
  | 'Açık Deniz'
  | 'Karasal Alan';

export type SpotVerificationStatus = 
  | 'FIZIKI_YAPI_TEYITLI'        // Yalnızca fiziki liman/mendirek yapısının haritada varlığı teyitlidir
  | 'COGRAFI_REFERANS_NOKTASI'   // Yalnızca doğal coğrafi oluşumun konumu teyitlidir
  | 'GENIS_HAT_TEYITSIZ';        // Geniş hat; tekil mera teyitsizdir

export interface VerifiedCoastalSpot {
  id: string;
  name: string;
  city: 'Samsun' | 'Ordu';
  district: string;
  lat: number;
  lng: number;
  locationType: CoastalLocationType;
  verificationStatus: SpotVerificationStatus;
  verificationBadge: string;
  verificationNote: string;
  verifiedGeoFeature: string;
  commonTargetSpecies: string[];
  depthStatus: string;
  cautions: string;
}

// Bounding box for Samsun - Ordu coastal view
export const SAMSUN_ORDU_BOUNDS: [[number, number], [number, number]] = [
  [40.90, 36.15], // Southwest (Samsun inland/west)
  [41.42, 38.18]  // Northeast (Ordu marine/east)
];

export const SAMSUN_ORDU_CENTER: [number, number] = [41.15, 37.15];

// Yaklaşık, elle tanımlanmış kıyı referans çizgisi (Resmî harita veya tescilli kıyı kenar çizgisi değildir)
// Traced sequentially from West (Samsun Taflan) to East (Ordu-Giresun border)
export const SAMSUN_ORDU_COASTLINE: [number, number][] = [
  [41.3650, 36.1800], // Samsun Taflan
  [41.3480, 36.2450], // Samsun Atakum sahili
  [41.3250, 36.3000], // Samsun Baruthane
  [41.3142, 36.3195], // Samsun Batı Park Mendireği
  [41.2950, 36.3450], // Samsun Limanı
  [41.2891, 36.3620], // Mert Irmağı Ağzı
  [41.2650, 36.4200], // Samsun Doğupark / Sanayi
  [41.2480, 36.4800], // Tekkeköy kıyısı
  [41.2520, 36.5600], // Gelemen / Çarşamba batı kıyısı
  [41.2800, 36.6500], // Yeşilırmak Deltası batı yamacı
  [41.3750, 36.6850], // Civa Burnu (Yeşilırmak Deltası kuzey ucu)
  [41.3200, 36.7800], // Yeşilırmak Deltası doğu yamacı
  [41.2550, 36.8800], // Çarşamba doğu sahili
  [41.2280, 36.9700], // Terme batı sahili
  [41.2180, 37.0345], // Terme Miliç Çamlığı sahili
  [41.1950, 37.1000], // Terme Sakarlı sahili
  [41.1680, 37.1950], // Akçay (Samsun-Ordu il sınırı)
  [41.1390, 37.2400], // Ünye batı giriş sahili
  [41.1270, 37.2690], // Ünye Çamlık kayalıkları
  [41.1345, 37.2885], // Ünye Liman Mendireği
  [41.1200, 37.3300], // Ünye Cevizdere ağzı
  [41.0750, 37.4000], // Yalıköy / Çaytepe sahili
  [41.0450, 37.4500], // Fatsa batı sahili
  [41.0315, 37.5020], // Fatsa Balıkçı Barınağı Mendireği
  [41.0500, 37.5650], // Bolaman Burnu
  [41.0780, 37.6050], // Perşembe Çaka / Beyli
  [41.1000, 37.6400], // Medreseönü
  [41.1325, 37.6830], // Yason Burnu (Karadeniz'e uzanan doğal burun)
  [41.1150, 37.7400], // Çam Burnu
  [41.0665, 37.7680], // Perşembe Vona Limanı
  [41.0400, 37.8000], // Efirli sahili
  [41.0150, 37.8350], // Kumbaşı sahili
  [40.9880, 37.8765], // Ordu Taşbaşı & Şehir Rıhtımı
  [40.9715, 37.9350], // Melet Irmağı Ağzı
  [40.9650, 38.0100], // Turnasuyu sahili
  [40.9620, 38.0800], // Gülyalı / Havalimanı dolgu sahili
  [40.9580, 38.1500]  // Ordu-Giresun sınırı
];

// Avlak noktaları: Doğrulama YALNIZCA fiziki kıyı yapısının haritada varlığı ile sınırlıdır.
// Balık verimi, derinlik veya güvenlik doğrulanmamıştır.
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  {
    id: 'samsun-baruthane',
    name: 'Samsun Batı Park Mendireği',
    city: 'Samsun',
    district: 'İlkadım',
    lat: 41.3142,
    lng: 36.3195,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Mendirek)',
    verificationNote: 'Yalnızca taş blok mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, su derinliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Karadeniz\'e uzanan yapay taş blok mendirek yapısı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kayalık ve yosunlu taş zemin; kayma riski. Akıntılı havalarda dip takımı takılabilir.'
  },
  {
    id: 'samsun-mert-irmagi',
    name: 'Samsun Mert Irmağı Ağzı',
    city: 'Samsun',
    district: 'Canik',
    lat: 41.2891,
    lng: 36.3620,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Mert Irmağı ağzının coğrafi konumu teyitlidir. Balık verimi, su derinliği, kum bankı değişkenliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Mert Irmağı\'nın Karadeniz ile buluştuğu kumsal alüvyon sahil',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kefal', 'Kalkan'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Yağmur sonrası bulanık su; dip akıntısı ve değişken sığ kum bankları.'
  },
  {
    id: 'carsamba-sahil',
    name: 'Çarşamba Kıyı Şeridi (Yeşilırmak Deltası)',
    city: 'Samsun',
    district: 'Çarşamba',
    lat: 41.2465,
    lng: 36.7210,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'GENIS_HAT_TEYITSIZ',
    verificationBadge: 'Geniş Kıyı Hattı (Avlak Teyitsiz)',
    verificationNote: 'Yeşilırmak deltası boyunca uzanan geniş sahil bandıdır; sabit tekil bir avlak noktası değildir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Yeşilırmak delta ovası geniş kumul sahil bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Minekop', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Geniş kumluk kıyı; dip takımı ve surf kamış gerektirir. Çeken akıntı (rip) riski.'
  },
  {
    id: 'terme-milic',
    name: 'Terme Miliç Sahili & Dere Ağzı',
    city: 'Samsun',
    district: 'Terme',
    lat: 41.2180,
    lng: 37.0345,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Kıyı)',
    verificationNote: 'Yalnızca Miliç Çamlığı sahilinin coğrafi konumu teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Miliç Çamı orman kenarı kumsal kıyı hattı',
    commonTargetSpecies: ['Kalkan', 'Levrek', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kuzey rüzgarlarında yüksek dalga ve kıyı köpüklenmesi.'
  },
  {
    id: 'unye-liman-mendirek',
    name: 'Ünye Liman Mendireği (Ana Fener)',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1345,
    lng: 37.2885,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Liman / Mendirek)',
    verificationNote: 'Yalnızca Ünye Limanı dış mendireği ve fenerinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Ünye Limanı dış mendireği ve açık deniz taş dolgusu',
    commonTargetSpecies: ['Çinekop', 'Lüfer', 'İstavrit', 'Palamut', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Açık deniz tarafında sert Karadeniz çalkantısı ve rüzgar.'
  },
  {
    id: 'unye-camlik',
    name: 'Ünye Çamlık Sahili & Kayalıklar',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1270,
    lng: 37.2690,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Doğal Kayalık)',
    verificationNote: 'Yalnızca Çamlık falez ve kayalık burun hattının coğrafi konumu teyitlidir. Balık verimi, su derinliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Falez ve doğal volkanik kayalık burun sahil şeridi',
    commonTargetSpecies: ['Levrek', 'İstavrit', 'Eşkina', 'Karagöz'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Sarp kayalık zemin; sahte yem takılma riski yüksek (LRF ve spin tercih edilir).'
  },
  {
    id: 'fatsa-mendirek',
    name: 'Fatsa Balıkçı Barınağı Mendireği',
    city: 'Ordu',
    district: 'Fatsa',
    lat: 41.0315,
    lng: 37.5020,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Barınak / Mendirek)',
    verificationNote: 'Yalnızca Fatsa Balıkçı Barınağı mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Fatsa Körfezi mendireği ve korunaklı iç liman',
    commonTargetSpecies: ['İstavrit', 'Minekop', 'Palamut', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Tekne trafiği olan kanallara olta atmayınız.'
  },
  {
    id: 'persembe-yason',
    name: 'Perşembe Yason Burnu & Feneri',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.1325,
    lng: 37.6830,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Doğal Burun)',
    verificationNote: 'Yalnızca Yason Burnu doğal kara çıkıntısının coğrafi konumu teyitlidir. Balık verimi, su altı derinliği, akıntı şiddeti ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Karadeniz\'e dik uzanan tarihi Yason Burnu doğal kaya dili',
    commonTargetSpecies: ['Lüfer', 'Palamut', 'Levrek', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Şiddetli burun akıntısı ve ters dalga; kayalık üzerinde dikkatli olunmalı.'
  },
  {
    id: 'persembe-vona',
    name: 'Perşembe Vona Limanı',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.0665,
    lng: 37.7680,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Liman / Rıhtım)',
    verificationNote: 'Yalnızca Perşembe Vona Limanı rıhtım ve mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Doğal korunaklı derin Vona koyu ve balıkçı rıhtımı',
    commonTargetSpecies: ['Eşkina', 'İstavrit', 'Karagöz', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Gece avında aydınlatma gerekir. Rıhtım kenarları yosunlu olabilir.'
  },
  {
    id: 'ordu-tasbasi',
    name: 'Ordu Rıhtım & Taşbaşı Kıyısı',
    city: 'Ordu',
    district: 'Altınordu',
    lat: 40.9880,
    lng: 37.8765,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Rıhtım / Dolgu)',
    verificationNote: 'Yalnızca Altınordu Taşbaşı sahil dolgusu ve rıhtım yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Altınordu sahil dolgusu ve Taşbaşı kayalık hattı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Halk yürüyüş yolu üzeri; atış esnasında arkadaki yayalara dikkat edilmeli.'
  },
  {
    id: 'ordu-melet',
    name: 'Ordu Melet Irmağı Ağzı',
    city: 'Ordu',
    district: 'Altınordu',
    lat: 40.9715,
    lng: 37.9350,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Melet Irmağı ağzının coğrafi konumu teyitlidir. Balık verimi, derinlik, taban akıntısı ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Melet Irmağı\'nın denize karıştığı çakıl ve kumsal hat',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kalkan', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Irmak akıntısı ve çakıllı değişken zemin.'
  }
];

// Helper to calculate shortest distance (in km) from a point to a segment [p1, p2]
function distanceToSegmentKm(
  pLat: number, pLng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number
): { distanceKm: number; crossProduct: number } {
  const avgLat = ((aLat + bLat) / 2) * (Math.PI / 180);
  const kx = 111.32 * Math.cos(avgLat);
  const ky = 110.57;

  // Convert to local km coordinates relative to A
  const bx = (bLng - aLng) * kx;
  const by = (bLat - aLat) * ky;
  const px = (pLng - aLng) * kx;
  const py = (pLat - aLat) * ky;

  const segLenSq = bx * bx + by * by;
  let t = 0;
  if (segLenSq > 0) {
    t = (px * bx + py * by) / segLenSq;
    t = Math.max(0, Math.min(1, t));
  }

  // Projection point
  const projX = t * bx;
  const projY = t * by;

  const dx = px - projX;
  const dy = py - projY;
  const distanceKm = Math.sqrt(dx * dx + dy * dy);

  // 2D cross product: (B - A) x (P - A). Positive = North of coast (Sea in Black Sea sector)
  const crossProduct = bx * py - by * px;

  return { distanceKm, crossProduct };
}

export interface PointClassificationResult {
  zone: 'Deniz / Açık Su' | 'Kıyı Şeridi (Sahil / Kıyı Bandı)' | 'Karasal Alan (İç Kesim)' | 'Kapsam Dışı Alan';
  zoneType: 'deniz' | 'kiyi' | 'kara' | 'kapsam_disi';
  isWithinBounds: boolean;
  distanceToCoastKm: number | null;
  description: string;
  nearestSpot: VerifiedCoastalSpot | null;
  distanceToNearestSpotKm: number | null;
  dataNotice: string;
}

// Geometric coast classification using the 37-segment approximate reference polyline
export function classifyPointGeography(lat: number, lng: number): PointClassificationResult {
  // Check bounds: roughly 36.15 to 38.20 lng, 40.85 to 41.50 lat
  const isWithinBounds = lng >= 36.15 && lng <= 38.20 && lat >= 40.85 && lat <= 41.50;

  // Find nearest spot
  let nearestSpot: VerifiedCoastalSpot | null = null;
  let minSpotDistanceKm = Infinity;

  VERIFIED_COASTAL_SPOTS.forEach(spot => {
    const avgLat = ((spot.lat + lat) / 2) * (Math.PI / 180);
    const dLatKm = (spot.lat - lat) * 110.57;
    const dLngKm = (spot.lng - lng) * 111.32 * Math.cos(avgLat);
    const dist = Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm);
    if (dist < minSpotDistanceKm) {
      minSpotDistanceKm = dist;
      nearestSpot = spot;
    }
  });

  if (!isWithinBounds) {
    return {
      zone: 'Kapsam Dışı Alan',
      zoneType: 'kapsam_disi',
      isWithinBounds: false,
      distanceToCoastKm: null,
      description: 'Seçilen koordinat Samsun–Ordu kıyı analiz sınırları (36.15°D - 38.20°D) dışındadır. Bu alan için kıyı referans çizgisi bulunmamaktadır.',
      nearestSpot: null,
      distanceToNearestSpotKm: null,
      dataNotice: 'Koordinat çalışma alanı dışındadır; tahmin yapılmamaktadır.'
    };
  }

  // Calculate shortest distance to the 37-segment coastline
  let minCoastDistKm = Infinity;
  let dominantCrossProduct = 0;

  for (let i = 0; i < SAMSUN_ORDU_COASTLINE.length - 1; i++) {
    const [aLat, aLng] = SAMSUN_ORDU_COASTLINE[i];
    const [bLat, bLng] = SAMSUN_ORDU_COASTLINE[i + 1];

    const { distanceKm, crossProduct } = distanceToSegmentKm(lat, lng, aLat, aLng, bLat, bLng);
    if (distanceKm < minCoastDistKm) {
      minCoastDistKm = distanceKm;
      dominantCrossProduct = crossProduct;
    }
  }

  const roundedCoastDistKm = Math.round(minCoastDistKm * 100) / 100;
  const roundedSpotDistKm = Math.round(minSpotDistanceKm * 10) / 10;
  const dataNotice = 'Yaklaşık, elle tanımlanmış kıyı referans çizgisi (37 segment) kullanılarak hesaplanmıştır. Resmî veya doğrulanmış kıyı geometrisi değildir; 450 metre sınırı yaklaşık bir sınıflandırma eşiğidir.';

  // Within 450 meters (0.45 km) of reference coastline = Coastal Strip
  if (minCoastDistKm <= 0.45) {
    return {
      zone: 'Kıyı Şeridi (Sahil / Kıyı Bandı)',
      zoneType: 'kiyi',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistKm,
      description: `Seçilen koordinat elle tanımlanmış kıyı referans çizgisine ~${Math.round(minCoastDistKm * 1000)} metre mesafededir (yaklaşık sınıflandırma eşiği: 450 m). Resmî veya doğrulanmış kıyı kenar çizgisi değildir.`,
      nearestSpot,
      distanceToNearestSpotKm: roundedSpotDistKm,
      dataNotice
    };
  }

  // If cross product is positive (north of coast): Marine area
  if (dominantCrossProduct > 0) {
    return {
      zone: 'Deniz / Açık Su',
      zoneType: 'deniz',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistKm,
      description: `Seçilen nokta elle tanımlanmış kıyı referans çizgisinin ~${roundedCoastDistKm} km kuzeyinde açık deniz sahasındadır. Yalnızca tekne veya bot ile ulaşılabilir.`,
      nearestSpot: minSpotDistanceKm <= 3.5 ? nearestSpot : null,
      distanceToNearestSpotKm: minSpotDistanceKm <= 3.5 ? roundedSpotDistKm : null,
      dataNotice
    };
  }

  // Otherwise inland
  return {
    zone: 'Karasal Alan (İç Kesim)',
    zoneType: 'kara',
    isWithinBounds: true,
    distanceToCoastKm: roundedCoastDistKm,
    description: `Seçilen nokta elle tanımlanmış kıyı referans çizgisinin ~${roundedCoastDistKm} km güneyinde karasal alandadır. Deniz kıyısına veya liman bölgesine yaklaşınız.`,
    nearestSpot: minSpotDistanceKm <= 3.0 ? nearestSpot : null,
    distanceToNearestSpotKm: minSpotDistanceKm <= 3.0 ? roundedSpotDistKm : null,
    dataNotice
  };
}
