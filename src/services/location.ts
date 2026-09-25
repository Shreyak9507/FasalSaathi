import { LocationInfo } from '@/types';

export interface DistrictCoord {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export const STATE_DISTRICTS: Record<string, DistrictCoord[]> = {
  Maharashtra: [
    { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
    { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
    { name: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lng: 74.7480 },
    { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
    { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
    { name: 'Satara', state: 'Maharashtra', lat: 17.6805, lng: 74.0183 },
    { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
    { name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
    { name: 'Jalgaon', state: 'Maharashtra', lat: 21.0077, lng: 75.5626 },
    { name: 'Amravati', state: 'Maharashtra', lat: 20.9374, lng: 77.7796 },
    { name: 'Sangli', state: 'Maharashtra', lat: 16.8524, lng: 74.5815 },
    { name: 'Latur', state: 'Maharashtra', lat: 18.4088, lng: 76.5604 },
    { name: 'Nanded', state: 'Maharashtra', lat: 19.1383, lng: 77.3210 },
  ],
  Gujarat: [
    { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
    { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
    { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
    { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
    { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
    { name: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
    { name: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289 },
    { name: 'Mehsana', state: 'Gujarat', lat: 23.5880, lng: 72.3693 },
  ],
  'Madhya Pradesh': [
    { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
    { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
    { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
    { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
    { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
    { name: 'Sagar', state: 'Madhya Pradesh', lat: 23.8388, lng: 78.7378 },
    { name: 'Dewas', state: 'Madhya Pradesh', lat: 22.9676, lng: 76.0534 },
    { name: 'Dhar', state: 'Madhya Pradesh', lat: 22.5978, lng: 75.2974 },
  ],
  Punjab: [
    { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
    { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
    { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
    { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869 },
    { name: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455 },
    { name: 'Firozpur', state: 'Punjab', lat: 30.9237, lng: 74.6122 },
    { name: 'Sangrur', state: 'Punjab', lat: 30.2458, lng: 75.8421 },
  ],
  Haryana: [
    { name: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
    { name: 'Hisar', state: 'Haryana', lat: 29.1492, lng: 75.7217 },
    { name: 'Ambala', state: 'Haryana', lat: 30.3782, lng: 76.7767 },
    { name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066 },
    { name: 'Sirsa', state: 'Haryana', lat: 29.5349, lng: 75.0296 },
    { name: 'Kurukshetra', state: 'Haryana', lat: 29.9695, lng: 76.8783 },
  ],
  'Uttar Pradesh': [
    { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
    { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
    { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
    { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
    { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
    { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
    { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 },
    { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732 },
  ],
  Karnataka: [
    { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
    { name: 'Dharwad', state: 'Karnataka', lat: 15.4589, lng: 75.0078 },
    { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
    { name: 'Mandya', state: 'Karnataka', lat: 12.5218, lng: 76.8951 },
    { name: 'Hassan', state: 'Karnataka', lat: 13.0072, lng: 76.0963 },
    { name: 'Davanagere', state: 'Karnataka', lat: 14.4644, lng: 75.9218 },
    { name: 'Ballari', state: 'Karnataka', lat: 15.1394, lng: 76.9214 },
    { name: 'Vijayapura', state: 'Karnataka', lat: 16.8302, lng: 75.7100 },
  ],
  'Tamil Nadu': [
    { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
    { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
    { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lng: 79.1378 },
    { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
    { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
    { name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172 },
  ],
  'Andhra Pradesh': [
    { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
    { name: 'Krishna (Vijayawada)', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
    { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 },
    { name: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lng: 77.6006 },
    { name: 'East Godavari', state: 'Andhra Pradesh', lat: 17.0005, lng: 81.8040 },
  ],
  Telangana: [
    { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
    { name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288 },
    { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941 },
    { name: 'Nalgonda', state: 'Telangana', lat: 17.0577, lng: 79.2684 },
    { name: 'Khammam', state: 'Telangana', lat: 17.2473, lng: 80.1514 },
  ],
  Rajasthan: [
    { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
    { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
    { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
    { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
    { name: 'Sri Ganganagar', state: 'Rajasthan', lat: 29.9038, lng: 73.8772 },
    { name: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346 },
  ],
  'West Bengal': [
    { name: 'Burdwan (Purba Bardhaman)', state: 'West Bengal', lat: 23.2324, lng: 87.8615 },
    { name: 'Hooghly', state: 'West Bengal', lat: 22.9038, lng: 88.3968 },
    { name: 'Nadia', state: 'West Bengal', lat: 23.4710, lng: 88.5565 },
    { name: 'Murshidabad', state: 'West Bengal', lat: 24.1759, lng: 88.2802 },
  ],
  Bihar: [
    { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
    { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647 },
    { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002 },
    { name: 'Samastipur', state: 'Bihar', lat: 25.8628, lng: 85.7811 },
  ],
};

export const INDIAN_STATES = Object.keys(STATE_DISTRICTS);

// Flattened list for backwards compatibility
export const AGRICULTURAL_DISTRICTS: DistrictCoord[] = Object.values(STATE_DISTRICTS).flat();

export function resolveCoordinates(input: string): { lat: number; lng: number; display: string } {
  if (!input || !input.trim()) {
    return { lat: 18.5204, lng: 73.8567, display: 'Pune, Maharashtra' };
  }

  const query = input.toLowerCase().trim();
  const match = AGRICULTURAL_DISTRICTS.find(d => 
    query.includes(d.name.toLowerCase()) || 
    query.includes(d.state.toLowerCase())
  );

  if (match) {
    return {
      lat: match.lat,
      lng: match.lng,
      display: `${match.name}, ${match.state}`,
    };
  }

  // If user entered numbers like "18.5, 73.8"
  const coordsMatch = input.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
  if (coordsMatch) {
    const lat = parseFloat(coordsMatch[1]);
    const lng = parseFloat(coordsMatch[3]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng, display: input };
    }
  }

  return {
    lat: 18.5204,
    lng: 73.8567,
    display: input.trim(),
  };
}

export const DISTRICT_TALUKAS: Record<string, Record<string, string[]>> = {
  Pune: {
    'Khed': ['Khedgaon', 'Rajgurunagar', 'Chakan', 'Alandi', 'Kadus', 'Wafgaon', 'Pait', 'Shelgaon'],
    'Haveli': ['Loni Kalbhor', 'Wagholi', 'Uruli Kanchan', 'Hadapsar Gramin', 'Khadakwasla', 'Theur', 'Manjari'],
    'Baramati': ['Baramati Gramin', 'Malegaon Khurd', 'Supa', 'Morgaon', 'Someshwar', 'Gunawadi', 'Karkhel'],
    'Junnar': ['Narayangaon', 'Alephata', 'Otur', 'Junnar Gramin', 'Brajur', 'Dingore', 'Aptale'],
    'Shirur': ['Shirur Gramin', 'Sanaswadi', 'Shikrapur', 'Nhavare', 'Mandavgan Farata', 'Pabal', 'Koregaon Bhima'],
    'Daund': ['Daund Gramin', 'Patas', 'Yawat', 'Kedgaon', 'Kashti', 'Rahu', 'Varvand'],
    'Ambegaon': ['Manchar', 'Ghodegaon', 'Kalamb', 'Dimbe', 'Awasari Khurd', 'Shinoli'],
    'Indapur': ['Indapur Gramin', 'Bhigwan', 'Bawada', 'Nimgaon Ketki', 'Anthurne', 'Shelgaon'],
    'Purandar': ['Saswad', 'Jejuri', 'Belsar', 'Walhe', 'Kumbharvalan', 'Diwa'],
    'Bhor': ['Bhor Gramin', 'Nasrapur', 'Shirwal Border', 'Utroli', 'Kari'],
    'Maval': ['Vadgaon Maval', 'Talegaon Dabhade', 'Kamshet', 'Kanhe', 'Takwe'],
    'Mulshi': ['Paud', 'Pirangut', 'Male', 'Mutha', 'Kolvan'],
  },
  Nashik: {
    'Nashik': ['Nashik Gramin', 'Gangapur', 'Deolali', 'Makhmalabad', 'Mhasrul'],
    'Dindori': ['Dindori Gramin', 'Vani', 'Nanashi', 'Mokhada Border'],
    'Niphad': ['Niphad Gramin', 'Pimpalgaon Baswant', 'Lasalgaon', 'Ranwad'],
    'Sinnar': ['Sinnar Gramin', 'Wavi', 'Musalgaon', 'Dubere'],
    'Malegaon': ['Malegaon Gramin', 'Zodge', 'Dabhadi', 'Ravalgon'],
    'Yeola': ['Yeola Gramin', 'Andarsul', 'Nagarsul', 'Patoda'],
  },
  Ahmednagar: {
    'Nagar': ['Ahmednagar Gramin', 'Bhalawani', 'Kedgaon', 'Nimbodi'],
    'Rahata': ['Babhaleshwar', 'Rahata Gramin', 'Loni', 'Shirdi Gramin'],
    'Sangamner': ['Sangamner Gramin', 'Ashwi', 'Talegaon', 'Sakur'],
    'Shrirampur': ['Shrirampur Gramin', 'Belapur', 'Taklibhan', 'Undirgaon'],
    'Kopargaon': ['Kopargaon Gramin', 'Pohegaon', 'Kolpewadi', 'Rawande'],
    'Newasa': ['Newasa Gramin', 'Kukana', 'Sonai', 'Bhende'],
  },
  Kolhapur: {
    'Karvir': ['Kaneri', 'Ujalaiwadi', 'Koparde', 'Chikhali', 'Hupari Border'],
    'Hatkanangale': ['Hatkanangale Gramin', 'Ichalkaranji Border', 'Hupari', 'Pattankodoli'],
    'Shirol': ['Shirol Gramin', 'Jaysingpur Border', 'Kurundwad', 'Narsingpur'],
    'Panhala': ['Panhala Gramin', 'Kodoli', 'Kote', 'Pore'],
  },
  Solapur: {
    'Solapur North': ['Kegaon', 'Bale', 'Degaon', 'Haglur'],
    'Solapur South': ['Mandrup', 'Boramani', 'Hotgi', 'Valsang'],
    'Pandharpur': ['Pandharpur Gramin', 'Karkamb', 'Tungat', 'Bhalwani'],
    'Barshi': ['Barshi Gramin', 'Vairag', 'Pangri', 'Upale'],
  },
  'Chhatrapati Sambhajinagar': {
    'Aurangabad': ['Aurangabad Gramin', 'Chittegaon', 'Waluj', 'Harsul'],
    'Paithan': ['Paithan Gramin', 'Bidkin', 'Pachod', 'Shevta'],
    'Gangapur': ['Gangapur Gramin', 'Lasur Station', 'Waluj Border'],
    'Vaijapur': ['Vaijapur Gramin', 'Shiur', 'Rotegaon'],
  },
};

export const TALUKA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Khed': { lat: 18.8550, lng: 73.9160 },
  'Khed (Rajgurunagar)': { lat: 18.8550, lng: 73.9160 },
  'Baramati': { lat: 18.1524, lng: 74.5772 },
  'Haveli': { lat: 18.5204, lng: 73.8567 },
  'Junnar': { lat: 19.2081, lng: 73.8767 },
  'Shirur': { lat: 18.8256, lng: 74.3789 },
  'Daund': { lat: 18.4650, lng: 74.5800 },
  'Ambegaon': { lat: 19.0142, lng: 73.9358 },
  'Indapur': { lat: 18.1158, lng: 75.0298 },
  'Purandar': { lat: 18.2783, lng: 74.0044 },
  'Bhor': { lat: 18.1489, lng: 73.8443 },
  'Maval': { lat: 18.7547, lng: 73.6844 },
  'Mulshi': { lat: 18.5089, lng: 73.5111 },
  // Nashik
  'Nashik': { lat: 19.9975, lng: 73.7898 },
  'Dindori': { lat: 20.2010, lng: 73.8340 },
  'Niphad': { lat: 20.0760, lng: 74.1080 },
  'Sinnar': { lat: 19.8450, lng: 74.0000 },
  'Malegaon': { lat: 20.5539, lng: 74.5312 },
  'Yeola': { lat: 20.0410, lng: 74.4890 },
};

export function getTalukaCoordinates(districtName: string, talukaName: string): { lat: number; lng: number } {
  if (TALUKA_COORDINATES[talukaName]) {
    return TALUKA_COORDINATES[talukaName];
  }
  const cleanName = talukaName.replace(/\s*\(.*\)/, '').trim();
  if (TALUKA_COORDINATES[cleanName]) {
    return TALUKA_COORDINATES[cleanName];
  }
  const found = AGRICULTURAL_DISTRICTS.find(d => d.name.toLowerCase() === districtName.toLowerCase());
  if (found) {
    return { lat: found.lat, lng: found.lng };
  }
  return { lat: 18.5204, lng: 73.8567 };
}

export function getTalukasForDistrict(districtName: string): string[] {
  const mapping = DISTRICT_TALUKAS[districtName];
  if (mapping) {
    return Object.keys(mapping);
  }
  // Generic talukas fallback
  return [
    `${districtName} Central`,
    `${districtName} North`,
    `${districtName} South`,
    `${districtName} East`,
    `${districtName} West`,
  ];
}

export function getVillagesForTaluka(districtName: string, talukaName: string): string[] {
  const distMapping = DISTRICT_TALUKAS[districtName];
  if (distMapping && distMapping[talukaName]) {
    return distMapping[talukaName];
  }
  // Generic villages fallback
  return [
    `${talukaName} Gavthan`,
    `${talukaName} Khurd`,
    `${talukaName} Budruk`,
    `${talukaName} Vasti`,
    `${talukaName} Wadi`,
  ];
}

export async function getCurrentGpsPosition(): Promise<LocationInfo> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        
        // Find nearest known district as baseline
        let nearest = AGRICULTURAL_DISTRICTS[0];
        let minDist = Infinity;
        for (const dist of AGRICULTURAL_DISTRICTS) {
          const d = Math.hypot(dist.lat - lat, dist.lng - lng);
          if (d < minDist) {
            minDist = d;
            nearest = dist;
          }
        }

        let village = 'Khedgaon';
        let taluka = 'Khed';
        let district = nearest.name;
        let state = nearest.state;

        // Try reverse geocoding via OpenStreetMap Nominatim with a fast timeout
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            village = addr.village || addr.suburb || addr.town || addr.hamlet || addr.neighbourhood || village;
            taluka = addr.county || addr.subdistrict || addr.state_district || taluka;
            district = addr.state_district || addr.district || district;
            state = addr.state || state;
          }
        } catch {
          // If network / Nominatim is slow or blocked, retain calculated district and defaults
        }

        const display = `${village}, ${taluka}, ${district}, ${state}`;

        resolve({
          lat,
          lng,
          display,
          name: village,
          village,
          taluka,
          district,
          state,
          source: 'gps',
        });
      },
      (err) => {
        reject(err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

export interface LocationSearchResult {
  id: string | number;
  name: string;
  secondary: string;
  lat: number;
  lng: number;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
}

export async function searchLocationOpenMeteo(query: string): Promise<LocationSearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const rawTokens = cleanQuery.split(/[,+\s]+/).map(t => t.trim()).filter(Boolean);
  const mainToken = rawTokens[0];
  const qualifiers = rawTokens.slice(1).map(q => q.toLowerCase());

  const results: LocationSearchResult[] = [];
  const seenKeys = new Set<string>();

  const addResult = (res: LocationSearchResult, priority: boolean = false) => {
    const key = `${res.lat.toFixed(3)}_${res.lng.toFixed(3)}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      if (priority) {
        results.unshift(res);
      } else {
        results.push(res);
      }
    }
  };

  // 1. Check local agricultural districts first
  for (const d of AGRICULTURAL_DISTRICTS) {
    const dLower = d.name.toLowerCase();
    const mainLower = mainToken.toLowerCase();
    if (dLower === mainLower || (dLower.includes(mainLower) && mainLower.length >= 3)) {
      addResult({
        id: `local_dist_${d.name}_${d.state}`,
        name: d.name,
        secondary: `${d.state}, India`,
        lat: d.lat,
        lng: d.lng,
        district: d.name,
        state: d.state,
      }, dLower === mainLower);
    }
  }

  // 2. Check local agricultural talukas and villages
  for (const [distName, talukaMap] of Object.entries(DISTRICT_TALUKAS)) {
    for (const [talukaName, villageList] of Object.entries(talukaMap)) {
      // Match village name
      for (const v of villageList) {
        const vLower = v.toLowerCase();
        const talukaLower = talukaName.toLowerCase();
        const distLower = distName.toLowerCase();

        const matchesMain = vLower.includes(mainToken.toLowerCase()) || mainToken.toLowerCase().includes(vLower);
        const matchesQualifiers = qualifiers.length === 0 || qualifiers.some(q =>
          distLower.includes(q) || talukaLower.includes(q) || 'maharashtra'.includes(q)
        );

        if (matchesMain && matchesQualifiers) {
          const coords = getTalukaCoordinates(distName, talukaName);
          addResult({
            id: `local_village_${v}_${talukaName}`,
            name: v,
            secondary: `${talukaName}, ${distName}, Maharashtra`,
            lat: coords.lat,
            lng: coords.lng,
            village: v,
            taluka: talukaName,
            district: distName,
            state: 'Maharashtra',
          }, true);
        }
      }

      // Match taluka name
      if (talukaName.toLowerCase().includes(mainToken.toLowerCase())) {
        const coords = getTalukaCoordinates(distName, talukaName);
        const distLower = distName.toLowerCase();
        const matchesQualifiers = qualifiers.length === 0 || qualifiers.some(q =>
          distLower.includes(q) || 'maharashtra'.includes(q)
        );
        if (matchesQualifiers) {
          addResult({
            id: `local_taluka_${talukaName}_${distName}`,
            name: talukaName,
            secondary: `${distName}, Maharashtra`,
            lat: coords.lat,
            lng: coords.lng,
            taluka: talukaName,
            district: distName,
            state: 'Maharashtra',
          }, true);
        }
      }
    }
  }

  // 2. Fetch from Open-Meteo Geocoding API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(mainToken)}&count=20&language=en&format=json`;
    const res = await fetch(openMeteoUrl, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data.results) ? data.results : [];

      for (const item of items) {
        if (item.country_code && item.country_code !== 'IN') continue;

        const admin1 = item.admin1 || ''; // State
        const admin2 = item.admin2 || ''; // District
        const admin3 = item.admin3 || ''; // Taluka / Tehsil
        const country = item.country || '';

        const secondaryParts = [admin3, admin2, admin1].filter(Boolean);
        const secondary = Array.from(new Set(secondaryParts)).join(', ');

        const itemStr = `${item.name} ${secondary}`.toLowerCase();
        const matchesQualifiers = qualifiers.length === 0 || qualifiers.some(q => itemStr.includes(q));

        addResult({
          id: item.id || `om_${item.latitude}_${item.longitude}`,
          name: item.name,
          secondary: secondary || country,
          lat: Number(item.latitude.toFixed(4)),
          lng: Number(item.longitude.toFixed(4)),
          village: item.feature_code === 'PPL' ? item.name : undefined,
          taluka: admin3 || admin2 || undefined,
          district: admin2 || admin1 || undefined,
          state: admin1 || undefined,
        }, matchesQualifiers);
      }
    }
  } catch (err) {
    console.warn('Open-Meteo geocoding search failed or timed out:', err);
  }

  // 3. Fallback: if compound query like "Baramati, Pune" or "Khed, Pune" yielded few results, also check second token
  if (results.length === 0 && qualifiers.length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const secondUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(qualifiers[0])}&count=10&language=en&format=json`;
      const res = await fetch(secondUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data.results) ? data.results : [];
        for (const item of items) {
          if (item.country_code && item.country_code !== 'IN') continue;
          const admin1 = item.admin1 || '';
          const admin2 = item.admin2 || '';
          const admin3 = item.admin3 || '';
          const secondary = Array.from(new Set([admin3, admin2, admin1].filter(Boolean))).join(', ');
          addResult({
            id: item.id || `om_${item.latitude}_${item.longitude}`,
            name: item.name,
            secondary,
            lat: Number(item.latitude.toFixed(4)),
            lng: Number(item.longitude.toFixed(4)),
            taluka: admin3 || undefined,
            district: admin2 || undefined,
            state: admin1 || undefined,
          });
        }
      }
    } catch {}
  }

  return results.slice(0, 8);
}


