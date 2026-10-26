import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Flame, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  Compass, 
  Filter, 
  AlertCircle,
  ShieldCheck,
  X 
} from 'lucide-react';
import { MERALAR_LIST, MeraSpot, MERA_STATS, calculateDistanceKm } from '../data/meralarData';
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
  const [typeFilter, setTypeFilter] = useState<'Tümü' | 'Liman' | 'Kayalık' | 'Kumsal' | 'Dere Ağzı'>('Tümü');
  const [showAllSpots, setShowAllSpots] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSpotDetails, setSelectedSpotDetails] = useState<MeraSpot | null>(null);

  useEffect(() => {
    setFavorites(getStoredFavorites());
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, spotId: string) => {
    e.stopPropagation();
    const updated = toggleFavoriteSpot(spotId);
    setFavorites(updated);
  };

  // Seçili bölge koordinatlarına göre mesafeleri dinamik hesaplayarak listele
  const processedSpots = useMemo(() => {
    return MERALAR_LIST.map(spot => ({
      ...spot,
      dynamicDistanceKm: calculateDistanceKm(region.lat, region.lng, spot.lat, spot.lng)
    })).sort((a, b) => a.dynamicDistanceKm - b.dynamicDistanceKm);
  }, [region.lat, region.lng]);

  const filteredSpots = useMemo(() => {
    return processedSpots.filter(m => {
      if (cityFilter !== 'Tümü' && m.province !== cityFilter) return false;
      if (typeFilter !== 'Tümü' && m.type !== typeFilter) return false;

      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.popularFish.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));

      if (activeTab === 'meralarim') {
        return matchesSearch && favorites.includes(m.id);
      }
      return matchesSearch;
    });
  }, [processedSpots, cityFilter, typeFilter, searchTerm, activeTab, favorites]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      
      {/* Top Header Row matching app styling */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{region.name} Referansı</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            Samsun – Ordu Kıyı Kataloğu
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="rounded-3xl bg-[#090e17] border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-3.5">
        
        {/* Header row: Gerçek Dinamik Sayaç (Yanıltıcı 2.869 yerine dinamik MERA_STATS) */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-white">Kıyı Noktaları</span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300">
              {filteredSpots.length} / {MERA_STATS.total} Kayıtlı
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {activeTab === 'meralarim' ? `${favorites.length} Favori Kayıtlı` : 'Samsun & Ordu Kıyı Şeridi'}
          </span>
        </div>

        {/* Doğrulama Durumu Dağılım Hapları (Şeffaflık) */}
        <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
          <span className="px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 font-medium">
            ⚓ {MERA_STATS.dogrulandiCount} Doğrulandı
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-medium">
            📍 {MERA_STATS.adayCount} Aday Nokta
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-medium">
            ⚠️ {MERA_STATS.yetersizVeriCount} Yetersiz Veri
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 font-medium">
            ⛔ {MERA_STATS.kisitliRiskliCount} Kısıtlı / Riskli
          </span>
        </div>

        {/* Tabs: [Yakınımdaki] & [Favori Meralarım] */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('yakinimda')}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'yakinimda'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Kıyı Noktaları ({processedSpots.length})
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

        {/* Filtre Barı (İl ve Kıyı Tipi) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500">İl:</span>
            {(['Tümü', 'Samsun', 'Ordu'] as const).map(city => (
              <button
                key={city}
                onClick={() => setCityFilter(city)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  cityFilter === city
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {city} {city === 'Samsun' ? `(${MERA_STATS.samsunCount})` : city === 'Ordu' ? `(${MERA_STATS.orduCount})` : ''}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <span className="text-[10px] text-slate-500">Kıyı:</span>
            {(['Tümü', 'Liman', 'Kayalık', 'Kumsal', 'Dere Ağzı'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition ${
                  typeFilter === type
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Meralar Listesi */}
        <div className="p-4 rounded-2xl bg-[#111927] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="text-sm font-bold text-white">
                {activeTab === 'meralarim' ? 'Kayıtlı Favori Noktalarınız' : `${region.name} Yakınından Uzağa`}
              </h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {filteredSpots.length} Nokta
            </span>
          </div>
          <div className="text-[11px] text-slate-400 -mt-2">
            Mesafe {region.name} merkezine göredir ({region.city})
          </div>

          <div className="space-y-3 pt-1">
            {(showAllSpots ? filteredSpots : filteredSpots.slice(0, 6)).map((spot, idx) => {
              const isFav = favorites.includes(spot.id);
              const isRestricted = spot.kanitSeviyesi === 'ERISIM_KISITLI_VEYA_RISKLI';
              const isUnverified = spot.kanitSeviyesi === 'YETERSIZ_VERI';
              const isCandidate = spot.kanitSeviyesi === 'ADAY';

              return (
                <div 
                  key={spot.id} 
                  onClick={() => setSelectedSpotDetails(selectedSpotDetails?.id === spot.id ? null : spot)}
                  className="space-y-1.5 p-2.5 rounded-xl hover:bg-slate-800/40 cursor-pointer transition border border-transparent hover:border-slate-800"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-amber-400 w-4 shrink-0 text-center">{idx + 1}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-200 truncate">{spot.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            isRestricted
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : isUnverified 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : isCandidate
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {spot.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {spot.province} · {spot.district}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleToggleFavorite(e, spot.id)}
                        className="p-1 text-slate-500 hover:text-amber-400 transition"
                        title="Favorilere Ekle / Çıkar"
                        aria-label="Favori Ekle/Çıkar"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>

                      <div className="flex items-center gap-0.5 text-slate-400 text-[11px] font-mono">
                        <span>~{spot.dynamicDistanceKm} km</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  </div>

                  {/* Gerçek Kanıt Seviyesi ve Erişim Göstergesi (Sahte Aktivite Skoru Yerine) */}
                  <div className="flex items-center justify-between gap-2 ml-6 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-medium truncate ${
                      isRestricted
                        ? 'bg-red-950/80 text-red-300 border border-red-800/80'
                        : isUnverified
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                        : isCandidate
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                    }`}>
                      {spot.kanitSeviyesiBadge}
                    </span>
                    <span className="text-slate-400 text-[9.5px] truncate text-right">
                      {spot.depthDesc}
                    </span>
                  </div>

                  {/* Expanded Spot Details */}
                  {selectedSpotDetails?.id === spot.id && (
                    <div className="ml-6 mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 text-[11px] text-slate-300 space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-slate-400">Kanıt Seviyesi:</span>
                        <span className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                          isRestricted
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : isUnverified
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : isCandidate
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        }`}>
                          {spot.kanitSeviyesiBadge}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 italic">
                        <strong>Coğrafi Kaynak:</strong> {spot.kaynak}
                      </div>

                      <div className="flex justify-between pt-0.5">
                        <span className="text-slate-400">Kıyı Morfolojisi:</span>
                        <span className="text-slate-200">{spot.bottomType}</span>
                      </div>

                      <div className="pt-0.5">
                        <span className="text-slate-400 block mb-0.5">Balıkçılık Gerekçesi (Fiziki):</span>
                        <span className="text-slate-300 text-[10.5px] leading-relaxed block">{spot.balikcilikGerekcesi}</span>
                      </div>

                      <div className="pt-0.5">
                        <span className="text-slate-400 block mb-0.5">Kıyıdan Yaya Erişimi:</span>
                        <span className="text-slate-300 text-[10.5px] block">{spot.erisimDurumu}</span>
                      </div>

                      {spot.kisitlarVeRiskler && (
                        <div className="text-[10px] text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-800/40">
                          ⚠️ <strong>Kısıtlar & Riskler:</strong> {spot.kisitlarVeRiskler}
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-slate-400">Batimetri (Derinlik):</span>
                        <span className="font-mono text-amber-400">{spot.depthDesc}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Hedeflenen Türler:</span>
                        <span className="text-cyan-300 font-medium">{spot.popularFish.join(', ')}</span>
                      </div>

                      {spot.cautions && (
                        <div className="text-[10px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800">
                          ℹ️ <strong>Saha Gözlemi:</strong> {spot.cautions}
                        </div>
                      )}

                      {/* Haritada Gör ve Konuma Git Butonu */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectRegionSpot) {
                            onSelectRegionSpot(spot.name);
                          }
                        }}
                        className="w-full mt-2.5 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-cyan-950 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-white" />
                        <span>Haritada Gör ve Konumu İncele</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!showAllSpots && filteredSpots.length > 6 && (
            <button
              onClick={() => setShowAllSpots(true)}
              className="w-full pt-2 text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 transition"
            >
              <span>Tüm {filteredSpots.length} kıyı noktasını göster (+{filteredSpots.length - 6} daha)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}

          {showAllSpots && filteredSpots.length > 6 && (
            <button
              onClick={() => setShowAllSpots(false)}
              className="w-full pt-2 text-center text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1 transition"
            >
              <span>Daha az göster</span>
              <ChevronDown className="w-3.5 h-3.5 rotate-180" />
            </button>
          )}

          {filteredSpots.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500">
              {activeTab === 'meralarim' 
                ? 'Henüz favori kıyı noktası kaydetmediniz. Yıldız simgesine dokunarak ekleyebilirsiniz.'
                : 'Aramaya uygun kıyı noktası bulunamadı.'}
            </div>
          )}
        </div>

        {/* Search bar matching style */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Nokta, ilçe, il ya da balık ara (örn: Ünye, Mendirek, Levrek)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bilgilendirme ve Şeffaflık Notu */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10.5px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Kıyı Noktası Kanıt Seviyeleri ve Şeffaflık Beyanı</span>
          </div>
          <p className="leading-relaxed">
            Bu listedeki 30 kıyı noktası, Dereköy’den Gülyalı’ya kadar OpenStreetMap kıyı yapıları (mendirek, fener, burun, akarsu mansabı) referans alınarak ve kanıt seviyelerine göre (<em>Doğrulandı</em>, <em>Aday Kıyı</em>, <em>Yetersiz Veri</em>, <em>Erişim Kısıtlı / Riskli</em>) sınıflandırılmıştır.
            Tüm sahte metrikler (tahmini aktivite skorları, yapay yıldızlar veya av garantileri) kaldırılmıştır. Ölçülmüş resmi batimetri verisi bulunmadığı için kesin derinlik taahhüt edilmez. Sahaya inmeden önce hava şartlarını, fiziki erişim engellerini ve yerel tebliğleri kontrol ediniz.
          </p>
        </div>

      </div>
    </div>
  );
};
