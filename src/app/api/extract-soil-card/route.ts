import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { ExtractedSoilCard } from '@/types';
import { validateSoilExtraction } from '@/services/soil-validation';

export const runtime = 'nodejs';

// Strict OpenAPI/JSON schema matching user specifications
const nutrientSchema = {
  type: Type.OBJECT,
  properties: {
    value: { type: Type.NUMBER, description: 'Exact numeric reading (preserve decimals). Null if not present.' },
    unit: { type: Type.STRING, description: 'Reported unit (e.g. kg/ha, %, dS/m, mg/kg, ppm). Null if none.' },
    rating: { type: Type.STRING, description: 'Agronomic rating (e.g. Low, Medium, High, Sufficient, Neutral). Null if none.' },
    confidence: { type: Type.NUMBER, description: 'Confidence in reading between 0.0 and 1.0.' },
  },
  required: ['value', 'unit', 'rating', 'confidence'],
};

const soilCardSchema = {
  type: Type.OBJECT,
  properties: {
    farmer: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: 'Farmer name' },
        address: { type: Type.STRING, description: 'Address line or null' },
        village: { type: Type.STRING, description: 'Village name' },
        subDistrict: { type: Type.STRING, description: 'Tehsil / Taluka / Sub-district' },
        district: { type: Type.STRING, description: 'District name' },
        pin: { type: Type.STRING, description: 'PIN code' },
      },
    },
    sample: {
      type: Type.OBJECT,
      properties: {
        cardNumber: { type: Type.STRING, description: 'Soil Health Card number or sample code' },
        sampleNumber: { type: Type.STRING, description: 'Sample number' },
        sampleDate: { type: Type.STRING, description: 'Date sample was collected or tested' },
        farmSize: { type: Type.NUMBER, description: 'Farm size as a number' },
        farmSizeUnit: { type: Type.STRING, description: 'ha, acre, etc.' },
        latitude: { type: Type.NUMBER, description: 'GPS Latitude if recorded' },
        longitude: { type: Type.NUMBER, description: 'GPS Longitude if recorded' },
        irrigation: { type: Type.STRING, description: 'Irrigated, Rainfed, or Tube well' },
        rainfallType: { type: Type.STRING, description: 'Rainfall category if given' },
      },
    },
    soil: {
      type: Type.OBJECT,
      properties: {
        ph: nutrientSchema,
        ec: nutrientSchema,
        organicCarbon: nutrientSchema,
        nitrogen: nutrientSchema,
        phosphorus: nutrientSchema,
        potassium: nutrientSchema,
        sulphur: nutrientSchema,
        zinc: nutrientSchema,
        boron: nutrientSchema,
        iron: nutrientSchema,
        manganese: nutrientSchema,
        copper: nutrientSchema,
      },
      required: [
        'ph', 'ec', 'organicCarbon', 'nitrogen', 'phosphorus', 'potassium',
      ],
    },
    validityPeriod: {
      type: Type.OBJECT,
      properties: {
        startDate: { type: Type.STRING, description: 'Start date of card validity (e.g. DD/MM/YYYY)' },
        endDate: { type: Type.STRING, description: 'End date of card validity (e.g. DD/MM/YYYY)' },
      },
    },
    cropRecommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of crop names recommended on the card (e.g. Paddy, Wheat, Maize, Soybean, Sugarcane, Groundnut)',
    },
    fertilizerRecommendations: {
      type: Type.OBJECT,
      properties: {
        organicManure: { type: Type.STRING, description: 'FYM / Compost recommendation (e.g. 5 t/ha)' },
        biofertilizer: { type: Type.STRING, description: 'Biofertilizer recommendations (e.g. Azotobacter + PSB)' },
        gypsumLime: { type: Type.STRING, description: 'Soil amendment e.g. Gypsum 250 kg/ha' },
        sulphur: { type: Type.STRING, description: 'Sulphur dose (e.g. 20 kg/ha)' },
        zinc: { type: Type.STRING, description: 'Zinc dose (e.g. 25 kg/ha)' },
        boron: { type: Type.STRING, description: 'Boron dose (e.g. 10 kg/ha)' },
        cropSpecific: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING, description: 'Crop name' },
              variety: { type: Type.STRING, description: 'Variety if given' },
              referenceYield: { type: Type.STRING, description: 'Reference yield e.g. 50 q/ha' },
              nitrogen: { type: Type.NUMBER, description: 'Nitrogen N kg/ha dose' },
              phosphorus: { type: Type.NUMBER, description: 'Phosphorus P2O5 kg/ha dose' },
              potassium: { type: Type.NUMBER, description: 'Potassium K2O kg/ha dose' },
              npkKgHa: { type: Type.STRING, description: 'NPK summary string e.g. 120-60-40 kg/ha' },
            },
            required: ['cropName'],
          },
        },
      },
    },
    rawConfidence: {
      type: Type.NUMBER,
      description: 'Overall document extraction confidence score from 0.0 to 1.0',
    },
  },
  required: ['soil', 'rawConfidence'],
};

export async function POST(req: NextRequest) {
  try {
    let apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env['GEMINI_API_KEY ']
    )?.trim();

    // Fallback: Check .env.local file directly on disk if not in process.env
    if (!apiKey) {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, 'utf8');
          for (const line of content.split('\n')) {
            const idx = line.indexOf('=');
            if (idx !== -1) {
              const k = line.substring(0, idx).trim();
              const v = line.substring(idx + 1).trim();
              if (k === 'GEMINI_API_KEY' || k === 'GOOGLE_API_KEY' || k === 'GOOGLE_GENAI_API_KEY') {
                apiKey = v;
                break;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Fallback .env.local read error:', err);
      }
    }

    // Read payload
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const isDemoOverride = formData.get('demo') === 'true';

    if (!file && !isDemoOverride) {
      return NextResponse.json(
        { success: false, error: 'No file was provided in the request.' },
        { status: 400 }
      );
    }

    // If API key is not configured, inform client gracefully so it triggers manual review/fallback
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          fallbackRequired: true,
          error: 'GEMINI_API_KEY is not configured in .env.local. Please enter details manually or use demo data.',
        },
        { status: 200 } // HTTP 200 with fallbackRequired flag so app never crashes
      );
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'File is required' }, { status: 400 });
    }

    // Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a precision agricultural document understanding AI designed for Indian Government Soil Health Cards (SHC).
Examine each table row horizontally: Parameter -> Test Value -> Unit -> Rating.
Extract:
1. All 12 soil parameters (pH, EC, Organic Carbon, Nitrogen, Phosphorus, Potassium, Sulphur, Zinc, Boron, Iron, Manganese, Copper). Preserve exact decimals without rounding.
2. Farmer & Location details (Farmer Name, Village, Sub-District, District, State, PIN, GPS coordinates).
3. Sample & Date Details (Sample Number, Collection Date, Validity Period start and end dates e.g. 15/09/2026 to 14/09/2029, Farm Size, Irrigation status e.g. Irrigated/Rainfed).
4. Crop Recommendations: List all crops recommended in the fertilizer recommendation table (e.g. Paddy, Wheat, Maize, Soybean, Sugarcane, Groundnut).
5. Fertilizer Recommendations: General recommendations (Organic manure / FYM, Biofertilizer, Gypsum/Lime, Sulphur, Zinc, Boron) and Crop-Specific NPK dosages for recommended crops.
Ignore diagonal or background watermarks such as "SAMPLE". Do not swap rows or columns.`;

    const candidateModels = ['gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-3.8-flash'];
    let response: any = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseJsonSchema: soilCardSchema,
          },
        });

        if (response?.text) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, attempting next candidate:`, err?.message || err);
        lastError = err;
      }
    }

    const responseText = response?.text?.trim();
    console.log('Gemini raw response text length:', responseText?.length);
    console.log('Gemini raw response text:', responseText);
    if (!responseText) {
      throw lastError || new Error('Vision model returned an empty extraction result.');
    }

    const rawExtracted: ExtractedSoilCard = JSON.parse(responseText);

    // Run agronomic and physical validation layer
    const validation = validateSoilExtraction(rawExtracted);

    return NextResponse.json({
      success: true,
      data: validation.validatedCard,
      validationIssues: validation.issues,
    });
  } catch (err: any) {
    console.error('Vision extraction server error:', err?.message || err);
    return NextResponse.json(
      {
        success: false,
        fallbackRequired: true,
        error: err?.message || 'Vision model processing failed. Please enter details manually.',
      },
      { status: 200 }
    );
  }
}
