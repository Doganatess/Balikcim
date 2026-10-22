import React, { useState } from 'react';
import { Compass, ChevronDown, Check } from 'lucide-react';
import { REGIONS, Region } from '../data/regionsData';

interface NavbarProps {
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  onOpenRegionPicker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedRegion,
  onSelectRegion,
  onOpenRegionPicker
}) => {
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#060A0F]/95 backdrop-blur-md border-b border-slate-800/80 pt-safe transition-all">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#060A0F] rounded-[9px] flex items-center justify-center">
              <span className="text-base">🐟</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white">
              Balık Yakala
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 font-medium">
              Kişisel Av Rehberi
            </span>
          </div>
        </div>

        {/* Region Selector Pill (Directly matching screenshot) */}
        <div className="relative">
          <button
            onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800 transition active:scale-95"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[130px] sm:max-w-none">{selectedRegion.name}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {regionDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#0e1626] border border-slate-700 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
                <span>Avlak Değiştir</span>
                <span className="text-[9px] text-cyan-400 font-mono">10 Bölge</span>
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {REGIONS.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => {
                      onSelectRegion(region);
                      setRegionDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800 transition my-0.5"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{region.name}</div>
                      <div className="text-[10px] text-slate-400">{region.city} · {region.sea}</div>
                    </div>
                    {region.id === selectedRegion.id && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
