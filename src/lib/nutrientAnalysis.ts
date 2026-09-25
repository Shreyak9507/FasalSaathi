import { SoilInfo } from '@/types';
import {
  CROP_NUTRIENT_KNOWLEDGE,
  CropNutrientProfile,
  CropNutrientRequirement,
  NutrientId,
  NutrientImportance,
} from '@/data/cropNutrientKnowledge';

export type NutrientStatus = 'good' | 'low' | 'high' | 'unknown';

export interface AnalyzedNutrient {
  id: NutrientId;
  name: string;
  chemicalSymbol: string;
  soilValue: number | null;
  unit: string;
  status: NutrientStatus;
  statusLabel: string;
  badgeEmoji: '🔴' | '🟠' | '🟢' | '⚪';
  badgeColor: 'red' | 'amber' | 'green' | 'gray';
  importance: NutrientImportance;
  importanceLabel: string;
  whyItMatters: string;
  whatThisMeans: string;
  requiresAttention: boolean;
}

export interface PhAnalysis {
  value: number | null;
  status: 'suitable' | 'attention_needed' | 'unknown';
  statusLabel: string;
  badgeEmoji: '🟢' | '🟠' | '⚪';
  badgeColor: 'green' | 'amber' | 'gray';
  whyItMatters: string;
  idealRange: string;
}

export interface OrganicCarbonAnalysis {
  value: number | null;
  status: 'good' | 'low' | 'high' | 'unknown';
  statusLabel: string;
  badgeEmoji: '🟢' | '🟠' | '⚪';
  badgeColor: 'green' | 'amber' | 'gray';
  explanation: string;
}

export interface EcAnalysis {
  value: number | null;
  status: 'good' | 'attention_needed' | 'unknown';
  statusLabel: string;
  badgeEmoji: '🟢' | '🟠' | '⚪';
  badgeColor: 'green' | 'amber' | 'gray';
  explanation: string;
}

export interface CropNutrientAnalysisResult {
  hasCropGuidance: boolean;
  cropId: string;
  cropName: string;
  referenceSource: string;
  unavailableMessage?: string;
  phAnalysis: PhAnalysis;
  organicCarbonAnalysis: OrganicCarbonAnalysis;
  ecAnalysis: EcAnalysis;
  attentionNutrients: AnalyzedNutrient[];
  goodNutrients: AnalyzedNutrient[];
  unknownNutrients: AnalyzedNutrient[];
  totalAvailableCount: number;
}

/**
 * Analyzes soil data against crop-specific agronomic thresholds.
 * Never guesses missing card values; sorts nutrients with deficiency and importance prioritized.
 */
export function analyzeCropSoilNutrients(
  soil: SoilInfo | null | undefined,
  cropId: string,
  lang: string = 'en'
): CropNutrientAnalysisResult {
  const currentLang = (lang === 'mr' || lang === 'hi') ? lang : 'en';
  const cleanCropId = (cropId || '').toLowerCase().trim();
  const profile: CropNutrientProfile | undefined = CROP_NUTRIENT_KNOWLEDGE[cleanCropId];

  if (!profile) {
    return {
      hasCropGuidance: false,
      cropId: cleanCropId,
      cropName: cleanCropId || 'Selected Crop',
      referenceSource: 'Soil Health Card Norms',
      unavailableMessage: currentLang === 'mr'
        ? 'या पिकासाठी पीक-विशिष्ट अन्नद्रव्य मार्गदर्शन सध्या उपलब्ध नाही.'
        : currentLang === 'hi'
        ? 'इस फसल के लिए फसल-विशिष्ट पोषक तत्व मार्गदर्शन वर्तमान में उपलब्ध नहीं है।'
        : 'Crop-specific nutrient guidance is currently unavailable.',
      phAnalysis: {
        value: soil?.ph ?? null,
        status: 'unknown',
        statusLabel: currentLang === 'mr' ? 'अनोळखी' : currentLang === 'hi' ? 'अज्ञात' : 'Unknown',
        badgeEmoji: '⚪',
        badgeColor: 'gray',
        whyItMatters: '',
        idealRange: '6.5 - 7.5',
      },
      organicCarbonAnalysis: {
        value: soil?.organicCarbon ?? null,
        status: 'unknown',
        statusLabel: currentLang === 'mr' ? 'अनोळखी' : currentLang === 'hi' ? 'अज्ञात' : 'Unknown',
        badgeEmoji: '⚪',
        badgeColor: 'gray',
        explanation: '',
      },
      ecAnalysis: {
        value: soil?.ec ?? null,
        status: 'unknown',
        statusLabel: currentLang === 'mr' ? 'अनोळखी' : currentLang === 'hi' ? 'अज्ञात' : 'Unknown',
        badgeEmoji: '⚪',
        badgeColor: 'gray',
        explanation: '',
      },
      attentionNutrients: [],
      goodNutrients: [],
      unknownNutrients: [],
      totalAvailableCount: 0,
    };
  }

  // 1. pH Analysis
  const phVal = soil?.ph != null && !isNaN(soil.ph) && soil.ph > 0 ? soil.ph : null;
  let phStatus: 'suitable' | 'attention_needed' | 'unknown' = 'unknown';
  let phLabel = currentLang === 'mr' ? 'माहिती उपलब्ध नाही' : currentLang === 'hi' ? 'उपलब्ध नहीं' : 'Not reported';
  let phEmoji: '🟢' | '🟠' | '⚪' = '⚪';
  let phColor: 'green' | 'amber' | 'gray' = 'gray';

  if (phVal !== null) {
    if (phVal >= profile.optimalPh.min && phVal <= profile.optimalPh.max) {
      phStatus = 'suitable';
      phLabel = currentLang === 'mr' ? 'या पिकासाठी योग्य' : currentLang === 'hi' ? 'इस फसल के लिए उपयुक्त' : 'Suitable for this crop';
      phEmoji = '🟢';
      phColor = 'green';
    } else {
      phStatus = 'attention_needed';
      phLabel = currentLang === 'mr' ? 'या पिकासाठी लक्ष देणे आवश्यक' : currentLang === 'hi' ? 'इस फसल के लिए ध्यान देने योग्य' : 'May require attention for this crop';
      phEmoji = '🟠';
      phColor = 'amber';
    }
  }

  const phAnalysis: PhAnalysis = {
    value: phVal,
    status: phStatus,
    statusLabel: phLabel,
    badgeEmoji: phEmoji,
    badgeColor: phColor,
    whyItMatters: profile.phWhyItMatters[currentLang] || profile.phWhyItMatters.en,
    idealRange: `${profile.optimalPh.min} – ${profile.optimalPh.max}`,
  };

  // 2. Organic Carbon Analysis
  const ocVal = soil?.organicCarbon != null && !isNaN(soil.organicCarbon) ? soil.organicCarbon : null;
  let ocStatus: 'good' | 'low' | 'high' | 'unknown' = 'unknown';
  let ocLabel = currentLang === 'mr' ? 'माहिती उपलब्ध नाही' : currentLang === 'hi' ? 'उपलब्ध नहीं' : 'Not reported';
  let ocEmoji: '🟢' | '🟠' | '⚪' = '⚪';
  let ocColor: 'green' | 'amber' | 'gray' = 'gray';

  if (ocVal !== null) {
    if (ocVal >= 0.75) {
      ocStatus = 'high';
      ocLabel = currentLang === 'mr' ? 'उत्तम' : currentLang === 'hi' ? 'उत्तम' : 'Good';
      ocEmoji = '🟢';
      ocColor = 'green';
    } else if (ocVal >= 0.50) {
      ocStatus = 'good';
      ocLabel = currentLang === 'mr' ? 'योग्य' : currentLang === 'hi' ? 'अच्छा' : 'Good';
      ocEmoji = '🟢';
      ocColor = 'green';
    } else {
      ocStatus = 'low';
      ocLabel = currentLang === 'mr' ? 'कमी' : currentLang === 'hi' ? 'कम' : 'Low';
      ocEmoji = '🟠';
      ocColor = 'amber';
    }
  }

  const organicCarbonAnalysis: OrganicCarbonAnalysis = {
    value: ocVal,
    status: ocStatus,
    statusLabel: ocLabel,
    badgeEmoji: ocEmoji,
    badgeColor: ocColor,
    explanation: currentLang === 'mr'
      ? 'सेंद्रिय कर्ब जमिनीचा पोत सुधारतो आणि झाडांच्या निरोगी वाढीस मदत करतो.'
      : currentLang === 'hi'
      ? 'जैविक कार्बन मिट्टी की सेहत बनाए रखने और पौधों के विकास में मदद करता है।'
      : 'Organic matter helps maintain soil health and supports plant growth.',
  };

  // 3. Electrical Conductivity (EC) Analysis
  const ecVal = soil?.ec != null && !isNaN(soil.ec) ? soil.ec : null;
  let ecStatus: 'good' | 'attention_needed' | 'unknown' = 'unknown';
  let ecLabel = currentLang === 'mr' ? 'माहिती उपलब्ध नाही' : currentLang === 'hi' ? 'उपलब्ध नहीं' : 'Not reported';
  let ecEmoji: '🟢' | '🟠' | '⚪' = '⚪';
  let ecColor: 'green' | 'amber' | 'gray' = 'gray';

  if (ecVal !== null) {
    if (ecVal <= 1.0) {
      ecStatus = 'good';
      ecLabel = currentLang === 'mr' ? 'योग्य (अ-क्षारयुक्त)' : currentLang === 'hi' ? 'सामान्य' : 'Normal';
      ecEmoji = '🟢';
      ecColor = 'green';
    } else {
      ecStatus = 'attention_needed';
      ecLabel = currentLang === 'mr' ? 'जास्त क्षार' : currentLang === 'hi' ? 'अधिक लवण' : 'Elevated salinity';
      ecEmoji = '🟠';
      ecColor = 'amber';
    }
  }

  const ecAnalysis: EcAnalysis = {
    value: ecVal,
    status: ecStatus,
    statusLabel: ecLabel,
    badgeEmoji: ecEmoji,
    badgeColor: ecColor,
    explanation: currentLang === 'mr'
      ? 'विद्युत वाहकता (EC) जमिनीतील क्षारांचे प्रमाण दर्शवते.'
      : currentLang === 'hi'
      ? 'विद्युत चालकता (EC) मिट्टी में लवणों की मात्रा दर्शाती है।'
      : 'Electrical conductivity measures the salt concentration in the soil.',
  };

  // 4. Nutrient-by-Nutrient Evaluation
  const nutrientKeys: NutrientId[] = [
    'nitrogen',
    'phosphorus',
    'potassium',
    'zinc',
    'sulphur',
    'boron',
    'iron',
    'manganese',
    'copper',
  ];

  const attentionList: AnalyzedNutrient[] = [];
  const goodList: AnalyzedNutrient[] = [];
  const unknownList: AnalyzedNutrient[] = [];
  let availableCount = 0;

  for (const nKey of nutrientKeys) {
    const req: CropNutrientRequirement = profile.nutrients[nKey];
    if (!req) continue;

    const rawVal = soil ? (soil as any)[nKey] : undefined;
    const hasValue = rawVal !== undefined && rawVal !== null && !isNaN(rawVal);

    if (!hasValue) {
      unknownList.push({
        id: nKey,
        name: currentLang === 'mr' ? req.nameMr : currentLang === 'hi' ? req.nameHi : req.name,
        chemicalSymbol: req.chemicalSymbol,
        soilValue: null,
        unit: req.unit,
        status: 'unknown',
        statusLabel: currentLang === 'mr' ? 'माहिती उपलब्ध नाही' : currentLang === 'hi' ? 'उपलब्ध नहीं' : 'Not in Report',
        badgeEmoji: '⚪',
        badgeColor: 'gray',
        importance: req.importance,
        importanceLabel: req.importance,
        whyItMatters: req.whyItMatters[currentLang] || req.whyItMatters.en,
        whatThisMeans: '',
        requiresAttention: false,
      });
      continue;
    }

    availableCount++;
    const numVal = Number(rawVal);
    const isLow = numVal < req.lowThreshold;
    const isHigh = req.highThreshold != null && numVal > req.highThreshold;

    let status: NutrientStatus = 'good';
    let statusLabel = currentLang === 'mr' ? 'योग्य' : currentLang === 'hi' ? 'अच्छा' : 'Good';
    let badgeEmoji: '🔴' | '🟠' | '🟢' | '⚪' = '🟢';
    let badgeColor: 'red' | 'amber' | 'green' | 'gray' = 'green';
    let whatThisMeans = req.whatThisMeansGood[currentLang] || req.whatThisMeansGood.en;
    let requiresAttention = false;

    if (isLow) {
      status = 'low';
      statusLabel = currentLang === 'mr' ? 'लक्ष देणे आवश्यक' : currentLang === 'hi' ? 'ध्यान देने योग्य' : 'Needs attention';
      requiresAttention = true;
      whatThisMeans = req.whatThisMeansLow[currentLang] || req.whatThisMeansLow.en;

      if (req.importance === 'critical') {
        badgeEmoji = '🔴';
        badgeColor = 'red';
      } else {
        badgeEmoji = '🟠';
        badgeColor = 'amber';
      }
    } else if (isHigh) {
      status = 'high';
      statusLabel = currentLang === 'mr' ? 'जास्त' : currentLang === 'hi' ? 'अधिक' : 'High';
      requiresAttention = true;
      whatThisMeans = req.whatThisMeansHigh?.[currentLang] || req.whatThisMeansHigh?.en || whatThisMeans;
      badgeEmoji = '🟠';
      badgeColor = 'amber';
    }

    const item: AnalyzedNutrient = {
      id: nKey,
      name: currentLang === 'mr' ? req.nameMr : currentLang === 'hi' ? req.nameHi : req.name,
      chemicalSymbol: req.chemicalSymbol,
      soilValue: numVal,
      unit: req.unit,
      status,
      statusLabel,
      badgeEmoji,
      badgeColor,
      importance: req.importance,
      importanceLabel: req.importance,
      whyItMatters: req.whyItMatters[currentLang] || req.whyItMatters.en,
      whatThisMeans,
      requiresAttention,
    };

    if (requiresAttention) {
      attentionList.push(item);
    } else {
      goodList.push(item);
    }
  }

  // 5. Prioritization Sorting
  // Priority:
  // 1. Deficient + Critical (🔴)
  // 2. Deficient + High (🟠)
  // 3. Deficient + Medium (🟠)
  // 4. Excessively High
  attentionList.sort((a, b) => {
    const importanceRank: Record<NutrientImportance, number> = {
      critical: 3,
      high: 2,
      medium: 1,
    };
    if (a.status === 'low' && b.status !== 'low') return -1;
    if (b.status === 'low' && a.status !== 'low') return 1;
    return importanceRank[b.importance] - importanceRank[a.importance];
  });

  // Sort Good nutrients by importance so key nutrients are at top
  goodList.sort((a, b) => {
    const importanceRank: Record<NutrientImportance, number> = {
      critical: 3,
      high: 2,
      medium: 1,
    };
    return importanceRank[b.importance] - importanceRank[a.importance];
  });

  const cropName = currentLang === 'mr'
    ? profile.cropNameMr
    : currentLang === 'hi'
    ? profile.cropNameHi
    : profile.cropName;

  return {
    hasCropGuidance: true,
    cropId: profile.cropId,
    cropName,
    referenceSource: profile.referenceSource,
    phAnalysis,
    organicCarbonAnalysis,
    ecAnalysis,
    attentionNutrients: attentionList,
    goodNutrients: goodList,
    unknownNutrients: unknownList,
    totalAvailableCount: availableCount,
  };
}
