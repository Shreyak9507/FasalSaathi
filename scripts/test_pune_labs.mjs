import fetch from 'node-fetch';

async function testQueries() {
  const endpoint = 'https://soilhealth4.dac.gov.in/graphql';

  // 1. GetState
  console.log('--- Testing GetState ---');
  const res1 = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query GetState { getState }`
    })
  });
  const data1 = await res1.json();
  const states = data1?.data?.getState || [];
  console.log('States count:', states.length);
  const maharashtra = states.find(s => s.name?.toUpperCase() === 'MAHARASHTRA');
  console.log('Maharashtra State ID:', maharashtra);

  if (maharashtra) {
    // 2. Get districts for Maharashtra
    console.log('\n--- Testing GetdistrictAndSubdistrictBystate for Maharashtra ---');
    const res2 = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetdistrictAndSubdistrictBystate($state: ID) {
          getdistrictAndSubdistrictBystate(state: $state)
        }`,
        variables: { state: maharashtra._id }
      })
    });
    const data2 = await res2.json();
    const districts = data2?.data?.getdistrictAndSubdistrictBystate || [];
    console.log('Districts count:', districts.length);
    const puneDist = districts.find(d => d.name?.toUpperCase() === 'PUNE');
    console.log('Pune District ID:', puneDist);

    if (puneDist) {
      // 3. Get test centers for Pune
      console.log('\n--- Testing GetTestCenters for Pune District ---');
      const startTime = Date.now();
      const res3 = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query GetTestCenters($state: String, $district: String) {
            getTestCenters(state: $state, district: $district) {
              district
              email
              name
              STLdetails {
                phone
              }
              state
              region
              address
            }
          }`,
          variables: {
            state: maharashtra._id,
            district: puneDist._id
          }
        })
      });
      const data3 = await res3.json();
      console.log(`Fetched in ${Date.now() - startTime}ms`);
      const labs = data3?.data?.getTestCenters || [];
      console.log(`Labs in Pune (${labs.length}):`);
      for (const lab of labs.slice(0, 5)) {
        console.log({
          name: lab.name,
          phone: lab.STLdetails?.phone,
          email: lab.email,
          address: lab.address,
          regionCoords: lab.region?.geolocation?.coordinates,
          district: lab.district?.name || lab.district,
          state: lab.state?.name || lab.state,
        });
      }
    }
  }
}

testQueries().catch(console.error);
