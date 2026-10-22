export interface MarineCondition {
  airTemp: number; // Hava °C
  waterTemp: number; // Deniz °C
  rainChance: number; // Yağış %
  waveHeight: number; // Dalga m
  wavePeriod: number; // Dalga periyodu s
  windSpeed: number; // Rüzgar km/sa
  windDirection: string; // G, KB, KD, vb.
  currentSpeed: number; // Akıntı m/s
  currentDirection: string; // GB, K, vb.
  cloudCoverage: number; // Bulut %
  pressure: number; // Basınç hPa
  pressureTrend: 'up' | 'down' | 'steady';
  moonPhase: string; // Şişkin, Dolunay, Hilal
  moonPhaseIcon: string;
  solunarRating: string; // Çok Yüksek, Yüksek, Orta
  safetyStatus: 'Güvenli' | 'Orta Dalgalı' | 'Riskli - Kıyıdan Kal';
  bestWindow: string; // "05:30 - 08:45"
}

export interface Hotspot {
  id: string;
  name: string;
  distanceKm: number;
  depth: string;
  bottomType: 'Kayalık' | 'Kumluk' | 'Kırma Taş' | 'Eriştelik' | 'Derin Batık';
  targetSpecies: string[];
  probScore: number;
  latOffset: number; // Relative map visual placement
  lngOffset: number;
}

export interface Region {
  id: string;
  name: string;
  city: string;
  sea: 'Karadeniz' | 'Marmara' | 'Ege' | 'Akdeniz' | 'İç Sular';
  lat: number;
  lng: number;
  conditions: MarineCondition;
  hotspots: Hotspot[];
  activeCatchesTodayCount: number;
}

export const REGIONS: Region[] = [
  {
    id: 'unye-korfezi',
    name: 'Ünye Körfezi',
    city: 'Ordu',
    sea: 'Karadeniz',
    lat: 41.132,
    lng: 37.283,
    conditions: {
      airTemp: 12.6,
      waterTemp: 19.7,
      rainChance: 0,
      waveHeight: 0.1,
      wavePeriod: 4,
      windSpeed: 6,
      windDirection: 'G',
      currentSpeed: 0.08,
      currentDirection: 'GB',
      cloudCoverage: 54,
      pressure: 1024,
      pressureTrend: 'down',
      moonPhase: 'Şişkin',
      moonPhaseIcon: '🌔',
      solunarRating: 'Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '05:30 - 08:45'
    },
    hotspots: [
      {
        id: 'unye-liman',
        name: 'Ünye Mendirek & Liman',
        distanceKm: 1.2,
        depth: '8 - 14m',
        bottomType: 'Kırma Taş',
        targetSpecies: ['Çinekop', 'İstavrit', 'Minekop'],
        probScore: 92,
        latOffset: 0.004,
        lngOffset: -0.006
      },
      {
        id: 'unye-camlik',
        name: 'Çamlık Kıyıları & Fener',
        distanceKm: 2.4,
        depth: '4 - 10m',
        bottomType: 'Kayalık',
        targetSpecies: ['Levrek', 'İstavrit', 'Eşkina'],
        probScore: 86,
        latOffset: -0.003,
        lngOffset: 0.008
      },
      {
        id: 'unye-uzunkum',
        name: 'Uzunkum Kumsalı Açıkları',
        distanceKm: 3.5,
        depth: '6 - 18m',
        bottomType: 'Kumluk',
        targetSpecies: ['Kalkan', 'Minekop', 'Mırmır'],
        probScore: 79,
        latOffset: 0.008,
        lngOffset: 0.012
      }
    ],
    activeCatchesTodayCount: 18
  },
  {
    id: 'asiyan-rumeli',
    name: 'Aşiyan - Rumelihisarı',
    city: 'İstanbul',
    sea: 'Marmara',
    lat: 41.083,
    lng: 29.055,
    conditions: {
      airTemp: 14.2,
      waterTemp: 17.5,
      rainChance: 10,
      waveHeight: 0.2,
      wavePeriod: 3,
      windSpeed: 11,
      windDirection: 'KD',
      currentSpeed: 0.35,
      currentDirection: 'G',
      cloudCoverage: 40,
      pressure: 1021,
      pressureTrend: 'steady',
      moonPhase: 'Şişkin',
      moonPhaseIcon: '🌔',
      solunarRating: 'Çok Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '06:00 - 09:15 / 19:00 - 22:00'
    },
    hotspots: [
      {
        id: 'asiyan-fener',
        name: 'Aşiyan Fener Önü (Ana Burun)',
        distanceKm: 0.2,
        depth: '35 - 55m',
        bottomType: 'Kayalık',
        targetSpecies: ['Lüfer', 'Çinekop', 'İstavrit'],
        probScore: 95,
        latOffset: 0.002,
        lngOffset: 0.003
      },
      {
        id: 'rumeli-kale',
        name: 'Rumeli Hisarı Kale Altı Akıntısı',
        distanceKm: 0.6,
        depth: '40 - 65m',
        bottomType: 'Kırma Taş',
        targetSpecies: ['Palamut', 'Lüfer'],
        probScore: 89,
        latOffset: -0.004,
        lngOffset: -0.002
      }
    ],
    activeCatchesTodayCount: 42
  },
  {
    id: 'fatsa-iskele',
    name: 'Fatsa Sahil & Liman',
    city: 'Ordu',
    sea: 'Karadeniz',
    lat: 41.028,
    lng: 37.498,
    conditions: {
      airTemp: 13.0,
      waterTemp: 19.5,
      rainChance: 5,
      waveHeight: 0.15,
      wavePeriod: 4,
      windSpeed: 8,
      windDirection: 'G',
      currentSpeed: 0.07,
      currentDirection: 'D',
      cloudCoverage: 60,
      pressure: 1023,
      pressureTrend: 'down',
      moonPhase: 'Şişkin',
      moonPhaseIcon: '🌔',
      solunarRating: 'Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '05:45 - 08:30'
    },
    hotspots: [
      {
        id: 'fatsa-mendirek',
        name: 'Fatsa Ana Mendirek',
        distanceKm: 0.5,
        depth: '10 - 16m',
        bottomType: 'Kırma Taş',
        targetSpecies: ['İstavrit', 'Minekop', 'Palamut'],
        probScore: 91,
        latOffset: 0.003,
        lngOffset: 0.002
      }
    ],
    activeCatchesTodayCount: 24
  },
  {
    id: 'cesme-ildir',
    name: 'Çeşme Ildır Körfezi',
    city: 'İzmir',
    sea: 'Ege',
    lat: 38.384,
    lng: 26.478,
    conditions: {
      airTemp: 18.4,
      waterTemp: 21.2,
      rainChance: 0,
      waveHeight: 0.3,
      wavePeriod: 5,
      windSpeed: 14,
      windDirection: 'B',
      currentSpeed: 0.05,
      currentDirection: 'B',
      cloudCoverage: 20,
      pressure: 1018,
      pressureTrend: 'steady',
      moonPhase: 'Şişkin',
      moonPhaseIcon: '🌔',
      solunarRating: 'Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '06:15 - 09:30'
    },
    hotspots: [
      {
        id: 'ildir-adalar',
        name: 'Ildır Adalar Geçişi',
        distanceKm: 1.8,
        depth: '12 - 28m',
        bottomType: 'Eriştelik',
        targetSpecies: ['Çipura', 'Karagöz', 'Levrek'],
        probScore: 94,
        latOffset: 0.005,
        lngOffset: -0.005
      }
    ],
    activeCatchesTodayCount: 31
  },
  {
    id: 'canakkale-kilitbahir',
    name: 'Çanakkale Boğazı (Kilitbahir)',
    city: 'Çanakkale',
    sea: 'Marmara',
    lat: 40.147,
    lng: 26.381,
    conditions: {
      airTemp: 15.1,
      waterTemp: 18.0,
      rainChance: 0,
      waveHeight: 0.4,
      wavePeriod: 3,
      windSpeed: 18,
      windDirection: 'KD',
      currentSpeed: 0.65,
      currentDirection: 'GB',
      cloudCoverage: 30,
      pressure: 1022,
      pressureTrend: 'steady',
      moonPhase: 'Şişkin',
      moonPhaseIcon: '🌔',
      solunarRating: 'Çok Yüksek',
      safetyStatus: 'Orta Dalgalı',
      bestWindow: '05:30 - 08:30 / 17:30 - 20:30'
    },
    hotspots: [
      {
        id: 'kilitbahir-kale',
        name: 'Kilitbahir Kale Burnu',
        distanceKm: 0.3,
        depth: '25 - 60m',
        bottomType: 'Kayalık',
        targetSpecies: ['Lüfer', 'Torik', 'Sinarit'],
        probScore: 90,
        latOffset: 0.002,
        lngOffset: 0.002
      }
    ],
    activeCatchesTodayCount: 29
  }
];
