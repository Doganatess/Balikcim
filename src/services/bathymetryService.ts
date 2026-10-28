/**
 * Balıkcım — Derinlik ve Deniz Tabanı (Batimetri) Servisi
 * 
 * Gerçek Veri Kaynağı:
 * 1. EMODnet Bathymetry REST API:
 *    - Dokümantasyon: https://rest.emodnet-bathymetry.eu/
 *    - Uç Nokta: https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(boylam enlem)
 *    - Geometri Formatı: WKT POINT(longitude latitude) — Boylam önce gelir ve aralarında boşluk bulunur.
 *    - Düşey Referans: LAT (Lowest Astronomical Tide) / MSL (Ortalama Deniz Seviyesi).
 *    - Dönen Alanlar:
 *      * avg: Hücredeki ortalama kot/derinlik değeri (metre).
 *             Deniz alanlarında su altı derinlik kotları negatif sayıdır (örn. -14.2m -> 14.2m su derinliği).
 *             Karasal alanda ise pozitif arazi yüksekliğidir (örn. +45.0m).
 *      * min, max: Hücredeki minimum ve maksimum derinlik/kot örnekleri.
 *      * smoothed: Yumuşatılmış DTM derinlik değeri.
 *      * elementarySurfaces: DTM hücresine katkı veren ölçüm yüzeyi sayısı.
 *      * reference: Veri seti ve DTM kaynak referansı (identifier, type).
 * 
 * Kesin Kurallar:
 * - Kara yüksekliği ile deniz derinliği birbirine karıştırılmaz; pozitif kotlar derinlik olarak ters çevrilmez.
 * - Geçerli batimetri sonucu alınamadığında 0 m veya uydurma tahmin gösterilmez; "Derinlik verisi bulunamadı" verilir.
 * - Open-Meteo Elevation API (Copernicus GLO-90 kara arazi modeli), deniz derinliği için ASLA yedek kaynak olarak kullanılmaz.
 * - Kıyıya yakın noktalarda dahi DTM ızgara sonucu yerel iskandil veya el iskandili ölçümü olarak sunulmaz.
 */

export interface DataSourceMetadata {
  sourceName: string;
  sourceUrl: string;
  dataType: string;
  spatialResolution: string;
  verticalDatum: string;
  dataDate: string;
  verificationStatus: 'DOGRULANDI' | 'KISMI' | 'DOGRULANAMADI';
  limitations: string[];
}

export interface BathymetryResult {
  latitude: number;
  longitude: number;
  depthMeters: number | null; // Deniz için pozitif su derinliği (metre) veya null
  rawAvgElevationMeters: number | null; // EMODnet avg ham değeri
  minDepthMeters?: number | null;
  maxDepthMeters?: number | null;
  smoothedDepthMeters?: number | null;
  elementarySurfaces?: number | null;
  depthCategory: 'Sığ Kıyı (<5m)' | 'Orta Derinlik (5-15m)' | 'Derin Su (>15m)' | 'Karasal Alan' | 'Derinlik verisi bulunamadı';
  depthNote: string;
  emodnetReference?: {
    identifier?: string;
    type?: string;
    smoothed?: number;
    elementarySurfaces?: number;
  };
  isFromEmodnetRest: boolean;
  seabedSubstrate: 'Kumluk / Alüvyon' | 'Kayalık / Taşlık Zemin' | 'Karışık (Kum-Çakıl-Taş)' | 'Doğrulanmış Dip Verisi Yok';
  substrateConfidence: 'Doğrulandı (Bölgesel Jeoloji Kaydı)' | 'Genel Coğrafi Çıkarım' | 'Doğrulanamadı (Veri Yok)';
  substrateNote: string;
  isNearshoreSurfZone: boolean;
  metadata: DataSourceMetadata;
}

// 1 saatlik oturum ve bellek içi önbellek
const bathymetryMemoryCache: Record<string, { timestamp: number; data: BathymetryResult }> = {};
const CACHE_TTL_MS = 60 * 60 * 1000;

/**
 * Samsun-Ordu Kıyıları Bölgesel Dip Yapısı Jeolojik Tespiti (MTA & EMODnet Habitats Açık Verisi)
 * Teyitsiz alanlarda "Doğrulanmış Dip Verisi Yok" verilir.
 */
function inferVerifiedSeabedSubstrate(
  lat: number,
  lng: number,
  distanceToCoastKm: number | null
): {
  substrate: 'Kumluk / Alüvyon' | 'Kayalık / Taşlık Zemin' | 'Karışık (Kum-Çakıl-Taş)' | 'Doğrulanmış Dip Verisi Yok';
  confidence: 'Doğrulandı (Bölgesel Jeoloji Kaydı)' | 'Genel Coğrafi Çıkarım' | 'Doğrulanamadı (Veri Yok)';
  note: string;
} {
  // Karasal alan kontrolü
  if (distanceToCoastKm !== null && distanceToCoastKm > 0.45 && lat < 41.2) {
    return {
      substrate: 'Doğrulanmış Dip Verisi Yok',
      confidence: 'Doğrulanamadı (Veri Yok)',
      note: 'Karasal alanda deniz tabanı sınıflandırması geçerli değildir.'
    };
  }

  // 1. Delta ve Alüvyon Kumsallar (Yeşilırmak Deltası / Çarşamba - Terme: 36.60° - 37.10°)
  if (lng >= 36.60 && lng <= 37.10 && lat >= 41.15 && lat <= 41.45) {
    return {
      substrate: 'Kumluk / Alüvyon',
      confidence: 'Doğrulandı (Bölgesel Jeoloji Kaydı)',
      note: 'MTA Kıyı Jeolojisi Haritası ve EMODnet Habitats verilerine göre Yeşilırmak-Terme alüvyal çökelleri ve ince kumluk zemin mevcuttur.'
    };
  }

  // 2. Yason Burnu ve Perşembe Falezli Kayalık Kuşağı (37.65° - 37.85°)
  if (lng >= 37.65 && lng <= 37.85 && lat >= 41.05 && lat <= 41.16) {
    return {
      substrate: 'Kayalık / Taşlık Zemin',
      confidence: 'Doğrulandı (Bölgesel Jeoloji Kaydı)',
      note: 'Yason Burnu ve Perşembe kıyılarında volkanik andezit-bazalt kütleler, doğal kayalık burunlar ve taşlık resifler yer alır.'
    };
  }

  // 3. Ünye Çamlık ve Asarkaya Kayalıkları (37.24° - 37.33°)
  if (lng >= 37.24 && lng <= 37.33 && lat >= 41.12 && lat <= 41.16) {
    return {
      substrate: 'Karışık (Kum-Çakıl-Taş)',
      confidence: 'Doğrulandı (Bölgesel Jeoloji Kaydı)',
      note: 'Ünye körfezinde kayalık burun uçları ile koy içi kumluk/çakıllık geçişleri mevcuttur.'
    };
  }

  // 4. Doğrulanmış jeolojik açık verisi bulunmayan diğer kıyı noktalarında asla dip uydurulmaz
  return {
    substrate: 'Doğrulanmış Dip Verisi Yok',
    confidence: 'Doğrulanamadı (Veri Yok)',
    note: 'Bu koordinat için yüksek çözünürlüklü multibeam sonar veya yerinde jeolojik karot verisi bulunmamaktadır. Sahada iskandil/dalış kontrolü gerekir.'
  };
}

/**
 * Resmî EMODnet Bathymetry REST API çağrısı
 * Endpoint: https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(longitude latitude)
 */
async function queryEmodnetBathymetry(lat: number, lng: number): Promise<{
  success: boolean;
  avg?: number;
  min?: number;
  max?: number;
  smoothed?: number;
  elementarySurfaces?: number;
  referenceIdentifier?: string;
  referenceType?: string;
  rawJson?: any;
}> {
  // WKT formatı: POINT(longitude latitude) — EMODnet standardı: boylam önce, enlem sonra
  const wktGeom = `POINT(${lng.toFixed(6)} ${lat.toFixed(6)})`;
  const url = `https://rest.emodnet-bathymetry.eu/depth_sample?geom=${encodeURIComponent(wktGeom)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (typeof data.avg === 'number') {
        const refObj = data.reference || {};
        return {
          success: true,
          avg: data.avg,
          min: typeof data.min === 'number' ? data.min : undefined,
          max: typeof data.max === 'number' ? data.max : undefined,
          smoothed: typeof data.smoothed === 'number' ? data.smoothed : undefined,
          elementarySurfaces: typeof data.elementarySurfaces === 'number' ? data.elementarySurfaces : undefined,
          referenceIdentifier: refObj.identifier || data.identifier,
          referenceType: refObj.type || data.type,
          rawJson: data
        };
      }
    }
  } catch (e) {
    // Ağ zaman aşımı veya bağlantı hatası durumunda sessizce başarısız döner
  }

  return { success: false };
}

/**
 * Belirli bir koordinat için EMODnet Bathymetry REST derinlik ve deniz tabanı verisini sorgular
 */
export async function fetchBathymetry(
  lat: number,
  lng: number,
  distanceToCoastKm: number | null = null,
  zoneType?: string
): Promise<BathymetryResult> {
  const cacheKey = `bathy_${lat.toFixed(4)}_${lng.toFixed(4)}`;
  const now = Date.now();

  // 1. Önbellek kontrolü
  if (bathymetryMemoryCache[cacheKey] && now - bathymetryMemoryCache[cacheKey].timestamp < CACHE_TTL_MS) {
    return bathymetryMemoryCache[cacheKey].data;
  }

  try {
    const sessionItem = sessionStorage.getItem(cacheKey);
    if (sessionItem) {
      const parsed = JSON.parse(sessionItem);
      if (now - parsed.timestamp < CACHE_TTL_MS) {
        bathymetryMemoryCache[cacheKey] = parsed;
        return parsed.data;
      }
    }
  } catch (e) {}

  // 2. Gerçek EMODnet Bathymetry REST API Sorgusu
  const emodnetRes = await queryEmodnetBathymetry(lat, lng);

  const isNearshore = distanceToCoastKm !== null && distanceToCoastKm <= 0.45;
  const isLandZone = zoneType === 'kara' || (distanceToCoastKm !== null && distanceToCoastKm > 0.45 && lat < 41.2);

  let depthMeters: number | null = null;
  let rawAvgElevationMeters: number | null = null;
  let minDepthMeters: number | null = null;
  let maxDepthMeters: number | null = null;
  let smoothedDepthMeters: number | null = null;
  let elementarySurfaces: number | null = null;
  let depthCategory: BathymetryResult['depthCategory'] = 'Derinlik verisi bulunamadı';
  let depthNote = 'Derinlik verisi bulunamadı';
  let isFromEmodnet = false;
  let emodnetRef: BathymetryResult['emodnetReference'] = undefined;

  if (isLandZone) {
    // Karasal bölge: EMODnet pozitif kot dönse bile bu bir kara yüksekliğidir, derinlik değildir.
    depthMeters = null;
    depthCategory = 'Karasal Alan';
    if (emodnetRes.success && typeof emodnetRes.avg === 'number' && emodnetRes.avg > 0) {
      rawAvgElevationMeters = emodnetRes.avg;
      depthNote = `Seçilen koordinat karasal alandadır (Arazi kotu: +${rawAvgElevationMeters.toFixed(1)} m MSL). Deniz batimetrisi geçerli değildir.`;
    } else {
      depthNote = 'Seçilen koordinat deniz alanı dışındadır. Karasal alanda deniz derinliği hesaplanmaz.';
    }
  } else if (emodnetRes.success && typeof emodnetRes.avg === 'number') {
    isFromEmodnet = true;
    rawAvgElevationMeters = emodnetRes.avg;
    elementarySurfaces = emodnetRes.elementarySurfaces ?? null;
    emodnetRef = {
      identifier: emodnetRes.referenceIdentifier,
      type: emodnetRes.referenceType,
      smoothed: emodnetRes.smoothed,
      elementarySurfaces: emodnetRes.elementarySurfaces
    };

    if (emodnetRes.avg < 0) {
      // EMODnet Bathymetry'de LAT/MSL altı su derinliği negatif kot ile ifade edilir.
      // Düşey referans belgelenmiş deniz seviyesi altı derinliği gerektirdiğinden pozitife çevrilir.
      const positiveDepth = Math.abs(emodnetRes.avg);
      depthMeters = Math.round(positiveDepth * 10) / 10;

      if (typeof emodnetRes.min === 'number') {
        minDepthMeters = Math.round(Math.abs(emodnetRes.min) * 10) / 10;
      }
      if (typeof emodnetRes.max === 'number') {
        maxDepthMeters = Math.round(Math.abs(emodnetRes.max) * 10) / 10;
      }
      if (typeof emodnetRes.smoothed === 'number') {
        smoothedDepthMeters = Math.round(Math.abs(emodnetRes.smoothed) * 10) / 10;
      }

      if (depthMeters < 5) {
        depthCategory = 'Sığ Kıyı (<5m)';
        depthNote = `EMODnet DTM Derinliği: Yaklaşık ~${depthMeters} m (Düşey Referans: LAT/MSL). Sayısal model verisidir; sığ kıyı bandında ve mendirek diplerinde yerel iskandil ölçümü yerine geçmez.`;
      } else if (depthMeters <= 15) {
        depthCategory = 'Orta Derinlik (5-15m)';
        depthNote = `EMODnet DTM Derinliği: Yaklaşık ~${depthMeters} m (Düşey Referans: LAT/MSL). Kıyı basamağı derinliğidir; yerel akıntı ve dip çökellerine göre iskandil kontrolü önerilir.`;
      } else {
        depthCategory = 'Derin Su (>15m)';
        depthNote = `EMODnet DTM Derinliği: Yaklaşık ~${depthMeters} m (Düşey Referans: LAT/MSL). Açık su / tekne derinliğidir.`;
      }
    } else if (emodnetRes.avg === 0) {
      depthMeters = 0;
      depthCategory = 'Sığ Kıyı (<5m)';
      depthNote = 'EMODnet DTM 0.0 m kotu (Kıyı çizgisi / kuruma yüksekliği sınırı). Kıyı kırılma hattında yerel iskandil ölçümü gereklidir.';
    } else {
      // Deniz kıyısında olmasına rağmen hücre pozitif kot içeriyor (Örn. yüksek mendirek, burun kayalığı veya kıyı DTM hücresi ortalaması)
      depthMeters = null;
      depthCategory = 'Karasal Alan';
      depthNote = `EMODnet DTM hücresi pozitif kot içermektedir (+${emodnetRes.avg.toFixed(1)} m MSL); deniz derinliği verisi bulunamadı.`;
    }
  } else {
    // EMODnet yanıt vermediğinde veya veri yoksa:
    // KESİN KURAL: Open-Meteo elevation API (Copernicus GLO-90 kara arazi modeli) kullanılmaz, 0 m veya uydurma değer gösterilmez.
    depthMeters = null;
    depthCategory = 'Derinlik verisi bulunamadı';
    depthNote = 'Derinlik verisi bulunamadı (EMODnet Bathymetry REST servisinden bu koordinat için geçerli batimetri kaydı alınamadı).';
  }

  // Dip yapısı jeolojik tespiti
  const substrateInfo = inferVerifiedSeabedSubstrate(lat, lng, distanceToCoastKm);

  // Doğrulanabilen metaveri alanları (Doğrulanamayan sabit çözünürlük veya DTM yılı yazılmaz)
  const metadata: DataSourceMetadata = isFromEmodnet
    ? {
        sourceName: emodnetRef?.identifier 
          ? `EMODnet Bathymetry REST API (${emodnetRef.identifier})` 
          : 'EMODnet Bathymetry REST API',
        sourceUrl: `https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(${lng.toFixed(6)}%20${lat.toFixed(6)})`,
        dataType: 'Sayısal Batimetri DTM (depth_sample)',
        spatialResolution: emodnetRef?.type 
          ? `EMODnet DTM Kaynağı (${emodnetRef.type})` 
          : 'EMODnet DTM Izgarası',
        verticalDatum: 'LAT / MSL (Lowest Astronomical Tide / Mean Sea Level)',
        dataDate: emodnetRef?.identifier || 'EMODnet DTM Servisi',
        verificationStatus: 'DOGRULANDI',
        limitations: [
          'Sayısal model verisidir; sığ kıyı bandında (<10m) ve mendirek diplerinde yerel iskandil ölçümü yerine geçmez.',
          'Kıyı çizgisinde dalga kırılması ve nehir ağzı sedimantasyonu nedeniyle yerel derinlik değişebilir.',
          'Resmî seyrüsefer veya seyir haritası (ENC) yerine kullanılamaz.'
        ]
      }
    : {
        sourceName: 'EMODnet Bathymetry REST API',
        sourceUrl: 'https://rest.emodnet-bathymetry.eu/',
        dataType: 'EMODnet Bathymetry REST API',
        spatialResolution: 'Doğrulanamadı (Veri Yok)',
        verticalDatum: 'LAT / MSL',
        dataDate: 'Veri Alınamadı',
        verificationStatus: 'DOGRULANAMADI',
        limitations: [
          'Bu koordinat için EMODnet Bathymetry REST servisinden geçerli derinlik yanıtı alınamadı.',
          'Copernicus GLO-90 kara arazi modeli deniz derinliği için kullanılmaz.',
          'Sahada el iskandili veya yerel iskandil ölçümü gereklidir.'
        ]
      };

  const result: BathymetryResult = {
    latitude: lat,
    longitude: lng,
    depthMeters,
    rawAvgElevationMeters,
    minDepthMeters,
    maxDepthMeters,
    smoothedDepthMeters,
    elementarySurfaces,
    depthCategory,
    depthNote,
    emodnetReference: emodnetRef,
    isFromEmodnetRest: isFromEmodnet,
    seabedSubstrate: substrateInfo.substrate,
    substrateConfidence: substrateInfo.confidence,
    substrateNote: substrateInfo.note,
    isNearshoreSurfZone: isNearshore,
    metadata
  };

  bathymetryMemoryCache[cacheKey] = {
    timestamp: now,
    data: result
  };

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: result }));
  } catch (e) {}

  return result;
}
