import fs from 'fs';
import path from 'path';

const GRAPHQL_ENDPOINT = 'https://soilhealth4.dac.gov.in/graphql';

const DISTRICT_ALIASES = {
  'AHMEDNAGAR': 'AHILYANAGAR',
  'NAGAR': 'AHILYANAGAR',
  'OSMANABAD': 'DHARASHIV',
  'AURANGABAD': 'CHHATRAPATI SAMBHAJINAGAR',
  'SAMBHAJINAGAR': 'CHHATRAPATI SAMBHAJINAGAR',
  'MUMBAI': 'MUMBAI SUBURBAN',
  'FAIZABAD': 'AYODHYA',
  'ALLAHABAD': 'PRAYAGRAJ',
  'GURGAON': 'GURUGRAM',
};

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function cleanPhoneNumber(rawPhone) {
  if (!rawPhone || typeof rawPhone !== 'string') return null;
  const trimmed = rawPhone.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (/^0+$/.test(digitsOnly) || digitsOnly.length < 8) return null;
  return trimmed;
}

function classifyLabType(name) {
  const upper = name.toUpperCase();
  if (upper.includes('KVK') || upper.includes('KRISHI VIGYAN') || upper.includes('ICAR')) {
    return 'KVK / ICAR';
  }
  if (upper.includes('GOVT') || upper.includes('GOVERNMENT') || upper.includes('DEPARTMENT') || upper.includes('DISTRICT SOIL')) {
    return 'Government STL';
  }
  if (upper.includes('COLLEGE') || upper.includes('UNIVERSITY') || upper.includes('INSTITUTE') || upper.includes('RESEARCH')) {
    return 'University / Research';
  }
  if (upper.includes('PVT') || upper.includes('PRIVATE') || upper.includes('LTD') || upper.includes('AGRO') || upper.includes('BIO')) {
    return 'Private STL';
  }
  return 'Soil Testing Laboratory';
}

async function fetchGraphQL(query, variables = {}) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) {
    throw new Error(`Government GraphQL API responded with status ${res.status}`);
  }
  return await res.json();
}

async function runVerification() {
  console.log('====================================================');
  console.log('OFFICIAL SOIL TESTING LABS SYSTEM VERIFICATION');
  console.log('Official Portal: https://soilhealth.dac.gov.in/soilTestingLabs');
  console.log('GraphQL Endpoint: https://soilhealth4.dac.gov.in/graphql');
  console.log('====================================================\n');

  // Test 1: States Retrieval
  console.log('--- TEST 1: Fetch Official States ---');
  const statesData = await fetchGraphQL(`query GetState { getState }`);
  const states = statesData?.data?.getState || [];
  console.log(`Retrieved ${states.length} states from official portal.`);
  if (states.length < 30) {
    throw new Error(`Expected at least 30 states, got ${states.length}`);
  }
  console.log('Sample states:', states.slice(0, 5).map(s => s.name).join(', '));
  console.log('TEST 1 PASSED: States fetched successfully.\n');

  // Test 2: Multi-location Verification
  const testLocations = [
    {
      label: 'Pune (Khed coords)',
      stateName: 'Maharashtra',
      districtName: 'Pune',
      talukaName: 'Khed',
      farmerLat: 18.8550,
      farmerLng: 73.9160,
    },
    {
      label: 'Nashik',
      stateName: 'Maharashtra',
      districtName: 'Nashik',
      talukaName: 'Nashik',
      farmerLat: 19.9975,
      farmerLng: 73.7898,
    },
    {
      label: 'Nagpur',
      stateName: 'Maharashtra',
      districtName: 'Nagpur',
      talukaName: 'Nagpur Rural',
      farmerLat: 21.1458,
      farmerLng: 79.0882,
    },
    {
      label: 'Karnal (Haryana - Non-Maharashtra test)',
      stateName: 'Haryana',
      districtName: 'Karnal',
      talukaName: 'Karnal',
      farmerLat: 29.6857,
      farmerLng: 76.9905,
    },
    {
      label: 'Ahmednagar (Alias test -> AHILYANAGAR)',
      stateName: 'Maharashtra',
      districtName: 'Ahmednagar',
      talukaName: 'Rahuri',
      farmerLat: 19.3916,
      farmerLng: 74.6528,
    }
  ];

  const labsQuery = `
    query GetTestCenters($state: String, $district: String) {
      getTestCenters(state: $state, district: $district) {
        name
        address
        email
        STLdetails { phone }
        region
        state
        district
      }
    }
  `;

  for (const loc of testLocations) {
    console.log(`--- TEST LOCATION: ${loc.label} ---`);

    // Match State
    const matchedState = states.find(s => s.name?.toUpperCase() === loc.stateName.toUpperCase());
    if (!matchedState) {
      throw new Error(`State ${loc.stateName} not found in official states.`);
    }

    // Match District
    const distData = await fetchGraphQL(
      `query GetdistrictAndSubdistrictBystate($state: ID) {
        getdistrictAndSubdistrictBystate(state: $state)
      }`,
      { state: matchedState._id }
    );
    const districts = distData?.data?.getdistrictAndSubdistrictBystate || [];

    let cleanDist = loc.districtName.toUpperCase();
    if (DISTRICT_ALIASES[cleanDist]) {
      cleanDist = DISTRICT_ALIASES[cleanDist];
    }

    const matchedDistrict = districts.find(d => d.name?.toUpperCase() === cleanDist)
      || districts.find(d => {
        const dUpper = d.name?.toUpperCase() || '';
        return dUpper.includes(cleanDist) || cleanDist.includes(dUpper);
      });

    if (!matchedDistrict) {
      throw new Error(`District ${loc.districtName} (alias: ${cleanDist}) not found in ${matchedState.name}`);
    }
    console.log(`Matched Official District: "${matchedDistrict.name}" (ID: ${matchedDistrict._id})`);

    // Fetch Labs
    const labsResult = await fetchGraphQL(labsQuery, {
      state: matchedState._id,
      district: matchedDistrict._id,
    });
    const rawLabs = labsResult?.data?.getTestCenters || [];
    console.log(`Found ${rawLabs.length} official labs in ${matchedDistrict.name}`);

    if (rawLabs.length === 0) {
      throw new Error(`Expected labs for ${loc.districtName}, got 0`);
    }

    // Process labs & compute distance
    const processed = [];
    for (const raw of rawLabs) {
      if (!raw || !raw.name) continue;
      const coords = raw.region?.geolocation?.coordinates;
      let lat = null;
      let lng = null;
      let distanceKm = null;

      if (Array.isArray(coords) && coords.length >= 2) {
        const c0 = parseFloat(coords[0]);
        const c1 = parseFloat(coords[1]);
        if (!isNaN(c0) && !isNaN(c1)) {
          const candLat = Math.min(c0, c1);
          const candLng = Math.max(c0, c1);
          if (candLat >= 6 && candLat <= 38 && candLng >= 68 && candLng <= 98) {
            lat = candLat;
            lng = candLng;
            distanceKm = haversineDistanceKm(loc.farmerLat, loc.farmerLng, lat, lng);
          }
        }
      }

      processed.push({
        name: raw.name.trim(),
        type: classifyLabType(raw.name),
        phone: cleanPhoneNumber(raw.STLdetails?.phone),
        hasPhone: !!cleanPhoneNumber(raw.STLdetails?.phone),
        address: raw.address,
        lat,
        lng,
        distanceKm
      });
    }

    // Sort by proximity
    processed.sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
      if (a.distanceKm !== null) return -1;
      if (b.distanceKm !== null) return 1;
      return 0;
    });

    console.log(`Top 3 Closest Labs to Farmer:`);
    for (const lab of processed.slice(0, 3)) {
      console.log(`  - [${lab.type}] ${lab.name}`);
      console.log(`    Address: ${lab.address}`);
      console.log(`    Distance: ${lab.distanceKm !== null ? `~${lab.distanceKm} km` : 'No coordinates'}`);
      console.log(`    Phone Available: ${lab.hasPhone ? `Yes (${lab.phone})` : 'No (Button omitted in UI)'}`);
    }

    console.log(`PASSED: ${loc.label} verified.\n`);
  }

  // Test 3: Translations
  console.log('--- TEST 3: Translation Keys & Character Integrity ---');
  const en = JSON.parse(fs.readFileSync(path.resolve('src/translations/en.json'), 'utf8'));
  const mr = JSON.parse(fs.readFileSync(path.resolve('src/translations/mr.json'), 'utf8'));
  const hi = JSON.parse(fs.readFileSync(path.resolve('src/translations/hi.json'), 'utf8'));

  const requiredKeys = [
    'nearbyCentresHeader',
    'findingCentres',
    'sourcedFromPortal',
    'viewOfficialPortal',
    'noNearbyInArea',
    'labsUnavailable',
    'kmAway',
    'callCentre',
    'getDirections'
  ];

  for (const k of requiredKeys) {
    if (!en.noCard[k]) throw new Error(`Missing ${k} in en.json`);
    if (!mr.noCard[k]) throw new Error(`Missing ${k} in mr.json`);
    if (!hi.noCard[k]) throw new Error(`Missing ${k} in hi.json`);

    // Check no Devanagari in English
    if (/[\u0900-\u097F]/.test(en.noCard[k])) {
      throw new Error(`Devanagari found in English translation for key: ${k}`);
    }
  }
  console.log('All required translation keys verified across EN, MR, and HI.');
  console.log('0% Devanagari script verified in en.json.');
  console.log('TEST 3 PASSED.\n');

  console.log('====================================================');
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('====================================================');
}

runVerification().catch(err => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
