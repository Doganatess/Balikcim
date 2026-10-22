export interface MeraSpot {
  id: string;
  name: string;
  province: string;
  district: string;
  distanceKm: number;
  activityScore: number; // 0 - 100
  isTrending: boolean;
  type: 'Kıyı' | 'Tekne' | 'Liman' | 'Kayalık' | 'Kumsal' | 'İç Su';
  popularFish: string[];
  depthDesc: string;
  bottomType: string;
}

export const MERALAR_LIST: MeraSpot[] = [
  {
    id: 'm1',
    name: 'Ordu, Merkez (Rıhtım & Taşbaşı)',
    province: 'Ordu',
    district: 'Merkez',
    distanceKm: 50,
    activityScore: 94,
    isTrending: true,
    type: 'Kayalık',
    popularFish: ['İstavrit', 'Lüfer', 'Minekop'],
    depthDesc: '6 - 15m',
    bottomType: 'Kırma Taş & Kayalık'
  },
  {
    id: 'm2',
    name: 'Ordu, Ünye (Mendirek Feneri)',
    province: 'Ordu',
    district: 'Ünye',
    distanceKm: 2,
    activityScore: 89,
    isTrending: true,
    type: 'Liman',
    popularFish: ['Çinekop', 'Minekop', 'İstavrit'],
    depthDesc: '8 - 14m',
    bottomType: 'Kırma Taş & Beton Blok'
  },
  {
    id: 'm3',
    name: 'Ordu, Fatsa (Balıkçı Barınağı)',
    province: 'Ordu',
    district: 'Fatsa',
    distanceKm: 18,
    activityScore: 88,
    isTrending: true,
    type: 'Kıyı',
    popularFish: ['İstavrit', 'Palamut'],
    depthDesc: '10 - 18m',
    bottomType: 'Kırma Taş'
  },
  {
    id: 'm4',
    name: 'Ordu, Merkez (Melet Ağzı)',
    province: 'Ordu',
    district: 'Merkez',
    distanceKm: 55,
    activityScore: 85,
    isTrending: true,
    type: 'Kumsal',
    popularFish: ['Levrek', 'Minekop', 'Kalkan'],
    depthDesc: '3 - 10m',
    bottomType: 'İnce Kumluk'
  },
  {
    id: 'm5',
    name: 'Ordu, Perşembe (Vona Limanı & Çaka)',
    province: 'Ordu',
    district: 'Perşembe',
    distanceKm: 34,
    activityScore: 82,
    isTrending: true,
    type: 'Kayalık',
    popularFish: ['Eşkina', 'Karagöz', 'İstavrit'],
    depthDesc: '8 - 22m',
    bottomType: 'Derin Kayalık & Kovuk'
  },
  {
    id: 'm6',
    name: 'İstanbul, Aşiyan (Boğaz Burnu)',
    province: 'İstanbul',
    district: 'Sarıyer',
    distanceKm: 850,
    activityScore: 96,
    isTrending: false,
    type: 'Kıyı',
    popularFish: ['Çinekop', 'Lüfer', 'İstavrit'],
    depthDesc: '35 - 55m',
    bottomType: 'Sert Akıntılı Burun'
  },
  {
    id: 'm7',
    name: 'İzmir, Çeşme Ildır Koyu',
    province: 'İzmir',
    district: 'Çeşme',
    distanceKm: 980,
    activityScore: 91,
    isTrending: false,
    type: 'Tekne',
    popularFish: ['Çipura', 'Sinarit', 'Mercan'],
    depthDesc: '12 - 30m',
    bottomType: 'Eriştelik & Taşlık'
  },
  {
    id: 'm8',
    name: 'Çanakkale, Kilitbahir Kale Altı',
    province: 'Çanakkale',
    district: 'Eceabat',
    distanceKm: 920,
    activityScore: 90,
    isTrending: false,
    type: 'Kıyı',
    popularFish: ['Lüfer', 'Torik', 'Sinarit'],
    depthDesc: '20 - 45m',
    bottomType: 'Boğaz Akıntılı Kayalık'
  },
  {
    id: 'm9',
    name: 'Sinop, İnceburun Kıyı Feneri',
    province: 'Sinop',
    district: 'Merkez',
    distanceKm: 210,
    activityScore: 87,
    isTrending: false,
    type: 'Kayalık',
    popularFish: ['Palamut', 'Lüfer', 'Levrek'],
    depthDesc: '15 - 35m',
    bottomType: 'Doğal Falez & Kayalık'
  },
  {
    id: 'm10',
    name: 'Sakarya, Sapanca Gölü (Sekapark)',
    province: 'Sakarya',
    district: 'Sapanca',
    distanceKm: 760,
    activityScore: 78,
    isTrending: false,
    type: 'İç Su',
    popularFish: ['Turna', 'Sazan', 'Yayın'],
    depthDesc: '3 - 12m',
    bottomType: 'Sazlık & Çamurluk'
  }
];
