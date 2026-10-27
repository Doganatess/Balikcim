import React from 'react';
import { X, Fish, ShieldCheck, Clock, Waves, Compass, Sparkles, ChevronRight, AlertCircle, ExternalLink } from 'lucide-react';
import { FishSpecies } from '../data/fishData';
import { SCIENTIFIC_FISH_DATABASE } from '../data/scientificFishData';

interface FishDetailModalProps {
  fish: FishSpecies | null;
  onClose: () => void;
  onSelectOnMap: (fish: FishSpecies) => void;
}

export const FishDetailModal: React.FC<FishDetailModalProps> = ({
  fish,
  onClose,
  onSelectOnMap
}) => {
  if (!fish) return null;

  const scientific = SCIENTIFIC_FISH_DATABASE[fish.id];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0e1626] border border-slate-700 rounded-3xl p-6 shadow-2xl my-8 max-h-[90dvh] overflow-y-auto"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-3xl shadow-lg border border-cyan-400/30 shrink-0">
            {fish.emoji}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-white tracking-tight">{fish.name}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 border border-cyan-800 text-cyan-300">
                {fish.category}
              </span>
            </div>
            <div className="text-xs text-slate-400 italic mt-0.5 truncate">
              {scientific ? `${scientific.scientificName} · Familya: ${scientific.family}` : fish.latinName}
            </div>
          </div>
        </div>

        {/* Scientific Profile & Trophic Level Bar */}
        <div className="p-3.5 rounded-2xl bg-[#131d30] border border-slate-800 mb-5 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <span>🔬 Bilimsel Taksonomi & Trofik Seviye</span>
            </div>
            <div className="text-xl font-black font-mono text-cyan-400 mt-0.5">
              {scientific ? `Trofik Skor: ${scientific.trophicLevel} / 5.0` : `%${fish.currentScore}`}
            </div>
            <div className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">
              {scientific ? `FishBase besin zinciri seviyesidir · ${scientific.blackSeaSeasonality}` : 'Genel rehber göstergesi'}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
            {scientific ? 'FishBase Teyitli' : fish.activityStatus}
          </span>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 text-xs text-slate-300">
          
          {/* Best Hours & Season */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">En Verimli Saatler</span>
              </div>
              <div className="font-bold text-slate-200">{fish.bestHours}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold">Mevsim & Sıcaklık</span>
              </div>
              <div className="font-bold text-slate-200">{fish.season} ({fish.idealTemp})</div>
            </div>
          </div>

          {/* Depth */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-slate-400 font-semibold mb-1">Derinlik Aralığı</div>
            <div className="font-mono text-cyan-300 font-bold">{fish.depthRange}</div>
          </div>

          {/* Best Baits */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <span>🦐</span>
              <span>Tavsiye Edilen Yemler</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {fish.bestBaits.map((b, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs border border-slate-700">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Tackle / Gear */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span>🎣</span>
              <span>Takım ve Donanım Tavsiyesi</span>
            </div>
            <div className="text-slate-300 leading-relaxed">
              {fish.bestTackle}
            </div>
          </div>

          {/* Legal Limit Warning */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 text-amber-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300">
                Yasal Asgari Av Boyu: {fish.legalMinLength}
              </div>
              <div className="text-[11px] text-amber-200/80 mt-0.5">
                Limit: {fish.bagLimit}. Bu boyun altındaki balıkların yaşama iade edilmesi kanunen mecburidir.
              </div>
            </div>
          </div>

          {/* Scientific Literature References */}
          {scientific && (
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-200 flex items-center justify-between">
                <span>📚 Bilimsel Kaynaklar & Mevzuat Dayanağı</span>
                <span className="text-[9px] text-cyan-400 font-mono">Tebliğ 5/2 & FishBase</span>
              </div>
              <div className="space-y-1.5 text-[10.5px]">
                {scientific.scientificReferences.map((ref, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-950/70 border border-slate-800/80">
                    <div className="truncate min-w-0">
                      <span className="text-slate-300 font-medium">{ref.title}</span>
                      <span className="text-slate-500 text-[9.5px] block truncate">{ref.authorOrOrg} ({ref.yearOrEdition})</span>
                    </div>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 shrink-0 p-1 text-[10px] font-semibold underline flex items-center gap-0.5"
                    >
                      <span>İncele</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
              <div className="text-[9.5px] text-slate-400 pt-1 border-t border-slate-800/80">
                Mevsimsel Durum: {scientific.seasonalBansText}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="text-xs text-slate-400 leading-relaxed italic">
            "{fish.description}"
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              onSelectOnMap(fish);
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950 transition active:scale-95"
          >
            Bu Balığı İdeal Av Sahasında Göster
          </button>
        </div>

      </div>
    </div>
  );
};
