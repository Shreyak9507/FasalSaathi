import { ExtractedSoilCard, ValidationIssue } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  validatedCard: ExtractedSoilCard;
}

/**
 * Validates extracted Soil Health Card data against agronomic and physical plausibility standards.
 * CRITICAL RULE: This validation NEVER invents, rounds, or silently overwrites values.
 * If something looks suspicious or has low confidence, it marks it for farmer confirmation.
 */
export function validateSoilExtraction(rawCard: ExtractedSoilCard): ValidationResult {
  const issues: ValidationIssue[] = [];
  const card: ExtractedSoilCard = JSON.parse(JSON.stringify(rawCard));

  const addIssue = (field: string, message: string, severity: 'warning' | 'error' = 'warning') => {
    issues.push({ field, message, severity });
  };

  // Helper to validate nutrient item
  const checkNutrient = (
    key: keyof typeof card.soil,
    name: string,
    min: number,
    max: number,
    expectedUnitPattern?: RegExp
  ) => {
    const item = card.soil[key];
    if (!item) return;

    // Check confidence
    if (typeof item.confidence === 'number' && item.confidence < 0.65) {
      item.isFlagged = true;
      item.warning = `Confidence is low (${Math.round(item.confidence * 100)}%). Please verify this reading.`;
      addIssue(key, `${name}: Low detection confidence. Please verify.`);
    }

    if (item.value !== null && item.value !== undefined) {
      // Must be numeric
      if (typeof item.value !== 'number' || isNaN(item.value)) {
        item.isFlagged = true;
        item.warning = 'Invalid numeric format.';
        addIssue(key, `${name} must be a number.`, 'error');
        return;
      }

      // Must be non-negative
      if (item.value < 0) {
        item.isFlagged = true;
        item.warning = 'Negative value detected.';
        addIssue(key, `${name} cannot be negative.`, 'error');
      }

      // Agronomic range check
      if (item.value < min || item.value > max) {
        item.isFlagged = true;
        item.warning = `Value (${item.value}) is outside typical soil test bounds (${min}–${max}).`;
        addIssue(key, `${name} (${item.value}) seems unusually high or low for agricultural soil.`);
      }

      // Unit check
      if (expectedUnitPattern && item.unit) {
        if (!expectedUnitPattern.test(item.unit)) {
          addIssue(key, `Unit '${item.unit}' for ${name} may differ from standard.`);
        }
      }
    }
  };

  // --- Soil Chemistry & Primary Nutrients ---
  // pH: typical 3.5 to 10.5
  checkNutrient('ph', 'pH', 3.5, 10.5);
  // EC: Electrical Conductivity (dS/m), typically 0.01 to 6.0
  checkNutrient('ec', 'Electrical Conductivity (EC)', 0.01, 8.0, /ds\/m|mho/i);
  // Organic Carbon (%): typically 0.05% to 4.0%
  checkNutrient('organicCarbon', 'Organic Carbon', 0.05, 4.0, /%/);
  // Available Nitrogen (kg/ha): typically 50 to 700
  checkNutrient('nitrogen', 'Available Nitrogen', 40, 700, /kg\/ha/i);
  // Available Phosphorus (kg/ha): typically 2 to 150
  checkNutrient('phosphorus', 'Available Phosphorus', 2, 150, /kg\/ha/i);
  // Available Potassium (kg/ha): typically 40 to 600
  checkNutrient('potassium', 'Available Potassium', 30, 700, /kg\/ha/i);

  // --- Micronutrients (mg/kg or ppm) ---
  // Sulphur (S): typically 1 to 50
  checkNutrient('sulphur', 'Sulphur (S)', 1, 50, /mg\/kg|ppm/i);
  // Zinc (Zn): typically 0.1 to 10.0
  checkNutrient('zinc', 'Zinc (Zn)', 0.1, 10.0, /mg\/kg|ppm/i);
  // Boron (B): typically 0.05 to 5.0
  checkNutrient('boron', 'Boron (B)', 0.05, 5.0, /mg\/kg|ppm/i);
  // Iron (Fe): typically 0.5 to 40.0
  checkNutrient('iron', 'Iron (Fe)', 0.5, 40.0, /mg\/kg|ppm/i);
  // Manganese (Mn): typically 0.5 to 50.0
  checkNutrient('manganese', 'Manganese (Mn)', 0.5, 50.0, /mg\/kg|ppm/i);
  // Copper (Cu): typically 0.05 to 10.0
  checkNutrient('copper', 'Copper (Cu)', 0.05, 10.0, /mg\/kg|ppm/i);

  // --- Coordinates Validation (India geographic envelope roughly Lat 6–38, Lng 68–98) ---
  if (card.sample.latitude !== null && card.sample.latitude !== undefined) {
    if (card.sample.latitude < 6.0 || card.sample.latitude > 38.5) {
      addIssue('latitude', 'Latitude is outside standard Indian geographic bounds.');
    }
  }
  if (card.sample.longitude !== null && card.sample.longitude !== undefined) {
    if (card.sample.longitude < 68.0 || card.sample.longitude > 98.5) {
      addIssue('longitude', 'Longitude is outside standard Indian geographic bounds.');
    }
  }

  // --- Farm size ---
  if (card.sample.farmSize !== null && card.sample.farmSize !== undefined) {
    if (card.sample.farmSize <= 0) {
      addIssue('farmSize', 'Farm size must be greater than zero.', 'error');
    }
    if (card.sample.farmSize > 1000) {
      addIssue('farmSize', 'Farm size seems unusually large.');
    }
  }

  // --- Date plausibility ---
  if (card.sample.sampleDate) {
    const parsed = Date.parse(card.sample.sampleDate);
    if (isNaN(parsed)) {
      // If in DD/MM/YYYY format
      const dmy = card.sample.sampleDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      if (!dmy) {
        addIssue('sampleDate', 'Date format could not be verified automatically.');
      }
    }
  }

  card.issues = issues;

  return {
    isValid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    validatedCard: card,
  };
}
