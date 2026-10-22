import React, { useState, useRef, useEffect } from 'react';
import { 
  Crosshair, 
  ChevronDown, 
  Wind, 
  Compass, 
  Maximize2, 
  ShieldCheck, 
  Navigation, 
  Layers, 
  Check, 
  Sparkles,
  X,
  Clock,
  Fish,
  Flame,
  Info
} from 'lucide-react';
import { Region, Hotspot } from '../data/regionsData';
import { FishSpecies, FISH_CATALOG } from '../data/fishData';

interface IdealAvSahasiMapProps {
  region: Region;
  selectedFish: FishSpecies;
  onSelectFish: (fish: FishSpecies) => void;
  onSelectHotspot?: (hotspot: Hotspot) => void;
}

export const IdealAvSahasiMap: React.FC<IdealAvSahasiMapProps> = ({
  region,
  selectedFish,
  onSelectFish,
  onSelectHotspot
}) => {
  const [fishDropdownOpen, setFishDropdownOpen] = useState(false);
  const [showCurrents, setShowCurrents] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(region.hotspots[0] || null);
  const [activeQuickTab, setActiveQuickTab] = useState<'mera' | 'saat' | 'yem' | 'olta' | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update active hotspot when region changes
  useEffect(() => {
    if (region.hotspots.length > 0) {
      setActiveHotspot(region.hotspots[0]);
    }
  }, [region]);

  // Canvas drawing for realistic marine chart + probability heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      step += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Deep sea / water background
      const waterGrad = ctx.createLinearGradient(0, 0, width, height);
      waterGrad.addColorStop(0, '#0c2340');
      waterGrad.addColorStop(0.5, '#0b3558');
      waterGrad.addColorStop(1, '#08253d');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Coastal Bathymetry / Depth contour lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let r = 80; r < width; r += 70) {
        ctx.beginPath();
        ctx.arc(width * 0.45, height * 0.7, r, Math.PI, Math.PI * 1.9);
        ctx.stroke();
      }

      // 3. Dynamic Fishing Probability Heatmap Layer (green-yellow-orange based on selected fish)
      // High bite probability near the headland/bay
      const heatCenter1X = width * 0.48;
      const heatCenter1Y = height * 0.42;

      const heatGrad = ctx.createRadialGradient(
        heatCenter1X, heatCenter1Y, 15,
        heatCenter1X, heatCenter1Y, 130
      );
      heatGrad.addColorStop(0, 'rgba(34, 197, 94, 0.65)'); // Hot green
      heatGrad.addColorStop(0.35, 'rgba(234, 179, 8, 0.55)'); // Vibrant yellow
      heatGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.35)'); // Orange
      heatGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      
      ctx.fillStyle = heatGrad;
      ctx.beginPath();
      ctx.ellipse(heatCenter1X, heatCenter1Y, 150, 95, Math.PI * -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Secondary offshore feeding pocket
      const heatGrad2 = ctx.createRadialGradient(
        width * 0.75, height * 0.35, 10,
        width * 0.75, height * 0.35, 90
      );
      heatGrad2.addColorStop(0, 'rgba(234, 179, 8, 0.5)');
      heatGrad2.addColorStop(0.6, 'rgba(34, 197, 94, 0.3)');
      heatGrad2.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = heatGrad2;
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.35, 90, 0, Math.PI * 2);
      ctx.fill();

      // 4. Coastline & Land representation (dark terrain matching Apple Maps marine theme)
      ctx.beginPath();
      ctx.moveTo(0, height * 0.62);
      ctx.bezierCurveTo(
        width * 0.25, height * 0.66,
        width * 0.38, height * 0.72,
        width * 0.52, height * 0.68
      );
      ctx.bezierCurveTo(
        width * 0.68, height * 0.64,
        width * 0.85, height * 0.72,
        width, height * 0.65
      );
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      // Land fill
      const landGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
      landGrad.addColorStop(0, '#192b21'); // Coastal green-dark
      landGrad.addColorStop(0.5, '#16221c');
      landGrad.addColorStop(1, '#0e1813');
      ctx.fillStyle = landGrad;
      ctx.fill();

      // Shoreline surf stroke
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 5. Animated Current flow arrows (Akıntı)
      if (showCurrents) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 1.2;

        const currentOffsets = [
          { x: width * 0.2, y: height * 0.35, len: 32 },
          { x: width * 0.4, y: height * 0.25, len: 40 },
          { x: width * 0.62, y: height * 0.28, len: 36 },
          { x: width * 0.82, y: height * 0.22, len: 30 }
        ];

        currentOffsets.forEach((p, idx) => {
          const shift = (Math.sin(step + idx) * 4);
          const px = p.x + shift;
          const py = p.y;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + p.len, py - 6);
          ctx.stroke();

          // Arrowhead
          ctx.beginPath();
          ctx.moveTo(px + p.len + 3, py - 6);
          ctx.lineTo(px + p.len - 4, py - 10);
          ctx.lineTo(px + p.len - 4, py - 2);
          ctx.fill();
        });
      }

      // 6. Animated Wind stream vectors (Rüzgar)
      if (showWind) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const wx = ((step * 60 + i * 90) % (width + 50)) - 20;
          const wy = 45 + (i * 30);
          ctx.beginPath();
          ctx.moveTo(wx, wy);
          ctx.lineTo(wx + 25, wy + 8);
          ctx.stroke();
        }
      }

      // 7. Radar sweep ring around main spot
      const pulseRadius = (step * 25) % 65;
      ctx.strokeStyle = `rgba(14, 165, 233, ${Math.max(0, 1 - pulseRadius / 65)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(heatCenter1X, heatCenter1Y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showCurrents, showWind, selectedFish]);

  return (
    <div id="av-sahasi" className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-8">
      
      {/* Header: ⌖ İdeal Av Sahası · [Çinekop ▾] (Directly matching IMG_5962) */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-slate-300" />
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            İdeal Av Sahası
          </h2>
          <span className="text-slate-500 font-light">·</span>
          
          {/* Target Fish Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setFishDropdownOpen(!fishDropdownOpen)}
              className="flex items-center gap-1.5 text-base sm:text-lg font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>{selectedFish.name}</span>
              <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${fishDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {fishDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#0e1626] border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 max-h-72 overflow-y-auto">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Hedef Balığı Değiştir
                </div>
                {FISH_CATALOG.map((fish) => (
                  <button
                    key={fish.id}
                    onClick={() => {
                      onSelectFish(fish);
                      setFishDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between hover:bg-slate-800 transition my-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{fish.emoji}</span>
                      <div>
                        <div className="font-bold text-slate-200">{fish.name}</div>
                        <div className="text-[10px] text-slate-400">{fish.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-cyan-400">%{fish.currentScore}</div>
                      <div className="text-[9px] text-slate-400">{fish.activityStatus}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bite Score Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Olasılık:</span>
          <span className="font-extrabold text-emerald-400 font-mono">%{selectedFish.currentScore}</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-400 font-medium">{selectedFish.activityStatus}</span>
        </div>
      </div>

      {/* The Map Card (Directly matching IMG_5962) */}
      <div className={`relative w-full rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#091524] ${
        isFullscreen ? 'fixed inset-4 z-50 max-w-none h-[calc(100vh-2rem)]' : 'h-[340px] sm:h-[420px]'
      }`}>
        
        {/* HTML5 Canvas with custom hydrographic vector & heatmap */}
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full object-cover cursor-crosshair"
          onClick={() => {
            // Select alternate spot on map click
            const nextIdx = (region.hotspots.indexOf(activeHotspot!) + 1) % region.hotspots.length;
            setActiveHotspot(region.hotspots[nextIdx]);
          }}
        />

        {/* Top-Left Controls: [⇄ Akıntı] & [༄ Rüzgar] */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 z-20">
          <button
            onClick={() => setShowCurrents(!showCurrents)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition backdrop-blur-md shadow-md ${
              showCurrents 
                ? 'bg-cyan-600/90 text-white border border-cyan-400/50' 
                : 'bg-slate-900/80 text-slate-400 border border-slate-700 hover:text-slate-200'
            }`}
            title="Akıntı Katmanı"
          >
            <Compass className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowWind(!showWind)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition backdrop-blur-md shadow-md ${
              showWind 
                ? 'bg-cyan-600/90 text-white border border-cyan-400/50' 
                : 'bg-slate-900/80 text-slate-400 border border-slate-700 hover:text-slate-200'
            }`}
            title="Rüzgar Katmanı"
          >
            <Wind className="w-4 h-4" />
          </button>
        </div>

        {/* Top-Right Control: Fullscreen */}
        <div className="absolute top-3.5 right-3.5 z-20">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center backdrop-blur-md transition shadow-md"
            title="Haritayı Genişlet"
          >
            {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Map Center Hotspot Pins and Labels */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Main Pin for selected hotspot */}
          <div className="relative flex flex-col items-center pointer-events-auto cursor-pointer -translate-y-6">
            
            {/* Popover Bubble */}
            <div className="mb-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/60 shadow-xl backdrop-blur-md text-center">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{activeHotspot?.name || region.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                  %{activeHotspot?.probScore || selectedFish.currentScore}
                </span>
              </div>
              <div className="text-[10px] text-slate-300">
                {activeHotspot?.depth} · {activeHotspot?.bottomType}
              </div>
            </div>

            {/* Glowing Map Pin Icon */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 ring-4 ring-white/20 animate-bounce">
                <Navigation className="w-4 h-4 fill-white rotate-45" />
              </div>
              <div className="w-3 h-1.5 bg-black/60 rounded-full blur-[2px] mx-auto mt-1" />
            </div>
          </div>
        </div>

        {/* Coast Town Names overlay */}
        <div className="absolute bottom-16 left-6 text-xs font-bold text-slate-300/80 drop-shadow select-none pointer-events-none">
          {region.city}, {region.name} Kıyıları
        </div>
        <div className="absolute bottom-12 left-16 text-[10px] text-slate-400/80 font-mono select-none pointer-events-none">
          Göbü · Çamlık
        </div>

        {/* Bottom-Left: Apple Maps / Legal watermark matching screenshot */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[11px] text-slate-300/90 font-medium z-20">
          <span className="font-semibold text-white/90"> Harita</span>
          <span className="text-slate-400 text-[10px] underline cursor-pointer">Yasal</span>
        </div>

        {/* Bottom-Right: [✓ Güvenli] Pill Badge matching screenshot */}
        <div className="absolute bottom-3 right-4 z-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 backdrop-blur-md border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Güvenli</span>
          </div>
        </div>

        {/* Fullscreen Close button */}
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-16 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-white shadow-xl z-30"
          >
            Tam Ekrandan Çık
          </button>
        )}
      </div>

      {/* 4 Circular Quick Filter Buttons (Directly matching IMG_5962) */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-5">
        
        {/* Mera Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'mera' ? null : 'mera')}
          className="flex flex-col items-center group"
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'mera'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-stone-800 to-slate-700 relative flex items-center justify-center">
              {/* Rocky coast visual thumbnail */}
              <div className="text-2xl">🪨</div>
              <div className="absolute inset-0 bg-cyan-900/30 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Mera
          </span>
        </button>

        {/* Saat Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'saat' ? null : 'saat')}
          className="flex flex-col items-center group"
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'saat'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-amber-900 to-indigo-950 relative flex items-center justify-center">
              {/* Sunset / Lighthouse visual thumbnail */}
              <div className="text-2xl">🌅</div>
              <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Saat
          </span>
        </button>

        {/* Yem Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'yem' ? null : 'yem')}
          className="flex flex-col items-center group"
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'yem'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-emerald-800 to-teal-950 relative flex items-center justify-center">
              {/* Lure tackle box visual thumbnail */}
              <div className="text-2xl">🦐</div>
              <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Yem
          </span>
        </button>

        {/* Olta Circle */}
        <button
          onClick={() => setActiveQuickTab(activeQuickTab === 'olta' ? null : 'olta')}
          className="flex flex-col items-center group"
        >
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border-2 transition ${
            activeQuickTab === 'olta'
              ? 'border-cyan-400 ring-4 ring-cyan-500/20'
              : 'border-slate-700 hover:border-slate-500'
          }`}>
            <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-blue-900 to-slate-900 relative flex items-center justify-center">
              {/* Angler rod visual thumbnail */}
              <div className="text-2xl">🎣</div>
              <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay" />
            </div>
          </div>
          <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition">
            Olta
          </span>
        </button>
      </div>

      {/* Quick Details Drawer when a circle is clicked */}
      {activeQuickTab && (
        <div className="mt-4 p-4 rounded-2xl bg-[#0f172a] border border-cyan-500/30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {activeQuickTab === 'mera' && <>🪨 {activeHotspot?.name || region.name} Mera Özellikleri</>}
              {activeQuickTab === 'saat' && <>🌅 {selectedFish.name} İçin En Verimli Saatler</>}
              {activeQuickTab === 'yem' && <>🦐 {selectedFish.name} İçin Tavsiye Edilen Yemler</>}
              {activeQuickTab === 'olta' && <>🎣 {selectedFish.name} Takım & Donanım Rehberi</>}
            </h4>
            <button
              onClick={() => setActiveQuickTab(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-1.5">
            {activeQuickTab === 'mera' && (
              <>
                <p><strong>Derinlik & Dip:</strong> {activeHotspot?.depth || '10 - 25m'} arası derinlik, {activeHotspot?.bottomType || 'Kırma taş ve kayalık'} dip yapısı.</p>
                <p><strong>Hedef Türler:</strong> {activeHotspot?.targetSpecies.join(', ') || selectedFish.name}. Akıntı burunları ve kayalık önleri ana beslenme hattıdır.</p>
              </>
            )}
            {activeQuickTab === 'saat' && (
              <>
                <p><strong>En İyi Av Penceresi:</strong> {selectedFish.bestHours}</p>
                <p><strong>Solunar Durumu:</strong> Bugün majör beslenme saati gündoğumuyla çakışıyor. Işığın kırıldığı ilk 90 dakika av verimi zirve yapar.</p>
              </>
            )}
            {activeQuickTab === 'yem' && (
              <>
                <p><strong>Önerilen Yemler:</strong> {selectedFish.bestBaits.join(' • ')}</p>
                <p><strong>İpucu:</strong> Çinekop ve lüfer için taze istavrit yaprak flato, levrek için sabah erken su üstü sahtesi (WTD aksiyonlu) en yüksek skorları vermektedir.</p>
              </>
            )}
            {activeQuickTab === 'olta' && (
              <>
                <p><strong>Takım Donanımı:</strong> {selectedFish.bestTackle}</p>
                <p><strong>Yasal Asgari Boy:</strong> <span className="text-amber-400 font-semibold">{selectedFish.legalMinLength}</span> (Av limitlerine uymak sürdürülebilir balıkçılık için zorunludur).</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Target Fish Summary Bar (Under map as seen in IMG_5962) */}
      <div className="mt-4 p-4 rounded-2xl bg-[#111927] border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-xl shadow-md">
            {selectedFish.emoji}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{selectedFish.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">({selectedFish.latinName})</span>
            </div>
            <div className="text-xs text-slate-400">
              En iyi yem: <span className="text-slate-200">{selectedFish.bestBaits[0]}</span> · Boy: {selectedFish.legalMinLength.split(' ')[0]}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-extrabold text-cyan-400 font-mono">
              %{selectedFish.currentScore}
            </div>
            <div className="text-[10px] text-slate-400">Av Skoru</div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {selectedFish.activityStatus}
          </span>
        </div>
      </div>

    </div>
  );
};
