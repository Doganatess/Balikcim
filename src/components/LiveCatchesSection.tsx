import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Check, 
  Info, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  BookOpen,
  ShieldCheck 
} from 'lucide-react';
import { 
  CatchRecord, 
  getStoredCatches, 
  saveCatchRecord, 
  updateCatchRecord, 
  deleteCatchRecord 
} from '../data/catchesData';
import { Region } from '../data/regionsData';

interface LiveCatchesSectionProps {
  region: Region;
}

export const LiveCatchesSection: React.FC<LiveCatchesSectionProps> = ({ region }) => {
  const [catches, setCatches] = useState<CatchRecord[]>([]);
  const [filterMode, setFilterMode] = useState<'yakinimda' | 'turkiye'>('yakinimda');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatchRecord | null>(null);

  // Form states
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formSpecies, setFormSpecies] = useState('İstavrit');
  const [formQuantity, setFormQuantity] = useState(3);
  const [formWeightKg, setFormWeightKg] = useState<number | ''>('');
  const [formLocation, setFormLocation] = useState(region.name);
  const [formGear, setFormGear] = useState('');
  const [formBait, setFormBait] = useState('');
  const [formNotes, setFormNotes] = useState('');

  useEffect(() => {
    setCatches(getStoredCatches());
  }, []);

  const filteredCatches = catches.filter(item => {
    if (filterMode === 'yakinimda') {
      return item.isNearMe || item.province === region.city;
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormSpecies('İstavrit');
    setFormQuantity(3);
    setFormWeightKg('');
    setFormLocation(region.name);
    setFormGear('');
    setFormBait('');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CatchRecord) => {
    setEditingItem(item);
    setFormDate(item.date || new Date().toISOString().split('T')[0]);
    setFormSpecies(item.species);
    setFormQuantity(item.quantity || 1);
    setFormWeightKg(item.weightKg ?? '');
    setFormLocation(item.locationName);
    setFormGear(item.gearUsed || '');
    setFormBait(item.baitUsed || '');
    setFormNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      const updatedRecord: CatchRecord = {
        ...editingItem,
        species: formSpecies,
        quantity: Math.max(1, Number(formQuantity)),
        weightKg: formWeightKg !== '' ? Number(formWeightKg) : undefined,
        locationName: formLocation,
        date: formDate,
        gearUsed: formGear || undefined,
        baitUsed: formBait || undefined,
        notes: formNotes || undefined,
        isPersonal: true
      };

      const updated = updateCatchRecord(updatedRecord);
      setCatches(updated);
    } else {
      const newRecord: CatchRecord = {
        id: `p-${Date.now()}`,
        species: formSpecies,
        quantity: Math.max(1, Number(formQuantity)),
        weightKg: formWeightKg !== '' ? Number(formWeightKg) : undefined,
        locationName: formLocation || region.name,
        province: region.city,
        timing: 'Bugün',
        date: formDate,
        gearUsed: formGear || undefined,
        baitUsed: formBait || undefined,
        notes: formNotes || undefined,
        isNearMe: true,
        thumbnailColor: 'from-cyan-700 to-blue-900',
        isPersonal: true,
        dateAdded: new Date().toLocaleDateString('tr-TR')
      };

      const updated = saveCatchRecord(newRecord);
      setCatches(updated);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu av kaydını silmek istediğinize emin misiniz?')) {
      const updated = deleteCatchRecord(id);
      setCatches(updated);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      
      {/* Top action row */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Kişisel ve Örnek Av Raporları</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Samsun–Ordu kıyı kayıtları ve cihazınızdaki av defteri verileri
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-3 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-cyan-950 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Av Ekle</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-[#090e17] border border-slate-800 p-4 sm:p-5 shadow-xl space-y-3.5">
        
        {/* Transparency Disclaimer Banner */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong className="text-white">Şeffaflık Notu:</strong> Bu liste canlı bir topluluk/sosyal ağ akışı değildir. Kendi eklediğiniz avlar yalnızca bu cihazın yerel belleğinde saklanır. Diğer kayıtlar bölgesel referans amaçlı örneklerdir.
          </div>
        </div>

        {/* Top bar inside container */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-[11px] tracking-wide">
              <BookOpen className="w-3 h-3" />
              <span>Av Defteri & Raporlar</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 text-[11px] font-semibold text-slate-200">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="truncate max-w-[120px]">{region.name}</span>
            </div>
          </div>

          {/* Filter Pills: [Yakınımda] vs [Tüm Kayıtlar] */}
          <div className="flex p-0.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('yakinimda')}
              className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                filterMode === 'yakinimda'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Samsun–Ordu
            </button>
            <button
              onClick={() => setFilterMode('turkiye')}
              className={`px-3 py-1.5 rounded-xl font-bold transition text-[11px] ${
                filterMode === 'turkiye'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tüm Kayıtlar
            </button>
          </div>
        </div>

        {/* Section date label */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{filterMode === 'yakinimda' ? 'Samsun – Ordu Kıyı Raporları' : 'Tüm Kayıt ve Referans Raporlar'}</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {filteredCatches.length} rapor
          </span>
        </div>

        {/* List of catch cards */}
        <div className="space-y-2">
          {filteredCatches.map((item) => (
            <div
              key={item.id}
              className={`p-3 sm:p-3.5 rounded-2xl bg-[#111927] border transition flex flex-col gap-2 ${
                item.isPersonal ? 'border-cyan-800/60 bg-gradient-to-r from-[#111927] to-[#0d1e30]' : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Rounded square fish thumbnail */}
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.thumbnailColor} p-0.5 shadow-md flex items-center justify-center shrink-0`}>
                    <div className="w-full h-full bg-slate-900/60 rounded-[14px] flex items-center justify-center text-lg backdrop-blur-sm">
                      🐟
                    </div>
                  </div>

                  <div>
                    <div className="font-bold text-white text-sm leading-snug flex items-center gap-1.5">
                      <span>{item.species}</span>
                      {item.isPersonal ? (
                        <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded font-semibold border border-cyan-700">
                          Benim Avım
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded font-normal">
                          Örnek Model
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {item.quantity} adet {item.weightKg ? `(${item.weightKg} kg)` : ''}
                    </div>
                  </div>
                </div>

                {/* Right side location & timing */}
                <div className="text-right">
                  <div className="font-semibold text-cyan-400 text-xs sm:text-sm">
                    {item.locationName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.province}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                    {item.date || item.timing}
                  </div>
                </div>
              </div>

              {/* Notes / Gear details if present */}
              {(item.gearUsed || item.baitUsed || item.notes) && (
                <div className="text-[11px] text-slate-300 bg-slate-900/70 p-2 rounded-xl border border-slate-800/50 flex flex-wrap gap-x-3 gap-y-0.5">
                  {item.gearUsed && <span><strong className="text-slate-400">Takım:</strong> {item.gearUsed}</span>}
                  {item.baitUsed && <span><strong className="text-slate-400">Yem:</strong> {item.baitUsed}</span>}
                  {item.notes && <span><strong className="text-slate-400">Not:</strong> {item.notes}</span>}
                </div>
              )}

              {/* Actions for personal records */}
              {item.isPersonal && (
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60 text-xs">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 text-[11px] transition px-2 py-0.5 rounded hover:bg-slate-800"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-[11px] transition px-2 py-0.5 rounded hover:bg-slate-800"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Sil</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCatches.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs">
            Bu filtrede henüz kayıtlı av bulunmuyor.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-sm bg-[#0e1726] border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-3.5 my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-base font-bold text-white">
                {editingItem ? 'Av Kaydını Düzenle' : 'Yeni Av Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Balık Türü
                </label>
                <select
                  value={formSpecies}
                  onChange={(e) => setFormSpecies(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="İstavrit">İstavrit</option>
                  <option value="Çinekop">Çinekop</option>
                  <option value="Sarıkanat">Sarıkanat</option>
                  <option value="Lüfer">Lüfer</option>
                  <option value="Palamut">Palamut</option>
                  <option value="Minekop">Minekop</option>
                  <option value="Levrek">Levrek</option>
                  <option value="Eşkina">Eşkina</option>
                  <option value="Karagöz">Karagöz</option>
                  <option value="Kalkan">Kalkan</option>
                  <option value="Mezgit">Mezgit</option>
                  <option value="Zargana">Zargana</option>
                  <option value="Kefal">Kefal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Adet
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Ağırlık (kg, Opsiyonel)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Örn: 1.2"
                    value={formWeightKg}
                    onChange={(e) => setFormWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mera / Konum Adı
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Kullanılan Yem / Takım / Not
                </label>
                <input
                  type="text"
                  placeholder="Örn: Simli çapari, Spin kaşık"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-950 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingItem ? 'Güncelle' : 'Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
