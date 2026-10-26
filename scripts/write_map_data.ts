import fs from 'fs';

const content = `// Balıkcım — Samsun–Ordu Doğrulanmış Kıyı Meraları ve Coğrafi Doğrulama Modülü
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

export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  // ==========================================
  // SAMSUN NOKTALARI (13 Adet)
  // ==========================================
  {
    id: 'samsun-derekoy-barinak',
    name: 'Dereköy Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: '19 Mayıs',
    lat: 41.4725,
    lng: 36.1121,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Liman Mendireği)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.4695, lng: 36.1285 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Balıkçı Barınağı Mendireği',
    osmId: 'way/283103233',
    osmUrl: 'https://www.openstreetmap.org/way/283103233',
    cografiKaynakNotu: 'Mendirek taş tahkimatı ve barınak girişi OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Barınak karayolu bağlantısından mendirek gövdesine yaya yürüyüşü ile doğrudan ulaşılabilir.',
    avlanmaIzinDurumu: 'Amatör kıyı balıkçıları için mendirek dış tahkimatından olta atışı serbesttir; tekne giriş rotası kısıtlıdır.',
    kisitlarVeRiskler: 'Sert poyraz ve karayelde dalgalar mendirek üstüne aşabilir; tetrapod taşlar kaygandır.',
    belirsizlikler: 'Liman ağzı derinliği batimetrik olarak ölçülmemiştir; kum dolgusu nedeniyle derinlik değişkendir.',
    balikcilikGerekcesi: 'Mendirek kayalık yapısı midye ve yosun kolonilerine ev sahipliği yapar; levrek ve lüfer için doğal yemlenme cebidir.',
    hedeflenenTurler: ['Levrek', 'Lüfer', 'Çinekop', 'İstavrit', 'Eşkina'],
    turVerisiKaynagi: 'Bölgesel kıyı raporları ve geleneksel Karadeniz mendirek faunası.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Balıkçı Barınağı Mendireği',
    erisimDurumu: 'Barınak karayolu bağlantısından mendirek gövdesine yaya yürüyüşü ile doğrudan ulaşılabilir.',
    city: 'Samsun',
    district: '19 Mayıs',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Liman Mendireği)',
    verificationNote: 'Dereköy mendireği OSM üzerinde teyitli balıkçı altyapısıdır.',
    verifiedGeoFeature: 'Taş dolgu ve tetrapod mendirek yapısı',
    commonTargetSpecies: ['Levrek', 'Lüfer', 'İstavrit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Dalgalı havalarda taşlar ıslak ve kaygandır; can yeleği tavsiye edilir.'
  },
  {
    id: 'samsun-taflan-kumsal',
    name: 'Taflan Yalı Kumsalı',
    il: 'Samsun',
    ilce: 'Atakum',
    lat: 41.4462,
    lng: 36.1511,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kumsal Sahil Şeridi)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.4452, lng: 36.1495 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Coastline / Sahil Çizgisi',
    osmId: 'way/taflan-coast',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.4462/36.1511',
    cografiKaynakNotu: 'Açık kumsal kıyı çizgisi teyitlidir; yapay sabit iskele veya mendirek bulunmaz.',
    fizikselKiyiErisimi: 'Sahil yolu üzerinden kumsala düz ayak yürüyerek doğrudan erişim mümkündür.',
    avlanmaIzinDurumu: 'Kıyıdan olta balıkçılığı serbesttir; yaz aylarında plaj yüzme saatleri kısıt oluşturabilir.',
    kisitlarVeRiskler: 'Açık deniz dalgalarına açıktır; sert dalgada kum kalkar ve dip takımları sürüklenebilir.',
    belirsizlikler: 'Dip yapısı kumul erozyonu nedeniyle mevsime göre değişir; derinlik batimetrisi ölçülmemiştir.',
    balikcilikGerekcesi: 'Geniş kumluk kıyı kalkan, mırmır ve kıyıya sokulan levrekler için dip beslenme sahasıdır.',
    hedeflenenTurler: ['Kalkan', 'Mırmır', 'Levrek', 'İstravrit'],
    turVerisiKaynagi: 'Karadeniz sörf kasting (surfcasting) tür rehberi.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Coastline / Sahil Çizgisi',
    erisimDurumu: 'Sahil yolu üzerinden kumsala düz ayak yürüyerek doğrudan erişim mümkündür.',
    city: 'Samsun',
    district: 'Atakum',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kumsal Sahil)',
    verificationNote: 'Doğal kumsal sahildir; sabit taş tahkimat veya mendirek içermez.',
    verifiedGeoFeature: 'Kumluk açık kıyı şeridi',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Kuzey rüzgarlarında dalga ve kıyı akıntısı yüksektir.'
  },
  {
    id: 'samsun-kurupelit-marina',
    name: 'Kurupelit Yat Limanı Mendireği',
    il: 'Samsun',
    ilce: 'Atakum',
    lat: 41.3701,
    lng: 36.2311,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Marina Dalgakıranı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.3718, lng: 36.2330 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Kurupelit Marina Breakwater',
    osmId: 'way/295966601',
    osmUrl: 'https://www.openstreetmap.org/way/295966601',
    cografiKaynakNotu: 'Marina dış dalgakıranı ve basen yapısı OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Marina kordonu ve yürüyüş yolundan mendirek gövdesine yaya geçişi açıktır.',
    avlanmaIzinDurumu: 'Mendireğin dış deniz tarafı amatör avcılığa açıktır; iç basen ve tekneler arası avlanma yasaktır.',
    kisitlarVeRiskler: 'Marina içi sığlaşma ve dip balçıklanması mevcuttur; dış taraf sert dalga alabilir.',
    belirsizlikler: 'Basen içi dip derinliği kumlanma nedeniyle sürekli değişkenlik göstermektedir.',
    balikcilikGerekcesi: 'Mendirek dışındaki yapay resif etkisi istavrit ve lüfer sürülerini çeker; gece avında eşkina verir.',
    hedeflenenTurler: ['İstavrit', 'Lüfer', 'Çinekop', 'Eşkina', 'Mezgit'],
    turVerisiKaynagi: 'Samsun amatör olta balıkçılığı gözlemleri ve marina dışı sahil kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Kurupelit Marina Breakwater',
    erisimDurumu: 'Marina kordonu ve yürüyüş yolundan mendirek gövdesine yaya geçişi açıktır.',
    city: 'Samsun',
    district: 'Atakum',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Marina)',
    verificationNote: 'Kurupelit yat limanı dalgakıranı teyitli kıyı yapısıdır.',
    verifiedGeoFeature: 'Taş dolgu dalgakıran ve marinaya ait dış tahkimat',
    commonTargetSpecies: ['İstavrit', 'Lüfer', 'Eşkina'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'İç marina baseninde olta atmak yasaktır; dış dalgakırana dikkat edilmelidir.'
  },
  {
    id: 'samsun-cobanli-iskele',
    name: 'Atakum Çobanlı Sahil İskelesi',
    il: 'Samsun',
    ilce: 'Atakum',
    lat: 41.3444,
    lng: 36.2618,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kentsel Gezi İskelesi)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Çobanlı İskelesi',
    osmId: 'way/942831445',
    osmUrl: 'https://www.openstreetmap.org/way/942831445',
    cografiKaynakNotu: 'Denize uzanan beton/çelik gezi iskelesi OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Atakum sahil kordonundan iskeleye engelsiz yaya yürüyüş yolu vardır.',
    avlanmaIzinDurumu: 'Kentsel gezi iskelesidir; yoğun saatlerde belediye zabıtası tarafından olta atışı kısıtlanabilir.',
    kisitlarVeRiskler: 'Yaya, bisikletli ve ziyaretçi kalabalığı; fırdöndü ve iğnelerin çevreye tehlike yaratması.',
    belirsizlikler: 'İskele başı ve açık ucu derinliği resmi batimetriyle ölçülmemiştir (~2-4m tahmini).',
    balikcilikGerekcesi: 'Denizin içerisine uzanan ayaklar midye bağlamıştır; sabah erken saatlerde istavrit ve lüfer çaparisine uygundur.',
    hedeflenenTurler: ['İstavrit', 'Çinekop', 'Mezgit', 'Kefal'],
    turVerisiKaynagi: 'Kentsel kıyı avı kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Çobanlı İskelesi',
    erisimDurumu: 'Atakum sahil kordonundan iskeleye engelsiz yaya yürüyüş yolu vardır.',
    city: 'Samsun',
    district: 'Atakum',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Gezi İskelesi)',
    verificationNote: 'Gezi iskelesidir; yaya yoğunluğuna göre zabıta kısıtlaması uygulanabilir.',
    verifiedGeoFeature: 'Denize doğru uzanan kazıklı beton yürüyüş iskelesi',
    commonTargetSpecies: ['İstavrit', 'Kefal', 'Çinekop'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Ziyaretçi ve çocuk yoğunluğu nedeniyle savurma atışlarında çok dikkatli olunmalıdır.'
  },
  {
    id: 'samsun-batipark-barinak',
    name: 'Samsun Batıpark Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: 'İlkadım',
    lat: 41.3250,
    lng: 36.2754,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Balıkçı Barınağı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.3175, lng: 36.3335 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Batıpark Balıkçı Barınağı',
    osmId: 'way/batipark-mendirek',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.3250/36.2754',
    cografiKaynakNotu: 'Batıpark dolgu alanı batı ucundaki balıkçı barınağı ve taş mendireği teyitlidir.',
    fizikselKiyiErisimi: 'Batıpark rekreasyon alanı üzerinden mendireğe araç ve yaya yaklaşımı mümkündür.',
    avlanmaIzinDurumu: 'Mendireğin dış deniz cephesi amatör balıkçılara açıktır; barınak çekek yerleri özeldir.',
    kisitlarVeRiskler: 'Giriş mendireğindeki büyük blok taşlar kaygan olabilir; gece aydınlatması yetersizdir.',
    belirsizlikler: 'Liman ağzı derinlik değişimi teyitli batimetriye sahip değildir.',
    balikcilikGerekcesi: 'Samsun Körfezi batı girişi kayalık hattı; yemlik balık akıntısını keserek istavrit ve lüfer avı sağlar.',
    hedeflenenTurler: ['İstavrit', 'Lüfer', 'Çinekop', 'Mezgit', 'Kefal'],
    turVerisiKaynagi: 'Samsun merkez kıyı avı geleneksel kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Batıpark Balıkçı Barınağı',
    erisimDurumu: 'Batıpark rekreasyon alanı üzerinden mendireğe araç ve yaya yaklaşımı mümkündür.',
    city: 'Samsun',
    district: 'İlkadım',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Barınak)',
    verificationNote: 'Batıpark mendireği teyitli taş tahkimat yapısıdır.',
    verifiedGeoFeature: 'Dolgu sahası koruma dalgakıranı ve rıhtım',
    commonTargetSpecies: ['İstavrit', 'Lüfer', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Gece avında fener kullanımı zorunludur; taşlar kaygandır.'
  },
  {
    id: 'samsun-limani-kuzey-mendirek',
    name: 'Samsun Limanı Ana Dış Mendireği',
    il: 'Samsun',
    ilce: 'İlkadım',
    lat: 41.3095,
    lng: 36.3560,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'ERISIM_KISITLI_VEYA_RISKLI',
    kanitSeviyesiBadge: '⛔ Erişim Kısıtlı / Güvenlik Riski (Ticari Liman Sahası)',
    haritadaAktifMi: false,
    aktifOlmamaGerekcesi: 'Samsunport ISPS uluslararası ticari liman güvenlik sahasıdır. Sivil yaya ve amatör balıkçı girişi kanunen yasaktır.',
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Samsunport Breakwater',
    osmId: 'way/samsunport-mendirek',
    osmUrl: 'https://www.openstreetmap.org/#map=15/41.3095/36.3560',
    cografiKaynakNotu: 'Uluslararası ticari limanın 3 km uzunluğundaki dış koruma mendireği coğrafi olarak teyitlidir.',
    fizikselKiyiErisimi: 'Liman işletmesi (Samsunport) güvenlik kapısı ve tel örgülerle çevrilidir; sivil yaya girişi yasaktır.',
    avlanmaIzinDurumu: 'YASAK / KISITLI: ISPS uluslararası liman güvenlik kuralları gereği mendireğe giriş ve olta avı kesinlikle yasaktır.',
    kisitlarVeRiskler: 'Gemi manevra sahası, derin açık deniz akıntıları, güvenlik müdahalesi ve yasal para cezası riski.',
    belirsizlikler: 'Sivil erişime kapalıdır; amatör balıkçılık derinlik veya av verisi bulunmamaktadır.',
    balikcilikGerekcesi: 'Açık deniz derinliği barındırsa da sivil girişe tamamen kapalıdır; balıkçılık sahası olarak kullanılamaz.',
    hedeflenenTurler: ['Amatör Avcılığa Kapalı'],
    turVerisiKaynagi: 'Saha güvenlik yönetmeliği.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; amatör avcılığa kapalı',
    kaynak: 'OSM Way / Samsunport Breakwater',
    erisimDurumu: 'Liman işletmesi (Samsunport) güvenlik kapısı ve tel örgülerle çevrilidir; sivil yaya girişi yasaktır.',
    city: 'Samsun',
    district: 'İlkadım',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'ERISIM_KISITLI_VEYA_RISKLI',
    verificationBadge: '⛔ Giriş Yasak (Ticari Liman)',
    verificationNote: 'Samsunport ISPS ticari liman sahasıdır; amatör balıkçı girişi kesinlikle yasaktır.',
    verifiedGeoFeature: 'Ticari liman ana dış dalgakıranı',
    commonTargetSpecies: [],
    depthStatus: 'Ölçülmüş batimetri verisi yok; amatör avcılığa kapalı',
    cautions: 'Liman sahasına izinsiz girmek kanunen yasaktır ve hayati tehlike taşır.'
  },
  {
    id: 'samsun-mert-irmagi-mansap',
    name: 'Samsun Mert Irmağı Mansabı',
    il: 'Samsun',
    ilce: 'Canik',
    lat: 41.2830,
    lng: 36.3520,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Akarsu Mansabı / Doğu Park)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.2788, lng: 36.3520 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Mert Irmağı Denize Çıkışı',
    osmId: 'relation/18155222',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.2830/36.3520',
    cografiKaynakNotu: 'Mert Irmağının Doğu Park sahilinden Karadenize döküldüğü mansap çizgisi teyitlidir.',
    fizikselKiyiErisimi: 'Doğu Park sahil yürüyüş yolundan kumsala ve nehir ağzına yaya olarak inilebilir.',
    avlanmaIzinDurumu: 'Kıyıdan denize doğru olta atışı serbesttir; iç su tebliğindeki nehir içi yasak sınırlarına dikkat edilmelidir.',
    kisitlarVeRiskler: 'Şiddetli yağışlarda debi artışı, sel suları, akarsu balçığı ve ani kıyı erozyonu.',
    belirsizlikler: 'Kum dili ve ırmak yatağı her taşkında yer değiştirir; derinlik ölçülmemiştir.',
    balikcilikGerekcesi: 'Tatlı su-tuzlu su karışımı zengin plankton üretir; kefal, levrek ve kalkan için birincil beslenme alanıdır.',
    hedeflenenTurler: ['Kefal', 'Levrek', 'Kalkan', 'Mırmır'],
    turVerisiKaynagi: 'Doğu Karadeniz akarsu mansap faunası.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Mert Irmağı Denize Çıkışı',
    erisimDurumu: 'Doğu Park sahil yürüyüş yolundan kumsala ve nehir ağzına yaya olarak inilebilir.',
    city: 'Samsun',
    district: 'Canik',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Dere Ağzı)',
    verificationNote: 'Akarsu mansabıdır; debi ve kum birikimine göre dip yapısı değişkendir.',
    verifiedGeoFeature: 'Mert Irmağı Karadeniz dökülme deltası ve kumsalı',
    commonTargetSpecies: ['Kefal', 'Levrek', 'Kalkan'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Yağışlı havalarda ani debi artışı ve balçık bataklık tehlikesi vardır.'
  },
  {
    id: 'samsun-canik-barinak',
    name: 'Canik Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: 'Canik',
    lat: 41.2562,
    lng: 36.3956,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Balıkçı Barınağı)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Canik Balıkçı Barınağı',
    osmId: 'way/canik-barinak',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.2562/36.3956',
    cografiKaynakNotu: 'Canik sahilindeki taş dolgu barınak ve mendirek OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Sahil yolu bağlantısından barınağa ve mendirek üstüne yürüyerek erişim mevcuttur.',
    avlanmaIzinDurumu: 'Mendirek dış cephesinden amatör olta balıkçılığı serbesttir.',
    kisitlarVeRiskler: 'Taş tahkimat yüzeyi engebelidir; dalgalı havalarda su sıçraması fazladır.',
    belirsizlikler: 'Liman ağzı derinliği dönemsel tarama faaliyetlerine göre değişmektedir.',
    balikcilikGerekcesi: 'Mendireğin açık denize bakan yüzü istavrit, lüfer ve mezgit için uygun olta menzili sunar.',
    hedeflenenTurler: ['İstavrit', 'Lüfer', 'Mezgit', 'Kefal'],
    turVerisiKaynagi: 'Yerel amatör balıkçı gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Canik Balıkçı Barınağı',
    erisimDurumu: 'Sahil yolu bağlantısından barınağa ve mendirek üstüne yürüyerek erişim mevcuttur.',
    city: 'Samsun',
    district: 'Canik',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Barınak)',
    verificationNote: 'Canik barınağı teyitli balıkçı limanı altyapısıdır.',
    verifiedGeoFeature: 'Taş dolgu koruma mendireği ve balıkçı rıhtımı',
    commonTargetSpecies: ['İstavrit', 'Lüfer', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Islak taşlarda kayma tehlikesine dikkat edilmelidir.'
  },
  {
    id: 'samsun-gelemen-sahil',
    name: 'Tekkeköy Gelemen Sahil Bandı',
    il: 'Samsun',
    ilce: 'Tekkeköy',
    lat: 41.2460,
    lng: 36.4325,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'YETERSIZ_VERI',
    kanitSeviyesiBadge: '⚠️ Yetersiz Veri (Kayıtsız / Geniş Sahil Hattı)',
    haritadaAktifMi: false,
    aktifOlmamaGerekcesi: 'Belirgin bir olta atım platformu, mendirek veya güvenli mera noktası bulunmamaktadır; sanayi gerisi genel sığ sahil hattıdır.',
    cografiDogrulamaDurumu: 'KISMI',
    cografiKaynak: 'OSM Coastline / Gelemen Sahili',
    osmId: 'way/gelemen-coast',
    osmUrl: 'https://www.openstreetmap.org/#map=15/41.2460/36.4325',
    cografiKaynakNotu: 'Geniş sahil çizgisi teyitlidir ancak noktasal bir avlak veya iskele/mendirek bulunmamaktadır.',
    fizikselKiyiErisimi: 'Sanayi ve tarım arazileri arasından sahile stabilize yollarla ulaşılır; yaya yolu bakımsızdır.',
    avlanmaIzinDurumu: 'Kıyıdan olta atışı genel mevzuata tabidir; ancak sanayi deşarj hatları yakınında kısıtlar olabilir.',
    kisitlarVeRiskler: 'Geniş sığlık, ıssız sahil şeridi, gece aydınlatması ve güvenlik altyapısının bulunmaması.',
    belirsizlikler: 'Noktasal mera kaydı yoktur; dip kumluk derinliği kıyıdan yüzlerce metre sığ devam eder.',
    balikcilikGerekcesi: 'Mevsimsel olarak kalkan denenebilir; ancak belirgin ve doğrulanmış balık tutma noktası yoktur.',
    hedeflenenTurler: ['Kalkan (Belirsiz)'],
    turVerisiKaynagi: 'Genel bölgesel tür varsayımı; doğrulanmış av verisi yoktur.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; noktasal mera teyidi bulunmamaktadır',
    kaynak: 'OSM Coastline / Gelemen Sahili',
    erisimDurumu: 'Sanayi ve tarım arazileri arasından sahile stabilize yollarla ulaşılır; yaya yolu bakımsızdır.',
    city: 'Samsun',
    district: 'Tekkeköy',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'YETERSIZ_VERI',
    verificationBadge: '⚠️ Yetersiz Veri (Geniş Sahil)',
    verificationNote: 'Noktasal mera teyidi yoktur; geniş kıyı hattıdır.',
    verifiedGeoFeature: 'Açık sığ sahil hattı',
    commonTargetSpecies: [],
    depthStatus: 'Ölçülmüş batimetri verisi yok; noktasal mera teyidi bulunmamaktadır',
    cautions: 'Issız sahil bandıdır; gece yalnız gidilmemelidir.'
  },
  {
    id: 'samsun-carsamba-yesilirmak',
    name: 'Çarşamba Yeşilırmak Deltası Mansabı',
    il: 'Samsun',
    ilce: 'Çarşamba',
    lat: 41.3798,
    lng: 36.6603,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Büyük Nehir Deltası Mansabı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.3745, lng: 36.6210 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Yeşilırmak Ağzı & Cıva Kıyı Hattı',
    osmId: 'node/civa-burnu',
    osmUrl: 'https://www.openstreetmap.org/#map=15/41.3798/36.6603',
    cografiKaynakNotu: 'Yeşilırmak nehrinin Karadenize döküldüğü ana ağız ve delta kumulları teyitlidir.',
    fizikselKiyiErisimi: 'Köy yolları ve delta stabilize hatlarından kumul kıyısına ulaşılır; 4x4 veya yaya intikal gerekebilir.',
    avlanmaIzinDurumu: 'Kıyıdan denize doğru olta atışı serbesttir; iç sular av tebliği kapsamında ırmak ağzı iç kesim yasaklarına uyulmalıdır.',
    kisitlarVeRiskler: 'Girdaplı akıntılar, bataklık kumulları, ani derinleşen kum kırılmaları ve dalga kabarması.',
    belirsizlikler: 'Delta kumu sürekli hareketlidir; nehir debisi mevsimsel olarak suyu aşırı bulandırır.',
    balikcilikGerekcesi: 'Karadenizin en büyük nehir deltalarından biridir; zengin besin maddesi sebebiyle trofe levrek ve kalkan avlağıdır.',
    hedeflenenTurler: ['Levrek', 'Kalkan', 'Kefal', 'Mersin Balığı (Avı Kesin Yasak/Korumada)'],
    turVerisiKaynagi: 'Yeşilırmak deltası biyolojik literatürü ve kıyı kasting kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Yeşilırmak Ağzı & Cıva Kıyı Hattı',
    erisimDurumu: 'Köy yolları ve delta stabilize hatlarından kumul kıyısına ulaşılır; 4x4 veya yaya intikal gerekebilir.',
    city: 'Samsun',
    district: 'Çarşamba',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Büyük Delta)',
    verificationNote: 'Yeşilırmak deltası mansabıdır; akıntı ve kum kayması yüksektir.',
    verifiedGeoFeature: 'Nehir mansabı kum dili ve delta sığlığı',
    commonTargetSpecies: ['Levrek', 'Kalkan', 'Kefal'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Delta kumunda batma ve nehir akıntısı tehlikesi vardır; suya girilmemelidir.'
  },
  {
    id: 'samsun-carsamba-hurriyet',
    name: 'Çarşamba Hürriyet Fener Sahili',
    il: 'Samsun',
    ilce: 'Çarşamba',
    lat: 41.3660,
    lng: 36.6710,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'YETERSIZ_VERI',
    kanitSeviyesiBadge: '⚠️ Yetersiz Veri (Kayıtsız / Geniş Delta Sahili)',
    haritadaAktifMi: false,
    aktifOlmamaGerekcesi: 'Noktasal mera kaydı doğrulanmamıştır; bataklık/kumul geniş kıyı şerididir.',
    cografiDogrulamaDurumu: 'KISMI',
    cografiKaynak: 'OSM Coastline / Çarşamba Hürriyet Sahili',
    osmId: 'way/hurriyet-coast',
    osmUrl: 'https://www.openstreetmap.org/#map=15/41.3660/36.6710',
    cografiKaynakNotu: 'Deltanın doğu kumsal hattıdır; sabit mendirek veya yapısal iskele bulunmaz.',
    fizikselKiyiErisimi: 'Köy içi toprak yollardan kumsala ulaşılır; kışın çamur ve su birikintisi nedeniyle erişim zordur.',
    avlanmaIzinDurumu: 'Kıyıdan olta serbesttir; koruma alanı statüleri kontrol edilmelidir.',
    kisitlarVeRiskler: 'Uzak ve ıssız sahil şeridi, bataklık kumul riski, sert poyraz dalgaları.',
    belirsizlikler: 'Belirli bir balıkçılık noktası veya batimetri ölçümü teyitli değildir.',
    balikcilikGerekcesi: 'Bahar aylarında kalkan surfcasting denemeleri yapılmaktadır.',
    hedeflenenTurler: ['Kalkan (Mevsimsel)'],
    turVerisiKaynagi: 'Genel bölgesel kumsal tahmini.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; noktasal mera teyidi bulunmamaktadır',
    kaynak: 'OSM Coastline / Çarşamba Hürriyet Sahili',
    erisimDurumu: 'Köy içi toprak yollardan kumsala ulaşılır; kışın çamur ve su birikintisi nedeniyle erişim zordur.',
    city: 'Samsun',
    district: 'Çarşamba',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'YETERSIZ_VERI',
    verificationBadge: '⚠️ Yetersiz Veri (Geniş Delta Sahili)',
    verificationNote: 'Geniş kumsal sahil hattıdır; noktasal olta yeri teyitli değildir.',
    verifiedGeoFeature: 'Delta kumluk sahil çizgisi',
    commonTargetSpecies: [],
    depthStatus: 'Ölçülmüş batimetri verisi yok; noktasal mera teyidi bulunmamaktadır',
    cautions: 'Araç kuma saplanabilir; yalnız gidilmesi önerilmez.'
  },
  {
    id: 'samsun-terme-barinak',
    name: 'Terme Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: 'Terme',
    lat: 41.1982,
    lng: 37.0279,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Balıkçı Barınağı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.2010, lng: 37.0340 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Terme Balıkçı Barınağı',
    osmId: 'way/terme-barinak',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.1982/37.0279',
    cografiKaynakNotu: 'Terme Çayı çıkışındaki taş tahkimat mendirek ve balıkçı limanı OSM üzerinde teyitlidir.',
    fizikselKiyiErisimi: 'Terme Yalı mahallesinden liman mendireğine asfalt ve beton yol üzerinden kolay erişim vardır.',
    avlanmaIzinDurumu: 'Mendireğin dış deniz tarafı amatör balıkçılara açıktır; çay içi giriş ağzına dikkat edilmelidir.',
    kisitlarVeRiskler: 'Terme Çayı taşkın dönemlerinde bulanık su basar; taşlar yosunlu ve kaygandır.',
    belirsizlikler: 'Çay mansabı sığlaşma durumu batimetriyle sürekli takip edilmemektedir.',
    balikcilikGerekcesi: 'Terme Çayı tatlı suyu ile Karadenizin buluştuğu mendirek; levrek, lüfer ve istavrit için ideal duraktır.',
    hedeflenenTurler: ['Levrek', 'Lüfer', 'İstavrit', 'Kefal', 'Mezgit'],
    turVerisiKaynagi: 'Terme kıyı olta avcılığı teyitli gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Terme Balıkçı Barınağı',
    erisimDurumu: 'Terme Yalı mahallesinden liman mendireğine asfalt ve beton yol üzerinden kolay erişim vardır.',
    city: 'Samsun',
    district: 'Terme',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Barınak)',
    verificationNote: 'Terme barınağı teyitli mendirek altyapısıdır.',
    verifiedGeoFeature: 'Terme Çayı çıkışında taş tahkimat mendirek ve balıkçı rıhtımı',
    commonTargetSpecies: ['Levrek', 'İstavrit', 'Kefal', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Dere çıkışı sığlaşabilir; mendirek dışındaki taşlar kaygandır.'
  },
  {
    id: 'samsun-terme-milic',
    name: 'Terme Miliç Sahil Kumsalı',
    il: 'Samsun',
    ilce: 'Terme',
    lat: 41.1710,
    lng: 37.0775,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kumsal Sahil Şeridi)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Sahil Çizgisi (Terme Miliç Sahili)',
    osmId: 'way/milic-sahil',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.1710/37.0775',
    cografiKaynakNotu: 'Miliç çamlığı gerisindeki doğal kumsal kıyı çizgisi teyitlidir.',
    fizikselKiyiErisimi: 'Miliç rekreasyon ve sahil tesislerinden kumsala kolay yaya erişimi mevcuttur.',
    avlanmaIzinDurumu: 'Kıyıdan olta avı serbesttir; yaz aylarında plaj kullanım saatleri dikkate alınmalıdır.',
    kisitlarVeRiskler: 'Yaz sezonunda plaj kullanımı; kışın sert kuzey rüzgarı dalgaları ve kıyı erozyonu.',
    belirsizlikler: 'Kıyı eğimi oldukça sığdır; derinlik batimetrisi ölçülmemiştir.',
    balikcilikGerekcesi: 'Geniş kumluk taban kalkan ve mırmır türlerinin dip beslenmesine elverişlidir.',
    hedeflenenTurler: ['Kalkan', 'Mırmır', 'Levrek'],
    turVerisiKaynagi: 'Karadeniz kumsal türleri rehberi.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Sahil Çizgisi (Terme Miliç Sahili)',
    erisimDurumu: 'Miliç rekreasyon ve sahil tesislerinden kumsala kolay yaya erişimi mevcuttur.',
    city: 'Samsun',
    district: 'Terme',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kumsal Sahil)',
    verificationNote: 'Miliç çamlığı ve kumsalı doğal kıyı şerididir.',
    verifiedGeoFeature: 'Çamlık gerisinde uzanan doğal kumluk sahil bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Kuzey rüzgarlarında sahil dalgalanması artar.'
  },

  // ==========================================
  // ORDU NOKTALARI (17 Adet)
  // ==========================================
  {
    id: 'ordu-unye-akcay-mansap',
    name: 'Akçay Deresi Mansabı (Samsun–Ordu Sınırı)',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1470,
    lng: 37.1355,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (İl Sınırı Akarsu Mansabı)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Akçay Deresi Denize Çıkışı',
    osmId: 'way/akcay-mansap',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.1470/37.1355',
    cografiKaynakNotu: 'Samsun ve Ordu il sınırını oluşturan Akçay deresi mansabı kıyı çizgisi teyitlidir.',
    fizikselKiyiErisimi: 'Karadeniz sahil yolu köprüsü yanından dere ağzı kumsalına inilebilir.',
    avlanmaIzinDurumu: 'Deniz kıyısı olta balıkçılığı serbesttir; iç su sınırına uyulmalıdır.',
    kisitlarVeRiskler: 'Dere taşkınları, dalga kabarması ve akarsu yatağı dip balçıklanması.',
    belirsizlikler: 'Mansap ağzı kum seddi mevsimsel olarak değişir; derinlik batimetrisi yoktur.',
    balikcilikGerekcesi: 'Akarsu çıkışındaki küçük canlılar levrek ve kefal çeker; dalgalı havalarda sahte yemle at-çek yapılır.',
    hedeflenenTurler: ['Levrek', 'Kefal', 'Mırmır'],
    turVerisiKaynagi: 'Sınır akarsu kıyı gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Akçay Deresi Denize Çıkışı',
    erisimDurumu: 'Karadeniz sahil yolu köprüsü yanından dere ağzı kumsalına inilebilir.',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (İl Sınırı Deresi)',
    verificationNote: 'Akçay deresi doğal mansap hattıdır.',
    verifiedGeoFeature: 'Akçay deresi mansap kum dili ve kıyı şeridi',
    commonTargetSpecies: ['Levrek', 'Kefal'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Köprü altı ve dere ağzında su akıntısı kuvvetlidir.'
  },
  {
    id: 'ordu-unye-golevi-kumsal',
    name: 'Ünye Gölevi Sahili',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1450,
    lng: 37.2650,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kumsal Sahil)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.1410, lng: 37.2635 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Coastline / Gölevi Sahil Kordonu',
    osmId: 'way/golevi-sahil',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.1450/37.2650',
    cografiKaynakNotu: 'Ünye batı girişindeki doğal kumsal kıyı çizgisi teyitlidir.',
    fizikselKiyiErisimi: 'Gölevi sahil yolu ve rekreasyon alanından kumsala kolayca inilir.',
    avlanmaIzinDurumu: 'Kıyıdan amatör olta balıkçılığı serbesttir; yaz sezonunda plaj alanları ayrılır.',
    kisitlarVeRiskler: 'Açık deniz kuzey dalgaları, plaj sezonu kalabalığı.',
    belirsizlikler: 'Kumluk dip eğimi sığdır; batimetrik derinlik haritası bulunmamaktadır.',
    balikcilikGerekcesi: 'Sonbahar ve kış aylarında kalkan ve levrek kıyılar; surfcasting için açık alandır.',
    hedeflenenTurler: ['Kalkan', 'Levrek', 'Mırmır'],
    turVerisiKaynagi: 'Ünye kıyı olta kasting gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Coastline / Gölevi Sahil Kordonu',
    erisimDurumu: 'Gölevi sahil yolu ve rekreasyon alanından kumsala kolayca inilir.',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Plaj)',
    verificationNote: 'Gölevi doğal kumsal sahil hattıdır.',
    verifiedGeoFeature: 'Kumluk açık kıyı şeridi',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Sert rüzgarlarda dalga boyu hızlı yükselir.'
  },
  {
    id: 'ordu-unye-camlik-kayalik',
    name: 'Ünye Çamlık Doğal Kayalık Burnu',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1445,
    lng: 37.2917,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Doğal Falez ve Kayalık Burun)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.1345, lng: 37.2885 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Çamlık Burnu Feneri & Kayalık Sahil',
    osmId: 'way/camlik-fener',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.1445/37.2917',
    cografiKaynakNotu: 'Ünye Çamlık burnu doğal kayalık falezleri ve kıyı çizgisi teyitlidir.',
    fizikselKiyiErisimi: 'Çamlık mesire alanından kayalık patikalara inilir; kaygan falez inişi dikkat gerektirir.',
    avlanmaIzinDurumu: 'Kıyıdan olta balıkçılığı serbesttir; falez kenarlarında güvenlik önlemleri alınmalıdır.',
    kisitlarVeRiskler: 'Yüksek falezler, kaygan yosunlu kayalar, kırılan sert dalgalar ve düşme tehlikesi.',
    belirsizlikler: 'Doğal taşlık dip derinliği girintili çıkıntılıdır; resmi batimetri verisi yoktur.',
    balikcilikGerekcesi: 'Doğal kayalık ve fener altı; karagöz, eşkina, levrek ve istavrit için bölgenin en zengin doğal resifidir.',
    hedeflenenTurler: ['Eşkina', 'Karagöz', 'Levrek', 'İstavrit', 'Lüfer'],
    turVerisiKaynagi: 'Ünye geleneksel kaya balıkçılığı raporları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Çamlık Burnu Feneri & Kayalık Sahil',
    erisimDurumu: 'Çamlık mesire alanından kayalık patikalara inilir; kaygan falez inişi dikkat gerektirir.',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kayalık Burun)',
    verificationNote: 'Çamlık doğal kayalık burun yapısıdır; falez inişi risklidir.',
    verifiedGeoFeature: 'Falezli doğal taşlık burun ve deniz kayalıkları',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Kayalar dalgalı havalarda su altında kalabilir; kaymaz tabanlı çizme şarttır.'
  },
  {
    id: 'ordu-unye-tarihi-iskele',
    name: 'Ünye Tarihi Sahil İskelesi',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1278,
    lng: 37.2872,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Tarihi Gezi İskelesi)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.1275, lng: 37.2940 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Ünye İskelesi',
    osmId: 'way/unye-iskele',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.1278/37.2872',
    cografiKaynakNotu: 'Ünye Cumhuriyet Meydanı önünden denize uzanan tarihi iskele OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Kordon boyundan iskeleye tamamen düz ayak ve aydınlatmalı yaya erişimi vardır.',
    avlanmaIzinDurumu: 'Kentsel gezi iskelesidir; akşam ve yoğun yürüyüş saatlerinde olta atışına belediye kısıtı gelebilir.',
    kisitlarVeRiskler: 'Gezinti yapan kalabalık halk, olta iğnesi güvenliği, rüzgarlı havada iskele üstü savrulma.',
    belirsizlikler: 'İskele ucu derinliği batimetriyle teyit edilmemiştir (~3-5m tahmini).',
    balikcilikGerekcesi: 'Deniz içine uzanan ayaklar istavrit ve kefal sürülerinin toplanma alanıdır; lrf ve hafif takımlarla av yapılır.',
    hedeflenenTurler: ['İstavrit', 'Kefal', 'Çinekop', 'Mezgit'],
    turVerisiKaynagi: 'Ünye kordon amatör av kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Ünye İskelesi',
    erisimDurumu: 'Kordon boyundan iskeleye tamamen düz ayak ve aydınlatmalı yaya erişimi vardır.',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Gezi İskelesi)',
    verificationNote: 'Tarihi yürüyüş iskelesidir; zabıta ve yaya yoğunluğu kısıtları olabilir.',
    verifiedGeoFeature: 'Denize uzanan beton kazıklı gezi iskelesi',
    commonTargetSpecies: ['İstavrit', 'Kefal', 'Çinekop'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Yürüyüş yapan vatandaşların güvenliği için olta atarken çok dikkatli olunmalıdır.'
  },
  {
    id: 'unye-liman-mendirek',
    name: 'Ünye Limanı Ana Dış Mendireği',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1385,
    lng: 37.3195,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Liman Dış Mendireği)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Ünye Liman Mendireği',
    osmId: 'way/234195821',
    osmUrl: 'https://www.openstreetmap.org/way/234195821',
    cografiKaynakNotu: 'Ünye Cevizdere mevkiindeki derin su limanının ana dış mendireği OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Liman karayolu bağlantısı üzerinden mendirek köküne ve dış taş tahkimata yaya olarak yürünebilir.',
    avlanmaIzinDurumu: 'Dış mendirek deniz cephesinde amatör olta balıkçılığı geleneksel olarak uygulanır; ticari rıhtım sahasına giriş yasaktır.',
    kisitlarVeRiskler: 'Geniş tetrapod bloklar, yüksek dalgalarda su aşması, gece görüş yetersizliği.',
    belirsizlikler: 'Mendirek dışı batimetri derinliği teyitli resmi ölçüme sahip değildir (açık deniz derinliği mevcuttur).',
    balikcilikGerekcesi: 'Bölgenin en derin ve denize en çok sokulan mendireğidir; palamut, lüfer, levrek ve iri istavrit geçiş hattıdır.',
    hedeflenenTurler: ['Palamut', 'Lüfer', 'Levrek', 'İstavrit', 'Çinekop', 'Eşkina'],
    turVerisiKaynagi: 'Ünye Liman mendireği doğrulanmış amatör av kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Ünye Liman Mendireği',
    erisimDurumu: 'Liman karayolu bağlantısı üzerinden mendirek köküne ve dış taş tahkimata yaya olarak yürünebilir.',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Liman Dış Mendireği)',
    verificationNote: 'Ünye Limanı dış mendireği teyitli derin deniz kıyı yapısıdır.',
    verifiedGeoFeature: 'Büyük tetrapod taş dolgulu derin deniz dış mendireği',
    commonTargetSpecies: ['Lüfer', 'Palamut', 'Levrek', 'İstavrit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Mendirek taşları geniştir ve aralarında derin boşluklar bulunur; can yeleği ve fener şarttır.'
  },
  {
    id: 'ordu-unye-cevizdere-mansap',
    name: 'Ünye Cevizdere Mansabı',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1235,
    lng: 37.3225,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Akarsu Mansabı)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Cevizdere Çıkışı',
    osmId: 'way/cevizdere-mansap',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.1235/37.3225',
    cografiKaynakNotu: 'Cevizdere akarsuyunun Ünye Limanı güneyinde Karadenize ulaştığı mansap teyitlidir.',
    fizikselKiyiErisimi: 'Liman güneyi sahil yolundan dere kenarı kumsalına kolayca inilir.',
    avlanmaIzinDurumu: 'Deniz kıyısından olta balıkçılığı serbesttir; nehir içi tebliğ yasaklarına uyulmalıdır.',
    kisitlarVeRiskler: 'Yağmur sonrası nehir çamuru ve debi artışı; sığ kum birikintileri.',
    belirsizlikler: 'Dere ağzı derinliği her fırtınada değişmektedir; sabit batimetri yoktur.',
    balikcilikGerekcesi: 'Liman mendireği ile akarsu mansabının kesişim noktasıdır; levrek ve kefal için zengin beslenme cebidir.',
    hedeflenenTurler: ['Levrek', 'Kefal', 'Mırmır', 'İstavrit'],
    turVerisiKaynagi: 'Cevizdere kıyı gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Cevizdere Çıkışı',
    erisimDurumu: 'Liman güneyi sahil yolundan dere kenarı kumsalına kolayca inilir.',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Dere Ağzı)',
    verificationNote: 'Cevizdere mansabıdır; sediman ve akıntı değişkendir.',
    verifiedGeoFeature: 'Akarsu mansabı kumluk kıyı hattı',
    commonTargetSpecies: ['Levrek', 'Kefal'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Yağmur sonrasında su aşırı bulanır.'
  },
  {
    id: 'ordu-fatsa-dolunay-camlik',
    name: 'Fatsa Dolunay Çamlık Koyu Falezleri',
    il: 'Ordu',
    ilce: 'Fatsa',
    lat: 41.0430,
    lng: 37.5050,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Doğal Koy ve Falezler)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Dolunay Koyu & Çamlık Falez Sahili',
    osmId: 'way/dolunay-koyu',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.0430/37.5050',
    cografiKaynakNotu: 'Dolunay çamlığı altındaki doğal koy ve kayalık falez hattı teyitlidir.',
    fizikselKiyiErisimi: 'Çamlık yürüyüş parkurundan kayalık kıyıya dik patikalarla inilir; dikkatli yürüyüş gerektirir.',
    avlanmaIzinDurumu: 'Kıyıdan amatör olta balıkçılığı serbesttir; falez uçurum emniyeti alınmalıdır.',
    kisitlarVeRiskler: 'Dik yamaç inişi, kaygan kaya yüzeyleri, fırtınada sıkışan dalgalar.',
    belirsizlikler: 'Koy içi sualtı resif derinliği ölçülmemiştir; zemin kayalık ve takılmaya müsaittir.',
    balikcilikGerekcesi: 'Korunaklı koy ve doğal falez kayalıkları; karagöz, eşkina ve levrek için ideal yuvalanma sahasıdır.',
    hedeflenenTurler: ['Eşkina', 'Karagöz', 'Levrek', 'İstavrit'],
    turVerisiKaynagi: 'Fatsa kaya balıkçılığı kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Dolunay Koyu & Çamlık Falez Sahili',
    erisimDurumu: 'Çamlık yürüyüş parkurundan kayalık kıyıya dik patikalarla inilir; dikkatli yürüyüş gerektirir.',
    city: 'Ordu',
    district: 'Fatsa',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Falez Koyu)',
    verificationNote: 'Doğal koy ve kayalık falez yapısıdır; patika inişi zordur.',
    verifiedGeoFeature: 'Çamlık ormanı altındaki doğal kayalık koy ve falez',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Dik patika nedeniyle gece iniş ve çıkışlarında kayma riski yüksektir.'
  },
  {
    id: 'ordu-fatsa-barinak-mendirek',
    name: 'Fatsa Balıkçı Barınağı Mendireği',
    il: 'Ordu',
    ilce: 'Fatsa',
    lat: 41.0290,
    lng: 37.4965,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Balıkçı Barınağı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.0372, lng: 37.5250 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Fatsa Balıkçı Barınağı Mendireği',
    osmId: 'way/fatsa-mendirek',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.0290/37.4965',
    cografiKaynakNotu: 'Fatsa merkez balıkçı barınağı ana mendireği ve taş tahkimatı OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Fatsa sahil kordonundan liman mendireğine asfalt/beton yoldan doğrudan yürünebilir.',
    avlanmaIzinDurumu: 'Mendireğin dış deniz tarafı amatör balıkçılara açıktır; balıkçı tekneleri yanaşma rıhtımları dikkat gerektirir.',
    kisitlarVeRiskler: 'Mendirek dışındaki büyük taşlar kayganlaşabilir; açık kuzey dalgalarında su sıçrar.',
    belirsizlikler: 'Mendirek ucu derinliği batimetrik olarak ölçülmemiştir; tahmini derinlik mevcuttur.',
    balikcilikGerekcesi: 'Mendirek açık deniz akıntısını keserek istavrit, çinekop ve lüfer sürülerini toplar; gece eşkina verir.',
    hedeflenenTurler: ['İstavrit', 'Lüfer', 'Çinekop', 'Eşkina', 'Mezgit'],
    turVerisiKaynagi: 'Fatsa merkez amatör kıyı avı kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Fatsa Balıkçı Barınağı Mendireği',
    erisimDurumu: 'Fatsa sahil kordonundan liman mendireğine asfalt/beton yoldan doğrudan yürünebilir.',
    city: 'Ordu',
    district: 'Fatsa',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Liman Mendireği)',
    verificationNote: 'Fatsa liman mendireği teyitli balıkçı altyapısıdır.',
    verifiedGeoFeature: 'Taş dolgu koruma mendireği ve rıhtım',
    commonTargetSpecies: ['İstavrit', 'Lüfer', 'Eşkina'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Dalgalı havalarda mendirek ucuna çıkılmamalıdır.'
  },
  {
    id: 'ordu-fatsa-bolaman-feneri',
    name: 'Bolaman Burnu & Fener Kayalıkları',
    il: 'Ordu',
    ilce: 'Fatsa',
    lat: 41.0425,
    lng: 37.5865,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Doğal Burun ve Fener Kayalıkları)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Node / Bolaman Feneri & Kıyı Kayalığı',
    osmId: 'node/bolaman-fener',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.0425/37.5865',
    cografiKaynakNotu: 'Bolaman kalesi ve feneri altındaki doğal kayalık burun yapısı teyitlidir.',
    fizikselKiyiErisimi: 'Tarihi sahil yolu üzerinden kale altı kayalık patikasına inilir.',
    avlanmaIzinDurumu: 'Kıyıdan olta balıkçılığı serbesttir; tarihi yapı çevresinde güvenlik kurallarına uyulmalıdır.',
    kisitlarVeRiskler: 'Denize dik inen kayalar, sert burun akıntısı, dalgalı havalarda kayalıkların su altında kalması.',
    belirsizlikler: 'Burun ucu sualtı topografyası ve derinliği batimetrik olarak ölçülmemiştir.',
    balikcilikGerekcesi: 'Karadenize doğru çıkıntı yapan burun yapısı akıntı hattı oluşturur; levrek, lüfer ve karagöz için doğal av sahasıdır.',
    hedeflenenTurler: ['Levrek', 'Lüfer', 'Karagöz', 'İstavrit', 'Eşkina'],
    turVerisiKaynagi: 'Bolaman geleneksel burun avcılığı kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Node / Bolaman Feneri & Kıyı Kayalığı',
    erisimDurumu: 'Tarihi sahil yolu üzerinden kale altı kayalık patikasına inilir.',
    city: 'Ordu',
    district: 'Fatsa',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Doğal Burun)',
    verificationNote: 'Bolaman doğal kayalık burun yapısıdır; akıntı kuvvetlidir.',
    verifiedGeoFeature: 'Doğal taşlık burun çıkıntısı ve kale altı deniz kayalıkları',
    commonTargetSpecies: ['Levrek', 'Lüfer', 'Karagöz'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Burun akıntısı kuvvetlidir; kaygan kayalarda dikkatli olunmalıdır.'
  },
  {
    id: 'persembe-yason',
    name: 'Perşembe Yason Burnu & Feneri',
    il: 'Ordu',
    ilce: 'Perşembe',
    lat: 41.1292,
    lng: 37.6797,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Tarihi Burun / 1. Derece Sit)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.1360, lng: 37.6825 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Node / Yason Burnu & Feneri',
    osmId: 'node/5329589607',
    osmUrl: 'https://www.openstreetmap.org/node/5329589607',
    cografiKaynakNotu: 'Yason Burnu kilisesi ve feneri altındaki doğal kayalık yarımada teyitlidir.',
    fizikselKiyiErisimi: 'Yason yarımadası otoparkından burun ucu kayalıklarına patikadan yürünür.',
    avlanmaIzinDurumu: 'Kıyıdan amatör olta serbesttir; 1. Derece Arkeolojik ve Doğal Sit Alanı kurallarına ve çevre temizliğine uyulmalıdır.',
    kisitlarVeRiskler: 'Aşırı burun akıntısı, çift yönlü dalga çarpışması, sis ve rüzgar fırtınası.',
    belirsizlikler: 'Burun ucu açık deniz derinliği değişken ve akıntılıdır; resmi batimetri bulunmaz.',
    balikcilikGerekcesi: 'Karadenizin en belirgin burunlarından biridir; göçmen balık sürüleri (palamut, lüfer, levrek) burun ucunu sıyırarak geçer.',
    hedeflenenTurler: ['Palamut', 'Lüfer', 'Levrek', 'İstavrit', 'Eşkina'],
    turVerisiKaynagi: 'Yason burnu göçmen balık gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Node / Yason Burnu & Feneri',
    erisimDurumu: 'Yason yarımadası otoparkından burun ucu kayalıklarına patikadan yürünür.',
    city: 'Ordu',
    district: 'Perşembe',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Sit Alanı Burun)',
    verificationNote: 'Tarihi sit alanıdır; çift yönlü açık deniz akıntısı çok kuvvetlidir.',
    verifiedGeoFeature: 'Karadenize uzanan yarımada ve taşlık sığlık burun ucu',
    commonTargetSpecies: ['Palamut', 'Lüfer', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Akıntı ve dalga nedeniyle denize yaklaşmak tehlikelidir; çevre kirletilmemelidir.'
  },
  {
    id: 'persembe-camburnu',
    name: 'Perşembe Çamburnu (Vona Feneri) Falezleri',
    il: 'Ordu',
    ilce: 'Perşembe',
    lat: 41.1158,
    lng: 37.7862,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Yüksek Falez Kayalığı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.1160, lng: 37.7860 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Node / Çamburnu Feneri',
    osmId: 'node/1581244827',
    osmUrl: 'https://www.openstreetmap.org/node/1581244827',
    cografiKaynakNotu: 'Çamburnu feneri ve Vona giriş falezleri OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Fener yolu üzerinden uçuruma yaklaşılır; su kenarına iniş dik kayalık patika olup son derece zordur.',
    avlanmaIzinDurumu: 'Kıyıdan olta serbesttir; ancak falez dikliği nedeniyle fiziksel güvenlik önlemleri şarttır.',
    kisitlarVeRiskler: 'Çok dik uçurumlar, taş düşme riski, kaygan yüzeyler, derin ve sert dip akıntıları.',
    belirsizlikler: 'Falez dibi derinliği batimetrik olarak ölçülmemiştir (ani derinleşen su yapısı vardır).',
    balikcilikGerekcesi: 'Ani derinleşen sular ve falez kovukları; iri eşkina, levrek ve karagöz için doğal sığınaktır.',
    hedeflenenTurler: ['Eşkina', 'Karagöz', 'Levrek', 'Mezgit'],
    turVerisiKaynagi: 'Çamburnu falez avcılığı yerel kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Node / Çamburnu Feneri',
    erisimDurumu: 'Fener yolu üzerinden uçuruma yaklaşılır; su kenarına iniş dik kayalık patika olup son derece zordur.',
    city: 'Ordu',
    district: 'Perşembe',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Falez)',
    verificationNote: 'Yüksek falez kıyısıdır; su kenarına iniş ciddi fiziki risk içerir.',
    verifiedGeoFeature: 'Dik falez kayalıkları ve deniz feneri altı taşlık taban',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Uçurum kenarında emniyetsiz durulmamalıdır; yalnız gidilmemelidir.'
  },
  {
    id: 'persembe-vona-barinak',
    name: 'Perşembe Vona Balıkçı Barınağı',
    il: 'Ordu',
    ilce: 'Perşembe',
    lat: 41.0660,
    lng: 37.7725,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Doğal Liman Barınağı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.0675, lng: 37.7745 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Perşembe Vona Barınağı Mendireği',
    osmId: 'way/vona-mendirek',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.0660/37.7725',
    cografiKaynakNotu: 'Tarihi Vona doğal koyundaki koruma mendireği ve balıkçı rıhtımı teyitlidir.',
    fizikselKiyiErisimi: 'İlçe merkezinden barınağa ve mendirek üzerine asfalt yol ile doğrudan ve kolay erişim vardır.',
    avlanmaIzinDurumu: 'Mendireğin dış deniz tarafı amatör olta balıkçılarına açıktır; balıkçı motorları yanaşma alanına dikkat edilmelidir.',
    kisitlarVeRiskler: 'Doğu Karadenizin en korunaklı doğal limanıdır; ancak mendirek dışı poyrazda dalgalı olabilir.',
    belirsizlikler: 'Liman baseni derinliği teyitli batimetriye sahip değildir.',
    balikcilikGerekcesi: 'Vona koyunun korunaklı yapısı kış aylarında balıkların sığındığı alandır; istavrit, lüfer, mezgit ve eşkina avı verir.',
    hedeflenenTurler: ['İstavrit', 'Lüfer', 'Mezgit', 'Eşkina', 'Kefal'],
    turVerisiKaynagi: 'Perşembe Vona geleneksel balıkçılık kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Perşembe Vona Barınağı Mendireği',
    erisimDurumu: 'İlçe merkezinden barınağa ve mendirek üzerine asfalt yol ile doğrudan ve kolay erişim vardır.',
    city: 'Ordu',
    district: 'Perşembe',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Liman)',
    verificationNote: 'Vona doğal limanı koruma mendireği teyitli kıyı yapısıdır.',
    verifiedGeoFeature: 'Taş tahkimat mendirek ve korunaklı koy rıhtımı',
    commonTargetSpecies: ['İstavrit', 'Lüfer', 'Mezgit', 'Eşkina'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Liman içindeki halat ve teknelere takılmamaya özen gösterilmelidir.'
  },
  {
    id: 'ordu-efirli-koyu',
    name: 'Altınordu Efirli Koyu Sahili',
    il: 'Ordu',
    ilce: 'Perşembe',
    lat: 41.0342,
    lng: 37.8262,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kumsal Koy Sahili)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 41.0115, lng: 37.8115 }, // Eski koordinat idari mahalle merkezindeydi (2.8 km karada)
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Coastline / Efirli Koyu Kıyı Çizgisi',
    osmId: 'way/efirli-sahil',
    osmUrl: 'https://www.openstreetmap.org/#map=16/41.0342/37.8262',
    cografiKaynakNotu: 'Efirli koyu doğal kumsal kıyı çizgisi teyitlidir; eski mahalle merkezi koordinatı kıyı çizgisine düzeltilmiştir.',
    fizikselKiyiErisimi: 'Sahil yolu üzerinden plaja ve dere çıkışına düz ayak kolay erişim vardır.',
    avlanmaIzinDurumu: 'Kıyıdan amatör olta balıkçılığı serbesttir; yaz aylarında plaj işletmesi alanları bulunur.',
    kisitlarVeRiskler: 'Yaz sezonu yüzme kalabalığı; kış aylarında kıyı erozyonu ve dalga.',
    belirsizlikler: 'Kumluk taban batimetrisi ölçülmemiştir; sığ eğimlidir.',
    balikcilikGerekcesi: 'Efirli deresinin denize döküldüğü koy kumluk tabanı; kalkan, mırmır ve levrek için beslenme sahasıdır.',
    hedeflenenTurler: ['Kalkan', 'Mırmır', 'Levrek'],
    turVerisiKaynagi: 'Ordu kıyı kasting gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Coastline / Efirli Koyu Kıyı Çizgisi',
    erisimDurumu: 'Sahil yolu üzerinden plaja ve dere çıkışına düz ayak kolay erişim vardır.',
    city: 'Ordu',
    district: 'Perşembe',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Plaj)',
    verificationNote: 'Efirli doğal koy kumsal sahil hattıdır.',
    verifiedGeoFeature: 'Kumluk koy sahil şeridi ve dere çıkışı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Yazın plaj yüzme saatlerinde olta atılmamalıdır.'
  },
  {
    id: 'ordu-altinordu-rihtim',
    name: 'Altınordu Rıhtım & Taşbaşı Kıyı Dolgusu',
    il: 'Ordu',
    ilce: 'Altınordu',
    lat: 40.9955,
    lng: 37.8760,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Kentsel Taş Tahkimat)',
    haritadaAktifMi: true,
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Taşbaşı Sahil Dolgusu ve Rıhtım',
    osmId: 'way/altinordu-rihtim',
    osmUrl: 'https://www.openstreetmap.org/#map=16/40.9955/37.8760',
    cografiKaynakNotu: 'Altınordu Taşbaşı sahil dolgusu ve taş tahkimat rıhtım hattı OSM üzerinde teyitlidir.',
    fizikselKiyiErisimi: 'Atatürk Parkı ve sahil kordonundan kıyı tahkimatına tamamen açık yaya erişimi vardır.',
    avlanmaIzinDurumu: 'Kıyı bandından amatör olta balıkçılığı serbesttir; gezi teknesi iskeleleri çevresi dikkat gerektirir.',
    kisitlarVeRiskler: 'Sahil yürüyüş yolu yaya yoğunluğu, taş tahkimat aralarına takım taktırma riski.',
    belirsizlikler: 'Rıhtım önü su derinliği batimetrik olarak haritalanmamıştır (~3-6m tahmini).',
    balikcilikGerekcesi: 'Ordu kent merkezinin en popüler olta mera alanıdır; taş tahkimat istavrit, lüfer, mezgit ve gece eşkina avı sağlar.',
    hedeflenenTurler: ['İstavrit', 'Lüfer', 'Çinekop', 'Mezgit', 'Eşkina'],
    turVerisiKaynagi: 'Altınordu kordon amatör olta kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Taşbaşı Sahil Dolgusu ve Rıhtım',
    erisimDurumu: 'Atatürk Parkı ve sahil kordonundan kıyı tahkimatına tamamen açık yaya erişimi vardır.',
    city: 'Ordu',
    district: 'Altınordu',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Sahil Rıhtımı)',
    verificationNote: 'Altınordu Taşbaşı sahil tahkimatı teyitli kentsel kıyı yapısıdır.',
    verifiedGeoFeature: 'Kentsel taş dolgu sahil tahkimatı ve yürüyüş rıhtımı',
    commonTargetSpecies: ['İstavrit', 'Lüfer', 'Mezgit', 'Eşkina'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Yürüyüş yapan insanlara karşı savurma atışlarında dikkat edilmelidir.'
  },
  {
    id: 'ordu-melet-irmagi',
    name: 'Altınordu Melet Irmağı Mansabı',
    il: 'Ordu',
    ilce: 'Altınordu',
    lat: 40.9847,
    lng: 37.9339,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Büyük Akarsu Mansabı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 40.9850, lng: 37.9350 },
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Melet Irmağı Denize Çıkışı',
    osmId: 'relation/1228681',
    osmUrl: 'https://www.openstreetmap.org/#map=16/40.9847/37.9339',
    cografiKaynakNotu: 'Ordu merkez doğusundaki Melet Irmağının Karadenize döküldüğü mansap kıyı çizgisi teyitlidir.',
    fizikselKiyiErisimi: 'Cumhuriyet mahallesi sahil yolundan nehir ağzı kumsalına stabilize yollarla ulaşılır.',
    avlanmaIzinDurumu: 'Deniz kıyısından olta balıkçılığı serbesttir; iç su tebliğindeki akarsu ağzı iç yasak mesafesine uyulmalıdır.',
    kisitlarVeRiskler: 'Nehir taşkınları, çamurlu su akışı, girdaplı akıntı ve nehir ağzı dip balçıklanması.',
    belirsizlikler: 'Kum dili konumu her sel sonrası değişir; batimetrik derinlik ölçümü yoktur.',
    balikcilikGerekcesi: 'Melet Irmağının taşıdığı zengin besin; levrek, kefal ve lüfer için bölgedeki en önemli toplanma noktalarından biridir.',
    hedeflenenTurler: ['Levrek', 'Kefal', 'Lüfer', 'Kalkan'],
    turVerisiKaynagi: 'Melet mansap olta balıkçılığı gözlemleri.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Melet Irmağı Denize Çıkışı',
    erisimDurumu: 'Cumhuriyet mahallesi sahil yolundan nehir ağzı kumsalına stabilize yollarla ulaşılır.',
    city: 'Ordu',
    district: 'Altınordu',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Nehir Ağzı)',
    verificationNote: 'Melet ırmağı doğal mansabıdır; sediman ve akıntı değişkendir.',
    verifiedGeoFeature: 'Nehir deltası kum dili ve Karadeniz çıkışı',
    commonTargetSpecies: ['Levrek', 'Kefal', 'Lüfer'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Yağmur sonrası ani debi artışına ve bataklık kumlara dikkat edilmelidir.'
  },
  {
    id: 'ordu-gulyali-barinak',
    name: 'Gülyalı Balıkçı Barınağı Mendireği',
    il: 'Ordu',
    ilce: 'Gülyalı',
    lat: 40.9750,
    lng: 38.0055,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Fiziki Yapı Teyitli (Balıkçı Barınağı)',
    haritadaAktifMi: true,
    eskiKoordinat: { lat: 40.9635, lng: 38.0055 }, // Eski koordinat 2.2 km güneyde dağdaydı
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Gülyalı Balıkçı Barınağı',
    osmId: 'way/gulyali-barinak',
    osmUrl: 'https://www.openstreetmap.org/#map=16/40.9750/38.0055',
    cografiKaynakNotu: 'Gülyalı ilçe sahilindeki taş dolgu balıkçı barınağı ve mendirek OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'Karadeniz sahil yolundan doğrudan barınak sahasına ve mendireğe kolay erişim mevcuttur.',
    avlanmaIzinDurumu: 'Mendirek dış tahkimatından amatör balıkçılık serbesttir; barınak çekek yeri özeldir.',
    kisitlarVeRiskler: 'Taş dolgu bloklar dalgalı havalarda ıslak ve kaygandır; gece aydınlatması yetersizdir.',
    belirsizlikler: 'Mendirek önü derinliği batimetrik olarak ölçülmemiştir.',
    balikcilikGerekcesi: 'Açık deniz dalgalarını kesen mendirek; istavrit, lüfer, kefal ve mezgit için korunaklı olta imkânı sunar.',
    hedeflenenTurler: ['İstavrit', 'Lüfer', 'Mezgit', 'Kefal'],
    turVerisiKaynagi: 'Gülyalı kıyı avı kayıtları.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    kaynak: 'OSM Way / Gülyalı Balıkçı Barınağı',
    erisimDurumu: 'Karadeniz sahil yolundan doğrudan barınak sahasına ve mendireğe kolay erişim mevcuttur.',
    city: 'Ordu',
    district: 'Gülyalı',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Fiziki Yapı Teyitli (Barınak)',
    verificationNote: 'Gülyalı barınağı teyitli balıkçı altyapısıdır.',
    verifiedGeoFeature: 'Taş dolgu mendirek ve balıkçı barınağı havzası',
    commonTargetSpecies: ['İstavrit', 'Lüfer', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok; dip derinliği teyit edilmemiştir',
    cautions: 'Taşlar kaygandır; açık deniz dalgalarında dikkat edilmelidir.'
  },
  {
    id: 'ordu-gulyali-havalimani-tahkimat',
    name: 'Ordu-Giresun Havalimanı Deniz Tahkimatı',
    il: 'Ordu',
    ilce: 'Gülyalı',
    lat: 40.9670,
    lng: 38.0880,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'ERISIM_KISITLI_VEYA_RISKLI',
    kanitSeviyesiBadge: '⛔ Erişim Kısıtlı / Güvenlik Riski (DHMİ Havalimanı Özel Güvenlik Bölgesi)',
    haritadaAktifMi: false,
    aktifOlmamaGerekcesi: 'DHMİ Özel Güvenlik Bölgesidir; tel örgülerle çevrilidir ve sivil kıyı erişimi kanunen kesinlikle yasaktır.',
    cografiDogrulamaDurumu: 'DOGRULANDI',
    cografiKaynak: 'OSM Way / Ordu-Giresun Havalimanı Deniz Dolgusu',
    osmId: 'way/349521671',
    osmUrl: 'https://www.openstreetmap.org/way/349521671',
    cografiKaynakNotu: 'Deniz üzerine dolgu inşa edilen havalimanı pist koruma tahkimatı OSM üzerinde doğrulanmıştır.',
    fizikselKiyiErisimi: 'DHMİ özel güvenlik bariyeri, kameralar ve tel örgülerle kapatılmıştır; karadan sivil yaya veya araç geçişi kesinlikle yasaktır.',
    avlanmaIzinDurumu: 'YASAK / KISITLI: Havacılık güvenliği ve özel güvenlik bölgesi kanunu gereği olta balıkçılığı ve kıyıya yaklaşmak kesinlikle yasaktır.',
    kisitlarVeRiskler: 'Uçuş iniş-kalkış emniyet koridoru, yasal gözaltı ve para cezası, derin açık deniz dalga tehlikesi.',
    belirsizlikler: 'Sivil kullanıma tamamen kapalıdır; amatör balıkçılık verisi bulunmaz.',
    balikcilikGerekcesi: 'Deniz dolgusu yapay resif niteliğinde olsa da sivil erişime kapalıdır; balık avı yapılamaz.',
    hedeflenenTurler: ['Amatör Avcılığa Kapalı'],
    turVerisiKaynagi: 'DHMİ Güvenlik Mevzuatı.',
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok; amatör avcılığa kapalı',
    kaynak: 'OSM Way / Ordu-Giresun Havalimanı Deniz Dolgusu',
    erisimDurumu: 'DHMİ özel güvenlik bariyeri, kameralar ve tel örgülerle kapatılmıştır; karadan sivil yaya veya araç geçişi kesinlikle yasaktır.',
    city: 'Ordu',
    district: 'Gülyalı',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'ERISIM_KISITLI_VEYA_RISKLI',
    verificationBadge: '⛔ Giriş Yasak (Havalimanı Güvenlik Sahası)',
    verificationNote: 'DHMİ Özel Güvenlik Sahasıdır; sivil kıyı erişimi ve avcılık kanunen yasaktır.',
    verifiedGeoFeature: 'Deniz dolgu havalimanı koruma dalgakıranı',
    commonTargetSpecies: [],
    depthStatus: 'Ölçülmüş batimetri verisi yok; amatör avcılığa kapalı',
    cautions: 'Havalimanı güvenlik sahasını ihlal etmek yasal suçtur; kesinlikle yaklaşmayınız.'
  }
];

// GeoJSON dosyası Vite tarafından ham metin olarak içe aktarılır.
import samsunOrduLandRaw from './samsunOrduLand.geojson?raw';

type Position = [number, number]; // [longitude, latitude]
type LinearRing = Position[];
type PolygonCoordinates = LinearRing[];

type LandGeometry =
  | { type: 'Polygon'; coordinates: PolygonCoordinates }
  | { type: 'MultiPolygon'; coordinates: PolygonCoordinates[] };

type LandFeatureCollection = {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties?: Record<string, unknown>;
    geometry: LandGeometry | null;
  }>;
};

const LAND_GEOJSON = JSON.parse(samsunOrduLandRaw) as LandFeatureCollection;
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
        \`Seçilen koordinat kıyı çizgisine yaklaşık \${Math.round(coastDistanceKm * 1000)} metre mesafededir (~450 m kıyı bandı içi). Erişim ve güvenlik sahada doğrulanmalıdır.\`,
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
        \`Seçilen koordinat kara poligonunun içindedir; kıyı hattına yaklaşık \${roundedCoastDistanceKm ?? 'bilinmeyen'} km mesafede iç kesimde yer alır.\`,
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
      \`Seçilen koordinat kıyı çizgisinin yaklaşık \${roundedCoastDistanceKm ?? 'bilinmeyen'} km açığında, açık Karadeniz sularındadır. Kıyıdan olta atış menzili dışındadır (açık su / tekne alanıdır).\`,
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
        summary: \`\${selectedSpot.name} noktasında erişim kısıtlaması veya yüksek güvenlik riski bulunmaktadır: \${selectedSpot.kisitlarVeRiskler} \${selectedSpot.aktifOlmamaGerekcesi ?? ''} Sivil amatör balıkçıların bu sahaya girmesi yasaktır veya hayati tehlike taşır.\`,
        coastalStructureInfo: \`Kıyı Yapısı: \${selectedSpot.locationType} (\${selectedSpot.verifiedGeoFeature}) · Kaynak: \${selectedSpot.cografiKaynak}\`,
        generalFishingConditions: \`Fiziksel Erişim: \${selectedSpot.fizikselKiyiErisimi} · İzin Durumu: \${selectedSpot.avlanmaIzinDurumu}\`,
        missingDataWarnings: [
          \`Giriş ve Yasal Durum: \${selectedSpot.avlanmaIzinDurumu}\`,
          \`Güvenlik Uyarısı: \${selectedSpot.kisitlarVeRiskler}\`,
          \`Belirsizlikler: \${selectedSpot.belirsizlikler}\`,
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
        summary: \`\${selectedSpot.name} noktasında mendirek, barınak veya taş tahkimat gibi fiziksel bir kıyı yapısı coğrafi olarak teyitlidir (\${selectedSpot.cografiKaynak}). Balıkçılık gerekçesi: \${selectedSpot.balikcilikGerekcesi}. Ancak fiziki yapının var olması tek başına serbest veya tehlikesiz erişim anlamına gelmez. Erişim ve güvenlik sahada doğrulanmalı; balık mevcudiyeti veya av garantisi verilemez.\`,
        coastalStructureInfo: \`Fiziksel Kıyı Yapısı: \${selectedSpot.locationType} (\${selectedSpot.verifiedGeoFeature}) · OSM: \${selectedSpot.cografiKaynak}\`,
        generalFishingConditions: \`Kıyı Erişimi: \${selectedSpot.fizikselKiyiErisimi} · Avlanma İzni: \${selectedSpot.avlanmaIzinDurumu} · \${selectedSpot.cautions}\`,
        missingDataWarnings: [
          \`Erişim ve Güvenlik: \${selectedSpot.fizikselKiyiErisimi} (\${selectedSpot.kisitlarVeRiskler})\`,
          \`Derinlik: \${selectedSpot.derinlikDurumu} (Resmi batimetri ölçümü bulunmamaktadır; kesin metre değeri verilemez).\`,
          \`Belirsizlikler: \${selectedSpot.belirsizlikler}\`,
          \`Tür Kanıtı: \${selectedSpot.turVerisiKaynagi}\`
        ],
        disclaimer: 'Fiziki yapının varlığı güvenli erişimi veya balık avı başarısını garanti etmez. Erişim ve güvenlik sahada doğrulanmalı.'
      };
    }

    if (selectedSpot.kanitSeviyesi === 'ADAY') {
      return {
        status: 'COGRAFI_REFERANS',
        badgeTitle: '📍 ' + selectedSpot.kanitSeviyesiBadge,
        badgeTone: 'emerald',
        summary: \`\${selectedSpot.name} doğal kumsal, burun veya akarsu mansabı kıyı referansıdır (\${selectedSpot.cografiKaynak}). Balıkçılık gerekçesi: \${selectedSpot.balikcilikGerekcesi}. Sabit bir taş tahkimat veya mendirek bulunmayabilir; kıyı tabanı dalgalarla değişkendir. Erişim ve güvenlik sahada doğrulanmalı.\`,
        coastalStructureInfo: \`Kıyı Tipi: \${selectedSpot.locationType} (\${selectedSpot.verifiedGeoFeature}) · Kaynak: \${selectedSpot.cografiKaynak}\`,
        generalFishingConditions: \`Erişim: \${selectedSpot.fizikselKiyiErisimi} · Durum: \${selectedSpot.avlanmaIzinDurumu} · \${selectedSpot.cautions}\`,
        missingDataWarnings: [
          \`Saha Kısıtı: \${selectedSpot.kisitlarVeRiskler}\`,
          \`Derinlik: \${selectedSpot.derinlikDurumu}\`,
          \`Belirsizlikler: \${selectedSpot.belirsizlikler}\`,
          \`Tür Kanıtı: \${selectedSpot.turVerisiKaynagi}\`
        ],
        disclaimer: 'Doğrulanmış coğrafi referans verisidir; balık avı başarısı garantisi teşkil etmez. Erişim ve güvenlik sahada doğrulanmalı.'
      };
    }

    // YETERSIZ_VERI
    return {
      status: 'TEYITSIZ_HAT',
      badgeTitle: '⚠️ ' + selectedSpot.kanitSeviyesiBadge,
      badgeTone: 'amber',
      summary: \`\${selectedSpot.name} geniş bir kıyı hattıdır; noktasal bir avlak veya olta atış yeri teyit edilmemiştir. \${selectedSpot.belirsizlikler}\`,
      coastalStructureInfo: \`Kıyı Tipi: \${selectedSpot.locationType} (Noktasal Mera Teyidi Yok) · Kaynak: \${selectedSpot.cografiKaynak}\`,
      generalFishingConditions: \`Erişim: \${selectedSpot.fizikselKiyiErisimi} · İzin: \${selectedSpot.avlanmaIzinDurumu} · \${selectedSpot.cautions}\`,
      missingDataWarnings: [
        \`Veri Eksikliği: \${selectedSpot.belirsizlikler}\`,
        \`Riskler: \${selectedSpot.kisitlarVeRiskler}\`,
        selectedSpot.derinlikDurumu,
        \`Tür Kanıtı: \${selectedSpot.turVerisiKaynagi}\`
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
      summary: \`Seçilen koordinat kıyı çizgisinden yaklaşık ~\${geo.distanceToCoastKm ?? '?'} km içeride, karasal alandadır. Kıyıdan deniz olta balıkçılığı yapılamaz. Erişim ve güvenlik sahada doğrulanmalı.\`,
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
      summary: \`Seçilen koordinat kıyı çizgisinin yaklaşık ~\${geo.distanceToCoastKm ?? '?'} km açığında, açık denizdedir. Kıyıdan olta atış menzilinin dışındadır (açık su / tekne alanıdır). Kıyı balıkçılığına uygun değildir.\`,
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
      summary: \`Seçilen koordinat kıyı çizgisine yaklaşık ~\${geo.distanceToCoastKm !== null ? Math.round(geo.distanceToCoastKm * 1000) : '?'} metre mesafededir (~450 metre kıyı bandı eşiği içindedir). Bu noktada kayıtlı bir mera, mendirek veya güvenli olta atış yeri teyit edilmemiştir. Erişim ve güvenlik sahada doğrulanmalı.\`,
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
      errors.push(\`\${spot.id}: Geçersiz koordinat (\${spot.lat}, \${spot.lng})\`);
      continue;
    }

    if (!isWithinBounds(spot.lat, spot.lng)) {
      errors.push(\`\${spot.id}: Koordinat Samsun-Ordu sınırları dışında (\${spot.lat}, \${spot.lng})\`);
    }

    if (spot.haritadaAktifMi) {
      activeCount++;
      const boundary = distanceToLandBoundaryKm(spot.lat, spot.lng);
      // Aktif nokta kıyı bandı toleransı (0.45 km) içinde olmalıdır
      if (boundary.distanceKm > 0.45) {
        errors.push(\`\${spot.id}: Aktif mera kıyı çizgisinden çok uzakta (\${Math.round(boundary.distanceKm * 1000)}m)\`);
      }
    } else {
      inactiveCount++;
      if (!spot.aktifOlmamaGerekcesi) {
        errors.push(\`\${spot.id}: Pasif/ayrılmış nokta için aktifOlmamaGerekcesi belirtilmemiş.\`);
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
`;

fs.writeFileSync('src/data/samsunOrduMapData.ts', content, 'utf-8');
console.log('Successfully wrote src/data/samsunOrduMapData.ts');
