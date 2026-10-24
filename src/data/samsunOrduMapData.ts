
export type CoastalLocationType =
  | 'Mendirek / Taş Tahkimat'
  | 'Liman / Barınak İçi'
  | 'Doğal Kayalık Burun'
  | 'Kumsal / Plaj Şeridi'
  | 'Nehir / Dere Ağzı'
  | 'Açık Deniz'
  | 'Karasal Alan';

export type SpotVerificationStatus =
  | 'FIZIKI_YAPI_TEYITLI'
  | 'COGRAFI_REFERANS_NOKTASI'
  | 'GENIS_HAT_TEYITSIZ';

export interface VerifiedCoastalSpot {
  id: string;
  name: string;
  city: 'Samsun' | 'Ordu';
  district: string;
  lat: number;
  lng: number;
  locationType: CoastalLocationType;
  verificationStatus: SpotVerificationStatus;
  verificationBadge: string;
  verificationNote: string;
  verifiedGeoFeature: string;
  commonTargetSpecies: string[];
  depthStatus: string;
  cautions: string;
}

export const SAMSUN_ORDU_BOUNDS: [[number, number], [number, number]] = [
  [40.90, 36.05],
  [41.48, 38.20]
];

export const SAMSUN_ORDU_CENTER: [number, number] = [41.15, 37.15];

// Geriye dönük uyumluluk için güncellenmiş yaklaşık kıyı referans noktaları.
export const SAMSUN_ORDU_COASTLINE: [number, number][] = [
  [41.4725, 36.1121],
  [41.4355, 36.1488],
  [41.3726, 36.2316],
  [41.3446, 36.2617],
  [41.3172, 36.3195],
  [41.3097, 36.3555],
  [41.2915, 36.3340],
  [41.2736, 36.3675],
  [41.2301, 36.4517],
  [41.2650, 36.5350],
  [41.3867, 36.6542],
  [41.1830, 37.0369],
  [41.1550, 37.1145],
  [41.1479, 37.1685],
  [41.1320, 37.2412],
  [41.1308, 37.2836],
  [41.1440, 37.2900],
  [41.1417, 37.3117],
  [41.1130, 37.3303],
  [41.0517, 37.6117],
  [41.0440, 37.4900],
  [41.0367, 37.5911],
  [41.1134, 37.7127],
  [41.1330, 37.6824],
  [41.1319, 37.8050],
  [41.0791, 37.7953],
  [41.0223, 37.8200],
  [40.9957, 37.8761],
  [40.9852, 37.9348],
  [40.9685, 38.0195]
];

// Doğrulanmış kıyı yapıları ve coğrafi referans noktaları (30 nokta)
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  {
    id: 'samsun-derekoy',
    name: 'Dereköy Balıkçı Barınağı & Mendirek',
    city: 'Samsun',
    district: '19 Mayıs',
    lat: 41.4725,
    lng: 36.1121,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Barınak / Mendirek)',
    verificationNote: 'Dereköy balıkçı barınağı taş mendireğinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Karadeniz açıklarına uzanan yapay taş mendirek ve korunaklı iç havuz',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Levrek', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Mendirek dışı dalgalı havalarda ıslanır; kaygan taşlara dikkat ediniz.'
  },
  {
    id: 'samsun-taflan',
    name: 'Taflan Sahili & Kumluk Kıyı',
    city: 'Samsun',
    district: 'Atakum',
    lat: 41.4355,
    lng: 36.1488,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Sahil)',
    verificationNote: 'Taflan Yalı sahil bandının su çizgisi coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Geniş kumluk kıyı şeridi; surf casting atışına elverişli sahil',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kuzey rüzgarlarında kıyı dalgalanması artar.'
  },
  {
    id: 'samsun-kurupelit',
    name: 'Kurupelit Yat Limanı Mendireği',
    city: 'Samsun',
    district: 'Atakum',
    lat: 41.3726,
    lng: 36.2316,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Marina Mendireği)',
    verificationNote: 'Kurupelit yapay marina dairesel mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Dairesel taş dolgu marin mendirek yapısı',
    commonTargetSpecies: ['İstavrit', 'Mezgit', 'Çinekop', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'İç limanda tekne halatlarına ve seyre dikkat edilmelidir.'
  },
  {
    id: 'samsun-atakum-iskele',
    name: 'Atakum İskele Önü Sahili',
    city: 'Samsun',
    district: 'Atakum',
    lat: 41.3446,
    lng: 36.2617,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (İskele / Sahil)',
    verificationNote: 'Atakum halk plajı ve Çobanlı sahil iskelesinin coğrafi konumu teyitlidir. Balık verimi ve derinlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Kumluk sahil şeridi ve ahşap gezi iskelesi kıyı hattı',
    commonTargetSpecies: ['Mırmır', 'Levrek', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Yaz aylarında yüzme alanı; akşam veya sabah erken saatler tercih edilir.'
  },
  {
    id: 'samsun-baruthane',
    name: 'Samsun Batı Park Mendireği',
    city: 'Samsun',
    district: 'İlkadım',
    lat: 41.3172,
    lng: 36.3195,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Mendirek)',
    verificationNote: 'Batıpark balıkçı barınağı taş blok mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, su derinliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Batıpark ve Amazon Adası sahilinde Karadeniz’e uzanan yapay taş blok mendirek yapısı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kayalık ve yosunlu taş zemin; kayma riski. Akıntılı havalarda dip takımı takılabilir.'
  },
  {
    id: 'samsun-liman-kuzey',
    name: 'Samsun Limanı Kuzey Mendireği',
    city: 'Samsun',
    district: 'İlkadım',
    lat: 41.3097,
    lng: 36.3555,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Büyük Liman Mendireği)',
    verificationNote: 'Samsun Limanı ana dış mendirek fener ucunun fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Büyük liman koruma mendireği ve fener taş tahkimatı',
    commonTargetSpecies: ['Lüfer', 'Çinekop', 'Palamut', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Giriş izinlerini kontrol ediniz; liman operasyon sahalarına yaklaşmayınız.'
  },
  {
    id: 'samsun-mert-irmagi',
    name: 'Samsun Mert Irmağı Ağzı',
    city: 'Samsun',
    district: 'Canik',
    lat: 41.2915,
    lng: 36.3340,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Mert Irmağı ağzı su kavşağının coğrafi konumu teyitlidir. Balık verimi, su derinliği, kum bankı değişkenliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Mert Irmağı’nın Karadeniz ile buluştuğu kumsal alüvyon sahil mansap kesimi',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kefal', 'Kalkan'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Yağmur sonrası bulanık su; dip akıntısı ve değişken sığ kum bankları.'
  },
  {
    id: 'samsun-dogupark',
    name: 'Samsun Doğupark Sahil Bandı',
    city: 'Samsun',
    district: 'Canik',
    lat: 41.2736,
    lng: 36.3675,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Kıyı Taş Dolgu)',
    verificationNote: 'Doğupark Bandırma Vapuru sahil boyu taş tahkimat dolgusunun fiziki varlığı teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Taş blok dolgulu kıyı yürüyüş bandı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'İskorpit', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Halk yürüyüş yolu kenarı; arkadaki yayalara dikkat edilmeli.'
  },
  {
    id: 'samsun-tekkekoy',
    name: 'Tekkeköy Tersane Kıyısı',
    city: 'Samsun',
    district: 'Tekkeköy',
    lat: 41.2301,
    lng: 36.4517,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Tersane Kıyısı)',
    verificationNote: 'Tekkeköy Tersanesi mendirek ve sahil kıyı çizgisinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Tersane sanayi rıhtımı ve çakıl karışık sahil bandı',
    commonTargetSpecies: ['Levrek', 'Kefal', 'Mırmır'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Sanayi bölgesi kıyısı; zemin değişkenliği olabilir.'
  },
  {
    id: 'carsamba-civa-burnu',
    name: 'Yeşilırmak Deltası Civa Burnu',
    city: 'Samsun',
    district: 'Çarşamba',
    lat: 41.3867,
    lng: 36.6542,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Delta Ağzı)',
    verificationNote: 'Yeşilırmak’ın denize karıştığı delta en kuzey kara ucunun coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Yeşilırmak deltası en kuzey alüvyon burun ve fener kıyı hattı',
    commonTargetSpecies: ['Levrek', 'Kalkan', 'Minekop', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Irmak debisine göre sığlık ve akıntı hızla değişir; bataklık alanlara dikkat.'
  },
  {
    id: 'carsamba-sahil',
    name: 'Çarşamba Kostur Sahili',
    city: 'Samsun',
    district: 'Çarşamba',
    lat: 41.2650,
    lng: 36.5350,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'GENIS_HAT_TEYITSIZ',
    verificationBadge: 'Geniş Kıyı Hattı (Avlak Teyitsiz)',
    verificationNote: 'Çarşamba Costal (Kostur) sahil bandıdır; tekil ve doğrulanmış bir balık avı merası konumu değildir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Geniş açık kumluk plaj sahili bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Minekop', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Geniş kumluk kıyı; dip takımı ve surf kamış gerektirir. Çeken akıntı (rip) riski.'
  },
  {
    id: 'terme-milic',
    name: 'Terme Miliç Sahili & Dere Ağzı',
    city: 'Samsun',
    district: 'Terme',
    lat: 41.1830,
    lng: 37.0369,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Kıyı)',
    verificationNote: 'Yalnızca Miliç Çamlığı ve plaj sahilinin coğrafi konumu teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Miliç Çamı orman eteği kumsal kıyı hattı',
    commonTargetSpecies: ['Kalkan', 'Levrek', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kuzey rüzgarlarında yüksek dalga ve kıyı köpüklenmesi.'
  },
  {
    id: 'terme-sakarli',
    name: 'Terme Sakarlı & Kocaman Sahili',
    city: 'Samsun',
    district: 'Terme',
    lat: 41.1550,
    lng: 37.1145,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Sahil)',
    verificationNote: 'Sakarlı / Kozluk mevkiinde Kocaman deresinin denize kavuştuğu sahil çizgisinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Sakarlı deresi ağzı ve geniş kumul kıyı bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Sığ eğimli kumsal; rüzgarlı havalarda dip dalgası oluşur.'
  },
  {
    id: 'unye-akcay',
    name: 'Akçay Deresi Ağzı (Samsun-Ordu Sınırı)',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1479,
    lng: 37.1685,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Samsun-Ordu il sınırını oluşturan Akçay Deresi ağzı sahil kavşağının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Sınır deresi ağzı çakıllı ve kumsal kıyı kavşağı',
    commonTargetSpecies: ['Levrek', 'Kefal', 'Kalkan'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Dere akıntısına göre kum tepecikleri yer değiştirir.'
  },
  {
    id: 'unye-golevi',
    name: 'Ünye Gölevi Kumsalı',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1320,
    lng: 37.2412,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Plaj Şeridi)',
    verificationNote: 'Gölevi sahil şeridi plaj su çizgisinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Ünye batı girişinde yer alan doğal açık kumsal kıyı',
    commonTargetSpecies: ['Kalkan', 'Levrek', 'Mırmır'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Açık deniz dalgasına açıktır.'
  },
  {
    id: 'unye-burunucu',
    name: 'Ünye Burunucu Sahili',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1308,
    lng: 37.2836,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kayalık Burun)',
    verificationNote: 'Burunucu / Taşhane yarımadası feneraltı kayalık ucunun coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Yarımada burun yapısı ve feneraltı kırık kıyı kayalıkları',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kayalık zemin takılma riski taşır.'
  },
  {
    id: 'unye-camlik',
    name: 'Ünye Çamlık Sahili & Falezleri',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1440,
    lng: 37.2900,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Doğal Kayalık)',
    verificationNote: 'Yalnızca Çamlık falez ve doğal kayalık burun sahilinin coğrafi konumu teyitlidir. Balık verimi, su derinliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Falez ve doğal volkanik kayalık burun sahil şeridi',
    commonTargetSpecies: ['Levrek', 'İstavrit', 'Eşkina', 'Karagöz'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Sarp kayalık zemin; sahte yem takılma riski yüksek (LRF ve spin tercih edilir).'
  },
  {
    id: 'unye-liman-mendirek',
    name: 'Ünye Liman Mendireği (Ana Fener)',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1417,
    lng: 37.3117,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Liman / Mendirek)',
    verificationNote: 'Yalnızca Ünye Balıkçı Barınağı ana dış mendireği ve fenerinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Ünye Limanı dış mendireği ve açık deniz taş dolgusu',
    commonTargetSpecies: ['Çinekop', 'Lüfer', 'İstavrit', 'Palamut', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Açık deniz tarafında sert Karadeniz çalkantısı ve rüzgar.'
  },
  {
    id: 'unye-cevizdere',
    name: 'Ünye Cevizdere Ağzı',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1130,
    lng: 37.3303,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Cevizdere’nin Karadeniz’e döküldüğü mansap ağzının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Liman yakını çakıllı ve kumul dere-deniz kavşağı',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Debi yağışla hızla artabilir; taban çakıllıdır.'
  },
  {
    id: 'fatsa-yalikoy',
    name: 'Fatsa Yalıköy Balıkçı Barınağı',
    city: 'Ordu',
    district: 'Fatsa',
    lat: 41.0517,
    lng: 37.6117,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Koy Barınağı)',
    verificationNote: 'Yalıköy doğal koyu içindeki balıkçı barınağı taş yapısının fiziki varlığı teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Doğal koy içine inşa edilmiş mendirek ve balıkçı rıhtımı',
    commonTargetSpecies: ['İstavrit', 'Eşkina', 'Mezgit', 'Palamut'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Gece avında aydınlatma gereklidir.'
  },
  {
    id: 'fatsa-mendirek',
    name: 'Fatsa Balıkçı Barınağı Mendireği',
    city: 'Ordu',
    district: 'Fatsa',
    lat: 41.0440,
    lng: 37.4900,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Barınak / Mendirek)',
    verificationNote: 'Yalnızca Fatsa Balıkçı Barınağı mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Fatsa Körfezi mendireği ve korunaklı iç liman',
    commonTargetSpecies: ['İstavrit', 'Minekop', 'Palamut', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Tekne trafiği olan kanallara olta atmayınız.'
  },
  {
    id: 'fatsa-bolaman',
    name: 'Fatsa Bolaman Kalesi & Burnu',
    city: 'Ordu',
    district: 'Fatsa',
    lat: 41.0367,
    lng: 37.5911,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Tarihi Burun)',
    verificationNote: 'Bolaman Kalesi önündeki doğal kayalık burun yapısının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Tarihi kale önü sarp kaya dili ve kırık taş zemin',
    commonTargetSpecies: ['Levrek', 'Eşkina', 'Karagöz', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kırık taşlık zemin takım taktırabilir; LRF ve hafif spin önerilir.'
  },
  {
    id: 'persembe-caka',
    name: 'Perşembe Medreseönü / Çaka Koyu',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.1134,
    lng: 37.7127,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Doğal Koy)',
    verificationNote: 'Çaka beyaz kum koyu ve Medreseönü kayalıklarının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Doğal korunaklı beyaz kumsal koy ve burun kayalıkları',
    commonTargetSpecies: ['İstavrit', 'Levrek', 'Eşkina'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Koy içi sığ, burun ucu aniden derinleşir.'
  },
  {
    id: 'persembe-yason',
    name: 'Perşembe Yason Burnu & Feneri',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.1330,
    lng: 37.6824,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Doğal Burun)',
    verificationNote: 'Yalnızca Yason Burnu doğal kara çıkıntısının coğrafi konumu teyitlidir. Balık verimi, su altı derinliği, akıntı şiddeti ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Karadeniz’e dik uzanan tarihi Yason Burnu doğal kaya dili ve feneri',
    commonTargetSpecies: ['Lüfer', 'Palamut', 'Levrek', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Şiddetli burun akıntısı ve ters dalga; kayalık üzerinde dikkatli olunmalı.'
  },
  {
    id: 'persembe-cam-burnu',
    name: 'Perşembe Çam Burnu & Koyu',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.1319,
    lng: 37.8050,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kayalık Burun)',
    verificationNote: 'Çamburnu (Vona Burnu) kayalık çıkıntısı ve fenerinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Kaleyaka Çamburnu mevkii doğal kayalık burun ve feneri',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Gece avında kayalara dikkat edilmelidir.'
  },
  {
    id: 'persembe-vona',
    name: 'Perşembe Vona Limanı',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.0791,
    lng: 37.7953,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Liman / Rıhtım)',
    verificationNote: 'Yalnızca Perşembe Vona Limanı rıhtım ve mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Doğal korunaklı derin Vona koyu ve balıkçı rıhtımı mendireği',
    commonTargetSpecies: ['Eşkina', 'İstavrit', 'Karagöz', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Gece avında aydınlatma gerekir. Rıhtım kenarları yosunlu olabilir.'
  },
  {
    id: 'ordu-efirli',
    name: 'Altınordu Efirli Koyu Sahili',
    city: 'Ordu',
    district: 'Altınordu',
    lat: 41.0223,
    lng: 37.8200,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Koyu)',
    verificationNote: 'Efirli sahil koyu plaj su çizgisinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Doğal hilal biçimli kumsal koy sahil şeridi',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Sığ kumluk; surf atışları için uygundur.'
  },
  {
    id: 'ordu-tasbasi',
    name: 'Ordu Rıhtım & Taşbaşı Kıyısı',
    city: 'Ordu',
    district: 'Altınordu',
    lat: 40.9957,
    lng: 37.8761,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Rıhtım / Dolgu)',
    verificationNote: 'Yalnızca Altınordu Taşbaşı sahil dolgusu ve 19 Eylül rıhtım iskelesinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Altınordu sahil dolgusu, Taşbaşı kayalık hattı ve iskele',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Halk yürüyüş yolu üzeri; atış esnasında arkadaki yayalara dikkat edilmeli.'
  },
  {
    id: 'ordu-melet',
    name: 'Ordu Melet Irmağı Ağzı',
    city: 'Ordu',
    district: 'Altınordu',
    lat: 40.9852,
    lng: 37.9348,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Melet Irmağı’nın Karadeniz’e döküldüğü ağız sahil kavşağının coğrafi konumu teyitlidir. Balık verimi, derinlik, taban akıntısı ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Melet Irmağı mansabının denize karıştığı çakıl ve kumsal hat',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kalkan', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Irmak akıntısı ve çakıllı değişken zemin.'
  },
  {
    id: 'ordu-gulyali',
    name: 'Gülyalı Balıkçı Barınağı Mendireği',
    city: 'Ordu',
    district: 'Gülyalı',
    lat: 40.9685,
    lng: 38.0195,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Barınak Mendireği)',
    verificationNote: 'Gülyalı balıkçı barınağı taş mendireğinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Gülyalı korunaklı balıkçı barınağı taş mendireği ve feneri',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Mendirek dışı kayalık ve dalgalıdır.'
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
const CLIP_EDGE_TOLERANCE = 0.0002;

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

function isLandPoint(lat: number, lng: number): boolean {
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

  const northEdge =
    Math.abs(aLat - 41.50) < CLIP_EDGE_TOLERANCE &&
    Math.abs(bLat - 41.50) < CLIP_EDGE_TOLERANCE;

  return westEdge || eastEdge || southEdge || northEdge;
}

interface LandBoundaryResult {
  distanceKm: number;
  closestLat: number;
  closestLng: number;
}

function distanceToLandBoundaryKm(lat: number, lng: number): LandBoundaryResult {
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
      geometry.coordinates.forEach(visitRing);
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(polygon =>
        polygon.forEach(visitRing)
      );
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
    'Sınıflandırma, samsunOrduLand.geojson içindeki genelleştirilmiş kara poligonu sınırına dayanır. Bu veri resmî kadastro kıyı kenar çizgisi veya batimetri (derinlik) değildir; 450 metre kıyı bandı yaklaşık geometrik bir eşiktir.';

  // 1. Veri yetersizliği veya sınır hesaplama hatası kontrolü (Belirsiz)
  if (!Number.isFinite(coastDistanceKm) || coastDistanceKm === Infinity) {
    return {
      zone: 'Belirsiz (Coğrafi Veriyle Doğrulanamadı)',
      zoneType: 'belirsiz',
      isWithinBounds: true,
      distanceToCoastKm: null,
      description:
        'Mevcut GeoJSON kara poligonu geometrisi üzerinden kıyı çizgisi mesafesi hesaplanamadı; coğrafi sınıflandırma belirsizdir.',
      nearestSpot,
      distanceToNearestSpotKm: roundedSpotDistanceKm,
      dataNotice
    };
  }

  // 2. Kıyı şeridi (~450 metre geometrik eşik içi)
  if (coastDistanceKm <= COASTAL_BAND_KM) {
    return {
      zone: 'Kıyı / Kıyıya Yakın',
      zoneType: 'kiyi',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        `Seçilen koordinat GeoJSON kara-deniz sınırına yaklaşık ${Math.round(coastDistanceKm * 1000)} metre mesafededir. Bu mesafe kıyıdan amatör olta atış ve erişim eşiği (~450 m geometrik kıyı bandı) içindedir.`,
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
        `Seçilen koordinat GeoJSON kara poligonunun içindedir; kıyı hattına yaklaşık ${roundedCoastDistanceKm ?? 'bilinmeyen'} km mesafede iç kesimde yer alır.`,
      nearestSpot: minSpotDistanceKm <= 3 ? nearestSpot : null,
      distanceToNearestSpotKm:
        minSpotDistanceKm <= 3 ? roundedSpotDistanceKm : null,
      dataNotice
    };
  }

  // 4. Poligon dışındaki noktalar için Karadeniz doğrulaması:
  // Samsun–Ordu'da Karadeniz kuzeydedir. Nokta kıyı çizgisinin güneyinde kalıyorsa kara verisindeki boşluk veya kesim hatasıdır.
  if (lat < boundary.closestLat - 0.015) {
    return {
      zone: 'Belirsiz (Coğrafi Veriyle Doğrulanamadı)',
      zoneType: 'belirsiz',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        'Seçilen koordinat kıyı çizgisinin güneyinde kalmasına rağmen kara poligonu kapsamı dışındadır. Geometrik veri çelişkili veya yetersiz olduğundan deniz ya da kara olarak kesin sınıflandırılamamıştır.',
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
      coastalStructureInfo: 'Bölge Dışı Alan',
      generalFishingConditions: 'Samsun veya Ordu kıyı sınırları içine odaklanınız.',
      missingDataWarnings: ['Bölgesel kıyı veri tabanı kapsamı dışındadır.'],
      disclaimer: 'Analiz sınırları dışındaki alanlar için avlanma uygunluğu değerlendirmesi yapılmaz.'
    };
  }

  // 2. Kayıtlı ve Doğrulanmış Bir Mera Seçildiyse
  if (selectedSpot) {
    if (selectedSpot.verificationStatus === 'FIZIKI_YAPI_TEYITLI') {
      return {
        status: 'FIZIKI_YAPI_TEYITLI',
        badgeTitle: '⚓ Fiziki Yapı Teyitli Kıyı Noktası',
        badgeTone: 'cyan',
        summary: `${selectedSpot.name} noktasında mendirek, barınak veya taş tahkimat gibi fiziksel bir kıyı yapısı coğrafi olarak teyitlidir. Kıyıdan olta atmaya fiziksel olarak elverişli bir platform bulunur; ancak bu durum balık yoğunluğunu veya av başarısını garanti etmez.`,
        coastalStructureInfo: `Fiziksel Kıyı Yapısı: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature})`,
        generalFishingConditions: 'Mendirek ve burun başlarında rüzgâr yönü, dalga serpintisi, kaygan taşlar ve akıntı hızı dikkate alınmalıdır. Yerel amatör balıkçılık tebliğlerinde belirtilen liman içi kurallarına uyulmalıdır.',
        missingDataWarnings: [
          'Resmi batimetri (derinlik) ölçümü bulunmamaktadır; tahmini metre değeri verilmez.',
          'Anlık balık sürüsü veya biyokütle tespiti mevcut değildir.',
          'Dip yapısı ve takılma riski sahada yerinde incelenmelidir.'
        ],
        disclaimer: 'Fiziksel yapının varlığı balık sürüsü varlığını veya av başarısını garanti etmez.'
      };
    }

    if (selectedSpot.verificationStatus === 'COGRAFI_REFERANS_NOKTASI') {
      return {
        status: 'COGRAFI_REFERANS',
        badgeTitle: '📍 Coğrafi Referans Noktası',
        badgeTone: 'emerald',
        summary: `${selectedSpot.name} bölgesel doğal kumsal, burun veya sahil şeridi referansıdır. Kıyıdan erişim genel olarak mümkündür; ancak yapay mendirek gibi tahkimat bulunmayabilir.`,
        coastalStructureInfo: `Kıyı Tipi: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature})`,
        generalFishingConditions: 'Kumsal şeridinde kıyı eğimi, dip akıntısı, sahil çırpıntısı ve mevsimsel dip yosunlaşması göz önünde bulundurulmalıdır.',
        missingDataWarnings: [
          'Resmi batimetri (derinlik) ölçümü yoktur; kıyı eğimi bilinmeden kesin atış mesafesi tavsiye edilmez.',
          'Balık yoğunluğu garantisi bulunmamaktadır.'
        ],
        disclaimer: 'Doğrulanmış coğrafi referans verisidir; balık avı başarısı garantisi teşkil etmez.'
      };
    }

    // GENIS_HAT_TEYITSIZ
    return {
      status: 'TEYITSIZ_HAT',
      badgeTitle: '⚠️ Yeterli Veri Yok (Teyitsiz Kıyı Hattı)',
      badgeTone: 'amber',
      summary: `${selectedSpot.name} geniş bir kıyı hattıdır; belirli bir avlak noktası veya fiziksel kıyı tahkimatı teyit edilmemiştir.`,
      coastalStructureInfo: `Kıyı Tipi: ${selectedSpot.locationType} (Noktasal Teyit Yok)`,
      generalFishingConditions: 'Sahaya inmeden önce yerel balıkçılardan ve sahil gözleminden güncel durum öğrenilmelidir.',
      missingDataWarnings: [
        'Noktasal avlak konumu ve kıyı platformu teyitsizdir.',
        'Derinlik, dip yapısı ve balık durumu belirsizdir.'
      ],
      disclaimer: 'Avlak teyidi bulunmamaktadır; doğrudan av sahası olarak değerlendirilmemelidir.'
    };
  }

  // 3. Serbest Seçim Noktası (Kullanıcı haritada boş bir yere tıkladı)
  if (geo.zoneType === 'kara') {
    return {
      status: 'UYGUN_DEGIL_KARA',
      badgeTitle: '⛔ Kıyı Balıkçılığına Uygun Değil (Karasal Alan)',
      badgeTone: 'red',
      summary: `Seçilen koordinat kıyı çizgisinden yaklaşık ~${geo.distanceToCoastKm ?? '?'} km içeride, karasal alandadır. Kıyıdan deniz olta balıkçılığı yapılamaz.`,
      coastalStructureInfo: 'Karasal Alan (İç Kesim)',
      generalFishingConditions: 'Deniz balıkçılığı için kıyı şeridine veya liman bölgelerine yaklaşınız.',
      missingDataWarnings: ['Karasal alan; deniz kıyısı veya sualtı erişimi yoktur.'],
      disclaimer: 'Kara poligonu verisi ile doğrulanmıştır.'
    };
  }

  if (geo.zoneType === 'deniz') {
    return {
      status: 'UYGUN_DEGIL_ACIK_DENIZ',
      badgeTitle: '🌊 Kıyıdan Erişilemez (Açık Deniz)',
      badgeTone: 'blue',
      summary: `Seçilen koordinat kıyı çizgisinin yaklaşık ~${geo.distanceToCoastKm ?? '?'} km açığında, açık denizdedir. Kıyıdan olta atış menzilinin dışındadır; yalnızca tekne/açık deniz avcılığı için coğrafi olarak denizdir. Kıyı balıkçılığına uygun değildir.`,
      coastalStructureInfo: 'Açık Deniz / Açık Su Alanı',
      generalFishingConditions: 'Kıyıdan olta atılamaz. Tekneyle avcılıkta açık deniz seyir güvenliği, can yeleği ve hava durumu kontrolleri zorunludur.',
      missingDataWarnings: [
        'Kıyıdan olta atış menzili dışındadır.',
        'Resmi batimetri (derinlik) veya batık bilgisi bulunmamaktadır.'
      ],
      disclaimer: 'Açık su alanı; amatör kıyı balıkçılığı menzili dışındadır.'
    };
  }

  if (geo.zoneType === 'kiyi') {
    return {
      status: 'YETERLI_VERI_YOK',
      badgeTitle: '⚠️ Yeterli Veri Yok (Kayıtsız Kıyı Bandı)',
      badgeTone: 'amber',
      summary: `Seçilen koordinat kıyı çizgisine yaklaşık ~${geo.distanceToCoastKm !== null ? Math.round(geo.distanceToCoastKm * 1000) : '?'} metre mesafededir (geometrik kıyı bandı). Ancak bu noktada kayıtlı bir mera, mendirek veya güvenli olta atış yeri teyit edilmemiştir.`,
      coastalStructureInfo: 'Kayıtsız Kıyı Şeridi (~450 m geometrik kıyı bandı)',
      generalFishingConditions: 'Kıyıya fiziksel erişim yolu, falez/uçurum durumu ve özel mülkiyet kısıtları sahada yerinde incelenmelidir.',
      missingDataWarnings: [
        'Kayıtlı ve doğrulanmış mera kaydı bulunmamaktadır.',
        'Batimetri (derinlik), dip yapısı ve akıntı ölçümü yoktur; kesin atış mesafesi tavsiye edilmez.',
        'Balık yoğunluğu veya av verimi garantisi verilemez.'
      ],
      disclaimer: 'Yalnızca geometrik kıyı yakınlığı tespit edilmiştir; doğrulanmış avlak değildir.'
    };
  }

  // geo.zoneType === 'belirsiz'
  return {
    status: 'YETERLI_VERI_YOK',
    badgeTitle: '❓ Belirsiz / Yeterli Veri Yok',
    badgeTone: 'slate',
    summary: 'Mevcut coğrafi verinin çözünürlüğü bu koordinatı güvenilir biçimde sınıflandırmak için yetersizdir. Kıyıdan avlanma uygunluğu coğrafi veriyle doğrulanamamıştır.',
    coastalStructureInfo: 'Coğrafi Veriyle Doğrulanamadı',
    generalFishingConditions: 'Uydu veya harita altlığı incelenmeli, yerel sahadan bilgi alınmalıdır.',
    missingDataWarnings: ['Kıyı-kara sınır çözünürlüğü yetersizdir.'],
    disclaimer: 'Yeterli coğrafi veri bulunmamaktadır.'
  };
}
