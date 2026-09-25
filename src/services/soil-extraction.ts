import { SoilInfo, FarmerInfo, LocationInfo, ExtractedSoilCard, SoilExtractionResult, NutrientReading } from '@/types';
import { demoSoilData } from '@/data/demo';
import { preprocessSoilCardImage } from './image-preprocessing';

// Module-level storage for pending file across route transitions
let pendingSoilFile: File | null = null;

export function setPendingSoilFile(file: File | null) {
  pendingSoilFile = file;
}

export function getPendingSoilFile(): File | null {
  return pendingSoilFile;
}

export function mapCardToEntities(card: ExtractedSoilCard): {
  soil: SoilInfo;
  farmer: FarmerInfo;
  location?: LocationInfo;
} {
  const nutrients = card.soil || {} as any;
  const farmerDetails = card.farmer || {};
  const sampleDetails = card.sample || {};

  const soil: SoilInfo = {
    nitrogen: nutrients.nitrogen?.value ?? 0,
    phosphorus: nutrients.phosphorus?.value ?? 0,
    potassium: nutrients.potassium?.value ?? 0,
    ph: nutrients.ph?.value ?? 7.0,
    ec: nutrients.ec?.value != null ? nutrients.ec.value : undefined,
    organicCarbon: nutrients.organicCarbon?.value ?? 0.5,
    sulphur: nutrients.sulphur?.value != null ? nutrients.sulphur.value : undefined,
    zinc: nutrients.zinc?.value != null ? nutrients.zinc.value : undefined,
    iron: nutrients.iron?.value != null ? nutrients.iron.value : undefined,
    boron: nutrients.boron?.value != null ? nutrients.boron.value : undefined,
    manganese: nutrients.manganese?.value != null ? nutrients.manganese.value : undefined,
    copper: nutrients.copper?.value != null ? nutrients.copper.value : undefined,
    sampleDate: sampleDetails.sampleDate || '',
    testDate: sampleDetails.testDate || '',
    labName: sampleDetails.labName || '',
    soilHealthCardNumber: sampleDetails.sampleNumber || sampleDetails.cardNumber || '',
    validityPeriod: card.validityPeriod,
    cropRecommendations: card.cropRecommendations,
    fertilizerRecommendations: card.fertilizerRecommendations,
    source: 'upload',
  };

  const farmLocParts = [
    farmerDetails.village,
    farmerDetails.subDistrict,
    farmerDetails.district,
    farmerDetails.state,
  ].filter(Boolean);

  const rawIrrigation = String(sampleDetails.irrigation || '').toLowerCase();
  const irrigation: 'available' | 'limited' | 'rainfed' = 
    rawIrrigation.includes('rain') ? 'rainfed' :
    rawIrrigation.includes('limit') ? 'limited' : 'available';

  const rawUnit = String(sampleDetails.farmSizeUnit || 'hectare').toLowerCase();
  const unit: 'acre' | 'hectare' = rawUnit.includes('hec') ? 'hectare' : 'acre';

  const farmer: FarmerInfo = {
    name: farmerDetails.name || farmerDetails.farmerName || '',
    farmLocation: farmLocParts.join(', '),
    landArea: sampleDetails.farmSize || 0,
    unit,
    irrigation,
  };

  let location: LocationInfo | undefined = undefined;
  if (
    typeof sampleDetails.latitude === 'number' &&
    typeof sampleDetails.longitude === 'number' &&
    sampleDetails.latitude !== 0 &&
    sampleDetails.longitude !== 0
  ) {
    const locDisplay = [farmerDetails.village, farmerDetails.district, farmerDetails.state]
      .filter(Boolean)
      .join(', ') || `${sampleDetails.latitude}, ${sampleDetails.longitude}`;

    location = {
      lat: sampleDetails.latitude,
      lng: sampleDetails.longitude,
      display: locDisplay,
      name: farmerDetails.village || farmerDetails.district || locDisplay,
      district: farmerDetails.district || undefined,
      state: farmerDetails.state || undefined,
      source: 'card',
    };
  }

  return { soil, farmer, location };
}

export async function extractSoilDataFromFile(inputFile?: File): Promise<SoilExtractionResult> {
  const file = inputFile || pendingSoilFile;

  // If no file provided, prompt manual entry / fallback
  if (!file) {
    return {
      success: false,
      fallbackRequired: true,
      data: demoSoilData,
      confidence: 0,
      extractedFieldsCount: 0,
      error: 'errors.invalidFormat',
      notes: 'No file provided. Please upload a Soil Health Card or enter details manually.',
    };
  }

  // Max 25MB check
  if (file.size > 25 * 1024 * 1024) {
    return {
      success: false,
      fallbackRequired: true,
      data: demoSoilData,
      confidence: 0,
      extractedFieldsCount: 0,
      error: 'errors.fileTooLarge',
      notes: 'Uploaded file exceeds 25MB.',
    };
  }

  try {
    // 1. Client-side Image Preprocessing (scale, normalize orientation)
    let processedFile = file;
    try {
      const preprocessed = await preprocessSoilCardImage(file);
      processedFile = preprocessed.file;
    } catch (prepErr) {
      console.warn('Image preprocessing skipped or failed, proceeding with original file:', prepErr);
      processedFile = file;
    }

    // 2. Transmit to Vision Extraction API
    const formData = new FormData();
    formData.append('file', processedFile);

    const res = await fetch('/api/extract-soil-card', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        fallbackRequired: true,
        data: demoSoilData,
        confidence: 0,
        extractedFieldsCount: 0,
        error: `Extraction failed with HTTP ${res.status}: ${errText}`,
        notes: 'Could not connect to extraction service. Please verify values manually.',
      };
    }

    const json = await res.json();

    if (!json.success || !json.data) {
      return {
        success: false,
        fallbackRequired: true,
        data: demoSoilData,
        confidence: 0,
        extractedFieldsCount: 0,
        error: json.error || 'Document extraction could not parse the report.',
        notes: json.message || 'Vision model could not read this card clearly. Please enter values manually.',
      };
    }

    const card: ExtractedSoilCard = json.data;
    const { soil, farmer, location } = mapCardToEntities(card);

    // Count non-null nutrient fields
    const nutrientRecord = (card.soil || {}) as unknown as Record<string, NutrientReading | undefined>;
    let count = 0;
    const keys = ['nitrogen', 'phosphorus', 'potassium', 'ph', 'ec', 'organicCarbon', 'sulphur', 'zinc', 'iron', 'boron', 'manganese', 'copper'];
    for (const k of keys) {
      const reading = nutrientRecord[k];
      if (reading && reading.value != null && !isNaN(reading.value)) {
        count++;
      }
    }

    return {
      success: true,
      data: soil,
      extractedCard: card,
      farmerInfo: farmer,
      locationInfo: location,
      confidence: card.rawConfidence || 0.9,
      extractedFieldsCount: count,
      validationIssues: json.validationIssues || card.issues || [],
      notes: `Successfully extracted ${count} soil and farm parameters.`,
    };
  } catch (err: any) {
    console.error('extractSoilDataFromFile error:', err);
    return {
      success: false,
      fallbackRequired: true,
      data: demoSoilData,
      confidence: 0,
      extractedFieldsCount: 0,
      error: err?.message || 'Network error during extraction',
      notes: 'An unexpected error occurred. You can enter or review values manually.',
    };
  }
}
