import fetch from 'node-fetch';

async function testOtherDistricts() {
  const endpoint = 'https://soilhealth4.dac.gov.in/graphql';

  // Get states
  const sRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'query GetState { getState }' })
  });
  const sData = await sRes.json();
  const states = sData?.data?.getState || [];

  const testCases = [
    { stateName: 'MAHARASHTRA', districtName: 'NASHIK' },
    { stateName: 'MAHARASHTRA', districtName: 'NAGPUR' },
    { stateName: 'HARYANA', districtName: 'KARNAL' },
  ];

  for (const tc of testCases) {
    console.log(`\n=== Testing ${tc.stateName} -> ${tc.districtName} ===`);
    const st = states.find(s => s.name?.toUpperCase() === tc.stateName);
    if (!st) {
      console.log('State not found:', tc.stateName);
      continue;
    }

    const dRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetdistrictAndSubdistrictBystate($state: ID) {
          getdistrictAndSubdistrictBystate(state: $state)
        }`,
        variables: { state: st._id }
      })
    });
    const dData = await dRes.json();
    const districts = dData?.data?.getdistrictAndSubdistrictBystate || [];
    const dist = districts.find(d => d.name?.toUpperCase() === tc.districtName);
    if (!dist) {
      console.log('District not found:', tc.districtName);
      continue;
    }

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
        variables: { state: st._id, district: dist._id }
      })
    });
    const lData = await lRes.json();
    const labs = lData?.data?.getTestCenters || [];
    console.log(`Found ${labs.length} laboratories in ${tc.districtName}:`);
    for (const lab of labs.slice(0, 3)) {
      console.log(`  - ${lab.name} | Phone: ${lab.STLdetails?.phone || 'N/A'} | Coords:`, lab.region?.geolocation?.coordinates);
    }
  }
}

testOtherDistricts().catch(console.error);
