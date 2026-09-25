export interface SoilTestingCentre {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  type: string;
  typeMr: string;
  district: string;
  taluka: string;
  state: string;
  address: string;
  addressMr: string;
  addressHi: string;
  phone: string;
  timing: string;
  timingMr: string;
  fee: string;
  feeMr: string;
  lat: number;
  lng: number;
}

export const SOIL_TESTING_CENTRES: SoilTestingCentre[] = [
  // Pune District Centres
  {
    id: 'pune-kvk-baramati',
    name: 'ICAR Krishi Vigyan Kendra (KVK), Baramati',
    nameMr: 'कृषी विज्ञान केंद्र (KVK), बारामती',
    nameHi: 'कृषि विज्ञान केंद्र (KVK), बारामती',
    type: 'Government / ICAR Approved',
    typeMr: 'शासकीय / ICAR मान्यताप्राप्त केंद्र',
    district: 'Pune',
    taluka: 'Baramati',
    state: 'Maharashtra',
    address: 'Agricultural Development Trust, Malegaon Khurd, Baramati, Pune - 413115',
    addressMr: 'अॅग्रिकल्चरल डेव्हलपमेंट ट्रस्ट, माळेगाव खुर्द, बारामती, पुणे - ४१३११५',
    addressHi: 'एग्रीकल्चरल डेवलपमेंट ट्रस्ट, मालेगांव खुर्द, बारामती, पुणे - ४१३११५',
    phone: '02112-255227',
    timing: 'Mon - Sat: 9:30 AM - 5:30 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ९:३० ते संध्याकाळी ५:३०',
    fee: '₹30 - ₹50 per sample (Govt subsidized)',
    feeMr: '₹३० ते ₹५० प्रति नमुना (शासकीय अनुदानीत दर)',
    lat: 18.1524,
    lng: 74.5772,
  },
  {
    id: 'pune-college-agri',
    name: 'College of Agriculture Soil Testing Laboratory, Pune',
    nameMr: 'कृषी महाविद्यालय माती परीक्षण प्रयोगशाळा, पुणे',
    nameHi: 'कृषि महाविद्यालय मृदा परीक्षण प्रयोगशाला, पुणे',
    type: 'Government State Agriculture Dept',
    typeMr: 'शासकीय कृषी विभाग प्रयोगशाळा',
    district: 'Pune',
    taluka: 'Haveli',
    state: 'Maharashtra',
    address: 'College of Agriculture Campus, Narveer Tanaji Wadi, Shivajinagar, Pune - 411005',
    addressMr: 'कृषी महाविद्यालय परिसर, नरवीर तानाजी वाडी, शिवाजीनगर, पुणे - ४११००५',
    addressHi: 'कृषि महाविद्यालय परिसर, शिवाजीनगर, पुणे - ४११००५',
    phone: '020-25537033',
    timing: 'Mon - Fri: 10:00 AM - 5:00 PM',
    timingMr: 'सोमवार ते शुक्रवार: सकाळी १०:०० ते संध्याकाळी ५:००',
    fee: '₹35 per sample',
    feeMr: '₹३५ प्रति नमुना',
    lat: 18.5314,
    lng: 73.8446,
  },
  {
    id: 'pune-kvk-narayangaon',
    name: 'Gramonnati Mandal KVK, Narayangaon',
    nameMr: 'ग्रामोन्नती मंडळ कृषी विज्ञान केंद्र, नारायणगाव',
    nameHi: 'ग्रामोन्नति मंडल कृषि विज्ञान केंद्र, नारायणगांव',
    type: 'Government / ICAR Approved',
    typeMr: 'शासकीय / ICAR मान्यताप्राप्त केंद्र',
    district: 'Pune',
    taluka: 'Junnar',
    state: 'Maharashtra',
    address: 'Pune-Nashik Highway, Narayangaon, Tal. Junnar, Pune - 410504',
    addressMr: 'पुणे-नाशिक महामार्ग, नारायणगाव, ता. जुन्नर, पुणे - ४१०५०४',
    addressHi: 'पुणे-नासिक हाईवे, नारायणगांव, जुन्नर, पुणे - ४१०५०४',
    phone: '02132-242445',
    timing: 'Mon - Sat: 9:30 AM - 5:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ९:३० ते संध्याकाळी ५:००',
    fee: '₹40 per sample',
    feeMr: '₹४० प्रति नमुना',
    lat: 19.1206,
    lng: 73.9789,
  },
  {
    id: 'pune-taluka-khed',
    name: 'Sub-Divisional Soil Testing Centre, Khed (Rajgurunagar)',
    nameMr: 'उपविभागीय माती परीक्षण केंद्र, खेड (राजगुरुनगर)',
    nameHi: 'उप-विभागीय मृदा परीक्षण केंद्र, खेड (राजगुरुनगर)',
    type: 'Taluka Agriculture Office',
    typeMr: 'तालुका कृषी अधिकारी कार्यालय केंद्र',
    district: 'Pune',
    taluka: 'Khed',
    state: 'Maharashtra',
    address: 'Near Panchayat Samiti, Rajgurunagar, Tal. Khed, Pune - 410505',
    addressMr: 'पंचायत समिती जवळ, राजगुरुनगर, ता. खेड, पुणे - ४१०५०५',
    addressHi: 'पंचायत समिति के पास, राजगुरुनगर, खेड, पुणे - ४१०५०५',
    phone: '02135-222041',
    timing: 'Mon - Sat: 10:00 AM - 5:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी १०:०० ते संध्याकाळी ५:००',
    fee: '₹30 per sample',
    feeMr: '₹३० प्रति नमुना',
    lat: 18.8547,
    lng: 73.9068,
  },

  // Nashik District Centres
  {
    id: 'nashik-kvk-yashwantrao',
    name: 'YCMOU Krishi Vigyan Kendra, Nashik',
    nameMr: 'यशवंतराव चव्हाण मुक्त विद्यापीठ KVK, नाशिक',
    nameHi: 'यशवंतराव चव्हाण मुक्त विश्वविद्यालय KVK, नासिक',
    type: 'Government / ICAR Approved',
    typeMr: 'शासकीय / ICAR मान्यताप्राप्त केंद्र',
    district: 'Nashik',
    taluka: 'Nashik',
    state: 'Maharashtra',
    address: 'Dnyangangotri Campus, Near Gangapur Dam, Nashik - 422222',
    addressMr: 'ज्ञानगंगोत्री परिसर, गंगापूर धरणाजवळ, नाशिक - ४२२२२२',
    addressHi: 'ज्ञानगंगोत्री परिसर, गंगापुर बांध के पास, नासिक - ४२२२२२',
    phone: '0253-2231477',
    timing: 'Mon - Sat: 9:30 AM - 5:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ९:३० ते संध्याकाळी ५:००',
    fee: '₹40 per sample',
    feeMr: '₹४० प्रति नमुना',
    lat: 20.0150,
    lng: 73.7420,
  },
  {
    id: 'nashik-district-lab',
    name: 'District Soil Testing Laboratory, Nashik',
    nameMr: 'जिल्हा माती परीक्षण प्रयोगशाळा, नाशिक',
    nameHi: 'जिला मृदा परीक्षण प्रयोगशाला, नासिक',
    type: 'State Agriculture Department',
    typeMr: 'शासकीय कृषी विभाग प्रयोगशाळा',
    district: 'Nashik',
    taluka: 'Nashik',
    state: 'Maharashtra',
    address: 'Krishi Bhavan, Dindori Road, Panchavati, Nashik - 422003',
    addressMr: 'कृषी भवन, दिंडोरी रोड, पंचवटी, नाशिक - ४२२२२३',
    addressHi: 'कृषि भवन, दिंडोरी रोड, पंचवटी, नासिक - ४२२२२३',
    phone: '0253-2512140',
    timing: 'Mon - Fri: 10:00 AM - 5:00 PM',
    timingMr: 'सोमवार ते शुक्रवार: सकाळी १०:०० ते संध्याकाळी ५:००',
    fee: '₹35 per sample',
    feeMr: '₹३५ प्रति नमुना',
    lat: 19.9975,
    lng: 73.7898,
  },

  // Ahmednagar District Centres
  {
    id: 'ahmednagar-kvk-babhaleshwar',
    name: 'Pravara Rural Krishi Vigyan Kendra, Babhaleshwar',
    nameMr: 'प्रवरा ग्रामीण कृषी विज्ञान केंद्र, बाभळेश्वर',
    nameHi: 'प्रवरा ग्रामीण कृषि विज्ञान केंद्र, बाभलेश्वर',
    type: 'Government / ICAR Approved',
    typeMr: 'शासकीय / ICAR मान्यताप्राप्त केंद्र',
    district: 'Ahmednagar',
    taluka: 'Rahata',
    state: 'Maharashtra',
    address: 'At Post Babhaleshwar, Tal. Rahata, Ahmednagar - 413737',
    addressMr: 'मु. पो. बाभळेश्वर, ता. राहाता, अहमदनगर - ४१३७३७',
    addressHi: 'ग्राम बाभलेश्वर, राहाता, अहमदनगर - ४१३७३७',
    phone: '02422-252414',
    timing: 'Mon - Sat: 9:30 AM - 5:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ९:३० ते संध्याकाळी ५:००',
    fee: '₹35 per sample',
    feeMr: '₹३५ प्रति नमुना',
    lat: 19.5539,
    lng: 74.5218,
  },

  // Kolhapur District Centres
  {
    id: 'kolhapur-kvk-kaneri',
    name: 'Siddhagiri Krishi Vigyan Kendra, Kaneri Math, Kolhapur',
    nameMr: 'सिद्धगिरी कृषी विज्ञान केंद्र, कणेरी मठ, कोल्हापूर',
    nameHi: 'सिद्धगिरि कृषि विज्ञान केंद्र, कणेरी मठ, कोल्हापुर',
    type: 'Government / ICAR Approved',
    typeMr: 'शासकीय / ICAR मान्यताप्राप्त केंद्र',
    district: 'Kolhapur',
    taluka: 'Karvir',
    state: 'Maharashtra',
    address: 'Kaneri Math, Tal. Karvir, Kolhapur - 416234',
    addressMr: 'कणेरी मठ, ता. करवीर, कोल्हापूर - ४१६२३४',
    addressHi: 'कणेरी मठ, करवीर, कोल्हापुर - ४१६२३४',
    phone: '0231-2672320',
    timing: 'Mon - Sat: 9:30 AM - 5:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ९:३० ते संध्याकाळी ५:००',
    fee: '₹40 per sample',
    feeMr: '₹४० प्रति नमुना',
    lat: 16.6342,
    lng: 74.2715,
  },

  // Solapur District Centres
  {
    id: 'solapur-kvk-solapur',
    name: 'Shabari Krishi Vigyan Kendra, Kegaon, Solapur',
    nameMr: 'शबरी कृषी विज्ञान केंद्र, केगाव, सोलापूर',
    nameHi: 'शबरी कृषि विज्ञान केंद्र, केगांव, सोलापुर',
    type: 'Government / ICAR Approved',
    typeMr: 'शासकीय / ICAR मान्यताप्राप्त केंद्र',
    district: 'Solapur',
    taluka: 'Solapur North',
    state: 'Maharashtra',
    address: 'Kegaon, Near Solapur University, Pune-Solapur Highway, Solapur - 413255',
    addressMr: 'केगाव, सोलापूर विद्यापीठाजवळ, पुणे-सोलापूर महामार्ग, सोलापूर - ४१३२५५',
    addressHi: 'केगांव, सोलापुर विश्वविद्यालय के पास, सोलापुर - ४१३२५५',
    phone: '0217-2744747',
    timing: 'Mon - Sat: 9:30 AM - 5:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ९:३० ते संध्याकाळी ५:००',
    fee: '₹35 per sample',
    feeMr: '₹३५ प्रति नमुना',
    lat: 17.6854,
    lng: 75.8340,
  },

  // Satara District Centres
  {
    id: 'satara-kvk-borgaon',
    name: 'District Krishi Vigyan Kendra, Borgaon, Satara',
    nameMr: 'जिल्हा कृषी विज्ञान केंद्र, बोरगाव, सातारा',
    nameHi: 'जिला कृषि विज्ञान केंद्र, बोरगांव, सातारा',
    type: 'Government / ICAR Approved',
    typeMr: 'शासकीय / ICAR मान्यताप्राप्त केंद्र',
    district: 'Satara',
    taluka: 'Satara',
    state: 'Maharashtra',
    address: 'Post Borgaon, Tal. & Dist. Satara - 415519',
    addressMr: 'पो. बोरगाव, ता. व जि. सातारा - ४१५५१९',
    addressHi: 'ग्राम बोरगांव, सातारा - ४१५५१९',
    phone: '02162-260381',
    timing: 'Mon - Sat: 9:30 AM - 5:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ९:३० ते संध्याकाळी ५:००',
    fee: '₹35 per sample',
    feeMr: '₹३५ प्रति नमुना',
    lat: 17.6200,
    lng: 74.0500,
  },

  // Chhatrapati Sambhajinagar Centres
  {
    id: 'sambhajinagar-kvk',
    name: 'Marathwada Krishi Vidyapeeth KVK, Chhatrapati Sambhajinagar',
    nameMr: 'मराठवाडा कृषी विद्यापीठ KVK, छत्रपती संभाजीनगर',
    nameHi: 'मराठवाड़ा कृषि विश्वविद्यालय KVK, छत्रपति संभाजीनगर',
    type: 'University / Govt Approved',
    typeMr: 'कृषी विद्यापीठ मान्यताप्राप्त प्रयोगशाळा',
    district: 'Chhatrapati Sambhajinagar',
    taluka: 'Aurangabad',
    state: 'Maharashtra',
    address: 'VNMKV Campus, Paithan Road, Chhatrapati Sambhajinagar - 431005',
    addressMr: 'कृषी विद्यापीठ परिसर, पैठण रोड, छत्रपती संभाजीनगर - ४३१००५',
    addressHi: 'कृषि विश्वविद्यालय परिसर, पैठण रोड, छत्रपति संभाजीनगर - ४३१००५',
    phone: '0240-2376558',
    timing: 'Mon - Fri: 10:00 AM - 5:00 PM',
    timingMr: 'सोमवार ते शुक्रवार: सकाळी १०:०० ते संध्याकाळी ५:००',
    fee: '₹35 per sample',
    feeMr: '₹३५ प्रति नमुना',
    lat: 19.8762,
    lng: 75.3433,
  },
];

/**
 * Computes approximate distance in km using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Returns nearby soil testing centres prioritized by taluka/district match and distance
 */
export function getNearbyCentres(
  userLat?: number,
  userLng?: number,
  district?: string,
  state?: string,
  taluka?: string
): (SoilTestingCentre & { distanceKm?: number })[] {
  let list = [...SOIL_TESTING_CENTRES];

  const distLower = (district || '').toLowerCase().trim();
  const talukaLower = (taluka || '').toLowerCase().trim();

  // If district or taluka provided, sort by match
  list.sort((a, b) => {
    const aTalukaMatch = talukaLower && (a.taluka.toLowerCase().includes(talukaLower) || talukaLower.includes(a.taluka.toLowerCase()));
    const bTalukaMatch = talukaLower && (b.taluka.toLowerCase().includes(talukaLower) || talukaLower.includes(b.taluka.toLowerCase()));
    if (aTalukaMatch && !bTalukaMatch) return -1;
    if (!aTalukaMatch && bTalukaMatch) return 1;

    const aDistMatch = distLower && a.district.toLowerCase().includes(distLower);
    const bDistMatch = distLower && b.district.toLowerCase().includes(distLower);
    if (aDistMatch && !bDistMatch) return -1;
    if (!aDistMatch && bDistMatch) return 1;

    return 0;
  });

  // Calculate distance if coordinates available
  if (userLat && userLng) {
    const withDistance = list.map((c) => ({
      ...c,
      distanceKm: calculateDistanceKm(userLat, userLng, c.lat, c.lng),
    }));

    withDistance.sort((a, b) => {
      // Prioritize same taluka
      const aTalukaMatch = talukaLower && (a.taluka.toLowerCase().includes(talukaLower) || talukaLower.includes(a.taluka.toLowerCase()));
      const bTalukaMatch = talukaLower && (b.taluka.toLowerCase().includes(talukaLower) || talukaLower.includes(b.taluka.toLowerCase()));
      if (aTalukaMatch && !bTalukaMatch) return -1;
      if (!aTalukaMatch && bTalukaMatch) return 1;

      // Prioritize same district
      const aDistMatch = distLower && a.district.toLowerCase().includes(distLower);
      const bDistMatch = distLower && b.district.toLowerCase().includes(distLower);
      if (aDistMatch && !bDistMatch) return -1;
      if (!aDistMatch && bDistMatch) return 1;

      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });

    return withDistance;
  }

  return list;
}

export function getLocalizedCentre(centre: SoilTestingCentre, language: string) {
  return {
    name: language === 'mr' ? (centre.nameMr || centre.name) : language === 'hi' ? (centre.nameHi || centre.name) : centre.name,
    address: language === 'mr' ? (centre.addressMr || centre.address) : language === 'hi' ? (centre.addressHi || centre.address) : centre.address,
    type: language === 'mr' ? (centre.typeMr || centre.type) : centre.type,
    timing: language === 'mr' ? (centre.timingMr || centre.timing) : centre.timing,
    fee: language === 'mr' ? (centre.feeMr || centre.fee) : centre.fee,
  };
}
