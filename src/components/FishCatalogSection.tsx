import React, { useState } from 'react';
import { Search, Fish, Sparkles, BookOpen, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { FISH_CATALOG, FishSpecies } from '../data/fishData';

interface FishCatalogSectionProps {
  onSelectFish: (fish: FishSpecies) => void;
  onOpenDetailsModal: (fish: FishSpecies) => void;
}

export const FishCatalogSection: React.FC<FishCatalogSectionProps> = ({
  onSelectFish,
  onOpenDetailsModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  const categories = ['Tümü', 'Karadeniz', 'Marmara', 'Ege', 'Akdeniz', 'Tatlı Su'];

  const filteredFish = FISH_CATALOG.filter(fish => {
    const matchesSearch = fish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fish.latinName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fish.bestBaits.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tümü' || fish.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="balik-rehberi" className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-6 mb-12">
      
      {/* Title & Description */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
            {FISH_CATALOG.length} Tür Hedef Balık Kataloğu & Rehberi
          </h2>
        </div>
        <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
          Katalogdaki {FISH_CATALOG.length} tür için etkili yemler, takım tavsiyeleri, mevsimler ve yasal asgari av boyları. Skorlar kural tabanlı tahmin modelidir; gerçek zamanlı biyokütle garantisi vermez.
        </p>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Balık adı, Latince adı veya yem ara (örn: Levrek, sahte, boru kurdu)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fish Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFish.map((fish) => (
          <div
            key={fish.id}
            onClick={() => onOpenDetailsModal(fish)}
            className="p-4 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl border border-slate-700/80">
                    {fish.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition">
                      {fish.name}
                    </h3>
                    <div className="text-xs text-slate-400 italic">
                      {fish.latinName}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                  {fish.category}
                </span>
              </div>

              {/* Specs Pills */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sezon:</span>
                  <span className="font-medium text-slate-200">{fish.season}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Derinlik:</span>
                  <span className="font-mono text-cyan-300">{fish.depthRange}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Yasal Asgari Boy:</span>
                  <span className="font-bold text-amber-400">{fish.legalMinLength.split(' ')[0]} {fish.legalMinLength.split(' ')[1]}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 mb-3 line-clamp-2">
                <strong className="text-slate-300">Yem:</strong> {fish.bestBaits.join(', ')}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFish(fish);
                }}
                className="text-[11px] px-2 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition"
              >
                Haritada Göster
              </button>

              <span className="text-cyan-400 group-hover:translate-x-1 transition flex items-center gap-0.5 font-semibold text-[11px]">
                Detaylar <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredFish.length === 0 && (
        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          Aramanıza uygun balık türü bulunamadı. Lütfen farklı bir arama terimi deneyin.
        </div>
      )}

      {/* Catalog Bottom Note */}
      <div className="mt-6 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Tüm bilgiler T.C. Tarım ve Orman Bakanlığı Amatör Amaçlı Su Ürünleri Avcılığını Düzenleyen Tebliğ ile uyumludur.</span>
        </div>
        <span className="text-xs text-cyan-400 font-bold whitespace-nowrap hidden sm:inline">101/101 Tür Tam Kapsam</span>
      </div>

    </section>
  );
};
