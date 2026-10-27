import React, { useState } from 'react';
import { Fish, ChevronRight, Sparkles, AlertCircle, Info, ExternalLink, ShieldCheck } from 'lucide-react';
import { FISH_CATALOG, FishSpecies } from '../data/fishData';
import { Region } from '../data/regionsData';
import { SCIENTIFIC_FISH_DATABASE, evaluateScientificFishingCondition } from '../data/scientificFishData';

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
  const [filterType, setFilterType] = useState<'tumu' | 'uygun' | 'gece'>('tumu');

  const filteredList = FISH_CATALOG.filter(fish => {
    if (filterType === 'uygun') {
      const evaluation = evaluateScientificFishingCondition(fish.id, {
        airTemp: region.conditions.airTemp,
        waterTemp: region.conditions.waterTemp,
        windSpeed: region.conditions.windSpeed,
        windDirection: region.conditions.windDirection,
        waveHeight: region.conditions.waveHeight,
        precipitationMm: region.conditions.rainChance > 40 ? 2 : 0
      });
      return evaluation.rating === 'Koşullar Elverişli' || evaluation.rating === 'Orta / Dikkat';
    }
    if (filterType === 'gece') {
      return fish.bestHours.toLowerCase().includes('gece') || fish.bestHours.includes('19:') || fish.bestHours.includes('20:');
    }
    return true;
  });

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-6 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
              {region.name} Bilimsel Tür ve Koşul Analizleri
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/60">
              FishBase & Tebliğ 5/2 Dayanaklı
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Su sıcaklığı, dalga ve rüzgârın türlerin biyolojik kıyılama eğilimlerine uyumu; yapay olasılık yüzdesi yerine gerekçeli saha analizi sunulur.
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
            onClick={() => setFilterType('uygun')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              filterType === 'uygun' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Koşulu Uygun Olanlar
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
          const evaluation = evaluateScientificFishingCondition(fish.id, {
            airTemp: region.conditions.airTemp,
            waterTemp: region.conditions.waterTemp,
            windSpeed: region.conditions.windSpeed,
            windDirection: region.conditions.windDirection,
            waveHeight: region.conditions.waveHeight,
            precipitationMm: region.conditions.rainChance > 40 ? 2 : 0
          });
          const scientific = SCIENTIFIC_FISH_DATABASE[fish.id];

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
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700 shrink-0">
                      {fish.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-base truncate">{fish.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-semibold shrink-0">
                            Haritada Seçili
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 italic truncate">
                        {scientific?.scientificName || fish.latinName}
                      </div>
                    </div>
                  </div>

                  {/* Koşul Değerlendirme Rozeti */}
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                      evaluation.badgeTone === 'emerald'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : evaluation.badgeTone === 'amber'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : 'bg-red-950/80 text-red-300 border-red-500/50'
                    }`}>
                      {evaluation.rating}
                    </span>
                    <div className="text-[9px] text-slate-500 mt-0.5 font-mono">
                      {scientific?.blackSeaSeasonality.split('(')[0] || 'Mevsimlik'}
                    </div>
                  </div>
                </div>

                {/* Bilimsel Gerekçelendirme Metni */}
                <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10.5px] text-slate-300 leading-relaxed">
                  {evaluation.scientificJustification}
                </div>

                {/* Quick Info Tags */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    🕒 {fish.bestHours.split('/')[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 truncate max-w-[170px]">
                    🦐 {fish.bestBaits[0]}
                  </span>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10.5px] text-slate-400">
                  Asgari Boy: <strong className="text-amber-400 font-mono">{scientific?.legalMinLengthCm || 18} cm</strong>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetailsModal(fish);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
                >
                  <span>Bilimsel Rehber</span>
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
