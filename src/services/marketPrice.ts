import { CropRequirements } from '@/data/crops';
import { MarketIntelligenceResponse, GrossCropValueEstimate } from '@/types';

/**
 * Fetch market intelligence from server-side endpoint
 */
export async function fetchMarketIntelligence(params: {
  cropId: string;
  state?: string;
  district?: string;
  lat?: number | null;
  lng?: number | null;
}): Promise<MarketIntelligenceResponse> {
  const queryParams = new URLSearchParams();
  queryParams.set('crop', params.cropId);
  if (params.state) queryParams.set('state', params.state);
  if (params.district) queryParams.set('district', params.district);
  if (params.lat != null) queryParams.set('lat', params.lat.toString());
  if (params.lng != null) queryParams.set('lng', params.lng.toString());

  try {
    const res = await fetch(`/api/market-prices?${queryParams.toString()}`);
    if (!res.ok) {
      return {
        primaryMarket: null,
        nearbyMarkets: [],
        grossValueEstimate: null,
        isAvailable: false,
        statusMessage: 'Market prices are temporarily unavailable.',
        officialSourceUrl: 'https://agmarknet.gov.in',
      };
    }

    const data: MarketIntelligenceResponse = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch market intelligence:', err);
    return {
      primaryMarket: null,
      nearbyMarkets: [],
      grossValueEstimate: null,
      isAvailable: false,
      statusMessage: 'Market prices are temporarily unavailable.',
      officialSourceUrl: 'https://agmarknet.gov.in',
    };
  }
}

/**
 * Parse expected yield from crop string (e.g. '22 q/ha' or '100 t/ha')
 * Returns yield in quintals per hectare
 */
export function parseYieldQuintalsPerHectare(yieldStr?: string): number {
  if (!yieldStr) return 20;

  const clean = yieldStr.toLowerCase().trim();
  const numMatch = clean.match(/(\d+(?:\.\d+)?)/);
  if (!numMatch) return 20;

  const num = parseFloat(numMatch[1]);
  if (clean.includes('t/ha') || clean.includes('ton')) {
    // 1 tonne = 10 quintals
    return num * 10;
  }
  return num;
}

/**
 * Calculate Estimated Gross Crop Value
 * Strictly gross value (Yield × Modal Price). Does NOT subtract unverified costs.
 * Includes mandatory disclaimer.
 */
export function calculateGrossCropValue(params: {
  crop: CropRequirements;
  modalPrice: number;
  farmSizeAcres?: number | null;
}): GrossCropValueEstimate {
  const { crop, modalPrice, farmSizeAcres } = params;

  // Farm size: use farmer's actual acres or default to 2.0 acres (standard representative smallholding)
  const actualAcres = farmSizeAcres && farmSizeAcres > 0 ? farmSizeAcres : 2.0;

  // 1 Hectare ≈ 2.471 Acres
  const yieldPerHa = parseYieldQuintalsPerHectare(crop.expectedYield);
  const yieldPerAcre = Math.round((yieldPerHa / 2.471) * 10) / 10;
  const totalQuintals = Math.round(yieldPerAcre * actualAcres);

  const estimatedGrossValue = Math.round(totalQuintals * modalPrice);

  return {
    cropId: crop.id,
    cropName: crop.name,
    farmSizeAcres: actualAcres,
    expectedYieldPerAcreQuintals: yieldPerAcre,
    totalExpectedYieldQuintals: totalQuintals,
    modalPricePerQuintal: modalPrice,
    estimatedGrossValue,
    disclaimer:
      'Estimated gross value — Actual income may differ depending on yield, quality, deductions, transport and final sale price.',
  };
}
