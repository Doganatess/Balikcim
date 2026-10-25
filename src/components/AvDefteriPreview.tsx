import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronRight, 
  Info, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  Compass, 
  CloudSun, 
  X, 
  Save, 
  BarChart2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Region } from '../data/regionsData';
import { 
  CatchRecord, 
  getStoredCatches, 
  saveCatchRecord, 
  updateCatchRecord, 
  deleteCatchRecord, 
  calculatePersonalCatchStats 
} from '../data/catchesData';

interface AvDefteriPreviewProps {
  region: Region;
}

export const AvDefteriPreview: React.FC<AvDefteriPreviewProps> = ({ region }) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [allCatches, setAllCatches] = useState<CatchRecord[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Form fields
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formTiming, setFormTiming] = useState('Bugün');
  const [formSpecies, setFormSpecies] = useState('İstavrit');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formWeightKg, setFormWeightKg] = useState<number | ''>('');
  const [formLocation, setFormLocation] = useState(region.name);
  const [formGear, setFormGear] = useState('');
  const [formBait, setFormBait] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formTemp, setFormTemp] = useState<number | ''>('');
  const [formWind, setFormWind] = useState<number | ''>('');
  const [formWave, setFormWave] = useState<number | ''>('');
  const [formWeatherDesc, setFormWeatherDesc] = useState('');

  useEffect(() => {
    setAllCatches(getStoredCatches());
  }, []);

  // Timer effect when session is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionActive]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenNewModal = () => {
    setEditingRecordId(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTiming('Bugün');
    setFormSpecies('İstavrit');
    setFormQuantity(1);
    setFormWeightKg('');
    setFormLocation(region.name);
    setFormGear('');
    setFormBait('');
    setFormNotes('');
    setFormTemp('');
    setFormWind('');
    setFormWave('');
    setFormWeatherDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: CatchRecord) => {
    setEditingRecordId(item.id);
    setFormDate(item.date || new Date().toISOString().split('T')[0]);
    setFormTiming(item.timing || 'Kayıt');
    setFormSpecies(item.species);
    setFormQuantity(item.quantity || 1);
    setFormWeightKg(item.weightKg ?? '');
    setFormLocation(item.locationName);
    setFormGear(item.gearUsed || '');
    setFormBait(item.baitUsed || '');
    setFormNotes(item.notes || '');
    setFormTemp(item.weatherObserved?.temperature ?? '');
    setFormWind(item.weatherObserved?.windSpeedKmh ?? '');
    setFormWave(item.weatherObserved?.waveHeightM ?? '');
    setFormWeatherDesc(item.weatherObserved?.description || '');
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    const weatherInfo = (formTemp !== '' || formWind !== '' || formWave !== '' || formWeatherDesc)
      ? {
          temperature: formTemp !== '' ? Number(formTemp) : undefined,
          windSpeedKmh: formWind !== '' ? Number(formWind) : undefined,
          waveHeightM: formWave !== '' ? Number(formWave) : undefined,
          description: formWeatherDesc || undefined,
          isForecast: false
        }
      : undefined;

    if (editingRecordId) {
      // Editing existing record
      const existing = allCatches.find(c => c.id === editingRecordId);
      const updatedRecord: CatchRecord = {
        id: editingRecordId,
        species: formSpecies,
        quantity: Math.max(1, Number(formQuantity)),
        weightKg: formWeightKg !== '' ? Number(formWeightKg) : undefined,
        locationName: formLocation || region.name,
        province: existing?.province || region.city,
        date: formDate,
        timing: formTiming,
        gearUsed: formGear || undefined,
        baitUsed: formBait || undefined,
        notes: formNotes || undefined,
        weatherObserved: weatherInfo,
        isNearMe: true,
        thumbnailColor: existing?.thumbnailColor || 'from-cyan-700 to-blue-900',
        isPersonal: true,
        dateAdded: existing?.dateAdded || new Date().toLocaleDateString('tr-TR')
      };

      const updated = updateCatchRecord(updatedRecord);
      setAllCatches(updated);
    } else {
      // Creating new personal catch
      const newRecord: CatchRecord = {
        id: `p-${Date.now()}`,
        species: formSpecies,
        quantity: Math.max(1, Number(formQuantity)),
        weightKg: formWeightKg !== '' ? Number(formWeightKg) : undefined,
        locationName: formLocation || region.name,
        province: region.city,
        date: formDate,
        timing: formTiming || 'Az önce',
        gearUsed: formGear || undefined,
        baitUsed: formBait || undefined,
        notes: formNotes || undefined,
        weatherObserved: weatherInfo,
        isNearMe: true,
        thumbnailColor: 'from-cyan-600 to-blue-800',
        isPersonal: true,
        dateAdded: new Date().toLocaleDateString('tr-TR')
      };

      const updated = saveCatchRecord(newRecord);
      setAllCatches(updated);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCatch = (id: string) => {
    if (window.confirm('Bu av kaydını yerel defterinizden silmek istediğinize emin misiniz?')) {
      const updated = deleteCatchRecord(id);
      setAllCatches(updated);
    }
  };

  const personalCatches = allCatches.filter(c => c.isPersonal);
  const personalStats = calculatePersonalCatchStats(allCatches);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200">
            Kişisel Av Defteri
          </div>
          <span className="text-[11px] text-slate-400">
            {region.name}
          </span>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-700/60 text-xs font-bold text-cyan-300 flex items-center gap-1.5 hover:bg-cyan-900/60 transition shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yeni Av Ekle</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-[#090e17] border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-4">
        
        {/* Card 1: Mera Oturumu ve Kayıt Başlatıcı */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-slate-800 space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Meraya Geldiğinde Kaydet
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Avlandığın merada süreni başlat, tuttuğun balığın türünü, adedini, kullandığın yem ve takımı defterine işle. Kayıtların doğrudan cihazının yerel hafızasında saklanır.
          </p>

          {/* Primary Action Button */}
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
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Kişisel verileriniz yalnızca bu cihazda (LocalStorage) tutulur, dışarıya aktarılmaz.</span>
          </div>
        </div>

        {/* Card 2: Kişisel Av İstatistikleri (Gerçek Yerel Kayıtlara Dayalı) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Av İstatistiklerim</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
              {personalStats.hasRecords ? `${personalStats.totalRecords} Giriş Yapıldı` : 'Kayıt Bekleniyor'}
            </span>
          </div>

          {personalStats.hasRecords ? (
            <div className="space-y-3">
              {/* Sayısal Göstergeler */}
              <div className="grid grid-cols-4 gap-2 text-center py-1">
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                  <div className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
                    {personalStats.totalRecords}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Av Kaydı</div>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                  <div className="text-lg sm:text-xl font-black text-white font-mono">
                    {personalStats.totalFishCount}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Toplam Balık</div>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                  <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                    {personalStats.totalWeightKg > 0 ? `${personalStats.totalWeightKg} kg` : '-'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tartılan Ağırlık</div>
                </div>
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                  <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                    {personalStats.speciesBreakdown.length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Farklı Tür</div>
                </div>
              </div>

              {/* Tür Dağılımı ve Meralar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>En Çok Yakalanan Türler</span>
                    <span className="text-[10px] text-slate-500">Adet</span>
                  </div>
                  <div className="space-y-1">
                    {personalStats.speciesBreakdown.slice(0, 3).map((sp) => (
                      <div key={sp.species} className="flex items-center justify-between text-slate-300 text-[11px]">
                        <span>{sp.species}</span>
                        <span className="font-mono text-cyan-400 font-bold">{sp.count} adet</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/50">
                  <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>En Çok Ziyaret Edilen Meralar</span>
                    <span className="text-[10px] text-slate-500">Balık</span>
                  </div>
                  <div className="space-y-1">
                    {personalStats.spotBreakdown.slice(0, 3).map((spot) => (
                      <div key={spot.spotName} className="flex items-center justify-between text-slate-300 text-[11px]">
                        <span className="truncate max-w-[130px]">{spot.spotName}</span>
                        <span className="font-mono text-emerald-400 font-bold">{spot.count} adet</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-300 font-medium">
                Henüz kişisel av kaydınız bulunmuyor.
              </p>
              <p className="text-[11px] text-slate-500">
                Sahada yakaladığınız balıkları ekledikçe avladığınız türler, toplam adet ve en verimli meralarınız bu alanda hesaplanacaktır.
              </p>
            </div>
          )}
        </div>

        {/* Card 3: Kişisel Av Kayıtları Listesi (Ekleme / Düzenleme / Silme) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#111927] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Cihazımdaki Av Kayıtları</span>
              <span className="text-xs font-normal text-slate-400">({personalCatches.length})</span>
            </h4>
            <button
              onClick={handleOpenNewModal}
              className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Av Ekle</span>
            </button>
          </div>

          {personalCatches.length > 0 ? (
            <div className="space-y-2 pt-1">
              {personalCatches.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{item.species}</span>
                        <span className="text-xs text-cyan-400 font-semibold">{item.quantity} Adet</span>
                        {item.weightKg && (
                          <span className="text-xs text-slate-400">({item.weightKg} kg)</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {item.locationName} ({item.province})
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {item.date || item.timing}
                        </span>
                      </div>
                    </div>

                    {/* Edit and Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 rounded-lg transition"
                        title="Kaydı Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCatch(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition"
                        title="Kaydı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Gear, Bait and Notes */}
                  {(item.gearUsed || item.baitUsed || item.notes) && (
                    <div className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/50 space-y-0.5">
                      {item.gearUsed && (
                        <div><strong className="text-slate-400">Takım:</strong> {item.gearUsed}</div>
                      )}
                      {item.baitUsed && (
                        <div><strong className="text-slate-400">Yem:</strong> {item.baitUsed}</div>
                      )}
                      {item.notes && (
                        <div><strong className="text-slate-400">Not:</strong> {item.notes}</div>
                      )}
                    </div>
                  )}

                  {/* Weather Observed */}
                  {item.weatherObserved && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-0.5 flex-wrap">
                      {item.weatherObserved.temperature !== undefined && (
                        <span>🌡 {item.weatherObserved.temperature}°C</span>
                      )}
                      {item.weatherObserved.windSpeedKmh !== undefined && (
                        <span>💨 {item.weatherObserved.windSpeedKmh} km/s</span>
                      )}
                      {item.weatherObserved.waveHeightM !== undefined && (
                        <span>🌊 {item.weatherObserved.waveHeightM} m</span>
                      )}
                      {item.weatherObserved.description && (
                        <span className="italic text-slate-500">{item.weatherObserved.description}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
              <p className="mb-2">Henüz kayıtlı kişisel avınız bulunmuyor.</p>
              <button
                onClick={handleOpenNewModal}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İlk Avımı Kaydet</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Add / Edit Catch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#0e1726] border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingRecordId ? 'Av Kaydını Düzenle' : 'Yeni Av Kaydı Ekle'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {editingRecordId ? 'Kayıt bilgilerinizi güncelleyin' : 'Cihazınızın yerel av defterine kaydedin'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              
              {/* Tarih ve Zaman */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Zaman Tanımı
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Sabah suyu, 14:30"
                    value={formTiming}
                    onChange={(e) => setFormTiming(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              {/* Mera / Konum */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Mera / Konum Adı
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Örn: Fatsa Sahil, Ünye Liman"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  required
                />
              </div>

              {/* Balık Türü ve Adet */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
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
                    <option value="Barbunya">Barbunya</option>
                  </select>
                </div>
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
              </div>

              {/* Ağırlık ve Kullanılan Takım */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Toplam Ağırlık (kg, İsteğe Bağlı)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Örn: 0.8"
                    value={formWeightKg}
                    onChange={(e) => setFormWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Kullanılan Takım
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Spin 10-30g, Dip takımı"
                    value={formGear}
                    onChange={(e) => setFormGear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              {/* Kullanılan Yem ve Notlar */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Kullanılan Yem / Sahte
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Canlı boru kurdu, Kaşık 28g"
                    value={formBait}
                    onChange={(e) => setFormBait(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Gözlem / Notlar
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: Akıntı ağzında vuruş aldım"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              {/* İsteğe Bağlı Hava ve Deniz Koşulları */}
              <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400">
                  <CloudSun className="w-3.5 h-3.5" />
                  <span>Gözlemlenen Hava ve Deniz Koşulları (İsteğe Bağlı)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Sıcaklık (°C)</label>
                    <input
                      type="number"
                      placeholder="16"
                      value={formTemp}
                      onChange={(e) => setFormTemp(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Rüzgâr (km/s)</label>
                    <input
                      type="number"
                      placeholder="14"
                      value={formWind}
                      onChange={(e) => setFormWind(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Dalga (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.5"
                      value={formWave}
                      onChange={(e) => setFormWave(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-md shadow-cyan-950 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingRecordId ? 'Güncelle' : 'Deftere Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
