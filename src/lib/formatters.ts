/**
 * Central Number, Currency, Decimal, and Date Localization Utility
 * FasalSaathi - Mobile-first Farmer Support System
 *
 * NOTE: Number localization is strictly for DISPLAY.
 * Internal calculations and state always retain standard JavaScript numbers.
 */

// Digit maps for Indian languages supported by FasalSaathi
export const DIGIT_MAPS: Record<string, string[]> = {
  mr: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'], // Marathi (Devanagari)
  hi: ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'], // Hindi (Devanagari)
  bn: ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'], // Bengali
  gu: ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'], // Gujarati
  kn: ['೦', '೧', '೨', '೩', '೪', '೫', '೬', '೭', '೮', '೯'], // Kannada
  pa: ['੦', '੧', '੨', '੩', '੪', '੫', '੬', '੭', '੮', '੯'], // Punjabi (Gurmukhi)
  te: ['౦', '౧', '౨', '౩', '౪', '౫', '౬', '౭', '౮', '౯'], // Telugu
};

// Unit translations for measurements
export const UNIT_LABELS: Record<string, { km: string; quintal: string; acre: string; hectare: string; days: string; qHa?: string }> = {
  en: { km: 'km', quintal: 'quintal', acre: 'acres', hectare: 'hectare', days: 'days', qHa: 'q/ha' },
  mr: { km: 'किमी', quintal: 'क्विंटल', acre: 'एकर', hectare: 'हेक्टर', days: 'दिवस', qHa: 'क्विंटल/हेक्टर' },
  hi: { km: 'किमी', quintal: 'क्विंटल', acre: 'एकड़', hectare: 'हेक्टेयर', days: 'दिन', qHa: 'क्विंटल/हेक्टेयर' },
  bn: { km: 'কিমি', quintal: 'কুইন্টাল', acre: 'একর', hectare: 'হেক্টর', days: 'দিন', qHa: 'কুইন্টাল/হেক্টর' },
  gu: { km: 'કિમી', quintal: 'ક્વિન્ટલ', acre: 'એકર', hectare: 'હેક્ટર', days: 'દિવસ', qHa: 'ક્વિન્ટલ/હેક્ટર' },
  kn: { km: 'ಕಿಮೀ', quintal: 'ಕ್ವಿಂಟಾಲ್', acre: 'ಎಕರೆ', hectare: 'ಹೆಕ್ಟೇರ್', days: 'ದಿನಗಳು', qHa: 'ಕ್ವಿಂಟಾಲ್/ಹೆಕ್ಟೇರ್' },
  ml: { km: 'കി.മീ', quintal: 'ക്വിന്റൽ', acre: 'ഏക്കർ', hectare: 'ഹെക്ടർ', days: 'ദിവസങ്ങൾ', qHa: 'ക്വിന്റൽ/ഹെക്ടർ' },
  pa: { km: 'ਕਿਮੀ', quintal: 'ਕੁਇੰਟਲ', acre: 'ਏਕੜ', hectare: 'ਹੈਕਟੇਅਰ', days: 'ਦਿਨ', qHa: 'ਕੁਇੰਟਲ/ਹੈਕਟੇਅਰ' },
  ta: { km: 'கி.மீ', quintal: 'குவிண்டால்', acre: 'ஏக்கர்', hectare: 'ஹெக்டேர்', days: 'நாட்கள்', qHa: 'குவிண்டால்/ஹெக்டேர்' },
  te: { km: 'కి.మీ', quintal: 'క్వింటాల్', acre: 'ఎకరాలు', hectare: 'హెక్టారు', days: 'రోజులు', qHa: 'క్వింటాల్/హెక్టారు' },
};

// Month names for Marathi & Hindi
const MONTH_NAMES: Record<string, string[]> = {
  mr: [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ],
  hi: [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ],
};

/**
 * Replace ASCII digits (0-9) in any string or number with the native script digits.
 * Preserves all surrounding text, punctuation, symbols, and formatting.
 */
export function localizeDigits(value: string | number | null | undefined, lang = 'en'): string {
  if (value == null) return '';
  const str = String(value);
  const map = DIGIT_MAPS[lang];
  if (!map) return str;

  return str.replace(/[0-9]/g, d => map[parseInt(d, 10)]);
}

/**
 * Format integer or float with Indian thousands/lakhs separators and native digits.
 * Example: 5200 -> '5,200' in en, '५,२००' in mr.
 */
export function formatNumber(
  value: number | string | null | undefined,
  lang = 'en',
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  if (value == null || value === '') return '';

  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
  if (isNaN(num)) return localizeDigits(value, lang);

  // Format with en-IN comma grouping first
  const formatted = num.toLocaleString('en-IN', options);

  // Map digits to target language script
  return localizeDigits(formatted, lang);
}

/**
 * Format currency with ₹ symbol and localized digits.
 * Never translates ₹ to text.
 * Example: 5200 -> '₹5,200' in en, '₹५,२००' in mr.
 */
export function formatCurrency(amount: number | string | null | undefined, lang = 'en'): string {
  if (amount == null || amount === '') return '';
  return `₹${formatNumber(amount, lang)}`;
}

/**
 * Format scientific or soil decimal values with fixed or preserved decimal precision.
 * Example: 6.8 -> '6.8' in en, '६.८' in mr.
 */
export function formatDecimal(
  value: number | string | null | undefined,
  lang = 'en',
  decimals?: number
): string {
  if (value == null || value === '') return '';

  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num)) return localizeDigits(value, lang);

  if (decimals !== undefined) {
    const fixed = num.toFixed(decimals);
    return localizeDigits(fixed, lang);
  }

  return localizeDigits(num.toString(), lang);
}

/**
 * Format percentages.
 * Example: 85 -> '85%' in en, '८५%' in mr.
 */
export function formatPercent(value: number | string | null | undefined, lang = 'en'): string {
  if (value == null || value === '') return '';
  const numStr = formatNumber(value, lang);
  return `${numStr}%`;
}

/**
 * Format distance in kilometers with localized unit.
 * Example: 18.2 -> '18 km' in en, '१८ किमी' in mr.
 */
export function formatDistance(km: number | string | null | undefined, lang = 'en'): string {
  if (km == null || km === '') return '';
  const num = typeof km === 'number' ? Math.round(km) : km;
  const numStr = formatNumber(num, lang);
  const unit = UNIT_LABELS[lang]?.km || 'km';
  return `${numStr} ${unit}`;
}

/**
 * Format readable localized dates.
 * Accepts:
 * - DD/MM/YYYY string (e.g. '25/09/2026')
 * - YYYY-MM-DD string (e.g. '2026-09-25')
 * - Date object
 *
 * Example:
 * '25/09/2026' -> '25 September 2026' in en
 * '25/09/2026' -> '२५ सप्टेंबर २०२६' in mr
 * '25/09/2026' -> '२५ सितंबर २०२६' in hi
 */
export function formatDate(
  dateInput: string | Date | null | undefined,
  lang = 'en',
  formatStyle: 'long' | 'short' = 'long'
): string {
  if (!dateInput) return '';

  let day: number | null = null;
  let monthIndex: number | null = null;
  let year: number | null = null;

  if (dateInput instanceof Date) {
    day = dateInput.getDate();
    monthIndex = dateInput.getMonth();
    year = dateInput.getFullYear();
  } else if (typeof dateInput === 'string') {
    // Check DD/MM/YYYY
    const ddmmyyyy = dateInput.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      day = parseInt(ddmmyyyy[1], 10);
      monthIndex = parseInt(ddmmyyyy[2], 10) - 1;
      year = parseInt(ddmmyyyy[3], 10);
    } else {
      // Check YYYY-MM-DD
      const yyyymmdd = dateInput.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (yyyymmdd) {
        year = parseInt(yyyymmdd[1], 10);
        monthIndex = parseInt(yyyymmdd[2], 10) - 1;
        day = parseInt(yyyymmdd[3], 10);
      }
    }
  }

  // Fallback: if parsing failed, localize digits in raw input
  if (day == null || monthIndex == null || year == null) {
    return localizeDigits(dateInput.toString(), lang);
  }

  // If short style requested (e.g. DD/MM/YYYY)
  if (formatStyle === 'short') {
    const dd = String(day).padStart(2, '0');
    const mm = String(monthIndex + 1).padStart(2, '0');
    return localizeDigits(`${dd}/${mm}/${year}`, lang);
  }

  // Long readable format: Day Month Year
  const monthNamesMr = MONTH_NAMES.mr;
  const monthNamesHi = MONTH_NAMES.hi;

  if (lang === 'mr' && monthNamesMr[monthIndex]) {
    const localizedDay = localizeDigits(day, 'mr');
    const localizedYear = localizeDigits(year, 'mr');
    return `${localizedDay} ${monthNamesMr[monthIndex]} ${localizedYear}`;
  }

  if (lang === 'hi' && monthNamesHi[monthIndex]) {
    const localizedDay = localizeDigits(day, 'hi');
    const localizedYear = localizeDigits(year, 'hi');
    return `${localizedDay} ${monthNamesHi[monthIndex]} ${localizedYear}`;
  }

  // English & other fallback via Date object
  const d = new Date(year, monthIndex, day);
  const englishFormatted = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return localizeDigits(englishFormatted, lang);
}

/**
 * Format expected crop yield with localized unit.
 * Example:
 * 18 -> '18 quintal' in en, '१८ क्विंटल' in mr.
 * '50 - 65 q/ha' -> '50 - 65 q/ha' in en, '५० - ६५ क्विंटल/हेक्टर' in mr.
 */
export function formatYield(quintals: number | string | null | undefined, lang = 'en'): string {
  if (quintals == null || quintals === '') return '';
  const str = String(quintals).trim();

  // If it contains q/ha notation
  if (/q\/ha/i.test(str)) {
    const qHaLabel = UNIT_LABELS[lang]?.qHa || 'q/ha';
    const replaced = str.replace(/q\/ha/i, qHaLabel);
    return localizeDigits(replaced, lang);
  }

  // If it's a number or simple numeric string
  const num = typeof quintals === 'number' ? quintals : parseFloat(str);
  if (!isNaN(num) && /^-?\d+(\.\d+)?$/.test(str)) {
    const numStr = formatNumber(num, lang);
    const unit = UNIT_LABELS[lang]?.quintal || 'quintal';
    return `${numStr} ${unit}`;
  }

  return localizeDigits(str, lang);
}
