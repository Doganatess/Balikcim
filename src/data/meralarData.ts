export interface MeraSpot {
  id: string;
  name: string;
  province: string;
  district: string;
  distanceKm: number;
  activityScore: number; // 0 - 100 model skoru
  isTrending: boolean;
  type: 'Kıyı' | 'Tekne' | 'Liman' | 'Kayalık' | 'Kumsal' | 'İç Su';
  popularFish: string[];
  depthDesc: string;
  bottomType: string;
}

export const MERALAR_LIST: MeraSpot[] = [
  // --- ORDU MERALARI ---
  {
    id: 'm-unye-liman',
    name: 'Ünye Liman Mendireği (Ana Fener)',
    province: 'Ordu',
    district: 'Ünye',
    distanceKm: 2,
    activityScore: 92,
    isTrending: true,
    type: 'Liman',
    popularFish: ['Çinekop', 'Lüfer', 'İstavrit', 'Palamut'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Yapay Taş Dolgu & Mendirek'
  },
  {
    id: 'm-unye-camlik',
    name: 'Ünye Çamlık Sahili & Falezleri',
    province: 'Ordu',
    district: 'Ünye',
    distanceKm: 3,
    activityScore: 89,
    isTrending: true,
    type: 'Kayalık',
    popularFish: ['Levrek', 'Eşkina', 'Karagöz', 'İstavrit'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Doğal Volkanik Kayalık & Kırık Taş'
  },
  {
    id: 'm-fatsa-barinak',
    name: 'Fatsa Balıkçı Barınağı Mendireği',
    province: 'Ordu',
    district: 'Fatsa',
    distanceKm: 18,
    activityScore: 88,
    isTrending: true,
    type: 'Liman',
    popularFish: ['İstavrit', 'Minekop', 'Palamut', 'Kefal'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Kırma Taş & Korunaklı İç Liman'
  },
  {
    id: 'm-persembe-yason',
    name: 'Perşembe Yason Burnu & Feneri',
    province: 'Ordu',
    district: 'Perşembe',
    distanceKm: 32,
    activityScore: 94,
    isTrending: true,
    type: 'Kayalık',
    popularFish: ['Lüfer', 'Palamut', 'Levrek', 'İstavrit'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Karadeniz\'e Uzanan Doğal Kaya Dili'
  },
  {
    id: 'm-persembe-vona',
    name: 'Perşembe Vona Limanı & Rıhtım',
    province: 'Ordu',
    district: 'Perşembe',
    distanceKm: 36,
    activityScore: 86,
    isTrending: true,
    type: 'Liman',
    popularFish: ['Eşkina', 'İstavrit', 'Karagöz', 'Mezgit'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Doğal Derin Koy & Balıkçı Rıhtımı'
  },
  {
    id: 'm-ordu-tasbasi',
    name: 'Ordu Rıhtım & Taşbaşı Kıyısı',
    province: 'Ordu',
    district: 'Altınordu',
    distanceKm: 50,
    activityScore: 91,
    isTrending: true,
    type: 'Kayalık',
    popularFish: ['İstavrit', 'Çinekop', 'Lüfer', 'Minekop'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Sahil Dolgusu & Taş Tahkimat'
  },
  {
    id: 'm-ordu-melet',
    name: 'Ordu Melet Irmağı Ağzı',
    province: 'Ordu',
    district: 'Altınordu',
    distanceKm: 54,
    activityScore: 85,
    isTrending: true,
    type: 'Kumsal',
    popularFish: ['Levrek', 'Minekop', 'Kalkan', 'Kefal'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Alüvyon Çakıl & Kumul Hat'
  },

  // --- SAMSUN MERALARI ---
  {
    id: 'm-samsun-batipark',
    name: 'Samsun Batı Park Mendireği',
    province: 'Samsun',
    district: 'İlkadım',
    distanceKm: 75,
    activityScore: 93,
    isTrending: true,
    type: 'Liman',
    popularFish: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Taş Tahkimat Blokları'
  },
  {
    id: 'm-samsun-kurupelit',
    name: 'Kurupelit Yat Limanı Mendireği',
    province: 'Samsun',
    district: 'Atakum',
    distanceKm: 85,
    activityScore: 88,
    isTrending: true,
    type: 'Liman',
    popularFish: ['İstavrit', 'Mezgit', 'Çinekop', 'Levrek'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Yapay Marin Mendirek'
  },
  {
    id: 'm-samsun-mert',
    name: 'Samsun Mert Irmağı Ağzı',
    province: 'Samsun',
    district: 'Canik',
    distanceKm: 72,
    activityScore: 87,
    isTrending: true,
    type: 'Kumsal',
    popularFish: ['Levrek', 'Minekop', 'Kefal', 'Kalkan'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Alüvyon Kumsal & Dere Ağzı'
  },
  {
    id: 'm-carsamba-delta',
    name: 'Çarşamba Yeşilırmak Deltası Civa Burnu',
    province: 'Samsun',
    district: 'Çarşamba',
    distanceKm: 55,
    activityScore: 90,
    isTrending: true,
    type: 'Kumsal',
    popularFish: ['Kalkan', 'Levrek', 'Minekop'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Geniş Delta Kumulları & Nehir Ağzı'
  },
  {
    id: 'm-terme-milic',
    name: 'Terme Miliç Sahili & Dere Ağzı',
    province: 'Samsun',
    district: 'Terme',
    distanceKm: 28,
    activityScore: 84,
    isTrending: true,
    type: 'Kumsal',
    popularFish: ['Kalkan', 'Levrek', 'Mırmır'],
    depthDesc: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    bottomType: 'Kumluk Plaj Sahili & Dere Ağzı'
  }
];
