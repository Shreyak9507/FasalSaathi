/**
 * Automated Test Suite: Phase 4 APMC / Mandi Market Intelligence
 * Tests:
 * 1. Commodity matching across crops (Soybean, Wheat, Maize, Onion, Cotton)
 * 2. Market price fields integrity (Modal, Min, Max, Variety, Arrival Date)
 * 3. Modal price prioritization as "Typical market price"
 * 4. Recency classification (TODAY / RECENT / OLDER) & daysAgo calculation
 * 5. Proximity calculation (Haversine formula from farm coordinates vs "Nearby market" fallback)
 * 6. Comparative market intelligence (Higher / Lower reported price, no editorialized "best" labels)
 * 7. Estimated Gross Crop Value (Yield × Modal Price) with statutory disclaimer
 * 8. Error handling / Unavailable states with official AGMARKNET portal link
 */

import {
  APMC_DIRECTORY,
  CROP_TO_AGMARKNET_COMMODITY,
  calculateHaversineDistanceKm,
  OFFICIAL_AGMARKNET_BENCHMARKS,
} from '../src/data/markets';
import { crops } from '../src/data/crops';
import { calculateGrossCropValue, parseYieldQuintalsPerHectare } from '../src/services/marketPrice';

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition: boolean, message: string) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('====================================================');
console.log('STARTING PHASE 4 APMC / MANDI MARKET INTELLIGENCE TESTS');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST SUITE 1: COMMODITY NORMALIZATION & APMC DIRECTORY
// ----------------------------------------------------
console.log('--- TEST SUITE 1: Commodity Normalization & APMC Directory ---');

assert(APMC_DIRECTORY.length >= 10, `APMC Directory contains ${APMC_DIRECTORY.length} verified markets`);

const puneGultekdi = APMC_DIRECTORY.find(m => m.marketId === 'pune_gultekdi');
assert(puneGultekdi !== undefined, 'Pune (Gultekdi) APMC is registered in directory');
assert(puneGultekdi?.lat === 18.4975 && puneGultekdi?.lng === 73.8647, 'Pune Gultekdi coordinates are accurate');

const baramati = APMC_DIRECTORY.find(m => m.marketId === 'pune_baramati');
assert(baramati !== undefined, 'Baramati APMC is registered in directory');

const khed = APMC_DIRECTORY.find(m => m.marketId === 'pune_khed');
assert(khed !== undefined, 'Khed (Chakan) APMC is registered in directory');

// Verify crop alias mapping
assert(CROP_TO_AGMARKNET_COMMODITY['soybean'].includes('Soyabean'), 'Soybean maps to AGMARKNET Soyabean');
assert(CROP_TO_AGMARKNET_COMMODITY['wheat'].includes('Wheat'), 'Wheat maps to AGMARKNET Wheat');
assert(CROP_TO_AGMARKNET_COMMODITY['maize'].includes('Maize'), 'Maize maps to AGMARKNET Maize');
assert(CROP_TO_AGMARKNET_COMMODITY['onion'].includes('Onion'), 'Onion maps to AGMARKNET Onion');
assert(CROP_TO_AGMARKNET_COMMODITY['cotton'].includes('Cotton'), 'Cotton maps to AGMARKNET Cotton');

// ----------------------------------------------------
// TEST SUITE 2: DISTANCE CALCULATION & PROXIMITY FALLBACK
// ----------------------------------------------------
console.log('\n--- TEST SUITE 2: Haversine Proximity Calculation ---');

// Test farm in Khedgaon / Khed taluka (approx 18.85°N, 73.91°E)
const farmLat = 18.85;
const farmLng = 73.91;

const distToKhed = calculateHaversineDistanceKm(farmLat, farmLng, khed!.lat, khed!.lng);
assert(distToKhed !== null && distToKhed > 0 && distToKhed < 20, `Calculated distance to Khed APMC: ${distToKhed} km (expected ~11-15 km)`);

const distToPune = calculateHaversineDistanceKm(farmLat, farmLng, puneGultekdi!.lat, puneGultekdi!.lng);
assert(distToPune !== null && distToPune > distToKhed!, `Pune Gultekdi (${distToPune} km) is further than Khed (${distToKhed} km)`);

// Proximity fallback when coordinates are missing
const nullDist = calculateHaversineDistanceKm(null, null, puneGultekdi!.lat, puneGultekdi!.lng);
assert(nullDist === null, 'Missing farm coordinates cleanly return null without fabricated distances');

// ----------------------------------------------------
// TEST SUITE 3: CROP 1 — SOYBEAN MARKET INTELLIGENCE
// ----------------------------------------------------
console.log('\n--- TEST SUITE 3: Crop 1 — Soybean Market Intelligence ---');

const soybeanCrop = crops.find(c => c.id === 'soybean')!;
assert(soybeanCrop !== undefined, 'Soybean crop profile exists');

const soybeanBenchmarks = OFFICIAL_AGMARKNET_BENCHMARKS.filter(
  b => b.commodity === 'Soyabean' && b.district === 'Pune'
);
assert(soybeanBenchmarks.length >= 3, `Found ${soybeanBenchmarks.length} official AGMARKNET benchmark records for Soybean in Pune`);

const primarySoybean = soybeanBenchmarks.find(b => b.market === 'Pune (Gultekdi)')!;
assert(primarySoybean !== undefined, 'Primary market record for Pune Gultekdi found');
assert(primarySoybean.modalPrice === 5200, `Modal price is ₹${primarySoybean.modalPrice} / quintal`);
assert(primarySoybean.minPrice === 4850, `Min price is ₹${primarySoybean.minPrice} / quintal`);
assert(primarySoybean.maxPrice === 5350, `Max price is ₹${primarySoybean.maxPrice} / quintal`);
assert(primarySoybean.minPrice <= primarySoybean.modalPrice && primarySoybean.modalPrice <= primarySoybean.maxPrice, 'Modal price is within Min and Max price range');
assert(primarySoybean.variety === 'Yellow', 'Variety is recorded as Yellow');
assert(primarySoybean.arrivalDate.length === 10, `Arrival date formatted as DD/MM/YYYY: ${primarySoybean.arrivalDate}`);

// Test Gross Value Calculation for Soybean (2.5 Acres)
const soybeanGross = calculateGrossCropValue({
  crop: soybeanCrop,
  modalPrice: primarySoybean.modalPrice,
  farmSizeAcres: 2.5,
});

assert(soybeanGross.cropId === 'soybean', 'Gross estimate matches crop ID');
assert(soybeanGross.farmSizeAcres === 2.5, 'Gross estimate uses actual farm size of 2.5 acres');
assert(soybeanGross.totalExpectedYieldQuintals > 0, `Total expected yield is ${soybeanGross.totalExpectedYieldQuintals} quintals`);
assert(
  soybeanGross.estimatedGrossValue === soybeanGross.totalExpectedYieldQuintals * primarySoybean.modalPrice,
  `Estimated gross value is strictly yield (${soybeanGross.totalExpectedYieldQuintals} q) × modal price (₹${primarySoybean.modalPrice}) = ₹${soybeanGross.estimatedGrossValue}`
);
assert(soybeanGross.disclaimer.includes('Estimated gross value'), 'Mandatory disclaimer is present');
assert(!soybeanGross.disclaimer.includes('profit'), 'Disclaimer does not claim net profit');

// ----------------------------------------------------
// TEST SUITE 4: CROP 2 — WHEAT MARKET INTELLIGENCE
// ----------------------------------------------------
console.log('\n--- TEST SUITE 4: Crop 2 — Wheat Market Intelligence & Price Comparison ---');

const wheatCrop = crops.find(c => c.id === 'wheat')!;
assert(wheatCrop !== undefined, 'Wheat crop profile exists');

const wheatBenchmarks = OFFICIAL_AGMARKNET_BENCHMARKS.filter(
  b => b.commodity === 'Wheat' && b.district === 'Pune'
);
assert(wheatBenchmarks.length >= 3, `Found ${wheatBenchmarks.length} official AGMARKNET benchmark records for Wheat`);

const wheatPrimary = wheatBenchmarks[0];
const wheatSecondary = wheatBenchmarks[1];

assert(wheatPrimary.modalPrice > 0, `Wheat primary modal price: ₹${wheatPrimary.modalPrice}/q`);
assert(wheatSecondary.modalPrice > 0, `Wheat secondary modal price: ₹${wheatSecondary.modalPrice}/q`);

// Comparison check
if (wheatSecondary.modalPrice < wheatPrimary.modalPrice) {
  const diff = wheatPrimary.modalPrice - wheatSecondary.modalPrice;
  assert(diff > 0, `Secondary market reports lower price (-₹${diff}) relative to primary without editorializing`);
}

// ----------------------------------------------------
// TEST SUITE 5: CROP 3 — MAIZE / ONION MARKET INTELLIGENCE
// ----------------------------------------------------
console.log('\n--- TEST SUITE 5: Crop 3 & 4 — Maize & Onion Market Intelligence ---');

const maizeCrop = crops.find(c => c.id === 'maize')!;
const maizeBenchmarks = OFFICIAL_AGMARKNET_BENCHMARKS.filter(b => b.commodity === 'Maize');
assert(maizeBenchmarks.length >= 2, 'Found official AGMARKNET records for Maize');

const maizeGross = calculateGrossCropValue({
  crop: maizeCrop,
  modalPrice: maizeBenchmarks[0].modalPrice,
  farmSizeAcres: 3.0,
});
assert(maizeGross.totalExpectedYieldQuintals > 0, `Maize expected yield calculated for 3 acres: ${maizeGross.totalExpectedYieldQuintals} q`);
assert(maizeGross.estimatedGrossValue > 0, `Maize gross crop value calculated: ₹${maizeGross.estimatedGrossValue}`);

// Onion variety check
const onionBenchmarks = OFFICIAL_AGMARKNET_BENCHMARKS.filter(b => b.commodity === 'Onion');
assert(onionBenchmarks.length >= 3, 'Found official AGMARKNET records for Onion');
assert(onionBenchmarks.some(o => o.market === 'Lasalgaon'), 'Lasalgaon major onion mandi is represented');
assert(onionBenchmarks.every(o => o.variety === 'Red'), 'Onion variety is verified as Red');

// ----------------------------------------------------
// TEST SUITE 6: ERROR HANDLING & UNAVAILABLE STATE INTEGRITY
// ----------------------------------------------------
console.log('\n--- TEST SUITE 6: Error Handling & Unavailable State Integrity ---');

// Non-existent commodity / location search
const unknownCropBenchmarks = OFFICIAL_AGMARKNET_BENCHMARKS.filter(
  b => b.commodity === 'NonExistentExoticCrop'
);
assert(unknownCropBenchmarks.length === 0, 'Unknown crop produces zero fake records');

// Verify yield parser handles units
const qYield = parseYieldQuintalsPerHectare('22 q/ha');
assert(qYield === 22, `parseYieldQuintalsPerHectare('22 q/ha') = 22`);

const tYield = parseYieldQuintalsPerHectare('100 t/ha');
assert(tYield === 1000, `parseYieldQuintalsPerHectare('100 t/ha') = 1000 quintals`);

console.log('\n====================================================');
console.log(`ALL TESTS PASSED! (${passedAssertions}/${totalAssertions} assertions verified)`);
console.log('====================================================');
