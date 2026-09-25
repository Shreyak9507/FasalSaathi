import fetch from 'node-fetch';

async function testExtraction() {
  const endpoint = 'https://soilhealth4.dac.gov.in/graphql';

  // Get Maharashtra states
  const sRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'query GetState { getState }' })
  });
  const sData = await sRes.json();
  const maharashtra = (sData?.data?.getState || []).find(s => s.name?.toUpperCase() === 'MAHARASHTRA');

  const dRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query GetdistrictAndSubdistrictBystate($state: ID) {
        getdistrictAndSubdistrictBystate(state: $state)
      }`,
      variables: { state: maharashtra._id }
    })
  });
  const dData = await dRes.json();
  const pune = (dData?.data?.getdistrictAndSubdistrictBystate || []).find(d => d.name?.toUpperCase() === 'PUNE');

  const lRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query GetTestCenters($state: String, $district: String) {
        getTestCenters(state: $state, district: $district) {
          name
          address
          email
          STLdetails { phone }
          region
        }
      }`,
      variables: { state: maharashtra._id, district: pune._id }
    })
  });
  const lData = await lRes.json();
  const rawLabs = lData?.data?.getTestCenters || [];

  console.log(`Total labs in Pune: ${rawLabs.length}`);
  const farmerLat = 18.8550; // Khed, Pune
  const farmerLng = 73.9160;

  function haversine(lat1, lon1, lat2, lon2) {
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

  const processed = rawLabs.map((lab, idx) => {
    const coords = lab.region?.geolocation?.coordinates;
    let lat = null;
    let lng = null;
    let distanceKm = null;

    if (Array.isArray(coords) && coords.length >= 2) {
      const c0 = parseFloat(coords[0]);
      const c1 = parseFloat(coords[1]);
      if (!isNaN(c0) && !isNaN(c1)) {
        lat = Math.min(c0, c1);
        lng = Math.max(c0, c1);
        if (lat >= 6 && lat <= 38 && lng >= 68 && lng <= 98) {
          distanceKm = haversine(farmerLat, farmerLng, lat, lng);
        } else {
          lat = null;
          lng = null;
        }
      }
    }

    let type = 'Soil Testing Laboratory';
    const nameUpper = (lab.name || '').toUpperCase();
    if (nameUpper.includes('KVK') || nameUpper.includes('KRISHI VIGYAN')) type = 'KVK / ICAR';
    else if (nameUpper.includes('GOVT') || nameUpper.includes('DEPARTMENT') || nameUpper.includes('DISTRICT SOIL')) type = 'Government STL';
    else if (nameUpper.includes('COLLEGE') || nameUpper.includes('UNIVERSITY')) type = 'University / College';
    else if (nameUpper.includes('PVT') || nameUpper.includes('LTD') || nameUpper.includes('INDUSTRIES')) type = 'Private STL';

    return {
      id: `shc_lab_${idx}`,
      name: lab.name,
      type,
      address: lab.address || 'Address not listed on portal',
      phone: lab.STLdetails?.phone || null,
      email: lab.email || null,
      lat,
      lng,
      distanceKm,
      subdistrict: lab.region?.subdistrict?.name || null
    };
  });

  // Sort by distance
  processed.sort((a, b) => {
    if (a.distanceKm !== null && b.distanceKm !== null) return a.distanceKm - b.distanceKm;
    if (a.distanceKm !== null) return -1;
    if (b.distanceKm !== null) return 1;
    return 0;
  });

  console.log('\nTop 5 Closest Laboratories to Khed, Pune:');
  for (const lab of processed.slice(0, 5)) {
    console.log(`- ${lab.name}`);
    console.log(`  Distance: ${lab.distanceKm !== null ? `${lab.distanceKm} km` : 'Unknown'}`);
    console.log(`  Type: ${lab.type}`);
    console.log(`  Phone: ${lab.phone}`);
    console.log(`  Address: ${lab.address}`);
    console.log(`  Coords: ${lab.lat}, ${lab.lng}`);
  }
}

testExtraction().catch(console.error);
