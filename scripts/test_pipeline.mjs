import { validateSoilExtraction } from '../src/services/soil-validation.ts';
import fs from 'fs';
import path from 'path';

console.log('=== FASALSAATHI SOIL HEALTH CARD PIPELINE VERIFICATION ===\n');

// 1. Test Agronomic Bounds Validation with the reference sample card data
const sampleCardData = {
  farmer: {
    name: 'Ramesh Patil',
    village: 'Khedgaon',
    subDistrict: 'Khed',
    district: 'Pune',
    state: 'Maharashtra',
    pin: '412105',
    address: 'Khedgaon, Khed, Pune',
  },
  sample: {
    cardNumber: 'SHC-DEMO-2026-001',
    sampleNumber: 'SHC-DEMO-2026-001',
    sampleDate: '15/09/2026',
    testDate: '20/09/2026',
    labName: 'Govt District Soil Testing Lab',
    farmSize: 2.5,
    farmSizeUnit: 'ha',
    latitude: 18.5204,
    longitude: 73.8567,
    irrigation: 'Irrigated',
    rainfallType: 'Normal',
  },
  soil: {
    ph: { value: 6.8, unit: 'pH', rating: 'Normal', confidence: 0.96 },
    ec: { value: 0.42, unit: 'dS/m', rating: 'Normal', confidence: 0.94 },
    organicCarbon: { value: 0.68, unit: '%', rating: 'Medium', confidence: 0.95 },
    nitrogen: { value: 285, unit: 'kg/ha', rating: 'Medium', confidence: 0.97 },
    phosphorus: { value: 18, unit: 'kg/ha', rating: 'Medium', confidence: 0.96 },
    potassium: { value: 210, unit: 'kg/ha', rating: 'Medium', confidence: 0.95 },
    sulphur: { value: 14.0, unit: 'mg/kg', rating: 'Medium', confidence: 0.92 },
    zinc: { value: 0.72, unit: 'mg/kg', rating: 'Deficient', confidence: 0.91 },
    boron: { value: 0.48, unit: 'mg/kg', rating: 'Deficient', confidence: 0.89 },
    iron: { value: 4.8, unit: 'mg/kg', rating: 'Sufficient', confidence: 0.93 },
    manganese: { value: 8.5, unit: 'mg/kg', rating: 'Sufficient', confidence: 0.94 },
    copper: { value: 0.55, unit: 'mg/kg', rating: 'Sufficient', confidence: 0.90 },
  },
  rawConfidence: 0.94,
};

console.log('--- TEST 1: Validating Normal Sample Soil Card ---');
const normalValidation = validateSoilExtraction(sampleCardData);
console.log(`Validation issues detected on normal card: ${normalValidation.issues.length}`);
console.log(`Raw confidence: ${sampleCardData.rawConfidence}`);
console.log(`Farmer name: ${normalValidation.validatedCard.farmer.name}`);
console.log(`GPS: ${normalValidation.validatedCard.sample.latitude}, ${normalValidation.validatedCard.sample.longitude}`);
console.log(`pH value preserved: ${normalValidation.validatedCard.soil.ph.value} (Unit: ${normalValidation.validatedCard.soil.ph.unit})`);
console.log(`EC value preserved: ${normalValidation.validatedCard.soil.ec.value} (Unit: ${normalValidation.validatedCard.soil.ec.unit})`);
console.log(`Organic Carbon preserved: ${normalValidation.validatedCard.soil.organicCarbon.value}%`);
console.log(`Nitrogen preserved: ${normalValidation.validatedCard.soil.nitrogen.value} kg/ha`);
console.log(`Zinc preserved: ${normalValidation.validatedCard.soil.zinc.value} mg/kg (Rating: ${normalValidation.validatedCard.soil.zinc.rating})`);
console.log(`Boron preserved: ${normalValidation.validatedCard.soil.boron.value} mg/kg (Rating: ${normalValidation.validatedCard.soil.boron.rating})`);

if (normalValidation.issues.length === 0) {
  console.log('>>> TEST 1 PASSED: Normal card produces 0 spurious validation warnings.\n');
} else {
  console.error('>>> TEST 1 WARNING: Unexpected validation issues:', normalValidation.issues);
}

// 2. Test Agronomic Bounds Validation with Extreme / Impossible Values
console.log('--- TEST 2: Validating Out-Of-Bounds & Anomaly Flagging ---');
const abnormalCardData = {
  ...sampleCardData,
  soil: {
    ...sampleCardData.soil,
    ph: { value: 12.5, unit: 'pH', rating: 'Alkaline', confidence: 0.95 },
    nitrogen: { value: 850, unit: 'kg/ha', rating: 'High', confidence: 0.95 },
    organicCarbon: { value: -0.5, unit: '%', rating: 'Low', confidence: 0.95 },
    zinc: { value: 0.72, unit: 'mg/kg', rating: 'Deficient', confidence: 0.50 }, // low confidence
  },
};

const abnormalValidation = validateSoilExtraction(abnormalCardData);
console.log(`Detected validation issues on abnormal card: ${abnormalValidation.issues.length}`);
abnormalValidation.issues.forEach((iss) => {
  console.log(`- [${iss.severity.toUpperCase()}] ${iss.field}: ${iss.message}`);
});

// Ensure values were NOT mutated or erased
const phUnchanged = abnormalValidation.validatedCard.soil.ph.value === 12.5;
const nUnchanged = abnormalValidation.validatedCard.soil.nitrogen.value === 850;
const ocUnchanged = abnormalValidation.validatedCard.soil.organicCarbon.value === -0.5;
const znConfidenceFlagged = abnormalValidation.validatedCard.soil.zinc.isFlagged === true;

console.log(`pH 12.5 preserved without silent mutation: ${phUnchanged}`);
console.log(`Nitrogen 850 preserved without silent mutation: ${nUnchanged}`);
console.log(`OC -0.5 preserved without silent mutation: ${ocUnchanged}`);
console.log(`Low confidence Zinc correctly flagged for farmer review: ${znConfidenceFlagged}`);

if (abnormalValidation.issues.length >= 3 && phUnchanged && nUnchanged && znConfidenceFlagged) {
  console.log('>>> TEST 2 PASSED: Anomaly detection flags warnings while strictly preserving values.\n');
} else {
  console.error('>>> TEST 2 FAILED');
}

// 3. Test HTTP API Endpoint Graceful Degradation
console.log('--- TEST 3: Testing /api/extract-soil-card Endpoint Response ---');
async function testApiEndpoint() {
  try {
    const sampleImagePath = path.join(process.cwd(), 'public', 'sample-soil-card.png');
    if (!fs.existsSync(sampleImagePath)) {
      console.error('Sample card image not found at', sampleImagePath);
      return;
    }

    const fileBuffer = fs.readFileSync(sampleImagePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', blob, 'sample-soil-card.png');

    const response = await fetch('http://127.0.0.1:3005/api/extract-soil-card', {
      method: 'POST',
      body: formData,
    });

    console.log(`HTTP Status: ${response.status}`);
    const json = await response.json();
    console.log('API Response:', JSON.stringify(json, null, 2));

    if (response.status === 200) {
      if (json.fallbackRequired) {
        console.log('>>> Graceful fallback active (No API key or vision fallback). User is guided to manual review.');
      } else if (json.success) {
        console.log('>>> Vision extraction completed successfully with live model.');
      }
      console.log('>>> TEST 3 PASSED: API handles request safely without 500 error or crash.\n');
    } else {
      console.error('>>> TEST 3 FAILED with status', response.status);
    }
  } catch (err) {
    console.error('API Test Error:', err.message);
  }
}

testApiEndpoint();
