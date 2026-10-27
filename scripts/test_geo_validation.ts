import { 
  VERIFIED_COASTAL_SPOTS, 
  validateCoastalSpots, 
  classifyPointGeography, 
  isLandPoint, 
  distanceToLandBoundaryKm 
} from '../src/data/samsunOrduMapData.js';
import { MERALAR_LIST, MERA_STATS } from '../src/data/meralarData.js';
import { fetchLiveMarineAndWeather } from '../src/services/openMeteoService.js';

console.log('=====================================================');
console.log('   BALIKCIM SIFIR MERA & HAVA/DENİZ VERİ DENETİMİ    ');
console.log('=====================================================');

// 1. Hazır Mera Sıfırlama Kontrolü
console.log(`\n1. Hazır Mera Sayısı Kontrolü:`);
console.log(`- VERIFIED_COASTAL_SPOTS: ${VERIFIED_COASTAL_SPOTS.length}`);
console.log(`- MERALAR_LIST: ${MERALAR_LIST.length}`);
console.log(`- MERA_STATS.total: ${MERA_STATS.total}`);

if (VERIFIED_COASTAL_SPOTS.length !== 0 || MERALAR_LIST.length !== 0 || MERA_STATS.total !== 0) {
  console.error('❌ HATA: Hazır meralar tamamen kaldırılmamış! Sayı 0 olmalı.');
  process.exit(1);
} else {
  console.log('✅ KABUL KRİTERİ GEÇTİ: Uygulamada hiçbir hazır mera kalmamıştır (Mera sayısı: 0).');
}

// 2. Otomatik Doğrulama Bütünlüğü
console.log('\n2. validateCoastalSpots() Kontrolü:');
const validation = validateCoastalSpots();
console.log(`- Toplam: ${validation.totalSpots}`);
console.log(`- Aktif Harita İşaretçisi: ${validation.activeSpotsCount}`);
console.log(`- Hatalar: ${validation.errors.length}`);
if (validation.isValid && validation.totalSpots === 0 && validation.activeSpotsCount === 0) {
  console.log('✅ validateCoastalSpots(): 0 hazır nokta ile temiz doğrulama başarılı.');
} else {
  console.error('❌ validateCoastalSpots() Hata:', validation.errors);
  process.exit(1);
}

// 3. Serbest Koordinat Coğrafi Sınıflandırma Kontrolü
console.log('\n3. Serbest Nokta Coğrafi Sınıflandırma Testi:');
// Ünye sahil koordinatı testi
const testCoastPoint = classifyPointGeography(41.1385, 37.3195);
console.log(`- Ünye Sahil Testi (41.1385, 37.3195): Bölge="${testCoastPoint.zone}", Mesafe=${testCoastPoint.distanceToCoastKm} km`);
if (testCoastPoint.isWithinBounds) {
  console.log('✅ Serbest koordinat analizi 0 mera varken hatasız çalışıyor.');
} else {
  console.error('❌ Serbest koordinat analizi başarısız!');
  process.exit(1);
}

// 4. Canlı Open-Meteo Weather ve Marine API Entegrasyon Testi
console.log('\n4. Canlı Open-Meteo Weather & Marine API Çağrı Testi:');
async function runApiTest() {
  try {
    const liveData = await fetchLiveMarineAndWeather(41.1385, 37.3195, 'Ünye Test', {
      airTemp: 14,
      waterTemp: 19.3,
      windSpeed: 10,
      windDirection: 'G',
      waveHeight: 0.3,
      wavePeriod: 4,
      cloudCoverage: 50,
      pressure: 1013,
      rainChance: 10,
      bestWindow: '06:00 - 09:00'
    });

    console.log(`- Hava Sıcaklığı: ${liveData.airTemp} °C (Model 2m)`);
    console.log(`- Deniz Suyu Sıcaklığı: ${liveData.waterTemp !== null ? liveData.waterTemp + ' °C' : 'Veri Yok'} (${liveData.waterTempNote})`);
    console.log(`- Rüzgâr Hızı: ${liveData.windSpeed} km/sa | Hamle: ${liveData.windGusts ?? '--'} km/sa | Yön: ${liveData.windDirection}`);
    console.log(`- Dalga Yüksekliği: ${liveData.waveHeight} m | Periyot: ${liveData.wavePeriod} s | Kaynak: ${liveData.waveSource}`);
    console.log(`- Rüzgâr Dalgası: ${liveData.windWaveHeight ?? '--'} m | Solugan (Swell): ${liveData.swellWaveHeight ?? '--'} m`);
    console.log(`- Akıntı: ${liveData.currentSpeed !== null ? liveData.currentSpeed + ' km/sa (' + liveData.currentSpeedMs + ' m/s)' : 'Veri Yok'} | Yön: ${liveData.currentDirection ?? '--'}`);
    console.log(`- Basınç: ${liveData.pressure} hPa (MSL)`);
    console.log(`- Yağış: %${liveData.rainChance} ihtimal · ${liveData.precipitationMm} mm miktar`);
    console.log(`- Ay Fazı: ${liveData.moonPhaseIcon} ${liveData.moonPhase} | Solunar Puanı: ${liveData.solunarRating}`);
    console.log(`- Saatlik Tahmin Adet: ${liveData.hourlyForecast.length}`);
    console.log(`- Zaman Referansı: ${liveData.lastUpdatedText}`);

    // Doğrulama Kontrolleri
    if (typeof liveData.airTemp !== 'number' || isNaN(liveData.airTemp)) {
      throw new Error('Hava sıcaklığı sayısal değil!');
    }
    if (typeof liveData.waveHeight !== 'number' || isNaN(liveData.waveHeight)) {
      throw new Error('Dalga yüksekliği sayısal değil!');
    }
    if (liveData.windSpeed <= 0 && liveData.sourceStatus === 'MODEL_OPEN_METEO') {
      // Wind speed could be 0 if calm, but should be finite
      if (!Number.isFinite(liveData.windSpeed)) throw new Error('Rüzgâr hızı geçersiz!');
    }

    console.log('\n✅ TÜM HAVA VE DENİZ ENTEGRASYON KONTROLLERİ BAŞARIYLA TAMAMLANDI.');
  } catch (err) {
    console.error('❌ API Test Hatası:', err);
    process.exit(1);
  }
}

runApiTest();
