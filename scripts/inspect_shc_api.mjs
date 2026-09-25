import fetch from 'node-fetch';

async function inspect() {
  console.log('Fetching main bundle from soilhealth.dac.gov.in...');
  const res = await fetch('https://soilhealth.dac.gov.in/assets/index-Ed_k0WPH.js');
  const text = await res.text();
  console.log('Bundle length:', text.length);

  // Look for baseUrl or axios / fetch configuration
  const baseMatches = text.match(/baseURL\s*[:=]\s*['"`]([^'"`]+)['"`]/gi) || [];
  console.log('baseURL matches:', baseMatches);

  // Look for urls
  const apiMatches = text.match(/https?:\/\/soilhealth[^\s"'`]+/g) || [];
  console.log('soilhealth URLs found:', [...new Set(apiMatches)]);

  // Look for strings containing "Lab" or "soilTesting"
  const regexes = [
    /["'`](\/[^"'`]*lab[^"'`]*)["'`]/gi,
    /["'`](\/[^"'`]*soil[^"'`]*)["'`]/gi,
    /["'`](\/api\/[^"'`]*)["'`]/gi,
    /["'`](https?:\/\/[^"'`]*lab[^"'`]*)["'`]/gi
  ];

  for (const r of regexes) {
    const matches = [];
    let m;
    while ((m = r.exec(text)) !== null) {
      matches.push(m[1]);
    }
    console.log(`Matches for ${r}:`, [...new Set(matches)].slice(0, 20));
  }

  // Look for dynamic imports or chunks
  const chunkMatches = text.match(/\/assets\/[^"'`]+\.js/g) || [];
  console.log('Other chunks:', [...new Set(chunkMatches)]);
}

inspect().catch(console.error);
