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
  moonPhase: string;
  moonPhaseIcon: string;
  solunarRating: string;
  safetyStatus: 'Güvenli' | 'Orta Dalgalı' | 'Riskli - Kıyıdan Kal';
  bestWindow: string;
}

export interface Hotspot {
  id: string;
  name: string;
  distanceKm: number;
  depth: string;
  bottomType: 'Kayalık' | 'Kumluk' | 'Kırma Taş' | 'Eriştelik' | 'Derin Batık';
  targetSpecies: string[];
  probScore: number; // Yapısal referans indeksi (Balık yakalama garantisi değildir)
  latOffset: number;
  lngOffset: number;
}

export interface Region {
  id: string;
  name: string;
  city: string;
  province?: string;
  sea: 'Karadeniz' | 'Marmara' | 'Ege' | 'Akdeniz' | 'İç Sular';
  lat: number;
  lng: number;
  isWithinSamsunOrduScope: boolean;
  scopeNotice?: string;
  conditions: MarineCondition;
  hotspots: Hotspot[];
  activeCatchesTodayCount: number;
}

export const REGIONS: Region[] = [
  // 1. Samsun - Ordu Ana Kapsam Bölgeleri
  {
    id: 'unye-korfezi',
    name: 'Ünye Körfezi',
    city: 'Ordu',
    province: 'Ordu',
    sea: 'Karadeniz',
    lat: 41.132,
    lng: 37.283,
    isWithinSamsunOrduScope: true,
    conditions: {
      airTemp: 13.5,
      waterTemp: 19.5,
      rainChance: 5,
      waveHeight: 0.2,
      wavePeriod: 4,
      windSpeed: 8,
      windDirection: 'G',
      currentSpeed: 0.08,
      currentDirection: 'GB',
      cloudCoverage: 45,
      pressure: 1022,
      pressureTrend: 'steady',
      moonPhase: 'Hilal',
      moonPhaseIcon: '🌒',
      solunarRating: 'Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '05:45 - 08:30 / 17:30 - 20:00'
    },
    hotspots: [
      {
        id: 'unye-liman',
        name: 'Ünye Mendirek & Liman',
        distanceKm: 1.2,
        depth: 'Derinlik ölçümü yok (Yaklaşık 6-12m)',
        bottomType: 'Kırma Taş',
        targetSpecies: ['Çinekop', 'İstavrit', 'Minekop'],
        probScore: 90,
        latOffset: 0.004,
        lngOffset: -0.006
      },
      {
        id: 'unye-camlik',
        name: 'Çamlık Kıyıları & Fener',
        distanceKm: 2.4,
        depth: 'Sığ kayalık (Yaklaşık 3-8m)',
        bottomType: 'Kayalık',
        targetSpecies: ['Levrek', 'İstavrit', 'Eşkina'],
        probScore: 85,
        latOffset: -0.003,
        lngOffset: 0.008
      }
    ],
    activeCatchesTodayCount: 8
  },
  {
    id: 'fatsa-iskele',
    name: 'Fatsa Sahil & Liman',
    city: 'Ordu',
    province: 'Ordu',
    sea: 'Karadeniz',
    lat: 41.028,
    lng: 37.498,
    isWithinSamsunOrduScope: true,
    conditions: {
      airTemp: 13.8,
      waterTemp: 19.4,
      rainChance: 5,
      waveHeight: 0.2,
      wavePeriod: 4,
      windSpeed: 9,
      windDirection: 'G',
      currentSpeed: 0.07,
      currentDirection: 'D',
      cloudCoverage: 50,
      pressure: 1022,
      pressureTrend: 'steady',
      moonPhase: 'Hilal',
      moonPhaseIcon: '🌒',
      solunarRating: 'Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '05:45 - 08:30'
    },
    hotspots: [
      {
        id: 'fatsa-mendirek',
        name: 'Fatsa Ana Mendirek',
        distanceKm: 0.5,
        depth: 'Mendirek önü (Yaklaşık 8-15m)',
        bottomType: 'Kırma Taş',
        targetSpecies: ['İstavrit', 'Minekop', 'Palamut'],
        probScore: 88,
        latOffset: 0.003,
        lngOffset: 0.002
      }
    ],
    activeCatchesTodayCount: 6
  },
  {
    id: 'samsun-atakum',
    name: 'Samsun Sahil & Atakum',
    city: 'Samsun',
    province: 'Samsun',
    sea: 'Karadeniz',
    lat: 41.320,
    lng: 36.315,
    isWithinSamsunOrduScope: true,
    conditions: {
      airTemp: 13.2,
      waterTemp: 19.2,
      rainChance: 10,
      waveHeight: 0.3,
      wavePeriod: 4,
      windSpeed: 11,
      windDirection: 'G',
      currentSpeed: 0.09,
      currentDirection: 'D',
      cloudCoverage: 55,
      pressure: 1023,
      pressureTrend: 'down',
      moonPhase: 'Hilal',
      moonPhaseIcon: '🌒',
      solunarRating: 'Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '06:00 - 08:45 / 17:45 - 20:30'
    },
    hotspots: [
      {
        id: 'atakum-iskele',
        name: 'Atakum İskelesi & Kumsal',
        distanceKm: 0.8,
        depth: 'Sığ kumluk (Yaklaşık 3-6m)',
        bottomType: 'Kumluk',
        targetSpecies: ['Mırmır', 'Levrek', 'İstavrit'],
        probScore: 86,
        latOffset: 0.002,
        lngOffset: 0.003
      }
    ],
    activeCatchesTodayCount: 11
  },
  {
    id: 'persembe-vona',
    name: 'Perşembe Vona Yarımadası',
    city: 'Ordu',
    province: 'Ordu',
    sea: 'Karadeniz',
    lat: 41.065,
    lng: 37.770,
    isWithinSamsunOrduScope: true,
    conditions: {
      airTemp: 13.6,
      waterTemp: 19.6,
      rainChance: 5,
      waveHeight: 0.25,
      wavePeriod: 5,
      windSpeed: 10,
      windDirection: 'GB',
      currentSpeed: 0.10,
      currentDirection: 'KD',
      cloudCoverage: 40,
      pressure: 1022,
      pressureTrend: 'steady',
      moonPhase: 'Hilal',
      moonPhaseIcon: '🌒',
      solunarRating: 'Çok Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '05:30 - 08:30 / 18:00 - 20:30'
    },
    hotspots: [
      {
        id: 'vona-burun',
        name: 'Vona Fener & Kayalık Burun',
        distanceKm: 1.5,
        depth: 'Derin burun (Yaklaşık 12-25m)',
        bottomType: 'Kayalık',
        targetSpecies: ['Lüfer', 'Levrek', 'İstavrit', 'Eşkina'],
        probScore: 92,
        latOffset: 0.004,
        lngOffset: 0.005
      }
    ],
    activeCatchesTodayCount: 9
  },
  {
    id: 'altinordu-rihtim',
    name: 'Altınordu Kıyısı & Rıhtım',
    city: 'Ordu',
    province: 'Ordu',
    sea: 'Karadeniz',
    lat: 40.985,
    lng: 37.880,
    isWithinSamsunOrduScope: true,
    conditions: {
      airTemp: 13.7,
      waterTemp: 19.5,
      rainChance: 5,
      waveHeight: 0.2,
      wavePeriod: 4,
      windSpeed: 8,
      windDirection: 'G',
      currentSpeed: 0.06,
      currentDirection: 'D',
      cloudCoverage: 45,
      pressure: 1022,
      pressureTrend: 'steady',
      moonPhase: 'Hilal',
      moonPhaseIcon: '🌒',
      solunarRating: 'Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '06:00 - 08:30 / 18:00 - 20:00'
    },
    hotspots: [
      {
        id: 'ordu-rihtim',
        name: 'Altınordu Rıhtım Mendireği',
        distanceKm: 0.6,
        depth: 'Liman tahkimatı (Yaklaşık 8-14m)',
        bottomType: 'Kırma Taş',
        targetSpecies: ['İstavrit', 'Tirsi', 'Minekop'],
        probScore: 89,
        latOffset: 0.002,
        lngOffset: 0.003
      }
    ],
    activeCatchesTodayCount: 7
  },
  {
    id: 'carsamba-terme',
    name: 'Çarşamba & Terme Kıyıları',
    city: 'Samsun',
    province: 'Samsun',
    sea: 'Karadeniz',
    lat: 41.250,
    lng: 36.750,
    isWithinSamsunOrduScope: true,
    conditions: {
      airTemp: 13.0,
      waterTemp: 19.1,
      rainChance: 10,
      waveHeight: 0.35,
      wavePeriod: 4,
      windSpeed: 12,
      windDirection: 'KD',
      currentSpeed: 0.09,
      currentDirection: 'D',
      cloudCoverage: 60,
      pressure: 1023,
      pressureTrend: 'steady',
      moonPhase: 'Hilal',
      moonPhaseIcon: '🌒',
      solunarRating: 'Orta',
      safetyStatus: 'Güvenli',
      bestWindow: '06:00 - 09:00'
    },
    hotspots: [
      {
        id: 'terme-kumsal',
        name: 'Terme Çayı Ağzı & Kumsal',
        distanceKm: 2.1,
        depth: 'Sığ alüvyon (Yaklaşık 2-5m)',
        bottomType: 'Kumluk',
        targetSpecies: ['Kalkan', 'Levrek', 'Mefsun'],
        probScore: 84,
        latOffset: 0.003,
        lngOffset: 0.002
      }
    ],
    activeCatchesTodayCount: 5
  },

  // 2. Kapsam Dışı Referans Bölgesi (Açıkça Samsun-Ordu Kapsamı Dışı Olarak İşaretli)
  {
    id: 'asiyan-rumeli',
    name: 'Aşiyan - Rumelihisarı (Referans)',
    city: 'İstanbul',
    province: 'İstanbul',
    sea: 'Marmara',
    lat: 41.083,
    lng: 29.055,
    isWithinSamsunOrduScope: false,
    scopeNotice: 'Samsun–Ordu analiz sınırları dışındadır. Harita ve mera listesi yalnızca Samsun–Ordu kıyılarına odaklıdır.',
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
      moonPhase: 'Hilal',
      moonPhaseIcon: '🌒',
      solunarRating: 'Çok Yüksek',
      safetyStatus: 'Güvenli',
      bestWindow: '06:00 - 09:15'
    },
    hotspots: [
      {
        id: 'asiyan-fener',
        name: 'Aşiyan Fener Önü (Boğaz Referansı)',
        distanceKm: 0.2,
        depth: 'Boğaz akıntısı (Yaklaşık 35-55m)',
        bottomType: 'Kayalık',
        targetSpecies: ['Lüfer', 'Çinekop', 'İstavrit'],
        probScore: 92,
        latOffset: 0.002,
        lngOffset: 0.003
      }
    ],
    activeCatchesTodayCount: 14
  }
];
