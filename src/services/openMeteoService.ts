/**
 * Open-Meteo Canlı Hava ve Deniz Tahmin Servisi
 * 
 * Şeffaflık İlkeleri:
 * 1. Hava sıcaklığı, rüzgâr (hız, hamle, yön), basınç (MSL), bulut, yağış -> Open-Meteo Sayısal Hava Tahmin Modeli (NWP)
 * 2. Dalga (yükseklik, periyot, rüzgâr dalgası, swell) -> Open-Meteo Marine API (Açık deniz sayısal hidrodinamik modeli)
 * 3. Su sıcaklığı -> Open-Meteo Marine API (Sayısal deniz modeli tahmini; kıyıda anlık ölçüm sensörü yoktur)
 * 4. Akıntı -> Open-Meteo Marine API (ocean_current_velocity & direction) sayısal modeli
 * 5. Ay fazı -> Matematiksel astronomik algoritma
 * 6. Av aktivite puanı -> Kural tabanlı hidro-meteorolojik teorik model (Biyokütle veya av başarısı garantisi değildir; bir güvenlik değerlendirmesi değildir)
 */

export type SafetyStatusType = 'Güvenli' | 'Orta Dalgalı' | 'Riskli - Kıyıdan Kal' | 'Belirsiz — veri eksik';

export interface HourlyForecastItem {
  hour: string; // "14:00"
  isoTime: string; // "2026-10-28T14:00"
  forecastTime: string; // "2026-10-28 14:00" (Doğrudan hourly.time dizisinden)
  weatherTime: string; // "2026-10-28 14:00" (Hava modeli saatlik zamanı)
  marineTime: string | null; // Eşleşen deniz modeli saatlik zamanı (varsa "2026-10-28 14:00", yoksa null)
  score: number | null; // Aktivite göstergesidir; güvenlik değerlendirmesi veya yakalama garantisi değildir!
  desc: string;
  temp?: number;
  rainProb?: number;
  precipitationMm?: number;
  windSpeed?: number;
  windGusts?: number;
  windDirection?: string;
  windDirectionDeg?: number;
  waveHeight?: number | null;
  wavePeriod?: number | null;
  windWaveHeight?: number | null;
  swellWaveHeight?: number | null;
  hasMarineWaveData?: boolean;
  waveSource?: 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' | 'Marine Dalga Verisi Yok' | 'Referans Model';
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
  airTemp: number; // °C (Sayısal model 2m)
  waterTemp: number | null; // °C (Open-Meteo Marine / Copernicus L4 referansı, veri yoksa null)
  waterTempNote: string;
  rainChance: number; // % (Sayısal model saatlik yağış ihtimali)
  precipitationMm: number; // mm (Sayısal model yağış miktarı)
  waveHeight: number | null; // metre (Toplam belirgin dalga boyu Hm0, veri yoksa null)
  wavePeriod: number | null; // saniye (Ortalama dalga periyodu, veri yoksa null)
  windWaveHeight: number | null; // metre (Rüzgâr dalgası)
  swellWaveHeight: number | null; // metre (Solugan / kabarma dalgası)
  waveDirection: string;
  waveDirectionDeg: number;
  waveSource: 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' | 'Marine Dalga Verisi Yok' | 'Referans Model';
  hasValidMarineData: boolean;
  marineGridCoord?: { lat: number; lng: number };
  weatherGridCoord?: { lat: number; lng: number };
  windSpeed: number; // km/sa (10m rüzgâr hızı)
  windGusts: number | null; // km/sa (10m hamle hızı)
  windDirection: string; // K, KD, G, GB, vb.
  windDirectionDeg: number;
  currentSpeed: number | null; // km/sa (Open-Meteo Marine hidrodinamik model)
  currentSpeedMs: number | null; // m/s
  currentDirection: string | null;
  currentDirectionDeg?: number;
  currentType: 'Open-Meteo Marine (Hidrodinamik Model)' | 'Ölçüm/Model verisi yok' | 'Rüzgâr ve Morfolojiden Teorik Hesaplanan Akıntı';
  cloudCoverage: number; // % (Bulutluluk)
  pressure: number; // hPa (Deniz seviyesine indirgenmiş basınç MSL)
  pressureTrend: 'up' | 'down' | 'steady';
  moonPhase: string;
  moonPhaseIcon: string;
  solunarRating: 'Çok Yüksek' | 'Yüksek' | 'Orta' | 'Düşük';
  safetyStatus: SafetyStatusType;
  safetyAssessment: PracticalSafetyAssessment;
  bestWindow: string;
  sourceStatus: 'MODEL_OPEN_METEO' | 'ONBELLEK' | 'YEDEK_MODEL';

  // Gerçek Zaman Damgaları (Kesin Kaynak Ayrımı):
  weatherModelTime: string | null; // Weather API current.time (örn: "2026-10-28 20:45")
  marineModelTime: string | null; // Marine API current.time (örn: "2026-10-28 20:00")
  matchedForecastTime: string | null; // Weather API hourly.time[currentHourIndex] (örn: "2026-10-28 21:00")
  matchedMarineForecastTime: string | null; // Marine API hourly.time[marineHourIndex] (örn: "2026-10-28 21:00")
  timezone: string; // "Europe/Istanbul"

  // Parametre Bazlı Zaman Damgaları:
  airTempTime: string | null; // Weather API current.time
  windTime: string | null; // Weather API current.time
  precipitationTime: string | null; // Weather API current.time
  rainChanceTime: string | null; // Weather API hourly.time[currentHourIndex]
  waveTime: string | null; // Marine API current.time veya hourly.time
  waterTempTime: string | null; // Marine API current.time veya hourly.time
  currentTime: string | null; // Marine API current.time

  modelTime: string; // Geriye dönük uyumluluk etiketi
  fetchTime: string;
  lastUpdatedText: string;
  hourlyForecast: HourlyForecastItem[];
  apiNotice: string;
}

// Rüzgâr ve akıntı yönü derecesini Türkçe pusula yönüne çevirir
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

// Pratik Avlanma Koşulları ve Saha Güvenliği Değerlendiricisi
export function evaluatePracticalSafety(
  windSpeed: number,
  waveHeight: number | null,
  wavePeriod: number | null,
  rainProb: number,
  isBoat: boolean = false,
  hasMarineData: boolean = true
): PracticalSafetyAssessment {
  const warnings: string[] = [];
  let rating: 'Uygun' | 'Dikkat' | 'Riskli' | 'Belirsiz' = 'Uygun';
  let badgeTone: 'emerald' | 'amber' | 'red' | 'slate' = 'emerald';
  let badgeTitle = '✅ Uygun Koşullar';

  // Rüzgâr ve Dalga Değerlendirmesi
  const isHighWind = windSpeed >= 35;
  const isModerateWind = windSpeed >= 22;
  const isHighWave = waveHeight !== null && waveHeight >= 1.4;
  const isModerateWave = waveHeight !== null && waveHeight >= 0.8;
  const isLongPeriodSwell = wavePeriod !== null && waveHeight !== null && wavePeriod >= 7 && waveHeight >= 0.7; // Güçlü solugan dalga
  const isHeavyRain = rainProb >= 65;

  if (isHighWind || isHighWave || (isBoat && (windSpeed >= 28 || (waveHeight !== null && waveHeight >= 1.2)))) {
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

  let waveStatus = hasMarineData && waveHeight !== null
    ? `Açık deniz dalga tahmini (~${waveHeight} m${wavePeriod !== null ? `, periyot: ${wavePeriod}s` : ''}); kıyı kırılmalarına dikkat.`
    : 'Marine API dalga verisi yok (Model kapsamı dışında veya veri eksik).';

  if (hasMarineData && waveHeight !== null) {
    if (waveHeight >= 1.4) {
      waveStatus = `Yüksek dalga (~${waveHeight} m); mendirek ve kayalıkları aşabilir.`;
      warnings.push('Taş tahkimat ve mendirek üzerine dalga patlaması riski bulunmaktadır; kıyıdan uzak durunuz.');
    } else if (waveHeight >= 0.8 || isLongPeriodSwell) {
      waveStatus = `Orta kabarmış deniz (~${waveHeight} m${isLongPeriodSwell && wavePeriod !== null ? ', solugan periyot: ' + wavePeriod + 's' : ''}); kaygan taşlara dikkat.`;
      warnings.push('Dalga serpintisi kaygan taşlarda düşme tehlikesi yaratır; su geçirmez tabanlı ayakkabı zorunludur.');
    }
  } else {
    warnings.push('Marine API dalga ve deniz verisi eksiktir. Kıyı çalkantısı ve açık deniz dalgası sahada kontrol edilmelidir.');
  }

  let rainStatus = `Düşük yağış ihtimali (%${rainProb}).`;
  if (rainProb >= 65) {
    rainStatus = `Kuvvetli yağış ihtimali (%${rainProb}); görüş mesafesi düşebilir.`;
    warnings.push('Gök gürültülü veya sağanak yağışta karbon kamış kullanmak yıldırım riski taşır.');
  } else if (rainProb >= 35) {
    rainStatus = `Olası yerel çisenti / geçiş (%${rainProb}).`;
  }

  const currentStatus = hasMarineData 
    ? 'Open-Meteo Marine hidrodinamik akıntı modeline dayanır. Doğrudan yerinde akıntıölçer sensörü bulunmamaktadır.'
    : 'Akıntı verisi bulunmuyor; yerel gözlem yapılmalıdır.';

  let summary = 'Hava ve dalga göstergeleri amatör balıkçılık için elverişli aralıktadır.';
  if (rating === 'Riskli') {
    summary = 'Kuvvetli rüzgâr veya yüksek dalga koşulları kıyıda ve teknede emniyetsiz ortam oluşturmaktadır. Av planını erteleyiniz.';
  } else if (rating === 'Dikkat') {
    summary = 'Rüzgâr, dalga serpintisi veya yağış dikkat gerektirmektedir. Sahada emniyetli basamaklar seçilmeli, can yeleği ve hava takibi ihmal edilmemelidir.';
  }

  // Deniz verisi eksik olduğunda güvenlik değerlendirmesi:
  if (!hasMarineData) {
    rating = 'Belirsiz';
    badgeTone = 'amber';
    badgeTitle = 'Eksik veri — güvenlik tam değerlendirilemiyor';
    summary = 'Hava tahmini mevcut ancak Marine API dalga/deniz verisi eksiktir. Rüzgârdan türetilen yaklaşık dalga tahminiyle kesin Güvenli/Uygun sonucu verilemez; güvenlik tam değerlendirilemiyor. Sahada deniz ve kıyı koşullarını bizzat gözlemleyiniz.';
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
      hasMarineData
        ? 'Değerlendirme Open-Meteo sayısal atmosfer ve açık deniz hidrodinamik dalga modeline dayanır.'
        : 'Atmosfer verisi Open-Meteo modelinden alınmıştır; Marine API dalga verisi eksiktir.',
      hasMarineData
        ? 'Açık deniz dalga modeli kıyı kırılmalarını, sığlaşmayı ve lokal mendirek sekmesini tam kapsamaz.'
        : 'Dalga boyu rüzgârdan türetilmiş tahmindir; gerçek dalga ölçümü değildir.',
      'Yerinde fiziksel sensör ölçümü olmayıp sayısal tahmin modellerine dayanmaktadır.'
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
  // Weather API: Hava sıcaklığı, bağıl nem, yağış (mm), yağış ihtimali, basınç (msl), rüzgâr (hız, hamle, yön), bulutluluk
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&timezone=auto&forecast_days=2&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m`;
  
  // Marine API: cell_selection=sea ile deniz hücresini seçer. Dalga yüksekliği, periyot, rüzgâr dalgası, swell, akıntı ve deniz suyu sıcaklığı (SST)
  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&cell_selection=sea&timezone=auto&forecast_days=2&current=sea_surface_temperature,wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height,ocean_current_velocity,ocean_current_direction&hourly=sea_surface_temperature,wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height,ocean_current_velocity,ocean_current_direction`;

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
      const precipitationMm = typeof c.precipitation === 'number' ? Math.round(c.precipitation * 10) / 10 : 0;
      const cloudCoverage = Math.round(c.cloud_cover || 0);
      const pressure = Math.round(c.pressure_msl ?? c.surface_pressure ?? fallbackBaseline.pressure);
      const windSpeed = Math.round(c.wind_speed_10m ?? fallbackBaseline.windSpeed);
      const windGusts = typeof c.wind_gusts_10m === 'number' ? Math.round(c.wind_gusts_10m) : null;
      const windDirectionDeg = c.wind_direction_10m || 0;
      const windDirection = degreeToTurkishDirection(windDirectionDeg);

      // 1. Weather API Gerçek Zaman Damgası (current.time)
      const rawWeatherCurrentTime: string | undefined = typeof c.time === 'string' && c.time ? c.time : undefined;
      const weatherModelTime = rawWeatherCurrentTime ? rawWeatherCurrentTime.replace('T', ' ') : null;
      const timezone: string = weatherData?.timezone || 'Europe/Istanbul';

      // 2. Marine API Gerçek Zaman Damgası (current.time)
      const rawMarineCurrentTime: string | undefined = typeof marineData?.current?.time === 'string' && marineData.current.time ? marineData.current.time : undefined;
      const marineModelTime = rawMarineCurrentTime ? rawMarineCurrentTime.replace('T', ' ') : null;

      // 3. Saatlik Tahmin Zamanı Eşleştirmesi (Weather API hourly.time)
      // current.time (örn: 20:45) ile hourly.time (örn: 21:00) arasındaki en yakın saat adımı bulunur
      // ve seçilen saatlik verinin zamanı DOĞRUDAN diziden alınır.
      let currentHourIndex = -1;
      let matchedForecastTime: string | null = null;

      if (rawWeatherCurrentTime && weatherData?.hourly && Array.isArray(weatherData.hourly.time)) {
        const times: string[] = weatherData.hourly.time;
        const currentMs = new Date(rawWeatherCurrentTime).getTime();

        if (!isNaN(currentMs)) {
          let minDiff = Infinity;
          times.forEach((t: string, idx: number) => {
            const hMs = new Date(t).getTime();
            const diff = Math.abs(hMs - currentMs);
            if (diff < minDiff) {
              minDiff = diff;
              currentHourIndex = idx;
            }
          });

          if (currentHourIndex >= 0 && typeof times[currentHourIndex] === 'string') {
            matchedForecastTime = times[currentHourIndex].replace('T', ' ');
          }
        }
      }

      // 4. Marine API saatlik zaman eşleştirmesi
      let marineHourIndex = -1;
      let matchedMarineForecastTime: string | null = null;
      if (currentHourIndex >= 0 && weatherData?.hourly?.time?.[currentHourIndex] && marineData?.hourly?.time && Array.isArray(marineData.hourly.time)) {
        const targetIso = weatherData.hourly.time[currentHourIndex];
        marineHourIndex = marineData.hourly.time.indexOf(targetIso);
        if (marineHourIndex >= 0) {
          matchedMarineForecastTime = marineData.hourly.time[marineHourIndex].replace('T', ' ');
        }
      }

      // Yağış olasılığı (hourly.precipitation_probability[currentHourIndex])
      const rainChance = currentHourIndex >= 0 && typeof weatherData.hourly?.precipitation_probability?.[currentHourIndex] === 'number'
        ? weatherData.hourly.precipitation_probability[currentHourIndex]
        : (precipitationMm > 0 ? 80 : 0);
      const rainChanceTime = matchedForecastTime;

      // Open-Meteo Marine Verisi Çözümlemesi
      const hasValidMarineData = Boolean(
        marineData && 
        marineData.current && 
        typeof marineData.current.wave_height === 'number'
      );

      let waveHeight: number | null = null;
      let wavePeriod: number | null = null;
      let windWaveHeight: number | null = null;
      let swellWaveHeight: number | null = null;
      let waveDirection = windDirection;
      let waveDirectionDeg = windDirectionDeg;
      let waveSource: 'Açık Deniz Dalga Modeli (Open-Meteo Marine)' | 'Marine Dalga Verisi Yok' | 'Referans Model';
      let waveTime: string | null = null;

      if (hasValidMarineData) {
        waveHeight = Math.round(marineData.current.wave_height * 10) / 10;
        wavePeriod = typeof marineData.current.wave_period === 'number'
          ? Math.round(marineData.current.wave_period * 10) / 10
          : null;
        windWaveHeight = typeof marineData.current.wind_wave_height === 'number'
          ? Math.round(marineData.current.wind_wave_height * 10) / 10
          : null;
        swellWaveHeight = typeof marineData.current.swell_wave_height === 'number'
          ? Math.round(marineData.current.swell_wave_height * 10) / 10
          : null;
        if (typeof marineData.current.wave_direction === 'number') {
          waveDirectionDeg = marineData.current.wave_direction;
          waveDirection = degreeToTurkishDirection(waveDirectionDeg);
        }
        waveSource = 'Açık Deniz Dalga Modeli (Open-Meteo Marine)';
        waveTime = marineModelTime;
      } else {
        waveHeight = null;
        wavePeriod = null;
        waveSource = 'Marine Dalga Verisi Yok';
        waveTime = null;
      }

      // Deniz Suyu Sıcaklığı (SST) - Open-Meteo Marine Sayısal Model Tahmini
      let waterTemp: number | null = null;
      let waterTempNote = 'Zaman bilgisi bulunamadı / Kıyı SST sensörü bulunmuyor';
      let waterTempTime: string | null = null;

      if (marineData?.current && typeof marineData.current.sea_surface_temperature === 'number') {
        waterTemp = Math.round(marineData.current.sea_surface_temperature * 10) / 10;
        waterTempTime = marineModelTime;
        waterTempNote = `Open-Meteo Marine Sayısal Model (Model Zamanı: ${marineModelTime || 'Zaman bilgisi bulunamadı'} · ${timezone})`;
      } else if (marineHourIndex >= 0 && typeof marineData?.hourly?.sea_surface_temperature?.[marineHourIndex] === 'number') {
        waterTemp = Math.round(marineData.hourly.sea_surface_temperature[marineHourIndex] * 10) / 10;
        waterTempTime = matchedMarineForecastTime;
        waterTempNote = `Open-Meteo Marine Saatlik Tahmin (Tahmin Zamanı: ${matchedMarineForecastTime || 'Zaman bilgisi bulunamadı'} · ${timezone})`;
      }

      // Akıntı (Ocean Current) - Gerçek Open-Meteo Marine hidrodinamik modelinden
      let currentSpeed: number | null = null;
      let currentSpeedMs: number | null = null;
      let currentDirection: string | null = null;
      let currentDirectionDeg: number | undefined = undefined;
      let currentType: 'Open-Meteo Marine (Hidrodinamik Model)' | 'Ölçüm/Model verisi yok' | 'Rüzgâr ve Morfolojiden Teorik Hesaplanan Akıntı' = 'Ölçüm/Model verisi yok';
      let currentTime: string | null = null;

      if (marineData?.current && typeof marineData.current.ocean_current_velocity === 'number') {
        const speedKmH = Math.round(marineData.current.ocean_current_velocity * 10) / 10;
        currentSpeed = speedKmH;
        currentSpeedMs = Math.round((speedKmH / 3.6) * 100) / 100;
        if (typeof marineData.current.ocean_current_direction === 'number') {
          currentDirectionDeg = marineData.current.ocean_current_direction;
          currentDirection = degreeToTurkishDirection(marineData.current.ocean_current_direction);
        }
        currentType = 'Open-Meteo Marine (Hidrodinamik Model)';
        currentTime = marineModelTime;
      }

      const moon = calculateAstronomicalMoonPhase(new Date());

      const safetyAssessment = evaluatePracticalSafety(windSpeed, waveHeight, wavePeriod, rainChance, false, hasValidMarineData);
      const safetyStatus: SafetyStatusType =
        safetyAssessment.rating === 'Riskli'
          ? 'Riskli - Kıyıdan Kal'
          : safetyAssessment.rating === 'Dikkat'
          ? 'Orta Dalgalı'
          : safetyAssessment.rating === 'Belirsiz'
          ? 'Belirsiz — veri eksik'
          : 'Güvenli';

      // 16 Saatlik Gelecek Tahmin Adımları (Planlama için)
      const hourlyForecast: HourlyForecastItem[] = [];
      if (weatherData.hourly && Array.isArray(weatherData.hourly.time)) {
        const times: string[] = weatherData.hourly.time;
        const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
        const count = Math.min(times.length, startIndex + 16);

        for (let i = startIndex; i < count; i++) {
          const tIso = times[i];
          const hourLabel = tIso.includes('T') ? tIso.split('T')[1].substring(0, 5) : tIso.substring(11, 16);
          const hourInt = parseInt(hourLabel.split(':')[0], 10) || 0;

          const hTemp = typeof weatherData.hourly.temperature_2m?.[i] === 'number'
            ? Math.round(weatherData.hourly.temperature_2m[i] * 10) / 10
            : undefined;
          const hRainProb = weatherData.hourly.precipitation_probability?.[i] ?? 0;
          const hPrecipitationMm = typeof weatherData.hourly.precipitation?.[i] === 'number'
            ? Math.round(weatherData.hourly.precipitation[i] * 10) / 10
            : 0;
          const hWind = weatherData.hourly.wind_speed_10m?.[i] ?? 10;
          const hWindGust = weatherData.hourly.wind_gusts_10m?.[i] ? Math.round(weatherData.hourly.wind_gusts_10m[i]) : undefined;
          const hWindDeg = weatherData.hourly.wind_direction_10m?.[i] ?? 0;
          const hWindDir = degreeToTurkishDirection(hWindDeg);

          // Marine saatlik zamanını index yerine ISO string ile birebir eşleştir
          let mIdx = -1;
          let marineItemTime: string | null = null;
          if (marineData?.hourly?.time && Array.isArray(marineData.hourly.time)) {
            mIdx = marineData.hourly.time.indexOf(tIso);
            if (mIdx >= 0) {
              marineItemTime = marineData.hourly.time[mIdx].replace('T', ' ');
            }
          }

          const hasHourlyMarine = mIdx >= 0 && typeof marineData?.hourly?.wave_height?.[mIdx] === 'number';
          const hWave = hasHourlyMarine ? Math.round(marineData.hourly.wave_height[mIdx] * 10) / 10 : null;
          const hWavePeriod = mIdx >= 0 && typeof marineData?.hourly?.wave_period?.[mIdx] === 'number' ? Math.round(marineData.hourly.wave_period[mIdx] * 10) / 10 : null;
          const hWindWave = mIdx >= 0 && typeof marineData?.hourly?.wind_wave_height?.[mIdx] === 'number' ? Math.round(marineData.hourly.wind_wave_height[mIdx] * 10) / 10 : null;
          const hSwellWave = mIdx >= 0 && typeof marineData?.hourly?.swell_wave_height?.[mIdx] === 'number' ? Math.round(marineData.hourly.swell_wave_height[mIdx] * 10) / 10 : null;

          // Aktivite Puanı: Teorik Solunar + Sayısal rüzgâr/yağış ağırlıklı balık beslenme tahminidir.
          // DİKKAT: Bu puan bir güvenlik değerlendirmesi değildir; güvenli avlanma garantisi olarak kullanılamaz.
          let baseScore = 65;
          if ((hourInt >= 5 && hourInt <= 8) || (hourInt >= 17 && hourInt <= 20)) {
            baseScore += 22; // Sabah ve Akşam suyu zirvesi
          } else if (hourInt >= 21 || hourInt <= 3) {
            baseScore += 10; // Gece dip avı
          }

          if (hWind >= 5 && hWind <= 18) baseScore += 6;
          if (hRainProb < 20) baseScore += 5;
          if (hWind > 35 || (hWave !== null && hWave > 1.6)) baseScore -= 35;

          const finalScore = Math.min(98, Math.max(35, Math.round(baseScore)));

          // Marine API saatlik dalga verisi eksik olduğunda saatlik güvenlik sonucu kesinlikle 'Belirsiz' kalır
          const hourSafety = evaluatePracticalSafety(
            Math.round(hWind), 
            hWave, 
            hWavePeriod, 
            hRainProb, 
            false,
            hasHourlyMarine
          );

          let desc = 'Normal aktivite (Güvenlikten bağımsızdır)';
          if (finalScore >= 90) desc = '★ Zirve beslenme penceresi (Güvenlik garantisi değildir)';
          else if (finalScore >= 80) desc = 'Yüksek aktivite (Güvenlikten bağımsızdır)';
          else if (finalScore >= 70) desc = 'Aktif pencere (Güvenlik ayrıca kontrol edilmelidir)';
          else if (finalScore < 50) desc = 'Düşük hareket';

          const forecastTimeStr = tIso.replace('T', ' ');

          hourlyForecast.push({
            hour: hourLabel,
            isoTime: times[i],
            forecastTime: forecastTimeStr,
            weatherTime: forecastTimeStr,
            marineTime: marineItemTime,
            score: finalScore,
            desc,
            temp: hTemp,
            rainProb: hRainProb,
            precipitationMm: hPrecipitationMm,
            windSpeed: Math.round(hWind),
            windGusts: hWindGust,
            windDirection: hWindDir,
            windDirectionDeg: hWindDeg,
            waveHeight: hWave,
            wavePeriod: hWavePeriod,
            windWaveHeight: hWindWave,
            swellWaveHeight: hSwellWave,
            hasMarineWaveData: hasHourlyMarine,
            waveSource: hasHourlyMarine
              ? 'Açık Deniz Dalga Modeli (Open-Meteo Marine)'
              : 'Marine Dalga Verisi Yok',
            weatherCode: weatherData.hourly.weather_code?.[i],
            safetyRating: hourSafety.rating,
            safetyExplanation: hourSafety.summary
          });
        }
      }

      // İki zaman damgasını asla tek bir zamanmış gibi birleştirmeyiz:
      // weatherModelTime: API current.time (örn. "2026-10-28 20:45")
      // matchedForecastTime: API hourly.time[currentHourIndex] (örn. "2026-10-28 21:00")
      const wTimeDisp = weatherModelTime || 'Zaman bilgisi bulunamadı';
      const fTimeDisp = matchedForecastTime || 'Zaman bilgisi bulunamadı';

      let lastUpdatedText = `Model Referans Zamanı: ${wTimeDisp} · Tahmin Zamanı: ${fTimeDisp} (${timezone})`;
      if (marineModelTime && marineModelTime !== weatherModelTime) {
        lastUpdatedText += ` · Deniz Modeli: ${marineModelTime}`;
      }

      const liveResult: LiveConditionsData = {
        airTemp,
        waterTemp,
        waterTempNote,
        rainChance,
        precipitationMm,
        waveHeight,
        wavePeriod,
        windWaveHeight,
        swellWaveHeight,
        waveDirection,
        waveDirectionDeg,
        waveSource,
        hasValidMarineData,
        marineGridCoord: marineData?.latitude && marineData?.longitude ? { lat: marineData.latitude, lng: marineData.longitude } : undefined,
        weatherGridCoord: weatherData?.latitude && weatherData?.longitude ? { lat: weatherData.latitude, lng: weatherData.longitude } : undefined,
        windSpeed,
        windGusts,
        windDirection,
        windDirectionDeg,
        currentSpeed,
        currentSpeedMs,
        currentDirection,
        currentDirectionDeg,
        currentType,
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

        weatherModelTime,
        marineModelTime,
        matchedForecastTime,
        matchedMarineForecastTime,
        timezone,

        airTempTime: weatherModelTime,
        windTime: weatherModelTime,
        precipitationTime: weatherModelTime,
        rainChanceTime,
        waveTime,
        waterTempTime,
        currentTime,

        modelTime: wTimeDisp,
        fetchTime: wTimeDisp,
        lastUpdatedText,
        hourlyForecast,
        apiNotice: hasValidMarineData
          ? `Veriler Open-Meteo Forecast & Marine sayısal model çıktısıdır (İstek: ${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E · Deniz Grid: ${marineData?.latitude?.toFixed(3)}°N, ${marineData?.longitude?.toFixed(3)}°E). Açık deniz sayısal hidrodinamik modelidir; kıyı dalga ölçüm şamandırası değildir.`
          : `Atmosfer verileri Open-Meteo modelinden alınmıştır. Marine API dalga verisi eksiktir; dalga boyu tahmini yapılamamaktadır.`
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

  // 3. API Başarısız Olduğunda: Sabit değerlerden gerçek zamanlı güvenlik skoru ve uydurma zaman üretilmez!
  const moon = calculateAstronomicalMoonPhase(new Date());
  const unavailableSafety = createUnavailableSafetyAssessment();

  const fallbackResult: LiveConditionsData = {
    airTemp: fallbackBaseline.airTemp,
    waterTemp: null,
    waterTempNote: 'Zaman bilgisi bulunamadı (API Yanıt Vermedi)',
    rainChance: fallbackBaseline.rainChance,
    precipitationMm: 0,
    waveHeight: fallbackBaseline.waveHeight,
    wavePeriod: fallbackBaseline.wavePeriod,
    windWaveHeight: null,
    swellWaveHeight: null,
    waveDirection: fallbackBaseline.windDirection,
    waveDirectionDeg: 180,
    waveSource: 'Referans Model',
    hasValidMarineData: false,
    windSpeed: fallbackBaseline.windSpeed,
    windGusts: null,
    windDirection: fallbackBaseline.windDirection,
    windDirectionDeg: 180,
    currentSpeed: null,
    currentSpeedMs: null,
    currentDirection: null,
    currentType: 'Ölçüm/Model verisi yok',
    cloudCoverage: fallbackBaseline.cloudCoverage,
    pressure: fallbackBaseline.pressure,
    pressureTrend: 'steady',
    moonPhase: moon.phaseName,
    moonPhaseIcon: moon.phaseIcon,
    solunarRating: moon.solunarRating,
    safetyStatus: 'Belirsiz — veri eksik',
    safetyAssessment: unavailableSafety,
    bestWindow: fallbackBaseline.bestWindow,
    sourceStatus: 'YEDEK_MODEL',

    weatherModelTime: null,
    marineModelTime: null,
    matchedForecastTime: null,
    matchedMarineForecastTime: null,
    timezone: 'Europe/Istanbul',

    airTempTime: null,
    windTime: null,
    precipitationTime: null,
    rainChanceTime: null,
    waveTime: null,
    waterTempTime: null,
    currentTime: null,

    modelTime: 'Zaman bilgisi bulunamadı',
    fetchTime: '--:--',
    lastUpdatedText: 'Zaman bilgisi bulunamadı (API Yanıt Vermedi · Referans Değer)',
    hourlyForecast: [], // Sahte tahmin puanı veya saat üretilmez!
    apiNotice: 'Canlı hava/deniz tahmin API bağlantısı sağlanamadı. Güncel veri yok — güvenlik değerlendirilemiyor. Gösterilen değerler referans veridir, güncel ölçüm değildir.'
  };

  return fallbackResult;
}
