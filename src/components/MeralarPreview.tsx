import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  Compass, 
  Plus, 
  Trash2, 
  X,
  AlertCircle 
} from 'lucide-react';
import { 
  MERALAR_LIST, 
  MeraSpot, 
  MERA_STATS, 
  calculateDistanceKm,
  getStoredCustomMeralar,
  saveCustomMera,
  deleteCustomMera
} from '../data/meralarData';
import { Region } from '../data/regionsData';
import { getStoredFavorites, toggleFavoriteSpot } from '../data/catchesData';

interface MeralarPreviewProps {
  region: Region;
  onSelectRegionSpot?: (spotName: string) => void;
}

export const MeralarPreview: React.FC<MeralarPreviewProps> = ({ region, onSelectRegionSpot }) => {
  const [activeTab, setActiveTab] = useState<'yakinimda' | 'meralarim'>('yakinimda');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<'Tümü' | 'Samsun' | 'Ordu'>('Tümü');
  const [typeFilter, setTypeFilter] = useState<'Tümü' | 'Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı' | 'Kıyı'>('Tümü');
  const [showAllSpots, setShowAllSpots] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSpotDetails, setSelectedSpotDetails] = useState<MeraSpot | null>(null);

  // Kullanıcı tarafından manuel eklenen meralar
  const [customSpots, setCustomSpots] = useState<MeraSpot[]>(() => getStoredCustomMeralar());
  
  // Mera Ekleme Modalı State'leri
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotProvince, setNewSpotProvince] = useState<'Samsun' | 'Ordu'>('Samsun');
  const [newSpotDistrict, setNewSpotDistrict] = useState('');
  const [newSpotLat, setNewSpotLat] = useState(region.lat.toString());
  const [newSpotLng, setNewSpotLng] = useState(region.lng.toString());
  const [newSpotType, setNewSpotType] = useState<'Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı' | 'Kıyı'>('Kıyı');
  const [newSpotNotes, setNewSpotNotes] = useState('');

  useEffect(() => {
    setFavorites(getStoredFavorites());
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, spotId: string) => {
    e.stopPropagation();
    const updated = toggleFavoriteSpot(spotId);
    setFavorites(updated);
  };

  // Hazır meralar ve kullanıcı meralarının birleşimi (Hazır meralar 0'dır)
  const allSpots = useMemo(() => {
    return [...customSpots, ...MERALAR_LIST];
  }, [customSpots]);

  // Seçili bölge koordinatlarına göre mesafeleri dinamik hesaplayarak listele
  const processedSpots = useMemo(() => {
    return allSpots.map(spot => ({
      ...spot,
      dynamicDistanceKm: calculateDistanceKm(region.lat, region.lng, spot.lat, spot.lng)
    })).sort((a, b) => a.dynamicDistanceKm - b.dynamicDistanceKm);
  }, [allSpots, region.lat, region.lng]);

  const filteredSpots = useMemo(() => {
    return processedSpots.filter(m => {
      if (cityFilter !== 'Tümü' && m.province !== cityFilter) return false;
      if (typeFilter !== 'Tümü' && m.type !== typeFilter) return false;

      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.popularFish && m.popularFish.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())));

      if (activeTab === 'meralarim') {
        return matchesSearch && favorites.includes(m.id);
      }
      return matchesSearch;
    });
  }, [processedSpots, cityFilter, typeFilter, searchTerm, activeTab, favorites]);

  const handleSaveNewSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName.trim()) return;

    const latNum = parseFloat(newSpotLat);
    const lngNum = parseFloat(newSpotLng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return;
    }

    const created: MeraSpot = {
      id: `custom-${Date.now()}`,
      name: newSpotName.trim(),
      province: newSpotProvince,
      district: newSpotDistrict.trim() || 'Merkez',
      distanceKm: calculateDistanceKm(region.lat, region.lng, latNum, lngNum),
      isTrending: false,
      type: newSpotType,
      kiyiYapisi: newSpotType === 'Liman' ? 'mendirek' : newSpotType === 'Kayalık' ? 'kayalik_burun' : newSpotType === 'Kumsal' ? 'kumsal' : 'dere_agzi',
      kanitSeviyesi: 'ADAY',
      kanitSeviyesiBadge: '👤 Kullanıcı Merası',
      haritadaAktifMi: true,
      cografiDogrulamaDurumu: 'KISMI',
      cografiKaynak: 'Kullanıcı Manuel Girişi',
      cografiKaynakNotu: 'Kullanıcı tarafından elle kaydedilen mera noktasıdır.',
      fizikselKiyiErisimi: 'Kullanıcı tarafından saha teyidi yapılmıştır.',
      avlanmaIzinDurumu: 'Amatör olta balıkçılığı',
      turVerisiKaynagi: 'Kullanıcı Notu',
      kaynak: 'Kullanıcı',
      erisimDurumu: 'Doğrudan erişim',
      kisitlarVeRiskler: newSpotNotes.trim() || 'Sahada dikkatli olunuz.',
      belirsizlikler: 'Kişisel mera kaydı.',
      balikcilikGerekcesi: 'Kişisel av sahası',
      popularFish: ['İstavrit', 'Levrek', 'Çinekop'],
      depthDesc: 'Kullanıcı kaydı',
      bottomType: newSpotType,
      lat: latNum,
      lng: lngNum,
      verificationStatus: 'ADAY',
      verificationBadge: '👤 Kullanıcı Merası',
      verificationNote: 'Kullanıcı tarafından kaydedilmiştir.',
      cautions: newSpotNotes.trim()
    };

    const updated = saveCustomMera(created);
    setCustomSpots(updated);
    setNewSpotName('');
    setNewSpotDistrict('');
    setNewSpotNotes('');
    setShowAddModal(false);
  };

  const handleDeleteCustomSpot = (e: React.MouseEvent, spotId: string) => {
    e.stopPropagation();
    const updated = deleteCustomMera(spotId);
    setCustomSpots(updated);
    if (selectedSpotDetails?.id === spotId) {
      setSelectedSpotDetails(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{region.name} Referansı</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            Samsun – Ordu Kıyı Şeridi
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-[#090e17] border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-3.5">
        
        {/* Header row: Gerçek Dinamik Sayaç ve Mera Ekle Butonu */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-white">Kayıtlı Meralar</span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300">
              {filteredSpots.length} / {allSpots.length} Kayıtlı
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mera Ekle</span>
          </button>
        </div>

        {/* Bilgilendirme Notu */}
        {allSpots.length === 0 && (
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Hazır meralar tamamen kaldırılmıştır.</strong>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Uygulama sıfır hazır mera ile çalışmaktadır. Kendi bildiğiniz ve güvendiğiniz meraları yukarıdaki "Mera Ekle" butonuna basarak kaydedebilirsiniz.
              </p>
            </div>
          </div>
        )}

        {/* Tabs: [Tüm Meralar] & [Favori Meralarım] */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('yakinimda')}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'yakinimda'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Meralar ({processedSpots.length})
          </button>
          <button
            onClick={() => setActiveTab('meralarim')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'meralarim'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${activeTab === 'meralarim' ? 'fill-white' : ''}`} />
            <span>Favorilerim ({favorites.length})</span>
          </button>
        </div>

        {/* Filtreleme Çubukları */}
        {allSpots.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              {(['Tümü', 'Samsun', 'Ordu'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCityFilter(c)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    cityFilter === c ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              {(['Tümü', 'Liman', 'Kayalık', 'Kumsal', 'Dere Ağzı', 'Kıyı'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    typeFilter === t ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Arama Çubuğu */}
        {allSpots.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Mera adı, ilçe veya balık ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#111927] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        )}

        {/* Meralar Listesi veya Sıfır Mera Boş Durum Ekranı */}
        {filteredSpots.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
              <MapPin className="w-6 h-6 text-cyan-400/80" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">
                {activeTab === 'meralarim' ? 'Henüz Favori Mera Yok' : 'Kayıtlı Mera Bulunmuyor'}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {activeTab === 'meralarim'
                  ? 'Favori mera kaydetmediniz. Yıldız simgesine dokunarak meraları favorilere ekleyebilirsiniz.'
                  : 'Hazır mera verileri kaldırılmıştır (Mera sayısı: 0). Kendi meralarınızı elle ekleyebilir veya Harita üzerinden serbest koordinat analizi yapabilirsiniz.'}
              </p>
            </div>
            {activeTab !== 'meralarim' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-950 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>İlk Meranızı Ekleyin</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredSpots.map(spot => {
              const isFav = favorites.includes(spot.id);
              const isSelected = selectedSpotDetails?.id === spot.id;
              const isCustom = spot.id.startsWith('custom-');

              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpotDetails(isSelected ? null : spot)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg'
                      : 'bg-[#111927] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                          <span>{spot.name}</span>
                          {isCustom && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                              Özel
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {spot.province} · {spot.district} · {spot.type} · {spot.lat.toFixed(4)}°K, {spot.lng.toFixed(4)}°D
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={e => handleToggleFavorite(e, spot.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition"
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>

                      {isCustom && (
                        <button
                          onClick={e => handleDeleteCustomSpot(e, spot.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition"
                          title="Merayı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 animate-in fade-in duration-150">
                      <div>
                        <strong>Kıyı Yapısı:</strong> {spot.type} ({spot.lat.toFixed(4)}°K, {spot.lng.toFixed(4)}°D)
                      </div>
                      {spot.kisitlarVeRiskler && (
                        <div>
                          <strong>Notlar / Bilgiler:</strong> {spot.kisitlarVeRiskler}
                        </div>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (onSelectRegionSpot) {
                            onSelectRegionSpot(spot.name);
                          }
                        }}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Haritada Göster & Hava/Deniz Analiz Et</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Yeni Mera Ekleme Modalı */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a111e] border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Yeni Balıkçı Merası Ekle</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSpot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Mera Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ünye Çamlık Kayalıkları"
                  value={newSpotName}
                  onChange={e => setNewSpotName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">İl</label>
                  <select
                    value={newSpotProvince}
                    onChange={e => setNewSpotProvince(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Samsun">Samsun</option>
                    <option value="Ordu">Ordu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">İlçe</label>
                  <input
                    type="text"
                    placeholder="Örn: Ünye"
                    value={newSpotDistrict}
                    onChange={e => setNewSpotDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Enlem (Latitude) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newSpotLat}
                    onChange={e => setNewSpotLat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Boylam (Longitude) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={newSpotLng}
                    onChange={e => setNewSpotLng(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kıyı Yapısı</label>
                <select
                  value={newSpotType}
                  onChange={e => setNewSpotType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Liman">Liman / Mendirek</option>
                  <option value="Kayalık">Kayalık Burun / Falez</option>
                  <option value="Kumsal">Kumsal / Plaj</option>
                  <option value="Dere Ağzı">Dere / Nehir Mansabı</option>
                  <option value="Kıyı">Genel Kıyı</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kişisel Notlar & Hedef Balıklar</label>
                <textarea
                  rows={2}
                  placeholder="Zemin yapısı, takım takılma durumu, levrek/lüfer hareketleri..."
                  value={newSpotNotes}
                  onChange={e => setNewSpotNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-md"
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
