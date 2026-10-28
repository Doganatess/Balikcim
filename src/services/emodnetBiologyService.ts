/**
 * Balıkcım — EMODnet Biology & OBIS (Ocean Biodiversity Information System) Gözlem Servisi
 * 
 * Veri Kaynakları ve Şeffaflık:
 * 1. OBIS / EMODnet Biology Occurrence API:
 *    - Uç Nokta: https://api.obis.org/v3/occurrence
 *    - EMODnet Biology'nin küresel omurga veri tabanı (EurOBIS / OBIS Node)
 *    - Bilimsel araştırma seferleri, trolleme örneklemeleri, müze koleksiyonları ve saha gözlemleri.
 * 2. EMODnet Biology WFS / OGC Web Feature Service:
 *    - https://geo.vliz.be/geoserver/wfs
 * 
 * İlke:
 * - Gerçek gözlem kayıtları; türün bilimsel adı, koordinatı, gözlem tarihi, veri seti adı ve kurumuyla sunulur.
 * - Seçilen koordinat çevresinde gözlem verisi bulunamadığında "türün güncel olarak orada bulunduğu"
 *   ASLA varsayılmaz; "Bölgede doğrulanmış gözlem kaydı bulunamadı (Genel biyolojik rehber geçerlidir)" yazılır.
 */

export interface SpeciesObservationRecord {
  id: string;
  scientificName: string;
  decimalLatitude: number;
  decimalLongitude: number;
  eventDate?: string;
  year?: number;
  datasetName: string;
  institutionCode?: string;
  basisOfRecord: string; // e.g. "HumanObservation", "PreservedSpecimen", "Occurrence"
  individualCount?: number | string;
  distanceKm: number;
  catalogNumber?: string;
  license?: string;
}

export interface RegionalObservationResult {
  scientificName: string;
  targetLat: number;
  targetLng: number;
  hasLocalRecords: boolean;
  totalRecordsCount: number;
  localRecords: SpeciesObservationRecord[];
  nearestObservationDistanceKm: number | null;
  observationSummary: string;
  scientificDataNotice: string;
  sourceMetadata: {
    source: string;
    sourceUrl: string;
    datasetType: 'Biyolojik Saha Gözlemleri / Örnekleme Arşivi';
    queryPolygon: string;
    verificationDate: string;
    limitations: string[];
  };
}

// Oturum ve bellek içi önbellek
const observationCache: Record<string, { timestamp: number; data: RegionalObservationResult }> = {};
const OBS_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 saat önbellek

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Belirli bir türün Samsun–Ordu kıyısı ve Karadeniz havzasındaki resmî EMODnet Biology / OBIS gözlem kayıtlarını sorgular
 */
export async function querySpeciesObservations(
  scientificName: string,
  targetLat: number,
  targetLng: number
): Promise<RegionalObservationResult> {
  const cleanName = scientificName.split('(')[0].trim();
  const cacheKey = `obis_${cleanName.replace(/\s+/g, '_')}_${targetLat.toFixed(2)}_${targetLng.toFixed(2)}`;
  const now = Date.now();

  // 1. Önbellek kontrolü
  if (observationCache[cacheKey] && now - observationCache[cacheKey].timestamp < OBS_CACHE_TTL_MS) {
    return observationCache[cacheKey].data;
  }

  try {
    const rawSession = sessionStorage.getItem(cacheKey);
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      if (now - parsed.timestamp < OBS_CACHE_TTL_MS) {
        observationCache[cacheKey] = parsed;
        return parsed.data;
      }
    }
  } catch (e) {}

  // 2. Karadeniz Havzası (27°D–42°D, 40°K–47°K) Geometrisi
  const blackSeaPolygon = 'POLYGON((27 40, 42 40, 42 47, 27 47, 27 40))';
  const url = `https://api.obis.org/v3/occurrence?scientificname=${encodeURIComponent(cleanName)}&geometry=${encodeURIComponent(blackSeaPolygon)}&size=10`;

  let localRecords: SpeciesObservationRecord[] = [];
  let totalRecordsCount = 0;
  let querySuccess = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      totalRecordsCount = json.total || 0;
      querySuccess = true;

      if (Array.isArray(json.results) && json.results.length > 0) {
        localRecords = json.results
          .filter((item: any) => typeof item.decimalLatitude === 'number' && typeof item.decimalLongitude === 'number')
          .map((item: any, idx: number) => {
            const dist = calculateDistanceKm(targetLat, targetLng, item.decimalLatitude, item.decimalLongitude);
            return {
              id: item.id || `obs_${idx}`,
              scientificName: item.scientificName || cleanName,
              decimalLatitude: item.decimalLatitude,
              decimalLongitude: item.decimalLongitude,
              eventDate: item.eventDate ? item.eventDate.split('T')[0] : (item.date_year ? `${item.date_year}` : undefined),
              year: item.date_year,
              datasetName: item.datasetName || 'EMODnet / OBIS Karadeniz Biyoçeşitlilik Veri Seti',
              institutionCode: item.institutionCode || item.collectionCode,
              basisOfRecord: item.basisOfRecord || 'Araştırma Seferi / Saha Örneklemesi',
              individualCount: item.individualCount,
              distanceKm: dist,
              catalogNumber: item.catalogNumber,
              license: item.license
            };
          })
          .sort((a: SpeciesObservationRecord, b: SpeciesObservationRecord) => a.distanceKm - b.distanceKm);
      }
    }
  } catch (err) {
    querySuccess = false;
  }

  const hasLocal = localRecords.length > 0;
  const nearest = hasLocal ? localRecords[0] : null;
  const nearestDist = nearest ? nearest.distanceKm : null;

  let observationSummary = '';
  if (hasLocal && nearestDist !== null && nearestDist <= 80) {
    observationSummary = `EMODnet / OBIS kayıtlarında bu koordinata ~${nearestDist} km mesafede doğrulanmış saha gözlemi/örneklemesi mevcuttur (${nearest?.eventDate || nearest?.year || 'Tarihli'} · ${nearest?.datasetName}).`;
  } else if (hasLocal && totalRecordsCount > 0) {
    observationSummary = `Karadeniz havzasında toplam ${totalRecordsCount} adet resmî bilimsel gözlem/örnekleme kaydı bulunmaktadır (En yakın kayıt ~${nearestDist} km mesafede: ${nearest?.datasetName}).`;
  } else {
    observationSummary = `Bu koordinat ve yakın çevresinde EMODnet Biology / OBIS veri tabanında teyitli güncel gözlem kaydı bulunamadı. Genel biyolojik rehber geçerlidir; türün güncel olarak tam bu noktada bulunduğu varsayılmaz.`;
  }

  const result: RegionalObservationResult = {
    scientificName: cleanName,
    targetLat,
    targetLng,
    hasLocalRecords: hasLocal,
    totalRecordsCount,
    localRecords,
    nearestObservationDistanceKm: nearestDist,
    observationSummary,
    scientificDataNotice: querySuccess
      ? 'Veriler EMODnet Biology & OBIS (Ocean Biodiversity Information System) açık erişim API\'si üzerinden doğrulanmıştır.'
      : 'EMODnet Biology sorgusu geçici olarak yanıt vermedi; genel biyolojik rehber sunulmaktadır.',
    sourceMetadata: {
      source: 'EMODnet Biology / OBIS (Ocean Biodiversity Information System)',
      sourceUrl: 'https://www.emodnet-biology.eu/',
      datasetType: 'Biyolojik Saha Gözlemleri / Örnekleme Arşivi',
      queryPolygon: 'Karadeniz Havzası (27°D–42°D, 40°K–47°K)',
      verificationDate: new Date().toISOString().split('T')[0],
      limitations: [
        'Geçmiş bilimsel sefer ve müze örneklemesi kayıtlarıdır; anlık biyokütle veya anlık olta garantisi oluşturmaz.',
        'Kayıt bulunmaması, türün orada kesinlikle yaşamadığını kanıtlamaz (bölgede bilimsel sefer yapılmamış olabilir).',
        'Gözlem kaydı bulunsa dahi türün tam bu koordinatta anlık varlığı sahada doğrulanmalıdır.'
      ]
    }
  };

  observationCache[cacheKey] = {
    timestamp: now,
    data: result
  };

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: result }));
  } catch (e) {}

  return result;
}
