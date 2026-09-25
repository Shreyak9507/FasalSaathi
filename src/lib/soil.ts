import { SoilData } from './recommendation';

export type SoilStatus = 'good' | 'moderate' | 'low' | 'high' | 'suitable' | 'acidic' | 'alkaline' | 'poor';

export interface SoilClassification {
  nitrogen: SoilStatus;
  phosphorus: SoilStatus;
  potassium: SoilStatus;
  ph: SoilStatus;
  organicCarbon: SoilStatus;
  sulphur?: SoilStatus;
  zinc?: SoilStatus;
  iron?: SoilStatus;
  boron?: SoilStatus;
  manganese?: SoilStatus;
  copper?: SoilStatus;
  overall: 'good' | 'moderate' | 'poor';
}

export interface StatusStyle {
  bg: string;
  text: string;
  dot: string;
  toString(): string;
}

export function classifySoil(soil: SoilData): SoilClassification {
  const classification: Partial<SoilClassification> = {};
  
  // Nitrogen (kg/ha)
  if (soil.nitrogen < 140) classification.nitrogen = 'low';
  else if (soil.nitrogen <= 280) classification.nitrogen = 'moderate';
  else classification.nitrogen = 'good';

  // Phosphorus (kg/ha)
  if (soil.phosphorus < 10) classification.phosphorus = 'low';
  else if (soil.phosphorus <= 25) classification.phosphorus = 'moderate';
  else classification.phosphorus = 'good';

  // Potassium (kg/ha)
  if (soil.potassium < 110) classification.potassium = 'low';
  else if (soil.potassium <= 280) classification.potassium = 'moderate';
  else classification.potassium = 'good';

  // pH
  if (soil.ph < 6.0) classification.ph = 'acidic';
  else if (soil.ph <= 7.5) classification.ph = 'suitable';
  else classification.ph = 'alkaline';

  // Organic Carbon (%)
  if (soil.organicCarbon < 0.4) classification.organicCarbon = 'low';
  else if (soil.organicCarbon <= 0.75) classification.organicCarbon = 'moderate';
  else classification.organicCarbon = 'good';

  // Micronutrients (ppm) if available
  if (soil.sulphur !== undefined) {
    classification.sulphur = soil.sulphur < 10 ? 'low' : 'good';
  }
  if (soil.zinc !== undefined) {
    classification.zinc = soil.zinc < 0.6 ? 'low' : 'good';
  }
  if (soil.iron !== undefined) {
    classification.iron = soil.iron < 4.5 ? 'low' : 'good';
  }
  if (soil.boron !== undefined) {
    classification.boron = soil.boron < 0.5 ? 'low' : 'good';
  }
  if (soil.manganese !== undefined) {
    classification.manganese = soil.manganese < 2.0 ? 'low' : 'good';
  }
  if (soil.copper !== undefined) {
    classification.copper = soil.copper < 0.2 ? 'low' : 'good';
  }

  const primaryStatuses = [
    classification.nitrogen,
    classification.phosphorus,
    classification.potassium,
    classification.ph,
    classification.organicCarbon
  ];

  let problems = 0;
  for (const status of primaryStatuses) {
    if (['low', 'acidic', 'alkaline', 'high', 'poor'].includes(status as string)) {
      problems++;
    }
  }

  if (problems > 1) {
    classification.overall = 'poor';
  } else if (problems === 1) {
    classification.overall = 'moderate';
  } else {
    classification.overall = 'good';
  }

  return classification as SoilClassification;
}

export function getStatusColor(status: SoilStatus | string): StatusStyle {
  if (status === 'good' || status === 'suitable') {
    return {
      bg: 'bg-green-50',
      text: 'text-green-700',
      dot: 'bg-green-500',
      toString() { return 'text-green-600'; }
    };
  }
  if (status === 'moderate') {
    return {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
      toString() { return 'text-amber-500'; }
    };
  }
  return {
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    toString() { return 'text-red-500'; }
  };
}
