export const SHISHA_CATEGORIES = [
  { id: 'all', nameEn: 'All Items & Services', nameAr: 'جميع المنتجات والخدمات' },
  { id: 'parlor', nameEn: 'Parlor Lounge Service', nameAr: 'خدمة المجلس والصالة' },
  { id: 'pots', nameEn: 'Hookah Pots (For Sale)', nameAr: 'شيشة وشيشات للبيع' },
  { id: 'flavors', nameEn: 'Flavor Packs (50g/250g)', nameAr: 'علب نكهات ومعسل' },
  { id: 'coals', nameEn: 'Charcoal & Accessories', nameAr: 'فحم ومستلزمات' },
  { id: 'rentals', nameEn: 'Hookah Pot Rentals', nameAr: 'تأجير شيشة للمنازل' },
  { id: 'catering', nameEn: 'Hookah Party Catering', nameAr: 'تنظيم حفلات شيشة' }
];

export const BRANDS_LIST = [
  'All Brands',
  'Russian',
  'Maya',
  'Al-Akbar',
  'Coco-Aya',
  'Afzal',
  'Afreen',
  'Soex',
  'Al-Abrah',
  'Al-Fakher',
  'Al-Afandi',
  'Bonchi',
  'Nina'
];

export const RENTAL_POT_MODELS = [
  {
    id: 'rent_russian',
    brand: 'Russian',
    nameEn: 'Russian Stealth Carbon Hookah Pot',
    nameAr: 'شيشة روسية كربون ستيلث',
    dailyRate: 65,
    deposit: 150,
    image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80',
    descriptionEn: 'High-end Russian carbon fiber stem with magnetic hose adapter & silent diffuser.',
    descriptionAr: 'أنبوب فحم كربوني روسي فاخر مع محول خرطوم مغناطيسي ومكاتم صوت.'
  },
  {
    id: 'rent_maya',
    brand: 'Maya',
    nameEn: 'Maya Compact Brass Hookah Pot',
    nameAr: 'شيشة مايا نحاسية مدمجة',
    dailyRate: 45,
    deposit: 100,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    descriptionEn: 'Ultra-portable Maya brass stem with unbreakable acrylic base. Perfect for outdoor trips.',
    descriptionAr: 'شيشة مايا نحاسية سهلة الحمل مع قاعدة أكريليك غير قابلة للكسر.'
  },
  {
    id: 'rent_alakbar',
    brand: 'Al-Akbar',
    nameEn: 'Al-Akbar Royal Gold Hookah Pot',
    nameAr: 'شيشة الأكبر الملكية الذهبية',
    descriptionEn: 'Traditional hand-engraved brass pot with bohemian crystal base.',
    descriptionAr: 'شيشة الأكبر التقليدية المنقوشة يدوياً مع قاعدة كريستالية.',
    dailyRate: 85,
    deposit: 200,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'rent_cocoaya',
    brand: 'Coco-Aya',
    nameEn: 'Coco-Aya LED Neon Hookah Pot',
    nameAr: 'شيشة كوكو آيا مع إضاءة ليد',
    dailyRate: 75,
    deposit: 150,
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=600&q=80',
    descriptionEn: 'Modern square acrylic pot with remote-controlled multi-color LED light base.',
    descriptionAr: 'شيشة مربعة حديثة مع قاعدة إضاءة ليد متعددة الألوان بجهاز تحكم.'
  }
];

export const PARTY_PACKAGES = [
  {
    id: 'party_express',
    nameEn: 'Express House Party (3 Pots)',
    nameAr: 'حزمة الحفلات المصغرة (3 شيشة)',
    potsCount: 3,
    basePrice: 290,
    descriptionEn: 'Includes 3 Premium Hookah Pots, 3 Flavor Boxes, 1 Charcoal Box & Disposable Hoses.',
    descriptionAr: 'تتضمن 3 شيشات فاخرة، 3 علب نكهات، علبة فحم وخرايم استهلاك مرة واحدة.',
    attendantOption: false,
    recommendedFor: '5 - 12 Guests'
  },
  {
    id: 'party_gold',
    nameEn: 'Gold Sultan Party Catering (6 Pots)',
    nameAr: 'حفلة السلطان الذهبية (6 شيشة)',
    potsCount: 6,
    basePrice: 590,
    descriptionEn: 'Includes 6 Hookah Pots, 6 Flavor Boxes, 2 Coal Boxes & 1 On-Site Coal Master Attendant for 4 Hours.',
    descriptionAr: 'تتضمن 6 شيشات، 6 نكهات، 2 علب فحم مع خادم فحم متخصص لمدة 4 ساعات.',
    attendantOption: true,
    recommendedFor: '15 - 30 Guests'
  },
  {
    id: 'party_vip',
    nameEn: 'VIP Diamond Mega Celebration (12 Pots)',
    nameAr: 'احتفال الألماس الملكي (12 شيشة)',
    potsCount: 12,
    basePrice: 1150,
    descriptionEn: 'Complete wedding/event lounge setup with 12 Pots, Fruit Bowl Upgrades & 2 Master Attendants.',
    descriptionAr: 'تجهيز كامل للحفلات الكبيرة والأعراس مع 12 شيشة ورؤوس أناناس و2 خادم فحم.',
    attendantOption: true,
    recommendedFor: '30 - 80 Guests'
  }
];

export const SHISHA_FLAVORS_MASTER = [
  { id: 'f1', nameEn: 'Pan Raas (Afzal)', nameAr: 'بان راس أفضال', brand: 'Afzal', profile: 'Spiced & Paan', stock: 25, color: '#2a9d8f' },
  { id: 'f2', nameEn: 'Double Apple (Al-Fakher)', nameAr: 'تفاحتين الفاخر', brand: 'Al-Fakher', profile: 'Fruity & Sweet', stock: 40, color: '#e63946' },
  { id: 'f3', nameEn: 'Bombay Paan (Afzal)', nameAr: 'بومباي بان أفضال', brand: 'Afzal', profile: 'Spiced & Cool', stock: 15, color: '#457b9d' },
  { id: 'f4', nameEn: 'Herbal Mint (Soex Tobacco-Free)', nameAr: 'نعناع عشب سويكس خالي من التبغ', brand: 'Soex', profile: 'Minty & Cool', stock: 30, color: '#2a9d8f' },
  { id: 'f5', nameEn: 'Royal Grape (Al-Abrah)', nameAr: 'عنب ملكي العبرة', brand: 'Al-Abrah', profile: 'Fruity & Sweet', stock: 18, color: '#6a0572' },
  { id: 'f6', nameEn: 'Icy Watermelon (Maya)', nameAr: 'بطيخ مثلج مايا', brand: 'Maya', profile: 'Sweet & Cooling', stock: 12, color: '#f4a261' },
  { id: 'f7', nameEn: 'Spiced Arabic Night (Afreen)', nameAr: 'ليالي عربية أفرين', brand: 'Afreen', profile: 'Spiced', stock: 10, color: '#e76f51' }
];

export const BOWL_UPGRADES = [
  { id: 'b_standard', nameEn: 'Standard Clay Bowl', nameAr: 'رأس فخار كلاسيكي', price: 0 },
  { id: 'b_pineapple', nameEn: 'Fresh Pineapple Head', nameAr: 'رأس أناناس طبيعي', price: 35 },
  { id: 'b_grapefruit', nameEn: 'Grapefruit Citrus Bowl', nameAr: 'رأس غريب فروت حمضي', price: 25 },
  { id: 'b_watermelon', nameEn: 'Half Watermelon Bowl', nameAr: 'رأس نصف بطيخة', price: 45 }
];

export const BASE_LIQUIDS = [
  { id: 'l_water', nameEn: 'Filtered Ice Water', nameAr: 'ماء مثلج مصفى', price: 0 },
  { id: 'l_mint', nameEn: 'Mint & Lemon Infused Water', nameAr: 'ماء منقوع بالنعناع والليمون', price: 15 },
  { id: 'l_milk', nameEn: 'Vanilla Milk Base', nameAr: 'حليب الفانيليا الثقيل', price: 20 }
];

export const SHISHA_ITEMS = [
  // 1. Parlor Service Sessions
  {
    id: 'item_1',
    category: 'parlor',
    brand: 'Afzal',
    nameEn: 'Afzal Pan Raas Parlor Session',
    nameAr: 'جلسة بان راس أفضال بالمجلس',
    descriptionEn: 'Original Afzal Pan Raas served in a Russian Carbon Pot with ice hose attachment.',
    descriptionAr: 'معسل بان راس أفضال الأصلي يقدم في شيشة روسية كربون مع خرطوم آيس.',
    price: 85,
    rating: 4.9,
    stockStatus: 'in_stock',
    stockQty: 25,
    strength: 'Strong',
    profile: 'Spiced & Paan',
    badge: 'Shop Favorite',
    image: ''
  },
  {
    id: 'item_2',
    category: 'parlor',
    brand: 'Al-Fakher',
    nameEn: 'Al-Fakher Double Apple Parlor Special',
    nameAr: 'تفاحتين الفاخر جلسة الصالة',
    descriptionEn: 'Traditional Al-Fakher double apple served in a Pineapple head with natural Coco-Aya coals.',
    descriptionAr: 'تفاحتين الفاخر التقليدي في رأس أناناس طبيعي وفحم كوكو آيا.',
    price: 110,
    rating: 4.8,
    stockStatus: 'in_stock',
    stockQty: 18,
    strength: 'Medium',
    profile: 'Fruity & Sweet',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80'
  },

  // 2. Hookah Pots for Sale
  {
    id: 'pot_1',
    category: 'pots',
    brand: 'Russian',
    nameEn: 'Russian Stainless Carbon Hookah Pot (For Sale)',
    nameAr: 'شيشة روسية كربون ستانلس ستيل (للبيع)',
    descriptionEn: 'Full set includes Russian carbon stem, crystal vase, silicone hose & aluminum handle.',
    descriptionAr: 'طقم كامل يشمل الشيشة الروسية، الفازة الكريستال، الخرطوم السيليكون والمقبض.',
    price: 490,
    rating: 5.0,
    stockStatus: 'in_stock',
    stockQty: 6,
    strength: 'N/A',
    profile: 'Hardware',
    badge: 'Top Hardware',
    image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pot_2',
    category: 'pots',
    brand: 'Maya',
    nameEn: 'Maya Compact Brass Hookah Set (For Sale)',
    nameAr: 'طقم شيشة مايا نحاس مدمج (للبيع)',
    descriptionEn: 'Durable brass body, acrylic base, complete carrying case & stainless tongs.',
    descriptionAr: 'شيشة مايا النحاسية مع حقيبة نقل كاملة ومقشة الفحم.',
    price: 280,
    rating: 4.7,
    stockStatus: 'low_stock',
    stockQty: 2,
    strength: 'N/A',
    profile: 'Hardware',
    badge: 'Portable',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pot_3',
    category: 'pots',
    brand: 'Al-Akbar',
    nameEn: 'Al-Akbar Traditional Brass Hookah Pot',
    nameAr: 'شيشة الأكبر النحاسية التقليدية',
    descriptionEn: 'Hand-carved Middle Eastern brass hookah pot with heavy Egyptian glass base.',
    descriptionAr: 'شيشة الأكبر المصنوعة يدوياً من النحاس مع قاعدة زجاجية مصري ثقيلة.',
    price: 380,
    rating: 4.9,
    stockStatus: 'in_stock',
    stockQty: 5,
    strength: 'N/A',
    profile: 'Hardware',
    badge: 'Classic Craft',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  },

  // 3. Retail Flavor Packs
  {
    id: 'flv_1',
    category: 'flavors',
    brand: 'Afzal',
    nameEn: 'Afzal Pan Raas Flavor Box (250g Pack)',
    nameAr: 'علبة معسل بان راس أفضال (250 غرام)',
    descriptionEn: 'Original 250g box of Afzal Pan Raas herbal tobacco mix.',
    descriptionAr: 'علبة معسل بان راس أفضال الأصلية سعة 250 غرام.',
    price: 65,
    rating: 4.9,
    stockStatus: 'in_stock',
    stockQty: 30,
    strength: 'Strong',
    profile: 'Spiced & Paan',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'flv_2',
    category: 'flavors',
    brand: 'Soex',
    nameEn: 'Soex Herbal Mint Flavor (Tobacco-Free 50g)',
    nameAr: 'علبة معسل سويكس نعناع عشبي (بدون تبغ 50غ)',
    descriptionEn: '100% Herbal Nicotine-Free and Tobacco-Free shisha flavor.',
    descriptionAr: 'نكهة شيشة عشبية 100% خالية تماماً من النيكوتين والتبغ.',
    price: 25,
    rating: 4.8,
    stockStatus: 'in_stock',
    stockQty: 50,
    strength: '0% Nicotine',
    profile: 'Minty & Cool',
    badge: 'Nicotine Free',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'flv_3',
    category: 'flavors',
    brand: 'Al-Fakher',
    nameEn: 'Al-Fakher Double Apple 250g Tub',
    nameAr: 'علبة تفاحتين الفاخر (250 غرام)',
    descriptionEn: 'Sealed authentic Al-Fakher double apple flavor tub.',
    descriptionAr: 'عبوة معسل تفاحتين الفاخر الأصلية المختومة سعة 250غ.',
    price: 55,
    rating: 4.9,
    stockStatus: 'in_stock',
    stockQty: 40,
    strength: 'Medium',
    profile: 'Fruity & Sweet',
    badge: 'Original',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'flv_4',
    category: 'flavors',
    brand: 'Afreen',
    nameEn: 'Afreen Arabic Spice Flavor (50g Pack)',
    nameAr: 'علبة معسل أفرين توابل عربية (50غ)',
    descriptionEn: 'Rich spiced blend of cardamon, clove, and sweet vanilla.',
    descriptionAr: 'خلطة توابل فريدة من الهيل والقرنفل والفانيليا.',
    price: 22,
    rating: 4.6,
    stockStatus: 'low_stock',
    stockQty: 3,
    strength: 'Medium',
    profile: 'Spiced',
    badge: 'Exotic',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
  },

  // 4. Charcoal & Supplies
  {
    id: 'coal_1',
    category: 'coals',
    brand: 'Coco-Aya',
    nameEn: 'Coco-Aya 100% Coconut Charcoal Cubes (1kg Box)',
    nameAr: 'فحم كوكو آيا جوز الهند الطبيعي (علبة 1 كغ)',
    descriptionEn: 'Premium organic coconut shell charcoal cubes. Low ash, 2+ hours burn time.',
    descriptionAr: 'مكعبات فحم كوكو آيا من قشر جوز الهند الطبيعي. رماد قليل واشتعال يدوم ساعتين.',
    price: 45,
    rating: 5.0,
    stockStatus: 'in_stock',
    stockQty: 60,
    strength: 'N/A',
    profile: 'Coals',
    badge: 'Top Charcoal',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'coal_2',
    category: 'coals',
    brand: 'Al-Afandi',
    nameEn: 'Al-Afandi Quick-Light Charcoal Discs (Roll of 10)',
    nameAr: 'فحم الأفندي سريع الاشتعال (رول 10 أقراص)',
    descriptionEn: 'Instant torch-ignited charcoal discs for fast outdoor setup.',
    descriptionAr: 'أقراص فحم الأفندي سريعة الاشتعال بالولاعة فوراً للرحلات.',
    price: 15,
    rating: 4.5,
    stockStatus: 'in_stock',
    stockQty: 80,
    strength: 'N/A',
    profile: 'Coals',
    badge: 'Quick Light',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'coal_3',
    category: 'coals',
    brand: 'Bonchi',
    nameEn: 'Bonchi Natural Charcoal Cubes (1kg Box)',
    nameAr: 'فحم بونتشي المكعبات الطبيعي (1 كغ)',
    descriptionEn: 'High density natural coconut charcoal with zero odorless smoke.',
    descriptionAr: 'فحم بونتشي الطبيعي عالي الكثافة بدون أي رائحة غريبة.',
    price: 40,
    rating: 4.8,
    stockStatus: 'in_stock',
    stockQty: 35,
    strength: 'N/A',
    profile: 'Coals',
    badge: 'Natural',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80'
  }
];
