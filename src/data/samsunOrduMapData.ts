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

// Yaklaşık, elle tanımlanmış kıyı referans çizgisi (Resmî harita veya tescilli kıyı kenar çizgisi değildir)
export const SAMSUN_ORDU_COASTLINE: [number, number][] = [
  [41.4550, 36.0820], // Samsun Dereköy
  [41.3685, 36.1795], // Samsun Taflan
  [41.3658, 36.2165], // Samsun Kurupelit
  [41.3340, 36.2785], // Samsun Atakum İskele
  [41.3142, 36.3195], // Samsun Batı Park Mendireği
  [41.3030, 36.3535], // Samsun Limanı Kuzey Mendireği
  [41.2891, 36.3620], // Mert Irmağı Ağzı
  [41.2815, 36.3810], // Doğupark sahil hattı
  [41.2465, 36.4715], // Tekkeköy kıyısı
  [41.2520, 36.5600], // Gelemen / Çarşamba batı kıyısı
  [41.2800, 36.6500], // Yeşilırmak Deltası batı yamacı
  [41.3720, 36.6850], // Civa Burnu (Yeşilırmak Deltası kuzey ucu)
  [41.3200, 36.7800], // Yeşilırmak Deltası doğu yamacı
  [41.2465, 36.7210], // Çarşamba Kostur sahili
  [41.2280, 36.9700], // Terme batı sahili
  [41.2180, 37.0345], // Terme Miliç Çamlığı sahili
  [41.1960, 37.1120], // Terme Sakarlı sahili
  [41.1685, 37.1945], // Akçay (Samsun-Ordu il sınırı)
  [41.1415, 37.2430], // Ünye Gölevi sahili
  [41.1340, 37.2620], // Ünye Burunucu
  [41.1270, 37.2690], // Ünye Çamlık kayalıkları
  [41.1345, 37.2885], // Ünye Liman Mendireği
  [41.1180, 37.3320], // Ünye Cevizdere ağzı
  [41.0740, 37.4040], // Fatsa Yalıköy Barınağı
  [41.0450, 37.4500], // Fatsa batı sahili
  [41.0315, 37.5020], // Fatsa Balıkçı Barınağı Mendireği
  [41.0515, 37.5680], // Bolaman Kalesi & Burnu
  [41.0995, 37.6410], // Perşembe Medreseönü / Çaka Koyu
  [41.1325, 37.6830], // Yason Burnu (Karadeniz'e uzanan doğal burun)
  [41.1145, 37.7420], // Çam Burnu & Koyu
  [41.0665, 37.7680], // Perşembe Vona Limanı
  [41.0360, 37.8040], // Altınordu Efirli Koyu sahili
  [41.0150, 37.8350], // Kumbaşı sahili
  [40.9880, 37.8765], // Ordu Taşbaşı & Şehir Rıhtımı
  [40.9715, 37.9350], // Melet Irmağı Ağzı
  [40.9650, 38.0100], // Turnasuyu sahili
  [40.9630, 38.0770], // Gülyalı Balıkçı Barınağı
  [40.9580, 38.1500]  // Ordu-Giresun sınırı
];

// Doğrulanmış kıyı mera ve referans noktaları (Toplam 30 nokta: 13 Samsun, 17 Ordu).
// TÜM NOKTALAR DOĞRUDAN KIYI ÇİZGİSİ, MENDİREK VEYA DERE AĞZINDADIR; ŞEHİR İÇİ VEYA KARA DEĞİLDİR.
// Doğrulama YALNIZCA fiziki kıyı yapısının veya coğrafi noktanın haritada varlığı ile sınırlıdır.
// Balık verimi, su altı derinliği veya güvenlik doğrulanmamıştır.
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  // --- SAMSUN KIYILARI (13 Nokta) ---
  {
    id: 'samsun-derekoy',
    name: 'Dereköy Balıkçı Barınağı & Mendirek',
    city: 'Samsun',
    district: '19 Mayıs',
    lat: 41.4550,
    lng: 36.0820,
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
    lat: 41.3685,
    lng: 36.1795,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Sahil)',
    verificationNote: 'Taflan sahil bandının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.3658,
    lng: 36.2165,
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Marina Mendireği)',
    verificationNote: 'Kurupelit yapay marina mendireğinin harita katmanındaki fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
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
    lat: 41.3340,
    lng: 36.2785,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (İskele / Sahil)',
    verificationNote: 'Atakum halk plajı ve sahil iskele hattının coğrafi konumu teyitlidir. Balık verimi ve derinlik doğrulanmamıştır.',
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
    lat: 41.3142,
    lng: 36.3195,
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
    lat: 41.3030,
    lng: 36.3535,
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'FIZIKI_YAPI_TEYITLI',
    verificationBadge: 'Fiziki Yapı Teyitli (Büyük Liman Mendireği)',
    verificationNote: 'Samsun Limanı ana dış mendireğinin fiziki varlığı teyitlidir. Balık verimi, derinlik ve güvenlik doğrulanmamıştır.',
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
    lat: 41.2891,
    lng: 36.3620,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Mert Irmağı ağzının coğrafi konumu teyitlidir. Balık verimi, su derinliği, kum bankı değişkenliği ve güvenlik durumu doğrulanmamıştır.',
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
    lat: 41.2815,
    lng: 36.3810,
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
    lat: 41.2465,
    lng: 36.4715,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kıyı Şeridi)',
    verificationNote: 'Tekkeköy kıyı şeridinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.3720,
    lng: 36.6850,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Delta Ağzı)',
    verificationNote: 'Yeşilırmak\'ın denize karıştığı delta ucunun coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.2465,
    lng: 36.7210,
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
    lat: 41.2180,
    lng: 37.0345,
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
    lat: 41.1960,
    lng: 37.1120,
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
    lat: 41.1685,
    lng: 37.1945,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Akçay Deresi ağzının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.1415,
    lng: 37.2430,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Plaj Şeridi)',
    verificationNote: 'Gölevi sahil şeridinin coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.1340,
    lng: 37.2620,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kayalık Burun)',
    verificationNote: 'Burunucu yarımadasının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.1270,
    lng: 37.2690,
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
    lat: 41.1345,
    lng: 37.2885,
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
    lat: 41.1180,
    lng: 37.3320,
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
    lat: 41.0740,
    lng: 37.4040,
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
    lat: 41.0315,
    lng: 37.5020,
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
    lat: 41.0515,
    lng: 37.5680,
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
    lat: 41.0995,
    lng: 37.6410,
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
    lat: 41.1325,
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
    lat: 41.1145,
    lng: 37.7420,
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kayalık Burun)',
    verificationNote: 'Çam Burnu kayalık çıkıntısının coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 41.0665,
    lng: 37.7680,
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
    lat: 41.0360,
    lng: 37.8040,
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Kumsal Koyu)',
    verificationNote: 'Efirli sahil koyunun coğrafi konumu teyitlidir. Balık verimi ve güvenlik doğrulanmamıştır.',
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
    lat: 40.9880,
    lng: 37.8765,
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
    lat: 40.9715,
    lng: 37.9350,
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'COGRAFI_REFERANS_NOKTASI',
    verificationBadge: 'Coğrafi Referans Noktası (Dere Ağzı)',
    verificationNote: 'Yalnızca Melet Irmağı ağzının coğrafi konumu teyitlidir. Balık verimi, derinlik, taban akıntısı ve güvenlik doğrulanmamıştır.',
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
    lat: 40.9630,
    lng: 38.0770,
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

  // Convert to local km coordinates relative to A
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

  // Projection point
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

// Geometric coast classification using the 37-segment approximate reference polyline
export function classifyPointGeography(lat: number, lng: number): PointClassificationResult {
  // Check bounds: roughly 36.05 to 38.20 lng, 40.85 to 41.50 lat
  const isWithinBounds = lng >= 36.05 && lng <= 38.20 && lat >= 40.85 && lat <= 41.50;

  // Find nearest spot
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

  // Calculate shortest distance to the 37-segment coastline
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
  const dataNotice = 'Yaklaşık, elle tanımlanmış kıyı referans çizgisi (37 segment) kullanılarak hesaplanmıştır. Resmî veya doğrulanmış kıyı geometrisi değildir; 450 metre sınırı yaklaşık bir sınıflandırma eşiğidir.';

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
