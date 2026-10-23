export interface CatchRecord {
  id: string;
  species: string;
  quantity: number;
  weightKg?: number;
  locationName: string;
  province: string;
  timing: string; // 'Dün', 'Bugün', '2 saat önce'
  gearUsed?: string;
  baitUsed?: string;
  isNearMe: boolean; // For "Yakınımda" vs "Türkiye" filter
  thumbnailColor: string;
  isPersonal?: boolean; // True if logged by the user on this device
  dateAdded?: string;
}

export const INITIAL_CATCHES: CatchRecord[] = [
  {
    id: 'c1',
    species: 'İstavrit',
    quantity: 4,
    locationName: 'Fatsa',
    province: 'Ordu',
    timing: 'Dün',
    gearUsed: '10\'lu organze çapari',
    baitUsed: 'Simli çapari',
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
    gearUsed: 'Trolling rapala',
    baitUsed: '9 cm sahte balık',
    isNearMe: true,
    thumbnailColor: 'from-blue-700 to-indigo-950',
    isPersonal: false
  },
  {
    id: 'c3',
    species: 'Palamut',
    quantity: 1,
    weightKg: 1.1,
    locationName: 'Kışla',
    province: 'Ordu',
    timing: 'Dün',
    gearUsed: 'Kaşık',
    baitUsed: 'Hansen kaşık 28g',
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
    timing: 'Dün',
    gearUsed: 'Klasik dip takımı',
    baitUsed: 'Canlı boru kurdu',
    isNearMe: true,
    thumbnailColor: 'from-teal-800 to-cyan-950',
    isPersonal: false
  },
  {
    id: 'c5',
    species: 'Minekop',
    quantity: 1,
    weightKg: 1.5,
    locationName: 'Kışla',
    province: 'Ordu',
    timing: 'Dün',
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
    timing: 'Dün',
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
    locationName: 'Perşembe',
    province: 'Ordu',
    timing: 'Dün',
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
    locationName: 'Aşiyan',
    province: 'İstanbul',
    timing: 'Bugün',
    gearUsed: 'Uzun olta',
    baitUsed: 'Canlı zargana',
    isNearMe: false,
    thumbnailColor: 'from-blue-600 to-sky-900',
    isPersonal: false
  },
  {
    id: 'c9',
    species: 'Çipura',
    quantity: 2,
    weightKg: 1.4,
    locationName: 'Ildır',
    province: 'İzmir',
    timing: 'Bugün',
    gearUsed: 'Surf casting',
    baitUsed: 'Canlı mamun',
    isNearMe: false,
    thumbnailColor: 'from-amber-600 to-yellow-900',
    isPersonal: false
  },
  {
    id: 'c10',
    species: 'Levrek',
    quantity: 1,
    weightKg: 2.6,
    locationName: 'Sarıyer',
    province: 'İstanbul',
    timing: 'Bugün',
    gearUsed: 'Spin (WTD topwater)',
    baitUsed: 'Rover 128 sahte',
    isNearMe: false,
    thumbnailColor: 'from-slate-600 to-zinc-900',
    isPersonal: false
  }
];

// Local Storage helpers for personal catch records
const CATCHES_STORAGE_KEY = 'balik_yakala_catches_v1';
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

export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return ['unye-liman-mendirek', 'samsun-baruthane']; // Default verified favorites
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
