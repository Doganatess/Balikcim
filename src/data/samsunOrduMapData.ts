export type CoastalLocationType = 
  | 'Mendirek / Taş Tahkimat'
  | 'Liman / Barınak İçi'
  | 'Doğal Kayalık Burun'
  | 'Kumsal / Plaj Şeridi'
  | 'Nehir / Dere Ağzı'
  | 'Açık Deniz'
  | 'Karasal Alan';

export interface VerifiedCoastalSpot {
  id: string;
  name: string;
  city: 'Samsun' | 'Ordu';
  district: string;
  lat: number;
  lng: number;
  locationType: CoastalLocationType;
  verifiedGeoFeature: string;
  commonTargetSpecies: string[];
  depthStatus: string; // e.g. "Ölçüm verisi yok (Bölgesel kıyı tahmini: 4-12m)"
  cautions: string;
}

// Bounding box for Samsun - Ordu coastal view
export const SAMSUN_ORDU_BOUNDS: [[number, number], [number, number]] = [
  [40.94, 36.20], // Southwest (Samsun inland/west)
  [41.35, 38.00]  // Northeast (Ordu marine/east)
];

export const SAMSUN_ORDU_CENTER: [number, number] = [41.15, 37.15];

// Verified coastal spots with real, verifiable GPS coordinates along Samsun-Ordu coast
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  {
    id: 'samsun-baruthane',
    name: 'Samsun Batı Park Mendireği',
    city: 'Samsun',
    district: 'İlkadım',
    lat: 41.3142,
    lng: 36.3195,
    locationType: 'Mendirek / Taş Tahkimat',
    verifiedGeoFeature: 'Karadeniz\'e uzanan yapay taş blok mendirek yapısı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    depthStatus: 'Resmi hidrografik batimetri ölçüm verisi bulunmamaktadır.',
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
    verifiedGeoFeature: 'Mert Irmağı\'nın Karadeniz ile buluştuğu kumsal alüvyon sahil',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kefal', 'Kalkan'],
    depthStatus: 'Ölçüm verisi yok (Kıyı sığ, dere debisine göre kum tepecikleri değişir).',
    cautions: 'Yağmur sonrası bulanık su; dip akıntısı ve sığ kum bankları.'
  },
  {
    id: 'carsamba-sahil',
    name: 'Çarşamba Kıyı Şeridi (Yeşilırmak Deltası)',
    city: 'Samsun',
    district: 'Çarşamba',
    lat: 41.2465,
    lng: 36.7210,
    locationType: 'Kumsal / Plaj Şeridi',
    verifiedGeoFeature: 'Yeşilırmak delta ovası geniş kumul sahil bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Minekop', 'Levrek'],
    depthStatus: 'Resmi batimetri ölçüm verisi bulunmamaktadır (Sığ eğimli kumsal).',
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
    verifiedGeoFeature: 'Miliç Çamı orman kenarı kumsal kıyı hattı',
    commonTargetSpecies: ['Kalkan', 'Levrek', 'Minekop'],
    depthStatus: 'Ölçüm verisi yok; kıyıdan ilk 50 metrede sığ derinlik hakimdir.',
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
    verifiedGeoFeature: 'Ünye Limanı dış mendireği ve açık deniz taş dolgusu',
    commonTargetSpecies: ['Çinekop', 'Lüfer', 'İstavrit', 'Palamut', 'Minekop'],
    depthStatus: 'Resmi batimetri ölçüm verisi bulunmamaktadır (Mendirek dışı derin su eğilimli).',
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
    verifiedGeoFeature: 'Falez ve doğal volkanik kayalık burun sahil şeridi',
    commonTargetSpecies: ['Levrek', 'İstavrit', 'Eşkina', 'Karagöz'],
    depthStatus: 'Ölçüm verisi yok; kayalık önü kademeli kırık taş zemindir.',
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
    verifiedGeoFeature: 'Fatsa Körfezi mendireği ve korunaklı iç liman',
    commonTargetSpecies: ['İstavrit', 'Minekop', 'Palamut', 'Kefal'],
    depthStatus: 'Ölçüm verisi yok (İç liman 4-8m, mendirek açığı daha derin).',
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
    verifiedGeoFeature: 'Karadeniz\'e dik uzanan tarihi Yason Burnu doğal kaya dili',
    commonTargetSpecies: ['Lüfer', 'Palamut', 'Levrek', 'İstavrit'],
    depthStatus: 'Ölçüm verisi yok (Burun ucunda güçlü akıntı ve aniden derinleşen yapı).',
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
    verifiedGeoFeature: 'Doğal korunaklı derin Vona koyu ve balıkçı rıhtımı',
    commonTargetSpecies: ['Eşkina', 'İstavrit', 'Karagöz', 'Mezgit'],
    depthStatus: 'Ölçüm verisi yok (Doğal derin koy yapısı).',
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
    verifiedGeoFeature: 'Altınordu sahil dolgusu ve Taşbaşı kayalık hattı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Minekop'],
    depthStatus: 'Ölçüm verisi yok (Kıyı taş dolgu önü 6-14m tahmini).',
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
    verifiedGeoFeature: 'Melet Irmağı\'nın denize karıştığı çakıl ve kumsal hat',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kalkan', 'Kefal'],
    depthStatus: 'Ölçüm verisi yok; alüvyon yataklı değişken sığlık.',
    cautions: 'Irmak akıntısı ve çakıllı zemin.'
  }
];

// Helper to determine coastal / marine / inland classification for any coordinate
export function classifyPointGeography(lat: number, lng: number): {
  zone: 'Deniz / Açık Su' | 'Kıyı Şeridi (Avlanabilir Hat)' | 'Karasal Alan (İç Kesim)';
  description: string;
  nearestSpot: VerifiedCoastalSpot | null;
  distanceToNearestSpotKm: number | null;
} {
  // Approximate Black Sea coastline latitude function f(lng) for Samsun - Ordu sector
  // Points between longitude 36.2 and 38.0
  let approxCoastLat = 41.15;
  if (lng <= 36.5) {
    // Samsun center
    approxCoastLat = 41.31 - (lng - 36.2) * 0.15;
  } else if (lng <= 36.9) {
    // Çarşamba / delta
    approxCoastLat = 41.25 - (lng - 36.5) * 0.08;
  } else if (lng <= 37.2) {
    // Terme
    approxCoastLat = 41.22 - (lng - 36.9) * 0.25;
  } else if (lng <= 37.4) {
    // Ünye
    approxCoastLat = 41.13 - (lng - 37.2) * 0.45;
  } else if (lng <= 37.6) {
    // Fatsa
    approxCoastLat = 41.03 + (lng - 37.4) * 0.45;
  } else if (lng <= 37.75) {
    // Yason Burnu
    approxCoastLat = 41.13 - (lng - 37.7) * 0.4;
  } else {
    // Perşembe to Ordu
    approxCoastLat = 41.06 - (lng - 37.75) * 0.4;
  }

  const deltaLat = lat - approxCoastLat;

  // Find nearest verified spot
  let nearestSpot: VerifiedCoastalSpot | null = null;
  let minDistanceKm = Infinity;

  VERIFIED_COASTAL_SPOTS.forEach(spot => {
    // Haversine approximation
    const dLat = (spot.lat - lat) * 111.32;
    const dLng = (spot.lng - lng) * 111.32 * Math.cos((lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistanceKm) {
      minDistanceKm = dist;
      nearestSpot = spot;
    }
  });

  if (deltaLat > 0.012) {
    return {
      zone: 'Deniz / Açık Su',
      description: 'Seçilen nokta kıyı çizgisinin kuzeyinde, açık deniz alanındadır. Tekne veya bot ile ulaşılabilir su sahasıdır.',
      nearestSpot: minDistanceKm <= 2.5 ? nearestSpot : null,
      distanceToNearestSpotKm: minDistanceKm <= 2.5 ? Math.round(minDistanceKm * 10) / 10 : null
    };
  } else if (deltaLat < -0.015) {
    return {
      zone: 'Karasal Alan (İç Kesim)',
      description: 'Seçilen koordinat kıyı çizgisinin güneyinde karasal alanda kalmaktadır. Deniz balıkçılığı için kıyı şeridine veya liman bölgesine yaklaşınız.',
      nearestSpot: minDistanceKm <= 3.0 ? nearestSpot : null,
      distanceToNearestSpotKm: minDistanceKm <= 3.0 ? Math.round(minDistanceKm * 10) / 10 : null
    };
  } else {
    return {
      zone: 'Kıyı Şeridi (Avlanabilir Hat)',
      description: 'Seçilen koordinat Karadeniz kıyı bandında yer almaktadır. Kıyıdan at-çek (spin), LRF veya yemli takım için uygun kıyı hattıdır.',
      nearestSpot,
      distanceToNearestSpotKm: Math.round(minDistanceKm * 10) / 10
    };
  }
}
