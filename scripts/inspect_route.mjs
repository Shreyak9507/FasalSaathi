import fetch from 'node-fetch';

async function inspectRoute() {
  const res = await fetch('https://soilhealth.dac.gov.in/assets/index-Ed_k0WPH.js');
  const text = await res.text();

  let idx = 0;
  while ((idx = text.indexOf('soilTestingLabs', idx)) !== -1) {
    console.log(`\n=== Occurrence of 'soilTestingLabs' at ${idx} ===`);
    const start = Math.max(0, idx - 500);
    const end = Math.min(text.length, idx + 1500);
    console.log(text.slice(start, end));
    idx += 'soilTestingLabs'.length;
  }
}

inspectRoute().catch(console.error);
