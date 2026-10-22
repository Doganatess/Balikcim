import React, { useState, useEffect } from 'react';
import { MapPin, Flame, Search, ChevronRight, ChevronDown, SlidersHorizontal, Plus, Star, Compass, Layers, Check } from 'lucide-react';
import { MERALAR_LIST, MeraSpot } from '../data/meralarData';
import { Region } from '../data/regionsData';
import { getStoredFavorites, toggleFavoriteSpot } from '../data/catchesData';

interface MeralarPreviewProps {
  region: Region;
  onSelectRegionSpot?: (spotName: string) => void;
}

export const MeralarPreview: React.FC<MeralarPreviewProps> = ({ region, onSelectRegionSpot }) => {
  const [activeTab, setActiveTab] = useState<'yakinimda' | 'meralarim'>('yakinimda');
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredSpots = MERALAR_LIST.filter(m => {
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-8">
      
      {/* Top Header Row matching IMG_5965 */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{region.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
            Kişisel Avlak Rehberi
          </span>
        </div>
      </div>

      {/* Main Container matching IMG_5965 */}
      <div className="rounded-3xl bg-[#090e17] border border-slate-800 p-4 sm:p-5 shadow-2xl space-y-3.5">
        
        {/* Header row: Meralar 2.869 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-white">Meralar</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono font-bold text-cyan-300">
              2.869
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {activeTab === 'meralarim' ? `${favorites.length} Favori Kayıtlı` : 'Tüm Kıyılar Açık'}
          </span>
        </div>

        {/* Tabs: [Yakınımdaki] & [Meralarım] matching IMG_5965 */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('yakinimda')}
            className={`flex-1 py-2 rounded-xl transition ${
              activeTab === 'yakinimda'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yakınımdaki
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
            <span>Favori Meralarım ({favorites.length})</span>
          </button>
        </div>

        {/* "Bu hafta hareketli meralar" Section matching IMG_5965 */}
        <div className="p-4 rounded-2xl bg-[#111927] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <h4 className="text-sm font-bold text-white">
                {activeTab === 'meralarim' ? 'Kayıtlı Favori Noktalarınız' : 'Bu hafta hareketli meralar'}
              </h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Örnek İstatistik</span>
          </div>
          <div className="text-[11px] text-slate-400 -mt-2">
            Son 7 gün · 60 km çevrende
          </div>

          <div className="space-y-3 pt-1">
            {(showAllSpots ? filteredSpots : filteredSpots.slice(0, 5)).map((spot, idx) => {
              const isFav = favorites.includes(spot.id);
              return (
                <div 
                  key={spot.id} 
                  onClick={() => setSelectedSpotDetails(selectedSpotDetails?.id === spot.id ? null : spot)}
                  className="space-y-1 p-2 rounded-xl hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 w-3">{idx + 1}</span>
                      <span className="font-semibold text-slate-200">{spot.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                        {spot.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleToggleFavorite(e, spot.id)}
                        className="p-1 text-slate-500 hover:text-amber-400 transition"
                        title="Favorilere Ekle / Çıkar"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>

                      <div className="flex items-center gap-0.5 text-slate-400 text-[11px]">
                        <span>{spot.distanceKm} km</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  </div>

                  {/* Progress bar matching IMG_5965 */}
                  <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden ml-5 max-w-[calc(100%-1.25rem)]">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${spot.activityScore}%` }}
                    />
                  </div>

                  {/* Expanded Spot Details */}
                  {selectedSpotDetails?.id === spot.id && (
                    <div className="ml-5 mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] text-slate-300 space-y-1 animate-in fade-in">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Derinlik:</span>
                        <span className="font-mono text-cyan-300">{spot.depthDesc}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dip Yapısı:</span>
                        <span>{spot.bottomType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Aktif Balıklar:</span>
                        <span className="text-amber-300">{spot.popularFish.join(', ')}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!showAllSpots && filteredSpots.length > 5 && (
            <button
              onClick={() => setShowAllSpots(true)}
              className="w-full pt-2 text-center text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1"
            >
              <span>+{filteredSpots.length - 5} mera daha</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}

          {filteredSpots.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500">
              {activeTab === 'meralarim' 
                ? 'Henüz favori avlak kaydetmediniz. Yıldız simgesine dokunarak mera ekleyebilirsiniz.'
                : 'Aramaya uygun mera bulunamadı.'}
            </div>
          )}
        </div>

        {/* Search bar matching IMG_5965 bottom */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Mera, ilçe, il ya da balık ara (örn: Ünye, Minekop)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Local device storage note */}
        <div className="text-center text-[10px] text-slate-500 pt-1">
          Favori meralarınız iPhone Safari yerel hafızasında saklanır.
        </div>

      </div>
    </div>
  );
};
