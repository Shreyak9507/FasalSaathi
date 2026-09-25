import {
  localizeDigits,
  formatNumber,
  formatCurrency,
  formatDecimal,
  formatPercent,
  formatDistance,
  formatDate,
  formatYield,
} from '../src/lib/formatters';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('====================================================');
console.log('🧪 RUNNING NUMBER & SCRIPT LOCALIZATION TESTS');
console.log('====================================================\n');

// 1. Digits mapping across scripts
console.log('--- 1. Script Numerals Verification ---');
const sampleNumber = 2026;
assert(localizeDigits(sampleNumber, 'mr') === '२०२६', 'Marathi numeral conversion (2026 -> २०२६)');
assert(localizeDigits(sampleNumber, 'hi') === '२०२६', 'Hindi numeral conversion (2026 -> २०२६)');
assert(localizeDigits(sampleNumber, 'bn') === '২০২৬', 'Bengali numeral conversion (2026 -> ২০২৬)');
assert(localizeDigits(sampleNumber, 'gu') === '૨૦૨૬', 'Gujarati numeral conversion (2026 -> ૨૦૨૬)');
assert(localizeDigits(sampleNumber, 'kn') === '೨೦೨೬', 'Kannada numeral conversion (2026 -> ೨೦೨೬)');
assert(localizeDigits(sampleNumber, 'pa') === '੨੦੨੬', 'Gurmukhi / Punjabi numeral conversion (2026 -> ੨੦੨੬)');
assert(localizeDigits(sampleNumber, 'te') === '౨౦౨౬', 'Telugu numeral conversion (2026 -> ౨౦౨౬)');
assert(localizeDigits(sampleNumber, 'en') === '2026', 'English unchanged (2026 -> 2026)');

// 2. Currency formatting with native ₹ symbol
console.log('\n--- 2. Currency Formatting ---');
assert(formatCurrency(5200, 'mr') === '₹५,२००', 'Marathi currency with native ₹ (₹५,२००)');
assert(formatCurrency(5200, 'hi') === '₹५,२००', 'Hindi currency with native ₹ (₹५,२००)');
assert(formatCurrency(5200, 'en') === '₹5,200', 'English currency with native ₹ (₹5,200)');
assert(formatCurrency(125000, 'mr') === '₹१,२५,०००', 'Indian number grouping in Devanagari (₹१,२५,०००)');

// 3. Decimals & Fractions
console.log('\n--- 3. Decimal Formatting (pH, EC, etc.) ---');
assert(formatDecimal(6.8, 'mr', 1) === '६.८', 'Soil pH decimal in Marathi (6.8 -> ६.८)');
assert(formatDecimal(0.42, 'hi', 2) === '०.४२', 'Soil EC decimal in Hindi (0.42 -> ०.४२)');
assert(formatDecimal(7.0, 'en', 1) === '7.0', 'English decimal (7.0 -> 7.0)');

// 4. Percentage Formatting
console.log('\n--- 4. Percentage Formatting ---');
assert(formatPercent(85, 'mr') === '८५%', 'Suitability score percentage in Marathi (85% -> ८५%)');
assert(formatPercent(0.65, 'hi') === '०.६५%', 'Organic carbon percentage in Hindi (0.65% -> ०.६५%)');
assert(formatPercent(95, 'en') === '95%', 'English percentage (95% -> 95%)');

// 5. Distance Formatting
console.log('\n--- 5. Distance Formatting ---');
assert(formatDistance(18, 'mr') === '१८ किमी', 'Distance in Marathi (18 -> १८ किमी)');
assert(formatDistance(18, 'hi') === '१८ किमी', 'Distance in Hindi (18 -> १८ किमी)');
assert(formatDistance(18.4, 'en') === '18 km', 'Distance in English (18.4 -> 18 km)');

// 6. Date Formatting
console.log('\n--- 6. Date Formatting ---');
const dateStr = '25/09/2026';
assert(formatDate(dateStr, 'mr') === '२५ सप्टेंबर २०२६', 'Date formatting in Marathi (२५ सप्टेंबर २०२६)');
assert(formatDate(dateStr, 'hi') === '२५ सितंबर २०२६', 'Date formatting in Hindi (२५ सितंबर २०२६)');
assert(formatDate(dateStr, 'en') === '25 September 2026', 'Date formatting in English (25 September 2026)');

// 7. Yield Formatting
console.log('\n--- 7. Yield Range Formatting ---');
assert(formatYield('50 - 65 q/ha', 'mr') === '५० - ६५ क्विंटल/हेक्टर', 'Yield in Marathi (५० - ६५ क्विंटल/हेक्टर)');
assert(formatYield('50 - 65 q/ha', 'hi') === '५० - ६५ क्विंटल/हेक्टेयर', 'Yield in Hindi (५० - ६५ क्विंटल/हेक्टेयर)');
assert(formatYield('50 - 65 q/ha', 'en') === '50 - 65 q/ha', 'Yield in English (50 - 65 q/ha)');

// 8. Calculation Integrity (Math remains pure number)
console.log('\n--- 8. Mathematical Calculation Integrity ---');
const yieldQuintalsPerAcre = 20;
const acres = 2.5;
const pricePerQuintal = 5200;

// Gross Crop Value Calculation (Pure Math)
const totalYield = yieldQuintalsPerAcre * acres; // 50 quintals
const grossCropValue = totalYield * pricePerQuintal; // 260,000

assert(typeof totalYield === 'number' && totalYield === 50, 'Total yield calculation remains number 50');
assert(typeof grossCropValue === 'number' && grossCropValue === 260000, 'Gross crop value remains number 260000');

// Display layer only converts during render
const displayYieldMr = `${formatNumber(totalYield, 'mr')} क्विंटल`;
const displayGrossValueMr = formatCurrency(grossCropValue, 'mr');

assert(displayYieldMr === '५० क्विंटल', 'Display yield localized to ५० क्विंटल');
assert(displayGrossValueMr === '₹२,६०,०००', 'Display gross value localized to ₹२,६०,०००');

console.log('\n====================================================');
console.log('🎉 ALL NUMBER & LOCALIZATION TESTS PASSED SUCCESSFULLY!');
console.log('====================================================');
