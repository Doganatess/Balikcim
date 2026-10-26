const queries = [
  'Dereköy Balıkçı Barınağı Samsun',
  'Çobanlı İskelesi Atakum Samsun',
  'Batıpark Balıkçı Barınağı Samsun',
  'Samsun Limanı mendirek',
  'Mert Irmağı Samsun',
  'Canik Balıkçı Barınağı Samsun',
  'Terme Balıkçı Barınağı Samsun',
  'Miliç Kumsalı Terme Samsun',
  'Ünye İskelesi Ordu',
  'Ünye Çamlık Ordu',
  'Ünye Limanı Ordu',
  'Fatsa Balıkçı Barınağı Ordu',
  'Bolaman Feneri Ordu',
  'Yason Burnu Ordu',
  'Çamburnu Feneri Perşembe Ordu',
  'Vona Limanı Perşembe Ordu',
  'Perşembe Balıkçı Barınağı Ordu',
  'Efirli Ordu',
  'Ordu Limanı Altınordu',
  'Ordu İskelesi Altınordu',
  'Melet Irmağı Ordu',
  'Gülyalı Balıkçı Barınağı Ordu',
  'Ordu-Giresun Havalimanı'
];

async function main() {
  for (const q of queries) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=3`, {
        headers: { 'User-Agent': 'BalikcimApp-GeoAudit/1.0 (contact: info@balikcim.local)' }
      });
      const data = await res.json();
      console.log(`\n=== QUERY: ${q} ===`);
      if (Array.isArray(data) && data.length > 0) {
        for (const item of data) {
          console.log(`  Name: ${item.display_name}`);
          console.log(`  Type: ${item.class}/${item.type} | OSM: ${item.osm_type}/${item.osm_id}`);
          console.log(`  Coords: lat=${item.lat}, lng=${item.lon}`);
        }
      } else {
        console.log('  No results found.');
      }
      // Be polite to Nominatim rate limit
      await new Promise(resolve => setTimeout(resolve, 1100));
    } catch (e: any) {
      console.error(`Error querying ${q}:`, e.message);
    }
  }
}

main();
