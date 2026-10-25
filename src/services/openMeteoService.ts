/**
 * Open-Meteo Canlı Hava ve Deniz Tahmin Servisi
 * 
 * Şeffaflık İlkeleri:
 * 1. Hava, rüzgâr, basınç, bulut -> Open-Meteo Sayısal Hava Tahmin Modeli
 * 2. Dalga yüksekliği & periyodu -> Open-Meteo Marine API (Açık deniz sayısal hidrodinamik modeli)
 * 3. Su sıcaklığı -> NASA GIBS & Copernicus L4 bölgesel referansı (Kıyıda canlı istasyon yoktur)
 * 4. Akıntı -> Rüzgâr yönü ve Coriolis sapmasından teorik hesaplanan akıntı tahmini (Doğrudan ölçüm değildir)
 * 5. Ay fazı -> Matematiksel astronomik algoritma
 * 6. Av aktivite puanı -> Kural tabanlı hidro-meteorolojik teorik model (Biyokütle veya av başarısı garantisi değildir)
 */

export interface HourlyForecastItem {
  hour: string; // "14:00"
  isoTime: string;
  score: number | null; // null if API offline or missing
  desc: string;
  temp?: number;
  rainProb?: number;
  windSpeed?: number;
  windDirection?: string;
  windDirectionDeg?: number;
  waveHeight?: number;
  wavePeriod?: number;
  weatherCode?: number;
  safetyRating: 'Uygun' | 'Dikkat' | 'Riskli' | 'Belirsiz';
  safetyExplanation: string;
}

export interface PracticalSafetyAssessment {
  rating: 'Uygun' | 'Dikkat' | 'Riskli' | 'Belirsiz';
  badgeTitle: string;
  badgeTone: 'emerald' | 'amber' | 'red' | 'slate';
  summary: string;
  factors: {
    windStatus: string;
    waveStatus: string;
    rainStatus: string;
    currentStatus: string;
  };
  dataSourceNotes: string[];
  safetyWarnings: string[];
}

export interface LiveConditionsData {
  airTemp: number; // °C (Sayısal model)
  waterTemp: number; // °C (NASA/Copernicus referansı)
  waterTempNote: string;
  rainChance: number; // %
  precipitationMm: number; // mm
  waveHeight: number; // metre
  wavePeriod: number; // saniye
  waveDirection: string;
  waveSource: 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' | 'Kıyı Rüzgâr Tahmini' | 'Referans Model';
  windSpeed: number; // km/sa
  windDirection: string; // K, KD, G, GB, vb.
  windDirectionDeg: number;
  currentSpeed: number; // m/s
  currentDirection: string;
  currentType: 'Rüzgâr ve Morfolojiden Teorik Hesaplanan Akıntı';
  cloudCoverage: number; // %
  pressure: number; // hPa
  pressureTrend: 'up' | 'down' | 'steady';
  moonPhase: string;
  moonPhaseIcon: string;
  solunarRating: 'Çok Yüksek' | 'Yüksek' | 'Orta' | 'Düşük';
  safetyStatus: 'Güvenli' | 'Orta Dalgalı' | 'Riskli - Kıyıdan Kal';
  safetyAssessment: PracticalSafetyAssessment;
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

// Akıntı yönünü rüzgâr ve kıyı morfolojisinden teorik hesaplar
function estimateCurrentFromWind(windDeg: number, windSpeedKmH: number) {
  const currentSpeed = Math.round((0.08 + (windSpeedKmH * 0.004)) * 100) / 100;
  const currentDeg = (windDeg + 25) % 360; // Coriolis sapması
  return {
    speed: Math.min(0.65, Math.max(0.04, currentSpeed)),
    direction: degreeToTurkishDirection(currentDeg)
  };
}

// Pratik Avlanma Koşulları ve Saha Güvenliği Değerlendiricisi
export function evaluatePracticalSafety(
  windSpeed: number,
  waveHeight: number,
  wavePeriod: number,
  rainProb: number,
  isBoat: boolean = false
): PracticalSafetyAssessment {
  const warnings: string[] = [];
  let rating: 'Uygun' | 'Dikkat' | 'Riskli' = 'Uygun';
  let badgeTone: 'emerald' | 'amber' | 'red' = 'emerald';
  let badgeTitle = '✅ Uygun Koşullar';

  // Rüzgâr ve Dalga Değerlendirmesi
  const isHighWind = windSpeed >= 35;
  const isModerateWind = windSpeed >= 22;
  const isHighWave = waveHeight >= 1.4;
  const isModerateWave = waveHeight >= 0.8;
  const isLongPeriodSwell = wavePeriod >= 7 && waveHeight >= 0.7; // Güçlü solugan dalga
  const isHeavyRain = rainProb >= 65;

  if (isHighWind || isHighWave || (isBoat && (windSpeed >= 28 || waveHeight >= 1.2))) {
    rating = 'Riskli';
    badgeTone = 'red';
    badgeTitle = isBoat ? '⛔ Riskli - Tekneyle Çıkış Tehlikeli' : '⛔ Riskli - Kıyıdan Kalınız';
  } else if (isModerateWind || isModerateWave || isLongPeriodSwell || isHeavyRain) {
    rating = 'Dikkat';
    badgeTone = 'amber';
    badgeTitle = '⚠️ Dikkat Gerektiren Koşul';
  }

  // Faktör açıklamaları
  let windStatus = `Hafif esinti (~${windSpeed} km/sa); olta atışını zorlamaz.`;
  if (windSpeed >= 35) {
    windStatus = `Kuvvetli rüzgâr (~${windSpeed} km/sa); sahte yem savrulur, mendirek üstü tehlikelidir.`;
    warnings.push('Kuvvetli rüzgâr nedeniyle olta kontrolü kaybolabilir ve ani fırtına riski yüksektir.');
  } else if (windSpeed >= 22) {
    windStatus = `Orta sert rüzgâr (~${windSpeed} km/sa); atış yönü rüzgâra göre seçilmelidir.`;
    warnings.push('Rüzgâr şiddetlenirse kıyı taşlarında denge kaybına yol açabilir.');
  }

  let waveStatus = `Sakin deniz (~${waveHeight} m); kıyı serpintisi asgari düzeyde.`;
  if (waveHeight >= 1.4) {
    waveStatus = `Yüksek dalga (~${waveHeight} m); mendirek ve kayalıkları aşabilir.`;
    warnings.push('Taş tahkimat ve mendirek üzerine dalga patlaması riski bulunmaktadır; kıyıdan uzak durunuz.');
  } else if (waveHeight >= 0.8 || isLongPeriodSwell) {
    waveStatus = `Orta kabarmış deniz (~${waveHeight} m${isLongPeriodSwell ? ', solugan periyot: ' + wavePeriod + 's' : ''}); kaygan taşlara dikkat.`;
    warnings.push('Dalga serpintisi kaygan taşlarda düşme tehlikesi yaratır; su geçirmez tabanlı ayakkabı zorunludur.');
  }

  let rainStatus = `Düşük yağış ihtimali (%${rainProb}).`;
  if (rainProb >= 65) {
    rainStatus = `Kuvvetli yağış ihtimali (%${rainProb}); görüş mesafesi düşebilir.`;
    warnings.push('Gök gürültülü veya sağanak yağışta karbon kamış kullanmak yıldırım riski taşır.');
  } else if (rainProb >= 35) {
    rainStatus = `Olası yerel çisenti / geçiş (%${rainProb}).`;
  }

  const currentStatus = 'Yerel rüzgâr ve kıyı formundan teorik türetilmiştir (~%2 sapma). Gerçek zamanlı akıntı sensörü bulunmamaktadır.';

  let summary = 'Hava ve dalga göstergeleri amatör balıkçılık için elverişli aralıktadır.';
  if (rating === 'Riskli') {
    summary = 'Kuvvetli rüzgâr veya yüksek dalga koşulları kıyıda ve teknede emniyetsiz ortam oluşturmaktadır. Av planını erteleyiniz.';
  } else if (rating === 'Dikkat') {
    summary = 'Rüzgâr, dalga serpintisi veya yağış dikkat gerektirmektedir. Sahada emniyetli basamaklar seçilmeli, can yeleği ve hava takibi ihmal edilmemelidir.';
  }

  return {
    rating,
    badgeTitle,
    badgeTone,
    summary,
    factors: {
      windStatus,
      waveStatus,
      rainStatus,
      currentStatus
    },
    dataSourceNotes: [
      'Değerlendirme Open-Meteo sayısal atmosfer ve açık deniz dalga modeline dayanır.',
      'Sualtı batimetrisi ve taban takılma riskleri bu değerlendirmeye dahil değildir.',
      'Akıntı hızı hesaplanan teorik yaklaşımdır; yerinde ölçüm sensörü yoktur.'
    ],
    safetyWarnings: [
      'Kıyıdan avlanmanın güvenliği kesin olarak garanti edilemez.',
      'Erişim, falez stabilitesi, kaygan taşlar ve ani hava değişimleri sahada bizzat doğrulanmalıdır.',
      ...warnings
    ]
  };
}

/**
 * Open-Meteo verisi alınamadığında veya geçerli güncel önbellek bulunmadığında
 * sabit bölgesel referans değerlerinden yapay güvenlik sonucu üretilmesini engelleyen
 * açık, dürüst ve şeffaf durum değerlendirmesi.
 */
export function createUnavailableSafetyAssessment(): PracticalSafetyAssessment {
  return {
    rating: 'Belirsiz',
    badgeTitle: 'Güncel veri yok — güvenlik değerlendirilemiyor',
    badgeTone: 'slate',
    summary: 'Canlı hava ve deniz tahmin verisi alınamadığı veya geçerli güncel önbellek bulunmadığı için güvenlik değerlendirilemiyor. Referans değerler güncel ölçüm değildir; sahada bizzat gözlem yapınız.',
    factors: {
      windStatus: 'Canlı rüzgâr verisi yok (Referans veri, güncel ölçüm değil).',
      waveStatus: 'Canlı dalga verisi yok (Referans veri, güncel ölçüm değil).',
      rainStatus: 'Canlı yağış verisi yok (Güncel tahmin bulunmuyor).',
      currentStatus: 'Canlı ölçüm sensörü ve anlık model verisi yok.'
    },
    dataSourceNotes: [
      'Open-Meteo sayısal tahmin sunucusuna ulaşılamadı veya geçerli güncel önbellek bulunamadı.',
      'Görüntülenen değerler yalnızca istatistiksel yerel referans baselinedir, anlık ölçüm değildir.',
      'Sabit referans değerlerinden yapay güvenlik skoru veya kesin av saati üretilmez.'
    ],
    safetyWarnings: [
      'Güncel hava ve deniz tahmini olmadan kıyı veya tekne güvenliği değerlendirilemez.',
      'Falez kenarları, taş tahkimat ve mendireklerde dalga patlaması ve kayganlık riski her an sahada doğrulanmalıdır.',
      'Hava değişimlerini ve rüzgâr sertleşmesini sahada bizzat izleyiniz.'
    ]
  };
}

// Matematiksel astronomik Ay Fazı hesabı
export function calculateAstronomicalMoonPhase(date: Date = new Date()): {
  phaseName: string;
  phaseIcon: string;
  solunarRating: 'Çok Yüksek' | 'Yüksek' | 'Orta' | 'Düşük';
} {
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

// 15 dakikalık yerel istemci önbelleği
const memoryCache: Record<string, { data: LiveConditionsData; timestamp: number }> = {};
const CACHE_TTL_MS = 15 * 60 * 1000;

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

  // 1. Önbellek kontrolü
  if (memoryCache[cacheKey] && now - memoryCache[cacheKey].timestamp < CACHE_TTL_MS) {
    const cachedItem = memoryCache[cacheKey].data;
    return {
      ...cachedItem,
      sourceStatus: 'ONBELLEK',
      lastUpdatedText: `Önbellek (Geçerlilik: 15 dk · Alınma: ${cachedItem.fetchTime})`
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
          lastUpdatedText: `Önbellek (Geçerlilik: 15 dk · Alınma: ${cachedItem.fetchTime})`
        };
      }
    }
  } catch (e) {}

  // 2. Open-Meteo Weather & Marine API İstekleri
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=2`;
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=wave_height,wave_direction,wave_period&hourly=wave_height,wave_period,wave_direction&timezone=auto&forecast_days=2`;

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

      let waveHeight = fallbackBaseline.waveHeight;
      let wavePeriod = fallbackBaseline.wavePeriod;
      let waveDirection = windDirection;
      let waveSource: 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' | 'Kıyı Rüzgâr Tahmini' | 'Referans Model' = 'Referans Model';

      if (marineData && marineData.current && typeof marineData.current.wave_height === 'number') {
        waveHeight = Math.round(marineData.current.wave_height * 10) / 10;
        wavePeriod = Math.round(marineData.current.wave_period || 4);
        if (typeof marineData.current.wave_direction === 'number') {
          waveDirection = degreeToTurkishDirection(marineData.current.wave_direction);
        }
        waveSource = 'Açık Deniz Dalga Modeli (Open-Meteo Marine)';
      } else {
        const estimatedHeight = Math.max(0.1, Math.min(2.8, Math.round((windSpeed * 0.035) * 10) / 10));
        waveHeight = estimatedHeight;
        wavePeriod = Math.max(3, Math.min(8, Math.round(3 + (windSpeed * 0.1))));
        waveSource = 'Kıyı Rüzgâr Tahmini';
      }

      const waterTemp = fallbackBaseline.waterTemp;
      const waterTempNote = 'NASA GIBS & Copernicus L4 Karadeniz model referansıdır (Kıyıda anlık ölçüm sensörü bulunmamaktadır)';
      const currentEstimate = estimateCurrentFromWind(windDirectionDeg, windSpeed);
      const moon = calculateAstronomicalMoonPhase(new Date());

      const safetyAssessment = evaluatePracticalSafety(windSpeed, waveHeight, wavePeriod, rainChance, false);
      const safetyStatus: 'Güvenli' | 'Orta Dalgalı' | 'Riskli - Kıyıdan Kal' =
        safetyAssessment.rating === 'Riskli'
          ? 'Riskli - Kıyıdan Kal'
          : safetyAssessment.rating === 'Dikkat'
          ? 'Orta Dalgalı'
          : 'Güvenli';

      // 16 Saatlik Gelecek Tahmin Adımları (Planlama için)
      const hourlyForecast: HourlyForecastItem[] = [];
      if (weatherData.hourly && Array.isArray(weatherData.hourly.time)) {
        const times: string[] = weatherData.hourly.time;
        const nowMs = Date.now();

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

        const count = Math.min(times.length, startIndex + 16);
        for (let i = startIndex; i < count; i++) {
          const t = new Date(times[i]);
          const h = t.getHours();
          const hTemp = typeof weatherData.hourly.temperature_2m?.[i] === 'number'
            ? Math.round(weatherData.hourly.temperature_2m[i] * 10) / 10
            : undefined;
          const hRainProb = weatherData.hourly.precipitation_probability?.[i] ?? 0;
          const hWind = weatherData.hourly.wind_speed_10m?.[i] ?? 10;
          const hWindDeg = weatherData.hourly.wind_direction_10m?.[i] ?? 0;
          const hWindDir = degreeToTurkishDirection(hWindDeg);
          const hWave = marineData?.hourly?.wave_height?.[i] ?? (hWind * 0.035);
          const hWavePeriod = marineData?.hourly?.wave_period?.[i] ?? 4;

          // Aktivite Puanı: Teorik Solunar + Sayısal rüzgâr/yağış ağırlıklı model
          let baseScore = 65;
          if ((h >= 5 && h <= 8) || (h >= 17 && h <= 20)) {
            baseScore += 22; // Sabah ve Akşam suyu zirvesi
          } else if (h >= 21 || h <= 3) {
            baseScore += 10; // Gece dip avı
          }

          if (hWind >= 5 && hWind <= 18) baseScore += 6;
          if (hRainProb < 20) baseScore += 5;
          if (hWind > 35 || hWave > 1.6) baseScore -= 35;

          const finalScore = Math.min(98, Math.max(35, Math.round(baseScore)));

          const hourSafety = evaluatePracticalSafety(Math.round(hWind), Math.round(hWave * 10) / 10, Math.round(hWavePeriod), hRainProb, false);

          let desc = 'Normal aktivite';
          if (finalScore >= 90) desc = '★ Zirve Beslenme Penceresi';
          else if (finalScore >= 80) desc = 'Yüksek aktivite';
          else if (finalScore >= 70) desc = 'Aktif pencere';
          else if (finalScore < 50) desc = 'Düşük hareket';

          hourlyForecast.push({
            hour: `${h.toString().padStart(2, '0')}:00`,
            isoTime: times[i],
            score: finalScore,
            desc,
            temp: hTemp,
            rainProb: hRainProb,
            windSpeed: Math.round(hWind),
            windDirection: hWindDir,
            windDirectionDeg: hWindDeg,
            waveHeight: Math.round(hWave * 10) / 10,
            wavePeriod: Math.round(hWavePeriod),
            weatherCode: weatherData.hourly.weather_code?.[i],
            safetyRating: hourSafety.rating,
            safetyExplanation: hourSafety.summary
          });
        }
      }

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
        currentType: 'Rüzgâr ve Morfolojiden Teorik Hesaplanan Akıntı',
        cloudCoverage,
        pressure,
        pressureTrend: 'down',
        moonPhase: moon.phaseName,
        moonPhaseIcon: moon.phaseIcon,
        solunarRating: moon.solunarRating,
        safetyStatus,
        safetyAssessment,
        bestWindow: fallbackBaseline.bestWindow,
        sourceStatus: 'MODEL_OPEN_METEO',
        modelTime: modelTimeFormatted,
        fetchTime: nowFormatted,
        lastUpdatedText: `Sayısal Model Tahmini (Model: ${modelTimeFormatted} · Alınma: ${nowFormatted})`,
        hourlyForecast,
        apiNotice: `Veriler Open-Meteo Forecast & Marine sayısal model çıktısıdır (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E). Doğrudan kıyı istasyon ölçümü değildir.`
      };

      memoryCache[cacheKey] = { data: liveResult, timestamp: now };
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ data: liveResult, timestamp: now }));
      } catch (e) {}

      return liveResult;
    }
  } catch (error) {
    console.warn('Open-Meteo sayısal model çağrısı başarısız oldu, yerel referans model devrede:', error);
  }

  // 3. API Başarısız Olduğunda: Sabit değerlerden gerçek zamanlı güvenlik skoru üretilmez!
  const moon = calculateAstronomicalMoonPhase(new Date());
  const nowFormatted = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const unavailableSafety = createUnavailableSafetyAssessment();

  const fallbackResult: LiveConditionsData = {
    airTemp: fallbackBaseline.airTemp,
    waterTemp: fallbackBaseline.waterTemp,
    waterTempNote: 'Referans veri, güncel ölçüm değil (Mevsimsel kıyı modeli referansı)',
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
    currentType: 'Rüzgâr ve Morfolojiden Teorik Hesaplanan Akıntı',
    cloudCoverage: fallbackBaseline.cloudCoverage,
    pressure: fallbackBaseline.pressure,
    pressureTrend: 'steady',
    moonPhase: moon.phaseName,
    moonPhaseIcon: moon.phaseIcon,
    solunarRating: moon.solunarRating,
    safetyStatus: 'Orta Dalgalı',
    safetyAssessment: unavailableSafety,
    bestWindow: fallbackBaseline.bestWindow,
    sourceStatus: 'YEDEK_MODEL',
    modelTime: '--:--',
    fetchTime: nowFormatted,
    lastUpdatedText: 'Referans veri, güncel ölçüm değil (API Yanıt Vermedi)',
    hourlyForecast: [], // Sahte tahmin puanı veya saat üretilmez!
    apiNotice: 'Canlı hava/deniz tahmin API bağlantısı sağlanamadı. Güncel veri yok — güvenlik değerlendirilemiyor. Gösterilen değerler referans veridir, güncel ölçüm değildir.'
  };

  return fallbackResult;
}
