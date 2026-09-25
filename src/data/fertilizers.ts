import { FertilizerProduct } from '@/types';

/**
 * Structured Indian Fertilizer Knowledge Base
 * Sources:
 * - Department of Fertilizers, Ministry of Chemicals & Fertilizers, Government of India (Statutory MRP / NBS Guidelines)
 * - Fertilizer Control Order (FCO), 1985
 * - Indian Council of Agricultural Research (ICAR) & State Agricultural Universities (SAUs)
 */

export const FERTILIZERS: FertilizerProduct[] = [
  // 1. NEEM COATED UREA
  {
    id: 'urea',
    name: 'Urea (Neem Coated)',
    nameLocal: {
      en: 'Urea (Neem Coated)',
      mr: 'युरिया (कडुनिंब लेपित)',
      hi: 'यूरिया (नीम लेपित)',
    },
    category: 'Nitrogenous Fertilizer',
    categoryLocal: {
      en: 'Nitrogen Fertilizer',
      mr: 'नत्रयुक्त खत',
      hi: 'नाइट्रोजन उर्वरक',
    },
    nutrientsSupplied: [
      { nutrient: 'Nitrogen', percentage: '46% N', symbol: 'N' },
    ],
    targetedDeficiencies: ['nitrogen'],
    commonPackSizes: ['45 kg bag'],
    benefitDescription: {
      en: 'Promotes rapid vegetative growth, lush green leaves, tillering, and overall plant vigor.',
      mr: 'झाडांची जलद शाकीय वाढ, पाने हिरवीगार ठेवणे आणि फुटवे फुटण्यास मदत करते.',
      hi: 'पौधों की तेज वानस्पतिक वृद्धि, पत्तियों का हरापन और कल्ले फूटने में मदद करता है।',
    },
    referencePrice: {
      amount: 242.00,
      unit: 'per 45 kg bag',
      currency: '₹',
      source: 'Department of Fertilizers, Govt. of India (Statutory MRP)',
      date: '2024–2026',
      sourceUrl: 'https://www.fert.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 45 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/urea-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'Urea 46% N Category Bag',
      altText: {
        en: 'Urea 46% Nitrogen Fertilizer 45kg bag',
        mr: 'युरिया ४६% नत्र खत ४५ किलो पोते',
        hi: 'यूरिया 46% नाइट्रोजन उर्वरक 45 किलो बोरी',
      },
    },
    productSource: {
      sourceName: 'Department of Fertilizers, Ministry of Chemicals & Fertilizers',
      url: 'https://www.fert.nic.in',
    },
    regulatoryNotes: '100% Neem coated as per mandatory Government of India notification.',
  },

  // 2. DAP (DIAMMONIUM PHOSPHATE)
  {
    id: 'dap',
    name: 'DAP (Diammonium Phosphate)',
    nameLocal: {
      en: 'DAP (Diammonium Phosphate)',
      mr: 'डीएपी (डायअमोनियम फॉस्फेट)',
      hi: 'डीएपी (डायअमोनियम फॉस्फेट)',
    },
    category: 'Phosphatic & Nitrogen Fertilizer',
    categoryLocal: {
      en: 'Phosphorus + Nitrogen Fertilizer',
      mr: 'स्फुरद व नत्रयुक्त खत',
      hi: 'फास्फोरस व नाइट्रोजन उर्वरक',
    },
    nutrientsSupplied: [
      { nutrient: 'Phosphorus', percentage: '46% P₂O₅', symbol: 'P' },
      { nutrient: 'Nitrogen', percentage: '18% N', symbol: 'N' },
    ],
    targetedDeficiencies: ['phosphorus', 'nitrogen'],
    commonPackSizes: ['50 kg bag'],
    benefitDescription: {
      en: 'Supplies high phosphorus for deep root development and early plant establishment.',
      mr: 'मुळांची मजबूत वाढ आणि पिकाच्या सुरुवातीच्या जोमदार वाढीसाठी भरपूर स्फुरद पुरवते.',
      hi: 'जड़ों के गहरे विकास और शुरुआती मजबूत बढ़वार के लिए प्रचुर फास्फोरस प्रदान करता है।',
    },
    referencePrice: {
      amount: 1350.00,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: 'Department of Fertilizers, Govt. of India (NBS Benchmark MRP)',
      date: '2024–2026',
      sourceUrl: 'https://www.fert.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/dap-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'DAP 18-46-0 Category Bag',
      altText: {
        en: 'DAP 18-46-0 Fertilizer 50kg bag',
        mr: 'डीएपी १८-४६-० खत ५० किलो पोते',
        hi: 'डीएपी 18-46-0 उर्वरक 50 किलो बोरी',
      },
    },
    productSource: {
      sourceName: 'Department of Fertilizers, Govt. of India (NBS Scheme)',
      url: 'https://www.fert.nic.in',
    },
    regulatoryNotes: 'Subsidized under the Nutrient Based Subsidy (NBS) scheme.',
  },

  // 3. MOP (MURIATE OF POTASH)
  {
    id: 'mop',
    name: 'MOP (Muriate of Potash)',
    nameLocal: {
      en: 'MOP (Muriate of Potash)',
      mr: 'एमओपी (म्युरिएट ऑफ पोटॅश)',
      hi: 'एमओपी (म्यूरिएट ऑफ पोटाश)',
    },
    category: 'Potassic Fertilizer',
    categoryLocal: {
      en: 'Potash Fertilizer',
      mr: 'पालाशयुक्त खत',
      hi: 'पोटाश उर्वरक',
    },
    nutrientsSupplied: [
      { nutrient: 'Potassium', percentage: '60% K₂O', symbol: 'K' },
    ],
    targetedDeficiencies: ['potassium'],
    commonPackSizes: ['50 kg bag'],
    benefitDescription: {
      en: 'Strengthens disease resistance, improves drought tolerance, grain boldness, and crop quality.',
      mr: 'रोग व किडींविरूद्ध प्रतिकारशक्ती वाढवते, दुष्काळ सहनशीलता सुधारते आणि दाणे भरण्यास मदत करते.',
      hi: 'रोग प्रतिरोधक क्षमता बढ़ाता है, सूखे को सहने की ताकत देता है और दाने व फलों की गुणवत्ता सुधारता है।',
    },
    referencePrice: {
      amount: 1650.00,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: 'Department of Fertilizers, Govt. of India (NBS Benchmark MRP)',
      date: '2024–2026',
      sourceUrl: 'https://www.fert.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/mop-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'MOP 60% K2O Category Bag',
      altText: {
        en: 'MOP 60% Potash Fertilizer 50kg bag',
        mr: 'एमओपी ६०% पालाश खत ५० किलो पोते',
        hi: 'एमओपी 60% पोटाश उर्वरक 50 किलो बोरी',
      },
    },
    productSource: {
      sourceName: 'Department of Fertilizers, Govt. of India (NBS Scheme)',
      url: 'https://www.fert.nic.in',
    },
    regulatoryNotes: 'Subsidized under the Nutrient Based Subsidy (NBS) scheme.',
  },

  // 4. SSP (SINGLE SUPER PHOSPHATE)
  {
    id: 'ssp',
    name: 'SSP (Single Super Phosphate)',
    nameLocal: {
      en: 'SSP (Single Super Phosphate)',
      mr: 'एसएसपी (सिंगल सुपर फॉस्फेट)',
      hi: 'एसएसपी (सिंगल सुपर फास्फेट)',
    },
    category: 'Phosphatic & Secondary Nutrient Fertilizer',
    categoryLocal: {
      en: 'Phosphorus + Sulphur Fertilizer',
      mr: 'स्फुरद व गंधकयुक्त खत',
      hi: 'फास्फोरस व सल्फर उर्वरक',
    },
    nutrientsSupplied: [
      { nutrient: 'Phosphorus', percentage: '16% P₂O₅', symbol: 'P' },
      { nutrient: 'Sulphur', percentage: '11% S', symbol: 'S' },
      { nutrient: 'Calcium', percentage: '19% Ca', symbol: 'Ca' },
    ],
    targetedDeficiencies: ['phosphorus', 'sulphur'],
    commonPackSizes: ['50 kg bag'],
    benefitDescription: {
      en: 'Supplies phosphorus for roots and essential sulphur for higher oil content in oilseeds and pulses.',
      mr: 'मुळांच्या वाढीसाठी स्फुरद तसेच तेलबिया आणि डाळींमध्ये तेलाचे प्रमाण व प्रथिने वाढवण्यासाठी गंधक पुरवते.',
      hi: 'जड़ों की मजबूती के लिए फास्फोरस और तिलहनी फसलों में तेल की मात्रा बढ़ाने के लिए सल्फर देता है।',
    },
    referencePrice: {
      amount: 550.00,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: 'Department of Fertilizers, Govt. of India (NBS Benchmark MRP)',
      date: '2024–2026',
      sourceUrl: 'https://www.fert.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/ssp-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'SSP 16% P + 11% S Category Bag',
      altText: {
        en: 'SSP Single Super Phosphate 50kg bag',
        mr: 'सिंगल सुपर फॉस्फेट ५० किलो पोते',
        hi: 'सिंगल सुपर फास्फेट 50 किलो बोरी',
      },
    },
    productSource: {
      sourceName: 'Department of Fertilizers, Govt. of India (NBS Scheme)',
      url: 'https://www.fert.nic.in',
    },
    regulatoryNotes: 'Ideal phosphatic source for sulphur-deficient soils and pulse/oilseed crops.',
  },

  // 5. NPK COMPLEX 10:26:26
  {
    id: 'npk-10-26-26',
    name: 'NPK 10:26:26 Complex',
    nameLocal: {
      en: 'NPK 10:26:26 Complex',
      mr: 'एनपीके १०:२६:२६ संयुक्त खत',
      hi: 'एनपीके 10:26:26 सम्मिश्र उर्वरक',
    },
    category: 'Balanced Complex Fertilizer',
    categoryLocal: {
      en: 'NPK Complex Fertilizer',
      mr: 'संयुक्त रासायनिक खत',
      hi: 'संयुक्त रासायनिक उर्वरक',
    },
    nutrientsSupplied: [
      { nutrient: 'Nitrogen', percentage: '10% N', symbol: 'N' },
      { nutrient: 'Phosphorus', percentage: '26% P₂O₅', symbol: 'P' },
      { nutrient: 'Potassium', percentage: '26% K₂O', symbol: 'K' },
    ],
    targetedDeficiencies: ['phosphorus', 'potassium', 'nitrogen'],
    commonPackSizes: ['50 kg bag'],
    benefitDescription: {
      en: 'High phosphorus and potash grade excellent for root development, flowering, and grain filling.',
      mr: 'स्फुरद आणि पालाशचे उत्तम प्रमाण असल्याने मुळे, फुले आणि दाणे भरण्यासाठी अत्यंत उपयुक्त ठरते.',
      hi: 'फास्फोरस और पोटाश का बेहतरीन संतुलन, जो फूल आने, फल बनने और दाना भरने में बहुत सहायक है।',
    },
    referencePrice: {
      amount: 1470.00,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: 'Department of Fertilizers, Govt. of India (NBS Benchmark MRP)',
      date: '2024–2026',
      sourceUrl: 'https://www.fert.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/npk-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'NPK 10:26:26 Category Bag',
      altText: {
        en: 'NPK 10:26:26 Fertilizer 50kg bag',
        mr: 'एनपीके १०:२६:२६ खत ५० किलो पोते',
        hi: 'एनपीके 10:26:26 उर्वरक 50 किलो बोरी',
      },
    },
    productSource: {
      sourceName: 'Department of Fertilizers, Govt. of India (NBS Scheme)',
      url: 'https://www.fert.nic.in',
    },
    regulatoryNotes: 'Subsidized under the Nutrient Based Subsidy (NBS) scheme.',
  },

  // 6. NPK COMPLEX 12:32:16
  {
    id: 'npk-12-32-16',
    name: 'NPK 12:32:16 Complex',
    nameLocal: {
      en: 'NPK 12:32:16 Complex',
      mr: 'एनपीके १२:३२:१६ संयुक्त खत',
      hi: 'एनपीके 12:32:16 सम्मिश्र उर्वरक',
    },
    category: 'High Phosphorus Complex Fertilizer',
    categoryLocal: {
      en: 'NPK Complex Fertilizer',
      mr: 'संयुक्त रासायनिक खत',
      hi: 'संयुक्त रासायनिक उर्वरक',
    },
    nutrientsSupplied: [
      { nutrient: 'Nitrogen', percentage: '12% N', symbol: 'N' },
      { nutrient: 'Phosphorus', percentage: '32% P₂O₅', symbol: 'P' },
      { nutrient: 'Potassium', percentage: '16% K₂O', symbol: 'K' },
    ],
    targetedDeficiencies: ['phosphorus', 'nitrogen', 'potassium'],
    commonPackSizes: ['50 kg bag'],
    benefitDescription: {
      en: 'Premium basal grade providing extra phosphorus for early root vigor alongside balanced nitrogen and potash.',
      mr: 'पेरणीवेळी देण्यासाठी उत्कृष्ट खत, ज्यामुळे पिकाच्या मुळांची झपाट्याने वाढ होते आणि सुरुवातीचा जोम मिळतो.',
      hi: 'बुवाई के समय देने के लिए उत्तम खाद, जो जड़ों के विकास और पौधों की शुरुआती मजबूती में मदद करती है।',
    },
    referencePrice: {
      amount: 1470.00,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: 'Department of Fertilizers, Govt. of India (NBS Benchmark MRP)',
      date: '2024–2026',
      sourceUrl: 'https://www.fert.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/npk-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'NPK 12:32:16 Category Bag',
      altText: {
        en: 'NPK 12:32:16 Fertilizer 50kg bag',
        mr: 'एनपीके १२:३२:१६ खत ५० किलो पोते',
        hi: 'एनपीके 12:32:16 उर्वरक 50 किलो बोरी',
      },
    },
    productSource: {
      sourceName: 'Department of Fertilizers, Govt. of India (NBS Scheme)',
      url: 'https://www.fert.nic.in',
    },
    regulatoryNotes: 'Subsidized under the Nutrient Based Subsidy (NBS) scheme.',
  },

  // 7. ZINC SULPHATE HEPTAHYDRATE 21%
  {
    id: 'zinc-sulphate-21',
    name: 'Zinc Sulphate Heptahydrate (21% Zn)',
    nameLocal: {
      en: 'Zinc Sulphate (21% Zn)',
      mr: 'झिंक सल्फेट (२१% जस्त)',
      hi: 'जिंक सल्फेट (21% जस्ता)',
    },
    category: 'Micronutrient Fertilizer',
    categoryLocal: {
      en: 'Zinc Micronutrient',
      mr: 'जस्त (झिंक) सूक्ष्म अन्नद्रव्य',
      hi: 'जिंक सूक्ष्म पोषक तत्व',
    },
    nutrientsSupplied: [
      { nutrient: 'Zinc', percentage: '21% Zn', symbol: 'Zn' },
      { nutrient: 'Sulphur', percentage: '10% S', symbol: 'S' },
    ],
    targetedDeficiencies: ['zinc', 'sulphur'],
    commonPackSizes: ['5 kg pack', '10 kg bag', '25 kg bag'],
    benefitDescription: {
      en: 'Cures zinc deficiency (chlorosis / white bud / khaira disease), activates growth enzymes and chlorophyll.',
      mr: 'पाने पिवळी पडणे व जस्ताची कमतरता दूर करते. वनस्पतीमधील वाढीची संप्रेरके आणि हरितद्रव्य तयार करण्यास मदत करते.',
      hi: 'खैरा रोग और पत्तियों का पीलापन रोकता है, पौधों में वृद्धि हार्मोन और क्लोरोफिल का निर्माण बढ़ाता है।',
    },
    referencePrice: {
      amount: 425.00,
      unit: 'per 5 kg pack',
      currency: '₹',
      source: 'Fertilizer Control Order (FCO) / ICAR Norms (approx ₹85/kg)',
      date: '2024–2026',
      sourceUrl: 'https://agricoop.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 5 kg pack',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/zinc-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'Zinc Sulphate 21% Category Pack',
      altText: {
        en: 'Zinc Sulphate 21% Micronutrient Fertilizer',
        mr: 'झिंक सल्फेट २१% सूक्ष्म अन्नद्रव्य',
        hi: 'जिंक सल्फेट 21% सूक्ष्म पोषक तत्व',
      },
    },
    productSource: {
      sourceName: 'Fertilizer Control Order (FCO) Standards',
      url: 'https://agricoop.nic.in',
    },
    regulatoryNotes: 'Formulated strictly in compliance with FCO 1985 quality parameters.',
  },

  // 8. BENTONITE SULPHUR 90%
  {
    id: 'bentonite-sulphur-90',
    name: 'Bentonite Sulphur (90% S)',
    nameLocal: {
      en: 'Bentonite Sulphur (90% S)',
      mr: 'बेंटोनाइट सल्फर (९०% गंधक)',
      hi: 'बेंटोनाइट सल्फर (90% गंधक)',
    },
    category: 'Secondary Nutrient Fertilizer',
    categoryLocal: {
      en: 'Sulphur Fertilizer',
      mr: 'गंधक (सल्फर) खत',
      hi: 'सल्फर (गंधक) उर्वरक',
    },
    nutrientsSupplied: [
      { nutrient: 'Sulphur', percentage: '90% S', symbol: 'S' },
    ],
    targetedDeficiencies: ['sulphur'],
    commonPackSizes: ['25 kg bag'],
    benefitDescription: {
      en: 'Slow-release elemental sulphur that improves oil percentage in oilseeds and enhances pungency in onions and garlic.',
      mr: 'जमिनीतील गंधकाची कमतरता भरून काढते, तेलबिया पिकात तेलाचे प्रमाण आणि कांदा-लसूण पिकात चव व टिकाऊपणा वाढवते.',
      hi: 'मिट्टी में सल्फर की कमी पूरी करता है, तिलहनों में तेल की मात्रा और प्याज-लहसुन में तीखापन व भंडारण क्षमता बढ़ाता है।',
    },
    referencePrice: {
      amount: 1150.00,
      unit: 'per 25 kg bag',
      currency: '₹',
      source: 'Department of Fertilizers (NBS Scheme Benchmark)',
      date: '2024–2026',
      sourceUrl: 'https://www.fert.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 25 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/sulphur-bag.svg',
      isVerifiedReal: true,
      categoryVisual: 'Bentonite Sulphur 90% Category Bag',
      altText: {
        en: 'Bentonite Sulphur 90% Fertilizer 25kg bag',
        mr: 'बेंटोनाइट सल्फर ९०% खत २५ किलो पोते',
        hi: 'बेंटोनाइट सल्फर 90% उर्वरक 25 किलो बोरी',
      },
    },
    productSource: {
      sourceName: 'Department of Fertilizers, Govt. of India',
      url: 'https://www.fert.nic.in',
    },
    regulatoryNotes: 'Granular formulation with bentonite clay for gradual oxidation to sulphate in soil.',
  },

  // 9. BORAX (10.5% B)
  {
    id: 'borax-10-5',
    name: 'Borax (10.5% B)',
    nameLocal: {
      en: 'Borax (10.5% Boron)',
      mr: 'बोराक्स (१०.५% बोरॉन)',
      hi: 'बोरेक्स (10.5% बोरॉन)',
    },
    category: 'Micronutrient Fertilizer',
    categoryLocal: {
      en: 'Boron Micronutrient',
      mr: 'बोरॉन सूक्ष्म अन्नद्रव्य',
      hi: 'बोरॉन सूक्ष्म पोषक तत्व',
    },
    nutrientsSupplied: [
      { nutrient: 'Boron', percentage: '10.5% B', symbol: 'B' },
    ],
    targetedDeficiencies: ['boron'],
    commonPackSizes: ['1 kg pack', '5 kg pack'],
    benefitDescription: {
      en: 'Critical for pollen tube germination, flower retention, pod setting, and prevents fruit cracking.',
      mr: 'परागीभवन, फुलगळ थांबवणे, शेंगा भरणे आणि फळांना तडे जाणे रोखण्यासाठी अत्यंत आवश्यक आहे.',
      hi: 'परागण, फूल झड़ने से रोकने, फल व दाना बनने और फलों को फटने से बचाने में बहुत जरूरी है।',
    },
    referencePrice: {
      amount: 140.00,
      unit: 'per 1 kg pack',
      currency: '₹',
      source: 'Fertilizer Control Order (FCO) Market Benchmark',
      date: '2024–2026',
      sourceUrl: 'https://agricoop.nic.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 1 kg pack',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/boron-pack.svg',
      isVerifiedReal: true,
      categoryVisual: 'Borax 10.5% B Category Pack',
      altText: {
        en: 'Borax 10.5% Boron Micronutrient 1kg pack',
        mr: 'बोराक्स १०.५% बोरॉन सूक्ष्म अन्नद्रव्य १ किलो',
        hi: 'बोरेक्स 10.5% बोरॉन सूक्ष्म पोषक तत्व 1 किलो',
      },
    },
    productSource: {
      sourceName: 'Fertilizer Control Order (FCO) Standards',
      url: 'https://agricoop.nic.in',
    },
    regulatoryNotes: '100% water-soluble sodium tetraborate decahydrate.',
  },

  // 10. ORGANIC COMPOST / WELL-ROTTED FYM
  {
    id: 'organic-manure',
    name: 'Well-Rotted Farmyard Manure / Organic Compost',
    nameLocal: {
      en: 'Farmyard Manure / Compost',
      mr: 'चांगले कुजलेले शेणखत / कंपोस्ट',
      hi: 'अच्छी सड़ी गोबर की खाद / कंपोस्ट',
    },
    category: 'Organic Soil Amendment',
    categoryLocal: {
      en: 'Organic Conditioner',
      mr: 'सेंद्रिय भूसुधारक',
      hi: 'जैविक मृदा सुधारक',
    },
    nutrientsSupplied: [
      { nutrient: 'Organic Carbon', percentage: '>12% OC', symbol: 'OC' },
      { nutrient: 'Balanced N-P-K', percentage: 'Natural microflora', symbol: 'NPK' },
    ],
    targetedDeficiencies: ['organicCarbon'],
    commonPackSizes: ['50 kg bag', '1 Trolley (2 Tonnes)'],
    benefitDescription: {
      en: 'Builds soil organic carbon, enhances water retention capacity, and stimulates beneficial soil microbes.',
      mr: 'जमिनीतील सेंद्रिय कर्ब वाढवते, ओलावा टिकवून ठेवण्याची क्षमता सुधारते आणि उपयुक्त जिवाणूंची वाढ करते.',
      hi: 'मिट्टी में जैविक कार्बन बढ़ाता है, नमी सोखने की क्षमता में सुधार करता है और लाभकारी जीवाणुओं को सक्रिय करता है।',
    },
    referencePrice: {
      amount: 150.00,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: 'State Agricultural University Advisory Reference',
      date: '2024–2026',
      sourceUrl: 'https://icar.org.in',
    },
    currentPrice: {
      amount: null,
      unit: 'per 50 kg bag',
      currency: '₹',
      source: null,
      date: null,
      isAvailable: false,
    },
    productImage: {
      imageUrl: '/images/fertilizers/organic-manure.svg',
      isVerifiedReal: true,
      categoryVisual: 'Organic Compost Category Bag',
      altText: {
        en: 'Well-rotted Farmyard Manure / Compost',
        mr: 'चांगले कुजलेले शेणखत / सेंद्रिय कंपोस्ट',
        hi: 'सड़ी हुई गोबर की खाद / जैविक कंपोस्ट',
      },
    },
    productSource: {
      sourceName: 'ICAR National Centre for Organic Farming',
      url: 'https://icar.org.in',
    },
    regulatoryNotes: 'Essential foundational soil amendment prior to chemical fertilizer application.',
  },
];
