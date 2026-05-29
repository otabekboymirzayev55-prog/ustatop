import { useEffect, useMemo, useState } from 'react'
import heroArt from './assets/hero.png'
import './App.css'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://ustafix.uz'
const PHONE_NUMBER = import.meta.env.VITE_CONTACT_PHONE || '+998901234567'
const TELEGRAM_URL = import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/ustafix_uz'
const WHATSAPP_URL =
  import.meta.env.VITE_WHATSAPP_URL ||
  `https://wa.me/998901234567?text=${encodeURIComponent('Salom, UstaFix orqali xizmat kerak.')}`

const NAV_ITEMS = [
  { href: '/', label: 'Bosh sahifa' },
  { href: '/santexnik-chaqirish', label: 'Santexnik' },
  { href: '/elektrik-chaqirish', label: 'Elektrik' },
  { href: '/konditsioner-tamiri', label: 'Konditsioner' },
  { href: '/toshkent', label: 'Toshkent' },
  { href: '/kontakt', label: 'Kontakt' },
]

const SERVICE_OPTIONS = [
  'Barchasi',
  'Santexnik',
  'Elektrik',
  'Konditsioner',
  'Maishiy texnika',
  'Remont',
  'Dizayn',
]

const SERVICE_PAGES = {
  '/santexnik-chaqirish': {
    kind: 'service',
    service: 'Santexnik',
    city: 'Toshkent',
    title: 'Toshkentda santexnik chaqirish',
    description:
      'Kran oqishi, quvur yorilishi, unitaz nosozligi yoki suv bosimi muammosi uchun tezkor santexnik xizmati.',
    intro:
      'UstaFix Toshkent bo‘ylab santexnik chaqirish uchun SEO sahifa. Birgina murojaat bilan sizga mos ustaga ulanish mumkin.',
    bullets: [
      'Kran va quvur ta’miri',
      'Unitaz, sifon va rakovina o‘rnatish',
      'Suv bosimi va sizib chiqish muammolari',
      'Shoshilinch uyga chiqish',
    ],
    faq: [
      ['Santexnik qancha vaqtda keladi?', 'Odatda murojaatdan so‘ng tezkor bog‘lanish qilinadi.'],
      ['Narx qanday hisoblanadi?', 'Ish hajmi va joylashuvga qarab kelishiladi.'],
      ['Kichik ishlar ham qilinadimi?', 'Ha, kran almashtirishdan tortib katta quvur ishlarigacha.'],
    ],
    serviceTags: ['kran ta’miri', 'quvur ta’miri', 'unitaz o‘rnatish'],
  },
  '/elektrik-chaqirish': {
    kind: 'service',
    service: 'Elektrik',
    city: 'Toshkent',
    title: 'Toshkentda elektrik chaqirish',
    description:
      'Rozetka, svet, avtomat, sim tortish yoki qisqa tutashuv muammolari uchun xavfsiz elektrik xizmati.',
    intro:
      'Elektrik qidirayotgan mijozlar uchun tayyorlangan sahifa. Sahifa Google’da elektr ta’miri bo‘yicha qidiruvlarga mos yozuv bilan qurilgan.',
    bullets: [
      'Rozetka va svet muammolari',
      'Avtomat va elektr shkaf ishlari',
      'Sim tortish va ulash',
      'Uy va ofis uchun tezkor yordam',
    ],
    faq: [
      ['Elektrik kechasi ham keladimi?', 'Bu siz tanlagan ustaga bog‘liq, lekin tez bog‘lanish uchun forma bor.'],
      ['Xavfsizlik qanday ta’minlanadi?', 'Ish oldidan muammo aniqlanib, keyin bajariladi.'],
      ['Mayda ishlar uchun ham murojaat qilsa bo‘ladimi?', 'Ha, rozetka almashtirish kabi ishlar ham qabul qilinadi.'],
    ],
    serviceTags: ['rozetka', 'svet', 'elektr shkaf'],
  },
  '/konditsioner-tamiri': {
    kind: 'service',
    service: 'Konditsioner',
    city: 'Toshkent',
    title: 'Toshkentda konditsioner ta’miri',
    description:
      'Konditsioner sovitmayapti, shovqin chiqaryapti yoki gaz to‘ldirish kerak bo‘lsa, mos usta toping.',
    intro:
      'Yozgi mavsumda eng ko‘p qidiriladigan xizmatlardan biri. Biz uni tez topiladigan, qisqa va tushunarli sahifaga aylantirdik.',
    bullets: [
      'Diagnostika va tozalash',
      'Gaz to‘ldirish va servis',
      'O‘rnatish va ko‘chirish',
      'Sovutish muammosini topish',
    ],
    faq: [
      ['Gaz to‘ldirish alohidami?', 'Ha, muammo turiga qarab servis alohida baholanadi.'],
      ['Qaysi turdagi konditsionerlar?', 'Uy va ofisdagi ko‘p tarqalgan tizimlar.'],
      ['Murojaatni qanday yuboraman?', 'Pastdagi forma orqali ism, telefon va muammo yozasiz.'],
    ],
    serviceTags: ['gaz to‘ldirish', 'servis', 'o‘rnatish'],
  },
  '/toshkent': {
    kind: 'city',
    city: 'Toshkent',
    title: 'Toshkentda uy ta’miri xizmatlari',
    description:
      'Toshkent bo‘ylab santexnik, elektrik va konditsioner ustalariga tez murojaat qilish uchun sahifa.',
    intro:
      'Toshkent uchun local SEO sahifa. Maqsad oddiy: odam Google’dan topsin, tez o‘qisin va bir klikda bog‘lansin.',
    bullets: [
      'Chilonzor, Yunusobod, Yakkasaroy va boshqa hududlar',
      'Uy, ofis va xonadonlar uchun ustalar',
      'Qo‘ng‘iroq yoki forma orqali lead qoldirish',
      'Tez bog‘lanish va kelishilgan narx',
    ],
    faq: [
      ['Toshkentdan tashqarida ham ishlaysizmi?', 'Ha, keyin Samarqand va Farg‘ona sahifalari qo‘shiladi.'],
      ['Ustani qanday tanlayman?', 'Siz muammoni yozasiz, keyin mos yo‘nalishga ulanamiz.'],
      ['Sayt qidiruvda chiqadimi?', 'Ha, shu pivotsiz maqsadimiz aynan shunday: SEO orqali kelish.'],
    ],
    serviceTags: ['Chilonzor', 'Yunusobod', 'Yakkasaroy'],
  },
  '/kontakt': {
    kind: 'contact',
    title: 'UstaFix bilan bog‘lanish',
    description:
      'Telefon, Telegram yoki WhatsApp orqali tez bog‘laning yoki pastdagi formani to‘ldiring.',
    intro:
      'Bu sahifa call-first konversiya uchun. Google’dan kelgan foydalanuvchi eng qisqa yo‘l bilan bog‘lanadi.',
    bullets: [
      'Telefon orqali tez aloqa',
      'Telegram orqali xabar qoldirish',
      'WhatsApp orqali yozish',
      'Formadan lead qoldirish',
    ],
    faq: [
      ['Qaysi kanal tezroq?', 'Telefon eng tez, Telegram va WhatsApp keyingi qulay variantlar.'],
      ['Forma qayerga boradi?', 'Firestore `requests` collection’iga yoziladi.'],
      ['Javob qachon keladi?', 'Tizim leadni saqlaydi va admin ko‘rib chiqadi.'],
    ],
    serviceTags: ['qo‘ng‘iroq', 'Telegram', 'WhatsApp'],
  },
}

const DEFAULT_WORKERS = [
  {
    id: 'worker-1',
    name: 'Azizbek Usta',
    service: 'Santexnik',
    city: 'Toshkent',
    area: 'Chilonzor',
    phone: '+998901112233',
    telegram: 'https://t.me/azizbek_usta',
    whatsapp: 'https://wa.me/998901112233',
    rating: 4.9,
    reviews: 86,
    available: true,
    skills: ['quvur ta’miri', 'kran almashtirish', 'unitaz o‘rnatish'],
    bio: 'Tezkor chiqish va mayda-katta santexnik ishlar uchun qulay usta.',
  },
  {
    id: 'worker-1b',
    name: 'Bahrom Santexnik',
    service: 'Santexnik',
    city: 'Toshkent',
    area: 'Yashnobod',
    phone: '+998901113355',
    telegram: 'https://t.me/bahrom_santexnik',
    whatsapp: 'https://wa.me/998901113355',
    rating: 4.8,
    reviews: 61,
    available: true,
    skills: ['kran ta’miri', 'suv sizishi', 'quvur ulash'],
    bio: 'Yashnobod va atrofida tez chiqib, kran va quvur muammolarini ko‘p yopadi.',
  },
  {
    id: 'worker-2',
    name: 'Dilshod Elektrik',
    service: 'Elektrik',
    city: 'Toshkent',
    area: 'Yunusobod',
    phone: '+998901445566',
    telegram: 'https://t.me/dilshod_elektrik',
    whatsapp: 'https://wa.me/998901445566',
    rating: 4.8,
    reviews: 74,
    available: true,
    skills: ['rozetka', 'svet', 'avtomat'],
    bio: 'Uy va ofisda elektr muammolarini tez topib, xavfsiz yechim beradi.',
  },
  {
    id: 'worker-2b',
    name: 'Bekzod Elektrik',
    service: 'Elektrik',
    city: 'Toshkent',
    area: 'Chilonzor',
    phone: '+998901223344',
    telegram: 'https://t.me/bekzod_elektrik',
    whatsapp: 'https://wa.me/998901223344',
    rating: 4.7,
    reviews: 44,
    available: true,
    skills: ['sim tortish', 'avtomat', 'qisqa tutashuv'],
    bio: 'Chilonzor hududida eski sim va avtomat ishlari uchun mos usta.',
  },
  {
    id: 'worker-3',
    name: 'Jasur Konditsioner',
    service: 'Konditsioner',
    city: 'Toshkent',
    area: 'Yakkasaroy',
    phone: '+998901778899',
    telegram: 'https://t.me/jasur_ac',
    whatsapp: 'https://wa.me/998901778899',
    rating: 4.9,
    reviews: 52,
    available: false,
    skills: ['servis', 'gaz to‘ldirish', 'o‘rnatish'],
    bio: 'Mavsumiy yuklama paytida ham qisqa muddatda navbat beradi.',
  },
  {
    id: 'worker-3b',
    name: 'Anvar AC',
    service: 'Konditsioner',
    city: 'Toshkent',
    area: 'Mirzo Ulug‘bek',
    phone: '+998901556677',
    telegram: 'https://t.me/anvar_ac',
    whatsapp: 'https://wa.me/998901556677',
    rating: 4.8,
    reviews: 35,
    available: true,
    skills: ['sovutmayapti', 'tozalash', 'gaz tekshirish'],
    bio: 'Sovutish pasaygan konditsionerlar uchun joyida diagnostika va servis.',
  },
  {
    id: 'worker-4',
    name: 'Farhod Usta',
    service: 'Maishiy texnika',
    city: 'Samarqand',
    area: 'Markaz',
    phone: '+998907001122',
    telegram: 'https://t.me/farhod_tex',
    whatsapp: 'https://wa.me/998907001122',
    rating: 4.7,
    reviews: 39,
    available: true,
    skills: ['kir yuvish mashinasi', 'muzlatgich', 'diagnostika'],
    bio: 'Maishiy texnika nosozligida tashxis va joyida ishlashga mos usta.',
  },
  {
    id: 'worker-4b',
    name: 'Nodir Texnik',
    service: 'Maishiy texnika',
    city: 'Toshkent',
    area: 'Mirzo Ulug‘bek',
    phone: '+998907771122',
    telegram: 'https://t.me/nodir_tex',
    whatsapp: 'https://wa.me/998907771122',
    rating: 4.8,
    reviews: 48,
    available: true,
    skills: ['kir mashina', 'nasos', 'diagnostika'],
    bio: 'Kir mashina remontida joyiga chiqib, tez tashxis qo‘yadigan usta.',
  },
  {
    id: 'worker-5',
    name: 'Rustam Remont',
    service: 'Remont',
    city: 'Toshkent',
    area: 'Chilonzor',
    phone: '+998909998877',
    telegram: 'https://t.me/rustam_remont',
    whatsapp: 'https://wa.me/998909998877',
    rating: 4.9,
    reviews: 57,
    available: true,
    skills: ['uy remont', 'oshxona', 'hammom'],
    bio: 'Xonadon va kichik uy remontini bosqichma-bosqich rejalab bajaradigan brigada.',
  },
  {
    id: 'worker-6',
    name: 'Madina Dizayn',
    service: 'Dizayn',
    city: 'Toshkent',
    area: 'Yakkasaroy',
    phone: '+998909887766',
    telegram: 'https://t.me/madina_dizayn',
    whatsapp: 'https://wa.me/998909887766',
    rating: 4.8,
    reviews: 33,
    available: true,
    skills: ['hammom dizayn', 'oshxona reja', 'material tanlash'],
    bio: 'Hammom va oshxona yangilashda dizayn, smeta va usta tanlashni birga olib boradi.',
  },
]

const HOME_PAGE = {
  kind: 'home',
  title: 'UstaFix - ustalar topish va bog‘lanish platformasi',
  description:
    'UstaFix - O‘zbekistonda ustalarni Google qidiruvida topish, xizmat bo‘yicha filtrlash va tez bog‘lanish uchun SEO-first platforma.',
  intro:
    'Maqsad oddiy: odam Google’dan xizmatni topsin, ustalar ro‘yxatini ko‘rsin va bir klikda bog‘lansin. Public sahifa SEO uchun yozilgan, ichki oqim esa lead va kontaktga olib boradi.',
  bullets: [
    'Santexnik, elektrik, konditsioner va boshqa ustalar',
    'Telefon, Telegram va WhatsApp orqali kontakt',
    'Firestore lead capture',
    'Toshkent uchun local SEO',
  ],
  serviceTags: ['usta topish', 'local SEO', 'lead generation'],
  faq: [
    ['UstaFix nima?', 'Ustalarni topish, filtrlash va ularga tez bog‘lanish uchun platforma.'],
    ['Mijoz nima qiladi?', 'Xizmatni tanlaydi, ustani ko‘radi va telefon yoki xabar orqali bog‘lanadi.'],
    ['Nima uchun SEO-first?', 'Chunki asosiy trafik Google qidiruvidan kelishi kerak.'],
  ],
}

function makeSeoPage(config) {
  const service = config.service || 'Santexnik'
  const city = config.city || 'Toshkent'

  return {
    kind: 'seo',
    demandLayer: config.demandLayer || 'emergency',
    service,
    city,
    h1: config.h1,
    title: config.title,
    description: config.description,
    intro: config.intro,
    explanationTitle: config.explanationTitle || 'Muammo nimadan iborat?',
    explanation: config.explanation,
    priceRange: config.priceRange,
    priceNote: config.priceNote,
    signalsTitle: config.signalsTitle || 'Nimani ko‘rasiz?',
    signals: config.signals,
    faq: config.faq,
    serviceTags: config.serviceTags,
    relatedLinks: config.relatedLinks,
    workerFilter: config.workerFilter || { service, city, area: config.area || '' },
  }
}

const PROBLEM_PAGES = {
  '/kran-oqyapti': makeSeoPage({
    demandLayer: 'emergency',
    service: 'Santexnik',
    city: 'Toshkent',
    h1: 'Kran oqyapti',
    title: 'Kran oqyapti? Toshkentda tez santexnik chaqiring | UstaFix',
    description:
      'Kran tomchilab oqyaptimi, jo‘mrak yopilganda ham suv chiqyaptimi? Toshkentdagi tezkor santexniklar, taxminiy narx va aloqa variantlari shu sahifada.',
    intro:
      'Bu sahifa kichik lekin bezovta qiladigan kran oqishi uchun. Maqsad: foydalanuvchi muammoni tez taniysin, narx oralig‘ini ko‘rsin va bir klikda ustaga chiqsin.',
    explanationTitle: 'Kran oqishi nimadan bo‘ladi?',
    explanation:
      'Odatda rezina prokladka yeyilishi, kartrij eskirishi, armatura bo‘shashishi yoki quvur ulanishida sizib chiqish sabab bo‘ladi. Odam Google’dan aynan shu muammoni qidirganda sahifa qisqa javob va tez aloqa berishi kerak.',
    priceRange: 'Taxminan 80 000 - 180 000 so‘m',
    priceNote: 'Oddiy kran ta’miri arzonroq, butun armatura almashtirish esa narxni oshiradi.',
    signalsTitle: 'Qanday belgilar bo‘ladi?',
    signals: ['Kran yopiq bo‘lsa ham tomchilaydi', 'Kechasi shovqin qiladi', 'Lavabo tagida namlik ko‘rinadi'],
    faq: [
      ['Kran oqsa darhol almashtirish kerakmi?', 'Har doim emas. Ko‘p holatda rezina, kartrij yoki ulanishni tuzatish yetadi.'],
      ['Usta qancha vaqtda keladi?', 'Hududga qarab tezkor bog‘lanish qilinadi va eng yaqin usta yo‘naltiriladi.'],
      ['Kichik ish uchun ham chiqish bo‘ladimi?', 'Ha, aynan shu sahifa mayda ammo shoshilinch ishlar uchun yaratilgan.'],
    ],
    serviceTags: ['kran oqishi', 'tomchilash', 'santexnik'],
    relatedLinks: [
      { href: '/kran-tagidan-suv-oqyapti', label: 'Kran tagidan suv oqyapti', text: 'Ulanish joyidagi sizib chiqish uchun.' },
      { href: '/santexnik-toshkent', label: 'Santexnik Toshkent', text: 'Hudud bo‘yicha umumiy santexnik sahifa.' },
      { href: '/toshkent', label: 'Toshkent xizmatlari', text: 'Shahar bo‘yicha barcha xizmatlar.' },
    ],
  }),
  '/kran-tagidan-suv-oqyapti': makeSeoPage({
    demandLayer: 'emergency',
    service: 'Santexnik',
    city: 'Toshkent',
    h1: 'Kran tagidan suv oqyapti',
    title: 'Kran tagidan suv oqyapti? Sabab va narx | UstaFix',
    description:
      'Kran tagidan yoki lavabo ostidan suv oqyaptimi? Bu sahifada siz sabablar, taxminiy narx va tezkor santexniklarga chiqish yo‘lini topasiz.',
    intro:
      'Bu sahifa ko‘rinmaydigan, lekin zarar yetkazadigan sizib chiqishlar uchun. Lavabo tagidagi namlik, ho‘l quvur yoki ulanish bo‘shashishi kabi holatlar uchun mos.',
    explanationTitle: 'Nega kran tagidan suv chiqadi?',
    explanation:
      'Ko‘pincha krankaga ulangan shlang bo‘shashadi, fiting qotmaydi, prokladka ishlamay qoladi yoki metall qismdagi mikroyoriq kuchayadi. Muammo erta topilsa, katta ta’mirga o‘tmaydi.',
    priceRange: 'Taxminan 100 000 - 220 000 so‘m',
    priceNote: 'Tagidan oqish uchun qo‘shimcha diagnostika kerak bo‘lishi mumkin, chunki suv yo‘li yashirin bo‘ladi.',
    signalsTitle: 'Qaysi holatlar xavfli?',
    signals: ['Lavabo ostida suv yig‘iladi', 'Shlang ulanish joyi nam bo‘ladi', 'Kichik oqish vaqt o‘tishi bilan kuchayadi'],
    faq: [
      ['Bu faqat kran muammosimi?', 'Yo‘q, ba’zan ulanish yoki quvurdagi muammo bo‘ladi va qo‘shimcha tekshiruv kerak bo‘ladi.'],
      ['Santexnik kelguncha nima qilish kerak?', 'Asosiy suvni yoping va oqayotgan joyni quritib qo‘ying.'],
      ['Sahifa nima uchun alohida?', 'Chunki bu qidiruv iborasi boshqacha va foydalanuvchi niyati ham aniqroq.'],
    ],
    serviceTags: ['suv sizishi', 'lavabo tagi', 'kran'],
    relatedLinks: [
      { href: '/kran-oqyapti', label: 'Kran oqyapti', text: 'Oddiy tomchilash holati uchun.' },
      { href: '/santexnik-toshkent', label: 'Santexnik Toshkent', text: 'Hududiy xizmat sahifasi.' },
      { href: '/elektrik-chilonzor', label: 'Elektrik Chilonzor', text: 'Agar suv bilan birga elektr xavfi ham bo‘lsa.' },
    ],
  }),
  '/konditsioner-sovutmayapti': makeSeoPage({
    demandLayer: 'emergency',
    service: 'Konditsioner',
    city: 'Toshkent',
    h1: 'Konditsioner sovutmayapti',
    title: 'Konditsioner sovutmayapti? Tez servis va narx | UstaFix',
    description:
      'Konditsioner havo aylantiryaptimi, lekin sovutmayaptimi? Sabablar, taxminiy servis narxi va tez topiladigan ustalar bu yerda.',
    intro:
      'Bu yozgi mavsumda eng ko‘p qidiriladigan muammolardan biri. Sahifa sovutish pasayishi, gaz kamayishi va tozalash ehtiyojini bir joyda tushuntiradi.',
    explanationTitle: 'Nega konditsioner sovutmaydi?',
    explanation:
      'Gaz kamayishi, filtr va radiator ifloslanishi, ventilyator yoki sensor xatolari, ba’zan esa kompressor bilan bog‘liq muammo sabab bo‘ladi. To‘g‘ri tashxisni tez qo‘yish narxni ham kamaytiradi.',
    priceRange: 'Taxminan 150 000 - 420 000 so‘m',
    priceNote: 'Servis narxi tozalash, gaz tekshirish va ehtiyot qismga qarab farq qiladi.',
    signalsTitle: 'Belgilari qanday?',
    signals: ['Havo chiqadi, lekin sovuq emas', 'Ichki blok muzlaydi', 'Uzoq vaqt ishlasa ham xona sovimaydi'],
    faq: [
      ['Gaz to‘ldirish kerak bo‘lishi mumkinmi?', 'Ha, lekin faqat tekshiruvdan keyin xulosa qilinadi.'],
      ['Qachon servis qilish kerak?', 'Sovutish pasayishi yoki g‘alati shovqin boshlangan zahoti.'],
      ['Kechasi ham murojaat bo‘ladimi?', 'Ha, aloqa tugmalari orqali tez bog‘lanish mumkin.'],
    ],
    serviceTags: ['konditsioner', 'sovutmayapti', 'servis'],
    relatedLinks: [
      { href: '/konditsioner-tamiri', label: 'Konditsioner ta’miri', text: 'Umumiy servis sahifasi.' },
      { href: '/toshkent', label: 'Toshkent xizmatlari', text: 'Hududiy sahifa.' },
      { href: '/elektrik-chilonzor', label: 'Elektrik Chilonzor', text: 'Agar elektr ta’minoti ham muammo bo‘lsa.' },
    ],
  }),
  '/kir-mashina-remont': makeSeoPage({
    demandLayer: 'emergency',
    service: 'Maishiy texnika',
    city: 'Toshkent',
    h1: 'Kir mashina remont',
    title: 'Kir mashina remont kerakmi? Usta va narx | UstaFix',
    description:
      'Kir yuvish mashinasi suv olmayaptimi, aylantirmayaptimi yoki xatolik kodini ko‘rsatyaptimi? Usta topish, taxminiy narx va aloqa shu sahifada.',
    intro:
      'Bu sahifa kir yuvish mashinasi to‘xtab qolganida paydo bo‘ladigan qidiruv niyatiga mos yozilgan. Odam muammoni ko‘radi, taxminiy narxni tushunadi va ustaga chiqadi.',
    explanationTitle: 'Kir mashina remontida nimalar tekshiriladi?',
    explanation:
      'Nasos, remen, podshipnik, datchiklar, suv kirish valfi va elektron plata alohida ko‘riladi. Muammo mayda bo‘lsa joyida hal qilinadi, murakkab holatda esa diagnostika chuqurlashtiriladi.',
    priceRange: 'Taxminan 120 000 - 480 000 so‘m',
    priceNote: 'Oddiy nosozliklar arzon, motor yoki plata bilan bog‘liq ishlar qimmatroq bo‘lishi mumkin.',
    signalsTitle: 'Nimani sezish mumkin?',
    signals: ['Suv oladi, lekin aylantirmaydi', 'Shovqin yoki vibratsiya kuchli', 'Ekranda xatolik kodi chiqadi'],
    faq: [
      ['Kir mashina joyida tuzatiladimi?', 'Ko‘p holatda ha, lekin ayrim ehtiyot qismga olib ketish kerak bo‘lishi mumkin.'],
      ['Qaysi brendlar qilinadi?', 'Ommabop maishiy texnika modellari bilan ishlaydigan ustalar bor.'],
      ['Qancha vaqt ketadi?', 'Nosozlik turiga bog‘liq, lekin avval diagnostika qilinadi.'],
    ],
    serviceTags: ['kir mashina', 'remont', 'maishiy texnika'],
    relatedLinks: [
      { href: '/santexnik-toshkent', label: 'Santexnik Toshkent', text: 'Uy ichidagi boshqa ta’mirlar uchun.' },
      { href: '/toshkent', label: 'Toshkent xizmatlari', text: 'Hududiy qidiruv sahifasi.' },
      { href: '/kran-oqyapti', label: 'Kran oqyapti', text: 'Agar suv tizimi ham muammo bo‘lsa.' },
    ],
  }),
  '/santexnik-toshkent': makeSeoPage({
    demandLayer: 'emergency',
    service: 'Santexnik',
    city: 'Toshkent',
    h1: 'Toshkentda santexnik',
    title: 'Santexnik Toshkent: tez usta va narx | UstaFix',
    description:
      'Toshkentda santexnik kerakmi? Kran, quvur, lavabo, unitaz va suv tizimi bo‘yicha ustalar, taxminiy narxlar va bog‘lanish yo‘llari.',
    intro:
      'Bu sahifa umumiy santexnik qidiruvi uchun. Foydalanuvchi muammoni hali aniq bilmasa ham, nimaga ulanishni tez topadi.',
    explanationTitle: 'Santexnik xizmatlar qachon kerak bo‘ladi?',
    explanation:
      'Kran tomchilashidan tortib, quvur yorilishi, lavabo o‘rnatish, unitaz ta’miri va suv bosimi pasayishi kabi holatlar uchun ishlatiladi. Toshkent bo‘yicha tez bog‘lanish eng muhim omil bo‘ladi.',
    priceRange: 'Taxminan 90 000 - 350 000 so‘m',
    priceNote: 'Ish hajmi va hududga qarab ustaning chiqish narxi o‘zgaradi.',
    signalsTitle: 'Qanday ishlar ko‘p uchraydi?',
    signals: ['Kichik sizib chiqish', 'Lavabo va unitaz montaji', 'Suv bosimi va kollektor muammolari'],
    faq: [
      ['Toshkent bo‘ylab chiqasizmi?', 'Ha, sahifa aynan shahar bo‘yicha qidiruv uchun mo‘ljallangan.'],
      ['Kichik ishlar qabul qilinadimi?', 'Ha, mayda ishlardan boshlanib katta loyihagacha borishi mumkin.'],
      ['Narx oldindan aytiladimi?', 'Taxminiy oraliq beriladi, aniq baho ishni ko‘rgandan keyin aytiladi.'],
    ],
    serviceTags: ['santexnik', 'Toshkent', 'quvur'],
    relatedLinks: [
      { href: '/kran-oqyapti', label: 'Kran oqyapti', text: 'Eng ko‘p qidiriladigan muammo.' },
      { href: '/kran-tagidan-suv-oqyapti', label: 'Kran tagidan suv oqyapti', text: 'Yashirin sizib chiqish uchun.' },
      { href: '/toshkent', label: 'Toshkent xizmatlari', text: 'Hudud bo‘yicha umumiy sahifa.' },
    ],
  }),
  '/elektrik-chilonzor': makeSeoPage({
    demandLayer: 'emergency',
    service: 'Elektrik',
    city: 'Toshkent',
    area: 'Chilonzor',
    h1: 'Chilonzorda elektrik',
    title: 'Elektrik Chilonzor: uyga chiqish va narx | UstaFix',
    description:
      'Chilonzorda elektrik kerakmi? Rozetka, svet, avtomat, sim tortish va eski elektr muammolari uchun ustalar shu sahifada.',
    intro:
      'Bu sahifa Chilonzor bo‘yicha lokal intent uchun. Foydalanuvchi aniq hudud yozadi, shuning uchun javob ham hududga mos bo‘lishi kerak.',
    explanationTitle: 'Elektrik qachon kerak bo‘ladi?',
    explanation:
      'Rozetka ishlamay qolsa, avtomat o‘chsa, sim qizisa, svet o‘chib-yonib tursa yoki eski uyda qo‘shimcha liniya kerak bo‘lsa elektrik kerak bo‘ladi. Chilonzor kabi katta hududlarda tez chiqish va hududiy moslik muhim.',
    priceRange: 'Taxminan 70 000 - 260 000 so‘m',
    priceNote: 'Oddiy rozetka va svet ishlari arzonroq, avtomat va sim tortish qimmatroq bo‘ladi.',
    signalsTitle: 'Qanday alomatlar bor?',
    signals: ['Avtomat tez-tez o‘chadi', 'Rozetkada uchqun bo‘ladi', 'Svet ishlamay qoladi yoki miltillaydi'],
    faq: [
      ['Chilonzorga tez chiqiladimi?', 'Ha, sahifa aynan shu hudud qidiruvlari uchun optimallashtirilgan.'],
      ['Eski uy elektri ham qilinadimi?', 'Ha, lekin xavfsizlik tekshiruvi birinchi o‘rinda bo‘ladi.'],
      ['Kichik ishlar ham qabul qilinadimi?', 'Albatta, rozetka almashtirish ham shu sahifaga mos.'],
    ],
    serviceTags: ['elektrik', 'Chilonzor', 'rozetka'],
    relatedLinks: [
      { href: '/kran-oqyapti', label: 'Kran oqyapti', text: 'Uy ichidagi boshqa muammolar uchun.' },
      { href: '/santexnik-toshkent', label: 'Santexnik Toshkent', text: 'Agar suv va elektr birga muammo bo‘lsa.' },
      { href: '/toshkent', label: 'Toshkent xizmatlari', text: 'Shahar bo‘yicha boshqa xizmatlar.' },
    ],
  }),
}

const MAINTENANCE_PAGES = {
  '/kran-almashtirish': makeSeoPage({
    demandLayer: 'maintenance',
    service: 'Santexnik',
    city: 'Toshkent',
    h1: 'Kran almashtirish',
    title: 'Kran almashtirish xizmati: usta va narx | UstaFix',
    description:
      'Eski kranni yangisiga almashtirish, lavabo yoki oshxona kranini o‘rnatish uchun santexniklar, narx oralig‘i va tez aloqa.',
    intro:
      'Bu sahifa favqulodda oqishdan ko‘ra rejali almashtirish intenti uchun. Foydalanuvchi yangi kran olgan yoki eskisini almashtirmoqchi bo‘lgan paytda kerakli ustani tez topadi.',
    explanationTitle: 'Kran almashtirishda nima qilinadi?',
    explanation:
      'Usta eski kranni yechadi, ulanish joylarini tekshiradi, yangi kranni o‘rnatadi va sizib chiqish bor-yo‘qligini sinaydi. Oshxona va hammom kranlari uchun ish tartibi biroz farq qiladi.',
    priceRange: 'Taxminan 100 000 - 250 000 so‘m',
    priceNote: 'Narx kran turi, shlanglar holati va qo‘shimcha moslama kerakligiga qarab o‘zgaradi.',
    signalsTitle: 'Qachon almashtirish yaxshi?',
    signals: ['Kran zanglagan yoki qattiq buriladi', 'Yangi rakovina yoki mebel qo‘yildi', 'Ta’mirdan keyin bir xil uslub kerak'],
    faq: [
      ['Yangi kranni usta olib keladimi?', 'Kelishuvga qarab, mijoz o‘zi olishi yoki usta tavsiya berishi mumkin.'],
      ['Eski shlanglar ham almashtiriladimi?', 'Agar eskirgan bo‘lsa, xavfsizlik uchun almashtirish tavsiya qilinadi.'],
      ['Ish qancha vaqt oladi?', 'Oddiy holatda 30-90 daqiqa atrofida bo‘ladi.'],
    ],
    serviceTags: ['kran almashtirish', 'santexnik', 'lavabo'],
    relatedLinks: [
      { href: '/kran-oqyapti', label: 'Kran oqyapti', text: 'Agar almashtirishdan oldin oqish boshlangan bo‘lsa.' },
      { href: '/santexnika-tekshiruv', label: 'Santexnika tekshiruv', text: 'Butun tizimni oldindan ko‘rish uchun.' },
      { href: '/santexnik-toshkent', label: 'Santexnik Toshkent', text: 'Shahar bo‘yicha ustalar.' },
    ],
  }),
  '/elektrik-ornatish': makeSeoPage({
    demandLayer: 'maintenance',
    service: 'Elektrik',
    city: 'Toshkent',
    h1: 'Elektrik o‘rnatish ishlari',
    title: 'Elektrik o‘rnatish: rozetka, svet, avtomat | UstaFix',
    description:
      'Rozetka, chiroq, avtomat yoki kichik elektr nuqtalarini o‘rnatish uchun Toshkentdagi elektrik ustalar va taxminiy narxlar.',
    intro:
      'Bu sahifa buzilish emas, rejali o‘rnatish ishlarini qidirayotgan mijoz uchun. Yangi texnika, yoritish yoki uy tartibini o‘zgartirishda qo‘l keladi.',
    explanationTitle: 'Elektrik o‘rnatishda nimalar kiradi?',
    explanation:
      'Usta nuqta joyini ko‘radi, yuklama xavfsizligini tekshiradi, kerak bo‘lsa avtomat yoki kabel mosligini baholaydi va o‘rnatishdan keyin sinov qiladi.',
    priceRange: 'Taxminan 80 000 - 300 000 so‘m',
    priceNote: 'Bitta rozetka arzonroq, yangi kabel tortish yoki avtomat qo‘yish narxni oshiradi.',
    signalsTitle: 'Qanday holatlar uchun mos?',
    signals: ['Yangi chiroq yoki bra o‘rnatish', 'Texnika uchun alohida rozetka kerak', 'Avtomat va liniya yangilanadi'],
    faq: [
      ['Materialni kim oladi?', 'Mayda materialni usta tavsiya qiladi yoki kelishuvga qarab olib keladi.'],
      ['Eski uyda ham qilish mumkinmi?', 'Ha, lekin avval yuklama va sim holati tekshiriladi.'],
      ['Bir nechta nuqta bir kunda qilinadimi?', 'Ko‘p holatda ha, ish hajmiga qarab vaqt belgilanadi.'],
    ],
    serviceTags: ['elektr o‘rnatish', 'rozetka', 'svet'],
    relatedLinks: [
      { href: '/yangi-rozetka-ornatish', label: 'Yangi rozetka o‘rnatish', text: 'Aniq rozetka intenti uchun.' },
      { href: '/elektrik-chilonzor', label: 'Elektrik Chilonzor', text: 'Hududiy qidiruv sahifasi.' },
      { href: '/toshkent', label: 'Toshkent xizmatlari', text: 'Boshqa xizmatlarni ko‘rish.' },
    ],
  }),
  '/konditsioner-servis': makeSeoPage({
    demandLayer: 'maintenance',
    service: 'Konditsioner',
    city: 'Toshkent',
    h1: 'Konditsioner servis',
    title: 'Konditsioner servis: tozalash, gaz tekshiruv, narx | UstaFix',
    description:
      'Konditsioner servis qilish, filtr tozalash, gaz bosimini tekshirish va mavsumga tayyorlash uchun ustalar va narx oralig‘i.',
    intro:
      'Bu sahifa mavsum oldidan profilaktika qidirayotgan foydalanuvchilar uchun. Maqsad konditsioner buzilmasidan oldin servisga lead olish.',
    explanationTitle: 'Servis vaqtida nima tekshiriladi?',
    explanation:
      'Filtrlar, radiator, drenaj yo‘li, tashqi blok holati, gaz bosimi va sovutish sifati ko‘riladi. Muntazam servis konditsionerning sovutishini yaxshilaydi va elektr sarfini kamaytiradi.',
    priceRange: 'Taxminan 120 000 - 350 000 so‘m',
    priceNote: 'Tozalash, gaz tekshirish va tashqi blokka chiqish sharoiti narxga ta’sir qiladi.',
    signalsTitle: 'Qachon servis kerak?',
    signals: ['Mavsum boshlanishidan oldin', 'Havo oqimi sustlashgan', 'Ichki blokdan hid keladi'],
    faq: [
      ['Har yili servis kerakmi?', 'Ko‘p ishlatiladigan konditsionerlar uchun yiliga bir marta tavsiya qilinadi.'],
      ['Gaz albatta to‘ldiriladimi?', 'Yo‘q, avval bosim tekshiriladi. Kerak bo‘lsa to‘ldiriladi.'],
      ['Servis qancha davom etadi?', 'Oddiy holatda 40-90 daqiqa atrofida.'],
    ],
    serviceTags: ['konditsioner servis', 'tozalash', 'gaz tekshirish'],
    relatedLinks: [
      { href: '/konditsioner-sovutmayapti', label: 'Konditsioner sovutmayapti', text: 'Agar muammo allaqachon boshlangan bo‘lsa.' },
      { href: '/konditsioner-tamiri', label: 'Konditsioner ta’miri', text: 'Ta’mir va diagnostika sahifasi.' },
      { href: '/toshkent', label: 'Toshkent xizmatlari', text: 'Shahar bo‘yicha xizmatlar.' },
    ],
  }),
  '/uy-remont': makeSeoPage({
    demandLayer: 'maintenance',
    service: 'Remont',
    city: 'Toshkent',
    h1: 'Uy remont',
    title: 'Uy remont: ustalar, brigada va smeta | UstaFix',
    description:
      'Uy remont qilish uchun ustalar, brigada tanlash, ish bosqichlari, taxminiy narx va UstaFix orqali tez bog‘lanish.',
    intro:
      'Bu sahifa kichik ta’mirdan o‘rta hajmdagi uy remontigacha bo‘lgan talabni ushlaydi. Foydalanuvchi hali aniq ustani emas, umumiy yechimni qidirayotgan bo‘ladi.',
    explanationTitle: 'Uy remonti qanday rejalashtiriladi?',
    explanation:
      'Avval ish hajmi, xonalar soni, material darajasi va muddat aniqlanadi. Keyin santexnik, elektrik, pardoz va yakuniy ishlarga bo‘linadi.',
    priceRange: 'Taxminan 150 000 - 900 000 so‘m/m²',
    priceNote: 'Kosmetik remont arzonroq, kapital remont va material sifati narxni keskin o‘zgartiradi.',
    signalsTitle: 'Qaysi ishlar kiradi?',
    signals: ['Devor va pol yangilash', 'Elektr va santexnika nuqtalarini ko‘rish', 'Xonalar bo‘yicha smeta tuzish'],
    faq: [
      ['Smeta oldindan tuziladimi?', 'Ha, ish hajmi ko‘rilgandan keyin bosqichma-bosqich smeta qilinadi.'],
      ['Bitta xonadan boshlash mumkinmi?', 'Ha, kichik hajmdan boshlash mumkin.'],
      ['Materialni kim tanlaydi?', 'Mijoz tanlaydi, usta yoki dizayner texnik tavsiya beradi.'],
    ],
    serviceTags: ['uy remont', 'brigada', 'smeta'],
    relatedLinks: [
      { href: '/uy-ta’mirlash', label: 'Uy ta’mirlash', text: 'Upgrade va yaxshilash intenti uchun.' },
      { href: '/oshxona-remont', label: 'Oshxona remont', text: 'Oshxona alohida loyiha bo‘lsa.' },
      { href: '/hammom-dizayn', label: 'Hammom dizayn', text: 'Hammomni yangilash rejalari uchun.' },
    ],
  }),
  '/santexnika-tekshiruv': makeSeoPage({
    demandLayer: 'maintenance',
    service: 'Santexnik',
    city: 'Toshkent',
    h1: 'Santexnika tekshiruv',
    title: 'Santexnika tekshiruv: quvur, kran, sizib chiqish | UstaFix',
    description:
      'Uy yoki kvartirada santexnika tekshiruvi: quvur, kran, sifon, suv bosimi va yashirin sizib chiqishlarni oldindan ko‘rish.',
    intro:
      'Bu sahifa profilaktika va uy sotib olishdan oldingi tekshiruv kabi rejalangan talabni ushlaydi. Maqsad muammo chiqmasidan oldin ustaga murojaat qilish.',
    explanationTitle: 'Tekshiruvda nimalar ko‘riladi?',
    explanation:
      'Kranlar, sifonlar, quvur ulanishlari, suv bosimi, unitaz mexanizmi va namlik belgisi ko‘riladi. Yashirin sizib chiqishlar erta aniqlansa, katta zarar oldi olinadi.',
    priceRange: 'Taxminan 100 000 - 300 000 so‘m',
    priceNote: 'Tekshiruv hajmi xonalar soni va tizim murakkabligiga bog‘liq.',
    signalsTitle: 'Qachon foydali?',
    signals: ['Yangi uyga ko‘chishdan oldin', 'Ta’mirdan keyin qabul qilishda', 'Pastki qavatga suv o‘tish xavfi bo‘lsa'],
    faq: [
      ['Tekshiruvdan keyin ta’mir ham qilinadimi?', 'Ha, topilgan mayda muammolar kelishuv bilan joyida tuzatilishi mumkin.'],
      ['Yashirin oqishni aniq bilsa bo‘ladimi?', 'Ko‘rinarli belgilar tekshiriladi, murakkab holatda qo‘shimcha diagnostika kerak bo‘ladi.'],
      ['Bu xizmat kimga kerak?', 'Uy egasi, ijarachi yoki yangi kvartira olayotgan odamga.'],
    ],
    serviceTags: ['santexnika tekshiruv', 'profilaktika', 'quvur'],
    relatedLinks: [
      { href: '/kran-tagidan-suv-oqyapti', label: 'Kran tagidan suv oqyapti', text: 'Topilgan sizib chiqish holati uchun.' },
      { href: '/kran-almashtirish', label: 'Kran almashtirish', text: 'Eskirgan kranni yangilash.' },
      { href: '/santexnik-toshkent', label: 'Santexnik Toshkent', text: 'Umumiy santexnik sahifa.' },
    ],
  }),
}

const UPGRADE_PAGES = {
  '/uy-ta’mirlash': makeSeoPage({
    demandLayer: 'upgrade',
    service: 'Remont',
    city: 'Toshkent',
    h1: 'Uy ta’mirlash',
    title: 'Uy ta’mirlash: reja, ustalar va narx | UstaFix',
    description:
      'Uy ta’mirlashni boshlash uchun ustalar, dizayn yondashuvi, smeta, taxminiy narx va bog‘lanish tugmalari.',
    intro:
      'Bu sahifa yaxshilash va yangilash niyatini ushlaydi. Foydalanuvchi buzilgan narsani tuzatishdan ko‘ra, yashash sifatini oshirishni xohlaydi.',
    explanationTitle: 'Uy ta’mirlash nimadan boshlanadi?',
    explanation:
      'Avval maqsad aniqlanadi: kosmetik yangilashmi, xonalarni qayta taqsimlashmi yoki to‘liq kapital ta’mirmi. Shundan keyin ustalar, materiallar va muddat rejalashtiriladi.',
    priceRange: 'Taxminan 180 000 - 1 200 000 so‘m/m²',
    priceNote: 'Dizayn, demontaj, material va muhandislik ishlari narxni belgilaydi.',
    signalsTitle: 'Qanday upgrade ishlari bo‘ladi?',
    signals: ['Interyer ko‘rinishini yangilash', 'Elektr va suv nuqtalarini qayta joylash', 'Material va ranglarni tanlash'],
    faq: [
      ['Uy ta’mirlash va uy remont farqi nimada?', 'Ta’mirlash ko‘proq yaxshilash va rejalashga, remont esa bajariladigan ish hajmiga urg‘u beradi.'],
      ['Dizayn kerakmi?', 'Katta o‘zgarishlarda dizayn va smeta xatoni kamaytiradi.'],
      ['Bosqichma-bosqich qilish mumkinmi?', 'Ha, xonalar bo‘yicha navbat bilan qilish mumkin.'],
    ],
    serviceTags: ['uy ta’mirlash', 'upgrade', 'interyer'],
    relatedLinks: [
      { href: '/uy-remont', label: 'Uy remont', text: 'Remont ishlari va brigada uchun.' },
      { href: '/oshxona-remont', label: 'Oshxona remont', text: 'Eng ko‘p upgrade qilinadigan xona.' },
      { href: '/hammom-dizayn', label: 'Hammom dizayn', text: 'Nam zona dizayni uchun.' },
    ],
  }),
  '/oshxona-remont': makeSeoPage({
    demandLayer: 'upgrade',
    service: 'Remont',
    city: 'Toshkent',
    h1: 'Oshxona remont',
    title: 'Oshxona remont: mebel, plitka, elektr va santexnika | UstaFix',
    description:
      'Oshxona remont qilish uchun ustalar, santexnika va elektr nuqtalari, plitka, mebelga tayyorlash va taxminiy narxlar.',
    intro:
      'Oshxona remonti oddiy devor bo‘yashdan ko‘ra murakkabroq: suv, elektr, mebel o‘lchami va pardoz bir-biriga bog‘langan. Bu sahifa shu niyatni alohida ushlaydi.',
    explanationTitle: 'Oshxona remontida nimalar muhim?',
    explanation:
      'Rakvina joyi, rozetkalar soni, gaz yoki elektr plita, yoritish, plitka va mebel o‘lchami oldindan kelishiladi. Rejasiz ish keyin qayta buzishga olib kelishi mumkin.',
    priceRange: 'Taxminan 2 500 000 - 18 000 000 so‘m',
    priceNote: 'Narx oshxona maydoni, plitka, elektr nuqtalari va mebelga tayyorlash hajmiga bog‘liq.',
    signalsTitle: 'Oshxona upgrade belgilari',
    signals: ['Rozetka yetishmaydi', 'Eski plitka va rakvina noqulay', 'Mebel o‘lchami bilan kommunikatsiya mos emas'],
    faq: [
      ['Avval mebelmi yoki remontmi?', 'Odatda mebel rejasini oldin bilish kerak, keyin elektr va suv nuqtalari qo‘yiladi.'],
      ['Santexnik va elektrik birga kerak bo‘ladimi?', 'Ha, oshxona remontida ikkala yo‘nalish ham ko‘p uchraydi.'],
      ['Kichik oshxona ham qilinadimi?', 'Ha, kichik maydonda reja yanada muhim bo‘ladi.'],
    ],
    serviceTags: ['oshxona remont', 'plitka', 'mebel'],
    relatedLinks: [
      { href: '/yangi-rozetka-ornatish', label: 'Yangi rozetka o‘rnatish', text: 'Oshxona texnikasi uchun alohida nuqta.' },
      { href: '/kran-almashtirish', label: 'Kran almashtirish', text: 'Rakvina va kran yangilash uchun.' },
      { href: '/uy-ta’mirlash', label: 'Uy ta’mirlash', text: 'Kengroq upgrade rejasi.' },
    ],
  }),
  '/hammom-dizayn': makeSeoPage({
    demandLayer: 'upgrade',
    service: 'Dizayn',
    city: 'Toshkent',
    h1: 'Hammom dizayn',
    title: 'Hammom dizayn va remont: reja, narx, ustalar | UstaFix',
    description:
      'Hammom dizayn qilish, plitka, santexnika joylashuvi, dush zona va ta’mir ustalarini topish uchun UstaFix sahifasi.',
    intro:
      'Hammom upgrade talabi dizayn, santexnika va namlik xavfini birlashtiradi. Shu sababli sahifa faqat remont emas, reja va joylashuvga ham javob beradi.',
    explanationTitle: 'Hammom dizaynida nimalar hisobga olinadi?',
    explanation:
      'Dush yoki vanna joyi, unitaz, rakovina, shamollatish, gidroizolyatsiya va plitka o‘lchami oldindan ko‘riladi. Noto‘g‘ri reja keyin sizib chiqish va noqulaylik keltiradi.',
    priceRange: 'Taxminan 3 000 000 - 25 000 000 so‘m',
    priceNote: 'Maydon, plitka darajasi, santexnika brendi va gidroizolyatsiya narxga katta ta’sir qiladi.',
    signalsTitle: 'Qachon dizayn kerak?',
    signals: ['Hammom juda tor yoki noqulay', 'Santexnika joyini o‘zgartirish rejalanyapti', 'Plitka va rang bo‘yicha qaror qiyin'],
    faq: [
      ['Dizayn alohida, remont alohidami?', 'Kelishuvga qarab alohida reja yoki to‘liq bajarish mumkin.'],
      ['Gidroizolyatsiya majburiymi?', 'Hammomda juda tavsiya qilinadi, chunki suv xavfi yuqori.'],
      ['Kichik hammomga ham dizayn kerakmi?', 'Ha, kichik joyda har santimetr muhim.'],
    ],
    serviceTags: ['hammom dizayn', 'plitka', 'gidroizolyatsiya'],
    relatedLinks: [
      { href: '/uy-ta’mirlash', label: 'Uy ta’mirlash', text: 'Umumiy interyer yangilash.' },
      { href: '/santexnika-tekshiruv', label: 'Santexnika tekshiruv', text: 'Ishdan oldin tizimni ko‘rish.' },
      { href: '/kran-almashtirish', label: 'Kran almashtirish', text: 'Rakvina va kran yangilash.' },
    ],
  }),
  '/yangi-rozetka-ornatish': makeSeoPage({
    demandLayer: 'upgrade',
    service: 'Elektrik',
    city: 'Toshkent',
    h1: 'Yangi rozetka o‘rnatish',
    title: 'Yangi rozetka o‘rnatish: elektrik, narx va xavfsizlik | UstaFix',
    description:
      'Yangi rozetka o‘rnatish, qo‘shimcha elektr nuqta chiqarish, texnika uchun alohida liniya va Toshkentdagi elektrik ustalar.',
    intro:
      'Bu upgrade sahifasi yangi texnika, oshxona, ish stoli yoki konditsioner uchun qo‘shimcha rozetka kerak bo‘lganda lead oladi.',
    explanationTitle: 'Yangi rozetka qanday o‘rnatiladi?',
    explanation:
      'Usta mavjud liniya yuklamasini tekshiradi, rozetka joyini belgilaydi, kabel yo‘lini tanlaydi va xavfsiz ulanishni sinaydi. Kuchli texnika uchun alohida liniya kerak bo‘lishi mumkin.',
    priceRange: 'Taxminan 100 000 - 400 000 so‘m',
    priceNote: 'Narx devor turi, kabel masofasi va alohida avtomat kerakligiga qarab farq qiladi.',
    signalsTitle: 'Qachon yangi rozetka kerak?',
    signals: ['Uzatgichlardan ko‘p foydalanilyapti', 'Yangi texnika qo‘yildi', 'Oshxona yoki ish joyi qayta rejalanyapti'],
    faq: [
      ['Mavjud rozetkadan ulash xavfsizmi?', 'Yuklama yetarli bo‘lsa mumkin, aks holda alohida liniya kerak.'],
      ['Devor buziladimi?', 'Yashirin kabel uchun kesish bo‘lishi mumkin, tashqi kabel-kanal ham variant.'],
      ['Konditsioner uchun oddiy rozetka bo‘ladimi?', 'Model quvvatiga qarab alohida liniya tavsiya qilinishi mumkin.'],
    ],
    serviceTags: ['yangi rozetka', 'elektrik', 'upgrade'],
    relatedLinks: [
      { href: '/elektrik-ornatish', label: 'Elektrik o‘rnatish', text: 'Umumiy elektr montaj ishlari.' },
      { href: '/elektrik-chilonzor', label: 'Elektrik Chilonzor', text: 'Hududiy elektrik sahifasi.' },
      { href: '/oshxona-remont', label: 'Oshxona remont', text: 'Rozetka rejalash ko‘p kerak bo‘ladigan xona.' },
    ],
  }),
}

const PAGE_DEFINITIONS = {
  ...SERVICE_PAGES,
  ...PROBLEM_PAGES,
  ...MAINTENANCE_PAGES,
  ...UPGRADE_PAGES,
  '/': HOME_PAGE,
}

const SERVICE_CARDS = [
  {
    href: '/kran-oqyapti',
    title: 'Emergency xizmatlar',
    text: 'Kran oqishi, sovutmayotgan konditsioner va shoshilinch muammolar.',
  },
  {
    href: '/kran-almashtirish',
    title: 'Maintenance xizmatlar',
    text: 'Kran almashtirish, servis, tekshiruv va rejali ta’mir ishlari.',
  },
  {
    href: '/uy-ta’mirlash',
    title: 'Upgrade xizmatlar',
    text: 'Uy, oshxona, hammom va yangi rozetka kabi yaxshilash ishlari.',
  },
  {
    href: '/santexnik-toshkent',
    title: 'Local SEO sahifalar',
    text: 'Toshkent, Chilonzor va keyingi hududlar uchun xizmat sahifalari.',
  },
]

const TRUST_POINTS = [
  {
    title: 'Qidiruvga mos kontent',
    text: 'Har sahifa o‘z H1, description va ichki linklari bilan tayyor.',
  },
  {
    title: 'Lead-first dizayn',
    text: 'Call va forma birinchi o‘rinda, ortiqcha marketplace vazifalari yo‘q.',
  },
  {
    title: 'Firebase saqlash',
    text: 'Faqat requestlar `requests` collection’iga tushadi.',
  },
]

function getPage(pathname) {
  if (pathname in PAGE_DEFINITIONS) {
    return PAGE_DEFINITIONS[pathname]
  }

  return {
    kind: 'notfound',
    title: 'Sahifa topilmadi - UstaFix',
    description: 'UstaFix sahifasi topilmadi. Bosh sahifaga qayting.',
    intro: 'Siz izlagan sahifa mavjud emas yoki keyinroq qo‘shiladi.',
    bullets: ['Bosh sahifaga qayting', 'Xizmat sahifalarini ko‘ring', 'Lead qoldiring'],
    faq: [],
    serviceTags: [],
  }
}

function normalizeWorker(worker) {
  const phone = worker.phone || worker.contactPhone || ''
  const phoneDigits = phone.replace(/\s+/g, '')

  return {
    id: worker.id || phoneDigits || worker.name,
    name: worker.name || 'Usta',
    service: worker.service || worker.category || 'Xizmat',
    city: worker.city || worker.region || 'Toshkent',
    area: worker.area || worker.district || '',
    phone,
    telegram: worker.telegram || worker.telegramUrl || '',
    whatsapp:
      worker.whatsapp ||
      (phoneDigits ? `https://wa.me/${phoneDigits.replace(/^\+/, '')}` : ''),
    rating: Number(worker.rating ?? 5),
    reviews: Number(worker.reviews ?? 0),
    available: worker.available ?? true,
    skills: Array.isArray(worker.skills) ? worker.skills : [],
    bio: worker.bio || worker.description || '',
  }
}

function WorkerCard({ worker }) {
  const phoneHref = `tel:${worker.phone.replace(/\s+/g, '')}`

  return (
    <article className="worker-card">
      <div className="worker-card__top">
        <div>
          <span className="worker-chip">{worker.service}</span>
          <h3>{worker.name}</h3>
          <p className="worker-meta">
            {worker.city}
            {worker.area ? ` · ${worker.area}` : ''}
          </p>
        </div>
        <span className={`status-badge ${worker.available ? 'online' : 'busy'}`}>
          {worker.available ? 'Ushbu hafta bor' : 'Band'}
        </span>
      </div>

      <p className="worker-bio">{worker.bio || 'Tez bog‘lanish uchun tayyor usta.'}</p>

      <div className="rating-row" aria-label="Worker rating">
        <strong>{worker.rating.toFixed(1)}</strong>
        <span>• {worker.reviews} ta fikr</span>
      </div>

      <div className="skill-row">
        {worker.skills.map((skill) => (
          <span key={skill} className="skill-pill">
            {skill}
          </span>
        ))}
      </div>

      <div className="worker-actions">
        <a className="primary-btn" href={phoneHref}>
          Qo‘ng‘iroq
        </a>
        {worker.whatsapp ? (
          <a className="secondary-btn" href={worker.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        ) : null}
        {worker.telegram ? (
          <a className="secondary-btn" href={worker.telegram} target="_blank" rel="noreferrer">
            Telegram
          </a>
        ) : null}
      </div>
    </article>
  )
}

function WorkerDirectory({ page, workers, workersStatus, workersMessage }) {
  const defaultWorkerFilter = page.workerFilter || {}
  const [serviceFilter, setServiceFilter] = useState(defaultWorkerFilter.service || (page.kind === 'home' ? 'Barchasi' : page.service || 'Barchasi'))
  const [cityFilter, setCityFilter] = useState(defaultWorkerFilter.city || page.city || 'Toshkent')

  const workerFilters = SERVICE_OPTIONS.map((service) => ({ label: service, value: service }))
  const cityFilters = ['Toshkent', 'Samarqand', 'Fargona', 'Buxoro']
  const filteredWorkers = workers.filter((worker) => {
    const serviceMatches = serviceFilter === 'Barchasi' || worker.service === serviceFilter
    const cityMatches = cityFilter ? worker.city === cityFilter : true
    const areaMatches = defaultWorkerFilter.area ? worker.area === defaultWorkerFilter.area : true
    return serviceMatches && cityMatches && areaMatches
  })

  return (
    <section className="content-band">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Ustalar</span>
          <h2>Haqiqiy odamlar bilan bog‘laning</h2>
          <p>
            Foydalanuvchi xizmatni tanlaydi, filtrlardan o‘tadi va to‘g‘ridan-to‘g‘ri ustaga qo‘ng‘iroq qiladi yoki xabar yozadi.
            {defaultWorkerFilter.area ? ` Bu sahifa ${defaultWorkerFilter.area} hududidagi ustalarni ko‘rsatishga ham yo‘naltirilgan.` : ''}
          </p>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <span>Xizmat</span>
            <div className="filter-pills">
              {workerFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={`filter-pill ${serviceFilter === filter.value ? 'active' : ''}`}
                  onClick={() => setServiceFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span>Shahar</span>
            <div className="filter-pills">
              {cityFilters.map((city) => (
                <button
                  key={city}
                  type="button"
                  className={`filter-pill ${cityFilter === city ? 'active' : ''}`}
                  onClick={() => setCityFilter(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {workersMessage ? <p className="workers-note">{workersMessage}</p> : null}

        <div className="worker-grid">
          {workersStatus === 'loading' ? (
            <div className="worker-skeleton">Ustalar yuklanmoqda...</div>
          ) : filteredWorkers.length > 0 ? (
            filteredWorkers.map((worker) => <WorkerCard key={worker.id} worker={worker} />)
          ) : (
            <div className="worker-empty">
              Tanlangan filtrlar uchun usta topilmadi. Boshqa xizmat yoki shaharni sinab ko‘ring.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function SeoProblemSection({ page }) {
  if (!page.priceRange || !page.explanation) {
    return null
  }

  const signals = page.signals || []

  return (
    <section className="content-band alt">
      <div className="container split-grid">
        <div className="section-head compact">
          <span className="eyebrow">Muammo tahlili</span>
          <h2>{page.explanationTitle || 'Muammo qanday hal qilinadi?'}</h2>
          <p>{page.explanation}</p>
        </div>

        <div className="price-card">
          <span className="eyebrow">Taxminiy narx</span>
          <strong>{page.priceRange}</strong>
          <p>{page.priceNote || 'Narx ish hajmi va hududga qarab o‘zgaradi.'}</p>
        </div>
      </div>

      {signals.length > 0 ? (
        <div className="container signal-grid">
          <div className="section-head compact">
            <span className="eyebrow">{page.signalsTitle || 'Belgilari'}</span>
            <h2>Nimani sezish mumkin?</h2>
          </div>
          <div className="signal-list">
            {signals.map((signal) => (
              <article key={signal} className="signal-card">
                {signal}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

function RelatedLinksSection({ page }) {
  const relatedLinks = page.relatedLinks || []

  if (relatedLinks.length === 0) {
    return null
  }

  return (
    <section className="content-band">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Ichki linklar</span>
          <h2>Yaqin qidiruvlar</h2>
          <p>Bu sahifadan foydalanuvchi o‘xshash muammolar yoki hududiy sahifalarga o‘tishi mumkin.</p>
        </div>
        <div className="related-grid">
          {relatedLinks.map((link) => (
            <a key={link.href} className="related-card" href={link.href}>
              <strong>{link.label}</strong>
              <span>{link.text}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function LeadFormCard({ page, pathname }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    service: page.kind === 'home' ? 'Barchasi' : page.service || 'Santexnik',
    city: page.city || 'Toshkent',
    problem: '',
  })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submitLead = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.phone.trim() || !form.problem.trim()) {
      setStatus('error')
      setMessage("Ism, telefon va muammo maydonlarini to'ldiring.")
      return
    }

    setStatus('sending')
    setMessage('')

    try {
      const { createRequest } = await import('./firebase/requests')
      await createRequest({
        ...form,
        phone: form.phone.replace(/\s+/g, ''),
        sourcePath: pathname,
        pageKind: page.kind,
      })
      setStatus('success')
      setMessage('Murojaat qabul qilindi. Tez orada bog‘lanamiz.')
      setForm((current) => ({
        ...current,
        name: '',
        phone: '',
        problem: '',
      }))
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('Firebasega yozishda xatolik. Config va rules ni tekshiring.')
    }
  }

  return (
    <div className="request-card" id="lead-form">
      <div className="section-head compact">
        <span className="eyebrow">Buyurtma</span>
        <h2>Formani yuboring</h2>
        <p>Qaysi xizmat kerakligini yozing, biz leadni saqlaymiz va mos usta bilan bog‘lashga tayyorlaymiz.</p>
      </div>

      <form className="request-form" onSubmit={submitLead}>
        <label>
          Ism
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ismingiz" />
        </label>

        <label>
          Telefon
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+998 90 123 45 67" />
        </label>

        <div className="two-up">
          <label>
            Xizmat
            <select value={form.service} onChange={(event) => setForm({ ...form, service: event.target.value })}>
              {SERVICE_OPTIONS.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </label>

          <label>
            Shahar
            <select value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })}>
              <option value="Toshkent">Toshkent</option>
              <option value="Samarqand">Samarqand</option>
              <option value="Fargona">Fargona</option>
              <option value="Buxoro">Buxoro</option>
            </select>
          </label>
        </div>

        <label>
          Muammo
          <textarea
            rows="5"
            value={form.problem}
            onChange={(event) => setForm({ ...form, problem: event.target.value })}
            placeholder="Masalan: kran oqyapti, svet uzilib qoldi, konditsioner sovutmayapti..."
          />
        </label>

        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Yuborilmoqda...' : 'Lead yuborish'}
        </button>

        {message ? <p className={`status-message ${status}`}>{message}</p> : null}
      </form>
    </div>
  )
}

function usePathname() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (href) => {
    if (href === window.location.pathname) return
    window.history.pushState({}, '', href)
    setPathname(href)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return [pathname, navigate]
}

function SeoHead({ page, path }) {
  useEffect(() => {
    document.title = page.title

    const setMeta = (selector, attr, value) => {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        if (selector.includes('property')) {
          element.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '')
        }
        if (selector.includes('name')) {
          element.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '')
        }
        document.head.appendChild(element)
      }
      element.setAttribute(attr, value)
    }

    const canonical = document.head.querySelector('link[rel="canonical"]') || document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', `${SITE_URL}${path}`)
    if (!canonical.parentNode) document.head.appendChild(canonical)

    setMeta('meta[name="description"]', 'name', 'description')
    document.head.querySelector('meta[name="description"]').setAttribute('content', page.description)

    const ogTitle = document.head.querySelector('meta[property="og:title"]') || document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title')
    ogTitle.setAttribute('content', page.title)
    if (!ogTitle.parentNode) document.head.appendChild(ogTitle)

    const ogDesc = document.head.querySelector('meta[property="og:description"]') || document.createElement('meta')
    ogDesc.setAttribute('property', 'og:description')
    ogDesc.setAttribute('content', page.description)
    if (!ogDesc.parentNode) document.head.appendChild(ogDesc)

    const ogUrl = document.head.querySelector('meta[property="og:url"]') || document.createElement('meta')
    ogUrl.setAttribute('property', 'og:url')
    ogUrl.setAttribute('content', `${SITE_URL}${path}`)
    if (!ogUrl.parentNode) document.head.appendChild(ogUrl)

    const twitterCard = document.head.querySelector('meta[name="twitter:card"]') || document.createElement('meta')
    twitterCard.setAttribute('name', 'twitter:card')
    twitterCard.setAttribute('content', 'summary_large_image')
    if (!twitterCard.parentNode) document.head.appendChild(twitterCard)

    const jsonLdId = 'ustafix-jsonld'
    const existing = document.head.querySelector(`script#${jsonLdId}`)
    if (existing) existing.remove()

    const schema =
      page.kind === 'home'
        ? {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'UstaFix',
            url: `${SITE_URL}${path}`,
            areaServed: 'Uzbekistan',
            description: page.description,
            serviceType: 'Home repair lead generation',
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: page.title,
            url: `${SITE_URL}${path}`,
            description: page.description,
            provider: {
              '@type': 'Organization',
              name: 'UstaFix',
              url: SITE_URL,
            },
          }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = jsonLdId
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  }, [page, path])

  return null
}

function navigateTo(navigate, href) {
  return (event) => {
    event.preventDefault()
    navigate(href)
  }
}

function App() {
  const [pathname, navigate] = usePathname()
  const page = useMemo(() => getPage(pathname), [pathname])
  const [workers, setWorkers] = useState(DEFAULT_WORKERS)
  const [workersStatus, setWorkersStatus] = useState('loading')
  const [workersMessage, setWorkersMessage] = useState('')

  useEffect(() => {
    let isActive = true

    const loadWorkers = async () => {
      try {
        const { getWorkers } = await import('./firebase/workers')
        const remoteWorkers = await getWorkers()
        if (!isActive) return

        const normalizedWorkers = remoteWorkers.map(normalizeWorker)
        setWorkers(normalizedWorkers.length > 0 ? normalizedWorkers : DEFAULT_WORKERS)
        setWorkersStatus('ready')
        setWorkersMessage(normalizedWorkers.length > 0 ? '' : 'Hozircha demo ustalar ko‘rsatilmoqda.')
      } catch (error) {
        console.error(error)
        if (!isActive) return

        setWorkers(DEFAULT_WORKERS)
        setWorkersStatus('fallback')
        setWorkersMessage('Firebase ulanmagan, demo ustalar ko‘rsatilmoqda.')
      }
    }

    loadWorkers()

    return () => {
      isActive = false
    }
  }, [])

  const pageFaq = page.faq || []
  const pageBullets = page.bullets || []
  const serviceTags = page.serviceTags || []

  return (
    <main>
      <SeoHead page={page} path={pathname} />

      <header className="topbar">
        <button className="brand" onClick={() => navigate('/')}>UstaFix</button>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={navigateTo(navigate, item.href)}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="call-pill" href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}>Qo‘ng‘iroq</a>
      </header>

      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">SEO-first xizmat sayti</span>
            <h1>{page.h1 || page.title}</h1>
            <p className="lead">{page.description}</p>
            <p className="sublead">{page.intro}</p>

            <div className="action-row">
              <a className="primary-btn" href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}>Telefon qilish</a>
              <a className="secondary-btn" href={TELEGRAM_URL}>Telegram</a>
              <a className="secondary-btn" href={WHATSAPP_URL}>WhatsApp</a>
            </div>

            <div className="tag-row">
              {serviceTags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <img src={heroArt} alt="UstaFix xizmatlar vizuali" />
            <div className="visual-card">
              <strong>Qidiruvdan kelgan mijoz</strong>
              <span>Bir klikda aloqa yoki forma</span>
            </div>
          </div>
        </div>
      </section>

      <section className="strip">
        <div className="container strip-grid">
          <div>
            <strong>Qidiruvga mos</strong>
            <span>Har sahifa alohida so‘z birikmalariga tayyor.</span>
          </div>
          <div>
            <strong>Tez aloqa</strong>
            <span>Telefon, Telegram va WhatsApp linklari tayyor.</span>
          </div>
          <div>
            <strong>Lead capture</strong>
            <span>Firestore requests collection’iga yoziladi.</span>
          </div>
        </div>
      </section>

      <section className="content-band">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Xizmatlar</span>
            <h2>Odamlar qidiradigan sahifalar va ustalar</h2>
            <p>
              Biz marketplace murakkabligini kamaytirdik. Public tomonda search-friendly sahifalar, ustalar ro‘yxati va leadga olib boradigan CTA qoldi.
            </p>
          </div>
          <div className="card-grid">
            {SERVICE_CARDS.map((item) => (
              <a key={item.href} className="info-card" href={item.href} onClick={navigateTo(navigate, item.href)}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {pageBullets.length > 0 ? (
        <section className="content-band alt">
          <div className="container">
            <div className="section-head compact">
              <span className="eyebrow">Nima qilamiz</span>
              <h2>Asosiy ishlar</h2>
            </div>
            <div className="bullet-grid">
              {pageBullets.map((bullet) => (
                <div key={bullet} className="bullet-card">
                  {bullet}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SeoProblemSection page={page} />

      <WorkerDirectory
        key={pathname}
        page={page}
        pathname={pathname}
        workers={workers}
        workersStatus={workersStatus}
        workersMessage={workersMessage}
      />

      <RelatedLinksSection page={page} />

      <section className="content-band alt">
        <div className="container split-grid">
          <div className="section-head compact">
            <span className="eyebrow">Nega UstaFix</span>
            <h2>Local SEO uchun kerakli tuzilma</h2>
            <p>
              Bu saytda shahar, xizmat va kontakt yo‘llari ajratilgan. Bu Google uchun ancha toza va o‘qilishi oson struktura beradi.
            </p>
          </div>
          <div className="trust-list">
            {TRUST_POINTS.map((item) => (
              <article key={item.title} className="trust-card">
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-band">
        <div className="container split-grid">
          <div>
            <div className="section-head compact">
              <span className="eyebrow">Qanday ishlaydi</span>
              <h2>Call-first yo‘l</h2>
            </div>
            <ol className="steps">
              <li>
                <strong>1. Qidiring yoki tanlang</strong>
                <span>Odam Google’dan xizmat sahifasini topadi.</span>
              </li>
              <li>
                <strong>2. Bog‘lanadi</strong>
                <span>Telefon, Telegram yoki WhatsApp orqali aloqa qiladi.</span>
              </li>
              <li>
                <strong>3. Lead tushadi</strong>
                <span>Forma to‘ldirilsa Firestore’ga saqlanadi.</span>
              </li>
            </ol>
          </div>

          <LeadFormCard key={pathname} page={page} pathname={pathname} />
        </div>
      </section>

      {pageFaq.length > 0 ? (
        <section className="content-band alt">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>Ko‘p so‘raladigan savollar</h2>
            </div>
            <div className="faq-list">
              {pageFaq.map(([question, answer]) => (
                <details key={question} className="faq-item">
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="content-band">
        <div className="container footer-cta">
          <div>
            <span className="eyebrow">Kontakt</span>
            <h2>UstaFix bilan tez bog‘laning</h2>
            <p>
              Telefon, Telegram yoki WhatsApp orqali murojaat qiling. Lead form esa Firestore’da saqlanadi va keyin ustaga biriktiriladi.
            </p>
          </div>
          <div className="action-column">
            <a className="primary-btn" href={`tel:${PHONE_NUMBER.replace(/\s+/g, '')}`}>Qo‘ng‘iroq qilish</a>
            <a className="secondary-btn dark" href={TELEGRAM_URL}>Telegram</a>
            <a className="secondary-btn dark" href={WHATSAPP_URL}>WhatsApp</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <strong>UstaFix</strong>
            <p>O‘zbekistonda uy ta’miri xizmatlari uchun SEO-first lead sayti.</p>
          </div>
          <div className="footer-links">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={navigateTo(navigate, item.href)}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
