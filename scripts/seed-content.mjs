import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sahabeler';

const IMAGE_BASE_URL = 'https://commons.wikimedia.org/wiki/Special:FilePath';
const imageFromCommons = (fileName) => `${IMAGE_BASE_URL}/${encodeURIComponent(fileName)}`;

const events = [
  {
    slug: 'ilk-vahiy',
    name: 'İlk Vahiy',
    year: 610,
    description: 'Hira Mağarası’nda Alak suresinin ilk ayetlerinin nüzulü ile başlayan vahiy.',
    fullDescription:
      'İslam tarihinin başlangıcı kabul edilen bu olayda Cebrâil (a.s.) tarafından “Oku” emri tebliğ edilmiştir. Bu hadise, risalet sürecinin başlangıcıdır.',
    category: 'vahiy',
    importance: 'high',
    image: imageFromCommons('Jabal al-Nour.jpg'),
    participantSlugs: [],
  },
  {
    slug: 'hicret',
    name: 'Hicret',
    year: 622,
    description: 'Mekke’den Medine’ye hicret ile İslam toplumunun devletleşme dönemi başladı.',
    fullDescription:
      'Hicret, yalnızca coğrafi bir göç değil; yeni bir toplumsal, siyasi ve dini düzenin kuruluş sürecidir. Hicri takvim bu olaydan başlatılmıştır.',
    category: 'genel',
    importance: 'high',
    image: imageFromCommons('Al-Masjid an-Nabawi in Madinah.jpg'),
    participantSlugs: ['hz-ebubekir', 'hz-ali'],
  },
  {
    slug: 'bedir-savasi',
    name: 'Bedir Savaşı',
    year: 624,
    description: '17 Ramazan 2 Hicri (13 Mart 624) tarihinde kazanılan ilk büyük askerî zafer.',
    fullDescription:
      'Bedir Muharebesi, sayıca az Müslüman ordusunun Kureyş karşısında kesin üstünlük sağladığı ilk büyük savaştır. İslam toplumunun moral ve siyasi gücünü yükseltmiştir.',
    category: 'savas',
    importance: 'high',
    image: imageFromCommons('Muhammad at Badr.jpg'),
    participantSlugs: ['hz-ebubekir', 'hz-omer', 'hz-osman', 'hz-ali', 'hz-hamza'],
  },
  {
    slug: 'uhud-savasi',
    name: 'Uhud Savaşı',
    year: 625,
    description: '3 Hicri yılında gerçekleşen ve Müslümanlar için önemli dersler barındıran savaş.',
    fullDescription:
      'Uhud Muharebesi, başlangıçtaki üstünlüğün okçular tepesindeki düzen bozulmasıyla değiştiği bir mücadeledir. Sabır, disiplin ve emre itaat konularında belirleyici bir tecrübe olmuştur.',
    category: 'savas',
    importance: 'high',
    image: imageFromCommons('Mount Uhud.jpg'),
    participantSlugs: ['hz-ebubekir', 'hz-omer', 'hz-osman', 'hz-ali', 'hz-hamza', 'hz-ayse'],
  },
  {
    slug: 'hendek-savasi',
    name: 'Hendek Savaşı',
    year: 627,
    description: 'Medine çevresine hendek kazılarak yapılan savunma ile kuşatma püskürtüldü.',
    fullDescription:
      'Ahzab Gazvesi olarak da bilinen bu savaşta Selman-ı Farisî’nin önerisiyle hendek stratejisi uygulanmış ve sayıca üstün birleşik kuvvetlerin saldırısı sonuçsuz kalmıştır.',
    category: 'savas',
    importance: 'high',
    image: imageFromCommons('Battle of trench site.JPG'),
    participantSlugs: ['hz-omer', 'hz-ali', 'hz-selman-farisi'],
  },
  {
    slug: 'hudeybiye-antlasmasi',
    name: 'Hudeybiye Antlaşması',
    year: 628,
    description: '6 Hicri yılında imzalanan ve 10 yıllık barış öngören antlaşma.',
    fullDescription:
      'Hudeybiye Antlaşması ile Mekkeliler Medine İslam toplumunu fiilen tanımış, barış ortamı tebliğ faaliyetlerini güçlendirmiş ve sonrasında Mekke’nin fethine giden yol açılmıştır.',
    category: 'antlasma',
    importance: 'high',
    image: imageFromCommons('Hudaybiyyah.JPG'),
    participantSlugs: ['hz-osman', 'hz-ali'],
  },
  {
    slug: 'mekke-fethi',
    name: 'Mekke’nin Fethi',
    year: 630,
    description: '8 Hicri yılında Mekke’nin büyük ölçüde çatışmasız olarak fethedilmesi.',
    fullDescription:
      'Hudeybiye şartlarının ihlali sonrası gerçekleşen fetihte genel af ilan edilmiş, Kâbe’deki putlar kaldırılmış ve Arap yarımadasında İslam’ın yayılışı hız kazanmıştır.',
    category: 'fetih',
    importance: 'high',
    image: imageFromCommons('Great Mosque of Mecca, Makkah, Saudi Arabia.jpg'),
    participantSlugs: ['hz-ebubekir', 'hz-omer', 'hz-osman', 'hz-ali', 'hz-bilal', 'hz-halid-bin-velid'],
  },
  {
    slug: 'veda-hutbesi',
    name: 'Veda Hutbesi',
    year: 632,
    description: 'Arafat’ta insan hakları, emanet, adalet ve kardeşlik vurgusuyla irad edilen hutbe.',
    fullDescription:
      'Veda Haccı sırasında irad edilen hutbe; can, mal ve namus dokunulmazlığı ile faiz ve kan davası gibi konularda temel ilkeleri ortaya koymuştur.',
    category: 'genel',
    importance: 'high',
    image: imageFromCommons('Mount Arafat during Hajj.jpg'),
    participantSlugs: ['hz-ebubekir', 'hz-omer', 'hz-osman', 'hz-ali'],
  },
];

const sahabeler = [
  {
    slug: 'hz-ebubekir',
    name: 'Hz. Ebû Bekir es-Sıddîk',
    arabicName: 'أبو بكر الصديق',
    title: '1. Raşid Halife',
    nickname: 'es-Sıddîk',
    birthYear: 573,
    deathYear: 634,
    birthPlace: 'Mekke',
    deathPlace: 'Medine',
    grave: 'Mescid-i Nebevî, Medine',
    generation: 'sahabe',
    isFourCaliph: true,
    caliphOrder: 1,
    image: imageFromCommons('20131203 Istanbul 091.jpg'),
    biography:
      'Hz. Ebû Bekir, İslam’ın ilk döneminde Peygamber Efendimizin en yakın dostu ve hicret yol arkadaşıdır.\n\n632-634 yılları arasında halifelik yapmış, ridde hareketlerine karşı siyasi birliği korumuş ve Kur’an’ın mushaf haline getirilmesi sürecini başlatmıştır.',
    shortBio: 'İlk halife; hicret yol arkadaşı ve İslam toplumunun birliğini sağlayan lider.',
    eventSlugs: ['hicret', 'bedir-savasi', 'uhud-savasi', 'mekke-fethi', 'veda-hutbesi'],
    lifeEvents: [
      { year: 573, title: 'Doğumu', description: 'Mekke’de Benî Teym kolunda doğdu.' },
      { year: 622, title: 'Hicret', description: 'Peygamber Efendimizle birlikte Medine’ye hicret etti.' },
      { year: 632, title: 'Halifelik', description: 'Müslümanların ilk halifesi oldu.' },
      { year: 634, title: 'Vefatı', description: 'Medine’de vefat etti.' },
    ],
    relationSlugs: [{ slug: 'hz-omer', relationType: 'yakın-danisman' }, { slug: 'hz-osman', relationType: 'ashab' }, { slug: 'hz-ali', relationType: 'ashab' }],
  },
  {
    slug: 'hz-omer',
    name: 'Hz. Ömer bin Hattâb',
    arabicName: 'عمر بن الخطاب',
    title: '2. Raşid Halife',
    nickname: 'el-Fârûk',
    birthYear: 583,
    deathYear: 644,
    birthPlace: 'Mekke',
    deathPlace: 'Medine',
    grave: 'Mescid-i Nebevî, Medine',
    generation: 'sahabe',
    isFourCaliph: true,
    caliphOrder: 2,
    image: imageFromCommons('20131203 Istanbul 118.jpg'),
    biography:
      'Hz. Ömer, adaleti, idari disiplini ve güçlü devlet teşkilatıyla tanınır.\n\n634-644 yılları arasında halifelik döneminde İslam devleti genişlemiş; Şam, Irak, Mısır ve İran coğrafyalarında büyük dönüşümler yaşanmıştır.',
    shortBio: 'Adalet ve yönetim sistemiyle öne çıkan ikinci halife.',
    eventSlugs: ['bedir-savasi', 'uhud-savasi', 'hendek-savasi', 'mekke-fethi', 'veda-hutbesi'],
    lifeEvents: [
      { year: 616, title: 'Müslüman Oluşu', description: 'Mekke döneminde İslam’ı kabul etti.' },
      { year: 634, title: 'Halifelik', description: 'Hz. Ebû Bekir’den sonra halife oldu.' },
      { year: 638, title: 'Kudüs Dönemi', description: 'Döneminde Kudüs İslam idaresine geçti.' },
      { year: 644, title: 'Vefatı', description: 'Medine’de suikast sonucu vefat etti.' },
    ],
    relationSlugs: [{ slug: 'hz-ebubekir', relationType: 'halef-selef' }, { slug: 'hz-osman', relationType: 'sura-uyesi' }, { slug: 'hz-ali', relationType: 'sura-uyesi' }],
  },
  {
    slug: 'hz-osman',
    name: 'Hz. Osman bin Affân',
    arabicName: 'عثمان بن عفان',
    title: '3. Raşid Halife',
    nickname: 'Zinnûreyn',
    birthYear: 579,
    deathYear: 656,
    birthPlace: 'Mekke',
    deathPlace: 'Medine',
    grave: 'Cennetü’l-Bakî, Medine',
    generation: 'sahabe',
    isFourCaliph: true,
    caliphOrder: 3,
    image: imageFromCommons('20131203 Istanbul 015.jpg'),
    biography:
      'Hz. Osman, hayâsı, infakı ve Kur’an nüshalarının çoğaltılıp standardize edilmesiyle anılan üçüncü halifedir.\n\n644-656 yılları arasında halifelik yapmış, İslam devletinin idari ve coğrafi genişlemesinde önemli rol oynamıştır.',
    shortBio: 'Kur’an mushafının çoğaltılması sürecini yöneten üçüncü halife.',
    eventSlugs: ['hicret', 'uhud-savasi', 'hudeybiye-antlasmasi', 'mekke-fethi', 'veda-hutbesi'],
    lifeEvents: [
      { year: 611, title: 'Müslüman Oluşu', description: 'Erken dönemde İslam’ı kabul etti.' },
      { year: 622, title: 'Hicret', description: 'Medine’ye hicret eden ilk gruplar arasında yer aldı.' },
      { year: 644, title: 'Halifelik', description: 'Şûra sonrası halife seçildi.' },
      { year: 656, title: 'Vefatı', description: 'Medine’de kuşatma sürecinde şehit edildi.' },
    ],
    relationSlugs: [{ slug: 'hz-ebubekir', relationType: 'ashab' }, { slug: 'hz-omer', relationType: 'halef-selef' }, { slug: 'hz-ali', relationType: 'halef-selef' }],
  },
  {
    slug: 'hz-ali',
    name: 'Hz. Ali bin Ebî Tâlib',
    arabicName: 'علي بن أبي طالب',
    title: '4. Raşid Halife',
    nickname: 'Ebu Turab',
    birthYear: 599,
    deathYear: 661,
    birthPlace: 'Mekke',
    deathPlace: 'Kûfe',
    grave: 'Necef',
    generation: 'sahabe',
    isFourCaliph: true,
    caliphOrder: 4,
    image: imageFromCommons('Ali%27ye_atfedilmiş_naat_duası_kaligramı.jpg'),
    biography:
      'Hz. Ali, Peygamber Efendimizin amcasının oğlu ve damadıdır; ilmi, cesareti ve adaletiyle tanınır.\n\n656-661 yılları arasında halifelik yapmış, iç karışıklık döneminde ümmetin birliğini korumak için mücadele etmiştir.',
    shortBio: 'İlim, cesaret ve adaletle anılan dördüncü halife.',
    eventSlugs: ['hicret', 'bedir-savasi', 'uhud-savasi', 'hendek-savasi', 'hudeybiye-antlasmasi', 'mekke-fethi', 'veda-hutbesi'],
    lifeEvents: [
      { year: 599, title: 'Doğumu', description: 'Mekke’de doğdu.' },
      { year: 622, title: 'Hicret Gecesi', description: 'Peygamberimizin emanetlerini sahiplerine iade etti.' },
      { year: 656, title: 'Halifelik', description: 'Hz. Osman’dan sonra halife seçildi.' },
      { year: 661, title: 'Vefatı', description: 'Kûfe’de saldırı sonrası vefat etti.' },
    ],
    relationSlugs: [{ slug: 'hz-ebubekir', relationType: 'ashab' }, { slug: 'hz-omer', relationType: 'ashab' }, { slug: 'hz-osman', relationType: 'ashab' }],
  },
  {
    slug: 'hz-ayse',
    name: 'Hz. Âişe bint Ebû Bekir',
    arabicName: 'عائشة بنت أبي بكر',
    title: 'Müminlerin Annesi',
    birthYear: 614,
    deathYear: 678,
    birthPlace: 'Mekke',
    deathPlace: 'Medine',
    grave: 'Cennetü’l-Bakî, Medine',
    generation: 'sahabe',
    image: imageFromCommons('Aisha-bint-Abi-Bakr.jpg'),
    biography:
      'Hz. Âişe, hadis rivayeti ve fıkıh bilgisinde önde gelen sahabilerdendir.\n\nÖzellikle Medine döneminde ilmî rehberliğiyle sonraki nesillere önemli bir rivayet birikimi aktarmıştır.',
    shortBio: 'Hadis rivayetinde önde gelen sahabi; ilmî otorite.',
    eventSlugs: ['uhud-savasi', 'mekke-fethi', 'veda-hutbesi'],
    lifeEvents: [
      { year: 614, title: 'Doğumu', description: 'Mekke’de doğdu.' },
      { year: 622, title: 'Hicret', description: 'Ailesiyle Medine dönemine geçti.' },
      { year: 678, title: 'Vefatı', description: 'Medine’de vefat etti.' },
    ],
    relationSlugs: [{ slug: 'hz-ebubekir', relationType: 'kizi' }],
  },
  {
    slug: 'hz-hamza',
    name: 'Hz. Hamza bin Abdülmuttalib',
    arabicName: 'حمزة بن عبد المطلب',
    title: 'Seyyidü’ş-Şühedâ',
    birthYear: 568,
    deathYear: 625,
    birthPlace: 'Mekke',
    deathPlace: 'Uhud, Medine',
    grave: 'Uhud Şehitliği',
    generation: 'sahabe',
    image: imageFromCommons('Sayyiduna Hamzah name.svg'),
    biography:
      'Hz. Hamza, İslam’ın erken döneminde güçlü desteğiyle öne çıkan büyük sahabilerdendir.\n\nBedir’de önemli rol oynamış, Uhud’da şehit olmuştur.',
    shortBio: 'Bedir kahramanlarından; Uhud şehidi.',
    eventSlugs: ['bedir-savasi', 'uhud-savasi'],
    lifeEvents: [
      { year: 568, title: 'Doğumu', description: 'Mekke’de doğdu.' },
      { year: 624, title: 'Bedir', description: 'Bedir’de ön saflarda yer aldı.' },
      { year: 625, title: 'Şehadet', description: 'Uhud Savaşı’nda şehit oldu.' },
    ],
    relationSlugs: [{ slug: 'hz-ali', relationType: 'aile-buyugu' }],
  },
  {
    slug: 'hz-bilal',
    name: 'Hz. Bilâl-i Habeşî',
    arabicName: 'بلال بن رباح',
    title: 'İlk Müezzin',
    birthYear: 580,
    deathYear: 640,
    birthPlace: 'Mekke',
    deathPlace: 'Şam',
    generation: 'sahabe',
    image: imageFromCommons('Bilal.jpg'),
    biography:
      'Hz. Bilâl, İslam tarihinin ilk müezzini olarak bilinir.\n\nMekke dönemindeki ağır işkencelere rağmen imanını korumuş, Medine döneminde ezanla özdeşleşmiştir.',
    shortBio: 'İslam’ın ilk müezzini; sabrın ve sadakatin sembolü.',
    eventSlugs: ['hicret', 'mekke-fethi', 'veda-hutbesi'],
    lifeEvents: [
      { year: 580, title: 'Doğumu', description: 'Mekke’de doğdu.' },
      { year: 622, title: 'Hicret', description: 'Medine dönemine geçti.' },
      { year: 630, title: 'Mekke’nin Fethi', description: 'Kâbe’de ezan okudu.' },
    ],
    relationSlugs: [{ slug: 'hz-ebubekir', relationType: 'azad-eden' }],
  },
  {
    slug: 'hz-halid-bin-velid',
    name: 'Hz. Hâlid bin Velîd',
    arabicName: 'خالد بن الوليد',
    title: 'Seyfullah',
    birthYear: 592,
    deathYear: 642,
    birthPlace: 'Mekke',
    deathPlace: 'Humus',
    generation: 'sahabe',
    image: imageFromCommons('Khalid ibn al-Walid.svg'),
    biography:
      'Hz. Hâlid bin Velîd, İslam tarihinin en başarılı komutanları arasında kabul edilir.\n\nMekke’nin fethi sonrasında aktif rol üstlenmiş, birçok cephede stratejik başarılar kazanmıştır.',
    shortBio: 'Seyfullah lakabıyla bilinen büyük komutan.',
    eventSlugs: ['mekke-fethi'],
    lifeEvents: [
      { year: 592, title: 'Doğumu', description: 'Mekke’de doğdu.' },
      { year: 629, title: 'Müslüman Oluşu', description: 'Medine’de İslam’ı kabul etti.' },
      { year: 642, title: 'Vefatı', description: 'Humus’ta vefat etti.' },
    ],
    relationSlugs: [{ slug: 'hz-omer', relationType: 'komutan-halife' }],
  },
  {
    slug: 'hz-selman-farisi',
    name: 'Hz. Selman-ı Farisî',
    arabicName: 'سلمان الفارسي',
    title: 'Hendek Stratejisi Önereni',
    birthYear: 568,
    deathYear: 653,
    birthPlace: 'İsfahan civarı',
    deathPlace: 'Medain',
    generation: 'sahabe',
    image: imageFromCommons('Salman al-Farsi.jpg'),
    biography:
      'Hz. Selman-ı Farisî, hakikati arayışıyla tanınan ve Medine döneminde önemli katkılar sunan sahabedir.\n\nHendek Savaşı’nda hendek kazılması fikrini önererek savunmanın başarısında kritik rol oynamıştır.',
    shortBio: 'Hendek fikrini öneren sahabi; ilim ve hikmet ehli.',
    eventSlugs: ['hendek-savasi'],
    lifeEvents: [
      { year: 568, title: 'Doğumu', description: 'İran coğrafyasında doğdu.' },
      { year: 627, title: 'Hendek', description: 'Savunma stratejisi önerisiyle öne çıktı.' },
      { year: 653, title: 'Vefatı', description: 'Medain’de vefat etti.' },
    ],
    relationSlugs: [{ slug: 'hz-ali', relationType: 'ashab' }],
  },
  {
    slug: 'hasan-el-basri',
    name: 'Hasan el-Basrî',
    arabicName: 'الحسن البصري',
    title: 'Tabiin Âlimi',
    birthYear: 642,
    deathYear: 728,
    birthPlace: 'Medine',
    deathPlace: 'Basra',
    generation: 'tabiin',
    image: imageFromCommons('Hasan al-Basri.jpg'),
    biography:
      'Hasan el-Basrî, zühd ve takva anlayışıyla İslam düşünce tarihinde önemli bir tabiin âlimidir.\n\nBasra’daki ilmî faaliyetleriyle hadis, vaaz ve ahlak literatüründe etkili olmuştur.',
    shortBio: 'Basra ekolünün önde gelen tabiin âlimlerinden.',
    eventSlugs: [],
    lifeEvents: [
      { year: 642, title: 'Doğumu', description: 'Medine’de doğdu.' },
      { year: 700, title: 'İlmî Faaliyet', description: 'Basra’da ders halkaları kurdu.' },
      { year: 728, title: 'Vefatı', description: 'Basra’da vefat etti.' },
    ],
    relationSlugs: [],
  },
  {
    slug: 'said-bin-museyyeb',
    name: 'Saîd bin Müseyyeb',
    arabicName: 'سعيد بن المسيب',
    title: 'Fukahâ-yi Seba’dan',
    birthYear: 636,
    deathYear: 715,
    birthPlace: 'Medine',
    deathPlace: 'Medine',
    generation: 'tabiin',
    image: imageFromCommons('Al-Masjid an-Nabawi in Madinah.jpg'),
    biography:
      'Saîd bin Müseyyeb, Medine fıkıh ekolünün en güçlü isimlerinden biridir.\n\nFukahâ-yi Seba arasında sayılır ve hadis/fıkıh birikimiyle tabiin döneminin temel otoriteleri arasında yer alır.',
    shortBio: 'Medine fıkıh ekolünün önde gelen tabiin âlimi.',
    eventSlugs: [],
    lifeEvents: [
      { year: 636, title: 'Doğumu', description: 'Medine’de doğdu.' },
      { year: 680, title: 'İlim Halkası', description: 'Medine’de geniş bir ilmî çevre oluşturdu.' },
      { year: 715, title: 'Vefatı', description: 'Medine’de vefat etti.' },
    ],
    relationSlugs: [],
  },
  {
    slug: 'imam-malik',
    name: 'İmam Mâlik bin Enes',
    arabicName: 'مالك بن أنس',
    title: 'Mâlikî Mezhebi İmamı',
    birthYear: 711,
    deathYear: 795,
    birthPlace: 'Medine',
    deathPlace: 'Medine',
    generation: 'tebe-i-tabiin',
    image: imageFromCommons('Madinah_Prophet%27s_Mosque_2015.jpg'),
    biography:
      'İmam Mâlik, Muvatta eseri ve Medine amelini merkeze alan metodolojisiyle öne çıkan büyük bir tebe-i tabiin âlimidir.\n\nMâlikî mezhebinin kurucu imamı olarak İslam hukuk tarihinde kalıcı bir etki bırakmıştır.',
    shortBio: 'Muvatta müellifi; Mâlikî mezhebinin kurucu imamı.',
    eventSlugs: [],
    lifeEvents: [
      { year: 711, title: 'Doğumu', description: 'Medine’de doğdu.' },
      { year: 760, title: 'Muvatta', description: 'Hadis ve fıkıh derlemesi Muvatta’yı tedvin etti.' },
      { year: 795, title: 'Vefatı', description: 'Medine’de vefat etti.' },
    ],
    relationSlugs: [],
  },
  {
    slug: 'sufyan-es-sevri',
    name: 'Süfyân es-Sevrî',
    arabicName: 'سفيان الثوري',
    title: 'Muhaddis ve Fakih',
    birthYear: 716,
    deathYear: 778,
    birthPlace: 'Kûfe',
    deathPlace: 'Basra',
    generation: 'tebe-i-tabiin',
    image: imageFromCommons('Kufa Great Mosque.jpg'),
    biography:
      'Süfyân es-Sevrî, hadis ve fıkıh ilminde derinliğiyle tanınan, zühd anlayışıyla öne çıkan büyük bir tebe-i tabiin âlimidir.\n\nÖzellikle Kûfe ilim çevresinde güçlü bir etki bırakmıştır.',
    shortBio: 'Kûfe merkezli hadis ve fıkıh otoritesi.',
    eventSlugs: [],
    lifeEvents: [
      { year: 716, title: 'Doğumu', description: 'Kûfe’de doğdu.' },
      { year: 750, title: 'İlmî Etki', description: 'Hadis ve fıkıh halkalarıyla geniş etki alanı oluşturdu.' },
      { year: 778, title: 'Vefatı', description: 'Basra’da vefat etti.' },
    ],
    relationSlugs: [],
  },
];

const generations = [
  {
    slug: 'sahabeler',
    title: 'SAHABELER',
    subtitle: 'Peygamberin Dostları',
    description: 'Hz. Muhammed (sav) ile görüşen ve İslam üzere vefat eden mübarek insanlar.',
    order: 1,
    sahabelerCount: 0,
    image: imageFromCommons('Al-Masjid an-Nabawi in Madinah.jpg'),
  },
  {
    slug: 'tabiin',
    title: 'TABİİN',
    subtitle: 'Sahabeden İlmi Devralanlar',
    description: 'Sahabeleri görüp onlardan hadis ve fıkıh öğrenen nesil.',
    order: 2,
    sahabelerCount: 0,
    image: imageFromCommons('Madinah_Prophet%27s_Mosque_2015.jpg'),
  },
  {
    slug: 'tebe-i-tabiin',
    title: 'TEBE-İ TABİİN',
    subtitle: 'Tabiini Takip Eden Âlimler',
    description: 'Tabiin neslini görüp ilim halkalarını sürdüren kuşak.',
    order: 3,
    sahabelerCount: 0,
    image: imageFromCommons('Kufa Great Mosque.jpg'),
  },
];

const defaultAbout = {
  heroTitle: 'Sahabeleri Tanıtmak, Sevdirmek',
  heroDescription:
    "sahabeler.net, Hz. Peygamber'in (sav) ashabını ve ilk üç nesli güvenilir kaynaklardan derleyerek günümüz okuyucusuna ulaştırmayı amaçlayan dijital bir içerik projesidir.",
  missionTitle: 'Misyonumuz',
  missionParagraph1:
    "Sahabeler.net, sahabe, tabiin ve tebe-i tabiin dönemlerine ait biyografi, olay ve rivayet içeriklerini tek bir platformda düzenli ve erişilebilir biçimde sunar.",
  missionParagraph2:
    'İçeriklerin temelinde klasik siyer, tabakat ve hadis literatürü ile modern akademik çalışmalar yer alır; amaç, tarihî bağlamı bozmadan anlaşılır bir sunum sağlamaktır.',
  stats: { sahabeCount: '124.000+', hadithCount: '100.000+', monthlyVisitors: '—' },
  values: [
    { title: 'Güvenilir Kaynaklar', description: 'Tüm içeriklerimiz muteber hadis kaynaklarından ve tarih kitaplarından derlenmektedir.' },
    { title: 'Sevgi ve Saygı', description: 'Sahabelere olan sevgi ve saygımızı, onların hayatlarını doğru aktararak gösteriyoruz.' },
    { title: 'Topluluk', description: 'İslam tarihini seven, öğrenmek isteyen herkes için açık bir platform oluşturuyoruz.' },
    { title: 'Doğruluk', description: 'Her bilgiyi titizlikle araştırıyor, kaynaklarıyla birlikte sunuyoruz.' },
  ],
  team: [
    { name: 'İmam Buhârî', role: 'Klasik Kaynak', specialty: 'Hadis (el-Câmiu’s-Sahîh)' },
    { name: 'İbn Hişâm', role: 'Klasik Kaynak', specialty: 'Siyer' },
    { name: 'Taberî', role: 'Klasik Kaynak', specialty: 'Tarih ve Tefsir' },
  ],
  contact: { email: 'iletisim@sahabeler.net', phone: '', address: 'Türkiye' },
};

async function ensureEditorUser(db) {
  let user = await db.collection('users').findOne({ role: { $in: ['admin', 'moderator', 'editor'] } });

  if (!user) {
    const now = new Date();
    const password = await bcrypt.hash('Admin123!', 10);

    const inserted = await db.collection('users').insertOne({
      name: 'Sistem Admin',
      email: 'admin@sahabeler.net',
      password,
      role: 'admin',
      avatar: '',
      bio: '',
      socialMedia: { twitter: '', instagram: '', facebook: '', linkedin: '' },
      favoritesSahabeler: [],
      createdAt: now,
      updatedAt: now,
    });

    user = { _id: inserted.insertedId };
    console.log('✅ Admin kullanıcı oluşturuldu: admin@sahabeler.net / Admin123!');
  }

  return user._id;
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    const db = mongoose.connection.db;
    const now = new Date();

    const createdBy = await ensureEditorUser(db);

    const sahabeCollection = db.collection('sahabes');
    const eventCollection = db.collection('historicalevents');

    for (const event of events) {
      await eventCollection.updateOne(
        { slug: event.slug },
        {
          $set: {
            slug: event.slug,
            name: event.name,
            year: event.year,
            description: event.description,
            fullDescription: event.fullDescription,
            image: event.image,
            importance: event.importance,
            category: event.category,
            status: 'approved',
            createdBy,
            seo: {
              metaTitle: `${event.name} | Sahabeler.net`,
              metaDescription: event.description,
              keywords: [event.name, 'islam tarihi', 'siyer'],
              ogImage: event.image,
            },
            updatedAt: now,
          },
          $setOnInsert: {
            participants: [],
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }

    for (const sahabe of sahabeler) {
      const embeddedEvents = sahabe.eventSlugs
        .map((slug) => events.find((event) => event.slug === slug))
        .filter(Boolean)
        .map((event) => ({
          id: event.slug,
          name: event.name,
          year: event.year,
          description: event.description,
          image: event.image,
        }));

      await sahabeCollection.updateOne(
        { slug: sahabe.slug },
        {
          $set: {
            name: sahabe.name,
            arabicName: sahabe.arabicName,
            slug: sahabe.slug,
            title: sahabe.title,
            nickname: sahabe.nickname,
            birthYear: sahabe.birthYear,
            birthPlace: sahabe.birthPlace,
            deathYear: sahabe.deathYear,
            deathPlace: sahabe.deathPlace,
            grave: sahabe.grave,
            generation: sahabe.generation,
            biography: sahabe.biography,
            shortBio: sahabe.shortBio,
            image: sahabe.image,
            headerImage: sahabe.image,
            lifeEvents: sahabe.lifeEvents,
            events: embeddedEvents,
            hadiths: [],
            isFourCaliph: Boolean(sahabe.isFourCaliph),
            caliphOrder: sahabe.caliphOrder,
            views: 0,
            status: 'approved',
            createdBy,
            seo: {
              metaTitle: `${sahabe.name} | Sahabeler.net`,
              metaDescription: sahabe.shortBio,
              keywords: [sahabe.name, sahabe.title || 'sahabe', 'islam tarihi'],
              ogImage: sahabe.image,
            },
            updatedAt: now,
          },
          $setOnInsert: {
            relations: [],
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }

    const sahabeDocs = await sahabeCollection.find({}, { projection: { _id: 1, slug: 1, name: 1, image: 1 } }).toArray();
    const sahabeMap = new Map(sahabeDocs.map((doc) => [doc.slug, doc]));

    for (const sahabe of sahabeler) {
      const relationDocs = (sahabe.relationSlugs || [])
        .map((relation) => {
          const related = sahabeMap.get(relation.slug);
          if (!related) return null;
          return {
            sahabeId: related._id,
            name: related.name,
            relationType: relation.relationType,
            image: related.image || '',
          };
        })
        .filter(Boolean);

      await sahabeCollection.updateOne(
        { slug: sahabe.slug },
        {
          $set: {
            relations: relationDocs,
            updatedAt: now,
          },
        }
      );
    }

    for (const event of events) {
      const participants = (event.participantSlugs || [])
        .map((slug) => sahabeMap.get(slug)?._id)
        .filter(Boolean);

      await eventCollection.updateOne(
        { slug: event.slug },
        {
          $set: {
            participants,
            updatedAt: now,
          },
        }
      );
    }

    const generationCounts = {
      sahabe: sahabeler.filter((item) => item.generation === 'sahabe').length,
      tabiin: sahabeler.filter((item) => item.generation === 'tabiin').length,
      'tebe-i-tabiin': sahabeler.filter((item) => item.generation === 'tebe-i-tabiin').length,
    };

    for (const generation of generations) {
      await db.collection('generations').updateOne(
        { slug: generation.slug },
        {
          $set: {
            ...generation,
            sahabelerCount:
              generation.slug === 'sahabeler'
                ? generationCounts.sahabe
                : generation.slug === 'tabiin'
                  ? generationCounts.tabiin
                  : generationCounts['tebe-i-tabiin'],
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );
    }

    await db.collection('sitesettings').updateOne(
      { key: 'main' },
      {
        $set: {
          key: 'main',
          about: defaultAbout,
          updatedAt: now,
          updatedBy: createdBy,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    console.log('✅ Gerçekçi örnek içerikler başarıyla insert edildi (idempotent).');
  } catch (error) {
    console.error('❌ Seed hatası:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
