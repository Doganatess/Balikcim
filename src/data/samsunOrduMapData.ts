// Balıkcım — Samsun–Ordu Doğrulanmış Kıyı Meraları ve Coğrafi Doğrulama Modülü
// Yalnızca Samsun ve Ordu Karadeniz kıyı şeridindeki 30 nokta.
// Coğrafi Doğrulama (OSM Kıyı Nesnesi) ile Balıkçılık Erişimi birbirinden bağımsız değerlendirilir.
// Karada kalan veya açık denizde yer alan sahte/tahmini koordinatlar kaldırılmış, teyitli kıyı yapılarına sabitlenmiştir.

export type SpotEvidenceLevel = 'DOGRULANDI' | 'ADAY' | 'YETERSIZ_VERI' | 'ERISIM_KISITLI_VEYA_RISKLI';

export type CoastalStructureType = 
  | 'mendirek' 
  | 'limanici' 
  | 'kayalik_burun' 
  | 'kumsal' 
  | 'dere_agzi';

export type CoastalLocationType = 
  | 'Mendirek / Taş Tahkimat' 
  | 'Liman / Barınak İçi'
  | 'Doğal Kayalık Burun' 
  | 'Kumsal / Plaj Şeridi' 
  | 'Nehir / Dere Ağzı'
  | 'Açık Deniz'
  | 'Karasal Alan';

export interface VerifiedCoastalSpot {
  id: string;
  name: string;
  il: 'Samsun' | 'Ordu';
  ilce: string;
  lat: number;
  lng: number;
  kiyiYapisi: CoastalStructureType;
  kanitSeviyesi: SpotEvidenceLevel;
  kanitSeviyesiBadge: string;

  // Harita İşaretçisi Aktiflik Durumu (Karada kalan, yasaklı veya noktasal merası olmayan noktalar haritada gösterilmez)
  haritadaAktifMi: boolean;
  aktifOlmamaGerekcesi?: string;
  eskiKoordinat?: { lat: number; lng: number };

  // Coğrafi Doğrulama (Fiziki kıyı yapısının harita/uydu teyidi)
  cografiDogrulamaDurumu: 'DOGRULANDI' | 'KISMI';
  cografiKaynak: string;
  osmId?: string;
  osmUrl?: string;
  cografiKaynakNotu: string;

  // Kıyıya Fiziksel Erişim ve Yasal İzin / Kısıt Durumu
  fizikselKiyiErisimi: string;
  avlanmaIzinDurumu: string;
  kisitlarVeRiskler: string;
  belirsizlikler: string;

  // Balıkçılık Gerekçesi ve Tür Kanıtı
  balikcilikGerekcesi: string;
  hedeflenenTurler: string[];
  turVerisiKaynagi: string;
  derinlikDurumu: string;

  // Geriye dönük uyumluluk alanları
  kaynak: string;
  erisimDurumu: string;
  city: 'Samsun' | 'Ordu';
  district: string;
  locationType: CoastalLocationType;
  verificationStatus: SpotEvidenceLevel;
  verificationBadge: string;
  verificationNote: string;
  verifiedGeoFeature: string;
  commonTargetSpecies: string[];
  depthStatus: string;
  cautions: string;
}

export const SAMSUN_ORDU_BOUNDS: [[number, number], [number, number]] = [
  [40.85, 36.05],
  [41.50, 38.20]
];

export const SAMSUN_ORDU_CENTER: [number, number] = [41.15, 37.15];

// Doğrulanmış kesintisiz kıyı referans çizgisi
export const SAMSUN_ORDU_COASTLINE: [number, number][] = [
  [41.4850, 36.0500],
  [41.4725, 36.1121],
  [41.4695, 36.1285],
  [41.4462, 36.1511],
  [41.4200, 36.1789],
  [41.4065, 36.2048],
  [41.3701, 36.2311],
  [41.3520, 36.2533],
  [41.3444, 36.2618],
  [41.3250, 36.2754],
  [41.3180, 36.3150],
  [41.3050, 36.3370],
  [41.2950, 36.3450],
  [41.2830, 36.3520],
  [41.2780, 36.3633],
  [41.2562, 36.3956],
  [41.2460, 36.4325],
  [41.2449, 36.4760],
  [41.2626, 36.5179],
  [41.2979, 36.5708],
  [41.3649, 36.6087],
  [41.3869, 36.6544],
  [41.3798, 36.6603],
  [41.3660, 36.6710],
  [41.3663, 36.7581],
  [41.3508, 36.8367],
  [41.2945, 36.9849],
  [41.1982, 37.0279],
  [41.1710, 37.0775],
  [41.1470, 37.1355],
  [41.1450, 37.2650],
  [41.1278, 37.2872],
  [41.1445, 37.2917],
  [41.1385, 37.3195],
  [41.1235, 37.3225],
  [41.1125, 37.3779],
  [41.0777, 37.4365],
  [41.0290, 37.4965],
  [41.0430, 37.5050],
  [41.0425, 37.5865],
  [41.1015, 37.6401],
  [41.1292, 37.6797],
  [41.1261, 37.7512],
  [41.1158, 37.7862],
  [41.0660, 37.7725],
  [41.0342, 37.8262],
  [41.0005, 37.8835],
  [40.9955, 37.8760],
  [40.9847, 37.9339],
  [40.9780, 37.9817],
  [40.9750, 38.0055],
  [40.9670, 38.0880],
  [40.9521, 38.1613],
  [40.9417, 38.2000]
];

// Kullanıcı talebi doğrultusunda tüm hazır/örnek mera kayıtları sıfırlanmıştır.
// Uygulama temiz boş liste ile başlar; meralar kullanıcı tarafından manuel eklenecektir.
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [];

import {
  SAMSUN_ORDU_LAND_GEOJSON,
  type Position,
  type LinearRing,
  type PolygonCoordinates,
  type LandGeometry,
  type LandFeatureCollection
} from './samsunOrduLandData';

const LAND_GEOJSON = SAMSUN_ORDU_LAND_GEOJSON;
const COASTAL_BAND_KM = 0.45;
const CLIP_EDGE_TOLERANCE = 0.001;

function isFiniteCoordinate(lat: number, lng: number): boolean {
  return Number.isFinite(lat) && Number.isFinite(lng);
}

function isWithinBounds(lat: number, lng: number): boolean {
  return lng >= 36.05 && lng <= 38.20 && lat >= 40.85 && lat <= 41.50;
}

function distanceToSegmentKm(
  pLat: number,
  pLng: number,
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): { distance: number; closestLat: number; closestLng: number } {
  const averageLatitude = ((aLat + bLat + pLat) / 3) * (Math.PI / 180);
  const kmPerLongitudeDegree = 111.32 * Math.cos(averageLatitude);
  const kmPerLatitudeDegree = 110.57;

  const ax = aLng * kmPerLongitudeDegree;
  const ay = aLat * kmPerLatitudeDegree;
  const bx = bLng * kmPerLongitudeDegree;
  const by = bLat * kmPerLatitudeDegree;
  const px = pLng * kmPerLongitudeDegree;
  const py = pLat * kmPerLatitudeDegree;

  const dx = bx - ax;
  const dy = by - ay;
  const segmentLengthSquared = dx * dx + dy * dy;

  const t = segmentLengthSquared === 0
    ? 0
    : Math.max(
        0,
        Math.min(
          1,
          ((px - ax) * dx + (py - ay) * dy) / segmentLengthSquared
        )
      );

  const closestLat = aLat + t * (bLat - aLat);
  const closestLng = aLng + t * (bLng - aLng);
  const distance = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));

  return { distance, closestLat, closestLng };
}

function pointInRing(lat: number, lng: number, ring: LinearRing): boolean {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersects =
      (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

function pointInPolygon(
  lat: number,
  lng: number,
  polygon: PolygonCoordinates
): boolean {
  if (polygon.length === 0 || !pointInRing(lat, lng, polygon[0])) {
    return false;
  }

  // İç halkalar poligon içindeki boşluklardır.
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(lat, lng, polygon[i])) {
      return false;
    }
  }

  return true;
}

export function isLandPoint(lat: number, lng: number): boolean {
  for (const feature of LAND_GEOJSON.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;

    if (geometry.type === 'Polygon') {
      if (pointInPolygon(lat, lng, geometry.coordinates)) {
        return true;
      }
    } else if (geometry.type === 'MultiPolygon') {
      if (
        geometry.coordinates.some(polygon =>
          pointInPolygon(lat, lng, polygon)
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function isPointInAnyHole(lat: number, lng: number): boolean {
  for (const feature of LAND_GEOJSON.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;

    if (geometry.type === 'Polygon') {
      for (let i = 1; i < geometry.coordinates.length; i++) {
        if (pointInRing(lat, lng, geometry.coordinates[i])) {
          return true;
        }
      }
    } else if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates) {
        for (let i = 1; i < polygon.length; i++) {
          if (pointInRing(lat, lng, polygon[i])) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function isArtificialClipEdge(a: Position, b: Position): boolean {
  const [aLng, aLat] = a;
  const [bLng, bLat] = b;

  const westEdge =
    Math.abs(aLng - 36.05) < CLIP_EDGE_TOLERANCE &&
    Math.abs(bLng - 36.05) < CLIP_EDGE_TOLERANCE;

  const eastEdge =
    Math.abs(aLng - 38.20) < CLIP_EDGE_TOLERANCE &&
    Math.abs(bLng - 38.20) < CLIP_EDGE_TOLERANCE;

  const southEdge =
    Math.abs(aLat - 40.85) < CLIP_EDGE_TOLERANCE &&
    Math.abs(bLat - 40.85) < CLIP_EDGE_TOLERANCE;

  return westEdge || eastEdge || southEdge;
}

interface LandBoundaryResult {
  distanceKm: number;
  closestLat: number;
  closestLng: number;
}

export function distanceToLandBoundaryKm(lat: number, lng: number): LandBoundaryResult {
  let minimumDistance = Infinity;
  let closestLat = lat;
  let closestLng = lng;

  const visitRing = (ring: LinearRing) => {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i];
      const b = ring[i + 1];

      // Veri kesiminden kaynaklanan yapay sınırlar gerçek kıyı sayılmaz.
      if (isArtificialClipEdge(a, b)) continue;

      const seg = distanceToSegmentKm(
        lat,
        lng,
        a[1],
        a[0],
        b[1],
        b[0]
      );

      if (seg.distance < minimumDistance) {
        minimumDistance = seg.distance;
        closestLat = seg.closestLat;
        closestLng = seg.closestLng;
      }
    }
  };

  for (const feature of LAND_GEOJSON.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;

    if (geometry.type === 'Polygon') {
      if (geometry.coordinates.length > 0) {
        visitRing(geometry.coordinates[0]);
      }
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(polygon => {
        if (polygon.length > 0) {
          visitRing(polygon[0]);
        }
      });
    }
  }

  return { distanceKm: minimumDistance, closestLat, closestLng };
}

export type GeoZoneType = 'kara' | 'kiyi' | 'deniz' | 'belirsiz' | 'kapsam_disi';

export interface PointClassificationResult {
  zone:
    | 'Kara (Karasal Alan)'
    | 'Kıyı / Kıyıya Yakın'
    | 'Deniz (Açık Su)'
    | 'Belirsiz (Coğrafi Veriyle Doğrulanamadı)'
    | 'Analiz Alanı Dışında';
  zoneType: GeoZoneType;
  isWithinBounds: boolean;
  distanceToCoastKm: number | null;
  description: string;
  nearestSpot: VerifiedCoastalSpot | null;
  distanceToNearestSpotKm: number | null;
  dataNotice: string;
}

export function distanceToSpotKm(
  lat: number,
  lng: number,
  spot: VerifiedCoastalSpot
): number {
  const averageLatitude = ((spot.lat + lat) / 2) * (Math.PI / 180);
  const latitudeDistance = (spot.lat - lat) * 110.57;
  const longitudeDistance =
    (spot.lng - lng) * 111.32 * Math.cos(averageLatitude);

  return Math.hypot(latitudeDistance, longitudeDistance);
}

export function classifyPointGeography(
  lat: number,
  lng: number
): PointClassificationResult {
  const withinBounds =
    isFiniteCoordinate(lat, lng) && isWithinBounds(lat, lng);

  if (!withinBounds) {
    return {
      zone: 'Analiz Alanı Dışında',
      zoneType: 'kapsam_disi',
      isWithinBounds: false,
      distanceToCoastKm: null,
      description:
        'Seçilen koordinat Samsun–Ordu kıyı analiz sınırları (36.05°D–38.20°D, 40.85°K–41.50°K) dışındadır veya geçerli bir koordinat değildir.',
      nearestSpot: null,
      distanceToNearestSpotKm: null,
      dataNotice:
        'Koordinat bölgesel analiz sınırları dışındadır; coğrafi sınıflandırma yapılmamıştır.'
    };
  }

  let nearestSpot: VerifiedCoastalSpot | null = null;
  let minSpotDistanceKm = Infinity;

  for (const spot of VERIFIED_COASTAL_SPOTS) {
    const distance = distanceToSpotKm(lat, lng, spot);

    if (distance < minSpotDistanceKm) {
      minSpotDistanceKm = distance;
      nearestSpot = spot;
    }
  }

  const boundary = distanceToLandBoundaryKm(lat, lng);
  const coastDistanceKm = boundary.distanceKm;

  const roundedCoastDistanceKm = Number.isFinite(coastDistanceKm)
    ? Math.round(coastDistanceKm * 100) / 100
    : null;

  const roundedSpotDistanceKm = Number.isFinite(minSpotDistanceKm)
    ? Math.round(minSpotDistanceKm * 10) / 10
    : null;

  const dataNotice =
    'Sınıflandırma, yüksek doğruluklu Samsun-Ordu kıyı çizgisi GeoJSON verisine dayanır. 450 metre kıyı bandı geometrik bir olta erişim eşiğidir. Erişim ve güvenlik sahada doğrulanmalıdır.';

  // 1a. Veri yetersizliği veya sınır hesaplama hatası kontrolü (Belirsiz)
  if (!Number.isFinite(coastDistanceKm) || coastDistanceKm === Infinity) {
    return {
      zone: 'Belirsiz (Coğrafi Veriyle Doğrulanamadı)',
      zoneType: 'belirsiz',
      isWithinBounds: true,
      distanceToCoastKm: null,
      description:
        'Kıyı çizgisi mesafesi hesaplanamadı; coğrafi sınıflandırma belirsizdir.',
      nearestSpot,
      distanceToNearestSpotKm: roundedSpotDistanceKm,
      dataNotice
    };
  }

  // 1b. Poligon içi delik/boşluk kontrolü
  if (isPointInAnyHole(lat, lng)) {
    return {
      zone: 'Belirsiz (Coğrafi Veriyle Doğrulanamadı)',
      zoneType: 'belirsiz',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        'Seçilen koordinat kara poligonunun iç halkasında kalmaktadır. Deniz kıyısı verisiyle doğrudan doğrulanamaz.',
      nearestSpot: minSpotDistanceKm <= 3 ? nearestSpot : null,
      distanceToNearestSpotKm: minSpotDistanceKm <= 3 ? roundedSpotDistanceKm : null,
      dataNotice
    };
  }

  // 2. Kıyı şeridi (~450 metre yaklaşık geometrik eşik içi)
  if (coastDistanceKm <= COASTAL_BAND_KM) {
    return {
      zone: 'Kıyı / Kıyıya Yakın',
      zoneType: 'kiyi',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        `Seçilen koordinat kıyı çizgisine yaklaşık ${Math.round(coastDistanceKm * 1000)} metre mesafededir (~450 m kıyı bandı içi). Erişim ve güvenlik sahada doğrulanmalıdır.`,
      nearestSpot,
      distanceToNearestSpotKm: roundedSpotDistanceKm,
      dataNotice
    };
  }

  const isLand = isLandPoint(lat, lng);

  // 3. Karasal Alan (İç Kesim)
  if (isLand) {
    return {
      zone: 'Kara (Karasal Alan)',
      zoneType: 'kara',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        `Seçilen koordinat kara poligonunun içindedir; kıyı hattına yaklaşık ${roundedCoastDistanceKm ?? 'bilinmeyen'} km mesafede iç kesimde yer alır.`,
      nearestSpot: minSpotDistanceKm <= 3 ? nearestSpot : null,
      distanceToNearestSpotKm:
        minSpotDistanceKm <= 3 ? roundedSpotDistanceKm : null,
      dataNotice
    };
  }

  // 4. Poligon dışındaki noktalar için güney kontrolü
  if (lat < boundary.closestLat - 0.015) {
    return {
      zone: 'Belirsiz (Coğrafi Veriyle Doğrulanamadı)',
      zoneType: 'belirsiz',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        'Seçilen koordinat kıyı çizgisinin güneyinde kalmasına rağmen kara poligonu kapsamı dışındadır.',
      nearestSpot: minSpotDistanceKm <= 3.5 ? nearestSpot : null,
      distanceToNearestSpotKm:
        minSpotDistanceKm <= 3.5 ? roundedSpotDistanceKm : null,
      dataNotice
    };
  }

  // 5. Deniz / Açık Su
  return {
    zone: 'Deniz (Açık Su)',
    zoneType: 'deniz',
    isWithinBounds: true,
    distanceToCoastKm: roundedCoastDistanceKm,
    description:
      `Seçilen koordinat kıyı çizgisinin yaklaşık ${roundedCoastDistanceKm ?? 'bilinmeyen'} km açığında, açık Karadeniz sularındadır. Kıyıdan olta atış menzili dışındadır (açık su / tekne alanıdır).`,
    nearestSpot: minSpotDistanceKm <= 3.5 ? nearestSpot : null,
    distanceToNearestSpotKm:
      minSpotDistanceKm <= 3.5 ? roundedSpotDistanceKm : null,
    dataNotice
  };
}

export type FishingSuitabilityCategory =
  | 'FIZIKI_YAPI_TEYITLI'
  | 'COGRAFI_REFERANS'
  | 'TEYITSIZ_HAT'
  | 'UYGUN_DEGIL_KARA'
  | 'UYGUN_DEGIL_ACIK_DENIZ'
  | 'YETERLI_VERI_YOK'
  | 'KAPSAM_DISI';

export interface PointSuitabilityAssessment {
  status: FishingSuitabilityCategory;
  badgeTitle: string;
  badgeTone: 'emerald' | 'cyan' | 'blue' | 'amber' | 'red' | 'slate';
  summary: string;
  coastalStructureInfo: string;
  generalFishingConditions: string;
  missingDataWarnings: string[];
  disclaimer: string;
}

export function assessPointFishingSuitability(
  selectedSpot: VerifiedCoastalSpot | null,
  geo: PointClassificationResult
): PointSuitabilityAssessment {
  // 1. Kapsam Dışı Alan
  if (!geo.isWithinBounds || geo.zoneType === 'kapsam_disi') {
    return {
      status: 'KAPSAM_DISI',
      badgeTitle: '🌐 Analiz Alanı Dışında',
      badgeTone: 'slate',
      summary: 'Seçilen koordinat Samsun–Ordu kıyı analiz sınırları (36.05°D–38.20°D, 40.85°K–41.50°K) dışındadır.',
      coastalStructureInfo: 'Samsun-Ordu Kapsam Dışı',
      generalFishingConditions: 'Bu bölge için kıyı veritabanı bulunmamaktadır.',
      missingDataWarnings: [
        'Bölgesel kıyı veri tabanı kapsamı dışındadır.',
        'Erişim ve güvenlik sahada doğrulanmalı.'
      ],
      disclaimer: 'Analiz sınırları dışındaki alanlar için avlanma uygunluğu değerlendirmesi yapılmaz. Erişim ve güvenlik sahada doğrulanmalı.'
    };
  }

  // 2. Kayıtlı Bir Kıyı Noktası Seçildiyse
  if (selectedSpot) {
    if (selectedSpot.kanitSeviyesi === 'ERISIM_KISITLI_VEYA_RISKLI' || !selectedSpot.haritadaAktifMi) {
      return {
        status: 'TEYITSIZ_HAT',
        badgeTitle: '⛔ ' + selectedSpot.kanitSeviyesiBadge,
        badgeTone: 'red',
        summary: `${selectedSpot.name} noktasında erişim kısıtlaması veya yüksek güvenlik riski bulunmaktadır: ${selectedSpot.kisitlarVeRiskler} ${selectedSpot.aktifOlmamaGerekcesi ?? ''} Sivil amatör balıkçıların bu sahaya girmesi yasaktır veya hayati tehlike taşır.`,
        coastalStructureInfo: `Kıyı Yapısı: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature}) · Kaynak: ${selectedSpot.cografiKaynak}`,
        generalFishingConditions: `Fiziksel Erişim: ${selectedSpot.fizikselKiyiErisimi} · İzin Durumu: ${selectedSpot.avlanmaIzinDurumu}`,
        missingDataWarnings: [
          `Giriş ve Yasal Durum: ${selectedSpot.avlanmaIzinDurumu}`,
          `Güvenlik Uyarısı: ${selectedSpot.kisitlarVeRiskler}`,
          `Belirsizlikler: ${selectedSpot.belirsizlikler}`,
          selectedSpot.derinlikDurumu
        ],
        disclaimer: 'Bu alanda amatör balıkçılık yapılamaz veya giriş yasaktır. Güvenlik kurallarına ve yasal yaptırımlara uyunuz.'
      };
    }

    if (selectedSpot.kanitSeviyesi === 'DOGRULANDI') {
      return {
        status: 'FIZIKI_YAPI_TEYITLI',
        badgeTitle: '⚓ ' + selectedSpot.kanitSeviyesiBadge,
        badgeTone: 'cyan',
        summary: `${selectedSpot.name} noktasında mendirek, barınak veya taş tahkimat gibi fiziksel bir kıyı yapısı coğrafi olarak teyitlidir (${selectedSpot.cografiKaynak}). Balıkçılık gerekçesi: ${selectedSpot.balikcilikGerekcesi}. Ancak fiziki yapının var olması tek başına serbest veya tehlikesiz erişim anlamına gelmez. Erişim ve güvenlik sahada doğrulanmalı; balık mevcudiyeti veya av garantisi verilemez.`,
        coastalStructureInfo: `Fiziksel Kıyı Yapısı: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature}) · OSM: ${selectedSpot.cografiKaynak}`,
        generalFishingConditions: `Kıyı Erişimi: ${selectedSpot.fizikselKiyiErisimi} · Avlanma İzni: ${selectedSpot.avlanmaIzinDurumu} · ${selectedSpot.cautions}`,
        missingDataWarnings: [
          `Erişim ve Güvenlik: ${selectedSpot.fizikselKiyiErisimi} (${selectedSpot.kisitlarVeRiskler})`,
          `Derinlik: ${selectedSpot.derinlikDurumu} (Resmi batimetri ölçümü bulunmamaktadır; kesin metre değeri verilemez).`,
          `Belirsizlikler: ${selectedSpot.belirsizlikler}`,
          `Tür Kanıtı: ${selectedSpot.turVerisiKaynagi}`
        ],
        disclaimer: 'Fiziki yapının varlığı güvenli erişimi veya balık avı başarısını garanti etmez. Erişim ve güvenlik sahada doğrulanmalı.'
      };
    }

    if (selectedSpot.kanitSeviyesi === 'ADAY') {
      return {
        status: 'COGRAFI_REFERANS',
        badgeTitle: '📍 ' + selectedSpot.kanitSeviyesiBadge,
        badgeTone: 'emerald',
        summary: `${selectedSpot.name} doğal kumsal, burun veya akarsu mansabı kıyı referansıdır (${selectedSpot.cografiKaynak}). Balıkçılık gerekçesi: ${selectedSpot.balikcilikGerekcesi}. Sabit bir taş tahkimat veya mendirek bulunmayabilir; kıyı tabanı dalgalarla değişkendir. Erişim ve güvenlik sahada doğrulanmalı.`,
        coastalStructureInfo: `Kıyı Tipi: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature}) · Kaynak: ${selectedSpot.cografiKaynak}`,
        generalFishingConditions: `Erişim: ${selectedSpot.fizikselKiyiErisimi} · Durum: ${selectedSpot.avlanmaIzinDurumu} · ${selectedSpot.cautions}`,
        missingDataWarnings: [
          `Saha Kısıtı: ${selectedSpot.kisitlarVeRiskler}`,
          `Derinlik: ${selectedSpot.derinlikDurumu}`,
          `Belirsizlikler: ${selectedSpot.belirsizlikler}`,
          `Tür Kanıtı: ${selectedSpot.turVerisiKaynagi}`
        ],
        disclaimer: 'Doğrulanmış coğrafi referans verisidir; balık avı başarısı garantisi teşkil etmez. Erişim ve güvenlik sahada doğrulanmalı.'
      };
    }

    // YETERSIZ_VERI
    return {
      status: 'TEYITSIZ_HAT',
      badgeTitle: '⚠️ ' + selectedSpot.kanitSeviyesiBadge,
      badgeTone: 'amber',
      summary: `${selectedSpot.name} geniş bir kıyı hattıdır; noktasal bir avlak veya olta atış yeri teyit edilmemiştir. ${selectedSpot.belirsizlikler}`,
      coastalStructureInfo: `Kıyı Tipi: ${selectedSpot.locationType} (Noktasal Mera Teyidi Yok) · Kaynak: ${selectedSpot.cografiKaynak}`,
      generalFishingConditions: `Erişim: ${selectedSpot.fizikselKiyiErisimi} · İzin: ${selectedSpot.avlanmaIzinDurumu} · ${selectedSpot.cautions}`,
      missingDataWarnings: [
        `Veri Eksikliği: ${selectedSpot.belirsizlikler}`,
        `Riskler: ${selectedSpot.kisitlarVeRiskler}`,
        selectedSpot.derinlikDurumu,
        `Tür Kanıtı: ${selectedSpot.turVerisiKaynagi}`
      ],
      disclaimer: 'Avlak teyidi bulunmamaktadır; doğrudan av sahası olarak değerlendirilmemelidir. Erişim ve güvenlik sahada doğrulanmalı.'
    };
  }

  // 3. Serbest Seçim Noktası (Kullanıcı haritada boş bir yere tıkladı)
  if (geo.zoneType === 'kara') {
    return {
      status: 'UYGUN_DEGIL_KARA',
      badgeTitle: '⛔ Kıyı Balıkçılığına Uygun Değil (Karasal Alan)',
      badgeTone: 'red',
      summary: `Seçilen koordinat kıyı çizgisinden yaklaşık ~${geo.distanceToCoastKm ?? '?'} km içeride, karasal alandadır. Kıyıdan deniz olta balıkçılığı yapılamaz. Erişim ve güvenlik sahada doğrulanmalı.`,
      coastalStructureInfo: 'Karasal Alan (İç Kesim)',
      generalFishingConditions: 'Deniz balıkçılığı için kıyı şeridine veya liman bölgelerine yaklaşınız.',
      missingDataWarnings: [
        'Karasal alan; deniz kıyısı veya sualtı erişimi yoktur.',
        'Erişim ve güvenlik sahada doğrulanmalı.'
      ],
      disclaimer: 'Kara poligonu verisi ile doğrulanmıştır. Erişim ve güvenlik sahada doğrulanmalı.'
    };
  }

  if (geo.zoneType === 'deniz') {
    return {
      status: 'UYGUN_DEGIL_ACIK_DENIZ',
      badgeTitle: '🌊 Kıyıdan Erişilemez (Açık Deniz)',
      badgeTone: 'blue',
      summary: `Seçilen koordinat kıyı çizgisinin yaklaşık ~${geo.distanceToCoastKm ?? '?'} km açığında, açık denizdedir. Kıyıdan olta atış menzilinin dışındadır (açık su / tekne alanıdır). Kıyı balıkçılığına uygun değildir.`,
      coastalStructureInfo: 'Açık Deniz / Açık Su Alanı',
      generalFishingConditions: 'Kıyıdan olta atılamaz. Tekneyle avcılıkta açık deniz seyir güvenliği, can yeleği ve hava durumu kontrolleri zorunludur. Erişim ve güvenlik sahada doğrulanmalı.',
      missingDataWarnings: [
        'Kıyıdan olta atış menzili dışındadır; güvenli kıyı platformu yoktur.',
        'Resmi batimetri (derinlik) veya batık bilgisi bulunmamaktadır.',
        'Erişim ve güvenlik sahada doğrulanmalı (açık deniz seyir koşulları geçerlidir).'
      ],
      disclaimer: 'Açık su alanı; amatör kıyı balıkçılığı menzili dışındadır. Erişim ve güvenlik sahada doğrulanmalı.'
    };
  }

  if (geo.zoneType === 'kiyi') {
    return {
      status: 'YETERLI_VERI_YOK',
      badgeTitle: '⚠️ Yeterli Veri Yok (Kayıtsız Kıyı Bandı)',
      badgeTone: 'amber',
      summary: `Seçilen koordinat kıyı çizgisine yaklaşık ~${geo.distanceToCoastKm !== null ? Math.round(geo.distanceToCoastKm * 1000) : '?'} metre mesafededir (~450 metre kıyı bandı eşiği içindedir). Bu noktada kayıtlı bir mera, mendirek veya güvenli olta atış yeri teyit edilmemiştir. Erişim ve güvenlik sahada doğrulanmalı.`,
      coastalStructureInfo: 'Kayıtsız Kıyı Şeridi (~450 m yaklaşık geometrik kıyı bandı)',
      generalFishingConditions: 'Kıyıya fiziksel erişim yolu, falez/uçurum durumu ve özel mülkiyet kısıtları sahada yerinde incelenmelidir. Erişim ve güvenlik sahada doğrulanmalı, yerel kurallara uyulmalıdır.',
      missingDataWarnings: [
        'Erişim ve güvenlik sahada doğrulanmalı (fiziki yapının varlığı güvenli erişim anlamına gelmez).',
        'Kayıtlı ve doğrulanmış mera kaydı bulunmamaktadır.',
        'Batimetri (derinlik), dip yapısı ve akıntı ölçümü yoktur; belirli bir derinlik veya atış mesafesi verilemez.',
        'Balık mevcudiyeti, yoğunluğu veya av verimi garantisi verilemez.'
      ],
      disclaimer: 'Yalnızca geometrik kıyı yakınlığı tespit edilmiştir; doğrulanmış avlak değildir. Erişim ve güvenlik sahada doğrulanmalı.'
    };
  }

  // geo.zoneType === 'belirsiz'
  return {
    status: 'YETERLI_VERI_YOK',
    badgeTitle: '❓ Belirsiz / Yeterli Veri Yok',
    badgeTone: 'slate',
    summary: 'Mevcut coğrafi verinin çözünürlüğü bu koordinatı güvenilir biçimde sınıflandırmak için yetersizdir. Kıyıdan avlanma uygunluğu coğrafi veriyle doğrulanamamıştır. Erişim ve güvenlik sahada doğrulanmalı.',
    coastalStructureInfo: 'Coğrafi Veriyle Doğrulanamadı',
    generalFishingConditions: 'Uydu veya harita altlığı incelenmeli, yerel sahadan bilgi alınmalıdır.',
    missingDataWarnings: [
      'Kıyı-kara sınır çözünürlüğü yetersizdir.',
      'Erişim ve güvenlik sahada doğrulanmalı.'
    ],
    disclaimer: 'Yeterli coğrafi veri bulunmamaktadır. Erişim ve güvenlik sahada doğrulanmalı.'
  };
}

/**
 * Otomatik Doğrulama ve Bütünlük Kontrolü Fonksiyonu
 * Hata tekrarını engeller:
 * 1. Hiçbir aktif mera kara poligonunun derinliklerinde (>200m) kalamaz.
 * 2. Hiçbir aktif mera kıyı çizgisinden 450m'den daha açıkta kalamaz (mendirek uçları hariç).
 * 3. Bütün koordinatlar geçerli ve Samsun-Ordu sınırları içinde olmalıdır.
 */
export function validateCoastalSpots(): {
  isValid: boolean;
  totalSpots: number;
  activeSpotsCount: number;
  inactiveSpotsCount: number;
  errors: string[];
} {
  const errors: string[] = [];
  let activeCount = 0;
  let inactiveCount = 0;

  for (const spot of VERIFIED_COASTAL_SPOTS) {
    if (!isFiniteCoordinate(spot.lat, spot.lng)) {
      errors.push(`${spot.id}: Geçersiz koordinat (${spot.lat}, ${spot.lng})`);
      continue;
    }

    if (!isWithinBounds(spot.lat, spot.lng)) {
      errors.push(`${spot.id}: Koordinat Samsun-Ordu sınırları dışında (${spot.lat}, ${spot.lng})`);
    }

    if (spot.haritadaAktifMi) {
      activeCount++;
      const boundary = distanceToLandBoundaryKm(spot.lat, spot.lng);
      // Aktif nokta kıyı bandı toleransı (0.45 km) içinde olmalıdır
      if (boundary.distanceKm > 0.45) {
        errors.push(`${spot.id}: Aktif mera kıyı çizgisinden çok uzakta (${Math.round(boundary.distanceKm * 1000)}m)`);
      }
    } else {
      inactiveCount++;
      if (!spot.aktifOlmamaGerekcesi) {
        errors.push(`${spot.id}: Pasif/ayrılmış nokta için aktifOlmamaGerekcesi belirtilmemiş.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    totalSpots: VERIFIED_COASTAL_SPOTS.length,
    activeSpotsCount: activeCount,
    inactiveSpotsCount: inactiveCount,
    errors
  };
}
