import fetch from 'node-fetch';

async function testStateFallback() {
  const endpoint = 'https://soilhealth4.dac.gov.in/graphql';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query GetTestCenters($state: String, $district: String) {
        getTestCenters(state: $state, district: $district) {
          name
          STLdetails { phone }
        }
      }`,
      variables: { state: '63f9322a89d86ca9e2bca5df', district: null }
    })
  });
  const data = await res.json();
  console.log('Labs for Maharashtra state total:', (data?.data?.getTestCenters || []).length);
}

testStateFallback().catch(console.error);
