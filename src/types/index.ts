export interface FarmerInfo {
  name: string;
  farmLocation: string;
  landArea: number;
  unit: 'acre' | 'hectare';
  irrigation: 'available' | 'limited' | 'rainfed';
  farmSize?: number;
}

export interface Micronutrients {
  sulphur?: number; // mg/kg or ppm (normal: > 10 ppm)
  zinc?: number; // mg/kg or ppm (normal: > 0.6 ppm)
  iron?: number; // mg/kg or ppm (normal: > 4.5 ppm)
  boron?: number; // mg/kg or ppm (normal: > 0.5 ppm)
  manganese?: number; // mg/kg or ppm (normal: > 2.0 ppm)
  copper?: number; // mg/kg or ppm (normal: > 0.2 ppm)
}

export interface SoilInfo {
  // Primary nutrients & physical properties
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  ph: number; // 0-14
  organicCarbon: number; // %
  ec?: number; // dS/m (electrical conductivity)

  // Secondary & micronutrients (expanded)
  sulphur?: number; // ppm / kg/ha
  zinc?: number; // ppm
  iron?: number; // ppm
  boron?: number; // ppm
  manganese?: number; // ppm
  copper?: number; // ppm

  // Metadata
  sampleDate?: string; // YYYY-MM-DD or formatted date
  testDate?: string;
  labName?: string;
  soilHealthCardNumber?: string;
  farmArea?: number;
  acres?: string;
  irrigationType?: string;
  rainfallInfo?: string;
  latitude?: number;
  longitude?: number;

  source?: 'upload' | 'demo' | 'manual';
  confidenceScores?: Record<string, number>;
  flaggedFields?: string[];

  // Government Card Recommendations & Validity
  validityPeriod?: CardValidityPeriod;
  cropRecommendations?: string[];
  fertilizerRecommendations?: CardFertilizerRecommendations;
}

export interface CardValidityPeriod {
  startDate?: string | null;
  endDate?: string | null;
  isValid?: boolean;
}

export interface CardFertilizerItem {
  cropName: string;
  variety?: string | null;
  referenceYield?: string | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  npkKgHa?: string | null;
}

export interface CardFertilizerRecommendations {
  organicManure?: string | null;
  biofertilizer?: string | null;
  gypsumLime?: string | null;
  sulphur?: string | null;
  zinc?: string | null;
  boron?: string | null;
  iron?: string | null;
  manganese?: string | null;
  copper?: string | null;
  cropSpecific?: CardFertilizerItem[];
}

export interface FarmerDetails {
  name: string | null;
  farmerName?: string | null;
  address?: string | null;
  village: string | null;
  subDistrict: string | null;
  district: string | null;
  state?: string | null;
  pin: string | null;
}

export interface SampleDetails {
  cardNumber: string | null;
  sampleNumber: string | null;
  sampleDate: string | null;
  testDate?: string | null;
  labName?: string | null;
  farmSize: number | null;
  farmSizeUnit: string | null;
  latitude: number | null;
  longitude: number | null;
  irrigation: string | null;
  rainfallType?: string | null;
}

export interface NutrientReading {
  value: number | null;
  unit: string | null;
  rating: string | null;
  confidence: number;
  isFlagged?: boolean;
  warning?: string;
}

export interface SoilNutrients {
  ph: NutrientReading;
  ec: NutrientReading;
  organicCarbon: NutrientReading;
  nitrogen: NutrientReading;
  phosphorus: NutrientReading;
  potassium: NutrientReading;
  sulphur: NutrientReading;
  zinc: NutrientReading;
  boron: NutrientReading;
  iron: NutrientReading;
  manganese: NutrientReading;
  copper: NutrientReading;
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface ExtractedSoilCard {
  farmer: FarmerDetails;
  sample: SampleDetails;
  soil: SoilNutrients;
  rawConfidence: number;
  validityPeriod?: CardValidityPeriod;
  cropRecommendations?: string[];
  fertilizerRecommendations?: CardFertilizerRecommendations;
  issues?: ValidationIssue[];
}

export interface SoilExtractionResult {
  success: boolean;
  data: SoilInfo;
  extractedCard?: ExtractedSoilCard;
  farmerInfo?: FarmerInfo;
  locationInfo?: LocationInfo;
  confidence: number;
  extractedFieldsCount: number;
  validationIssues?: ValidationIssue[];
  fallbackRequired?: boolean;
  notes?: string;
  error?: string;
}

export type FarmLocationSource = 'soil_report' | 'current_gps' | 'manual' | 'gps' | 'card' | 'search' | 'demo';

export interface FarmLocationRecord {
  lat: number;
  lng: number;
  display: string;
  name?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  isValid: boolean;
}

export interface LocationInfo {
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  display: string;
  name?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  source?: FarmLocationSource;
  soilCardLocation?: FarmLocationRecord | null;
}

export interface OfficialSoilLab {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string | null;
  email: string | null;
  lat: number | null;
  lng: number | null;
  distanceKm: number | null;
  subdistrict: string | null;
  district: string;
  state: string;
}

export interface ForecastDay {
  day: string;
  high: number;
  low: number;
  rain: number;
  icon: string;
  description: string;
}

export interface WeatherInfo {
  lat?: number;
  lng?: number;
  gridLat?: number;
  gridLng?: number;
  timezone?: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: ForecastDay[];
  source?: 'api' | 'demo';
}

export interface RangeIdeal {
  min: number;
  max: number;
  ideal: number;
}

export interface CropRequirements {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  nameBn?: string;
  nameGu?: string;
  nameKn?: string;
  nameMl?: string;
  namePa?: string;
  nameTa?: string;
  nameTe?: string;
  emoji: string;
  nitrogen: RangeIdeal;
  phosphorus: RangeIdeal;
  potassium: RangeIdeal;
  ph: RangeIdeal;
  organicCarbon: RangeIdeal;
  temperature: { min: number; max: number; ideal: number };
  humidity: { min: number; max: number; ideal: number };
  rainfall: 'low' | 'moderate' | 'high';
  irrigationPreference: 'available' | 'limited' | 'rainfed';
  season: string;
  durationMonths?: number;
  approxDuration?: string;
  expectedYield?: string;
  suitableSoilTypes?: string[];
  soilConditions?: string;
  requiredNutrients?: string;
  deficiencyRisks?: string;
  fertilizerGuide?: string;
  description: string;
  descriptionHi: string;
  descriptionMr: string;
}

export interface FactorScore {
  factor: string;
  score: number;
  weight: number;
  isSuitable: boolean;
  reason: string;
  concern?: string;
}

export interface CropSuitability {
  crop: CropRequirements;
  score: number;
  matchLevel: 'strong' | 'good' | 'moderate' | 'poor';
  factors: FactorScore[];
  soilScore: number;
  weatherScore: number;
  irrigationScore: number;
  keyReasons: string[];
  potentialConcerns: string[];
}

export type MarketPriceRecency = 'today' | 'recent' | 'older';

export interface MarketPriceInfo {
  cropId: string;
  cropName: string;
  apmcName: string;
  marketLocation: string; // e.g. 'Pune APMC, Gultekdi'
  state: string;
  district: string;
  variety?: string | null;
  modalPrice: number; // ₹/quintal - primary typical market price
  minPrice?: number;
  maxPrice?: number;
  priceUnit: string; // e.g. '₹/quintal'
  priceDate: string; // formatted date string e.g. '25/09/2026'
  recency: MarketPriceRecency;
  daysAgo: number;
  distanceKm?: number | null;
  distanceLabel: string; // e.g. '~18 km' or 'Nearby market'
  comparison?: 'primary' | 'higher' | 'lower' | 'similar';
  priceDifference?: number | null;
  source: 'agmarknet_live' | 'agmarknet_recent' | 'agmarknet_benchmark';
  sourceName: string; // 'Government of India / AGMARKNET'
  sourceUrl: string; // 'https://agmarknet.gov.in'
  sourceTimestamp?: string;
}

export interface GrossCropValueEstimate {
  cropId: string;
  cropName: string;
  farmSizeAcres: number;
  expectedYieldPerAcreQuintals: number;
  totalExpectedYieldQuintals: number;
  modalPricePerQuintal: number;
  estimatedGrossValue: number;
  disclaimer: string;
}

export interface MarketIntelligenceResponse {
  primaryMarket: MarketPriceInfo | null;
  nearbyMarkets: MarketPriceInfo[];
  grossValueEstimate: GrossCropValueEstimate | null;
  isAvailable: boolean;
  statusMessage?: string;
  officialSourceUrl: string;
}

export interface NutrientSupplied {
  nutrient: string;
  percentage?: string;
  symbol: string;
}

export interface FertilizerPriceRecord {
  amount: number | null;
  unit: string;
  currency: string;
  source: string | null;
  date: string | null;
  sourceUrl?: string;
  isAvailable?: boolean;
}

export interface FertilizerProduct {
  id: string;
  name: string;
  nameLocal: { en: string; mr: string; hi: string };
  category: string;
  categoryLocal: { en: string; mr: string; hi: string };
  nutrientsSupplied: NutrientSupplied[];
  targetedDeficiencies: Array<
    | 'nitrogen'
    | 'phosphorus'
    | 'potassium'
    | 'sulphur'
    | 'zinc'
    | 'boron'
    | 'iron'
    | 'manganese'
    | 'copper'
    | 'organicCarbon'
  >;
  commonPackSizes: string[];
  benefitDescription: { en: string; mr: string; hi: string };
  referencePrice: FertilizerPriceRecord;
  currentPrice: FertilizerPriceRecord;
  productImage: {
    imageUrl: string;
    isVerifiedReal: boolean;
    categoryVisual: string;
    altText: { en: string; mr: string; hi: string };
  };
  productSource: {
    sourceName: string;
    url?: string;
  };
  regulatoryNotes?: string;
}

export interface FertilizerRecommendation {
  nutrientId: string;
  nutrientName: string;
  nutrientSymbol: string;
  status: 'low' | 'good' | 'high' | 'unknown';
  statusLabel: string;
  whyCropNeedsIt: string;
  whatCanReplenishIt: string;
  matchedProducts: FertilizerProduct[];
}

export interface CropReplenishmentPlan {
  cropId: string;
  cropName: string;
  farmArea?: number;
  farmUnit?: string;
  recommendations: FertilizerRecommendation[];
  generalMaintenance?: {
    title: string;
    description: string;
  };
}
