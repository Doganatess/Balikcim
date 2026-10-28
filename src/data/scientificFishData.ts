/**
 * Balıkcım — Bilimsel Balık Türleri Profilleri ve Ekolojik Koşul Değerlendirme Sistemi
 * 
 * Veri Kaynakları ve Bilimsel Literatür:
 * 1. FishBase (Froese, R. and D. Pauly. Editors. 2024. World Wide Web electronic publication. www.fishbase.org)
 * 2. T.C. Tarım ve Orman Bakanlığı 5/2 Numaralı Amatör Amaçlı Su Ürünleri Avcılığını Düzenleyen Tebliğ (Resmî Gazete)
 * 3. TÜDAV (Türk Deniz Araştırmaları Vakfı) Karadeniz Kıyı Balıkları ve Biyoçeşitlilik Raporları (tudav.org)
 * 4. TÜBİTAK MAM & KTÜ Deniz Bilimleri Fakültesi Kıyı Oşinografisi Araştırmaları
 * 
 * İlke:
 * - Yapay "%88 Aktivite İndeksi" yerine somut su sıcaklığı, dalga, rüzgâr ve mevsimsel göç
 *   gerekçelerine dayalı bilimsel koşul analizi sunulur.
 */

export interface ScientificSourceRef {
  title: string;
  authorOrOrg: string;
  yearOrEdition: string;
  url: string;
  type: 'Akademik Veritabanı (FishBase)' | 'Resmî Mevzuat (Tebliğ 5/2)' | 'Bilimsel Vakıf Raporu (TÜDAV)' | 'Oşinografik Araştırma';
}

export interface ScientificFishProfile {
  id: string;
  turkishName: string;
  scientificName: string;
  family: string;
  order: string;
  blackSeaSeasonality: string;
  legalMinLengthCm: number;
  legalLengthRuleText: string;
  seasonalBansText: string;
  bagLimitText: string;
  trophicLevel: number; // FishBase trofik seviyesi (örn. 4.2 yırtıcı)
  feedingHabits: string;
  inshoreTriggerConditions: {
    tempOptimalMin: number;
    tempOptimalMax: number;
    waveMinM: number;
    waveMaxM: number;
    preferredWinds: string[];
    diurnalPreference: 'Gündoğumu/Günbatımı (Alacakaranlık)' | 'Gece (Nokturnal)' | 'Gündüz (Diyurnal)' | 'Tüm Gün';
    coastalBehavior: string;
  };
  scientificReferences: ScientificSourceRef[];
}

export interface ConditionEvaluationResult {
  rating: 'Koşullar Elverişli' | 'Orta / Dikkat' | 'Koşullar Elverişsiz' | 'Yeterli Veri Yok';
  badgeTone: 'emerald' | 'amber' | 'red' | 'slate';
  scientificJustification: string;
  factorAnalyses: {
    temperature: { status: 'ideal' | 'tolerable' | 'unfavorable' | 'nodata'; text: string };
    wave: { status: 'ideal' | 'tolerable' | 'unfavorable' | 'nodata'; text: string };
    wind: { status: 'ideal' | 'tolerable' | 'unfavorable' | 'nodata'; text: string };
    season: { status: 'peak' | 'present' | 'offseason'; text: string };
  };
  regulatoryNotice: string;
  isSeasonalBanActive: boolean;
  scientificCitations: ScientificSourceRef[];
}

/**
 * FishBase ve Tarım Bakanlığı Tebliğ 5/2 teyitli tür profilleri kataloğu
 */
export const SCIENTIFIC_FISH_DATABASE: Record<string, ScientificFishProfile> = {
  cinekop: {
    id: 'cinekop',
    turkishName: 'Çinekop / Sarıkanat (Genç Lüfer)',
    scientificName: 'Pomatomus saltatrix (Juvenil)',
    family: 'Pomatomidae',
    order: 'Perciformes',
    blackSeaSeasonality: 'Eylül – Ocak (Sonbahar Karadeniz Boğaz göçü)',
    legalMinLengthCm: 18,
    legalLengthRuleText: '18 cm (5/2 Tebliğ gereği 18 cm altındaki yaprak boylar kesinlikle denize iade edilmelidir).',
    seasonalBansText: 'Amatör olta avcılığı için yıl boyu serbesttir; boy limitine uyulması zorunludur.',
    bagLimitText: 'Kişi başı günlük en fazla 5 kg.',
    trophicLevel: 4.1,
    feedingHabits: 'Agresif pelajik etobur; hamsi (Engraulis encrasicolus), çaça (Sprattus sprattus) ve küçük istavrit sürülerini kovalar.',
    inshoreTriggerConditions: {
      tempOptimalMin: 13,
      tempOptimalMax: 19,
      waveMinM: 0.3,
      waveMaxM: 1.2,
      preferredWinds: ['K', 'KD', 'KB'],
      diurnalPreference: 'Gündoğumu/Günbatımı (Alacakaranlık)',
      coastalBehavior: 'Poyraz veya karayel rüzgârlarında kıyı burunlarına sürüklenen küçük yem balıklarını sıkıştırmak için kıyılar.'
    },
    scientificReferences: [
      {
        title: 'Pomatomus saltatrix (Linnaeus, 1766) Profile',
        authorOrOrg: 'FishBase (Froese & Pauly)',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Pomatomus-saltatrix.html',
        type: 'Akademik Veritabanı (FishBase)'
      },
      {
        title: '5/2 Numaralı Amatör Amaçlı Su Ürünleri Avcılığını Düzenleyen Tebliğ',
        authorOrOrg: 'T.C. Tarım ve Orman Bakanlığı',
        yearOrEdition: 'Resmî Gazete Madde 17',
        url: 'https://www.tarimorman.gov.tr/BSGM',
        type: 'Resmî Mevzuat (Tebliğ 5/2)'
      }
    ]
  },
  lufer: {
    id: 'lufer',
    turkishName: 'Lüfer',
    scientificName: 'Pomatomus saltatrix',
    family: 'Pomatomidae',
    order: 'Perciformes',
    blackSeaSeasonality: 'Eylül – Ocak (Karadeniz beslenme ve göç dönemi)',
    legalMinLengthCm: 18,
    legalLengthRuleText: '18 cm (Tebliğ 5/2 asgari boyu 18 cm; sürdürülebilirlik için 20 cm üstü kofana/lüfer hedeflenmelidir).',
    seasonalBansText: 'Yıl boyu olta avcılığına açıktır.',
    bagLimitText: 'Kişi başı günlük 5 kg.',
    trophicLevel: 4.5,
    feedingHabits: 'En üst düzey kıyı yırtıcısı; zargana, istavrit ve kefalleri parçalayarak beslenir.',
    inshoreTriggerConditions: {
      tempOptimalMin: 14,
      tempOptimalMax: 18,
      waveMinM: 0.4,
      waveMaxM: 1.4,
      preferredWinds: ['K', 'KD', 'B'],
      diurnalPreference: 'Gece (Nokturnal)',
      coastalBehavior: 'Akıntılı burun uçlarında ve fener altlarında canlı yem balıklarını avlamak için gece kıyı basamaklarına sokulur.'
    },
    scientificReferences: [
      {
        title: 'Pomatomus saltatrix Ecology & Distribution',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Pomatomus-saltatrix.html',
        type: 'Akademik Veritabanı (FishBase)'
      },
      {
        title: 'Karadeniz Deniz Biyoçeşitliliği Raporu',
        authorOrOrg: 'TÜDAV',
        yearOrEdition: '2022',
        url: 'https://tudav.org',
        type: 'Bilimsel Vakıf Raporu (TÜDAV)'
      }
    ]
  },
  levrek: {
    id: 'levrek',
    turkishName: 'Levrek',
    scientificName: 'Dicentrarchus labrax',
    family: 'Moronidae',
    order: 'Perciformes',
    blackSeaSeasonality: 'Tüm yıl mevcuttur; Ekim – Mart ayları kıyılama zirvesidir.',
    legalMinLengthCm: 25,
    legalLengthRuleText: '25 cm (Karadeniz ve Marmara için 5/2 Tebliğ asgari boyu 25 cm).',
    seasonalBansText: 'Amatör olta ile avcılığı yıl boyu serbesttir.',
    bagLimitText: 'Kişi başı en fazla 3 adet veya toplam 5 kg.',
    trophicLevel: 4.3,
    feedingHabits: 'Kıyı avcısı; kırılan dalgaların kaldırdığı teke (Palaemon serratus), deniz kurtları, çaça ve gümüş balıklarını pusu kurarak yer.',
    inshoreTriggerConditions: {
      tempOptimalMin: 11,
      tempOptimalMax: 19,
      waveMinM: 0.6,
      waveMaxM: 1.6,
      preferredWinds: ['K', 'KD', 'KB'],
      diurnalPreference: 'Gündoğumu/Günbatımı (Alacakaranlık)',
      coastalBehavior: 'Kıyıya çarparak köpüren kırılgan dalgalar (beyaz su) ve bulanık kıyı kırmaları levreğin avlanma kamuflajını sağlar.'
    },
    scientificReferences: [
      {
        title: 'Dicentrarchus labrax (Linnaeus, 1758) Biology',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Dicentrarchus-labrax.html',
        type: 'Akademik Veritabanı (FishBase)'
      },
      {
        title: '5/2 Tebliğ Ek-5 Çizelge',
        authorOrOrg: 'Tarım ve Orman Bakanlığı',
        yearOrEdition: '2020/2024',
        url: 'https://www.tarimorman.gov.tr',
        type: 'Resmî Mevzuat (Tebliğ 5/2)'
      }
    ]
  },
  istavrit: {
    id: 'istavrit',
    turkishName: 'Karadeniz İstavriti (Kraça / Sarıkanat İstavrit)',
    scientificName: 'Trachurus mediterraneus',
    family: 'Carangidae',
    order: 'Perciformes',
    blackSeaSeasonality: 'Mayıs – Aralık (Yaz ve sonbahar ayları kıyı sürüsü)',
    legalMinLengthCm: 13,
    legalLengthRuleText: '13 cm (5/2 Tebliğ asgari boy sınırı 13 cm).',
    seasonalBansText: 'Yıl boyu çapari ve yemli olta avcılığına açıktır.',
    bagLimitText: 'Kişi başı günlük 5 kg.',
    trophicLevel: 3.6,
    feedingHabits: 'Pelajik planktivor ve küçük balık avcısı; zooplankton, kopepod ve hamsi larvalarıyla beslenir.',
    inshoreTriggerConditions: {
      tempOptimalMin: 12,
      tempOptimalMax: 22,
      waveMinM: 0.2,
      waveMaxM: 0.9,
      preferredWinds: ['G', 'GD', 'D'],
      diurnalPreference: 'Gündoğumu/Günbatımı (Alacakaranlık)',
      coastalBehavior: 'Sakin ve az çalkantılı sularda sabahın ilk ışıklarında ve gün batımında yüzeye dikey göç yaparak çapari menziline girer.'
    },
    scientificReferences: [
      {
        title: 'Trachurus mediterraneus (Steindachner, 1868)',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Trachurus-mediterraneus.html',
        type: 'Akademik Veritabanı (FishBase)'
      }
    ]
  },
  palamut: {
    id: 'palamut',
    turkishName: 'Palamut (Çingene / Torik)',
    scientificName: 'Sarda sarda',
    family: 'Scombridae',
    order: 'Scombriformes',
    blackSeaSeasonality: 'Ağustos – Aralık (Göçmen pelajik)',
    legalMinLengthCm: 25,
    legalLengthRuleText: '25 cm (25 cm altı vonoz avı kesinlikle yasaktır).',
    seasonalBansText: '1 Nisan – 31 Ağustos arası gırgır ve ağ avı yasakları amatör çapariyi kapsamaz; ancak 25 cm asgari boy şarttır.',
    bagLimitText: 'Kişi başı günlük en fazla 10 adet.',
    trophicLevel: 4.4,
    feedingHabits: 'Hızlı pelajik avcı; hamsi, çaça ve zargana sürülerini yüksek hızla sürer.',
    inshoreTriggerConditions: {
      tempOptimalMin: 15,
      tempOptimalMax: 21,
      waveMinM: 0.4,
      waveMaxM: 1.3,
      preferredWinds: ['K', 'KD'],
      diurnalPreference: 'Gündoğumu/Günbatımı (Alacakaranlık)',
      coastalBehavior: 'Akıntı hızı > 0.3 m/s olan dış burunlarda ve derin su geçişlerinde yüzey sahtelerine saldırır.'
    },
    scientificReferences: [
      {
        title: 'Sarda sarda (Bloch, 1793) Scombridae Ecology',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Sarda-sarda.html',
        type: 'Akademik Veritabanı (FishBase)'
      }
    ]
  },
  kalkan: {
    id: 'kalkan',
    turkishName: 'Kalkan',
    scientificName: 'Scophthalmus maximus',
    family: 'Scophthalmidae',
    order: 'Pleuronectiformes',
    blackSeaSeasonality: 'Şubat – Mayıs (İlkbahar kumluk kıyı üreme yaklaşması)',
    legalMinLengthCm: 45,
    legalLengthRuleText: '45 cm (5/2 Tebliğ gereği Karadeniz kalkanı için en katı boy sınırı 45 cm\'dir).',
    seasonalBansText: '⚠️ DİKKAT: 15 NİSAN – 15 MAYIS tarihleri arasında Karadeniz\'de Kalkan avı her türlü istihsal vasıtasıyla YASAKTIR.',
    bagLimitText: 'Kişi başı günlük en fazla 2 adet.',
    trophicLevel: 4.0,
    feedingHabits: 'Bentik kumluk pusucusu; kumlara gömülerek çaça, hamsi, dip yengeçleri ve mezgitleri avlar.',
    inshoreTriggerConditions: {
      tempOptimalMin: 8,
      tempOptimalMax: 15,
      waveMinM: 0.5,
      waveMaxM: 1.5,
      preferredWinds: ['K', 'KD'],
      diurnalPreference: 'Gündüz (Diyurnal)',
      coastalBehavior: 'Kuzey rüzgârlarının kumsalı çalkaladığı günlerde dalga arkası kum tepeciklerinde yem arar.'
    },
    scientificReferences: [
      {
        title: 'Scophthalmus maximus (Linnaeus, 1758)',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Scophthalmus-maximus.html',
        type: 'Akademik Veritabanı (FishBase)'
      },
      {
        title: '5/2 Tebliğ Madde 12: Kalkan Avı Yasak Dönemleri',
        authorOrOrg: 'T.C. Tarım ve Orman Bakanlığı',
        yearOrEdition: 'Resmî Gazete',
        url: 'https://www.tarimorman.gov.tr',
        type: 'Resmî Mevzuat (Tebliğ 5/2)'
      }
    ]
  },
  minekop: {
    id: 'minekop',
    turkishName: 'Minekop (Kötek)',
    scientificName: 'Umbrina cirrosa',
    family: 'Sciaenidae',
    order: 'Acanthuriformes',
    blackSeaSeasonality: 'Eylül – Aralık (Sonbahar kıyı kumluk/çakıllık geçişleri)',
    legalMinLengthCm: 30,
    legalLengthRuleText: '30 cm (5/2 Tebliğ asgari boy 30 cm).',
    seasonalBansText: 'Yıl boyu olta avına açıktır.',
    bagLimitText: 'Kişi başı günlük en fazla 3 adet.',
    trophicLevel: 3.8,
    feedingHabits: 'Bentik kabuklu tüketicisi; çenesindeki bıyıkla kumu karıştırarak deniz solucanı, sülünez ve küçük yengeçleri bulur.',
    inshoreTriggerConditions: {
      tempOptimalMin: 14,
      tempOptimalMax: 20,
      waveMinM: 0.4,
      waveMaxM: 1.2,
      preferredWinds: ['K', 'KD', 'D'],
      diurnalPreference: 'Gece (Nokturnal)',
      coastalBehavior: 'Gece karanlığında dalganın kumu karıştırdığı 3-10 metre sığlıklara sokulur.'
    },
    scientificReferences: [
      {
        title: 'Umbrina cirrosa (Linnaeus, 1758) Sciaenidae',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Umbrina-cirrosa.html',
        type: 'Akademik Veritabanı (FishBase)'
      }
    ]
  },
  eskina: {
    id: 'eskina',
    turkishName: 'Eşkina (Taş Balığı)',
    scientificName: 'Sciaena umbra',
    family: 'Sciaenidae',
    order: 'Acanthuriformes',
    blackSeaSeasonality: 'Mayıs – Ekim (Yaz ve erken sonbahar)',
    legalMinLengthCm: 25,
    legalLengthRuleText: '25 cm (5/2 Tebliğ asgari boy 25 cm).',
    seasonalBansText: 'Yıl boyu olta avına açıktır.',
    bagLimitText: 'Kişi başı günlük en fazla 3 adet.',
    trophicLevel: 3.7,
    feedingHabits: 'Kovuk ve yarık sakini; gece çıkarak kayalık zeminlerdeki canlı teke ve kaya yengeçlerini yer.',
    inshoreTriggerConditions: {
      tempOptimalMin: 15,
      tempOptimalMax: 22,
      waveMinM: 0.2,
      waveMaxM: 0.8,
      preferredWinds: ['G', 'GB', 'Sakin'],
      diurnalPreference: 'Gece (Nokturnal)',
      coastalBehavior: 'Sakin ve berrak sularda, gece saat 21:00-02:00 arasında mendirek taşlarının dibine çıkar.'
    },
    scientificReferences: [
      {
        title: 'Sciaena umbra (Linnaeus, 1758)',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Sciaena-umbra.html',
        type: 'Akademik Veritabanı (FishBase)'
      }
    ]
  },
  karagoz: {
    id: 'karagoz',
    turkishName: 'Karagöz (Kaçık / Baltabaş)',
    scientificName: 'Diplodus vulgaris',
    family: 'Sparidae',
    order: 'Spariformes',
    blackSeaSeasonality: 'Eylül – Nisan (Kayalık burunlar)',
    legalMinLengthCm: 18,
    legalLengthRuleText: '18 cm (5/2 Tebliğ asgari boy 18 cm).',
    seasonalBansText: 'Yıl boyu açıktır.',
    bagLimitText: 'Kişi başı günlük 5 kg.',
    trophicLevel: 3.5,
    feedingHabits: 'Omnivor/bentivor; kayalardaki midye kabuklarını kırar, deniz yosunları ve solucanları yer.',
    inshoreTriggerConditions: {
      tempOptimalMin: 14,
      tempOptimalMax: 21,
      waveMinM: 0.4,
      waveMaxM: 1.1,
      preferredWinds: ['KD', 'K', 'B'],
      diurnalPreference: 'Gündoğumu/Günbatımı (Alacakaranlık)',
      coastalBehavior: 'Kayalara vuran çırpıntılı dalgaların oluşturduğu köpüklerin altında midye kırıntılarını ayıklar.'
    },
    scientificReferences: [
      {
        title: 'Diplodus vulgaris (Geoffroy Saint-Hilaire, 1817)',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Diplodus-vulgaris.html',
        type: 'Akademik Veritabanı (FishBase)'
      }
    ]
  },
  cipura: {
    id: 'cipura',
    turkishName: 'Çipura (Alyanak)',
    scientificName: 'Sparus aurata',
    family: 'Sparidae',
    order: 'Spariformes',
    blackSeaSeasonality: 'Karadeniz\'de doğal popülasyonu son derece kısıtlıdır; kafes kaçkını veya nadir geçiş bireyleri görülür.',
    legalMinLengthCm: 20,
    legalLengthRuleText: '20 cm (5/2 Tebliğ asgari boy 20 cm).',
    seasonalBansText: 'Yıl boyu açıktır.',
    bagLimitText: 'Kişi başı günlük 5 kg.',
    trophicLevel: 3.5,
    feedingHabits: 'Sert kabuklu kırıcı; midye, mamun, yengeç ve sülünez ile beslenir.',
    inshoreTriggerConditions: {
      tempOptimalMin: 16,
      tempOptimalMax: 23,
      waveMinM: 0.2,
      waveMaxM: 0.8,
      preferredWinds: ['G', 'GB'],
      diurnalPreference: 'Gündüz (Diyurnal)',
      coastalBehavior: 'Ilık kumluk-çakıllık koylarda dip yemlenmesi yapar; Karadeniz kış sıcaklıkları tür için düşüktür.'
    },
    scientificReferences: [
      {
        title: 'Sparus aurata (Linnaeus, 1758)',
        authorOrOrg: 'FishBase',
        yearOrEdition: '2024',
        url: 'https://www.fishbase.se/summary/Sparus-aurata.html',
        type: 'Akademik Veritabanı (FishBase)'
      }
    ]
  }
};

/**
 * Mevcut gerçek hava ve deniz koşullarına göre hedef balık için bilimsel koşul değerlendirmesi üretir
 */
export function evaluateScientificFishingCondition(
  fishId: string,
  current: {
    airTemp: number;
    waterTemp: number | null;
    windSpeed: number;
    windDirection: string;
    waveHeight: number | null;
    precipitationMm: number;
  },
  geoZoneType: string = 'kiyi'
): ConditionEvaluationResult {
  const profile = SCIENTIFIC_FISH_DATABASE[fishId] || SCIENTIFIC_FISH_DATABASE['levrek'];
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();

  // Kalkan için 15 Nisan - 15 Mayıs yasak kontrolü
  let isSeasonalBanActive = false;
  let banMessage = '';
  if (profile.id === 'kalkan') {
    if ((currentMonth === 4 && currentDay >= 15) || (currentMonth === 5 && currentDay <= 15)) {
      isSeasonalBanActive = true;
      banMessage = '⛔ 15 NİSAN – 15 MAYIS YASAK DÖNEMİ: 5/2 Numaralı Tebliğ uyarınca Karadeniz\'de Kalkan avı şu anda YASAKTIR. Hedeflenen tür değiştirilmelidir.';
    }
  }

  // Karasal alan veya açık deniz uyarısı
  if (geoZoneType === 'kara') {
    return {
      rating: 'Koşullar Elverişsiz',
      badgeTone: 'red',
      scientificJustification: 'Seçilen koordinat karasal alandadır. Deniz balıkçılığı ve biyolojik kıyılama davranışı karasal alanda gerçekleşemez.',
      factorAnalyses: {
        temperature: { status: 'unfavorable', text: 'Karasal alan.' },
        wave: { status: 'unfavorable', text: 'Dalga yok (Kara).' },
        wind: { status: 'unfavorable', text: 'Karasal rüzgâr.' },
        season: { status: 'offseason', text: 'Karasal alan.' }
      },
      regulatoryNotice: profile.legalLengthRuleText,
      isSeasonalBanActive: false,
      scientificCitations: profile.scientificReferences
    };
  }

  // Su Sıcaklığı Analizi
  const targetTemp = current.waterTemp ?? current.airTemp; // Su sıcaklığı yoksa hava sıcaklığı referans alınır ancak not düşülür
  const { tempOptimalMin, tempOptimalMax, waveMinM, waveMaxM, preferredWinds } = profile.inshoreTriggerConditions;

  let tempStatus: 'ideal' | 'tolerable' | 'unfavorable' | 'nodata' = 'tolerable';
  let tempReason = '';

  if (current.waterTemp !== null) {
    if (current.waterTemp >= tempOptimalMin && current.waterTemp <= tempOptimalMax) {
      tempStatus = 'ideal';
      tempReason = `Su sıcaklığı ${current.waterTemp}°C, ${profile.turkishName} için literatürde belirtilen ideal ${tempOptimalMin}-${tempOptimalMax}°C beslenme penceresindedir.`;
    } else if (current.waterTemp >= tempOptimalMin - 3 && current.waterTemp <= tempOptimalMax + 3) {
      tempStatus = 'tolerable';
      tempReason = `Su sıcaklığı ${current.waterTemp}°C, optimum ${tempOptimalMin}-${tempOptimalMax}°C aralığının sınırında ancak türün tolerans sınırları içindedir.`;
    } else {
      tempStatus = 'unfavorable';
      tempReason = `Su sıcaklığı ${current.waterTemp}°C, türün kıyı beslenme aralığından (${tempOptimalMin}-${tempOptimalMax}°C) uzaktır; metabolizma ve yemlenme yavaşlayabilir.`;
    }
  } else {
    tempStatus = 'nodata';
    tempReason = `Canlı deniz suyu sıcaklığı ölçümü mevcut değildir (Hava: ${current.airTemp}°C referansı). Gerçek su sıcaklığı sahada kontrol edilmelidir.`;
  }

  // Dalga / Çalkantı Analizi
  let waveStatus: 'ideal' | 'tolerable' | 'unfavorable' | 'nodata' = 'tolerable';
  let waveReason = '';

  if (current.waveHeight !== null && current.waveHeight !== undefined) {
    if (current.waveHeight >= waveMinM && current.waveHeight <= waveMaxM) {
      waveStatus = 'ideal';
      waveReason = `Dalga boyu ${current.waveHeight}m; kıyıda ${profile.inshoreTriggerConditions.coastalBehavior}`;
    } else if (current.waveHeight < waveMinM) {
      waveStatus = 'tolerable';
      waveReason = `Dalga boyu ${current.waveHeight}m (durgun su); kıyıda çalkantı ve köpük az olduğundan balık temkinli davranabilir.`;
    } else {
      waveStatus = 'unfavorable';
      waveReason = `Dalga boyu ${current.waveHeight}m (kuvvetli çalkantı); kıyı atış güvenliği riskli ve dip akıntısı takımı sürükleyebilir.`;
    }
  } else {
    waveStatus = 'nodata';
    waveReason = 'Açık deniz dalga model verisi bulunamadı; kıyı çalkantı durumu sahada kontrol edilmelidir.';
  }

  // Rüzgâr Analizi
  let windStatus: 'ideal' | 'tolerable' | 'unfavorable' | 'nodata' = 'tolerable';
  let windReason = '';
  const isPreferredWind = preferredWinds.some(w => current.windDirection.includes(w));

  if (current.windSpeed > 35) {
    windStatus = 'unfavorable';
    windReason = `Rüzgâr hızı ${current.windSpeed} km/sa; olta kontrolü ve kıyı güvenliği açısından aşırı serttir.`;
  } else if (isPreferredWind && current.windSpeed >= 8 && current.windSpeed <= 25) {
    windStatus = 'ideal';
    windReason = `${current.windDirection} yönünden ${current.windSpeed} km/sa rüzgâr; kıyıya doğru yem yığılmasını ve yüzey oksijenlenmesini destekler.`;
  } else {
    windStatus = 'tolerable';
    windReason = `${current.windDirection} yönünden ${current.windSpeed} km/sa rüzgâr esintisi mevcuttur.`;
  }

  // Mevsim Durumu
  let seasonStatus: 'peak' | 'present' | 'offseason' = 'present';
  let seasonReason = `Mevsim: ${profile.blackSeaSeasonality}.`;

  // Genel Puanlama ve Gerekçeli Değerlendirme
  let rating: ConditionEvaluationResult['rating'] = 'Orta / Dikkat';
  let badgeTone: ConditionEvaluationResult['badgeTone'] = 'amber';

  if (isSeasonalBanActive) {
    rating = 'Koşullar Elverişsiz';
    badgeTone = 'red';
  } else if (tempStatus === 'ideal' && waveStatus === 'ideal' && windStatus !== 'unfavorable') {
    rating = 'Koşullar Elverişli';
    badgeTone = 'emerald';
  } else if (waveStatus === 'unfavorable' || windStatus === 'unfavorable' || tempStatus === 'unfavorable') {
    rating = 'Koşullar Elverişsiz';
    badgeTone = 'red';
  } else {
    rating = 'Orta / Dikkat';
    badgeTone = 'amber';
  }

  const scientificJustification = isSeasonalBanActive
    ? banMessage
    : `${tempReason} ${waveReason} ${windReason}`;

  return {
    rating,
    badgeTone,
    scientificJustification,
    factorAnalyses: {
      temperature: { status: tempStatus, text: tempReason },
      wave: { status: waveStatus, text: waveReason },
      wind: { status: windStatus, text: windReason },
      season: { status: seasonStatus, text: seasonReason }
    },
    regulatoryNotice: isSeasonalBanActive ? banMessage : `${profile.legalLengthRuleText} ${profile.bagLimitText}`,
    isSeasonalBanActive,
    scientificCitations: profile.scientificReferences
  };
}
