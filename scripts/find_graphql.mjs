import fetch from 'node-fetch';

async function findGraphQL() {
  const res = await fetch('https://soilhealth.dac.gov.in/assets/index-Ed_k0WPH.js');
  const text = await res.text();

  // Find vxt definition
  const vxtMatch = text.match(/\bvxt\s*=\s*([^;]+);/);
  if (vxtMatch) {
    console.log('vxt match:', vxtMatch[0]);
  } else {
    // Search around index 2663237
    const slice = text.slice(2660000, 2664000);
    console.log('Context around yxt:', slice);
  }

  // Find uri or ApolloClient or createHttpLink or /graphql
  const gqlMatches = text.match(/https?:\/\/[^\s"'`]*graphql[^\s"'`]*/gi) || [];
  console.log('GraphQL URLs:', gqlMatches);

  const uriMatches = text.match(/uri\s*:\s*["'`][^"'`]+["'`]/gi) || [];
  console.log('URI matches:', uriMatches);

  // Look for getTestCenters query text
  const getTestCentersIdx = text.indexOf('getTestCenters');
  if (getTestCentersIdx !== -1) {
    console.log('getTestCenters context:', text.slice(Math.max(0, getTestCentersIdx - 300), getTestCentersIdx + 500));
  }
}

findGraphQL().catch(console.error);
