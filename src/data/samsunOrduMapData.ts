
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

// Geriye dönük uyumluluk için mevcut yaklaşık kıyı referans noktaları korunmuştur.
export const SAMSUN_ORDU_COASTLINE: [number, number][] = [
  [41.4580, 36.0845],
  [41.3730, 36.1820],
  [41.3690, 36.2185],
  [41.3355, 36.2810],
  [41.3185, 36.3265],
  [41.3090, 36.3630],
  [41.2915, 36.3645],
  [41.2840, 36.3835],
  [41.2505, 36.4740],
  [41.2520, 36.5600],
  [41.2800, 36.6500],
  [41.3780, 36.6870],
  [41.3200, 36.7800],
  [41.2490, 36.7230],
  [41.2280, 36.9700],
  [41.2210, 37.0370],
  [41.1985, 37.1145],
  [41.1710, 37.1960],
  [41.1435, 37.2450],
  [41.1365, 37.2640],
  [41.1290, 37.2710],
  [41.1355, 37.2915],
  [41.1200, 37.3340],
  [41.0760, 37.4065],
  [41.0450, 37.4500],
  [41.0345, 37.5055],
  [41.0535, 37.5705],
  [41.1015, 37.6430],
  [41.1364, 37.6830],
  [41.1158, 37.7862],
  [41.0690, 37.7710],
  [41.0380, 37.8060],
  [41.0150, 37.8350],
  [40.9935, 37.8740],
  [40.9735, 37.9370],
  [40.9650, 38.0100],
  [40.9655, 38.0795],
  [40.9580, 38.1500]
];

// Mevcut 30 avlak noktası korunmuştur.
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  {
    id: 'samsun-derekoy',
    name: 'Dereköy Balıkçı Barınağı & Mendirek',
    city: 'Samsun',
    district: '19 Mayıs',
    lat: 41.4580,
    lng: 36.0845,
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
    lat: 41.3730,
    lng: 36.1820,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Sahil)',
    verificationNote: 'Taflan sahil bandının su çizgisi coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.3690,
    lng: 36.2185,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Marina Mendireği)',
    verificationNote: 'Kurupelit yapay marina mendirek ucunun harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
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
    lat: 41.3355,
    lng: 36.2810,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (İskele / Sahil)',
    verificationNote: 'Atakum halk plajı ve sahil iskele ucunun coğrafi konumu teyitlidir. Balık verimi ve derinlik doğrulanmamıştır.',
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
    lat: 41.3185,
    lng: 36.3265,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Mendirek)',
    verificationNote: 'Yalnızca taş blok mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, su derinliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Karadeniz’e uzanan yapay taş blok mendirek yapısı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kayalık ve yosunlu taş zemin; kayma riski. Akıntılı havalarda dip takımı takılabilir.'
  },
  {
    id: 'samsun-liman-kuzey',
    name: 'Samsun Limanı Kuzey Mendireği',
    city: 'Samsun',
    district: 'İlkadım',
    lat: 41.3090,
    lng: 36.3630,
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
    lng: 36.3645,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Mert Irmağı ağzı su kavşağının coğrafi konumu teyitlidir. Balık verimi, su derinliği, kum bankı değişkenliği ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Mert Irmağı’nın Karadeniz ile buluştuğu kumsal alüvyon sahil',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kefal', 'Kalkan'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Yağmur sonrası bulanık su; dip akıntısı ve değişken sığ kum bankları.'
  },
  {
    id: 'samsun-dogupark',
    name: 'Samsun Doğupark Sahil Bandı',
    city: 'Samsun',
    district: 'Canik',
    lat: 41.2840,
    lng: 36.3835,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Kıyı Taş Dolgu)',
    verificationNote: 'Doğupark sahil boyu taş tahkimat dolgusunun fiziki varlığı teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.2505,
    lng: 36.4740,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kıyı Şeridi)',
    verificationNote: 'Tekkeköy kıyı şeridi su çizgisinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Çakıl ve kum karışık sahil bandı',
    commonTargetSpecies: ['Levrek', 'Kefal', 'Mırmır'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Sanayi bölgesi kıyısı; zemin değişkenliği olabilir.'
  },
  {
    id: 'carsamba-civa-burnu',
    name: 'Yeşilırmak Deltası Civa Burnu',
    city: 'Samsun',
    district: 'Çarşamba',
    lat: 41.3780,
    lng: 36.6870,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Delta Ağzı)',
    verificationNote: 'Yeşilırmak’ın denize karıştığı delta en kuzey ucunun coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Yeşilırmak deltası en kuzey alüvyon burun ve dere ağzı',
    commonTargetSpecies: ['Levrek', 'Kalkan', 'Minekop', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Irmak debisine göre sığlık ve akıntı hızla değişir; bataklık alanlara dikkat.'
  },
  {
    id: 'carsamba-sahil',
    name: 'Çarşamba Kostur Sahili',
    city: 'Samsun',
    district: 'Çarşamba',
    lat: 41.2490,
    lng: 36.7230,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'GENIS_HAT_TEYITSIZ',
    verificationBadge: 'Geniş Kıyı Hattı (Avlak Teyitsiz)',
    verificationNote: 'Yeşilırmak deltası boyunca uzanan geniş sahil bandıdır; sabit tekil bir avlak noktası değildir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Yeşilırmak delta ovası geniş kumul sahil bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Minekop', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Geniş kumluk kıyı; dip takımı ve surf kamış gerektirir. Çeken akıntı (rip) riski.'
  },
  {
    id: 'terme-milic',
    name: 'Terme Miliç Sahili & Dere Ağzı',
    city: 'Samsun',
    district: 'Terme',
    lat: 41.2210,
    lng: 37.0370,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Kıyı)',
    verificationNote: 'Yalnızca Miliç Çamlığı sahilinin coğrafi konumu teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Miliç Çamı orman kenarı kumsal kıyı hattı',
    commonTargetSpecies: ['Kalkan', 'Levrek', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kuzey rüzgarlarında yüksek dalga ve kıyı köpüklenmesi.'
  },
  {
    id: 'terme-sakarli',
    name: 'Terme Sakarlı & Kocaman Sahili',
    city: 'Samsun',
    district: 'Terme',
    lat: 41.1985,
    lng: 37.1145,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Sahil)',
    verificationNote: 'Sakarlı deresinin denize kavuştuğu sahilin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Kocaman deresi ağzı ve geniş kumul kıyı bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Sığ eğimli kumsal; rüzgarlı havalarda dip dalgası oluşur.'
  },
  {
    id: 'unye-akcay',
    name: 'Akçay Deresi Ağzı (Samsun-Ordu Sınırı)',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1710,
    lng: 37.1960,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Akçay Deresi ağzı sahil kavşağının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.1435,
    lng: 37.2450,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Plaj Şeridi)',
    verificationNote: 'Gölevi sahil şeridi su çizgisinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Ünye girişinde yer alan doğal açık kumsal kıyı',
    commonTargetSpecies: ['Kalkan', 'Levrek', 'Mırmır'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Açık deniz dalgasına açıktır.'
  },
  {
    id: 'unye-burunucu',
    name: 'Ünye Burunucu Sahili',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1365,
    lng: 37.2640,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kayalık Burun)',
    verificationNote: 'Burunucu yarımadası kayalık ucunun coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Yarımada burun yapısı ve kırık kıyı kayalıkları',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Kayalık zemin takılma riski taşır.'
  },
  {
    id: 'unye-camlik',
    name: 'Ünye Çamlık Sahili & Falezleri',
    city: 'Ordu',
    district: 'Ünye',
    lat: 41.1290,
    lng: 37.2710,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Doğal Kayalık)',
    verificationNote: 'Yalnızca Çamlık falez ve kayalık burun hattının coğrafi konumu teyitlidir. Balık verimi, su derinliği ve güvenlik durumu doğrulanmamıştır.',
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
    lat: 41.1355,
    lng: 37.2915,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Liman / Mendirek)',
    verificationNote: 'Yalnızca Ünye Limanı dış mendireği ve fenerinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
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
    lat: 41.1200,
    lng: 37.3340,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Cevizdere’nin denize karıştığı ağız hattının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Kanyon ağzı çakıllı ve kumul dere-deniz kavşağı',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Debi yağışla hızla artabilir; taban çakıllıdır.'
  },
  {
    id: 'fatsa-yalikoy',
    name: 'Fatsa Yalıköy Balıkçı Barınağı',
    city: 'Ordu',
    district: 'Fatsa',
    lat: 41.0760,
    lng: 37.4065,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Koy Barınağı)',
    verificationNote: 'Yalıköy doğal koyu içindeki balıkçı barınağı taş yapısının fiziki varlığı teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Doğal koy içine inşa edilmiş küçük mendirek ve balıkçı rıhtımı',
    commonTargetSpecies: ['İstavrit', 'Eşkina', 'Mezgit', 'Palamut'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Gece avında aydınlatma gereklidir.'
  },
  {
    id: 'fatsa-mendirek',
    name: 'Fatsa Balıkçı Barınağı Mendireği',
    city: 'Ordu',
    district: 'Fatsa',
    lat: 41.0345,
    lng: 37.5055,
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
    lat: 41.0535,
    lng: 37.5705,
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
    lat: 41.1015,
    lng: 37.6430,
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
    lat: 41.1364,
    lng: 37.6830,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Doğal Burun)',
    verificationNote: 'Yalnızca Yason Burnu doğal kara çıkıntısının coğrafi konumu teyitlidir. Balık verimi, su altı derinliği, akıntı şiddeti ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Karadeniz’e dik uzanan tarihi Yason Burnu doğal kaya dili',
    commonTargetSpecies: ['Lüfer', 'Palamut', 'Levrek', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Şiddetli burun akıntısı ve ters dalga; kayalık üzerinde dikkatli olunmalı.'
  },
  {
    id: 'persembe-cam-burnu',
    name: 'Perşembe Çam Burnu & Koyu',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.1158,
    lng: 37.7862,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kayalık Burun)',
    verificationNote: 'Çam Burnu kayalık çıkıntısı ve fenerinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Çam ormanı eteğindeki doğal kayalık burun ve koy',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'İstavrit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Gece avında kayalara dikkat edilmelidir.'
  },
  {
    id: 'persembe-vona',
    name: 'Perşembe Vona Limanı',
    city: 'Ordu',
    district: 'Perşembe',
    lat: 41.0690,
    lng: 37.7710,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Liman / Rıhtım)',
    verificationNote: 'Yalnızca Perşembe Vona Limanı rıhtım ve mendirek yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Doğal korunaklı derin Vona koyu ve balıkçı rıhtımı',
    commonTargetSpecies: ['Eşkina', 'İstavrit', 'Karagöz', 'Mezgit'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Gece avında aydınlatma gerekir. Rıhtım kenarları yosunlu olabilir.'
  },
  {
    id: 'ordu-efirli',
    name: 'Altınordu Efirli Koyu Sahili',
    city: 'Ordu',
    district: 'Altınordu',
    lat: 41.0380,
    lng: 37.8060,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Koyu)',
    verificationNote: 'Efirli sahil koyu su çizgisinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 40.9935,
    lng: 37.8740,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Rıhtım / Dolgu)',
    verificationNote: 'Yalnızca Altınordu Taşbaşı sahil dolgusu ve rıhtım yapısının harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik durumu doğrulanmamıştır.',
    verifiedGeoFeature: 'Altınordu sahil dolgusu ve Taşbaşı kayalık hattı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Minekop'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Halk yürüyüş yolu üzeri; atış esnasında arkadaki yayalara dikkat edilmeli.'
  },
  {
    id: 'ordu-melet',
    name: 'Ordu Melet Irmağı Ağzı',
    city: 'Ordu',
    district: 'Altınordu',
    lat: 40.9735,
    lng: 37.9370,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Melet Irmağı ağzı sahil kavşağının coğrafi konumu teyitlidir. Balık verimi, derinlik, taban akıntısı ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Melet Irmağı’nın denize karıştığı çakıl ve kumsal hat',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kalkan', 'Kefal'],
    depthStatus: 'Doğrulanmış batimetri ölçümü bulunmuyor',
    cautions: 'Irmak akıntısı ve çakıllı değişken zemin.'
  },
  {
    id: 'ordu-gulyali',
    name: 'Gülyalı Balıkçı Barınağı Mendireği',
    city: 'Ordu',
    district: 'Gülyalı',
    lat: 40.9655,
    lng: 38.0795,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Barınak Mendireği)',
    verificationNote: 'Gülyalı balıkçı barınağı taş mendireğinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
    verifiedGeoFeature: 'Havalimanı yanı korunaklı balıkçı barınağı mendireği',
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
): number {
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

  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
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

function distanceToLandBoundaryKm(lat: number, lng: number): number {
  let minimumDistance = Infinity;

  const visitRing = (ring: LinearRing) => {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i];
      const b = ring[i + 1];

      // Veri kesiminden kaynaklanan yapay sınırlar gerçek kıyı sayılmaz.
      if (isArtificialClipEdge(a, b)) continue;

      const distance = distanceToSegmentKm(
        lat,
        lng,
        a[1],
        a[0],
        b[1],
        b[0]
      );

      if (distance < minimumDistance) {
        minimumDistance = distance;
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

  return minimumDistance;
}

export interface PointClassificationResult {
  zone:
    | 'Deniz / Açık Su'
    | 'Kıyı Şeridi (Sahil / Kıyı Bandı)'
    | 'Karasal Alan (İç Kesim)'
    | 'Kapsam Dışı Alan';
  zoneType: 'deniz' | 'kiyi' | 'kara' | 'kapsam_disi';
  isWithinBounds: boolean;
  distanceToCoastKm: number | null;
  description: string;
  nearestSpot: VerifiedCoastalSpot | null;
  distanceToNearestSpotKm: number | null;
  dataNotice: string;
}

function distanceToSpotKm(
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
      zone: 'Kapsam Dışı Alan',
      zoneType: 'kapsam_disi',
      isWithinBounds: false,
      distanceToCoastKm: null,
      description:
        'Seçilen koordinat Samsun–Ordu kıyı analiz sınırları (36.05°D–38.20°D) dışındadır veya geçerli bir koordinat değildir.',
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

  const coastDistanceKm = distanceToLandBoundaryKm(lat, lng);

  const roundedCoastDistanceKm = Number.isFinite(coastDistanceKm)
    ? Math.round(coastDistanceKm * 100) / 100
    : null;

  const roundedSpotDistanceKm = Number.isFinite(minSpotDistanceKm)
    ? Math.round(minSpotDistanceKm * 10) / 10
    : null;

  const dataNotice =
    'Sınıflandırma, samsunOrduLand.geojson içindeki genelleştirilmiş kara poligonuna dayanır. Bu veri resmî kıyı kenar çizgisi veya batimetri değildir; 450 metre kıyı bandı yaklaşık bir eşiktir.';

  if (coastDistanceKm <= COASTAL_BAND_KM) {
    return {
      zone: 'Kıyı Şeridi (Sahil / Kıyı Bandı)',
      zoneType: 'kiyi',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        `Seçilen koordinat GeoJSON kara poligonu sınırına yaklaşık ${Math.round(coastDistanceKm * 1000)} metre mesafededir. Kıyı bandı eşiği ${COASTAL_BAND_KM * 1000} metredir.`,
      nearestSpot,
      distanceToNearestSpotKm: roundedSpotDistanceKm,
      dataNotice
    };
  }

  if (isLandPoint(lat, lng)) {
    return {
      zone: 'Karasal Alan (İç Kesim)',
      zoneType: 'kara',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        `Seçilen koordinat GeoJSON kara poligonunun içindedir; poligon sınırına yaklaşık ${roundedCoastDistanceKm ?? 'bilinmeyen'} km mesafededir.`,
      nearestSpot: minSpotDistanceKm <= 3 ? nearestSpot : null,
      distanceToNearestSpotKm:
        minSpotDistanceKm <= 3 ? roundedSpotDistanceKm : null,
      dataNotice
    };
  }

  return {
    zone: 'Deniz / Açık Su',
    zoneType: 'deniz',
    isWithinBounds: true,
    distanceToCoastKm: roundedCoastDistanceKm,
    description:
      `Seçilen koordinat GeoJSON kara poligonunun dışındadır; poligon sınırına yaklaşık ${roundedCoastDistanceKm ?? 'bilinmeyen'} km mesafededir. Bu sonuç deniz derinliği veya güvenli erişim bilgisi vermez.`,
    nearestSpot: minSpotDistanceKm <= 3.5 ? nearestSpot : null,
    distanceToNearestSpotKm:
      minSpotDistanceKm <= 3.5 ? roundedSpotDistanceKm : null,
    dataNotice
  };
}
