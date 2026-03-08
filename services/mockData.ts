import type { Sahabe, SahabeCard, Event, Generation, SearchSuggestion, Hadith, BiographySection } from '@/types';

// 4 Halife (Four Caliphs)
export const fourCaliphs: SahabeCard[] = [
  {
    id: '1',
    slug: 'hz-ebubekir',
    name: 'Hz. Ebubekir',
    title: 'Sıddık',
    description: "İslam'ın ilk halifesi, Peygamberimizin en yakın dostu.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '2',
    slug: 'hz-omer',
    name: 'Hz. Ömer',
    title: 'Faruk',
    description: "Adaletin simgesi, İslam'ın ikinci halifesi.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '3',
    slug: 'hz-osman',
    name: 'Hz. Osman',
    title: 'Zinnureyn',
    description: "Kur'an'ı toplatan, İslam'ın üçüncü halifesi.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '4',
    slug: 'hz-ali',
    name: 'Hz. Ali',
    title: 'Esedullah',
    description: "Allah'ın Aslanı, İslam'ın dördüncü halifesi.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_33-Ngg0T0Wh2LPuyRvWJYt9sEaIrIKmdO.png',
  },
];

// Chronological Events
export const chronologicalEvents: Event[] = [
  {
    id: '1',
    slug: 'ilk-vahiy',
    title: 'İLK VAHİY',
    year: 610,
    description: '"Oku" emri ile gelen ilk vahiy.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
    fullDescription: 'Hira Mağarası\'nda Cebrail (as) tarafından Peygamber Efendimize indirilen ilk vahiy.',
  },
  {
    id: '2',
    slug: 'hicret',
    title: 'HİCRET',
    year: 622,
    description: "Mekke'den Medine'ye hicret.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '3',
    slug: 'bedir-savasi',
    title: 'BEDİR SAVAŞI',
    year: 624,
    description: "İslam'ın ilk büyük zaferi.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '4',
    slug: 'uhud-savasi',
    title: 'UHUD SAVAŞI',
    year: 625,
    description: "Uhud'de yaşanan büyük çarpışma.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '5',
    slug: 'hendek-savasi',
    title: 'HENDEK SAVAŞI',
    year: 627,
    description: 'Hendek kazılarak yapılan savunma.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '6',
    slug: 'hudeybiye-antlasmasi',
    title: 'HUDEYBİYE',
    year: 628,
    description: 'Hudeybiye Barış Antlaşması.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '7',
    slug: 'mekke-fethi',
    title: 'MEKKE FETHİ',
    year: 630,
    description: "Mekke'nin fethedilmesi.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '8',
    slug: 'veda-hutbesi',
    title: 'VEDA HUTBESİ',
    year: 632,
    description: "Peygamberimizin son hutbesi.",
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
];

// Generations
export const generations: Generation[] = [
  {
    id: '1',
    slug: 'sahabeler',
    title: 'SAHABELER',
    subtitle: 'Peygamberin Dostları',
    description: 'Hz. Muhammed (sav) ile görüşen ve İslam üzere vefat eden mübarek insanlar.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
    sahabelerCount: 124000,
  },
  {
    id: '2',
    slug: 'tabiin',
    title: 'TABİİN',
    subtitle: 'Hadis Alimleri',
    description: 'Sahabeleri gören ve onlardan ilim alan nesil.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
  {
    id: '3',
    slug: 'tebe-i-tabiin',
    title: 'TEBE-İ TABİİN',
    subtitle: 'İyiliğin İzleyicileri',
    description: 'Tabiini gören ve onlardan ilim alan nesil.',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  },
];

// Search suggestions mock
export const searchSuggestions: SearchSuggestion[] = [
  { id: '1', slug: 'hz-ebubekir', name: 'Hz. Ebubekir', type: 'sahabe' },
  { id: '2', slug: 'hz-omer', name: 'Hz. Ömer', type: 'sahabe' },
  { id: '3', slug: 'hz-osman', name: 'Hz. Osman', type: 'sahabe' },
  { id: '4', slug: 'hz-ali', name: 'Hz. Ali', type: 'sahabe' },
  { id: '5', slug: 'hz-fatima', name: 'Hz. Fatıma', type: 'sahabe' },
  { id: '6', slug: 'hz-hatice', name: 'Hz. Hatice', type: 'sahabe' },
  { id: '7', slug: 'hz-aişe', name: 'Hz. Aişe', type: 'sahabe' },
  { id: '8', slug: 'hz-bilal', name: 'Hz. Bilal', type: 'sahabe' },
  { id: '9', slug: 'hz-hamza', name: 'Hz. Hamza', type: 'sahabe' },
  { id: '10', slug: 'bedir-savasi', name: 'Bedir Savaşı', type: 'event' },
  { id: '11', slug: 'uhud-savasi', name: 'Uhud Savaşı', type: 'event' },
  { id: '12', slug: 'sahabeler', name: 'Sahabeler', type: 'generation' },
];

// Biography sections for detail page
export const biographySections: BiographySection[] = [
  {
    id: '1',
    title: 'Doğumu ve Çocukluğu',
    content: 'Hz. Ali, Mekke\'de 600 yılında dünyaya geldi. Babası Ebu Talib, Peygamber Efendimizin amcasıydı. Çok küçük yaşlardan itibaren Peygamberimizin yanında büyüdü ve O\'nun terbiyesiyle yetişti.',
    order: 1,
  },
  {
    id: '2',
    title: 'İslam\'ı Kabul Edişi',
    content: 'Hz. Ali, çocuklar arasında İslam\'ı ilk kabul eden kişidir. Peygamber Efendimizin davetine icabet etmiş ve O\'nun en yakın yardımcılarından biri olmuştur.',
    order: 2,
  },
  {
    id: '3',
    title: 'Hicret Gecesi',
    content: 'Müşriklerin Peygamber Efendimizi öldürmeyi planladığı gece, Hz. Ali O\'nun yatağına yatarak canını tehlikeye attı. Bu fedakarlık İslam tarihinin en önemli olaylarından biridir.',
    order: 3,
  },
  {
    id: '4',
    title: 'Evliliği ve Ailesi',
    content: 'Hz. Ali, Peygamber Efendimizin kızı Hz. Fatıma ile evlendi. Bu evlilikten Hz. Hasan ve Hz. Hüseyin dünyaya geldi. Ehl-i Beyt\'in önemli bir parçası oldu.',
    order: 4,
  },
  {
    id: '5',
    title: 'Halifelik Dönemi',
    content: 'Hz. Ali, 656 yılında dördüncü halife olarak seçildi. Halifelik döneminde adalet ve eşitlik ilkelerine bağlı kaldı. 661 yılında Kufe\'de şehit edildi.',
    order: 5,
  },
];

// Mock hadiths for pagination
export const mockHadiths: Hadith[] = Array.from({ length: 150 }, (_, i) => ({
  id: `hadith-${i + 1}`,
  text: `"Bu ${i + 1}. hadis-i şeriftir. Peygamber Efendimiz (sav) buyurdu ki: İman etmedikçe cennete giremezsiniz, birbirinizi sevmedikçe de iman etmiş olmazsınız."`,
  source: `Sahih Buhari, Kitab ${Math.floor(i / 10) + 1}, Hadis ${(i % 10) + 1}`,
  narrator: 'Hz. Ali (r.a.)',
  grade: i % 3 === 0 ? 'Sahih' : i % 3 === 1 ? 'Hasen' : 'Sahih',
  topic: ['İman', 'Ahlak', 'İbadet', 'Muamelat'][i % 4],
}));

// Sahabe veri haritası
const sahabelerData: { [key: string]: Sahabe } = {};

const hzOmerBio = `Hz. Ömer, 586 yılında Mekke'de Nafi ibn Hastalah'ın (Haşim'in torunu) oğlu olarak dünyaya geldi. Çocukluğunda ve gençliğinde Câhiliye döneminin ve Peygamber Efendimize karşı gösterilen düşmanlığın ortasında yetişti. 

Başlangıçta Peygamber Efendimize sıkı muhalefet eden Hz. Ömer, 616 yılında İslam'ı kabulü esnasında, Peygamberimizin dua ve duası ile yüreğine nur düştü. İçindeki sevgi ve bağlılık o kadar güçlü oldu ki, hiçbir mümin onun kadar çaba gösteremedi.

Hz. Ömer, Medine'ye hicret ettikten sonra, Peygamber Efendimizin en güvenilir yardımcılarından biri oldu. Her savaşta ön cephede savaştı ve İslam'ın genişlemesi için canını hiç bir zaman esirgemedi. 

Peygamber Efendimiz, Hz. Ömer'in adaleti ve dürüstlüğünü çok takdir ederdi. "Eğer bir peygamber benden sonra gelseydi, o Hz. Ömer olurdu" diye hadis nakledilmiştir. 

Halifelik döneminde, Hz. Ömer'in adilane hükümleri İslam tarihinde altın harflerle yazılmıştır. Vergileri düzenlemesi, devlet dairesini organize etmesi, milletler arasında adalet ve eşitlik tesis etmesi, onun büyüklüğünün birer belgesidir.`;

const hzOmerSections: BiographySection[] = [
  {
    id: '1',
    title: 'Doğumu ve Cahiliye Dönemindeki Hayatı',
    content: 'Hz. Ömer, 586 yılında Mekke\'de Haşim ailesinin soyundan gelen soylu bir aileden doğdu. Cahiliye döneminde yaşlı bir müşrik olarak Peygamber Efendimize düşmanlık yapıyordu. İyi bir kurmayf olup, kahinlik ve şiirden bahsedilen işlerde mahir olmuştur.',
    order: 1,
  },
  {
    id: '2',
    title: 'İslam\'ı Kabulü',
    content: 'Hz. Ömer, Peygamber Efendimizin Ehyâu Dürrül-Hemîm sûresini okumasını duydu. Durduğu yerde kafasının içinde bir çatırtı hissetti ve kalbine nur indi. "Bismillâh"la başlayarak İslam\'ı kabul etti. Bu kalp dönüşü İslam tarihinin en önemli dönüm noktalarından birisidir.',
    order: 2,
  },
  {
    id: '3',
    title: 'Hicret ve Medine Dönemi',
    content: 'Hz. Ömer, 616 yılında Medine\'ye hicret etti. Medine\'ye gitmeden önce Peygamber Efendimiz onu davet için gitti. Hz. Ömer\'in Medine\'ye varması, Müslüman ordusunun gücünü önemli ölçüde arttırdı. Hicret yılında kurma müslümanlarından biri oldi.',
    order: 3,
  },
  {
    id: '4',
    title: 'Savaşlardaki Cesurluğu',
    content: 'Hz. Ömer, Bedir, Uhud, Hendek ve Hudeybiye gibi tüm önemli savaşlarda bulunmuştur. Özellikle Ukka bin Âmir\'le yaptığı mücadelede, Peygamberimizin dua etmesiyle galip gelmişti. Fedailiği ve cesareti hakkında birçok hadis nakledilmiştir.',
    order: 4,
  },
  {
    id: '5',
    title: 'Halifliğinin İlk Yılları',
    content: 'Hz. Ömer, Hz. Ebubekir\'in vefatından sonra (634 yılında) Müslümanların halifesi seçildi. Halifelik döneminde devlet teşkilatını düzenledi, saray, postane, asker tahsislerini organize etti. Mısır, Şam ve Irak fethedilebildi.',
    order: 5,
  },
  {
    id: '6',
    title: 'Adaletin Sembolü',
    content: 'Hz. Ömer, Müslümanlar arasında eşitlik ve adalet tesis etmesinde çok ısrarcı olmuştur. Hatta kendi oğlu Abdullah\'ı dahi, kendi halifelik döneminde yapılan hatalı vergi alması nedeniyle sorgulayıp ceza vermiştir. Halkı kendisini serbest olarak eleştirebilirdi.',
    order: 6,
  },
  {
    id: '7',
    title: 'Şehadeti',
    content: 'Hz. Ömer, 644 yılında Medine\'de Abdullah bin Ebu Rafi tarafından şehit edildi. Ölümünde 58 yaşındaydı. Şehadetinden sonra Müslümanlar çok üzüldüler ve birçok sahabeler ağladılar. Cenazesi Medine\'de Hz. Peygamber ve Hz. Ebubekir\'in yanına gömüldü.',
    order: 7,
  },
];

sahabelerData['hz-omer'] = {
  id: '2',
  slug: 'hz-omer',
  name: 'Hz. Ömer',
  arabicName: 'عمر بن الخطاب',
  title: 'Faruk',
  description: "Adaletin simgesi, İslam'ın ikinci halifesi.",
  imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_23-4TxkSGWwHwqVNPDu9su6CERuSis9I0.png',
  birthYear: 586,
  birthPlace: 'Mekke',
  deathYear: 644,
  deathPlace: 'Medine',
  burialPlace: 'Medine, Mescid-i Nebevi',
  generation: 'Sahabe',
  nickname: 'Faruk (Hak ile Batılı Ayıran)',
  biography: hzOmerBio,
  fullBiography: hzOmerSections,
  events: chronologicalEvents.slice(1, 6),
  relations: [
    { id: '1', name: 'Hz. Zeynep bint Mazun', relationship: 'Eşi (1. Eş)', imageUrl: '', slug: 'hz-zeynep' },
    { id: '2', name: 'Hz. Ummu Kulsum', relationship: 'Eşi (2. Eş)', imageUrl: '', slug: 'hz-ummu-kulsum' },
    { id: '3', name: 'Abdullah ibn Ömer', relationship: 'Oğlu', imageUrl: '', slug: 'hz-abdullah' },
    { id: '4', name: 'Hafsa bint Ömer', relationship: 'Kızı', imageUrl: '', slug: 'hz-hafsa' },
    { id: '5', name: 'Asım ibn Ömer', relationship: 'Oğlu', imageUrl: '', slug: 'hz-asim' },
  ],
  hadiths: mockHadiths.slice(0, 15),
};

sahabelerData['hz-ali'] = {
  id: '4',
  slug: 'hz-ali',
  name: 'Hz. Ali',
  arabicName: 'علي بن أبي طالب',
  title: 'Esedullah',
  description: "Allah'ın Aslanı, İslam'ın dördüncü halifesi.",
  imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_33-Ngg0T0Wh2LPuyRvWJYt9sEaIrIKmdO.png',
  birthYear: 600,
  birthPlace: 'Mekke',
  deathYear: 661,
  deathPlace: 'Kufe',
  burialPlace: 'Necef, Irak',
  generation: 'Sahabe',
  nickname: 'Esedullah (Allah\'ın Aslanı)',
  biography: 'Hz. Ali, Peygamber Efendimizin amcası Ebu Talib\'in oğludur. Çocuklar arasında İslam\'ı ilk kabul eden kişidir. Peygamber Efendimizin kızı Hz. Fatıma ile evlenmiş, bu evlilikten Hz. Hasan ve Hz. Hüseyin dünyaya gelmiştir.',
  fullBiography: biographySections,
  events: chronologicalEvents.slice(2, 5),
  relations: [
    { id: '1', name: 'Hz. Ebubekir', relationship: 'Kayınpeder', imageUrl: '', slug: 'hz-ebubekir' },
    { id: '2', name: 'Hz. Fatıma', relationship: 'Eşi', imageUrl: '', slug: 'hz-fatima' },
    { id: '3', name: 'Hz. Hasan', relationship: 'Oğlu', imageUrl: '', slug: 'hz-hasan' },
    { id: '4', name: 'Hz. Hüseyin', relationship: 'Oğlu', imageUrl: '', slug: 'hz-huseyin' },
  ],
  hadiths: mockHadiths.slice(0, 10),
};

// Default detail (Hz. Ali)
export const sahabeDetail: Sahabe = sahabelerData['hz-ali'] as Sahabe;

// Sahabeler veri erişimi
export function getSahabeBySlug(slug: string): Sahabe {
  return sahabelerData[slug] || sahabeDetail;
}

// All Sahabeler for listing
export const allSahabeler: SahabeCard[] = [
  ...fourCaliphs,
  { id: '5', slug: 'hz-fatima', name: 'Hz. Fatıma', description: 'Peygamberimizin kızı, cennet kadınlarının efendisi.', imageUrl: '' },
  { id: '6', slug: 'hz-hatice', name: 'Hz. Hatice', description: 'Peygamberimizin ilk eşi, ilk Müslüman kadın.', imageUrl: '' },
  { id: '7', slug: 'hz-aise', name: 'Hz. Aişe', description: 'Müminlerin annesi, büyük hadis alimi.', imageUrl: '' },
  { id: '8', slug: 'hz-bilal', name: 'Hz. Bilal', description: 'İslam\'ın ilk müezzini.', imageUrl: '' },
  { id: '9', slug: 'hz-hamza', name: 'Hz. Hamza', description: 'Şehitlerin efendisi.', imageUrl: '' },
  { id: '10', slug: 'hz-zeyd', name: 'Hz. Zeyd', description: 'Peygamberimizin azatlı kölesi ve evlatlığı.', imageUrl: '' },
  { id: '11', slug: 'hz-sad', name: 'Hz. Sad b. Ebi Vakkas', description: 'Cennetle müjdelenen on sahabeden biri.', imageUrl: '' },
  { id: '12', slug: 'hz-talha', name: 'Hz. Talha', description: 'Cennetle müjdelenen on sahabeden biri.', imageUrl: '' },
];
