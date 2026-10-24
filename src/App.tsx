import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  BookOpen, 
  Compass, 
  User, 
  MapPin, 
  ShieldCheck, 
  Info 
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ConditionsGrid } from './components/ConditionsGrid';
import { IdealAvSahasiMap } from './components/IdealAvSahasiMap';
import { FishScoresSection } from './components/FishScoresSection';
import { FishCatalogSection } from './components/FishCatalogSection';
import { LiveCatchesSection } from './components/LiveCatchesSection';
import { AvDefteriPreview } from './components/AvDefteriPreview';
import { MeralarPreview } from './components/MeralarPreview';
import { ProfilTab } from './components/ProfilTab';
import { FishDetailModal } from './components/FishDetailModal';
import { RegionPickerModal } from './components/RegionPickerModal';
import { REGIONS, Region } from './data/regionsData';
import { FISH_CATALOG, FishSpecies } from './data/fishData';

export default function App() {
  // Selected region (Default to Ünye Körfezi as in reference screenshots)
  const [selectedRegion, setSelectedRegion] = useState<Region>(() => {
    try {
      const saved = localStorage.getItem('balik_yakala_saved_region');
      if (saved) {
        const found = REGIONS.find(r => r.id === saved);
        if (found) return found;
      }
    } catch (e) {}
    return REGIONS[0];
  });

  // Selected targeted fish species (Default to Çinekop)
  const [selectedFish, setSelectedFish] = useState<FishSpecies>(FISH_CATALOG[0]);

  // Active Bottom Tab: 'yakala' | 'tahmin' | 'defter' | 'meralar' | 'profil'
  const [activeTab, setActiveTab] = useState<'yakala' | 'tahmin' | 'defter' | 'meralar' | 'profil'>('yakala');

  // Shore / Boat preference
  const [locationType, setLocationType] = useState<'kiyi' | 'tekne'>('kiyi');

  // Modals state
  const [regionPickerOpen, setRegionPickerOpen] = useState(false);
  const [detailModalFish, setDetailModalFish] = useState<FishSpecies | null>(null);
  const [targetSpotForMap, setTargetSpotForMap] = useState<string | null>(null);

  // Save selected region
  const handleSelectRegion = (r: Region) => {
    setSelectedRegion(r);
    try {
      localStorage.setItem('balik_yakala_saved_region', r.id);
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#060A0F] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white pb-[calc(5.5rem+env(safe-area-inset-bottom,20px))]">
      
      {/* 1. Mobile Header with Balık Yakala Brand & Region Pill */}
      <Navbar
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
        onOpenRegionPicker={() => setRegionPickerOpen(true)}
      />

      {/* 2. Main Tab Content (Responsive Mobile Viewport Container) */}
      <main className="flex-1 w-full max-w-lg mx-auto">
        
        {/* ============================================================== */}
        {/* TAB 1: YAKALA (Conditions Grid + Ideal Av Sahası Map + Scores + Catalog) */}
        {/* ============================================================== */}
        {activeTab === 'yakala' && (
          <div className="pt-2 animate-in fade-in duration-150">
            {/* 9 Conditions Cards Grid */}
            <ConditionsGrid
              region={selectedRegion}
              onOpenRegionPicker={() => setRegionPickerOpen(true)}
            />

            {/* İdeal Av Sahası Map Card with 4 Quick Circles (Mera, Saat, Yem, Olta) */}
            <IdealAvSahasiMap
              region={selectedRegion}
              selectedFish={selectedFish}
              onSelectFish={setSelectedFish}
              targetSpotName={targetSpotForMap}
              onClearTargetSpot={() => setTargetSpotForMap(null)}
            />

            {/* Active Fish Scores in selected region */}
            <FishScoresSection
              region={selectedRegion}
              selectedFish={selectedFish}
              onSelectFish={setSelectedFish}
              onOpenDetailsModal={setDetailModalFish}
            />

            {/* 101 Fish Catalog & Guide with search */}
            <FishCatalogSection
              onSelectFish={(fish) => {
                setSelectedFish(fish);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDetailsModal={setDetailModalFish}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TAHMIN (Live Catches Feed & Reports) */}
        {/* ============================================================== */}
        {activeTab === 'tahmin' && (
          <div className="animate-in fade-in duration-150">
            <LiveCatchesSection region={selectedRegion} />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: AV DEFTERİM (Logbook, Spot Session & Personal Records) */}
        {/* ============================================================== */}
        {activeTab === 'defter' && (
          <div className="animate-in fade-in duration-150">
            <AvDefteriPreview region={selectedRegion} />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MERALAR (30 Spots, Favorites & Search) */}
        {/* ============================================================== */}
        {activeTab === 'meralar' && (
          <div className="animate-in fade-in duration-150">
            <MeralarPreview 
              region={selectedRegion}
              onSelectRegionSpot={(spotName) => {
                setTargetSpotForMap(spotName);
                setActiveTab('yakala');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: PROFİL (Preferences, Safari PWA Guide & Storage) */}
        {/* ============================================================== */}
        {activeTab === 'profil' && (
          <div className="animate-in fade-in duration-150">
            <ProfilTab
              selectedRegion={selectedRegion}
              onSelectRegion={handleSelectRegion}
              defaultLocationType={locationType}
              onChangeLocationType={setLocationType}
            />
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* 3. Mobile Bottom Navigation Bar (Directly matching reference screenshots) */}
      {/* ============================================================== */}
      <nav 
        aria-label="Alt Gezinme"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c1320]/95 backdrop-blur-xl border-t border-slate-800/80 bottom-nav-safe"
      >
        <div className="max-w-md mx-auto h-[62px] px-2 flex items-center justify-between text-center">
          
          {/* 1. Yakala */}
          <button
            onClick={() => {
              setActiveTab('yakala');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'yakala' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <span className="text-xl">🐟</span>
              {activeTab === 'yakala' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.5 -right-1" />
              )}
            </div>
            <span className="text-[11px] font-bold mt-0.5">Yakala</span>
          </button>

          {/* 2. Tahmin */}
          <button
            onClick={() => {
              setActiveTab('tahmin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'tahmin' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Radio className="w-5 h-5" />
              {activeTab === 'tahmin' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.5 -right-1" />
              )}
            </div>
            <span className="text-[11px] font-bold mt-0.5">Tahmin</span>
          </button>

          {/* 3. Av Defterim */}
          <button
            onClick={() => {
              setActiveTab('defter');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'defter' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <BookOpen className="w-5 h-5" />
              {activeTab === 'defter' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.5 -right-1" />
              )}
            </div>
            <span className="text-[11px] font-bold mt-0.5">Av Defterim</span>
          </button>

          {/* 4. Meralar */}
          <button
            onClick={() => {
              setActiveTab('meralar');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'meralar' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Compass className="w-5 h-5" />
              {activeTab === 'meralar' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.5 -right-1" />
              )}
            </div>
            <span className="text-[11px] font-bold mt-0.5">Meralar</span>
          </button>

          {/* 5. Profil */}
          <button
            onClick={() => {
              setActiveTab('profil');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition ${
              activeTab === 'profil' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <User className="w-5 h-5" />
              {activeTab === 'profil' && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.5 -right-1" />
              )}
            </div>
            <span className="text-[11px] font-bold mt-0.5">Profil</span>
          </button>

        </div>
      </nav>

      {/* ================= MODALS ================= */}

      {/* Fish Detail Guide Modal */}
      <FishDetailModal
        fish={detailModalFish}
        onClose={() => setDetailModalFish(null)}
        onSelectOnMap={(fish) => {
          setSelectedFish(fish);
          setActiveTab('yakala');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Region Picker Modal */}
      <RegionPickerModal
        isOpen={regionPickerOpen}
        onClose={() => setRegionPickerOpen(false)}
        selectedRegion={selectedRegion}
        onSelectRegion={handleSelectRegion}
      />

    </div>
  );
}
