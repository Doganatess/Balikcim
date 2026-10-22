import React, { useState } from 'react';
import { 
  User, 
  Smartphone, 
  Database, 
  Download, 
  Trash2, 
  Compass, 
  Anchor, 
  Ship, 
  Check, 
  Share2, 
  ShieldCheck, 
  Info,
  ExternalLink
} from 'lucide-react';
import { REGIONS, Region } from '../data/regionsData';
import { getStoredCatches, getStoredFavorites } from '../data/catchesData';

interface ProfilTabProps {
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  defaultLocationType: 'kiyi' | 'tekne';
  onChangeLocationType: (type: 'kiyi' | 'tekne') => void;
}

export const ProfilTab: React.FC<ProfilTabProps> = ({
  selectedRegion,
  onSelectRegion,
  defaultLocationType,
  onChangeLocationType
}) => {
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);
  const [dataClearedNotice, setDataClearedNotice] = useState(false);

  const catches = getStoredCatches();
  const personalCatches = catches.filter(c => c.isPersonal);
  const favorites = getStoredFavorites();

  const handleExportData = () => {
    const exportObj = {
      app: 'BalikYakala-Personal',
      date: new Date().toISOString(),
      personalCatches,
      favoriteSpotIds: favorites,
      preferredRegion: selectedRegion.name,
      preferredType: defaultLocationType
    };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balik_yakala_yedek_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearPersonalData = () => {
    if (window.confirm('Cihazınıza kayıtlı tüm kişisel av ve favori mera verilerini silmek istediğinizden emin misiniz?')) {
      localStorage.removeItem('balik_yakala_catches_v1');
      localStorage.removeItem('balik_yakala_favorites_v1');
      setDataClearedNotice(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-2 pb-12 space-y-4">
      
      {/* Top Title */}
      <div className="pb-1">
        <h2 className="text-lg font-black text-white">Profil & Kişisel Tercihler</h2>
        <p className="text-xs text-slate-400">
          Kişisel kullanım ayarları ve Safari cihaz depolama yönetimi
        </p>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-2xl bg-[#111927] border border-slate-800 flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-2xl text-cyan-400">
          🎣
        </div>
        <div>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Kişisel Balıkçı Hesabı</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-semibold">
              Aktif
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Cihaz: iPhone Safari Web App (PWA)
          </div>
        </div>
      </div>

      {/* iOS Safari Home Screen Guide Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-cyan-950/40 border border-cyan-800/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              iPhone Ana Ekranına Ekle
            </h3>
          </div>
          <button
            onClick={() => setShowIOSInstallGuide(!showIOSInstallGuide)}
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300"
          >
            {showIOSInstallGuide ? 'Kapat' : 'Nasıl Yapılır?'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Bu uygulamayı Safari'de açtıktan sonra <strong>Paylaş</strong> simgesine dokunup <strong>"Ana Ekrana Ekle"</strong> derseniz tam ekran mobil uygulama olarak kullanabilirsiniz.
        </p>

        {showIOSInstallGuide && (
          <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 space-y-2 animate-in fade-in">
            <div className="font-bold text-cyan-300">Kurulum Adımları (iOS Safari):</div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-600 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
              <span>Safari tarayıcısının alt çubuğundaki <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-cyan-400" /> <strong>Paylaş</strong> düğmesine dokunun.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-600 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
              <span>Aşağı kaydırarak <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> seçeneğini seçin.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-cyan-600 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
              <span>Sağ üstteki <strong>"Ekle"</strong> butonuna basın. Artık ana ekranınızda özel simgesiyle hazır!</span>
            </div>
          </div>
        )}
      </div>

      {/* Default Preferences */}
      <div className="p-4 rounded-2xl bg-[#111927] border border-slate-800 space-y-3.5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Varsayılan Av Tercihleri
        </h3>

        {/* Region */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Varsayılan Av Bölgesi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r)}
                className={`p-2.5 rounded-xl text-left border text-xs flex items-center justify-between transition ${
                  r.id === selectedRegion.id
                    ? 'bg-slate-900 border-cyan-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-[10px] text-slate-500">{r.city} · {r.sea}</div>
                </div>
                {r.id === selectedRegion.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Shore / Boat */}
        <div className="pt-2 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Varsayılan Avlanma Şekli
          </label>
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onChangeLocationType('kiyi')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                defaultLocationType === 'kiyi' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              <span>Kıyı Balıkçılığı</span>
            </button>
            <button
              onClick={() => onChangeLocationType('tekne')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                defaultLocationType === 'tekne' ? 'bg-cyan-600 text-white' : 'text-slate-400'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              <span>Tekne Balıkçılığı</span>
            </button>
          </div>
        </div>
      </div>

      {/* Local Data Storage & Privacy */}
      <div className="p-4 rounded-2xl bg-[#111927] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cihaz Depolama Durumu</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Yerel (localStorage)</span>
        </div>

        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Kişisel Av Defteri Kayıtları:</span>
            <strong className="text-white font-mono">{personalCatches.length} Kayıt</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Favori Meralar:</span>
            <strong className="text-white font-mono">{favorites.length} Mera</strong>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Bulut Senkronizasyonu:</span>
            <span className="text-slate-400 text-[11px]">Kapalı (Yalnızca bu cihazda saklanır)</span>
          </div>
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={handleExportData}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Yedeği İndir</span>
          </button>
          <button
            onClick={handleClearPersonalData}
            className="py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Verileri Temizle</span>
          </button>
        </div>

        {dataClearedNotice && (
          <div className="text-[11px] text-emerald-400 font-semibold text-center pt-1">
            Kişisel veriler temizlendi, sayfa yenileniyor...
          </div>
        )}
      </div>

      {/* System & Data Source Transparency Notice */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Şeffaf Veri ve Sistem Bilgisi</span>
        </div>
        <p className="leading-relaxed">
          Bu uygulama kişisel kullanım amaçlıdır. Ticari satış, abonelik veya ödeme sistemi içermez.
        </p>
        <p className="leading-relaxed">
          Görüntülenen hava durumu, dalga, akıntı ve av olasılık skorları simüle edilmiş hidrografik model verileridir (Copernicus CMEMS ve Open-Meteo referans modelleri temel alınmıştır). Harici canlı API anahtarları yapılandırılana kadar örnek model değerleri sunulmaktadır.
        </p>
      </div>

    </div>
  );
};
