/**
 * Balıkcım — Kıyı Çizgisi, Fiziksel Erişim ve Altyapı Servisi
 * 
 * Veri Kaynakları ve Şeffaflık:
 * 1. OpenStreetMap (OSM) Kıyı Nesneleri:
 *    - man_made=breakwater (Mendirek / Taş Tahkimat)
 *    - man_made=pier / groyne (İskele / Mahmuz)
 *    - harbour=yes / leisure=slipway (Liman / Tekne İndirme Yeri)
 *    - highway=footway / path / service (Kıyı Yaya Yolu / Patika)
 *    - barrier=* (Çit, tel örgü, güvenlik kapısı engelleri)
 * 2. Kıyı Emniyeti ve Mevzuat:
 *    - Limanlar Yönetmeliği (Ulaştırma ve Altyapı Bakanlığı)
 *    - Kıyı Koruma ve Tetrapot Güvenlik İlkeleri
 * 
 * Kritik İlke:
 * - Bir yapının haritada görünmesi (örn. mendirek hattı) ASLA kamuya açık veya güvenli olta sahası olduğunu kanıtlamaz.
 * - Tetrapotlar, ıslak anroşman taşları, askeri/özel liman sahaları ve falez inişleri sahada bizzat kontrol edilmelidir.
 */

export interface CoastalFeature {
  id: string;
  osmId: string;
  name: string;
  type: 'mendirek' | 'iskele' | 'liman_ici' | 'balikci_barinagi' | 'kayalik_burun' | 'kumsal_sahil' | 'dere_agzi';
  typeLabel: string;
  lat: number;
  lng: number;
  distanceKm: number;
  hasPhysicalAccessPath: boolean;
  accessStatus: 'Kamuya Açık Sahil Yolu' | 'Taş Tahkimat / Riskli Zemin' | 'Liman İdari Alanı (İzin/Kısıtlı)' | 'Belirsiz / Yol Teyitsiz';
  safetyCaveats: string[];
  legalNotice: string;
  osmUrl: string;
}

export interface CoastalAccessAssessment {
  queryLat: number;
  queryLng: number;
  distanceToCoastKm: number | null;
  nearestFeature: CoastalFeature | null;
  nearestFeatureDistanceMeters: number | null;
  accessCategory: 'Doğrulanmış Kıyı Yolu Mevcut' | 'Taş Tahkimat / Dikkatli Geçiş' | 'Liman / Kısıtlı Bölge Olasılığı' | 'Doğal Kıyı (Patika / Yol Teyitsiz)' | 'Karasal Alan' | 'Açık Deniz';
  accessSummary: string;
  groundSafetyWarning: string;
  legalRegulationNote: string;
  osmSourceInfo: {
    source: string;
    license: string;
    url: string;
    verificationDate: string;
    limitations: string[];
  };
}

/**
 * Samsun ve Ordu kıyılarında OpenStreetMap üzerinde teyitli temel kıyı altyapı referansları
 * (Bölgesel altyapı analiz ağı)
 */
export const VERIFIED_COASTAL_INFRASTRUCTURE: Omit<CoastalFeature, 'distanceKm'>[] = [
  // SAMSUN BÖLGESİ ALTYAPI NOKTALARI
  {
    id: 'osm_samsun_ana_mendirek',
    osmId: 'way/26939987',
    name: 'Samsun Limanı Kuzey Mendireği',
    type: 'mendirek',
    typeLabel: 'Liman Mendireği / Taş Tahkimat',
    lat: 41.3125,
    lng: 36.3530,
    hasPhysicalAccessPath: true,
    accessStatus: 'Liman İdari Alanı (İzin/Kısıtlı)',
    safetyCaveats: [
      'Gemi manevra sahası ve gümrüklü liman sahası yakınıdır; giriş kapısında güvenlik kontrolü bulunabilir.',
      'Dış mendirek blokları yüksek dalga çarpması ve yosunlu kaygan taş riski taşır.'
    ],
    legalNotice: 'Limanlar Yönetmeliği uyarınca ticari rıhtımlarda ve kılavuzluk sahalarında amatör avcılık kısıtlanabilir.',
    osmUrl: 'https://www.openstreetmap.org/way/26939987'
  },
  {
    id: 'osm_baruthane_bati_park',
    osmId: 'way/182583271',
    name: 'Baruthane Batı Park Sahil Tahkimatı',
    type: 'iskele',
    typeLabel: 'Sahil Parkı Yaya Bandı & Mahmuz',
    lat: 41.3262,
    lng: 36.3265,
    hasPhysicalAccessPath: true,
    accessStatus: 'Kamuya Açık Sahil Yolu',
    safetyCaveats: [
      'Belediye yaya sahil bandından kolay erişim mevcuttur.',
      'Suya inen basamaklarda ve kayalıklarda kayganlık riski vardır.'
    ],
    legalNotice: 'Amatör kıyı olta balıkçılığına genel olarak açıktır; park kurallarına uyulmalıdır.',
    osmUrl: 'https://www.openstreetmap.org/way/182583271'
  },
  {
    id: 'osm_atakent_iskele',
    osmId: 'node/4388192301',
    name: 'Atakum Atakent Kıyı İskelesi & Mahmuzları',
    type: 'iskele',
    typeLabel: 'Ahşap/Beton Gezinti İskelesi & Mahmuz',
    lat: 41.3485,
    lng: 36.2730,
    hasPhysicalAccessPath: true,
    accessStatus: 'Kamuya Açık Sahil Yolu',
    safetyCaveats: [
      'Yaya iskelesi üzerinde yürüyüşçüler ve oltacılar için ortak alan; atış yaparken çevre güvenliğine dikkat edilmelidir.',
      'Fırtınalı havalarda iskele üzerinden aşan dalga riski mevcuttur.'
    ],
    legalNotice: 'Yaz sezonunda yüzme alanları sınırları içinde olta atışı yerel zabıta tarafından kısıtlanabilir.',
    osmUrl: 'https://www.openstreetmap.org/node/4388192301'
  },
  {
    id: 'osm_kurupelit_yat_limani',
    osmId: 'way/225381902',
    name: 'Kurupelit Yat Limanı Mendireği',
    type: 'balikci_barinagi',
    typeLabel: 'Yat Limanı / Balıkçı Barınağı Mendireği',
    lat: 41.3695,
    lng: 36.2360,
    hasPhysicalAccessPath: true,
    accessStatus: 'Taş Tahkimat / Riskli Zemin',
    safetyCaveats: [
      'Mendirek dış cephesindeki tetrapot bloklar derin boşluklar barındırır; adım atarken düşme tehlikesi yüksektir.',
      'Gece aydınlatması yetersizdir; kafa lambası ve kaymaz tabanlı ayakkabı zorunludur.'
    ],
    legalNotice: 'Tekne giriş-çıkış kanalına doğru olta atılması deniz trafiğini tehlikeye soktuğu için yasaktır.',
    osmUrl: 'https://www.openstreetmap.org/way/225381902'
  },
  {
    id: 'osm_terme_balikci_barinagi',
    osmId: 'way/312093845',
    name: 'Terme Balıkçı Barınağı Mendireği',
    type: 'balikci_barinagi',
    typeLabel: 'Balıkçı Barınağı Mendirek Başı',
    lat: 41.2050,
    lng: 37.0320,
    hasPhysicalAccessPath: true,
    accessStatus: 'Taş Tahkimat / Riskli Zemin',
    safetyCaveats: [
      'Dere ağzı ve alüvyon birikintisi nedeniyle sığlaşma ve değişken akıntı görülür.',
      'Barınak mendirek ucu fırtınada dalga aşmasına açıktır.'
    ],
    legalNotice: 'Su Ürünleri Kooperatifi çalışma sahalarında ağ donanımlarına zarar vermeyecek mesafeden avlanılmalıdır.',
    osmUrl: 'https://www.openstreetmap.org/way/312093845'
  },

  // ORDU BÖLGESİ ALTYAPI NOKTALARI
  {
    id: 'osm_unye_liman_mendirek',
    osmId: 'way/178923049',
    name: 'Ünye Limanı Ana Mendireği',
    type: 'mendirek',
    typeLabel: 'Derin Su Liman Mendireği',
    lat: 41.1350,
    lng: 37.2885,
    hasPhysicalAccessPath: true,
    accessStatus: 'Taş Tahkimat / Riskli Zemin',
    safetyCaveats: [
      'Geniş anroşman taş tahkimatı üzerinde yürümek denge gerektirir; tetrapot aralıkları tehlikelidir.',
      'Karadeniz açık dalgasına doğrudan maruz kalır; 1 metreyi aşan dalgalarda mendirek üzerine çıkılmamalıdır.'
    ],
    legalNotice: 'Liman idaresi ve Sahil Güvenlik talimatlarına uyulmalıdır.',
    osmUrl: 'https://www.openstreetmap.org/way/178923049'
  },
  {
    id: 'osm_fatsa_balikci_barinagi',
    osmId: 'way/156782390',
    name: 'Fatsa Balıkçı Barınağı Mendireği',
    type: 'balikci_barinagi',
    typeLabel: 'Barınak Dış Mendirek Hattı',
    lat: 41.0360,
    lng: 37.5020,
    hasPhysicalAccessPath: true,
    accessStatus: 'Taş Tahkimat / Riskli Zemin',
    safetyCaveats: [
      'Mendirek dış taşları kaygan ve yosunludur.',
      'Şehir merkezinden araçla ulaşım kolaydır ancak mendirek üzerinde yürüyüş dikkat gerektirir.'
    ],
    legalNotice: 'Barınak içi teknelerin manevra alanlarına olta atılması yasaktır.',
    osmUrl: 'https://www.openstreetmap.org/way/156782390'
  },
  {
    id: 'osm_yason_burnu_patika',
    osmId: 'way/204918239',
    name: 'Yason Burnu Tarihi Fener & Kayalık Hat',
    type: 'kayalik_burun',
    typeLabel: 'Doğal Kayalık Burun & Yaya Patikası',
    lat: 41.1295,
    lng: 37.6795,
    hasPhysicalAccessPath: true,
    accessStatus: 'Kamuya Açık Sahil Yolu',
    safetyCaveats: [
      'Doğal andezit kayalık burun; kuvvetli Karadeniz soluganlarında kayalara aniden su basabilir.',
      'Tarihi ve arkeolojik sit alanı çevresidir; çevre temizliğine azami özen gösterilmelidir.'
    ],
    legalNotice: 'Amatör olta balıkçılığına uygundur; sit alanı yapısına zarar verici montaj/sabitleme yapılamaz.',
    osmUrl: 'https://www.openstreetmap.org/way/204918239'
  },
  {
    id: 'osm_ordu_rihtim_kordon',
    osmId: 'way/189230198',
    name: 'Ordu Altınordu Sahil Kordonu & Taş Tahkimat',
    type: 'iskele',
    typeLabel: 'Kentsel Sahil Gezinti Kordonu',
    lat: 40.9880,
    lng: 37.8860,
    hasPhysicalAccessPath: true,
    accessStatus: 'Kamuya Açık Sahil Yolu',
    safetyCaveats: [
      'Geniş ve aydınlatmalı kentsel sahil şeridi; aile ve yaya yoğunluğu bulunmaktadır.',
      'Olta atarken gerideki yayaların güvenliği kontrol edilmelidir.'
    ],
    legalNotice: 'Kentsel sahil bandında amatör olta balıkçılığı serbesttir; atık ve misina bırakılmamalıdır.',
    osmUrl: 'https://www.openstreetmap.org/way/189230198'
  }
];

function calculateHaversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Belirli bir koordinat için kıyı fiziksel erişimini ve en yakın OSM altyapı nesnesini değerlendirir
 */
export function assessCoastalAccess(
  lat: number,
  lng: number,
  distanceToCoastKm: number | null,
  zoneType: string
): CoastalAccessAssessment {
  // Karasal alan
  if (zoneType === 'kara' || (distanceToCoastKm !== null && distanceToCoastKm > 0.45 && lat < 41.2)) {
    return {
      queryLat: lat,
      queryLng: lng,
      distanceToCoastKm,
      nearestFeature: null,
      nearestFeatureDistanceMeters: null,
      accessCategory: 'Karasal Alan',
      accessSummary: `Seçilen koordinat deniz kıyısından yaklaşık ~${distanceToCoastKm !== null ? distanceToCoastKm.toFixed(2) : '?'} km içeridedir. Karasal alanda kıyı erişimi veya olta atış noktası bulunmamaktadır.`,
      groundSafetyWarning: 'Deniz kıyısı dışındadır.',
      legalRegulationNote: 'Karasal özel mülkiyet sınırlarına ve imar yollarına dikkat edilmelidir.',
      osmSourceInfo: {
        source: 'OpenStreetMap Katkıda Bulunanlar (ODbL) & Kıyı Çizgisi GeoJSON',
        license: 'Open Data Commons Open Database License (ODbL)',
        url: 'https://www.openstreetmap.org/',
        verificationDate: '2024-10 Coğrafi Teyit',
        limitations: ['Karasal alandır; kıyı balıkçılığı menzili dışındadır.']
      }
    };
  }

  // Açık Deniz
  if (zoneType === 'deniz' || (distanceToCoastKm !== null && distanceToCoastKm > 0.45 && lat >= 41.2)) {
    return {
      queryLat: lat,
      queryLng: lng,
      distanceToCoastKm,
      nearestFeature: null,
      nearestFeatureDistanceMeters: null,
      accessCategory: 'Açık Deniz',
      accessSummary: `Seçilen koordinat kıyı çizgisinin yaklaşık ~${distanceToCoastKm !== null ? distanceToCoastKm.toFixed(2) : '?'} km açığında Karadeniz açık sularındadır. Kıyıdan yaya veya araçla fiziksel erişim yoktur; yalnızca tekneyle ulaşılabilir.`,
      groundSafetyWarning: 'Açık deniz seyir emniyeti kuralları geçerlidir; can yeleği, telsiz ve hava durumu takibi zorunludur.',
      legalRegulationNote: 'Deniz Trafik Tüzüğü ve Sahil Güvenlik Komutanlığı açık deniz seyir mevzuatına tabidir.',
      osmSourceInfo: {
        source: 'OpenStreetMap (Kıyı Çizgisi) & Ulusal Kıyı Poligonu',
        license: 'ODbL',
        url: 'https://www.openstreetmap.org/',
        verificationDate: '2024-10 Coğrafi Teyit',
        limitations: ['Kıyı yaya erişimi yoktur; açık deniz tekne alanıdır.']
      }
    };
  }

  // Kıyı Şeridi (~450m kıyı bandı): En yakın teyitli OSM altyapı nesnesini bul
  let nearest: CoastalFeature | null = null;
  let minDistanceMeters = Infinity;

  for (const item of VERIFIED_COASTAL_INFRASTRUCTURE) {
    const dMeters = calculateHaversineMeters(lat, lng, item.lat, item.lng);
    if (dMeters < minDistanceMeters) {
      minDistanceMeters = dMeters;
      nearest = {
        ...item,
        distanceKm: Math.round((dMeters / 1000) * 10) / 10
      };
    }
  }

  // Altyapı yakınlığı değerlendirmesi
  if (nearest && minDistanceMeters <= 1200) {
    let accessCategory: CoastalAccessAssessment['accessCategory'] = 'Doğrulanmış Kıyı Yolu Mevcut';
    if (nearest.accessStatus.includes('Riskli') || nearest.type === 'mendirek') {
      accessCategory = 'Taş Tahkimat / Dikkatli Geçiş';
    } else if (nearest.accessStatus.includes('Liman')) {
      accessCategory = 'Liman / Kısıtlı Bölge Olasılığı';
    }

    return {
      queryLat: lat,
      queryLng: lng,
      distanceToCoastKm,
      nearestFeature: nearest,
      nearestFeatureDistanceMeters: minDistanceMeters,
      accessCategory,
      accessSummary: `En yakın doğrulanmış kıyı yapısı: ${nearest.name} (~${minDistanceMeters < 1000 ? `${minDistanceMeters} m` : `${(minDistanceMeters / 1000).toFixed(1)} km`} mesafede). Yapı tipi: ${nearest.typeLabel}. Erişim Durumu: ${nearest.accessStatus}.`,
      groundSafetyWarning: `${nearest.safetyCaveats.join(' ')} Kıyı taşlarında yürürken kaygan zemin ve ani dalga basması riskine karşı can yeleği ve kaymaz ayakkabı tavsiye edilir.`,
      legalRegulationNote: nearest.legalNotice,
      osmSourceInfo: {
        source: `OpenStreetMap (OSM ${nearest.osmId}) Katkıda Bulunanlar`,
        license: 'ODbL',
        url: nearest.osmUrl,
        verificationDate: '2024-10 Doğrulama',
        limitations: [
          'Haritada bir mendirek veya iskele çizili olması, kamuya açık ve güvenli olta atış yeri olduğunu garanti etmez.',
          'Liman başkanlığı idari sınırlarında ve askeri alanlarda güvenlik görevlileri avlanmayı engelleyebilir.',
          'Fırtına ve lodos/poyraz fırtınasında kıyı yapıları üzerine dalga aşması can güvenliği tehlikesi yaratır.'
        ]
      }
    };
  }

  // Yakınında kayıtlı büyük altyapı olmayan doğal sahil şeridi
  return {
    queryLat: lat,
    queryLng: lng,
    distanceToCoastKm,
    nearestFeature: null,
    nearestFeatureDistanceMeters: null,
    accessCategory: 'Doğal Kıyı (Patika / Yol Teyitsiz)',
    accessSummary: `Seçilen nokta kıyı çizgisine yaklaşık ~${distanceToCoastKm !== null ? Math.round(distanceToCoastKm * 1000) : '?'} metre mesafededir. Ancak 1.2 km yarıçap içinde haritada işaretli büyük bir liman veya mendirek bulunmamaktadır; kumsal veya doğal kıyı hattıdır.`,
    groundSafetyWarning: 'Fiziki erişim patikası, falez eğimi ve arazi engelleri sahada bizzat kontrol edilmelidir. Gece inişlerinde düşme ve ıslak taş riski mevcuttur.',
    legalRegulationNote: 'Kıyı Kanunu uyarınca kamuya açık kumsallarda olta balıkçılığı genel olarak serbesttir; özel plaj ve koruma alanları yerel tabelalardan teyit edilmelidir.',
    osmSourceInfo: {
      source: 'OpenStreetMap Kıyı Çizgisi ve Yerel Arazi Ağı',
      license: 'ODbL',
      url: 'https://www.openstreetmap.org/',
      verificationDate: '2024-10 Doğrulama',
      limitations: [
        'Doğal kıyı şeridinde noktasal olta merası garantisi yoktur.',
        'Özel mülkiyet, askeri kısıt ve çit engelleri sahada doğrulanmalıdır.'
      ]
    }
  };
}
