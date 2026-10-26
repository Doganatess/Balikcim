import { VERIFIED_COASTAL_SPOTS, validateCoastalSpots, classifyPointGeography, isLandPoint, distanceToLandBoundaryKm } from '../src/data/samsunOrduMapData.js';
import { MERALAR_LIST, MERA_STATS } from '../src/data/meralarData.js';

console.log('=====================================================');
console.log('   BALIKCIM COĞRAFİ DOĞRULAMA & BÜTÜNLÜK TESTİ       ');
console.log('=====================================================');

// 1. Toplam Sayı Kontrolü
console.log(`\n1. Toplam Nokta Sayısı: ${VERIFIED_COASTAL_SPOTS.length} (MeralarList: ${MERALAR_LIST.length})`);
if (VERIFIED_COASTAL_SPOTS.length !== 30 || MERALAR_LIST.length !== 30) {
  console.error('❌ HATA: Nokta sayısı 30 değil!');
  process.exit(1);
} else {
  console.log('✅ Toplam nokta sayısı tam 30.');
}

// 2. MapData ile MeralarData Eşleşme Kontrolü
console.log('\n2. Veri Kaynakları Eşleşme Kontrolü:');
let mismatchCount = 0;
for (const s of VERIFIED_COASTAL_SPOTS) {
  const m = MERALAR_LIST.find((item: any) => item.id === s.id);
  if (!m) {
    console.error(`❌ ${s.id} MERALAR_LIST içinde bulunamadı!`);
    mismatchCount++;
  } else if (m.lat !== s.lat || m.lng !== s.lng) {
    console.error(`❌ Koordinat uyumsuzluğu (${s.id}): map=(${s.lat},${s.lng}) vs meralar=(${m.lat},${m.lng})`);
    mismatchCount++;
  } else if (m.haritadaAktifMi !== s.haritadaAktifMi) {
    console.error(`❌ haritadaAktifMi uyumsuzluğu (${s.id})`);
    mismatchCount++;
  }
}
if (mismatchCount === 0) {
  console.log('✅ Tüm 30 nokta VERIFIED_COASTAL_SPOTS ve MERALAR_LIST arasında birebir eşleşiyor.');
}

// 3. Otomatik Doğrulama Fonksiyonu Kontrolü
console.log('\n3. validateCoastalSpots() Doğrulaması:');
const validation = validateCoastalSpots();
console.log(`- Toplam: ${validation.totalSpots}`);
console.log(`- Aktif Harita İşaretçisi: ${validation.activeSpotsCount}`);
console.log(`- Gösterimden Ayrılmış / Pasif: ${validation.inactiveSpotsCount}`);
if (validation.isValid) {
  console.log('✅ validateCoastalSpots(): TÜM KONTROLLER GEÇTİ.');
} else {
  console.error('❌ validateCoastalSpots() Hatalar:', validation.errors);
  process.exit(1);
}

// 4. Her Noktanın Gerçek Kıyı Çizgisi Mesafesi ve Kara/Deniz Durumu
console.log('\n4. Aktif Noktaların Kıyı Geometrisi Analizi:');
let inlandFailures = 0;
let farSeaFailures = 0;

for (const spot of VERIFIED_COASTAL_SPOTS) {
  const geo = classifyPointGeography(spot.lat, spot.lng);
  const boundary = distanceToLandBoundaryKm(spot.lat, spot.lng);
  const distM = Math.round(boundary.distanceKm * 1000);

  console.log(`[${spot.id}] ${spot.name}:`);
  console.log(`   Koordinat: (${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}) | Aktif: ${spot.haritadaAktifMi}`);
  console.log(`   Kıyıya Mesafe: ${distM} m | Bölge: ${geo.zone} | Kanıt: ${spot.kanitSeviyesi}`);

  if (spot.haritadaAktifMi) {
    // Aktif noktalar kıyı çizgisi yakınında olmalıdır (<= 450m)
    if (distM > 450) {
      console.error(`   ❌ HATA: Aktif nokta kıyıdan çok uzakta (${distM}m)!`);
      farSeaFailures++;
    }
    // Aktif nokta karasal alanın derinliklerinde olmamalıdır
    if (geo.zoneType === 'kara') {
      console.error(`   ❌ HATA: Aktif nokta kara poligonu içinde!`);
      inlandFailures++;
    }
  } else {
    console.log(`   ℹ️ [GÖSTERİMDEN AYRILDI]: ${spot.aktifOlmamaGerekcesi}`);
  }
}

if (inlandFailures === 0 && farSeaFailures === 0) {
  console.log('\n✅ TÜM AKTİF MERALAR GERÇEK KIYI ÇİZGİSİ VE YAPILARINDA DOĞRULANDI.');
  console.log('   Hiçbir sahte, karada veya açık denizde kalan nokta haritada aktif olarak gösterilmiyor.');
} else {
  console.error(`\n❌ BAŞARISIZ: ${inlandFailures} karada nokta, ${farSeaFailures} açıkta nokta bulundu!`);
  process.exit(1);
}
