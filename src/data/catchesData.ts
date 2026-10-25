export interface CatchWeatherInfo {
  temperature?: number;
  windSpeedKmh?: number;
  waveHeightM?: number;
  description?: string;
  isForecast?: boolean;
}

export interface CatchRecord {
  id: string;
  species: string;
  quantity: number;
  weightKg?: number;
  locationName: string;
  province: string;
  date?: string; // YYYY-MM-DD or readable date
  timing: string; // 'Dün', 'Bugün', '14:30', vb.
  gearUsed?: string;
  baitUsed?: string;
  notes?: string;
  weatherObserved?: CatchWeatherInfo;
  isNearMe: boolean;
  thumbnailColor: string;
  isPersonal?: boolean; // True if created by user on this device
  dateAdded?: string;
}

export interface PersonalCatchStats {
  hasRecords: boolean;
  totalRecords: number;
  totalFishCount: number;
  totalWeightKg: number;
  speciesBreakdown: { species: string; count: number; weightKg: number }[];
  spotBreakdown: { spotName: string; count: number }[];
  latestDate?: string;
}

export const INITIAL_CATCHES: CatchRecord[] = [
  {
    id: 'c1',
    species: 'İstavrit',
    quantity: 4,
    locationName: 'Fatsa Sahil',
    province: 'Ordu',
    timing: 'Dün',
    date: '2026-10-24',
    gearUsed: '10\'lu organze çapari',
    baitUsed: 'Simli çapari',
    notes: 'Kıyıdan akşam suyu çapari çalışması',
    weatherObserved: {
      temperature: 15,
      windSpeedKmh: 12,
      waveHeightM: 0.4,
      description: 'Hafif esintili, sakin deniz'
    },
    isNearMe: true,
    thumbnailColor: 'from-emerald-700 to-teal-900',
    isPersonal: false
  },
  {
    id: 'c2',
    species: 'Palamut',
    quantity: 1,
    weightKg: 0.9,
    locationName: 'Kirazlimanı',
    province: 'Ordu',
    timing: 'Dün',
    date: '2026-10-24',
    gearUsed: 'Trolling rapala',
    baitUsed: '9 cm sahte balık',
    notes: 'Kıyı arkası akıntı ağzında vuruş',
    weatherObserved: {
      temperature: 16,
      windSpeedKmh: 16,
      waveHeightM: 0.6,
      description: 'Poyraz hafif dalgalı'
    },
    isNearMe: true,
    thumbnailColor: 'from-blue-700 to-indigo-950',
    isPersonal: false
  },
  {
    id: 'c3',
    species: 'Palamut',
    quantity: 1,
    weightKg: 1.1,
    locationName: 'Kışla Burnu',
    province: 'Ordu',
    timing: 'Dün',
    date: '2026-10-24',
    gearUsed: 'Kaşık',
    baitUsed: 'Hansen kaşık 28g',
    notes: 'Sabah erken saatte hızlı sarım',
    isNearMe: true,
    thumbnailColor: 'from-blue-800 to-slate-900',
    isPersonal: false
  },
  {
    id: 'c4',
    species: 'Minekop',
    quantity: 3,
    weightKg: 2.4,
    locationName: 'Kirazlimanı',
    province: 'Ordu',
    timing: '2 gün önce',
    date: '2026-10-23',
    gearUsed: 'Klasik dip takımı',
    baitUsed: 'Canlı boru kurdu',
    notes: 'Kumluk dip yapısı, gece avı',
    isNearMe: true,
    thumbnailColor: 'from-teal-800 to-cyan-950',
    isPersonal: false
  },
  {
    id: 'c5',
    species: 'Minekop',
    quantity: 1,
    weightKg: 1.5,
    locationName: 'Kışla Plajı',
    province: 'Ordu',
    timing: '3 gün önce',
    date: '2026-10-22',
    gearUsed: 'Yemli dip takımı',
    baitUsed: 'Teke & Boru kurdu',
    isNearMe: true,
    thumbnailColor: 'from-cyan-800 to-slate-900',
    isPersonal: false
  },
  {
    id: 'c6',
    species: 'Minekop',
    quantity: 1,
    weightKg: 1.2,
    locationName: 'Yalıköy',
    province: 'Ordu',
    timing: '4 gün önce',
    date: '2026-10-21',
    gearUsed: 'Dip oltası',
    baitUsed: 'Sülünez',
    isNearMe: true,
    thumbnailColor: 'from-emerald-800 to-slate-950',
    isPersonal: false
  },
  {
    id: 'c7',
    species: 'Minekop',
    quantity: 2,
    weightKg: 2.1,
    locationName: 'Perşembe Vona',
    province: 'Ordu',
    timing: '5 gün önce',
    date: '2026-10-20',
    gearUsed: 'Fosforlu dip takımı',
    baitUsed: 'Boru kurdu',
    isNearMe: true,
    thumbnailColor: 'from-teal-900 to-cyan-950',
    isPersonal: false
  },
  {
    id: 'c8',
    species: 'Lüfer',
    quantity: 3,
    weightKg: 1.8,
    locationName: 'Aşiyan (Referans Mera)',
    province: 'İstanbul',
    timing: 'Geçen hafta',
    date: '2026-10-18',
    gearUsed: 'Uzun olta',
    baitUsed: 'Canlı zargana',
    notes: 'İstanbul Boğazı referans kıyaslama kaydı (Samsun-Ordu dışı)',
    isNearMe: false,
    thumbnailColor: 'from-blue-600 to-sky-900',
    isPersonal: false
  },
  {
    id: 'c9',
    species: 'Çipura',
    quantity: 2,
    weightKg: 1.4,
    locationName: 'Ildır (Referans Mera)',
    province: 'İzmir',
    timing: 'Geçen hafta',
    date: '2026-10-17',
    gearUsed: 'Surf casting',
    baitUsed: 'Canlı mamun',
    notes: 'Ege referans kıyaslama kaydı',
    isNearMe: false,
    thumbnailColor: 'from-amber-600 to-yellow-900',
    isPersonal: false
  },
  {
    id: 'c10',
    species: 'Levrek',
    quantity: 1,
    weightKg: 2.6,
    locationName: 'Sarıyer (Referans Mera)',
    province: 'İstanbul',
    timing: 'Geçen hafta',
    date: '2026-10-16',
    gearUsed: 'Spin (WTD topwater)',
    baitUsed: 'Rover 128 sahte',
    notes: 'Marmara referans kıyaslama kaydı',
    isNearMe: false,
    thumbnailColor: 'from-slate-600 to-zinc-900',
    isPersonal: false
  }
];

// Local Storage keys for personal data
const CATCHES_STORAGE_KEY = 'balik_yakala_catches_v2';
const FAVORITES_STORAGE_KEY = 'balik_yakala_favorites_v1';

export function getStoredCatches(): CatchRecord[] {
  try {
    const raw = localStorage.getItem(CATCHES_STORAGE_KEY);
    if (!raw) return INITIAL_CATCHES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATCHES;
  } catch (e) {
    return INITIAL_CATCHES;
  }
}

export function saveCatchRecord(record: CatchRecord): CatchRecord[] {
  const current = getStoredCatches();
  const updated = [record, ...current];
  try {
    localStorage.setItem(CATCHES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
  return updated;
}

export function updateCatchRecord(record: CatchRecord): CatchRecord[] {
  const current = getStoredCatches();
  const updated = current.map(item => item.id === record.id ? record : item);
  try {
    localStorage.setItem(CATCHES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage update error:', e);
  }
  return updated;
}

export function deleteCatchRecord(id: string): CatchRecord[] {
  const current = getStoredCatches();
  const updated = current.filter(c => c.id !== id);
  try {
    localStorage.setItem(CATCHES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage delete error:', e);
  }
  return updated;
}

export function calculatePersonalCatchStats(catches: CatchRecord[]): PersonalCatchStats {
  const personalRecords = catches.filter(c => c.isPersonal);
  if (personalRecords.length === 0) {
    return {
      hasRecords: false,
      totalRecords: 0,
      totalFishCount: 0,
      totalWeightKg: 0,
      speciesBreakdown: [],
      spotBreakdown: []
    };
  }

  let totalFishCount = 0;
  let totalWeightKg = 0;
  const speciesMap: Record<string, { count: number; weightKg: number }> = {};
  const spotMap: Record<string, number> = {};

  personalRecords.forEach(record => {
    const qty = Number(record.quantity) || 1;
    const wt = Number(record.weightKg) || 0;
    totalFishCount += qty;
    totalWeightKg += wt;

    if (!speciesMap[record.species]) {
      speciesMap[record.species] = { count: 0, weightKg: 0 };
    }
    speciesMap[record.species].count += qty;
    speciesMap[record.species].weightKg += wt;

    const loc = record.locationName || 'Belirtilmemiş Mera';
    spotMap[loc] = (spotMap[loc] || 0) + qty;
  });

  const speciesBreakdown = Object.entries(speciesMap)
    .map(([species, data]) => ({
      species,
      count: data.count,
      weightKg: Math.round(data.weightKg * 10) / 10
    }))
    .sort((a, b) => b.count - a.count);

  const spotBreakdown = Object.entries(spotMap)
    .map(([spotName, count]) => ({ spotName, count }))
    .sort((a, b) => b.count - a.count);

  return {
    hasRecords: true,
    totalRecords: personalRecords.length,
    totalFishCount,
    totalWeightKg: Math.round(totalWeightKg * 10) / 10,
    speciesBreakdown,
    spotBreakdown,
    latestDate: personalRecords[0]?.date || personalRecords[0]?.timing
  };
}

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return ['unye-liman-mendirek', 'samsun-baruthane'];
    return JSON.parse(raw);
  } catch (e) {
    return ['unye-liman-mendirek', 'samsun-baruthane'];
  }
}

export function toggleFavoriteSpot(spotId: string): string[] {
  const current = getStoredFavorites();
  const updated = current.includes(spotId)
    ? current.filter(id => id !== spotId)
    : [...current, spotId];
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage fav error:', e);
  }
  return updated;
}
