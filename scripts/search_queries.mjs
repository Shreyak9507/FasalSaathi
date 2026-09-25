import fetch from 'node-fetch';

async function searchQueries() {
  const res = await fetch('https://soilhealth.dac.gov.in/assets/index-Ed_k0WPH.js');
  const text = await res.text();

  // Find all occurrences of query or mutation
  const gqlMatches = text.match(/query\s+[A-Za-z0-9_]+[^{]*\{[^}]+\}/g) || [];
  console.log('Short queries found:', gqlMatches.slice(0, 20));

  // Search for State or District queries
  const stateQueries = text.match(/query\s+[A-Za-z0-9_]*State[A-Za-z0-9_]*[^{]*\{/gi) || [];
  console.log('State queries:', stateQueries);

  const distQueries = text.match(/query\s+[A-Za-z0-9_]*District[A-Za-z0-9_]*[^{]*\{/gi) || [];
  console.log('District queries:', distQueries);

  // Look around the Su component (state/district dropdown)
  const suIdx = text.indexOf('Su=');
  if (suIdx !== -1) {
    console.log('Context of Su component:', text.slice(suIdx, suIdx + 1500));
  } else {
    // Search for Su definition
    const m = text.match(/\bSu\s*=\s*\([^)]*\)\s*=>/);
    if (m) {
      console.log('Su definition:', text.slice(m.index, m.index + 1500));
    }
  }
}

searchQueries().catch(console.error);
