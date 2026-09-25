import fetch from 'node-fetch';

async function testEndpoint() {
  console.log('Testing https://soilhealth4.dac.gov.in/graphql ...');

  const query = `
    query GetTestCenters($state: String, $district: String) {
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
    }
  `;

  try {
    const res = await fetch('https://soilhealth4.dac.gov.in/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        query,
        variables: { state: null, district: null }
      })
    });
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const data = await res.json();
    console.log('Data:', JSON.stringify(data).slice(0, 1000));
  } catch (err) {
    console.error('Request failed:', err);
  }
}

testEndpoint().catch(console.error);
