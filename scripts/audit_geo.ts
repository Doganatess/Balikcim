import fs from 'fs';
import path from 'path';

// Read samsunOrduLand.geojson
const geojsonPath = path.resolve('src/data/samsunOrduLand.geojson');
const landGeoJson = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));

type Position = [number, number]; // [lng, lat]
type LinearRing = Position[];

function pointInRing(lat: number, lng: number, ring: LinearRing): boolean {
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

function isLandPoint(lat: number, lng: number): boolean {
  for (const feature of landGeoJson.features) {
    const geometry = feature.geometry;
    if (!geometry) continue;
    if (geometry.type === 'Polygon') {
      if (geometry.coordinates.length > 0 && pointInRing(lat, lng, geometry.coordinates[0])) {
        let inHole = false;
        for (let i = 1; i < geometry.coordinates.length; i++) {
          if (pointInRing(lat, lng, geometry.coordinates[i])) {
            inHole = true;
            break;
          }
        }
        if (!inHole) return true;
      }
    }
  }
  return false;
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

function distanceToCoast(lat: number, lng: number): { distanceKm: number; closestLat: number; closestLng: number } {
  let min = Infinity;
  let closestLat = lat;
  let closestLng = lng;
  for (const feature of landGeoJson.features) {
    const ring = feature.geometry.coordinates[0];
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i];
      const b = ring[i + 1];
      // Skip artificial borders
      const isClip = (Math.abs(a[0] - 36.05) < 0.001 && Math.abs(b[0] - 36.05) < 0.001) ||
                     (Math.abs(a[0] - 38.20) < 0.001 && Math.abs(b[0] - 38.20) < 0.001) ||
                     (Math.abs(a[1] - 40.85) < 0.001 && Math.abs(b[1] - 40.85) < 0.001) ||
                     (Math.abs(a[1] - 41.50) < 0.001 && Math.abs(b[1] - 41.50) < 0.001);
      if (isClip) continue;

      const res = distanceToSegmentKm(lat, lng, a[1], a[0], b[1], b[0]);
      if (res.distance < min) {
        min = res.distance;
        closestLat = res.closestLat;
        closestLng = res.closestLng;
      }
    }
  }
  return { distanceKm: min, closestLat, closestLng };
}

// Parse spots from src/data/samsunOrduMapData.ts text directly
const mapDataContent = fs.readFileSync('src/data/samsunOrduMapData.ts', 'utf-8');
const spotMatches = [...mapDataContent.matchAll(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*il:\s*'([^']+)',\s*ilce:\s*'([^']+)',\s*lat:\s*([0-9.]+),\s*lng:\s*([0-9.]+),/g)];

console.log(`Found ${spotMatches.length} spots in samsunOrduMapData.ts`);

const spots = spotMatches.map(m => ({
  id: m[1],
  name: m[2],
  il: m[3],
  ilce: m[4],
  lat: parseFloat(m[5]),
  lng: parseFloat(m[6])
}));

console.log('\n--- AUDITING ALL 30 SPOTS AGAINST LAND GEOJSON & BOUNDARY ---');
const landInsideSpots: any[] = [];
const farFromCoastSpots: any[] = [];

for (const s of spots) {
  const inLand = isLandPoint(s.lat, s.lng);
  const boundary = distanceToCoast(s.lat, s.lng);
  const distM = Math.round(boundary.distanceKm * 1000);

  // Samsun-Ordu coast is north facing: sea is north (higher lat), land is south (lower lat).
  // If point is south of boundary.closestLat by more than ~200m and inLand -> deep inland!
  const isDeepInland = inLand && (s.lat < boundary.closestLat - 0.002);
  const isFarOutSea = !inLand && distM > 1000;

  if (isDeepInland) landInsideSpots.push({ ...s, distM, boundary });
  if (isFarOutSea) farFromCoastSpots.push({ ...s, distM, boundary });

  console.log(`[${s.id}] ${s.name}:`);
  console.log(`   Coord: (${s.lat.toFixed(4)}, ${s.lng.toFixed(4)})`);
  console.log(`   isLandPoint: ${inLand} | Dist to Coast: ${distM} m | Closest Coast: (${boundary.closestLat.toFixed(4)}, ${boundary.closestLng.toFixed(4)})`);
  if (isDeepInland) console.log(`   ⚠️ WARNING: POINT IS INLAND!`);
  if (isFarOutSea) console.log(`   🌊 WARNING: POINT IS FAR OUT AT SEA!`);
}

console.log('\n================ RESULT SUMMARY ================');
console.log(`Inland spots count: ${landInsideSpots.length}`);
landInsideSpots.forEach(s => console.log(` - ${s.name} (${s.id}): ${s.distM}m inland`));

console.log(`Far out sea spots count: ${farFromCoastSpots.length}`);
farFromCoastSpots.forEach(s => console.log(` - ${s.name} (${s.id}): ${s.distM}m in sea`));
