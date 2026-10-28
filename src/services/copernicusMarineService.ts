/**
 * Balıkcım — Copernicus Marine (CMEMS) ve Deniz Veri Kaynakları Ayrım Modülü
 * 
 * Resmî Servis Dokümantasyonu ve İnceleme:
 * 1. Copernicus Marine Ürün Kataloğu: https://data.marine.copernicus.eu/
 * 2. Copernicus Marine Toolbox ve API Rehberi: https://help.marine.copernicus.eu/
 * 
 * Önemli Ayrım İlkeleri:
 * 1. Doğrudan Copernicus Marine (CMEMS) API Erişimi:
 *    - CMEMS Data Store doğrudan Subsetter, STAC ve OPeNDAP NetCDF indirme uç noktaları
 *      kayıtlı kullanıcı hesabı ve CAS Token kimlik doğrulaması gerektirir.
 *    - Güvenlik İlkesi: Tarayıcı (istemci) koduna asla kullanıcı adı, parola veya gizli token gömülmez.
 *    - Bu istemci uygulamasında doğrudan CMEMS sayısal API entegrasyonu tamamlanmış gibi gösterilmez;
 *      ürünler doğrulanmış katalog referansı olarak sunulur.
 * 2. Open-Meteo Marine:
 *    - Dalga, rüzgâr ve su sıcaklığı değerleri Open-Meteo açık API sayısal tahmin modellerinden gelir.
 *    - Bu değerler strictly "Open-Meteo Marine Sayısal Model Tahmini" olarak etiketlenir.
 * 3. NASA GIBS (Global Imagery Browse Services):
 *    - Haritada görsel raster döşeme (WMTS) katmanı olarak kullanılır.
 *    - Görüntü katmanından koordinata ait sayısal deniz suyu sıcaklığı veya akıntı ölçümü ÜRETİLMEZ.
 *    - Sayısal sıcaklık için Open-Meteo API'nin döndürdüğü değer, kaynağı ve zaman damgası kullanılır.
 */

export interface CopernicusProductDetails {
  productId: string;
  title: string;
  provider: string;
  spatialResolution: string;
  coverage: string;
  variables: string[];
  accessMethod: string;
  authRequired: boolean;
  directAccessActiveInApp: boolean;
  integrationNotice: string;
  catalogUrl: string;
}

export const COPERNICUS_BLACK_SEA_PRODUCTS: Record<string, CopernicusProductDetails> = {
  physics: {
    productId: 'BLKSEA_ANALYSISFORECAST_PHY_007_004',
    title: 'Black Sea Physics Analysis and Forecast',
    provider: 'IO-BAS (Institute of Oceanology, Bulgarian Academy of Sciences) for CMEMS',
    spatialResolution: '~2.5 km (0.025° x 0.025° grid, 31 düşey seviye)',
    coverage: 'Karadeniz (40°N – 47°N, 27°E – 42°E)',
    variables: ['uo, vo (Akıntı Hız Bileşenleri)', 'thetao (Deniz Suyu Sıcaklığı)', 'so (Tuzluluk)', 'zos (Deniz Yüzeyi Yüksekliği)'],
    accessMethod: 'Copernicus Marine Toolbox (CLI / Python), STAC API, Subsetter (NetCDF)',
    authRequired: true,
    directAccessActiveInApp: false,
    integrationNotice: 'Doğrudan CMEMS API erişimi aktif değildir (Kayıtlı CMEMS hesabı ve güvenli sunucu tarafı kimlik doğrulaması gerektirir; istemci koduna token gömülmez).',
    catalogUrl: 'https://data.marine.copernicus.eu/product/BLKSEA_ANALYSISFORECAST_PHY_007_004/description'
  },
  waves: {
    productId: 'BLKSEA_ANALYSISFORECAST_WAV_007_003',
    title: 'Black Sea Waves Analysis and Forecast',
    provider: 'Helmholtz-Zentrum Hereon / IO-BAS for CMEMS',
    spatialResolution: '~2.5 km (0.025° grid)',
    coverage: 'Karadeniz (40°N – 47°N, 27°E – 42°E)',
    variables: ['VHM0 (Spektral Belirgin Dalga Boyu)', 'VMDR (Ortalama Dalga Yönü)', 'VTM02 (Ortalama Dalga Periyodu)'],
    accessMethod: 'Copernicus Marine Toolbox / STAC API / Subsetter',
    authRequired: true,
    directAccessActiveInApp: false,
    integrationNotice: 'Doğrudan CMEMS API erişimi aktif değildir; güvenli sunucu altyapısı olmadan istemciye şifre eklenmez.',
    catalogUrl: 'https://data.marine.copernicus.eu/product/BLKSEA_ANALYSISFORECAST_WAV_007_003/description'
  },
  sstSatellite: {
    productId: 'SST_BS_SST_L4_NRT_OBSERVATIONS_010_006',
    title: 'Black Sea High Resolution Sea Surface Temperature Multi-Sensor L4',
    provider: 'CNR - ISAC Rome for CMEMS',
    spatialResolution: '~1 km grid (0.01° enlem x 0.01° boylam)',
    coverage: 'Karadeniz Havzası',
    variables: ['analysed_sst (Deniz Yüzey Suyu Sıcaklığı)'],
    accessMethod: 'Copernicus Marine Toolbox / STAC API / NetCDF',
    authRequired: true,
    directAccessActiveInApp: false,
    integrationNotice: 'Doğrudan CMEMS sayısal NetCDF veri akışı aktif değildir. Haritadaki raster görsel katman ayrı bir servis olan NASA GIBS WMTS üzerinden sağlanmaktadır.',
    catalogUrl: 'https://data.marine.copernicus.eu/product/SST_BS_SST_L4_NRT_OBSERVATIONS_010_006/description'
  }
};

export const NASA_GIBS_INFO = {
  title: 'NASA GIBS (Global Imagery Browse Services)',
  serviceUrl: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GHRSST_L4_MUR_Sea_Surface_Temperature/default/default/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
  dataType: 'Raster Uydu Görüntü Döşemesi (WMTS)',
  purpose: 'Harita üzerinde görsel termal uydu döşemesi sağlamak',
  limitation: 'Görsel raster harita katmanıdır; tek başına tıklanan koordinata ait doğrulanmış sayısal sıcaklık veya akıntı ölçümü üretmez.',
  attribution: 'NASA GIBS / Earthdata'
};

/**
 * Copernicus Marine ve NASA GIBS ayrımını içeren şeffaflık künyesi
 */
export function getCopernicusMarineAuditInfo() {
  return {
    serviceName: 'Copernicus Marine Service (data.marine.copernicus.eu)',
    authPolicy: 'Doğrudan CMEMS NetCDF/STAC erişimi kimlik doğrulaması (CAS Token) gerektirir. Güvenlik gereği istemci koduna token eklenmemiştir; doğrudan API aktif değildir.',
    numericDataProvider: 'Open-Meteo Marine API (Açık Sayısal Model Tahmini)',
    visualSatelliteProvider: 'NASA GIBS GHRSST MUR L4 (Raster WMTS Harita Katmanı)',
    products: COPERNICUS_BLACK_SEA_PRODUCTS,
    nasaGibs: NASA_GIBS_INFO
  };
}
