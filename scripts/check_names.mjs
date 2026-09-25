import fetch from 'node-fetch';

async function checkNames() {
  const endpoint = 'https://soilhealth4.dac.gov.in/graphql';

  const sRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'query GetState { getState }' })
  });
  const sData = await sRes.json();
  const states = sData?.data?.getState || [];
  console.log('States:', states.map(s => ({ id: s._id, name: s.name, code: s.code })));

  const mh = states.find(s => s.name?.toUpperCase() === 'MAHARASHTRA');
  if (mh) {
    const dRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetdistrictAndSubdistrictBystate($state: ID) {
          getdistrictAndSubdistrictBystate(state: $state)
        }`,
        variables: { state: mh._id }
      })
    });
    const dData = await dRes.json();
    const districts = dData?.data?.getdistrictAndSubdistrictBystate || [];
    console.log('Districts in Maharashtra:', districts.map(d => ({ id: d._id, name: d.name })));
  }
}

checkNames().catch(console.error);
