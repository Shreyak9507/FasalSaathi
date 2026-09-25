import { CropRequirements } from '../data/crops';

export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  organicCarbon: number;
  sulphur?: number;
  zinc?: number;
  iron?: number;
  boron?: number;
  manganese?: number;
  copper?: number;
  cropRecommendations?: string[];
  fertilizerRecommendations?: any;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainProbability: number;
}

export interface FarmData {
  irrigation: 'available' | 'limited' | 'rainfed';
}

export interface FactorScore {
  factor: string;
  score: number;
  status: 'good' | 'moderate' | 'poor';
  suitable: boolean;
  reason: string;
}

export interface CropSuitability {
  cropId: string;
  crop?: CropRequirements;
  overallScore: number;
  matchLevel: 'strong' | 'good' | 'moderate' | 'poor';
  factors: FactorScore[];
  keyReasons: string[];
  potentialConcerns: string[];
  isCardRecommended?: boolean;
  cardDosage?: string;
}

function scoreNumeric(value: number, min: number, max: number, ideal: number): number {
  if (value >= min && value <= max) {
    const maxDist = Math.max(Math.abs(max - ideal), Math.abs(min - ideal));
    const dist = Math.abs(value - ideal);
    return maxDist === 0 ? 100 : Math.round(100 - 40 * (dist / maxDist));
  } else {
    const rangeWidth = max - min;
    const distOutside = value < min ? min - value : value - max;
    return Math.max(0, Math.round(60 - 60 * distOutside / (rangeWidth > 0 ? rangeWidth : 1)));
  }
}

function getFactorStatus(score: number): 'good' | 'moderate' | 'poor' {
  if (score >= 70) return 'good';
  if (score >= 40) return 'moderate';
  return 'poor';
}

function getFactorReasonKey(factor: string, status: 'good' | 'moderate' | 'poor'): string {
  const reasonMap: Record<string, Record<string, string>> = {
    nitrogen: { good: 'nitrogenGood', moderate: 'nitrogenGood', poor: 'nitrogenLow' },
    phosphorus: { good: 'phosphorusGood', moderate: 'phosphorusGood', poor: 'phosphorusLow' },
    potassium: { good: 'potassiumGood', moderate: 'potassiumGood', poor: 'potassiumLow' },
    ph: { good: 'soilPhSuitable', moderate: 'soilPhSuitable', poor: 'soilPhNotIdeal' },
    organicCarbon: { good: 'organicCarbonGood', moderate: 'organicCarbonGood', poor: 'organicCarbonLow' },
    temp: { good: 'tempSuitable', moderate: 'tempSuitable', poor: 'tempNotIdeal' },
    humidity: { good: 'humiditySuitable', moderate: 'humiditySuitable', poor: 'humidityNotIdeal' },
    rain: { good: 'rainSuitable', moderate: 'rainSuitable', poor: 'rainNotIdeal' },
    irrigation: { good: 'irrigationSuitable', moderate: 'irrigationSuitable', poor: 'irrigationNotIdeal' },
  };
  return reasonMap[factor]?.[status] || 'tempSuitable';
}

export function calculateSuitability(
  crop: CropRequirements,
  soil: SoilData,
  weather: WeatherData,
  farm: FarmData
): CropSuitability {
  const factors: FactorScore[] = [];
  const keyReasons: string[] = [];
  const potentialConcerns: string[] = [];

  // --- Soil Factors ---
  const soilFactors: { key: keyof SoilData; range: { min: number; max: number; ideal: number } }[] = [
    { key: 'nitrogen', range: crop.nitrogen },
    { key: 'phosphorus', range: crop.phosphorus },
    { key: 'potassium', range: crop.potassium },
    { key: 'ph', range: crop.ph },
    { key: 'organicCarbon', range: crop.organicCarbon },
  ];

  let soilScoreTotal = 0;
  for (const { key, range } of soilFactors) {
    const val = Number(soil[key]) || 0;
    const score = scoreNumeric(val, range.min, range.max, range.ideal);
    const status = getFactorStatus(score);
    const reasonKey = getFactorReasonKey(key, status);
    factors.push({
      factor: key,
      score,
      status,
      suitable: score >= 50,
      reason: reasonKey,
    });
    soilScoreTotal += score;

    if (score >= 70) {
      keyReasons.push(reasonKey);
    } else if (score < 50) {
      potentialConcerns.push(reasonKey);
    }
  }

  // --- Weather: Temperature ---
  const tempScore = scoreNumeric(weather.temp, crop.temperature.min, crop.temperature.max, crop.temperature.ideal);
  const tempStatus = getFactorStatus(tempScore);
  const tempReason = getFactorReasonKey('temp', tempStatus);
  factors.push({
    factor: 'temp',
    score: tempScore,
    status: tempStatus,
    suitable: tempScore >= 50,
    reason: tempReason,
  });
  if (tempScore >= 70) keyReasons.push(tempReason);
  else if (tempScore < 50) potentialConcerns.push(tempReason);

  // --- Weather: Humidity ---
  const humScore = scoreNumeric(weather.humidity, crop.humidity.min, crop.humidity.max, crop.humidity.ideal);
  const humStatus = getFactorStatus(humScore);
  const humReason = getFactorReasonKey('humidity', humStatus);
  factors.push({
    factor: 'humidity',
    score: humScore,
    status: humStatus,
    suitable: humScore >= 50,
    reason: humReason,
  });
  if (humScore >= 70) keyReasons.push(humReason);
  else if (humScore < 50) potentialConcerns.push(humReason);

  // --- Rainfall ---
  let rainLevel: 'low' | 'moderate' | 'high' = 'high';
  if (weather.rainProbability <= 30) rainLevel = 'low';
  else if (weather.rainProbability <= 60) rainLevel = 'moderate';

  const levels: ('low' | 'moderate' | 'high')[] = ['low', 'moderate', 'high'];
  const cropIdx = levels.indexOf(crop.rainfall);
  const actualIdx = levels.indexOf(rainLevel);
  const diff = Math.abs(cropIdx - actualIdx);

  const rainScore = diff === 0 ? 100 : diff === 1 ? 65 : 30;
  const rainStatus = getFactorStatus(rainScore);
  const rainReason = getFactorReasonKey('rain', rainStatus);
  factors.push({
    factor: 'rain',
    score: rainScore,
    status: rainStatus,
    suitable: rainScore >= 50,
    reason: rainReason,
  });
  if (rainScore >= 70) keyReasons.push(rainReason);
  else if (rainScore < 50) potentialConcerns.push(rainReason);

  // --- Irrigation ---
  let irrigationScore = 30;
  if (crop.irrigationPreference.includes(farm.irrigation)) {
    irrigationScore = 100;
  } else if (farm.irrigation === 'available') {
    irrigationScore = 80;
  }
  const irStatus = getFactorStatus(irrigationScore);
  const irReason = getFactorReasonKey('irrigation', irStatus);
  factors.push({
    factor: 'irrigation',
    score: irrigationScore,
    status: irStatus,
    suitable: irrigationScore >= 50,
    reason: irReason,
  });
  if (irrigationScore >= 70) keyReasons.push(irReason);
  else if (irrigationScore < 50) potentialConcerns.push(irReason);

  // --- Overall weighted score ---
  // Soil: 40%, Weather: 35%, Water/Irrigation: 25%
  const avgSoil = soilScoreTotal / 5;
  const avgWeather = (tempScore + humScore + rainScore) / 3;
  let overallScore = Math.round(avgSoil * 0.40 + avgWeather * 0.35 + irrigationScore * 0.25);

  // Check if crop matches official card recommendations
  const cardCrops = (soil.cropRecommendations || []).map(c => String(c).toLowerCase());
  const isCardRecommended = cardCrops.some(c => 
    c.includes(crop.id.toLowerCase()) || 
    c.includes(crop.name.toLowerCase()) ||
    (crop.id === 'rice' && (c.includes('paddy') || c.includes('dhaan')))
  );

  if (isCardRecommended) {
    // Official government recommendation boost
    overallScore = Math.min(100, overallScore + 8);
    keyReasons.unshift('cardRecommended');
  }

  // Extract crop-specific fertilizer dosage if specified on the card
  let cardDosage: string | undefined = undefined;
  const cropSpecificList = soil.fertilizerRecommendations?.cropSpecific || [];
  const foundCrop = cropSpecificList.find((item: any) => {
    const n = String(item.cropName || '').toLowerCase();
    return n.includes(crop.id) || n.includes(crop.name.toLowerCase()) || (crop.id === 'rice' && (n.includes('paddy') || n.includes('dhaan')));
  });

  if (foundCrop) {
    if (foundCrop.npkKgHa) {
      cardDosage = foundCrop.npkKgHa;
    } else {
      const n = foundCrop.nitrogen != null ? `N: ${foundCrop.nitrogen} kg/ha` : '';
      const p = foundCrop.phosphorus != null ? `P: ${foundCrop.phosphorus} kg/ha` : '';
      const k = foundCrop.potassium != null ? `K: ${foundCrop.potassium} kg/ha` : '';
      cardDosage = [n, p, k].filter(Boolean).join(', ');
    }
  }

  let matchLevel: CropSuitability['matchLevel'] = 'poor';
  if (overallScore >= 80) matchLevel = 'strong';
  else if (overallScore >= 65) matchLevel = 'good';
  else if (overallScore >= 50) matchLevel = 'moderate';

  // Ensure there are at least 1-2 positive reasons and at most 2 concerns
  if (keyReasons.length === 0) {
    keyReasons.push('soilPhSuitable');
  }

  return {
    cropId: crop.id,
    crop,
    overallScore,
    matchLevel,
    factors,
    keyReasons: Array.from(new Set(keyReasons)).slice(0, 3),
    potentialConcerns: Array.from(new Set(potentialConcerns)).slice(0, 2),
    isCardRecommended,
    cardDosage,
  };
}

export function getRecommendations(
  crops: CropRequirements[],
  soil: SoilData,
  weather: WeatherData,
  farm: FarmData
): CropSuitability[] {
  return crops
    .map(crop => calculateSuitability(crop, soil, weather, farm))
    .sort((a, b) => b.overallScore - a.overallScore);
}
