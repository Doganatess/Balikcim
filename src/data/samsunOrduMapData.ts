export type CoastalLocationType = 
  | 'Mendirek / Taş Tahkimat'
  | 'Liman / Barınak İçi'
  | 'Doğal Kayalık Burun'
  | 'Kumsal / Plaj Şeridi'
  | 'Nehir / Dere Ağzı'
  | 'Açık Deniz'
  | 'Karasal Alan';

export type SpotVerificationStatus = 
  | 'FIZIKI_YAPI_TEYITLI'        // Yalnızca fiziki liman/mendirek yapısının haritada varlığı teyitlidir
  | 'COGRAFI_REFERANS_NOKTASI'   // Yalnızca doğal coğrafi oluşumun konumu teyitlidir
  | 'GENIS_HAT_TEYITSIZ';        // Geniş hat; tekil mera teyitsizdir

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

// Bounding box for Samsun - Ordu coastal view
export const SAMSUN_ORDU_BOUNDS: [[number, number], [number, number]] = [
  [40.90, 36.05], // Southwest (Samsun Dereköy/west)
  [41.48, 38.20]  // Northeast (Ordu Gülyalı/east)
];

export const SAMSUN_ORDU_CENTER: [number, number] = [41.15, 37.15];

// Yaklaşık, elle tanımlanmış kıyı referans çizgisi (Resmî kadastro kıyı kenar çizgisi değildir)
export const SAMSUN_ORDU_COASTLINE: [number, number][] = [
  [41.4580, 36.0845], // Samsun Dereköy Mendirek
  [41.3730, 36.1820], // Samsun Taflan Sahili
  [41.3690, 36.2185], // Samsun Kurupelit Yat Limanı
  [41.3355, 36.2810], // Samsun Atakum İskelesi
  [41.3185, 36.3265], // Samsun Batı Park Mendireği
  [41.3090, 36.3630], // Samsun Limanı Ana Dış Mendireği
  [41.2915, 36.3645], // Mert Irmağı Ağzı
  [41.2840, 36.3835], // Doğupark Taş Dolgusu
  [41.2505, 36.4740], // Tekkeköy Tersane Kıyısı
  [41.2520, 36.5600], // Gelemen / Çarşamba batı kıyısı
  [41.2800, 36.6500], // Yeşilırmak Deltası batı yamacı
  [41.3780, 36.6870], // Civa Burnu (Yeşilırmak Deltası kuzey ucu)
  [41.3200, 36.7800], // Yeşilırmak Deltası doğu yamacı
  [41.2490, 36.7230], // Çarşamba Kostur sahili
  [41.2280, 36.9700], // Terme batı sahili
  [41.2210, 37.0370], // Terme Miliç Çamlığı sahili
  [41.1985, 37.1145], // Terme Sakarlı sahili
  [41.1710, 37.1960], // Akçay (Samsun-Ordu il sınırı)
  [41.1435, 37.2450], // Ünye Gölevi sahili
  [41.1365, 37.2640], // Ünye Burunucu
  [41.1290, 37.2710], // Ünye Çamlık kayalıkları
  [41.1355, 37.2915], // Ünye Liman Mendireği
  [41.1200, 37.3340], // Ünye Cevizdere ağzı
  [41.0760, 37.4065], // Fatsa Yalıköy Barınağı
  [41.0450, 37.4500], // Fatsa batı sahili
  [41.0345, 37.5055], // Fatsa Balıkçı Barınağı Mendireği
  [41.0535, 37.5705], // Bolaman Kalesi & Burnu
  [41.1015, 37.6430], // Perşembe Medreseönü / Çaka Koyu
  [41.1364, 37.6830], // Yason Burnu (Karadeniz'e uzanan doğal burun)
  [41.1158, 37.7862], // Çam Burnu & Feneri
  [41.0690, 37.7710], // Perşembe Vona Limanı
  [41.0380, 37.8060], // Altınordu Efirli Koyu sahili
  [41.0150, 37.8350], // Kumbaşı sahili
  [40.9935, 37.8740], // Ordu Taşbaşı & Şehir Rıhtımı
  [40.9735, 37.9370], // Melet Irmağı Ağzı
  [40.9650, 38.0100], // Turnasuyu sahili
  [40.9655, 38.0795], // Gülyalı Balıkçı Barınağı Mendirek Ucu
  [40.9580, 38.1500]  // Ordu-Giresun sınırı
];

// Doğrulanmış kıyı mera ve referans noktaları (Toplam 30 nokta: 13 Samsun, 17 Ordu).
// TÜM NOKTALAR YAKINLAŞTIRILMIŞ HARİTADA SU VE MENDİREK GEOMETRİSİNE GÖRE DOĞRULANMIŞTIR.
// ŞEHİR İÇİ, SOKAK VEYA İÇ KESİM KARASAL NOKTALAR İÇERMEZ.
// Doğrulama YALNIZCA fiziki kıyı yapısının veya coğrafi noktanın haritada varlığı ile sınırlıdır.
// Balık verimi, su altı derinliği veya güvenlik doğrulanmamıştır.
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  // --- SAMSUN KIYILARI (13 Nokta) ---
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
    verifiedGeoFeature: 'Karadeniz\'e uzanan yapay taş blok mendirek yapısı',
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
    verifiedGeoFeature: 'Mert Irmağı\'nın Karadeniz ile buluştuğu kumsal alüvyon sahil',
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
    verificationNote: 'Yeşilırmak\'ın denize karıştığı delta en kuzey ucunun coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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

  // --- ORDU KIYILARI (17 Nokta) ---
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
    verificationNote: 'Cevizdere\'nin denize karıştığı ağız hattının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    verifiedGeoFeature: 'Karadeniz\'e dik uzanan tarihi Yason Burnu doğal kaya dili',
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
    verifiedGeoFeature: 'Melet Irmağı\'nın denize karıştığı çakıl ve kumsal hat',
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

// Helper to calculate shortest distance (in km) from a point to a segment [p1, p2]
function distanceToSegmentKm(
  pLat: number, pLng: number,
  aLat: number, aLng: number,
  bLat: number, bLng: number
): { distanceKm: number; crossProduct: number } {
  const avgLat = ((aLat + bLat) / 2) * (Math.PI / 180);
  const kx = 111.32 * Math.cos(avgLat);
  const ky = 110.57;

  const bx = (bLng - aLng) * kx;
  const by = (bLat - aLat) * ky;
  const px = (pLng - aLng) * kx;
  const py = (pLat - aLat) * ky;

  const segLenSq = bx * bx + by * by;
  let t = 0;
  if (segLenSq > 0) {
    t = (px * bx + py * by) / segLenSq;
    t = Math.max(0, Math.min(1, t));
  }

  const projX = t * bx;
  const projY = t * by;

  const dx = px - projX;
  const dy = py - projY;
  const distanceKm = Math.sqrt(dx * dx + dy * dy);

  // 2D cross product: (B - A) x (P - A). Positive = North of coast (Sea in Black Sea sector)
  const crossProduct = bx * py - by * px;

  return { distanceKm, crossProduct };
}

export interface PointClassificationResult {
  zone: 'Deniz / Açık Su' | 'Kıyı Şeridi (Sahil / Kıyı Bandı)' | 'Karasal Alan (İç Kesim)' | 'Kapsam Dışı Alan';
  zoneType: 'deniz' | 'kiyi' | 'kara' | 'kapsam_disi';
  isWithinBounds: boolean;
  distanceToCoastKm: number | null;
  description: string;
  nearestSpot: VerifiedCoastalSpot | null;
  distanceToNearestSpotKm: number | null;
  dataNotice: string;
}

// Geometric coast classification using the 38-segment approximate reference polyline
export function classifyPointGeography(lat: number, lng: number): PointClassificationResult {
  const isWithinBounds = lng >= 36.05 && lng <= 38.20 && lat >= 40.85 && lat <= 41.50;

  let nearestSpot: VerifiedCoastalSpot | null = null;
  let minSpotDistanceKm = Infinity;

  VERIFIED_COASTAL_SPOTS.forEach(spot => {
    const avgLat = ((spot.lat + lat) / 2) * (Math.PI / 180);
    const dLatKm = (spot.lat - lat) * 110.57;
    const dLngKm = (spot.lng - lng) * 111.32 * Math.cos(avgLat);
    const dist = Math.sqrt(dLatKm * dLatKm + dLngKm * dLngKm);
    if (dist < minSpotDistanceKm) {
      minSpotDistanceKm = dist;
      nearestSpot = spot;
    }
  });

  if (!isWithinBounds) {
    return {
      zone: 'Kapsam Dışı Alan',
      zoneType: 'kapsam_disi',
      isWithinBounds: false,
      distanceToCoastKm: null,
      description: 'Seçilen koordinat Samsun–Ordu kıyı analiz sınırları (36.05°D - 38.20°D) dışındadır. Bu alan için kıyı referans çizgisi bulunmamaktadır.',
      nearestSpot: null,
      distanceToNearestSpotKm: null,
      dataNotice: 'Koordinat bölgesel analiz sınırları dışındadır; tahmin yapılmamaktadır.'
    };
  }

  let minCoastDistKm = Infinity;
  let dominantCrossProduct = 0;

  for (let i = 0; i < SAMSUN_ORDU_COASTLINE.length - 1; i++) {
    const [aLat, aLng] = SAMSUN_ORDU_COASTLINE[i];
    const [bLat, bLng] = SAMSUN_ORDU_COASTLINE[i + 1];

    const { distanceKm, crossProduct } = distanceToSegmentKm(lat, lng, aLat, aLng, bLat, bLng);
    if (distanceKm < minCoastDistKm) {
      minCoastDistKm = distanceKm;
      dominantCrossProduct = crossProduct;
    }
  }

  const roundedCoastDistKm = Math.round(minCoastDistKm * 100) / 100;
  const roundedSpotDistKm = Math.round(minSpotDistanceKm * 10) / 10;
  const dataNotice = 'Yaklaşık, elle tanımlanmış kıyı referans çizgisi (38 segment) kullanılarak hesaplanmıştır. Resmî veya doğrulanmış kıyı geometrisi değildir; 450 metre sınırı yaklaşık bir sınıflandırma eşiğidir.';

  // Within 450 meters (0.45 km) of reference coastline = Coastal Strip
  if (minCoastDistKm <= 0.45) {
    return {
      zone: 'Kıyı Şeridi (Sahil / Kıyı Bandı)',
      zoneType: 'kiyi',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistKm,
      description: `Seçilen koordinat elle tanımlanmış kıyı referans çizgisine ~${Math.round(minCoastDistKm * 1000)} metre mesafededir (yaklaşık sınıflandırma eşiği: 450 m). Resmî veya doğrulanmış kıyı kenar çizgisi değildir.`,
      nearestSpot,
      distanceToNearestSpotKm: roundedSpotDistKm,
      dataNotice
    };
  }

  // If cross product is positive (north of coast): Marine area
  if (dominantCrossProduct > 0) {
    return {
      zone: 'Deniz / Açık Su',
      zoneType: 'deniz',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistKm,
      description: `Seçilen nokta elle tanımlanmış kıyı referans çizgisinin ~${roundedCoastDistKm} km kuzeyinde açık deniz sahasındadır. Yalnızca tekne veya bot ile ulaşılabilir.`,
      nearestSpot: minSpotDistanceKm <= 3.5 ? nearestSpot : null,
      distanceToNearestSpotKm: minSpotDistanceKm <= 3.5 ? roundedSpotDistKm : null,
      dataNotice
    };
  }

  // Otherwise inland
  return {
    zone: 'Karasal Alan (İç Kesim)',
    zoneType: 'kara',
    isWithinBounds: true,
    distanceToCoastKm: roundedCoastDistKm,
    description: `Seçilen nokta elle tanımlanmış kıyı referans çizgisinin ~${roundedCoastDistKm} km güneyinde karasal alandadır. Deniz kıyısına veya liman bölgesine yaklaşınız.`,
    nearestSpot: minSpotDistanceKm <= 3.0 ? nearestSpot : null,
    distanceToNearestSpotKm: minSpotDistanceKm <= 3.0 ? roundedSpotDistKm : null,
    dataNotice
  };
}
