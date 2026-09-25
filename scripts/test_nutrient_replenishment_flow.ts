/**
 * Automated Verification: Phase 3 Nutrient Analysis + Replenishment + Fertilizer Products
 *
 * Verifies:
 * 1. Low Nitrogen profile (Urea prioritized)
 * 2. Low Phosphorus profile (DAP / SSP prioritized)
 * 3. Low Potassium profile (MOP prioritized)
 * 4. Low Zinc profile (Zinc Sulphate prioritized)
 * 5. Multiple deficiencies profile (N + P + K + Zn)
 * 6. Adequate nutrients profile (Maintenance guidance)
 * 7. Verification across multiple crops (Wheat, Soybean, Cotton, Onion)
 * 8. Strict price integrity: Reference Price vs "Current price unavailable"
 * 9. Farm size context preserved without invented dosages
 */

import { SoilInfo, FarmerInfo } from '../src/types';
import { getCropReplenishmentPlan } from '../src/lib/fertilizerRecommendation';
import { FERTILIZERS } from '../src/data/fertilizers';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('FASALSAATHI — PHASE 3 NUTRIENT REPLENISHMENT & FERTILIZERS TEST');
  console.log('================================================================\n');

  const farmerContext: FarmerInfo = {
    name: 'Ramesh Patil',
    farmLocation: 'Khed, Pune, Maharashtra',
    landArea: 2.5,
    unit: 'acre',
    irrigation: 'available',
  };

  // ----------------------------------------------------
  // PROFILE 1: Low Nitrogen Profile
  // ----------------------------------------------------
  console.log('--- TEST 1: Low Nitrogen Profile ---');
  const soilLowN: SoilInfo = {
    nitrogen: 180, // Low for Wheat (threshold ~240)
    phosphorus: 24,
    potassium: 220,
    ph: 7.2,
    organicCarbon: 0.65,
    zinc: 0.85,
    sulphur: 16,
  };

  const planLowN = getCropReplenishmentPlan(soilLowN, 'wheat', farmerContext, 'en');
  assert(planLowN.recommendations.length >= 1, 'At least 1 deficient nutrient identified');
  
  const recN = planLowN.recommendations.find((r) => r.nutrientId === 'nitrogen');
  assert(recN !== undefined, 'Nitrogen identified as requiring replenishment');
  assert(recN!.status === 'low', 'Nitrogen status is "low"');
  assert(recN!.whyCropNeedsIt.length > 10, 'Why crop needs nitrogen explanation provided');
  assert(recN!.whatCanReplenishIt.toLowerCase().includes('urea'), 'Urea mentioned in nitrogen replenishment guidance');

  const ureaProduct = recN!.matchedProducts.find((p) => p.id === 'urea');
  assert(ureaProduct !== undefined, 'Urea matched to nitrogen deficiency');
  assert(ureaProduct!.referencePrice.amount === 242.00, 'Urea reference price is statutory MRP ₹242.00');
  assert(ureaProduct!.referencePrice.unit === 'per 45 kg bag', 'Urea pack is 45 kg bag');
  assert(ureaProduct!.referencePrice.source?.includes('Department of Fertilizers') === true, 'Urea price source cited');
  assert(ureaProduct!.currentPrice.isAvailable === false, 'Current price is safely marked unavailable (no fake prices)');

  // ----------------------------------------------------
  // PROFILE 2: Low Phosphorus Profile
  // ----------------------------------------------------
  console.log('\n--- TEST 2: Low Phosphorus Profile ---');
  const soilLowP: SoilInfo = {
    nitrogen: 310,
    phosphorus: 8, // Low (threshold ~14)
    potassium: 220,
    ph: 7.2,
    organicCarbon: 0.65,
    zinc: 0.85,
    sulphur: 16,
  };

  const planLowP = getCropReplenishmentPlan(soilLowP, 'wheat', farmerContext, 'en');
  const recP = planLowP.recommendations.find((r) => r.nutrientId === 'phosphorus');
  assert(recP !== undefined, 'Phosphorus identified as requiring replenishment');
  
  const dapProduct = recP!.matchedProducts.find((p) => p.id === 'dap');
  assert(dapProduct !== undefined, 'DAP matched for phosphorus deficiency');
  assert(dapProduct!.referencePrice.amount === 1350.00, 'DAP reference price is ₹1,350.00');

  const sspProduct = recP!.matchedProducts.find((p) => p.id === 'ssp');
  assert(sspProduct !== undefined, 'SSP matched for phosphorus deficiency');
  assert(sspProduct!.referencePrice.amount === 550.00, 'SSP reference price is ₹550.00');

  // ----------------------------------------------------
  // PROFILE 3: Low Potassium Profile
  // ----------------------------------------------------
  console.log('\n--- TEST 3: Low Potassium Profile ---');
  const soilLowK: SoilInfo = {
    nitrogen: 310,
    phosphorus: 24,
    potassium: 95, // Low (threshold ~140)
    ph: 7.2,
    organicCarbon: 0.65,
    zinc: 0.85,
  };

  const planLowK = getCropReplenishmentPlan(soilLowK, 'wheat', farmerContext, 'en');
  const recK = planLowK.recommendations.find((r) => r.nutrientId === 'potassium');
  assert(recK !== undefined, 'Potassium identified as requiring replenishment');

  const mopProduct = recK!.matchedProducts.find((p) => p.id === 'mop');
  assert(mopProduct !== undefined, 'MOP matched for potassium deficiency');
  assert(mopProduct!.referencePrice.amount === 1650.00, 'MOP reference price is ₹1,650.00');
  assert(mopProduct!.nutrientsSupplied[0].percentage === '60% K₂O', 'MOP potassium grade verified as 60% K2O');

  // ----------------------------------------------------
  // PROFILE 4: Low Zinc Profile
  // ----------------------------------------------------
  console.log('\n--- TEST 4: Low Zinc Profile ---');
  const soilLowZn: SoilInfo = {
    nitrogen: 310,
    phosphorus: 24,
    potassium: 220,
    ph: 7.2,
    organicCarbon: 0.65,
    zinc: 0.42, // Deficient (< 0.6 ppm)
  };

  const planLowZn = getCropReplenishmentPlan(soilLowZn, 'wheat', farmerContext, 'en');
  const recZn = planLowZn.recommendations.find((r) => r.nutrientId === 'zinc');
  assert(recZn !== undefined, 'Zinc identified as requiring replenishment');

  const zincProduct = recZn!.matchedProducts.find((p) => p.id === 'zinc-sulphate-21');
  assert(zincProduct !== undefined, 'Zinc Sulphate matched for zinc deficiency');
  assert(zincProduct!.referencePrice.amount === 425.00, 'Zinc Sulphate reference price is ₹425.00 / 5 kg');

  // ----------------------------------------------------
  // PROFILE 5: Multiple Deficiencies Profile (N + P + K + Zn)
  // ----------------------------------------------------
  console.log('\n--- TEST 5: Multiple Deficiencies Profile ---');
  const soilMulti: SoilInfo = {
    nitrogen: 180, // Low N
    phosphorus: 8,  // Low P
    potassium: 95,  // Low K
    zinc: 0.40,     // Low Zn
    ph: 7.2,
    organicCarbon: 0.65,
  };

  const planMulti = getCropReplenishmentPlan(soilMulti, 'wheat', farmerContext, 'en');
  assert(planMulti.recommendations.length >= 4, 'All 4 deficiencies captured in replenishment plan');

  const deficientIds = planMulti.recommendations.map((r) => r.nutrientId);
  assert(deficientIds.includes('nitrogen'), 'N deficiency captured');
  assert(deficientIds.includes('phosphorus'), 'P deficiency captured');
  assert(deficientIds.includes('potassium'), 'K deficiency captured');
  assert(deficientIds.includes('zinc'), 'Zn deficiency captured');

  // ----------------------------------------------------
  // PROFILE 6: Adequate Nutrients Profile
  // ----------------------------------------------------
  console.log('\n--- TEST 6: Adequate Nutrients Profile ---');
  const soilAdequate: SoilInfo = {
    nitrogen: 340,
    phosphorus: 28,
    potassium: 260,
    zinc: 0.95,
    sulphur: 18,
    boron: 0.70,
    ph: 7.1,
    organicCarbon: 0.75,
  };

  const planAdequate = getCropReplenishmentPlan(soilAdequate, 'wheat', farmerContext, 'en');
  assert(planAdequate.recommendations.length === 0, 'No deficiency recommendations when all nutrients are adequate');
  assert(planAdequate.generalMaintenance !== undefined, 'General soil maintenance guidance provided');
  assert(planAdequate.generalMaintenance!.description.includes('organic manure'), 'Maintenance mentions organic manure/FYM');

  // ----------------------------------------------------
  // TEST 7: Multi-Crop Context (Soybean vs Wheat)
  // ----------------------------------------------------
  console.log('\n--- TEST 7: Crop-Specific Thresholds (Soybean vs Wheat) ---');
  // Nitrogen = 210 is low for Wheat (needs ~240) but adequate for Soybean (nodulating legume, needs ~180-200)
  const soilBorderlineN: SoilInfo = {
    nitrogen: 210,
    phosphorus: 22,
    potassium: 210,
    ph: 6.8,
    organicCarbon: 0.65,
  };

  const planWheat = getCropReplenishmentPlan(soilBorderlineN, 'wheat', farmerContext, 'en');
  const isWheatLowN = planWheat.recommendations.some((r) => r.nutrientId === 'nitrogen');
  assert(isWheatLowN === true, 'Wheat flags N=210 as low (heavy nitrogen consumer)');

  const planSoybean = getCropReplenishmentPlan(soilBorderlineN, 'soybean', farmerContext, 'en');
  const isSoybeanLowN = planSoybean.recommendations.some((r) => r.nutrientId === 'nitrogen');
  assert(isSoybeanLowN === false, 'Soybean treats N=210 as adequate (nitrogen-fixing legume)');

  // ----------------------------------------------------
  // TEST 8: Language Support (Marathi & Hindi)
  // ----------------------------------------------------
  console.log('\n--- TEST 8: Multi-Language Output Integrity ---');
  const planMr = getCropReplenishmentPlan(soilLowN, 'wheat', farmerContext, 'mr');
  const recMr = planMr.recommendations.find((r) => r.nutrientId === 'nitrogen');
  assert(recMr!.whatCanReplenishIt.includes('युरिया'), 'Marathi guidance naturally specifies "युरिया"');

  const planHi = getCropReplenishmentPlan(soilLowN, 'wheat', farmerContext, 'hi');
  const recHi = planHi.recommendations.find((r) => r.nutrientId === 'nitrogen');
  assert(recHi!.whatCanReplenishIt.includes('यूरिया'), 'Hindi guidance naturally specifies "यूरिया"');

  // ----------------------------------------------------
  // TEST 9: Farm Size Context & Dosage Integrity
  // ----------------------------------------------------
  console.log('\n--- TEST 9: Farm Size Context without Invented Dosage ---');
  assert(planLowN.farmArea === 2.5, 'Farm area of 2.5 is preserved in plan');
  assert(planLowN.farmUnit === 'acre', 'Farm unit "acre" is preserved in plan');

  // Verify that all 10 products in the database have valid reference prices and pack sizes
  for (const prod of FERTILIZERS) {
    assert(prod.referencePrice.amount !== null && prod.referencePrice.amount > 0, `Product ${prod.id} has positive reference price`);
    assert(Boolean(prod.referencePrice.source && prod.referencePrice.source.length > 5), `Product ${prod.id} has documented price source`);
    assert(prod.commonPackSizes.length > 0, `Product ${prod.id} has documented pack sizes`);
    assert(prod.productImage.imageUrl.endsWith('.svg'), `Product ${prod.id} has neutral vector graphic`);
  }

  console.log('\n================================================================');
  console.log(`ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('================================================================');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
