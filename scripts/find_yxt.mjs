import fetch from 'node-fetch';

async function findComponent() {
  const res = await fetch('https://soilhealth.dac.gov.in/assets/index-Ed_k0WPH.js');
  const text = await res.text();

  const patterns = [
    /function\s+yxt\b/,
    /\byxt\s*=\s*(function|\([^)]*\)\s*=>)/,
    /\bconst\s+yxt\s*=/,
    /\blet\s+yxt\s*=/,
    /\bvar\s+yxt\s*=/
  ];

  for (const p of patterns) {
    const match = p.exec(text);
    if (match) {
      console.log(`Found pattern ${p} at ${match.index}:`);
      console.log(text.slice(match.index, match.index + 3000));
      return;
    }
  }

  // Fallback search
  let idx = 0;
  while ((idx = text.indexOf('yxt', idx)) !== -1) {
    const slice = text.slice(Math.max(0, idx - 20), Math.min(text.length, idx + 40));
    if (slice.includes('component:yxt') || slice.includes('yxt=')) {
      console.log(`yxt occurrence at ${idx}:`, text.slice(Math.max(0, idx - 50), Math.min(text.length, idx + 200)));
    }
    idx += 3;
  }
}

findComponent().catch(console.error);
