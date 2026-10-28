/**
 * Balıkcım — Copernicus Marine (CMEMS) Servis Doğrulama Modülü
 * 
 * Resmî Servis İncelemesi: https://data.marine.copernicus.eu/
 * 
 * Karadeniz için Resmî Copernicus Marine Ürünleri:
 * 1. Fiziksel Oşinografi Analiz ve Tahmini (Akıntı, Su Sıcaklığı, Tuzluluk):
 *    - Ürün Kodu: BLKSEA_ANALYSISFORECAST_PHY_007_004
 *    - Sağlayıcı: Institute of Oceanology, Bulgarian Academy of Sciences (IO-BAS)
 *    - Değişkenler:
 *      * uo, vo: Doğu-Batı ve Kuzey-Güney akıntı hız bileşenleri (m/s -> km/sa)
 *      * thetao: Deniz yüzeyi potansiyel sıcaklığı (°C)
 *      * so: Deniz suyu tuzluluğu (PSU)
 *    - Mekânsal Çözünürlük: ~2.5 km (0.025° enlem x 0.025° boylam grid)
 *    - Zamansal Kapsam: Saatlik tahmin ve günlük analiz döngüsü
 * 
 * 2. Dalga Analiz ve Tahmini:
 *    - Ürün Kodu: BLKSEA_ANALYSISFORECAST_WAV_007_003
 *    - Değişkenler:
 *      * VHM0: Spektral belirgin dalga boyu (Hm0, metre)
 *      * VMDR: Ortalama dalga yönü (derece)
 *      * VTM02: Ortalama dalga periyodu (saniye)
 *    - Mekânsal Çözünürlük: ~2.5 km
 * 
 * 3. Deniz Yüzeyi Sıcaklığı (SST) Uydu Analizi:
 *    - Sentinel-3 SLSTR & GHRSST L4 Multi-sensor Analizi (~1 km çözünürlük)
 * 
 * Doğrulama ve Kimlik Denetimi Durumu (Authentication):
 * - Copernicus Marine Data Store doğrudan Subsetter / STAC / NetCDF indirme uç noktaları
 *   resmî CMEMS kullanıcı adı ve API Token (CAS kimlik doğrulaması) gerektirmektedir.
 * - Güvenlik İlkesi: İstemci (client-side) koduna hiçbir gizli API anahtarı veya sahte şifre gömülmez.
 * - Gerçekten Erişilebilir Veri Akışı:
 *   Copernicus Marine Karadeniz modellerini ve L4 deniz suyu analizlerini kamuya açık açık-veri
 *   arayüzü olarak sunan Open-Meteo Marine API köprüsü ile NASA GIBS GHRSST MUR L4 WMTS uydu katmanı
 *   doğrudan bağlanmıştır.
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
  authNotice: string;
  catalogUrl: string;
  publicBridgeUsed: string;
}

export const COPERNICUS_BLACK_SEA_PRODUCTS: Record<string, CopernicusProductDetails> = {
  physics: {
    productId: 'BLKSEA_ANALYSISFORECAST_PHY_007_004',
    title: 'Black Sea Physics Analysis and Forecast',
    provider: 'IO-BAS (Institute of Oceanology, Bulgarian Academy of Sciences) for CMEMS',
    spatialResolution: '~2.5 km (0.025° grid)',
    coverage: 'Karadeniz (40°N – 47°N, 27°E – 42°E)',
    variables: ['Akıntı Hızı (uo, vo)', 'Deniz Suyu Sıcaklığı (thetao)', 'Tuzluluk (so)'],
    accessMethod: 'CMEMS Subsetter / OpenDAP / WMS',
    authRequired: true,
    authNotice: 'Doğrudan NetCDF Subsetter API: Resmî CMEMS kullanıcı hesabı ve CAS Token gerektirir. Güvenlik gereği istemciye şifre gömülmez.',
    catalogUrl: 'https://data.marine.copernicus.eu/product/BLKSEA_ANALYSISFORECAST_PHY_007_004/description',
    publicBridgeUsed: 'Open-Meteo Marine API (Copernicus L4 ve hidrodinamik model çıktısı)'
  },
  waves: {
    productId: 'BLKSEA_ANALYSISFORECAST_WAV_007_003',
    title: 'Black Sea Waves Analysis and Forecast',
    provider: 'Copernicus Marine Service',
    spatialResolution: '~2.5 km (0.025° grid)',
    coverage: 'Karadeniz (40°N – 47°N, 27°E – 42°E)',
    variables: ['Belirgin Dalga Boyu (VHM0 / Hm0)', 'Dalga Yönü (VMDR)', 'Dalga Periyodu (VTM02)'],
    accessMethod: 'CMEMS Subsetter / STAC API',
    authRequired: true,
    authNotice: 'Doğrudan STAC/Subsetter API: CMEMS kimlik doğrulaması gerektirir.',
    catalogUrl: 'https://data.marine.copernicus.eu/product/BLKSEA_ANALYSISFORECAST_WAV_007_003/description',
    publicBridgeUsed: 'Open-Meteo Marine API (cell_selection=sea hidrodinamik dalga modeli)'
  },
  sstSatellite: {
    productId: 'SST_BS_SST_L4_NRT_OBSERVATIONS_010_006',
    title: 'Black Sea High Resolution Sea Surface Temperature Multi-Sensor L4',
    provider: 'CNR - ISAC Rome for CMEMS',
    spatialResolution: '~1 km grid',
    coverage: 'Karadeniz Havzası',
    variables: ['Deniz Yüzey Suyu Sıcaklığı (SST, °C)'],
    accessMethod: 'WMTS / WMS / NetCDF',
    authRequired: false,
    authNotice: 'NASA GIBS GHRSST MUR L4 WMTS katmanı üzerinden açık döşeme servisi olarak haritada görselleştirilmektedir.',
    catalogUrl: 'https://data.marine.copernicus.eu/product/SST_BS_SST_L4_NRT_OBSERVATIONS_010_006/description',
    publicBridgeUsed: 'NASA GIBS WMTS GHRSST MUR L4 uydu katmanı'
  }
};

/**
 * Copernicus Marine servis durumu ve şeffaflık bilgisini döner
 */
export function getCopernicusMarineAuditInfo() {
  return {
    serviceName: 'Copernicus Marine Service (data.marine.copernicus.eu)',
    inspectionDate: '2024/2026',
    authenticationStatus: 'Doğrudan CMEMS Subsetter API: Kimlik doğrulama gerektirir (API Token). Açık erişim Open-Meteo Marine & NASA GIBS köprüsüyle sağlanmaktadır.',
    products: COPERNICUS_BLACK_SEA_PRODUCTS,
    isIntegratedViaBridge: true
  };
}
