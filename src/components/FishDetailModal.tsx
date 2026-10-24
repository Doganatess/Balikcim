import React from 'react';
import { X, Fish, ShieldCheck, Clock, Waves, Compass, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { FishSpecies } from '../data/fishData';

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
              {fish.latinName}
            </div>
          </div>
        </div>

        {/* Score & Activity Bar */}
        <div className="p-3.5 rounded-2xl bg-[#131d30] border border-slate-800 mb-5 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-slate-400">Katalog Aktivite İndeksi</div>
            <div className="text-2xl font-black font-mono text-cyan-400">%{fish.currentScore}</div>
            <div className="text-[9.5px] text-slate-500 mt-0.5 leading-tight">Genel tür rehberi endeksidir; konuma özgü balık tutma garantisi değildir.</div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
            {fish.activityStatus}
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
