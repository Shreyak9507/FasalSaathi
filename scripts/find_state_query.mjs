import fetch from 'node-fetch';

async function testStateQuery() {
  const res = await fetch('https://soilhealth.dac.gov.in/assets/index-Ed_k0WPH.js');
  const text = await res.text();

  const idx = text.indexOf('query GetState');
  if (idx !== -1) {
    console.log('GetState query:');
    console.log(text.slice(idx, idx + 400));
  }

  const idx2 = text.indexOf('query GetdistrictAndSubdistrictBystate');
  if (idx2 !== -1) {
    console.log('GetDistrict query:');
    console.log(text.slice(idx2, idx2 + 400));
  }
}

testStateQuery().catch(console.error);
