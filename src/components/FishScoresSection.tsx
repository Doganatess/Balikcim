import React, { useState } from 'react';
import { Fish, ChevronRight, Sparkles, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { FISH_CATALOG, FishSpecies } from '../data/fishData';
import { Region } from '../data/regionsData';

interface FishScoresSectionProps {
  region: Region;
  selectedFish: FishSpecies;
  onSelectFish: (fish: FishSpecies) => void;
  onOpenDetailsModal: (fish: FishSpecies) => void;
}

export const FishScoresSection: React.FC<FishScoresSectionProps> = ({
  region,
  selectedFish,
  onSelectFish,
  onOpenDetailsModal
}) => {
  const [filterType, setFilterType] = useState<'tumu' | 'aktif' | 'gece'>('tumu');

  const filteredList = FISH_CATALOG.filter(fish => {
    if (filterType === 'aktif') return fish.currentScore >= 75;
    if (filterType === 'gece') return fish.bestHours.toLowerCase().includes('gece') || fish.bestHours.includes('19:') || fish.bestHours.includes('20:');
    return true;
  });

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
              {region.name} Balık Avı Skorları
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Örnek Model</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Solunar döngüsü ve mevsimsel koşullara dayalı örnek model skorlarıdır (Gerçek avlanma garantisi değildir).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('tumu')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === 'tumu' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Türler
          </button>
          <button
            onClick={() => setFilterType('aktif')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === 'aktif' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            En Aktifler
          </button>
          <button
            onClick={() => setFilterType('gece')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === 'gece' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gece Suyu
          </button>
        </div>
      </div>

      {/* Grid of Fish Species Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredList.slice(0, 8).map((fish) => {
          const isSelected = fish.id === selectedFish.id;
          return (
            <div
              key={fish.id}
              onClick={() => onSelectFish(fish)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-[#111927] border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">
                      {fish.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{fish.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-semibold">
                            Haritada
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 italic">
                        {fish.latinName}
                      </div>
                    </div>
                  </div>

                  {/* Score Gauge */}
                  <div className="text-right">
                    <div className={`text-lg font-extrabold font-mono ${
                      fish.currentScore >= 85 
                        ? 'text-emerald-400' 
                        : fish.currentScore >= 70 
                        ? 'text-cyan-400' 
                        : 'text-amber-400'
                    }`}>
                      %{fish.currentScore}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {fish.activityStatus}
                    </div>
                  </div>
                </div>

                {/* Probability Bar */}
                <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      fish.currentScore >= 85
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : fish.currentScore >= 70
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${fish.currentScore}%` }}
                  />
                </div>

                {/* Quick Info Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    🕒 {fish.bestHours.split('/')[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 truncate max-w-[170px]">
                    🦐 {fish.bestBaits[0]}
                  </span>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Yasal Boy: <strong className="text-amber-400">{fish.legalMinLength.split(' ')[0]} {fish.legalMinLength.split(' ')[1]}</strong>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetailsModal(fish);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                >
                  <span>Rehberi İncele</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
