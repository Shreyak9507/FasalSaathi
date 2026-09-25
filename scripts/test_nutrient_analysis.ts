import fs from 'fs';
import path from 'path';
import { analyzeCropSoilNutrients } from '@/lib/nutrientAnalysis';
import { CROP_NUTRIENT_KNOWLEDGE } from '@/data/cropNutrientKnowledge';
import { SoilInfo } from '@/types';

function runTestSuite() {
  console.log('====================================================');
  console.log('FASALSAATHI — PHASE 3A NUTRIENT ANALYSIS TEST SUITE');
  console.log('====================================================\n');

  // Base healthy soil profile
  const baseAdequateSoil: SoilInfo = {
    nitrogen: 280, // kg/ha (Adequate for all crops)
    phosphorus: 22, // kg/ha (Adequate for all crops)
    potassium: 220, // kg/ha (Adequate for all crops)
    ph: 6.8, // Ideal neutral pH
    organicCarbon: 0.65, // % (Good range: 0.50-0.75)
    ec: 0.45, // dS/m (Normal non-saline)
    sulphur: 14.5, // ppm (Normal > 10.0)
    zinc: 0.85, // ppm (Normal > 0.60)
    iron: 5.2, // ppm (Normal > 4.5)
    boron: 0.65, // ppm (Normal > 0.50)
    manganese: 3.1, // ppm (Normal > 2.0)
    copper: 0.45, // ppm (Normal > 0.20)
  };

  // --------------------------------------------------------------------------
  // TEST CASE 1: Low Nitrogen
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 1: Low Nitrogen (Testing Wheat) ---');
  const lowNSoil: SoilInfo = {
    ...baseAdequateSoil,
    nitrogen: 140, // Low (Wheat threshold is 240)
  };

  const case1 = analyzeCropSoilNutrients(lowNSoil, 'wheat', 'en');
  console.log(`Crop: ${case1.cropName}`);
  console.log(`Available Parameters Tested: ${case1.totalAvailableCount}`);
  console.log(`Nutrients Requiring Attention (${case1.attentionNutrients.length}):`);
  case1.attentionNutrients.forEach(n => {
    console.log(`  ${n.badgeEmoji} ${n.name}: ${n.statusLabel} (${n.soilValue} ${n.unit}) [Priority: ${n.importance}]`);
    console.log(`     Why it matters: "${n.whyItMatters}"`);
    console.log(`     What this means: "${n.whatThisMeans}"`);
  });

  if (case1.attentionNutrients.length !== 1 || case1.attentionNutrients[0].id !== 'nitrogen') {
    throw new Error('Case 1 Failed: Expected exactly Nitrogen in attention list.');
  }
  if (case1.attentionNutrients[0].badgeEmoji !== '🔴') {
    throw new Error('Case 1 Failed: Critical low nitrogen should have 🔴 emoji.');
  }
  console.log('✓ TEST CASE 1 PASSED: Low Nitrogen correctly flagged & prioritized.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 2: Low Phosphorus
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 2: Low Phosphorus (Testing Soybean) ---');
  const lowPSoil: SoilInfo = {
    ...baseAdequateSoil,
    phosphorus: 8.5, // Low (Soybean threshold is 16 kg/ha)
  };

  const case2 = analyzeCropSoilNutrients(lowPSoil, 'soybean', 'en');
  console.log(`Crop: ${case2.cropName}`);
  console.log(`Nutrients Requiring Attention (${case2.attentionNutrients.length}):`);
  case2.attentionNutrients.forEach(n => {
    console.log(`  ${n.badgeEmoji} ${n.name}: ${n.statusLabel} (${n.soilValue} ${n.unit}) [Priority: ${n.importance}]`);
    console.log(`     Why it matters: "${n.whyItMatters}"`);
    console.log(`     What this means: "${n.whatThisMeans}"`);
  });

  if (case2.attentionNutrients.length !== 1 || case2.attentionNutrients[0].id !== 'phosphorus') {
    throw new Error('Case 2 Failed: Expected Phosphorus in attention list.');
  }
  if (case2.attentionNutrients[0].badgeEmoji !== '🔴') {
    throw new Error('Case 2 Failed: Critical low phosphorus in soybean should have 🔴 emoji.');
  }
  console.log('✓ TEST CASE 2 PASSED: Low Phosphorus correctly flagged for soybean.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 3: Low Potassium
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 3: Low Potassium (Testing Cotton) ---');
  const lowKSoil: SoilInfo = {
    ...baseAdequateSoil,
    potassium: 115, // Low for cotton (Cotton requires > 160 kg/ha K)
  };

  const case3 = analyzeCropSoilNutrients(lowKSoil, 'cotton', 'en');
  console.log(`Crop: ${case3.cropName}`);
  console.log(`Nutrients Requiring Attention (${case3.attentionNutrients.length}):`);
  case3.attentionNutrients.forEach(n => {
    console.log(`  ${n.badgeEmoji} ${n.name}: ${n.statusLabel} (${n.soilValue} ${n.unit}) [Priority: ${n.importance}]`);
    console.log(`     Why it matters: "${n.whyItMatters}"`);
    console.log(`     What this means: "${n.whatThisMeans}"`);
  });

  const kAttn = case3.attentionNutrients.find(n => n.id === 'potassium');
  if (!kAttn || kAttn.status !== 'low') {
    throw new Error('Case 3 Failed: Potassium must be flagged as low for Cotton.');
  }
  if (kAttn.badgeEmoji !== '🔴') {
    throw new Error('Case 3 Failed: Potassium is critical for cotton, expected 🔴.');
  }
  console.log('✓ TEST CASE 3 PASSED: Low Potassium correctly flagged as critical for Cotton.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 4: Low Zinc
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 4: Low Zinc (Testing Maize) ---');
  const lowZnSoil: SoilInfo = {
    ...baseAdequateSoil,
    zinc: 0.38, // Deficient (Maize critical limit is 0.70 ppm)
  };

  const case4 = analyzeCropSoilNutrients(lowZnSoil, 'maize', 'en');
  console.log(`Crop: ${case4.cropName}`);
  console.log(`Nutrients Requiring Attention (${case4.attentionNutrients.length}):`);
  case4.attentionNutrients.forEach(n => {
    console.log(`  ${n.badgeEmoji} ${n.name}: ${n.statusLabel} (${n.soilValue} ${n.unit}) [Priority: ${n.importance}]`);
    console.log(`     Why it matters: "${n.whyItMatters}"`);
    console.log(`     What this means: "${n.whatThisMeans}"`);
  });

  const znAttn = case4.attentionNutrients.find(n => n.id === 'zinc');
  if (!znAttn || znAttn.status !== 'low') {
    throw new Error('Case 4 Failed: Zinc must be flagged as low for Maize.');
  }
  if (znAttn.badgeEmoji !== '🔴') {
    throw new Error('Case 4 Failed: Zinc is critical for Maize (white bud risk), expected 🔴.');
  }
  console.log('✓ TEST CASE 4 PASSED: Low Zinc correctly flagged as critical for Maize.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 5: Adequate Nutrients
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 5: All Adequate Nutrients (Testing Sugarcane) ---');
  const case5 = analyzeCropSoilNutrients(baseAdequateSoil, 'sugarcane', 'en');
  console.log(`Crop: ${case5.cropName}`);
  console.log(`Attention Count: ${case5.attentionNutrients.length}`);
  console.log(`Good Nutrients Count: ${case5.goodNutrients.length}`);
  console.log(`pH Status: ${case5.phAnalysis.badgeEmoji} ${case5.phAnalysis.statusLabel} (Value: ${case5.phAnalysis.value})`);
  console.log(`Organic Carbon: ${case5.organicCarbonAnalysis.badgeEmoji} ${case5.organicCarbonAnalysis.statusLabel} (${case5.organicCarbonAnalysis.value}%)`);

  if (case5.attentionNutrients.length !== 0) {
    throw new Error('Case 5 Failed: Fully balanced soil should have 0 attention nutrients.');
  }
  if (case5.goodNutrients.length < 8) {
    throw new Error('Case 5 Failed: All available parameters should be in goodNutrients.');
  }
  console.log('✓ TEST CASE 5 PASSED: Adequate soil produces 0 attention alerts and all good statuses.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 6: Crop-Specific Differential Verification (Same soil, different crop)
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 6: Differential Crop Evaluation on Identical Soil ---');
  const differentialSoil: SoilInfo = {
    ...baseAdequateSoil,
    nitrogen: 180, // 180 kg/ha: LOW for Wheat (needs > 240), but GOOD for Soybean (starter legume, needs > 120)
    potassium: 145, // 145 kg/ha: GOOD for Chickpea (needs > 120), but LOW for Cotton (heavy feeder, needs > 160)
  };

  const wheatEval = analyzeCropSoilNutrients(differentialSoil, 'wheat', 'en');
  const soybeanEval = analyzeCropSoilNutrients(differentialSoil, 'soybean', 'en');
  const cottonEval = analyzeCropSoilNutrients(differentialSoil, 'cotton', 'en');
  const chickpeaEval = analyzeCropSoilNutrients(differentialSoil, 'chickpea', 'en');

  const wheatN = wheatEval.attentionNutrients.find(n => n.id === 'nitrogen');
  const soybeanN = soybeanEval.goodNutrients.find(n => n.id === 'nitrogen');
  console.log(`Nitrogen (180 kg/ha):`);
  console.log(`  - For Wheat: ${wheatN ? wheatN.statusLabel : 'Good'} (Status: ${wheatN?.status}) [Expected: Needs attention]`);
  console.log(`  - For Soybean: ${soybeanN ? soybeanN.statusLabel : 'Needs attention'} (Status: ${soybeanN?.status}) [Expected: Good]`);

  if (!wheatN || wheatN.status !== 'low') throw new Error('Differential test failed: Wheat should flag 180 kg/ha N as low.');
  if (!soybeanN || soybeanN.status !== 'good') throw new Error('Differential test failed: Soybean should treat 180 kg/ha N as good.');

  const cottonK = cottonEval.attentionNutrients.find(n => n.id === 'potassium');
  const chickpeaK = chickpeaEval.goodNutrients.find(n => n.id === 'potassium');
  console.log(`Potassium (145 kg/ha):`);
  console.log(`  - For Cotton: ${cottonK ? cottonK.statusLabel : 'Good'} (Status: ${cottonK?.status}) [Expected: Needs attention]`);
  console.log(`  - For Chickpea: ${chickpeaK ? chickpeaK.statusLabel : 'Needs attention'} (Status: ${chickpeaK?.status}) [Expected: Good]`);

  if (!cottonK || cottonK.status !== 'low') throw new Error('Differential test failed: Cotton should flag 145 kg/ha K as low.');
  if (!chickpeaK || chickpeaK.status !== 'good') throw new Error('Differential test failed: Chickpea should treat 145 kg/ha K as good.');
  console.log('✓ TEST CASE 6 PASSED: Crop-specific agronomic logic verified.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 7: Missing/Unreported Parameters
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 7: Missing Parameters (Never Guessing) ---');
  const partialSoil: SoilInfo = {
    nitrogen: 210,
    phosphorus: 18,
    potassium: 160,
    ph: 7.1,
    organicCarbon: 0.58,
    // Note: sulphur, zinc, boron, iron, manganese, copper are deliberately undefined
  };

  const partialEval = analyzeCropSoilNutrients(partialSoil, 'wheat', 'en');
  console.log(`Available parameters: ${partialEval.totalAvailableCount}`);
  console.log(`Unknown / Unreported count: ${partialEval.unknownNutrients.length}`);
  console.log(`Sample Unreported:`, partialEval.unknownNutrients.slice(0, 3).map(n => n.name).join(', '));

  if (partialEval.unknownNutrients.length !== 6) {
    throw new Error(`Expected 6 unknown nutrients for partial card, got ${partialEval.unknownNutrients.length}`);
  }
  for (const u of partialEval.unknownNutrients) {
    if (u.status !== 'unknown' || u.statusLabel !== 'Not in Report') {
      throw new Error(`Unreported nutrient ${u.name} must have status 'unknown'.`);
    }
  }
  console.log('✓ TEST CASE 7 PASSED: Missing parameters properly categorized as Unknown.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 8: Multi-Language & Character Encoding
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 8: Multi-Language Output (EN, MR, HI) ---');
  const enRes = analyzeCropSoilNutrients(lowNSoil, 'wheat', 'en');
  const mrRes = analyzeCropSoilNutrients(lowNSoil, 'wheat', 'mr');
  const hiRes = analyzeCropSoilNutrients(lowNSoil, 'wheat', 'hi');

  console.log('English:');
  console.log(`  Crop: ${enRes.cropName} | N Status: ${enRes.attentionNutrients[0].statusLabel}`);
  console.log(`  Why: ${enRes.attentionNutrients[0].whyItMatters}`);

  console.log('Marathi:');
  console.log(`  Crop: ${mrRes.cropName} | N Status: ${mrRes.attentionNutrients[0].statusLabel}`);
  console.log(`  Why: ${mrRes.attentionNutrients[0].whyItMatters}`);

  console.log('Hindi:');
  console.log(`  Crop: ${hiRes.cropName} | N Status: ${hiRes.attentionNutrients[0].statusLabel}`);
  console.log(`  Why: ${hiRes.attentionNutrients[0].whyItMatters}`);

  // Check no Devanagari in English
  if (/[\u0900-\u097F]/.test(enRes.attentionNutrients[0].statusLabel) || /[\u0900-\u097F]/.test(enRes.attentionNutrients[0].whyItMatters)) {
    throw new Error('Devanagari found in English translation!');
  }
  console.log('✓ TEST CASE 8 PASSED: Localization and zero Devanagari in English verified.\n');

  // --------------------------------------------------------------------------
  // TEST CASE 9: Unknown Crop Fallback
  // --------------------------------------------------------------------------
  console.log('--- TEST CASE 9: Unknown Crop Fallback ---');
  const unknownCropRes = analyzeCropSoilNutrients(baseAdequateSoil, 'dragonfruit', 'en');
  console.log(`Has guidance: ${unknownCropRes.hasCropGuidance}`);
  console.log(`Message: "${unknownCropRes.unavailableMessage}"`);

  if (unknownCropRes.hasCropGuidance !== false) {
    throw new Error('Unknown crop should return hasCropGuidance: false');
  }
  if (!unknownCropRes.unavailableMessage?.includes('unavailable')) {
    throw new Error('Expected unavailable message for unknown crop.');
  }
  console.log('✓ TEST CASE 9 PASSED: Unknown crop cleanly returns fallback message.\n');

  console.log('====================================================');
  console.log('ALL PHASE 3A VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('====================================================');
}

runTestSuite();
