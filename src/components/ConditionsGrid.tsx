import React, { useState } from 'react';
import { 
  Radio, 
  Calendar, 
  Anchor, 
  Ship, 
  Star, 
  ChevronRight, 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Waves, 
  Wind, 
  Compass, 
  Cloud, 
  Gauge, 
  Moon,
  ChevronDown,
  Info
} from 'lucide-react';
import { Region } from '../data/regionsData';

interface ConditionsGridProps {
  region: Region;
  onOpenRegionPicker?: () => void;
  onOpenHourlyModal?: () => void;
}

export const ConditionsGrid: React.FC<ConditionsGridProps> = ({
  region,
  onOpenRegionPicker,
  onOpenHourlyModal
}) => {
  const [activeMode, setActiveMode] = useState<'simdi' | 'planla'>('simdi');
  const [activeLocationType, setActiveLocationType] = useState<'kiyi' | 'tekne'>('kiyi');
  const [showHourlySlider, setShowHourlySlider] = useState(false);
  const [selectedHour, setSelectedHour] = useState(7); // 07:00 morning peak

  const c = region.conditions;

  const hourlyForecast = [
    { hour: '04:00', score: 62, desc: 'Düşük aktivite' },
    { hour: '05:00', score: 78, desc: 'Sabah suyu başlangıcı' },
    { hour: '06:00', score: 94, desc: '★ Zirve Beslenme Pencerisi' },
    { hour: '07:00', score: 96, desc: '★ En Yüksek Verim' },
    { hour: '08:00', score: 88, desc: 'Yüksek aktivite' },
    { hour: '09:00', score: 74, desc: 'Orta seviye' },
    { hour: '12:00', score: 55, desc: 'Öğle durgunluğu' },
    { hour: '16:00', score: 72, desc: 'İkindi hareketi' },
    { hour: '18:00', score: 89, desc: '★ Akşam Suyu' },
    { hour: '19:00', score: 91, desc: '★ Zirve Akşam Saati' },
    { hour: '21:00', score: 82, desc: 'Gece avı (Eşkina & Minekop)' },
    { hour: '23:00', score: 68, desc: 'Gece dip' },
  ];

  return (
    <div id="kosullar" className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Top Toggle Bar (Directly matching IMG_5962) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3">
        {/* Şimdi / Planla Pill Toggle */}
        <div className="flex p-1 rounded-2xl bg-[#0f172a] border border-slate-800">
          <button
            onClick={() => setActiveMode('simdi')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeMode === 'simdi'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Şimdi</span>
          </button>
          <button
            onClick={() => setActiveMode('planla')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeMode === 'planla'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Planla</span>
          </button>
        </div>

        {/* Secondary Toggles: Kıyı / Tekne & Location Pill */}
        <div className="flex items-center gap-2">
          {/* Kıyı / Tekne */}
          <div className="flex p-1 rounded-2xl bg-[#0f172a] border border-slate-800">
            <button
              onClick={() => setActiveLocationType('kiyi')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeLocationType === 'kiyi'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Anchor className="w-3 h-3" />
              <span>Kıyı</span>
            </button>
            <button
              onClick={() => setActiveLocationType('tekne')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeLocationType === 'tekne'
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ship className="w-3 h-3" />
              <span>Tekne</span>
            </button>
          </div>

          {/* Region Pill */}
          <button
            onClick={onOpenRegionPicker}
            className="flex-1 sm:flex-initial flex items-center justify-between gap-1.5 px-3.5 py-2 rounded-2xl bg-[#0f172a] border border-slate-800 text-xs sm:text-sm font-medium text-slate-200 hover:border-cyan-500/50 transition"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[130px] sm:max-w-none">{region.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* "En iyi av saati" Star Banner (Directly matching IMG_5962) */}
      <div 
        onClick={() => setShowHourlySlider(!showHourlySlider)}
        className="w-full mb-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#171a18] via-[#1a1c1d] to-[#171a18] border border-amber-950/40 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition group"
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-xs sm:text-sm font-bold text-amber-400">En iyi av saati</span>
          <span className="text-xs text-slate-300 hidden sm:inline">· Bugün {c.bestWindow}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-300 group-hover:text-amber-300 transition">
          <span>Saat saat gör</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showHourlySlider ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {/* Hourly Forecast Dropdown / Expandable */}
      {showHourlySlider && (
        <div className="mb-4 p-4 rounded-2xl bg-[#0f172a] border border-slate-800 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-300">
              24 Saatlik Av Skoru Pencereleri ({region.name})
            </div>
            <div className="text-[11px] text-cyan-400 font-mono">
              Solunar & Rüzgar Senkronize
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2">
            {hourlyForecast.map((h, i) => (
              <div 
                key={i}
                className={`p-2 rounded-xl text-center border transition ${
                  h.score >= 90 
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-300' 
                    : h.score >= 75 
                    ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-mono text-slate-400">{h.hour}</div>
                <div className="text-sm font-extrabold my-0.5">{h.score}</div>
                <div className="text-[9px] truncate">{h.score >= 90 ? '★ Zirve' : h.score >= 75 ? 'Aktif' : 'Normal'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9 Conditions Cards Grid (3 Columns x 3 Rows directly matching IMG_5962) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        
        {/* 1. Hava */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            <span>Hava</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {c.airTemp}°
          </div>
        </div>

        {/* 2. Deniz */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Deniz</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {c.waterTemp}°
          </div>
        </div>

        {/* 3. Yağış */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CloudRain className="w-3.5 h-3.5 text-blue-400" />
            <span>Yağış</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            %{c.rainChance}
          </div>
        </div>

        {/* 4. Dalga */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              <span>Dalga</span>
            </div>
            <span className="text-[11px] text-slate-500">{c.wavePeriod}s</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            {c.waveHeight} <span className="text-xs font-normal text-slate-400">m</span>
          </div>
        </div>

        {/* 5. Rüzgar */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rüzgar</span>
            </div>
            <span className="text-[11px] font-bold text-slate-300">{c.windDirection}</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {c.windSpeed} <span className="text-xs font-normal text-slate-400">km/sa</span>
          </div>
        </div>

        {/* 6. Akıntı */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Akıntı</span>
            </div>
            <span className="text-[11px] font-bold text-slate-300">{c.currentDirection}</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {c.currentSpeed} <span className="text-xs font-normal text-slate-400">m/s</span>
          </div>
        </div>

        {/* 7. Bulut */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bulut</span>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            %{c.cloudCoverage}
          </div>
        </div>

        {/* 8. Basınç */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>Basınç</span>
            </div>
            <span className="text-xs text-emerald-400 font-bold">↘</span>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {c.pressure} <span className="text-xs font-normal text-slate-400">hPa</span>
          </div>
        </div>

        {/* 9. Ay */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111927] border border-slate-800/80 hover:border-slate-700 transition">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Moon className="w-3.5 h-3.5 text-purple-400" />
            <span>Ay</span>
          </div>
          <div className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1">
            <span>{c.moonPhaseIcon}</span>
            <span>{c.moonPhase}</span>
          </div>
        </div>

      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 px-1">
        <span>Kıyı & Tekne Sensör Modeli</span>
        <span className="font-mono text-cyan-500/70">Örnek Veri (Çevrimdışı Model)</span>
      </div>
    </div>
  );
};
