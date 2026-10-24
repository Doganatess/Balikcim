import React from 'react';
import { X, Compass, MapPin, Check, Waves, ShieldCheck } from 'lucide-react';
import { REGIONS, Region } from '../data/regionsData';

interface RegionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
}

export const RegionPickerModal: React.FC<RegionPickerModalProps> = ({
  isOpen,
  onClose,
  selectedRegion,
  onSelectRegion
}) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0e1626] border border-slate-700 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[85dvh] flex flex-col"
      >
        
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Av Bölgesi & Kıyı Seçin</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Deniz ve hava durumu seçilen bölgenin gerçek modellerine göre güncellenir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {REGIONS.map((region) => {
            const isSelected = region.id === selectedRegion.id;
            return (
              <button
                key={region.id}
                onClick={() => {
                  onSelectRegion(region);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-[#111927] border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{region.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                        {region.sea}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {region.city} · Su Sıcaklığı: <span className="text-slate-200">{region.conditions.waterTemp}°C</span> · Dalga: <span className="text-slate-200">{region.conditions.waveHeight}m</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    {region.conditions.safetyStatus}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 ml-1" />}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
