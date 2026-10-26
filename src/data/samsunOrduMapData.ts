
export type CoastalStructureType =
  | 'mendirek'
  | 'limanici'
  | 'kayalik_burun'
  | 'kumsal'
  | 'dere_agzi';

export type SpotEvidenceLevel =
  | 'DOGRULANDI'
  | 'ADAY'
  | 'YETERSIZ_VERI'
  | 'ERISIM_KISITLI_VEYA_RISKLI';

export type SpotVerificationStatus = SpotEvidenceLevel;

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
  kaynak: string;
  erisimDurumu: string;
  kisitlarVeRiskler: string;
  belirsizlikler: string;
  balikcilikGerekcesi: string;
  hedeflenenTurler: string[];
  derinlikDurumu: string;

  // Convenience & backward-compatibility properties
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
  [40.90, 36.05],
  [41.48, 38.20]
];

export const SAMSUN_ORDU_CENTER: [number, number] = [41.15, 37.15];

// Doğrulanmış kesintisiz kıyı referans çizgisi (Samsun Dereköy batısından Ordu Gülyalı doğusuna kesintisiz sıralı 89 OSM kıyı noktası)
export const SAMSUN_ORDU_COASTLINE: [number, number][] = [
  [41.49433, 36.119965],
  [41.479153, 36.12379],
  [41.4619, 36.134451],
  [41.419989, 36.178884],
  [41.40648, 36.204763],
  [41.358873, 36.236827],
  [41.348822, 36.253266],
  [41.328518, 36.303396],
  [41.323188, 36.331879],
  [41.318549, 36.33725],
  [41.31094, 36.339854],
  [41.300523, 36.340505],
  [41.288723, 36.343761],
  [41.283637, 36.352224],
  [41.281073, 36.363292],
  [41.277004, 36.374522],
  [41.272162, 36.380138],
  [41.260321, 36.390147],
  [41.256415, 36.39503],
  [41.253607, 36.40504],
  [41.251695, 36.423839],
  [41.246243, 36.432465],
  [41.240424, 36.45102],
  [41.24494, 36.476085],
  [41.262641, 36.517914],
  [41.297919, 36.570811],
  [41.307318, 36.579356],
  [41.317084, 36.58253],
  [41.335273, 36.59669],
  [41.341498, 36.599864],
  [41.343736, 36.601899],
  [41.364936, 36.608653],
  [41.366278, 36.6067],
  [41.375067, 36.619884],
  [41.374091, 36.633556],
  [41.369289, 36.650157],
  [41.366278, 36.671723],
  [41.366278, 36.758067],
  [41.350775, 36.836681],
  [41.294501, 36.984874],
  [41.274604, 37.01531],
  [41.242825, 37.031912],
  [41.198798, 37.033865],
  [41.181545, 37.039724],
  [41.174506, 37.056407],
  [41.170844, 37.077485],
  [41.153144, 37.115733],
  [41.146633, 37.135509],
  [41.147854, 37.263438],
  [41.140367, 37.299327],
  [41.124091, 37.322439],
  [41.11933, 37.333507],
  [41.114244, 37.354503],
  [41.112494, 37.37794],
  [41.108466, 37.395356],
  [41.087592, 37.419444],
  [41.077704, 37.436534],
  [41.067776, 37.47755],
  [41.062201, 37.481293],
  [41.042914, 37.504731],
  [41.037177, 37.52475],
  [41.040473, 37.564708],
  [41.03677, 37.580577],
  [41.042222, 37.586436],
  [41.046332, 37.600434],
  [41.050442, 37.607921],
  [41.058539, 37.615245],
  [41.08515, 37.628266],
  [41.101549, 37.640147],
  [41.117621, 37.65504],
  [41.131252, 37.672048],
  [41.140367, 37.689789],
  [41.124091, 37.698497],
  [41.114732, 37.715099],
  [41.114651, 37.734223],
  [41.126125, 37.751231],
  [41.11933, 37.758067],
  [41.122626, 37.783865],
  [41.060004, 37.785167],
  [41.042914, 37.802745],
  [41.023668, 37.854259],
  [41.01557, 37.867931],
  [41.005601, 37.878266],
  [40.982123, 37.895763],
  [40.995103, 37.934744],
  [40.99022, 37.9817],
  [40.959703, 38.102224],
  [40.952094, 38.161306],
  [40.941734, 38.2]
];

// Samsun–Ordu kıyısı boyunca (Dereköy'den Gülyalı'ya) OSM yapıları ve kıyı morfolojisiyle baştan incelenmiş kıyı noktaları
export const VERIFIED_COASTAL_SPOTS: VerifiedCoastalSpot[] = [
  {
    id: 'samsun-derekoy-barinak',
    name: 'Dereköy Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: '19 Mayıs',
    lat: 41.4695,
    lng: 36.1285,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Barınak Mendireği)',
    kaynak: 'OSM Way 283103233 (Dereköy Balıkçı Barınağı Mendirek Dış Kolu)',
    erisimDurumu: 'Barınak sahilinden mendirek taş dolgusu üzerine yaya geçişi açıktır.',
    kisitlarVeRiskler: 'Açık deniz yönündeki dış bloklar dalgalı havalarda ıslanır ve kaygandır; rüzgarlı havalarda serpinti riski vardır.',
    belirsizlikler: 'Doğrulanmış batimetri (derinlik) ölçümü bulunmamaktadır; barınak ağzı dip yapısı değişken olabilir.',
    balikcilikGerekcesi: 'Mendirek dış burnu açık deniz akıntısını keserek derinleşme eşiği oluşturur; yem balıklarının sığındığı alandır.',
    hedeflenenTurler: ['İstavrit', 'Çinekop', 'Levrek', 'Mezgit'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: '19 Mayıs',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Barınak Mendireği)',
    verificationNote: 'Dereköy balıkçı barınağı taş mendireğinin harita katmanındaki fiziki varlığı OSM verisiyle teyitlidir. Batimetri ve balık garantisi yoktur.',
    verifiedGeoFeature: 'Karadeniz açıklarına uzanan yapay taş mendirek ve korunaklı iç havuz',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Levrek', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Mendirek dışı dalgalı havalarda ıslanır; kaygan blok taşlara dikkat ediniz.'
  },
  {
    id: 'samsun-taflan-kumsal',
    name: 'Taflan Yalı Kumsalı',
    il: 'Samsun',
    ilce: 'Atakum',
    lat: 41.4452,
    lng: 36.1495,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kumsal Sahil Şeridi)',
    kaynak: 'OSM Kıyı Çizgisi (Taflan Yalı Sahil Bandı)',
    erisimDurumu: 'Sahil yolu ve yürüyüş bandından kumsala serbest yaya erişimi mevcuttur.',
    kisitlarVeRiskler: 'Kuzey rüzgarlarında yüksek kırılan dalgalar (çırpıntı) ve dip çekintisi (rip akıntısı) riski vardır; yapay bir platform veya mendirek bulunmaz.',
    belirsizlikler: 'Kıyı kum bankları dalgalarla sürekli yer değiştirir; derinlik kademesi ve olta atış mesafesi sahada değişir.',
    balikcilikGerekcesi: 'Geniş kumluk dip yapısı dip kurtçukları ve kabukluları barındırır; surfcasting tekniğiyle dip balıkları hedeflenir.',
    hedeflenenTurler: ['Kalkan', 'Mırmır', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Atakum',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kumsal Sahil Şeridi)',
    verificationNote: 'Taflan sahil bandı doğal kumsaldır; sabit olta atış platformu yoktur.',
    verifiedGeoFeature: 'Geniş kumluk kıyı şeridi; surfcasting atışına uygun sahil hattı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Kuzey rüzgarlarında kıyı dalgalanması artar; dip çekintisine dikkat edilmeli.'
  },
  {
    id: 'samsun-kurupelit-marina',
    name: 'Kurupelit Yat Limanı Mendireği',
    il: 'Samsun',
    ilce: 'Atakum',
    lat: 41.3718,
    lng: 36.2330,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Marina Mendireği)',
    kaynak: 'OSM Way 295966601 (Kurupelit Yat Limanı Taş Mendireği)',
    erisimDurumu: 'Atakum sahil kordonundan mendirek köküne ve taş tahkimat yürüyüş yoluna yaya geçişi mümkündür.',
    kisitlarVeRiskler: 'Marina içi tekne trafiği ve bağlama tonozları nedeniyle marina içine atış kısıtlanabilir; açık deniz cephesine atış tercih edilir.',
    belirsizlikler: 'Marina yönetiminin iç havuzda olta balıkçılığına dönemsel kısıtlamaları olabilir; derinlik ölçülmemiştir.',
    balikcilikGerekcesi: 'Açık denize doğru uzanan dairesel taş mendirek yapay resif işlevi görür; midye ve yosun faunası balık çeker.',
    hedeflenenTurler: ['İstavrit', 'Mezgit', 'Çinekop', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Atakum',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Marina Mendireği)',
    verificationNote: 'Kurupelit yapay marina dairesel mendirek yapısının fiziki varlığı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Dairesel taş dolgu marin mendirek yapısı',
    commonTargetSpecies: ['İstavrit', 'Mezgit', 'Çinekop', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'İç limanda tekne halatlarına ve seyre dikkat edilmelidir; dış cephede kaygan taşlar bulunur.'
  },
  {
    id: 'samsun-cobanli-iskele',
    name: 'Atakum Çobanlı Sahil İskelesi',
    il: 'Samsun',
    ilce: 'Atakum',
    lat: 41.3444,
    lng: 36.2620,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Gezi ve Yanaşma İskelesi)',
    kaynak: 'OSM Node / Way (Atakum Çobanlı İskelesi)',
    erisimDurumu: 'Atakum sahil yürüyüş yolundan iskele üzerine doğrudan ve engelsiz yaya erişimi vardır.',
    kisitlarVeRiskler: 'Belediye gezi iskelesidir; arkadan geçen yayalara iğne takılma tehlikesi vardır; gündüz kalabalık saatlerde olta atışı kısıtlanabilir.',
    belirsizlikler: 'Zabıta denetimleri ve güncel saatlik avlanma kuralları; batimetri verisi bulunmamaktadır.',
    balikcilikGerekcesi: 'Kıyı sığlığından açık suya doğru uzanan ayaklar çevresinde küçük balık sürüleri toplanır.',
    hedeflenenTurler: ['İstavrit', 'Mırmır', 'Kefal'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Atakum',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (İskele / Sahil)',
    verificationNote: 'Atakum halk plajı ve sahil iskelesinin coğrafi konumu teyitlidir; avlanma zamanı kısıtlı olabilir.',
    verifiedGeoFeature: 'Kumluk sahil şeridi ve ahşap gezi iskelesi kıyı hattı',
    commonTargetSpecies: ['Mırmır', 'Levrek', 'Kefal'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Yaz aylarında yüzme alanı ve yoğun yaya trafiği; sabah erken veya gece saatleri tercih edilmelidir.'
  },
  {
    id: 'samsun-batipark-barinak',
    name: 'Samsun Batıpark Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: 'İlkadım',
    lat: 41.3175,
    lng: 36.3335,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Taş Dolgu Mendirek)',
    kaynak: 'OSM Way (Batıpark Balıkçı Barınağı Mendireği & Amazon Adası)',
    erisimDurumu: 'Batıpark rekreasyon alanından mendirek taş dolgusu üzerine yaya geçişi mevcuttur.',
    kisitlarVeRiskler: 'Kayalık bloklar üzeri yosunlu ve kaygandır; gece aydınlatması yetersizdir; akıntılı havalarda dip takımı takılabilir.',
    belirsizlikler: 'Barınak içi tekne hareket saatleri; derinlik ve dip batimetrisi resmi olarak yayımlanmamıştır.',
    balikcilikGerekcesi: 'Amazon Adası sahilinde Karadeniz açıklarına uzanan taş bloklar yırtıcı balıklara doğal pusu alanı sağlar.',
    hedeflenenTurler: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'İlkadım',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Mendirek)',
    verificationNote: 'Batıpark balıkçı barınağı taş blok mendirek yapısının fiziki varlığı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Batıpark ve Amazon Adası sahilinde Karadeniz’e uzanan yapay taş blok mendirek yapısı',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Kayalık ve yosunlu taş zemin; kayma riski. Akıntılı havalarda dip takımı takılabilir.'
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
    kanitSeviyesiBadge: '⛔ Erişim Kısıtlı (Ticari Liman & ISPS Güvenlik Alanı)',
    kaynak: 'OSM Way / Samsun Uluslararası Liman Sınırları & Kıyı Emniyeti Fener Kaydı',
    erisimDurumu: 'Gümrüklü ticari liman sahası içerisindedir; sivil yaya girişi tel örgü ve güvenlik kontrol noktaları ile kapatılmıştır.',
    kisitlarVeRiskler: 'ISPS Uluslararası Gemi ve Liman Tesisi Güvenlik Kodu kapsamındadır; izinsiz giriş yasaktır; ağır ticari gemi manevraları ve derin akıntı tehlikesi vardır.',
    belirsizlikler: 'Amatör balıkçıların girmesine kesinlikle izin verilmemektedir.',
    balikcilikGerekcesi: 'Karadeniz\'in en derin yapay mendireklerinden biridir ancak güvenlik ve yasal kısıtlar nedeniyle avlanılamaz.',
    hedeflenenTurler: ['Erişim Yasak — Avlanılamaz'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'İlkadım',
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'ERISIM_KISITLI_VEYA_RISKLI',
    verificationBadge: '⛔ Erişim Kısıtlı (Ticari Liman Sahası)',
    verificationNote: 'Samsun Uluslararası Limanı ana mendireği gümrüklü ve güvenlikli sahadır; sivil girişe kapalıdır.',
    verifiedGeoFeature: 'Büyük ticari liman koruma mendireği ve fener taş tahkimatı',
    commonTargetSpecies: ['Erişim Yasak — Avlanılamaz'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Giriş yasaktır; liman operasyon sahalarına ve gümrüklü alanlara yaklaşmayınız.'
  },
  {
    id: 'samsun-mert-irmagi-mansap',
    name: 'Samsun Mert Irmağı Mansabı',
    il: 'Samsun',
    ilce: 'Canik',
    lat: 41.2788,
    lng: 36.3520,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Akarsu Mansabı / Dere Ağzı)',
    kaynak: 'OSM Waterway (Mert Irmağı) & Sahil Kıyı Çizgisi Kesişimi',
    erisimDurumu: 'Doğupark sahil şeridinden ırmak ağzı kumsalına yaya olarak ulaşılabilir.',
    kisitlarVeRiskler: 'Yağmur sonrası debi aniden yükselir; balçık ve değişken sığ kum bankları tehlike oluşturabilir.',
    belirsizlikler: 'Irmak mansap kum dili fırtınalarla sürekli değişir; resmi derinlik ölçümü yoktur.',
    balikcilikGerekcesi: 'Tatlı suyun denize taşıdığı besin maddeleri levrek, minekop ve kefal gibi türleri mansap çevresine çeker.',
    hedeflenenTurler: ['Levrek', 'Minekop', 'Kefal', 'Kalkan'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Canik',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Dere Ağzı)',
    verificationNote: 'Mert Irmağı ağzı mansap kesişimi teyitlidir; yağışlarda debi ve zemin değişkendir.',
    verifiedGeoFeature: 'Mert Irmağı’nın Karadeniz ile buluştuğu kumsal alüvyon sahil mansap kesimi',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kefal', 'Kalkan'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Yağmur sonrası bulanık su; dip akıntısı ve değişken sığ kum banklarına dikkat ediniz.'
  },
  {
    id: 'samsun-canik-barinak',
    name: 'Canik Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: 'Canik',
    lat: 41.2560,
    lng: 36.3955,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Balıkçı Barınağı Mendireği)',
    kaynak: 'OSM Way (Canik Balıkçı Barınağı Taş Mendireği)',
    erisimDurumu: 'Sahil servis yolundan mendirek köküne yaya erişimi açıktır.',
    kisitlarVeRiskler: 'Mendirek dış cephesinde dalga serpintisi; sanayi kıyı bölgesine yakınlık.',
    belirsizlikler: 'Barınak içi sığlaşma periyotları; derinlik ölçülmemiştir.',
    balikcilikGerekcesi: 'Mendirek ucu açık deniz akıntısını keserek istavrit ve çinekop için beslenme noktası oluşturur.',
    hedeflenenTurler: ['İstavrit', 'Mezgit', 'Çinekop'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Canik',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Barınak Mendireği)',
    verificationNote: 'Canik balıkçı barınağı taş mendirek yapısı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Canik kıyısında küçük tekne barınağı ve taş dolgu mendirek',
    commonTargetSpecies: ['İstavrit', 'Mezgit', 'Çinekop'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Dalgalı havalarda ıslanan taşlar; kaygan yüzeye dikkat edilmelidir.'
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
    kanitSeviyesiBadge: '⚠️ Yetersiz Veri (Kayıtsız Kıyı Şeridi)',
    kaynak: 'OSM Kıyı Çizgisi (Tekkeköy Kırsal Kumsal Bandı)',
    erisimDurumu: 'Tarla ve kırsal yollardan kumsala inilebilir ancak yapılaşmış yol veya iskele yoktur.',
    kisitlarVeRiskler: 'Issız sahil bandı; cankurtaran, emniyet bariyeri ve gece aydınlatması bulunmamaktadır.',
    belirsizlikler: 'Belirli bir avlak noktası, olta atış platformu veya derinlik eşiği doğrulanmamıştır.',
    balikcilikGerekcesi: 'Geniş kumsal sahil surfcasting denemelerine açıktır ancak sahada teyitli balıkçılık noktası tanımlanmamıştır.',
    hedeflenenTurler: ['Kalkan', 'Mırmır'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Tekkeköy',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'YETERSIZ_VERI',
    verificationBadge: '⚠️ Yetersiz Veri (Teyitsiz Sahil)',
    verificationNote: 'Gelemen sahil şeridinde noktasal olta avlağı veya yapı teyit edilmemiştir.',
    verifiedGeoFeature: 'Geniş doğal kumsal sahil şeridi',
    commonTargetSpecies: ['Kalkan', 'Mırmır'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Tesis ve güvenlik yoktur; ıssız kıyı şerididir.'
  },
  {
    id: 'samsun-carsamba-yesilirmak',
    name: 'Çarşamba Yeşilırmak Deltası Mansabı',
    il: 'Samsun',
    ilce: 'Çarşamba',
    lat: 41.3745,
    lng: 36.6210,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Büyük Nehir Deltası Mansabı)',
    kaynak: 'OSM Waterway (Yeşilırmak) Delta Mansap Noktası',
    erisimDurumu: 'Kumköy üzerinden stabilize yollarla mansap yakınına gidilebilir; son kısım kumluk ve sazlık zeminde yaya intikali gerektirir.',
    kisitlarVeRiskler: 'Kuvvetli nehir debisi, balçıklı bataklık zemin, sığ kum dillerinin çökme riski ve açık deniz rip akıntıları.',
    belirsizlikler: 'Kum dili her mevsim debi ve dalgalarla metrelerce yer değiştirir; sabit kuru zemin noktası garanti değildir.',
    balikcilikGerekcesi: 'Türkiye\'nin en büyük ırmak deltalarından biridir; yüksek alüvyon ve yem balığı popülasyonu iri levrek ve kalkan çeker.',
    hedeflenenTurler: ['Levrek', 'Kefal', 'Kalkan', 'Minekop'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Çarşamba',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Delta Mansabı)',
    verificationNote: 'Yeşilırmak mansap deltası coğrafi olarak teyitlidir; taban yapısı dinamik ve değişkendir.',
    verifiedGeoFeature: 'Yeşilırmak deltasının Karadeniz ile birleştiği geniş alüvyon kum dili',
    commonTargetSpecies: ['Levrek', 'Kefal', 'Kalkan', 'Minekop'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Şiddetli nehir akıntısı ve gevşek balçık taban; mansap kum dillerinde batma riski vardır.'
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
    kanitSeviyesiBadge: '⚠️ Yetersiz Veri (Delta Kıyı Hattı)',
    kaynak: 'OSM Kıyı Çizgisi & Fener Mevkii',
    erisimDurumu: 'Kırsal yollardan kumsala yaya erişimi vardır.',
    kisitlarVeRiskler: 'Aşırı sığ ve geniş kumluk sahil; dalga kırılma hattı kıyıdan yüzlerce metre açıktadır.',
    belirsizlikler: 'Belirli bir olta balıkçılığı noktası veya derin su eşiği teyit edilmemiştir.',
    balikcilikGerekcesi: 'Mevsiminde kalkan için uzun menzilli surf atışları yapılabilir ancak noktasal mera kaydı yoktur.',
    hedeflenenTurler: ['Kalkan', 'Mırmır'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Çarşamba',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'YETERSIZ_VERI',
    verificationBadge: '⚠️ Yetersiz Veri (Teyitsiz Sahil)',
    verificationNote: 'Hürriyet sahili geniş sığ kumsaldır; sabit balıkçılık platformu yoktur.',
    verifiedGeoFeature: 'Geniş sığ delta kumsalı ve fener mevkii kıyı hattı',
    commonTargetSpecies: ['Kalkan', 'Mırmır'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Aşırı sığ kıyı bandı; uzun menzilli atış gerekebilir.'
  },
  {
    id: 'samsun-terme-barinak',
    name: 'Terme Balıkçı Barınağı Mendireği',
    il: 'Samsun',
    ilce: 'Terme',
    lat: 41.2010,
    lng: 37.0340,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Balıkçı Barınağı Mendireği)',
    kaynak: 'OSM Way (Terme Balıkçı Barınağı Taş Mendireği & Çay Çıkışı)',
    erisimDurumu: 'Barınak sahil yolundan mendirek üzerine yaya geçişi açıktır.',
    kisitlarVeRiskler: 'Terme Çayı çıkışında kumlanma nedeniyle sığlaşma; fırtınalı havalarda mendirek üzerine taşan dalgalar.',
    belirsizlikler: 'Barınak ağzı kum birikintisi periyotları; kesin batimetri verisi yoktur.',
    balikcilikGerekcesi: 'Terme Çayı mansabı ile taş mendireğin birleştiği nokta levrek ve istavrit için doğal geçiş güzergahıdır.',
    hedeflenenTurler: ['Levrek', 'İstavrit', 'Kefal', 'Mezgit'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Terme',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Barınak Mendireği)',
    verificationNote: 'Terme balıkçı barınağı taş mendirek yapısının fiziki varlığı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Terme Çayı çıkışında taş tahkimat mendirek ve balıkçı rıhtımı',
    commonTargetSpecies: ['Levrek', 'İstavrit', 'Kefal', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
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
    kaynak: 'OSM Way / Sahil Çizgisi (Terme Miliç Sahili)',
    erisimDurumu: 'Miliç rekreasyon ve sahil tesislerinden kumsala kolay yaya erişimi mevcuttur.',
    kisitlarVeRiskler: 'Yaz sezonunda plaj kullanımı; kışın sert kuzey rüzgarı dalgaları ve kıyı erozyonu.',
    belirsizlikler: 'Kıyı eğimi oldukça sığdır; derinlik batimetrisi ölçülmemiştir.',
    balikcilikGerekcesi: 'Geniş kumluk taban kalkan ve mırmır türlerinin dip beslenmesine elverişlidir.',
    hedeflenenTurler: ['Kalkan', 'Mırmır', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Samsun',
    district: 'Terme',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kumsal Sahil)',
    verificationNote: 'Miliç çamlığı ve kumsalı doğal kıyı şerididir.',
    verifiedGeoFeature: 'Çamlık gerisinde uzanan doğal kumluk sahil bandı',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Kuzey rüzgarlarında sahil dalgalanması artar.'
  },
  {
    id: 'ordu-unye-akcay-mansap',
    name: 'Akçay Deresi Mansabı (Samsun–Ordu Sınırı)',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1470,
    lng: 37.1355,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Dere Mansabı / İl Sınırı)',
    kaynak: 'OSM Waterway (Akçay Deresi) & İl İdari Sınır Hattı',
    erisimDurumu: 'Sahil karayoluna paralel tali yollardan çakıllı sahil bandına yaya yürüyüşü mümkündür.',
    kisitlarVeRiskler: 'Çakıllı ve sığ mansap yatağı; yağışlı günlerde taşkın ve bulanıklık.',
    belirsizlikler: 'Mansaptaki kum ve çakıl seti değişkenliği; derinlik verisi mevcut değildir.',
    balikcilikGerekcesi: 'Akçay tatlı suyunun Karadeniz ile buluştuğu hatta levrek, kefal ve kalkan yemlenir.',
    hedeflenenTurler: ['Levrek', 'Kefal', 'Kalkan'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Dere Ağzı)',
    verificationNote: 'Akçay Deresi Samsun–Ordu sınır kavşağıdır; zemin kum ve çakıldır.',
    verifiedGeoFeature: 'Akçay Deresi mansabının Karadeniz\'e karıştığı çakıl ve kumsal hat',
    commonTargetSpecies: ['Levrek', 'Kefal', 'Kalkan'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Yağmur sonrası akıntı debisi yükselir.'
  },
  {
    id: 'ordu-unye-golevi-kumsal',
    name: 'Ünye Gölevi Sahili',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1410,
    lng: 37.2635,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kumsal Sahil Şeridi)',
    kaynak: 'OSM Way (Gölevi Sahili Kıyı Çizgisi)',
    erisimDurumu: 'Sahil yürüyüş yolundan kumsala doğrudan erişim mevcuttur.',
    kisitlarVeRiskler: 'Sığ kumluk zemin; dalgalı havalarda sahil çırpıntısı.',
    belirsizlikler: 'Batimetri ölçümü bulunmamaktadır; kum tepecikleri mevsimsel olarak değişir.',
    balikcilikGerekcesi: 'Sakin kış ve sonbahar gecelerinde surfcasting takımıyla kalkan ve mırmır avı denenir.',
    hedeflenenTurler: ['Mırmır', 'Kalkan', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kumsal Sahil)',
    verificationNote: 'Gölevi mahallesi sahil kordonu kumsal hattıdır.',
    verifiedGeoFeature: 'Kumluk açık kıyı şeridi',
    commonTargetSpecies: ['Mırmır', 'Kalkan', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Yazın plaj kullanımı vardır; gece avında sakin deniz tercih edilir.'
  },
  {
    id: 'ordu-unye-camlik-kayalik',
    name: 'Ünye Çamlık Doğal Kayalık Burnu',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1345,
    lng: 37.2885,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Doğal Kayalık Burun & Falez)',
    kaynak: 'OSM Way / Natural Coastline (Ünye Çamlık Falezleri)',
    erisimDurumu: 'Çamlık Parkı içindeki patika ve basamaklardan kayalık kıyıya inilebilir.',
    kisitlarVeRiskler: 'Falez kayaları ıslakken son derece kaygandır; dalga patlamalarında çekilme riski; acil güvenlik ekipmanı yoktur.',
    belirsizlikler: 'Su altındaki ilişken kayalar nedeniyle takım takılma riski; derinlik ölçülmemiştir.',
    balikcilikGerekcesi: 'Doğal kayalık burun yapısı zengin midye ve yosun faunasına sahiptir; taş balıkları (eşkina, karagöz) için ideal barınaktır.',
    hedeflenenTurler: ['Karagöz', 'Eşkina', 'İstavrit', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Kayalık Burun)',
    verificationNote: 'Ünye Çamlık falez kıyı kayalıklarının fiziki varlığı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Denize dik inen çamlık falezleri ve doğal kaya blokları',
    commonTargetSpecies: ['Karagöz', 'Eşkina', 'İstavrit', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Kayalar ıslakken aşırı kaygandır; gece inişlerinde dikkatli olunmalıdır.'
  },
  {
    id: 'ordu-unye-tarihi-iskele',
    name: 'Ünye Tarihi Sahil İskelesi',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1275,
    lng: 37.2940,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kentsel Sahil İskelesi)',
    kaynak: 'OSM Way / Node (Ünye İskelesi)',
    erisimDurumu: 'Ünye sahil kordonundan iskele platformuna serbest yaya erişimi mevcuttur.',
    kisitlarVeRiskler: 'Gezinti yapan yayalar nedeniyle atış emniyeti riski; fırtınalı havalarda iskele üzerine vuran dalgalar.',
    belirsizlikler: 'Belediyenin dönemsel olta düzenlemeleri; kesin batimetri verisi yoktur.',
    balikcilikGerekcesi: 'Kıyıdan açık derinliğe uzanan beton ayaklar istavrit ve mezgit için yapay barınak sunar.',
    hedeflenenTurler: ['İstavrit', 'Çinekop', 'Mezgit', 'Kefal'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (İskele)',
    verificationNote: 'Ünye merkez gezi iskelesidir; amatör balıkçılık dönemsel olarak kısıtlanabilir.',
    verifiedGeoFeature: 'Kıyıdan denize uzanan beton ayaklı gezi ve tekne iskelesi',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Mezgit', 'Kefal'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Yaya kalabalığına dikkat edilmeli; fırtınada iskeleye çıkılmamalıdır.'
  },
  {
    id: 'unye-liman-mendirek',
    name: 'Ünye Limanı Ana Dış Mendireği',
    il: 'Ordu',
    ilce: 'Ünye',
    lat: 41.1417,
    lng: 37.3117,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Liman Ana Mendireği)',
    kaynak: 'OSM Way 234195821 / Kıyı Emniyeti Fener Kaydı (Ünye Liman Feneri)',
    erisimDurumu: 'Mendirek dış tahkimat hattı boyunca taş bloklar üzerinden yaya yürüyüşü yapılabilmektedir (ticari rıhtım sahasına girilmeden).',
    kisitlarVeRiskler: 'Dış cephe devasa tetrapot ve taş bloklardan oluşur; zemin engebeli ve kaygandır; fırtınada dalga serpintisi aşırı yüksektir. Liman içi ticari gemi operasyon sahasına girmek yasaktır.',
    belirsizlikler: 'Liman idaresinin dış mendirek kapısındaki dönemsel güvenlik kısıtlamaları; batimetri derinlik haritası yayımlanmamıştır.',
    balikcilikGerekcesi: 'Kıyıdan yüzlerce metre açık Karadeniz derinliğine ve akıntı burnuna uzanır; göç eden pelajik balıklar (lüfer, palamut, istavrit) mendirek burnundan geçer.',
    hedeflenenTurler: ['İstavrit', 'Çinekop', 'Lüfer', 'Palamut', 'Mezgit'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Liman Mendireği)',
    verificationNote: 'Ünye Limanı ana dış mendirek yapısı OSM ve Kıyı Emniyeti fener katmanlarında teyitlidir.',
    verifiedGeoFeature: 'Karadeniz açıklarına uzanan büyük taş tahkimat ve mendirek feneri',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Palamut', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Kayalık bloklar ve tetrapotlar üzerinde kayma riski yüksektir; rüzgarlı havalarda serpintiye dikkat ediniz.'
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
    kanitSeviyesiBadge: '📍 Aday Kıyı (Akarsu Mansabı / Çakıl Kıyısı)',
    kaynak: 'OSM Waterway (Cevizdere) & Sahil Çizgisi',
    erisimDurumu: 'Liman mevkii altındaki tali sahil yolundan kumsala yaya erişimi vardır.',
    kisitlarVeRiskler: 'Yağmur sonrası yoğun tortulu çamurlu su akışı; dere mansabında derin kum çukurları.',
    belirsizlikler: 'Mansap kum dili fırtınalarla değişir; batimetri verisi yoktur.',
    balikcilikGerekcesi: 'Tatlı su ve minerallerin denize döküldüğü mansap hattı levrek ve kefal için besin kaynağıdır.',
    hedeflenenTurler: ['Levrek', 'Kefal', 'Mırmır'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Ünye',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Dere Ağzı)',
    verificationNote: 'Cevizdere mansap kesişimi teyitlidir.',
    verifiedGeoFeature: 'Cevizdere\'nin denize karıştığı çakıl ve kumsal sahil şeridi',
    commonTargetSpecies: ['Levrek', 'Kefal', 'Mırmır'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Dere mansabında bataklık ve akıntı çukurlarına dikkat ediniz.'
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
    kanitSeviyesiBadge: '📍 Aday Kıyı (Doğal Falez & Kayalık Koy)',
    kaynak: 'OSM Natural Coastline (Fatsa Dolunay Koyu Kayalıkları)',
    erisimDurumu: 'Dolunay sahil parkından patikalarla kayalık kıyıya inilebilir.',
    kisitlarVeRiskler: 'Dik falez eğimi, kaygan yosunlu taşlar; fırtınalı havalarda kuvvetli dalga patlamaları.',
    belirsizlikler: 'Dipteki ilişken kayalıklar nedeniyle takım takılma sıklığı; derinlik ölçülmemiştir.',
    balikcilikGerekcesi: 'Kayalık yarıklar ve derinleşen koy tabanı eşkina ve karagöz gibi taş balıklarına doğal habitat oluşturur.',
    hedeflenenTurler: ['Eşkina', 'Karagöz', 'İstavrit'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Fatsa',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kayalık Falez)',
    verificationNote: 'Fatsa Dolunay kayalık koyu teyitlidir.',
    verifiedGeoFeature: 'Doğal kayalık koy ve falez kıyı hattı',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'İstavrit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Kayalıklar üzerinde kayma tehlikesi; fırtınada dalga patlaması.'
  },
  {
    id: 'ordu-fatsa-barinak-mendirek',
    name: 'Fatsa Balıkçı Barınağı Mendireği',
    il: 'Ordu',
    ilce: 'Fatsa',
    lat: 41.0372,
    lng: 37.5250,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Balıkçı Barınağı Mendireği)',
    kaynak: 'OSM Way (Fatsa Balıkçı Barınağı Taş Mendireği)',
    erisimDurumu: 'Sahil caddesinden barınak rıhtımına ve mendirek üzerine yaya erişimi açıktır.',
    kisitlarVeRiskler: 'Barınak içi tekne hareketliliği ve ağlar; mendirek dışındaki kaygan tetrapotlar.',
    belirsizlikler: 'Barınak içi dip derinliği ve temizliği; kesin batimetri verisi mevcut değildir.',
    balikcilikGerekcesi: 'Açık körfez akıntılarını kesen mendirek ucu çapariyle istavrit ve yemli çinekop avı için stratejik kıyı noktasıdır.',
    hedeflenenTurler: ['İstavrit', 'Çinekop', 'Mezgit', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Fatsa',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Barınak Mendireği)',
    verificationNote: 'Fatsa balıkçı barınağı mendirek yapısı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Fatsa şehir sahilinde taş mendirek ve balıkçı barınağı havuzu',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Mezgit', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Mendirek dışındaki kaygan taşlara dikkat ediniz; iç havuzda tekneleri gözetiniz.'
  },
  {
    id: 'ordu-fatsa-bolaman-feneri',
    name: 'Bolaman Burnu & Fener Kayalıkları',
    il: 'Ordu',
    ilce: 'Fatsa',
    lat: 41.0425,
    lng: 37.5865,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Doğal Burun & Fener Kayalıkları)',
    kaynak: 'OSM Node / Way (Bolaman Kalesi & Feneri Kıyı Kayalıkları)',
    erisimDurumu: 'Bolaman sahil yolundan kayalık burun tabanına patikayla dikkatlice inilebilir.',
    kisitlarVeRiskler: 'Dalgalı havalarda kayalıkların üzerine su çıkması; kaygan taşlar ve takılma riski.',
    belirsizlikler: 'Dip yapısındaki derin yarıklar; derinlik ölçülmemiştir.',
    balikcilikGerekcesi: 'Körfez çıkışında denize uzanan burun yapısı pelajik ve taş balıklarının beslenme rotasıdır.',
    hedeflenenTurler: ['Lüfer', 'İstavrit', 'Eşkina', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Fatsa',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Kayalık Burun)',
    verificationNote: 'Bolaman Kalesi ve fener kayalıkları doğal kıyı yapısı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Karadeniz\'e uzanan tarihi kale burnu ve doğal kayalıklar',
    commonTargetSpecies: ['Lüfer', 'İstavrit', 'Eşkina', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Dalgalı havalarda kayalıklar üzerine su basabilir.'
  },
  {
    id: 'persembe-yason',
    name: 'Perşembe Yason Burnu & Feneri',
    il: 'Ordu',
    ilce: 'Perşembe',
    lat: 41.1360,
    lng: 37.6825,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Tarihi Yason Burnu & Feneri)',
    kaynak: 'OSM Node 298154109 (Yason Feneri) & Kıyı Çizgisi Doğal Kaya Dili',
    erisimDurumu: 'Yason Yarımadası koruma alanından kilise ve fener patikaları üzerinden kıyı kayalarına yaya erişimi vardır.',
    kisitlarVeRiskler: 'Açık Karadeniz fırtınalarına tamamen açıktır; çok sert burun akıntısı, ters dalgalar ve ani su yükselmeleri vardır. Dalgalı havalarda burun ucunda durmak hayati tehlike yaratır!',
    belirsizlikler: 'Akıntı hızı ve anlık dip yapısı; resmi batimetri verisi mevcut değildir.',
    balikcilikGerekcesi: 'Karadeniz akıntılarının kırıldığı en uç burun noktasıdır; göç balıkları (palamut, lüfer, çinekop) burun açığından geçer.',
    hedeflenenTurler: ['Lüfer', 'Palamut', 'İstavrit', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Perşembe',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Doğal Burun)',
    verificationNote: 'Yason Burnu doğal kaya dili ve fenerinin fiziki varlığı OSM ve fener katmanında teyitlidir.',
    verifiedGeoFeature: 'Karadeniz’e dik uzanan tarihi Yason Burnu doğal kaya dili ve feneri',
    commonTargetSpecies: ['Lüfer', 'Palamut', 'Levrek', 'İstavrit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Şiddetli burun akıntısı ve ters dalgalar; fırtınalı havalarda burun ucu hayati risk taşır.'
  },
  {
    id: 'persembe-camburnu',
    name: 'Perşembe Çamburnu (Vona Feneri) Falezleri',
    il: 'Ordu',
    ilce: 'Perşembe',
    lat: 41.1160,
    lng: 37.7860,
    kiyiYapisi: 'kayalik_burun',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Doğal Falez & Fener Kayalıkları)',
    kaynak: 'OSM Node (Çamburnu Deniz Feneri) & Falez Kıyı Çizgisi',
    erisimDurumu: 'Karayolu fener virajından dik ve patikalı araziden kıyıya dikkatle inilir; fiziksel erişim zorludur.',
    kisitlarVeRiskler: 'Dik uçurum falez yapısı, kaygan kayalar; gece inişinde ciddi düşme tehlikesi; dalga çarpması riski.',
    belirsizlikler: 'Kıyıya güvenli yaya iniş patikasının mevsimsel durumu; kesin derinlik haritası yoktur.',
    balikcilikGerekcesi: 'Derin su falezleri ve doğal kovuklar gece eşkina ve karagöz avcılığı için klasik doğal meradır.',
    hedeflenenTurler: ['Eşkina', 'Karagöz', 'İstavrit', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Perşembe',
    locationType: 'Doğal Kayalık Burun',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Falez & Fener)',
    verificationNote: 'Kaleyaka Çamburnu mevkii doğal kayalık burun ve feneri teyitlidir.',
    verifiedGeoFeature: 'Doğal dik kayalık burun, falezler ve fener mevkii',
    commonTargetSpecies: ['Eşkina', 'Karagöz', 'İstavrit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Dik falez arazisi; gece avında kesinlikle aydınlatma ve kaymayan taban gerekir.'
  },
  {
    id: 'persembe-vona-barinak',
    name: 'Perşembe Vona Balıkçı Barınağı',
    il: 'Ordu',
    ilce: 'Perşembe',
    lat: 41.0675,
    lng: 37.7745,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Liman Rıhtımı & Mendirek)',
    kaynak: 'OSM Way (Perşembe Balıkçı Barınağı Mendireği)',
    erisimDurumu: 'İlçe merkezinden liman rıhtımına ve mendirek üzerine yaya erişimi tamamen açıktır.',
    kisitlarVeRiskler: 'Balıkçı tekneleri ve ağ donatma faaliyetleri; rıhtım ve mendirek kenarlarında ıslak zemin.',
    belirsizlikler: 'Dip batimetri ölçümü bulunmuyor; barınak içi dönem dönem dip taraması görebilir.',
    balikcilikGerekcesi: 'Vona Koyu doğal korunaklı derin bir körfezdir; kötü havalarda balık barınak içine ve mendirek eteğine sığınır.',
    hedeflenenTurler: ['İstavrit', 'Mezgit', 'Çinekop', 'Eşkina'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Perşembe',
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Liman Mendireği)',
    verificationNote: 'Perşembe Vona Limanı rıhtım ve mendirek yapısının fiziki varlığı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Doğal korunaklı derin Vona koyu ve balıkçı rıhtımı mendireği',
    commonTargetSpecies: ['Eşkina', 'İstavrit', 'Karagöz', 'Mezgit'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Gece avında aydınlatma gerekir; rıhtım kenarları yosunlu ve kaygan olabilir.'
  },
  {
    id: 'ordu-efirli-koyu',
    name: 'Altınordu Efirli Koyu Sahili',
    il: 'Ordu',
    ilce: 'Altınordu',
    lat: 41.0115,
    lng: 37.8115,
    kiyiYapisi: 'kumsal',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Kumsal Koy Şeridi)',
    kaynak: 'OSM Way (Efirli Plajı & Kıyı Çizgisi)',
    erisimDurumu: 'Sahil yolundan kumsala merdiven ve yollarla rahat erişim.',
    kisitlarVeRiskler: 'Sığ kumluk; surfcasting takımı gerekir; yaz aylarında plaj kalabalığı.',
    belirsizlikler: 'Batimetri ölçülmemiştir.',
    balikcilikGerekcesi: 'Kumluk ve hafif çakıllı koy içi kalkan ve mırmır türlerine ev sahipliği yapar.',
    hedeflenenTurler: ['Kalkan', 'Mırmır', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Altınordu',
    locationType: 'Kumsal / Plaj Şeridi',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Kumsal Koy)',
    verificationNote: 'Efirli sahil koyu kumsal su çizgisinin konumu teyitlidir.',
    verifiedGeoFeature: 'Doğal hilal biçimli kumsal koy sahil şeridi',
    commonTargetSpecies: ['Kalkan', 'Mırmır', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Sığ kumluk sahil; dalgalı havalarda sahil çırpıntısı artar.'
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
    kanitSeviyesiBadge: '⚓ Doğrulandı (Kentsel Sahil Tahkimatı & İskele)',
    kaynak: 'OSM Way (Ordu Sahil Kordonu Taş Dolgusu & 19 Eylül İskelesi)',
    erisimDurumu: 'Şehir sahil kordonu yürüyüş yolundan doğrudan erişilebilir.',
    kisitlarVeRiskler: 'Şehir merkezinde yoğun yaya akışı; arkaya atış emniyeti alınmalıdır; taş tahkimat yosunlu olabilir.',
    belirsizlikler: 'Kıyı dolgusu önündeki derinlik değişimi; batimetri verisi yoktur.',
    balikcilikGerekcesi: 'Işıklandırılmış sahil şeridi gece plankton ve yem balıklarını çeker; istavrit ve çinekop avı yapılır.',
    hedeflenenTurler: ['İstavrit', 'Çinekop', 'Lüfer', 'Mezgit'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Altınordu',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Kordon Tahkimatı)',
    verificationNote: 'Altınordu Taşbaşı sahil dolgusu ve 19 Eylül iskelesinin fiziki varlığı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Altınordu sahil dolgusu, Taşbaşı kayalık hattı ve iskele',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Lüfer', 'Minekop'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Halk yürüyüş yolu üzeri; atış esnasında arkadaki yayalara dikkat edilmeli.'
  },
  {
    id: 'ordu-melet-irmagi',
    name: 'Altınordu Melet Irmağı Mansabı',
    il: 'Ordu',
    ilce: 'Altınordu',
    lat: 40.9850,
    lng: 37.9350,
    kiyiYapisi: 'dere_agzi',
    kanitSeviyesi: 'ADAY',
    kanitSeviyesiBadge: '📍 Aday Kıyı (Büyük Nehir Mansabı / Çakıl Kıyısı)',
    kaynak: 'OSM Waterway (Melet Irmağı) Mansap Noktası',
    erisimDurumu: 'Cumhuriyet sahil dolgusundan ırmak ağzı sahil şeridine yaya intikali mümkündür.',
    kisitlarVeRiskler: 'Şiddetli akarsu debisi, çakıllı taban akıntısı ve yağışta yoğun bulanıklık.',
    belirsizlikler: 'Irmağın taşıdığı rüsubat nedeniyle derinlik sürekli değişir; batimetri yoktur.',
    balikcilikGerekcesi: 'Akarsu-deniz karışım zonu levrek, kefal ve minekop avı için doğal beslenme alanıdır.',
    hedeflenenTurler: ['Levrek', 'Kefal', 'Minekop', 'Kalkan'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Altınordu',
    locationType: 'Nehir / Dere Ağzı',
    verificationStatus: 'ADAY',
    verificationBadge: '📍 Aday Kıyı (Dere Ağzı)',
    verificationNote: 'Melet Irmağı mansap ağzı su kavşağının konumu teyitlidir.',
    verifiedGeoFeature: 'Melet Irmağı mansabının denize karıştığı çakıl ve kumsal hat',
    commonTargetSpecies: ['Levrek', 'Minekop', 'Kalkan', 'Kefal'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Irmak akıntısı ve çakıllı değişken zemin; debi değişimlerine dikkat edilmeli.'
  },
  {
    id: 'ordu-gulyali-barinak',
    name: 'Gülyalı Balıkçı Barınağı Mendireği',
    il: 'Ordu',
    ilce: 'Gülyalı',
    lat: 40.9635,
    lng: 38.0055,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'DOGRULANDI',
    kanitSeviyesiBadge: '⚓ Doğrulandı (Balıkçı Barınağı Mendireği)',
    kaynak: 'OSM Way (Gülyalı Balıkçı Barınağı Taş Mendireği & Feneri)',
    erisimDurumu: 'Barınak sahil yolundan mendirek köküne ve taş tahkimat üzerine yaya geçişi vardır.',
    kisitlarVeRiskler: 'Mendirek dışındaki taşlar dalgalı havalarda ıslanır; kayma riski.',
    belirsizlikler: 'Kesin batimetri haritası yoktur.',
    balikcilikGerekcesi: 'Mendirek dış burnu Karadeniz akıntısına açıktır; çapariyle istavrit ve yemli dip takımıyla mezgit avı yapılır.',
    hedeflenenTurler: ['İstavrit', 'Mezgit', 'Çinekop', 'Levrek'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Gülyalı',
    locationType: 'Mendirek / Taş Tahkimat',
    verificationStatus: 'DOGRULANDI',
    verificationBadge: '⚓ Doğrulandı (Barınak Mendireği)',
    verificationNote: 'Gülyalı balıkçı barınağı taş mendireğinin fiziki varlığı OSM katmanında teyitlidir.',
    verifiedGeoFeature: 'Gülyalı korunaklı balıkçı barınağı taş mendireği ve feneri',
    commonTargetSpecies: ['İstavrit', 'Çinekop', 'Mezgit', 'Levrek'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Mendirek dışı kayalık ve dalgalıdır; kaygan taşlara dikkat ediniz.'
  },
  {
    id: 'ordu-gulyali-havalimani-tahkimat',
    name: 'Ordu-Giresun Havalimanı Deniz Tahkimatı',
    il: 'Ordu',
    ilce: 'Gülyalı',
    lat: 40.9675,
    lng: 38.0750,
    kiyiYapisi: 'mendirek',
    kanitSeviyesi: 'ERISIM_KISITLI_VEYA_RISKLI',
    kanitSeviyesiBadge: '⛔ Erişim Kısıtlı (Havalimanı Özel Güvenlik Bölgesi)',
    kaynak: 'OSM Way / OGU Havalimanı Deniz Dolgusu & DHMİ Güvenlik Sınırı',
    erisimDurumu: 'DHMİ Özel Güvenlik ve Havacılık Güvenliği Bölgesi sınırları içerisindedir; tel örgüler ve nöbet kuleleriyle çevrilidir; sivil yaya girişi KESİNLİKLE YASAKTIR.',
    kisitlarVeRiskler: 'Havalimanı pisti koruma dalgakıranıdır; izinsiz giriş adli ve cezai yaptırıma tabidir; sivil veya amatör balıkçılık yapılamaz.',
    belirsizlikler: 'Bu alanda amatör balıkçılığa izin verilmesi söz konusu değildir.',
    balikcilikGerekcesi: 'Deniz dolgusu yapay resif gibi taş bloklardan oluşsa da güvenlik kısıtları nedeniyle avlanılamaz bölgedir.',
    hedeflenenTurler: ['Erişim Yasak — Avlanılamaz'],
    derinlikDurumu: 'Ölçülmüş batimetri verisi yok',
    city: 'Ordu',
    district: 'Gülyalı',
    locationType: 'Liman / Barınak İçi',
    verificationStatus: 'ERISIM_KISITLI_VEYA_RISKLI',
    verificationBadge: '⛔ Erişim Kısıtlı (Havalimanı Güvenlik Alanı)',
    verificationNote: 'Ordu-Giresun Havalimanı deniz tahkimatına sivil giriş yasaktır; avlanılamaz sahadır.',
    verifiedGeoFeature: 'Havalimanı deniz dolgusu koruma mendireği ve dalgakıranı',
    commonTargetSpecies: ['Erişim Yasak — Avlanılamaz'],
    depthStatus: 'Ölçülmüş batimetri verisi yok',
    cautions: 'Giriş kesinlikle yasaktır; DHMİ özel güvenlik sahasıdır.'
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
      // Yalnızca dış sınır (exterior ring - coordinates[0]) deniz kıyısını temsil eder.
      // İç halkalar (delikler / göller) kıyı uzaklığı hesabını yanıltmamalıdır.
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
    'Sınıflandırma, samsunOrduLand.geojson içindeki genelleştirilmiş kara poligonu sınırına dayanır. Bu veri resmî kadastro kıyı kenar çizgisi veya batimetri (derinlik) değildir; 450 metre kıyı bandı yaklaşık geometrik bir eşiktir. Erişim ve güvenlik sahada doğrulanmalıdır.';

  // 1a. Veri yetersizliği veya sınır hesaplama hatası kontrolü (Belirsiz)
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

  // 1b. Poligon içi delik/boşluk kontrolü (İç su alanları veya geometrik veri boşlukları)
  if (isPointInAnyHole(lat, lng)) {
    return {
      zone: 'Belirsiz (Coğrafi Veriyle Doğrulanamadı)',
      zoneType: 'belirsiz',
      isWithinBounds: true,
      distanceToCoastKm: roundedCoastDistanceKm,
      description:
        'Seçilen koordinat kara poligonunun iç halkasında (iç su, delik veya veri kesintisi) kalmaktadır. Deniz kıyısı veya açık deniz verisiyle doğrudan doğrulanamaz.',
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
        `Seçilen koordinat GeoJSON kara-deniz sınırına yaklaşık ${Math.round(coastDistanceKm * 1000)} metre mesafededir (~450 m yaklaşık geometrik kıyı bandı eşiği içindedir; resmî kıyı çizgisi değildir). Erişim ve güvenlik sahada doğrulanmalıdır.`,
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
      missingDataWarnings: [
        'Bölgesel kıyı veri tabanı kapsamı dışındadır.',
        'Erişim ve güvenlik sahada doğrulanmalı.'
      ],
      disclaimer: 'Analiz sınırları dışındaki alanlar için avlanma uygunluğu değerlendirmesi yapılmaz. Erişim ve güvenlik sahada doğrulanmalı.'
    };
  }

  // 2. Kayıtlı Bir Kıyı Noktası Seçildiyse
  if (selectedSpot) {
    if (selectedSpot.kanitSeviyesi === 'ERISIM_KISITLI_VEYA_RISKLI') {
      return {
        status: 'TEYITSIZ_HAT',
        badgeTitle: '⛔ ' + selectedSpot.kanitSeviyesiBadge,
        badgeTone: 'red',
        summary: `${selectedSpot.name} noktasında erişim kısıtlaması veya yüksek güvenlik riski bulunmaktadır: ${selectedSpot.kisitlarVeRiskler} Sivillerin veya amatör balıkçıların bu sahaya girmesi yasaktır veya hayati tehlike taşır.`,
        coastalStructureInfo: `Kıyı Yapısı: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature}) · Kaynak: ${selectedSpot.kaynak}`,
        generalFishingConditions: `Erişim Durumu: ${selectedSpot.erisimDurumu} ${selectedSpot.cautions}`,
        missingDataWarnings: [
          `Giriş ve Yasal Durum: ${selectedSpot.erisimDurumu}`,
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
        summary: `${selectedSpot.name} noktasında mendirek, barınak veya taş tahkimat gibi fiziksel bir kıyı yapısı coğrafi olarak teyitlidir (${selectedSpot.kaynak}). Balıkçılık gerekçesi: ${selectedSpot.balikcilikGerekcesi}. Ancak fiziki yapının var olması, serbest veya tehlikesiz erişim olduğu anlamına gelmez. Erişim ve güvenlik sahada doğrulanmalı; balık mevcudiyeti veya av garantisi verilemez.`,
        coastalStructureInfo: `Fiziksel Kıyı Yapısı: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature})`,
        generalFishingConditions: `${selectedSpot.erisimDurumu} ${selectedSpot.cautions}`,
        missingDataWarnings: [
          `Erişim ve Güvenlik: ${selectedSpot.erisimDurumu} (${selectedSpot.kisitlarVeRiskler})`,
          `Derinlik: ${selectedSpot.derinlikDurumu} (Resmi batimetri ölçümü bulunmamaktadır; kesin metre değeri verilemez).`,
          `Belirsizlikler: ${selectedSpot.belirsizlikler}`,
          'Anlık balık sürüsü tespiti veya av verim garantisi mevcut değildir.'
        ],
        disclaimer: 'Fiziki yapının varlığı güvenli erişimi veya balık avı başarısını garanti etmez. Erişim ve güvenlik sahada doğrulanmalı.'
      };
    }

    if (selectedSpot.kanitSeviyesi === 'ADAY') {
      return {
        status: 'COGRAFI_REFERANS',
        badgeTitle: '📍 ' + selectedSpot.kanitSeviyesiBadge,
        badgeTone: 'emerald',
        summary: `${selectedSpot.name} doğal kumsal, burun veya akarsu mansabı kıyı referansıdır (${selectedSpot.kaynak}). Balıkçılık gerekçesi: ${selectedSpot.balikcilikGerekcesi}. Sabit bir taş tahkimat veya mendirek bulunmayabilir; kıyı tabanı dalgalarla değişkendir. Erişim ve güvenlik sahada doğrulanmalı.`,
        coastalStructureInfo: `Kıyı Tipi: ${selectedSpot.locationType} (${selectedSpot.verifiedGeoFeature})`,
        generalFishingConditions: `${selectedSpot.erisimDurumu} ${selectedSpot.cautions}`,
        missingDataWarnings: [
          `Saha Kısıtı: ${selectedSpot.kisitlarVeRiskler}`,
          `Derinlik: ${selectedSpot.derinlikDurumu}`,
          `Belirsizlikler: ${selectedSpot.belirsizlikler}`,
          'Balık yoğunluğu veya av başarısı garantisi bulunmamaktadır.'
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
      coastalStructureInfo: `Kıyı Tipi: ${selectedSpot.locationType} (Noktasal Mera Teyidi Yok)`,
      generalFishingConditions: `${selectedSpot.erisimDurumu} ${selectedSpot.cautions}`,
      missingDataWarnings: [
        `Veri Eksikliği: ${selectedSpot.belirsizlikler}`,
        `Riskler: ${selectedSpot.kisitlarVeRiskler}`,
        selectedSpot.derinlikDurumu
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
      summary: `Seçilen koordinat kıyı çizgisine yaklaşık ~${geo.distanceToCoastKm !== null ? Math.round(geo.distanceToCoastKm * 1000) : '?'} metre mesafededir (~450 metre kıyı bandı yaklaşık geometrik bir sınıflandırma eşiğidir, resmî kıyı kenar çizgisi değildir). Bu noktada kayıtlı bir mera, mendirek veya güvenli olta atış yeri teyit edilmemiştir. Erişim ve güvenlik sahada doğrulanmalı.`,
      coastalStructureInfo: 'Kayıtsız Kıyı Şeridi (~450 m yaklaşık geometrik kıyı bandı; resmî kıyı kenar çizgisi değildir)',
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
