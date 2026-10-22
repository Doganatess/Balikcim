import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Pause, ChevronRight, Info, AlertTriangle, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Region } from '../data/regionsData';
import { CatchRecord, getStoredCatches, saveCatchRecord, deleteCatchRecord } from '../data/catchesData';

interface AvDefteriPreviewProps {
  region: Region;
}

export const AvDefteriPreview: React.FC<AvDefteriPreviewProps> = ({ region }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [showAddCatchForm, setShowAddCatchForm] = useState(false);
  const [allCatches, setAllCatches] = useState<CatchRecord[]>([]);

  // Form states
  const [species, setSpecies] = useState('İstavrit');
  const [quantity, setQuantity] = useState(1);
  const [weightKg, setWeightKg] = useState(0.5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setAllCatches(getStoredCatches());
  }, []);

  // Timer effect when session is active
  useEffect(() => {
    let interval: any = null;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSavePersonalCatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CatchRecord = {
      id: `p-${Date.now()}`,
      species,
      quantity: Number(quantity),
      weightKg: Number(weightKg) || undefined,
      locationName: region.name,
      province: region.city,
      timing: 'Az önce',
      gearUsed: notes || 'Kişisel av takımı',
      baitUsed: 'Kişisel yem',
      isNearMe: true,
      thumbnailColor: 'from-cyan-600 to-blue-800',
      isPersonal: true,
      dateAdded: new Date().toLocaleDateString('tr-TR')
    };

    const updated = saveCatchRecord(newRecord);
    setAllCatches(updated);
    setShowAddCatchForm(false);
    setNotes('');
  };

  const handleDeleteCatch = (id: string) => {
    const updated = deleteCatchRecord(id);
    setAllCatches(updated);
  };

  const personalCatches = allCatches.filter(c => c.isPersonal);
  const totalPersonalFish = personalCatches.reduce((acc, cur) => acc + cur.quantity, 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      
      {/* Top Header matching IMG_5964 */}
      <div className="flex items-center justify-between pb-3">
        <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200">
          2026 Sezonu ▾
        </div>
        <button
          onClick={() => setShowAddCatchForm(true)}
          className="px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-700/60 text-xs font-bold text-cyan-300 flex items-center gap-1.5 hover:bg-cyan-900/60 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Av Ekle</span>
        </button>
      </div>

      {/* Main Container directly matching IMG_5964 */}
      <div className="rounded-3xl bg-[#090e17] border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-3.5">
        
        {/* Card 1: Her meraya geldiğinde kaydet matching IMG_5964 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-slate-800 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Her meraya geldiğinde kaydet
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Balığı tuttuğun anda ekle — o anki denizi, havayı ve basıncı balığınla eşleştiririz. Gerisi bizde: en verimli meran, en iyi saatin, işe yarayan yemin.
          </p>

          {/* Primary Action Button matching IMG_5964 */}
          <button
            onClick={() => setSessionActive(!sessionActive)}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-between px-4 sm:px-5 transition shadow-lg active:scale-[0.99] ${
              sessionActive 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950 ring-2 ring-emerald-400/40' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950'
            }`}
          >
            <div className="flex items-center gap-2">
              {sessionActive ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>
                {sessionActive 
                  ? `Mera Oturumu Sürüyor (${formatTimer(sessionSeconds)})` 
                  : 'Meraya Geldim, Ava Başla'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Aşağıdaki genel göstergeler örnek modeldir; eklediğiniz avlar cihazınızda saklanır.</span>
          </div>
        </div>

        {/* Card 2: Numeric Summary Counters matching IMG_5964 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-slate-800">
          <div className="grid grid-cols-5 gap-1 text-center pb-3 border-b border-slate-800">
            <div>
              <div className="text-base sm:text-xl font-black text-white font-mono">
                {132 + personalCatches.length}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Kayıt</div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black text-white font-mono">
                {979 + totalPersonalFish}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Balık</div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black text-white font-mono">117</div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">kg</div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black text-white font-mono">10</div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Tür</div>
            </div>
            <div>
              <div className="text-base sm:text-xl font-black text-emerald-400 font-mono">%10</div>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">en iyi</div>
            </div>
          </div>

          {/* Ranking callout matching IMG_5964 */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
            <div className="text-slate-300">
              <strong className="text-white">Sıralaman:</strong> en iyi <span className="text-cyan-400 font-bold">%10</span>
              <span className="text-cyan-400 ml-2 font-medium">→ 3 yeni tür → en iyi %5</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Son 90 günün sıralaması (Örnek).
            </div>
          </div>
        </div>

        {/* Card 3: "Sana Özel - En çok gittiğin mera, en verimli meran değil" matching IMG_5964 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <span>💡</span>
            <span>Sana özel</span>
          </div>

          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-cyan-400">
                En çok gittiğin mera, en verimli meran değil
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Avlarının %48'i Aşiyan sahil duvarında geçmiş ama saat başına yakalanan balık ortalamasında Kirazlimanı ve Ünye Feneri 2.4 kat daha yüksek verim sağlıyor.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
            <span className="text-xs font-semibold text-slate-300">
              {region.name}
            </span>
            <button
              onClick={() => setShowAddCatchForm(true)}
              className="px-3 py-1.5 rounded-full bg-cyan-950 border border-cyan-700 text-xs font-bold text-cyan-300 flex items-center gap-1 hover:bg-cyan-900 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Av Ekle</span>
            </button>
          </div>
        </div>

        {/* Personal Catches Logged in LocalStorage */}
        {personalCatches.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#111927] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
              <span>Cihazınıza Kayıtlı Avlarınız ({personalCatches.length})</span>
              <span className="text-[10px] text-emerald-400 font-normal">Yerel Hafıza</span>
            </div>

            <div className="space-y-2">
              {personalCatches.map((catchItem) => (
                <div key={catchItem.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{catchItem.species}</span>
                      <span className="text-[11px] text-cyan-400 font-semibold">{catchItem.quantity} Adet</span>
                      {catchItem.weightKg && <span className="text-[10px] text-slate-400">({catchItem.weightKg} kg)</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {catchItem.locationName} · {catchItem.timing}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCatch(catchItem.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                    title="Kaydı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Catch Modal Form */}
      {showAddCatchForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0e1726] border border-slate-700 rounded-3xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Av Defterine Kaydet</h3>
            <p className="text-xs text-slate-400 mb-3">
              Tuttuğunuz balığı cihaz hafızasına ekleyin.
            </p>

            <form onSubmit={handleSavePersonalCatch} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Balık Türü</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="İstavrit">İstavrit</option>
                  <option value="Çinekop">Çinekop</option>
                  <option value="Lüfer">Lüfer</option>
                  <option value="Palamut">Palamut</option>
                  <option value="Minekop">Minekop</option>
                  <option value="Levrek">Levrek</option>
                  <option value="Çipura">Çipura</option>
                  <option value="Eşkina">Eşkina</option>
                  <option value="Karagöz">Karagöz</option>
                  <option value="Kalkan">Kalkan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Adet</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ağırlık (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Kullanılan Yem / Not</label>
                <input
                  type="text"
                  placeholder="Örn: Kaşık 28g, Canlı karides"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatchForm(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md"
                >
                  Deftere Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
