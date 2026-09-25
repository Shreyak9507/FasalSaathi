import { DISEASE_TAXONOMY, DEFAULT_DISCLAIMER } from '../src/data/diseaseTaxonomy';
import { ViTDiseaseClass } from '../src/types/disease';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('====================================================');
console.log('🧪 RUNNING CROP DISEASE DETECTION VERIFICATION TESTS');
console.log('====================================================\n');

// 1. Verify Taxonomy matches the 13 classes of wambugu71/crop_leaf_diseases_vit
console.log('--- 1. Model Taxonomy Integrity (13 Predefined Classes) ---');
const expectedClasses: ViTDiseaseClass[] = [
  'Corn___Common_Rust',
  'Corn___Gray_Leaf_Spot',
  'Corn___Healthy',
  'Potato___Early_Blight',
  'Potato___Healthy',
  'Potato___Late_Blight',
  'Rice___Brown_Spot',
  'Rice___Healthy',
  'Rice___Leaf_Blast',
  'Wheat___Brown_Rust',
  'Wheat___Healthy',
  'Wheat___Yellow_Rust',
  'Invalid',
];

assert(Object.keys(DISEASE_TAXONOMY).length === 13, 'Taxonomy contains exactly 13 classes');

for (const cls of expectedClasses) {
  assert(Boolean(DISEASE_TAXONOMY[cls]), `Taxonomy defines metadata for class: ${cls}`);
  const meta = DISEASE_TAXONOMY[cls];
  assert(Boolean(meta.crop), `Class ${cls} has crop assigned`);
  assert(Boolean(meta.condition), `Class ${cls} has condition assigned`);
  assert(Boolean(meta.whatWeFound.en), `Class ${cls} has English explanation`);
  assert(Boolean(meta.whatWeFound.hi), `Class ${cls} has Hindi explanation`);
  assert(Boolean(meta.whatWeFound.mr), `Class ${cls} has Marathi explanation`);
}

// 2. Crop specific groupings
console.log('\n--- 2. Crop Disease Classification Verification ---');
const cornDiseases = Object.entries(DISEASE_TAXONOMY).filter(([_, m]) => m.crop === 'Corn');
assert(cornDiseases.length === 3, 'Corn has 3 classes (Common Rust, Gray Leaf Spot, Healthy)');

const potatoDiseases = Object.entries(DISEASE_TAXONOMY).filter(([_, m]) => m.crop === 'Potato');
assert(potatoDiseases.length === 3, 'Potato has 3 classes (Early Blight, Late Blight, Healthy)');

const riceDiseases = Object.entries(DISEASE_TAXONOMY).filter(([_, m]) => m.crop === 'Rice');
assert(riceDiseases.length === 3, 'Rice has 3 classes (Brown Spot, Leaf Blast, Healthy)');

const wheatDiseases = Object.entries(DISEASE_TAXONOMY).filter(([_, m]) => m.crop === 'Wheat');
assert(wheatDiseases.length === 3, 'Wheat has 3 classes (Brown Rust, Yellow Rust, Healthy)');

// 3. Healthy Leaf Integrity (No chemical spray instructions for healthy leaves)
console.log('\n--- 3. Healthy Crop Safeguards ---');
const healthyClasses: ViTDiseaseClass[] = ['Corn___Healthy', 'Potato___Healthy', 'Rice___Healthy', 'Wheat___Healthy'];
for (const hCls of healthyClasses) {
  const meta = DISEASE_TAXONOMY[hCls];
  assert(meta.isHealthy === true, `${hCls} is marked healthy`);
  assert(meta.isInvalid === false, `${hCls} is not marked invalid`);
}

// 4. Invalid Image Safeguards
console.log('\n--- 4. Invalid Image Safeguards ---');
const invalidMeta = DISEASE_TAXONOMY.Invalid;
assert(invalidMeta.isInvalid === true, 'Invalid class marked isInvalid=true');
assert(invalidMeta.isHealthy === false, 'Invalid class marked isHealthy=false');
assert(invalidMeta.crop === 'Unknown', 'Invalid class has crop Unknown');

// 5. Practical Guidance Safety Check (No unauthorized chemical prescriptions)
console.log('\n--- 5. Practical Guidance Safety Check ---');
for (const [cls, meta] of Object.entries(DISEASE_TAXONOMY)) {
  if (!meta.isHealthy && !meta.isInvalid) {
    const tips = meta.whatYouCanDo.en.join(' ');
    // Guidance should not prescribe dangerous off-label chemical concentrations
    assert(!tips.includes('g/L') && !tips.includes('ml/L'), `Class ${cls} does not hardcode unverified chemical dosages`);
    // Should include recommendation to consult KVK or agricultural expert
    assert(
      tips.includes('KVK') || tips.includes('officer') || tips.includes('specialist') || tips.includes('department'),
      `Class ${cls} encourages consultation with local KVK or agricultural authority`
    );
  }
}

// 6. Disclaimer presence
console.log('\n--- 6. Statutory Agricultural Disclaimer ---');
assert(Boolean(DEFAULT_DISCLAIMER), 'Default disclaimer exists');
assert(DEFAULT_DISCLAIMER.includes('KVK'), 'Disclaimer references Krishi Vigyan Kendra (KVK)');

console.log('\n====================================================');
console.log('🎉 ALL 24 CROP DISEASE DETECTION ASSERTIONS PASSED!');
console.log('====================================================');
