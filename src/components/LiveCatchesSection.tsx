import React, { useState, useEffect } from 'react';
import { Calendar, Plus, MapPin, Check, Sparkles, Filter } from 'lucide-react';
import { CatchRecord, getStoredCatches, saveCatchRecord } from '../data/catchesData';
import { Region } from '../data/regionsData';

interface LiveCatchesSectionProps {
  region: Region;
}

export const LiveCatchesSection: React.FC<LiveCatchesSectionProps> = ({ region }) => {
  const [catches, setCatches] = useState<CatchRecord[]>([]);
  const [filterMode, setFilterMode] = useState<'yakinimda' | 'turkiye'>('yakinimda');
  const [showAddCatchModal, setShowAddCatchModal] = useState(false);

  // Form state
  const [newSpecies, setNewSpecies] = useState('İstavrit');
  const [newQuantity, setNewQuantity] = useState(3);
  const [newLocation, setNewLocation] = useState(region.name);

  useEffect(() => {
    setCatches(getStoredCatches());
  }, []);

  const filteredCatches = catches.filter(item => {
    if (filterMode === 'yakinimda') {
      return item.isNearMe || item.province === region.city;
    }
    return true;
  });

  const handleAddCatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CatchRecord = {
      id: `c-${Date.now()}`,
      species: newSpecies,
      quantity: Number(newQuantity),
      locationName: newLocation,
      province: region.city,
      timing: 'Az önce',
      isNearMe: true,
      thumbnailColor: 'from-cyan-700 to-blue-900',
      isPersonal: true,
      dateAdded: new Date().toLocaleDateString('tr-TR')
    };

    const updated = saveCatchRecord(newRecord);
    setCatches(updated);
    setShowAddCatchModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      
      {/* Top action row */}
      <div className="flex items-center justify-between pb-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Canlı Av Akışı</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </h2>
          <p className="text-[11px] text-slate-400">
            Kıyı ve tekne av raporları (Örnek model ve kişisel kayıtlar)
          </p>
        </div>

        <button
          onClick={() => setShowAddCatchModal(true)}
          className="px-3 py-1.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-cyan-950 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Av Ekle</span>
        </button>
      </div>

      {/* The Live Container directly matching IMG_5963 */}
      <div className="rounded-3xl bg-[#090e17] border border-slate-800 p-4 sm:p-5 shadow-xl">
        
        {/* Top bar inside container matching IMG_5963 */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-extrabold text-[11px] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>CANLI</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800/80 text-xs font-semibold text-slate-200">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{region.name}</span>
            </div>
          </div>

          {/* Filter Pills: [Yakınımda] vs [Türkiye •] matching IMG_5963 */}
          <div className="flex p-0.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('yakinimda')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                filterMode === 'yakinimda'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yakınımda
            </button>
            <button
              onClick={() => setFilterMode('turkiye')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1 transition ${
                filterMode === 'turkiye'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Türkiye</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            </button>
          </div>
        </div>

        {/* Section date label matching IMG_5963 */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2.5 px-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{filterMode === 'yakinimda' ? 'Bölgenizdeki Son Avlar' : 'Türkiye Geneli Av Akışı'}</span>
        </div>

        {/* List of catch cards matching IMG_5963 */}
        <div className="space-y-2">
          {filteredCatches.map((item) => (
            <div
              key={item.id}
              className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {/* Rounded square blurred/ambient fish thumbnail matching IMG_5963 */}
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${item.thumbnailColor} p-0.5 shadow-md flex items-center justify-center shrink-0`}>
                  <div className="w-full h-full bg-slate-900/60 rounded-[14px] flex items-center justify-center text-lg backdrop-blur-sm">
                    🐟
                  </div>
                </div>

                <div>
                  <div className="font-bold text-white text-sm leading-snug flex items-center gap-1.5">
                    <span>{item.species}</span>
                    {item.isPersonal && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950 text-cyan-300 rounded font-semibold border border-cyan-800">
                        Kişisel
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {item.quantity} adet {item.weightKg ? `(${item.weightKg} kg)` : ''}
                  </div>
                </div>
              </div>

              {/* Right side location & timing matching IMG_5963 */}
              <div className="text-right">
                <div className="font-semibold text-cyan-400 text-xs sm:text-sm">
                  {item.locationName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {item.province}
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                  {item.timing}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCatches.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs">
            Bu filtrede henüz kayıtlı av bulunmuyor.
          </div>
        )}
      </div>

      {/* Add Catch Modal */}
      {showAddCatchModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-700 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Av Bildirimi Ekle
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Tuttuğunuz balığı kaydedin, cihazınızda saklansın.
            </p>

            <form onSubmit={handleAddCatch} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Balık Türü
                </label>
                <select
                  value={newSpecies}
                  onChange={(e) => setNewSpecies(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="İstavrit">İstavrit</option>
                  <option value="Çinekop">Çinekop</option>
                  <option value="Palamut">Palamut</option>
                  <option value="Lüfer">Lüfer</option>
                  <option value="Minekop">Minekop</option>
                  <option value="Levrek">Levrek</option>
                  <option value="Çipura">Çipura</option>
                  <option value="Eşkina">Eşkina</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adet
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mera / Konum
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatchModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-900/40"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
