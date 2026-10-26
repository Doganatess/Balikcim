import { SAMSUN_ORDU_COASTLINE_POINTS } from './coastline_data.js';

// Assemble complete land polygon (exterior ring)
const landPolygonRing: [number, number][] = [
  ...SAMSUN_ORDU_COASTLINE_POINTS,
  [38.2000, 40.8500], // South-east land corner
  [36.0500, 40.8500], // South-west land corner
  [36.0500, 41.4850]  // Back to start (closed loop)
];

function pointInRing(lat: number, lng: number, ring: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]; // xi = lng, yi = lat
    const [xj, yj] = ring[j]; // xj = lng, yj = lat

    const intersects =
      (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersects) inside = !inside;
  }
  return inside;
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
    : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / segmentLengthSquared));

  const closestLat = aLat + t * (bLat - aLat);
  const closestLng = aLng + t * (bLng - aLng);
  const distance = Math.hypot(px - (ax + t * dx), py - (ay + t * dy));

  return { distance, closestLat, closestLng };
}

function distanceToCoastKm(lat: number, lng: number): { distanceKm: number; closestLat: number; closestLng: number } {
  let min = Infinity;
  let closestLat = lat;
  let closestLng = lng;
  for (let i = 0; i < SAMSUN_ORDU_COASTLINE_POINTS.length - 1; i++) {
    const a = SAMSUN_ORDU_COASTLINE_POINTS[i];
    const b = SAMSUN_ORDU_COASTLINE_POINTS[i + 1];
    const res = distanceToSegmentKm(lat, lng, a[1], a[0], b[1], b[0]);
    if (res.distance < min) {
      min = res.distance;
      closestLat = res.closestLat;
      closestLng = res.closestLng;
    }
  }
  return { distanceKm: min, closestLat, closestLng };
}

// Check real spots
const spots = [
  { id: 'samsun-derekoy-barinak', name: 'Dereköy Balıkçı Barınağı Mendireği', lat: 41.4725, lng: 36.1121 },
  { id: 'samsun-taflan-kumsal', name: 'Taflan Yalı Kumsalı', lat: 41.4462, lng: 36.1511 },
  { id: 'samsun-kurupelit-marina', name: 'Kurupelit Yat Limanı Mendireği', lat: 41.3701, lng: 36.2311 },
  { id: 'samsun-cobanli-iskele', name: 'Atakum Çobanlı Sahil İskelesi', lat: 41.3444, lng: 36.2618 },
  { id: 'samsun-batipark-barinak', name: 'Samsun Batıpark Balıkçı Barınağı Mendireği', lat: 41.3250, lng: 36.2754 },
  { id: 'samsun-limani-kuzey-mendirek', name: 'Samsun Limanı Ana Dış Mendireği', lat: 41.3095, lng: 36.3560, isRestricted: true },
  { id: 'samsun-mert-irmagi-mansap', name: 'Samsun Mert Irmağı Mansabı', lat: 41.2830, lng: 36.3520 },
  { id: 'samsun-canik-barinak', name: 'Canik Balıkçı Barınağı Mendireği', lat: 41.2562, lng: 36.3956 },
  { id: 'samsun-gelemen-sahil', name: 'Tekkeköy Gelemen Sahil Bandı', lat: 41.2460, lng: 36.4325 },
  { id: 'samsun-carsamba-yesilirmak', name: 'Çarşamba Yeşilırmak Deltası Mansabı', lat: 41.3798, lng: 36.6603 },
  { id: 'samsun-carsamba-hurriyet', name: 'Çarşamba Hürriyet Fener Sahili', lat: 41.3660, lng: 36.6710 },
  { id: 'samsun-terme-barinak', name: 'Terme Balıkçı Barınağı Mendireği', lat: 41.1982, lng: 37.0279 },
  { id: 'samsun-terme-milic', name: 'Terme Miliç Sahil Kumsalı', lat: 41.1710, lng: 37.0775 },
  { id: 'ordu-unye-akcay-mansap', name: 'Akçay Deresi Mansabı (Samsun–Ordu Sınırı)', lat: 41.1470, lng: 37.1355 },
  { id: 'ordu-unye-golevi-kumsal', name: 'Ünye Gölevi Sahili', lat: 41.1450, lng: 37.2650 },
  { id: 'ordu-unye-camlik-kayalik', name: 'Ünye Çamlık Doğal Kayalık Burnu', lat: 41.1445, lng: 37.2917 },
  { id: 'ordu-unye-tarihi-iskele', name: 'Ünye Tarihi Sahil İskelesi', lat: 41.1278, lng: 37.2872 },
  { id: 'unye-liman-mendirek', name: 'Ünye Limanı Ana Dış Mendireği', lat: 41.1385, lng: 37.3195 },
  { id: 'ordu-unye-cevizdere-mansap', name: 'Ünye Cevizdere Mansabı', lat: 41.1235, lng: 37.3225 },
  { id: 'ordu-fatsa-dolunay-camlik', name: 'Fatsa Dolunay Çamlık Koyu Falezleri', lat: 41.0430, lng: 37.5050 },
  { id: 'ordu-fatsa-barinak-mendirek', name: 'Fatsa Balıkçı Barınağı Mendireği', lat: 41.0290, lng: 37.4965 },
  { id: 'ordu-fatsa-bolaman-feneri', name: 'Bolaman Burnu & Fener Kayalıkları', lat: 41.0425, lng: 37.5865 },
  { id: 'persembe-yason', name: 'Perşembe Yason Burnu & Feneri', lat: 41.1292, lng: 37.6797 },
  { id: 'persembe-camburnu', name: 'Perşembe Çamburnu (Vona Feneri) Falezleri', lat: 41.1158, lng: 37.7862 },
  { id: 'persembe-vona-barinak', name: 'Perşembe Vona Balıkçı Barınağı', lat: 41.0660, lng: 37.7725 },
  { id: 'ordu-efirli-koyu', name: 'Altınordu Efirli Koyu Sahili', lat: 41.0342, lng: 37.8262 },
  { id: 'ordu-altinordu-rihtim', name: 'Altınordu Rıhtım & Taşbaşı Kıyı Dolgusu', lat: 40.9955, lng: 37.8760 },
  { id: 'ordu-melet-irmagi', name: 'Altınordu Melet Irmağı Mansabı', lat: 40.9847, lng: 37.9339 },
  { id: 'ordu-gulyali-barinak', name: 'Gülyalı Balıkçı Barınağı Mendireği', lat: 40.9750, lng: 38.0055 },
  { id: 'ordu-gulyali-havalimani-tahkimat', name: 'Ordu-Giresun Havalimanı Deniz Tahkimatı', lat: 40.9670, lng: 38.0880, isRestricted: true }
];

console.log('Testing all 30 spots with refined coastline:');
for (const s of spots) {
  const inLand = pointInRing(s.lat, s.lng, landPolygonRing);
  const { distanceKm } = distanceToCoastKm(s.lat, s.lng);
  const m = Math.round(distanceKm * 1000);
  console.log(`[${s.id}] ${s.name}:`);
  console.log(`   isLand: ${inLand} | Dist to coast: ${m} m`);
}
