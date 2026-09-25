import { NextRequest, NextResponse } from 'next/server';
import { OfficialSoilLab } from '@/types';

export const dynamic = 'force-dynamic';

const GRAPHQL_ENDPOINT = 'https://soilhealth4.dac.gov.in/graphql';

// In-memory cache for official government state and district IDs
let statesCache: Array<{ _id: string; name: string; code?: string }> | null = null;
const districtsCacheByStateId = new Map<string, Array<{ _id: string; name: string; code?: string }>>();

// District aliases for renamed districts in Maharashtra and other states
const DISTRICT_ALIASES: Record<string, string> = {
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

function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function cleanPhoneNumber(rawPhone: any): string | null {
  if (!rawPhone || typeof rawPhone !== 'string') return null;
  const trimmed = rawPhone.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');
  // Ignore dummy or all-zero phone numbers
  if (/^0+$/.test(digitsOnly) || digitsOnly.length < 8) return null;
  return trimmed;
}

function classifyLabType(name: string): string {
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

async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7500); // 7.5s timeout

  try {
    const res = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Government GraphQL API responded with status ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function getOfficialStates() {
  if (statesCache && statesCache.length > 0) return statesCache;

  const data = await fetchGraphQL(`query GetState { getState }`);
  const list = data?.data?.getState;
  if (Array.isArray(list)) {
    statesCache = list;
    return list;
  }
  return [];
}

async function getOfficialDistricts(stateId: string) {
  if (districtsCacheByStateId.has(stateId)) {
    return districtsCacheByStateId.get(stateId)!;
  }

  const data = await fetchGraphQL(
    `query GetdistrictAndSubdistrictBystate($state: ID) {
      getdistrictAndSubdistrictBystate(state: $state)
    }`,
    { state: stateId }
  );
  const list = data?.data?.getdistrictAndSubdistrictBystate;
  if (Array.isArray(list)) {
    districtsCacheByStateId.set(stateId, list);
    return list;
  }
  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateQuery = (searchParams.get('state') || 'Maharashtra').trim();
  const districtQuery = (searchParams.get('district') || '').trim();
  const talukaQuery = (searchParams.get('taluka') || '').trim();
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');

  const farmerLat = latStr ? parseFloat(latStr) : null;
  const farmerLng = lngStr ? parseFloat(lngStr) : null;

  try {
    // 1. Resolve State ID from Official Portal
    const states = await getOfficialStates();
    const cleanState = stateQuery.toUpperCase();
    const matchedState = states.find(s => s.name?.toUpperCase() === cleanState)
      || states.find(s => s.name?.toUpperCase().includes(cleanState) || cleanState.includes(s.name?.toUpperCase()))
      || states.find(s => s.name?.toUpperCase() === 'MAHARASHTRA');

    if (!matchedState) {
      return NextResponse.json({
        success: true,
        total: 0,
        labs: [],
        message: 'State not recognized on the Soil Health Card portal.',
        source: 'Soil Health Card Portal (Government of India)',
        sourceUrl: 'https://soilhealth.dac.gov.in/soilTestingLabs'
      });
    }

    // 2. Resolve District ID from Official Portal
    const districts = await getOfficialDistricts(matchedState._id);
    let cleanDist = districtQuery.toUpperCase();
    if (DISTRICT_ALIASES[cleanDist]) {
      cleanDist = DISTRICT_ALIASES[cleanDist];
    }

    const matchedDistrict = districts.find(d => d.name?.toUpperCase() === cleanDist)
      || districts.find(d => {
        const dUpper = d.name?.toUpperCase() || '';
        return dUpper.includes(cleanDist) || cleanDist.includes(dUpper);
      });

    // 3. Query Official Test Centers from GraphQL Endpoint
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

    let rawLabs: any[] = [];

    if (matchedDistrict) {
      const result = await fetchGraphQL(labsQuery, {
        state: matchedState._id,
        district: matchedDistrict._id,
      });
      rawLabs = result?.data?.getTestCenters || [];
    }

    // Fallback: If district query returned 0 or district was unmatched, fetch state-level labs
    if (rawLabs.length === 0) {
      const stateResult = await fetchGraphQL(labsQuery, {
        state: matchedState._id,
        district: null,
      });
      rawLabs = stateResult?.data?.getTestCenters || [];
    }

    // 4. Transform and enrich laboratory records
    const processedLabs: OfficialSoilLab[] = [];
    const seenNames = new Set<string>();

    for (let i = 0; i < rawLabs.length; i++) {
      const item = rawLabs[i];
      if (!item || !item.name) continue;

      const normName = item.name.trim();
      const dedupeKey = `${normName.toLowerCase()}_${item.address || ''}`;
      if (seenNames.has(dedupeKey)) continue;
      seenNames.add(dedupeKey);

      // Coordinates parsing from GeoJSON point
      let lat: number | null = null;
      let lng: number | null = null;
      let distanceKm: number | null = null;

      const coords = item.region?.geolocation?.coordinates;
      if (Array.isArray(coords) && coords.length >= 2) {
        const c0 = parseFloat(coords[0]);
        const c1 = parseFloat(coords[1]);
        if (!isNaN(c0) && !isNaN(c1)) {
          // Official portal logic: latitude is min(c0, c1), longitude is max(c0, c1) for India
          const candLat = Math.min(c0, c1);
          const candLng = Math.max(c0, c1);
          if (candLat >= 6 && candLat <= 38 && candLng >= 68 && candLng <= 98) {
            lat = candLat;
            lng = candLng;
            if (farmerLat !== null && farmerLng !== null && !isNaN(farmerLat) && !isNaN(farmerLng)) {
              distanceKm = haversineDistanceKm(farmerLat, farmerLng, lat, lng);
            }
          }
        }
      }

      processedLabs.push({
        id: `shc_${matchedDistrict?._id || matchedState._id}_${i}`,
        name: normName,
        type: classifyLabType(normName),
        address: item.address || `${matchedDistrict?.name || cleanDist}, ${matchedState.name}`,
        phone: cleanPhoneNumber(item.STLdetails?.phone),
        email: item.email || null,
        lat,
        lng,
        distanceKm,
        subdistrict: item.region?.subdistrict?.name || null,
        district: typeof item.district === 'string' ? item.district : (item.district?.name || matchedDistrict?.name || cleanDist),
        state: typeof item.state === 'string' ? item.state : (item.state?.name || matchedState.name),
      });
    }

    // 5. Sort Laboratories: Proximity First
    processedLabs.sort((a, b) => {
      // Taluka relevance boost if distance is equal
      const aTalukaMatch = talukaQuery && a.address.toLowerCase().includes(talukaQuery.toLowerCase()) ? 1 : 0;
      const bTalukaMatch = talukaQuery && b.address.toLowerCase().includes(talukaQuery.toLowerCase()) ? 1 : 0;

      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      if (a.distanceKm !== null) return -1;
      if (b.distanceKm !== null) return 1;

      return bTalukaMatch - aTalukaMatch;
    });

    return NextResponse.json({
      success: true,
      total: processedLabs.length,
      state: matchedState.name,
      district: matchedDistrict?.name || cleanDist,
      source: 'Soil Health Card Portal (Government of India)',
      sourceUrl: 'https://soilhealth.dac.gov.in/soilTestingLabs',
      labs: processedLabs,
    });
  } catch (err: any) {
    console.error('Failed to fetch testing labs from official Soil Health Card portal:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Soil testing laboratory information is temporarily unavailable from the official portal.',
        sourceUrl: 'https://soilhealth.dac.gov.in/soilTestingLabs',
      },
      { status: 503 }
    );
  }
}
