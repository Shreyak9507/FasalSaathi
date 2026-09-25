import fetch from 'node-fetch';

async function checkApollo() {
  const res = await fetch('https://soilhealth.dac.gov.in/assets/index-Ed_k0WPH.js');
  const text = await res.text();

  const idx = text.indexOf('soilhealth4.dac.gov.in');
  if (idx !== -1) {
    console.log('Context around soilhealth4.dac.gov.in:');
    console.log(text.slice(Math.max(0, idx - 400), idx + 400));
  } else {
    console.log('soilhealth4.dac.gov.in not found');
  }
}

checkApollo().catch(console.error);
