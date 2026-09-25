/**
 * Direct Integration Test for /api/market-prices route handler
 */

import { NextRequest } from 'next/server';
import { GET } from '../src/app/api/market-prices/route';

async function runRouteTests() {
  console.log('Testing GET /api/market-prices route handler...');

  // Test 1: Soybean in Pune with coordinates (Khedgaon, Pune: 18.855, 73.916)
  const req1 = new NextRequest(
    'http://localhost:3000/api/market-prices?crop=soybean&state=Maharashtra&district=Pune&lat=18.855&lng=73.916'
  );
  const res1 = await GET(req1);
  const json1 = await res1.json();

  if (!json1.isAvailable) throw new Error('Soybean Pune should be available');
  if (!json1.primaryMarket) throw new Error('Primary market should be present');
  console.log('✓ Test 1 Passed: Primary market for Soybean:', json1.primaryMarket.apmcName, 'Modal Price:', json1.primaryMarket.modalPrice, 'Distance:', json1.primaryMarket.distanceLabel);
  console.log('  Nearby markets count:', json1.nearbyMarkets.length);

  // Test 2: Wheat in Pune without coordinates
  const req2 = new NextRequest(
    'http://localhost:3000/api/market-prices?crop=wheat&state=Maharashtra&district=Pune'
  );
  const res2 = await GET(req2);
  const json2 = await res2.json();

  if (!json2.isAvailable) throw new Error('Wheat Pune should be available');
  if (json2.primaryMarket.distanceKm !== null) throw new Error('Distance should be null without coordinates');
  if (json2.primaryMarket.distanceLabel !== 'Nearby market') throw new Error('Distance label should be "Nearby market"');
  console.log('✓ Test 2 Passed: Wheat fallback proximity label is:', json2.primaryMarket.distanceLabel);

  // Test 3: Unknown / unsupported crop
  const req3 = new NextRequest(
    'http://localhost:3000/api/market-prices?crop=unknowncrop123&state=Maharashtra&district=Pune'
  );
  const res3 = await GET(req3);
  const json3 = await res3.json();

  if (json3.isAvailable !== false) throw new Error('Unknown crop should not be available');
  if (json3.primaryMarket !== null) throw new Error('Unknown crop should have null primary market');
  if (!json3.officialSourceUrl.includes('agmarknet.gov.in')) throw new Error('Official portal link must be present');
  console.log('✓ Test 3 Passed: Unknown crop gracefully returns unavailable state with official link:', json3.officialSourceUrl);

  console.log('\nAll API route handler integration tests passed successfully!');
}

runRouteTests().catch(err => {
  console.error('Route test failed:', err);
  process.exit(1);
});
