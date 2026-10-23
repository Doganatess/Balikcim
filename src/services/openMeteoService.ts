/**
 * Open-Meteo Canlı Hava ve Deniz Tahmin Servisi
 * 
 * Bu servis, ücretsiz ve API anahtarı gerektirmeyen Open-Meteo Forecast & Marine API'lerini kullanır.
 * Samsun–Ordu kıyı koordinatları için anlık sıcaklık, rüzgâr, basınç, bulut, yağış ve dalga verilerini çeker.
 * 
 * Şeffaflık İlkeleri:
 * 1. Hava, rüzgâr, basınç, bulut -> Open-Meteo Canlı Model
 * 2. Dalga yüksekliği & periyodu -> Open-Meteo Marine API (veya rüzgâr destekli kıyı hidrodinamik tahmini)
 * 3. Su sıcaklığı -> NASA GIBS / Copernicus referans kıyı modeli (anlık kıyı sensörü olmadığı açıkça belirtilir)
 * 4. Ay fazı -> Matematiksel astronomik algoritma
 * 5. Av skoru -> Kural tabanlı teorik hidro-meteorolojik model (biyokütle veya canlı balık tespiti değildir)
 */

export interface HourlyForecastItem {
  hour: string;
  score: number;
  desc: string;
  temp?: number;
  rainProb?: number;
  windSpeed?: number;
  waveHeight?: number;
}

export interface LiveConditionsData {
  airTemp: number; // °C
  waterTemp: number; // °C
  waterTempNote: string;
  rainChance: number; // %
  precipitationMm: number; // mm
  waveHeight: number; // metre
  wavePeriod: number; // saniye
  waveDirection: string;
  waveSource: 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' | 'Kıyı Rüzgâr Modeli' | 'Referans Model';
  windSpeed: number; // km/sa
  windDirection: string; // K, KD, G, GB, vb.
  windDirectionDeg: number;
  currentSpeed: number; // m/s
  currentDirection: string;
  cloudCoverage: number; // %
  pressure: number; // hPa
  pressureTrend: 'up' | 'down' | 'steady';
  moonPhase: string;
  moonPhaseIcon: string;
  solunarRating: 'Çok Yüksek' | 'Yüksek' | 'Orta' | 'Düşük';
  safetyStatus: 'Güvenli' | 'Orta Dalgalı' | 'Riskli - Kıyıdan Kal';
  bestWindow: string;
  sourceStatus: 'MODEL_OPEN_METEO' | 'ONBELLEK' | 'YEDEK_MODEL';
  modelTime: string;
  fetchTime: string;
  lastUpdatedText: string;
  hourlyForecast: HourlyForecastItem[];
  apiNotice: string;
}

// Rüzgâr yönü derecesini Türkçe pusula yönüne çevirir
export function degreeToTurkishDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'K';
  if (normalized >= 22.5 && normalized < 67.5) return 'KD';
  if (normalized >= 67.5 && normalized < 112.5) return 'D';
  if (normalized >= 112.5 && normalized < 157.5) return 'GD';
  if (normalized >= 157.5 && normalized < 202.5) return 'G';
  if (normalized >= 202.5 && normalized < 247.5) return 'GB';
  if (normalized >= 247.5 && normalized < 292.5) return 'B';
  return 'KB';
}

// Akıntı yönünü rüzgâr ve kıyı morfolojisinden tahmin eder
function estimateCurrentFromWind(windDeg: number, windSpeedKmH: number) {
  // Karadeniz doğu kıyısında genel akıntı batıdan doğuya (Doğu yönlü) akar.
  // Yerel rüzgâr sürüklenmesi akıntı hızını %2-3 oranında etkiler.
  const currentSpeed = Math.round((0.08 + (windSpeedKmH * 0.004)) * 100) / 100;
  const currentDeg = (windDeg + 25) % 360; // Coriolis sapması
  return {
    speed: Math.min(0.65, Math.max(0.04, currentSpeed)),
    direction: degreeToTurkishDirection(currentDeg)
  };
}

// Matematiksel kesinlikte Ay Fazı Hesabı (Synodic Month: 29.53058867 gün)
export function calculateAstronomicalMoonPhase(date: Date = new Date()): {
  phaseName: string;
  phaseIcon: string;
  solunarRating: 'Çok Yüksek' | 'Yüksek' | 'Orta' | 'Düşük';
} {
  // Bilinen Yeni Ay referansı: 11 Ocak 2024, 11:57 UTC
  const knownNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57, 0)).getTime();
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const cycleDays = 29.53058867;
  const age = ((diffDays % cycleDays) + cycleDays) % cycleDays;

  if (age < 1.84 || age >= 27.69) {
    return { phaseName: 'Yeni Ay', phaseIcon: '🌑', solunarRating: 'Çok Yüksek' };
  } else if (age < 5.53) {
    return { phaseName: 'Hilal (Büyüyen)', phaseIcon: '🌒', solunarRating: 'Yüksek' };
  } else if (age < 9.22) {
    return { phaseName: 'İlk Dördün', phaseIcon: '🌓', solunarRating: 'Orta' };
  } else if (age < 12.91) {
    return { phaseName: 'Şişkin (Büyüyen)', phaseIcon: '🌔', solunarRating: 'Yüksek' };
  } else if (age < 16.61) {
    return { phaseName: 'Dolunay', phaseIcon: '🌕', solunarRating: 'Çok Yüksek' };
  } else if (age < 20.30) {
    return { phaseName: 'Şişkin (Küçülen)', phaseIcon: '🌖', solunarRating: 'Yüksek' };
  } else if (age < 23.99) {
    return { phaseName: 'Son Dördün', phaseIcon: '🌗', solunarRating: 'Orta' };
  } else {
    return { phaseName: 'Hilal (Küçülen)', phaseIcon: '🌘', solunarRating: 'Orta' };
  }
}

// Basit bellek önbelleği (15 dakika geçerlilik)
const memoryCache: Record<string, { data: LiveConditionsData; timestamp: number }> = {};
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 dakika

/**
 * Samsun - Ordu bölgesi için canlı Open-Meteo verisini çeker.
 */
export async function fetchLiveMarineAndWeather(
  lat: number,
  lng: number,
  regionName: string,
  fallbackBaseline: {
    airTemp: number;
    waterTemp: number;
    windSpeed: number;
    windDirection: string;
    waveHeight: number;
    wavePeriod: number;
    cloudCoverage: number;
    pressure: number;
    rainChance: number;
    bestWindow: string;
  }
): Promise<LiveConditionsData> {
  const cacheKey = `open_meteo_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const now = Date.now();

  // 1. Önbellek kontrolü (SessionStorage & Bellek - 15 dakikalık istemci çağrı tasarrufu)
  if (memoryCache[cacheKey] && now - memoryCache[cacheKey].timestamp < CACHE_TTL_MS) {
    const cachedItem = memoryCache[cacheKey].data;
    return {
      ...cachedItem,
      sourceStatus: 'ONBELLEK',
      lastUpdatedText: `Uygulama İçi Önbellek (15 dk TTL · Çekilme: ${cachedItem.fetchTime})`
    };
  }

  try {
    const rawSession = sessionStorage.getItem(cacheKey);
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      if (now - parsed.timestamp < CACHE_TTL_MS) {
        memoryCache[cacheKey] = parsed;
        const cachedItem = parsed.data;
        return {
          ...cachedItem,
          sourceStatus: 'ONBELLEK',
          lastUpdatedText: `Uygulama İçi Önbellek (15 dk TTL · Çekilme: ${cachedItem.fetchTime})`
        };
      }
    }
  } catch (e) {
    // sessionStorage erişim hatası (gizli mod veya kısıtlı ortam)
  }

  // 2. Open-Meteo Weather & Marine API İstekleri
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&timezone=auto&forecast_days=2`;
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=wave_height,wave_direction,wave_period&hourly=wave_height,wave_period&timezone=auto&forecast_days=2`;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Ağ zaman aşımı (6000ms)')), 6000)
  );

  try {
    const [weatherRes, marineRes] = await Promise.allSettled([
      Promise.race([fetch(weatherUrl), timeoutPromise]) as Promise<Response>,
      Promise.race([fetch(marineUrl), timeoutPromise]) as Promise<Response>
    ]);

    let weatherData: any = null;
    let marineData: any = null;

    if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
      weatherData = await weatherRes.value.json();
    }

    if (marineRes.status === 'fulfilled' && marineRes.value.ok) {
      marineData = await marineRes.value.json();
    }

    // Eğer hava durumu verisi başarıyla alındıysa model çıktısını işle
    if (weatherData && weatherData.current) {
      const c = weatherData.current;
      const airTemp = Math.round(c.temperature_2m * 10) / 10;
      const rainChance = Math.min(100, Math.max(0, Math.round(c.precipitation > 0 ? Math.max(60, c.precipitation * 30) : 0)));
      const precipitationMm = Math.round((c.precipitation || 0) * 10) / 10;
      const cloudCoverage = Math.round(c.cloud_cover || 0);
      const pressure = Math.round(c.pressure_msl ?? c.surface_pressure ?? fallbackBaseline.pressure);
      const windSpeed = Math.round(c.wind_speed_10m || fallbackBaseline.windSpeed);
      const windDirectionDeg = c.wind_direction_10m || 0;
      const windDirection = degreeToTurkishDirection(windDirectionDeg);

      // Dalga verisi: Open-Meteo Marine API açık deniz sayısal modelidir; kıyıda doğrudan ölçülmüş şamandıra verisi değildir
      let waveHeight = fallbackBaseline.waveHeight;
      let wavePeriod = fallbackBaseline.wavePeriod;
      let waveDirection = windDirection;
      let waveSource: 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' | 'Kıyı Rüzgâr Modeli' | 'Referans Model' = 'Referans Model';

      if (marineData && marineData.current && typeof marineData.current.wave_height === 'number') {
        waveHeight = Math.round(marineData.current.wave_height * 10) / 10;
        wavePeriod = Math.round(marineData.current.wave_period || 4);
        if (typeof marineData.current.wave_direction === 'number') {
          waveDirection = degreeToTurkishDirection(marineData.current.wave_direction);
        }
        waveSource = 'Açık Deniz Dalga Modeli (Open-Meteo Marine)';
      } else {
        // Kıyı rüzgârından dalga tahmini (yerel rüzgâr kabarması yaklaşımı)
        const estimatedHeight = Math.max(0.1, Math.min(2.8, Math.round((windSpeed * 0.035) * 10) / 10));
        waveHeight = estimatedHeight;
        wavePeriod = Math.max(3, Math.min(8, Math.round(3 + (windSpeed * 0.1))));
        waveSource = 'Kıyı Rüzgâr Modeli';
      }

      // Deniz suyu yüzey sıcaklığı: Canlı kıyı sensörü bulunmadığı için NASA GIBS / Copernicus referans modeli
      const waterTemp = fallbackBaseline.waterTemp;
      const waterTempNote = 'NASA GIBS & Copernicus L4 Karadeniz model referansıdır (kıyı anlık sensör ölçümü değildir)';

      const currentEstimate = estimateCurrentFromWind(windDirectionDeg, windSpeed);
      const moon = calculateAstronomicalMoonPhase(new Date());

      // Güvenlik durumu tespiti
      let safetyStatus: 'Güvenli' | 'Orta Dalgalı' | 'Riskli - Kıyıdan Kal' = 'Güvenli';
      if (waveHeight >= 1.6 || windSpeed >= 38) {
        safetyStatus = 'Riskli - Kıyıdan Kal';
      } else if (waveHeight >= 0.8 || windSpeed >= 22) {
        safetyStatus = 'Orta Dalgalı';
      }

      // 12 Saatlik Gelecek Av Tahmini (Open-Meteo Hourly verisinden üretilir)
      const hourlyForecast: HourlyForecastItem[] = [];
      if (weatherData.hourly && Array.isArray(weatherData.hourly.time)) {
        const times: string[] = weatherData.hourly.time;
        const nowMs = Date.now();

        // Şimdiki zamana en yakın başlangıç indeksini bul (gece saatlerinde de ertesi güne taşan 12 saati tam sağlar)
        let startIndex = 0;
        let minDiff = Infinity;
        for (let i = 0; i < times.length; i++) {
          const tMs = new Date(times[i]).getTime();
          const diff = Math.abs(tMs - nowMs);
          if (diff < minDiff) {
            minDiff = diff;
            startIndex = i;
          }
        }

        // Başlangıç indeksinden itibaren sonraki 12 saati güvenle seç
        const endIndex = Math.min(times.length, startIndex + 12);
        for (let i = startIndex; i < endIndex; i++) {
          const t = new Date(times[i]);
          const h = t.getHours();
          const hTemp = weatherData.hourly.temperature_2m?.[i];
          const hRainProb = weatherData.hourly.precipitation_probability?.[i] ?? 0;
          const hWind = weatherData.hourly.wind_speed_10m?.[i] ?? 10;
          const hWave = marineData?.hourly?.wave_height?.[i] ?? (hWind * 0.03);

          // Av aktivite puanı formülü (Solunar sabah/akşam suyu zirvesi + stabil rüzgar + düşük yağış)
          let baseScore = 65;
          if ((h >= 5 && h <= 8) || (h >= 17 && h <= 20)) {
            baseScore += 24; // Sabah ve Akşam suyu zirvesi
          } else if (h >= 21 || h <= 3) {
            baseScore += 12; // Gece dip avı
          }

          if (hWind >= 5 && hWind <= 18) baseScore += 6; // İdeal kıyı çırpıntısı
          if (hRainProb < 20) baseScore += 5; // Düşük yağış konforu
          if (hWind > 35 || hWave > 1.8) baseScore -= 30; // Fırtına düşüşü

          const finalScore = Math.min(98, Math.max(40, Math.round(baseScore)));
          let desc = 'Normal aktivite';
          if (finalScore >= 90) desc = '★ Zirve Beslenme Saati';
          else if (finalScore >= 80) desc = 'Yüksek aktivite';
          else if (finalScore >= 70) desc = 'Aktif pencere';
          else if (finalScore < 55) desc = 'Düşük hareket';

          hourlyForecast.push({
            hour: `${h.toString().padStart(2, '0')}:00`,
            score: finalScore,
            desc,
            temp: hTemp,
            rainProb: hRainProb,
            windSpeed: Math.round(hWind),
            waveHeight: Math.round(hWave * 10) / 10
          });
        }
      }

      // API model adımı saati ile uygulamanın veriyi çekme zamanını birbirinden ayır
      let modelTimeFormatted = '--:--';
      if (c.time) {
        const modelDate = new Date(c.time);
        if (!isNaN(modelDate.getTime())) {
          modelTimeFormatted = modelDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        } else if (typeof c.time === 'string' && c.time.includes('T')) {
          modelTimeFormatted = c.time.split('T')[1].substring(0, 5);
        }
      }

      const nowFormatted = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

      const liveResult: LiveConditionsData = {
        airTemp,
        waterTemp,
        waterTempNote,
        rainChance,
        precipitationMm,
        waveHeight,
        wavePeriod,
        waveDirection,
        waveSource,
        windSpeed,
        windDirection,
        windDirectionDeg,
        currentSpeed: currentEstimate.speed,
        currentDirection: currentEstimate.direction,
        cloudCoverage,
        pressure,
        pressureTrend: 'down',
        moonPhase: moon.phaseName,
        moonPhaseIcon: moon.phaseIcon,
        solunarRating: moon.solunarRating,
        safetyStatus,
        bestWindow: fallbackBaseline.bestWindow,
        sourceStatus: 'MODEL_OPEN_METEO',
        modelTime: modelTimeFormatted,
        fetchTime: nowFormatted,
        lastUpdatedText: `Sayısal Model Tahmini (Model: ${modelTimeFormatted} · Çekilme: ${nowFormatted})`,
        hourlyForecast,
        apiNotice: `Veriler Open-Meteo Forecast & Marine sayısal model çıktısıdır (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E). Doğrudan kıyı istasyon ölçümü değildir.`
      };

      // Önbelleğe kaydet (15 dakikalık yerel istemci önbelleği)
      memoryCache[cacheKey] = { data: liveResult, timestamp: now };
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ data: liveResult, timestamp: now }));
      } catch (e) {}

      return liveResult;
    }
  } catch (error) {
    console.warn('Open-Meteo sayısal model isteği başarısız oldu, yerel referans model devrede:', error);
  }

  // 3. Hata veya çevrimdışı durumda YEDEK MODEL döner (Asla canlı veri gibi tanıtılmaz!)
  const moon = calculateAstronomicalMoonPhase(new Date());
  const nowFormatted = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const fallbackResult: LiveConditionsData = {
    airTemp: fallbackBaseline.airTemp,
    waterTemp: fallbackBaseline.waterTemp,
    waterTempNote: 'Yerel referans model değeridir',
    rainChance: fallbackBaseline.rainChance,
    precipitationMm: 0,
    waveHeight: fallbackBaseline.waveHeight,
    wavePeriod: fallbackBaseline.wavePeriod,
    waveDirection: fallbackBaseline.windDirection,
    waveSource: 'Referans Model',
    windSpeed: fallbackBaseline.windSpeed,
    windDirection: fallbackBaseline.windDirection,
    windDirectionDeg: 180,
    currentSpeed: 0.08,
    currentDirection: 'GB',
    cloudCoverage: fallbackBaseline.cloudCoverage,
    pressure: fallbackBaseline.pressure,
    pressureTrend: 'steady',
    moonPhase: moon.phaseName,
    moonPhaseIcon: moon.phaseIcon,
    solunarRating: moon.solunarRating,
    safetyStatus: 'Güvenli',
    bestWindow: fallbackBaseline.bestWindow,
    sourceStatus: 'YEDEK_MODEL',
    modelTime: '--:--',
    fetchTime: nowFormatted,
    lastUpdatedText: 'Çevrimdışı / Yedek Bölgesel Model (API Yanıt Vermedi)',
    hourlyForecast: [
      { hour: '05:00', score: 78, desc: 'Sabah suyu başlangıcı' },
      { hour: '06:00', score: 94, desc: '★ Zirve Beslenme Saati' },
      { hour: '07:00', score: 96, desc: '★ En Yüksek Verim' },
      { hour: '08:00', score: 88, desc: 'Yüksek aktivite' },
      { hour: '12:00', score: 55, desc: 'Öğle durgunluğu' },
      { hour: '17:00', score: 76, desc: 'İkindi kıyılama' },
      { hour: '18:00', score: 91, desc: '★ Akşam Suyu' },
      { hour: '19:00', score: 93, desc: '★ Zirve Akşam Saati' },
      { hour: '21:00', score: 82, desc: 'Gece avı' }
    ],
    apiNotice: 'Canlı hava/deniz API bağlantısı sağlanamadı. Bölgesel ortalama referans model gösterilmektedir.'
  };

  return fallbackResult;
}
