import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { DISEASE_TAXONOMY, DEFAULT_DISCLAIMER } from '@/data/diseaseTaxonomy';
import { ViTDiseaseClass, DiseaseDetectionResult } from '@/types/disease';

export const runtime = 'nodejs';

// Exact 13 classes supported by wambugu71/crop_leaf_diseases_vit
const VALID_CLASSES: ViTDiseaseClass[] = [
  'Corn___Common_Rust',
  'Corn___Gray_Leaf_Spot',
  'Corn___Healthy',
  'Potato___Early_Blight',
  'Potato___Healthy',
  'Potato___Late_Blight',
  'Rice___Brown_Spot',
  'Rice___Healthy',
  'Rice___Leaf_Blast',
  'Wheat___Brown_Rust',
  'Wheat___Healthy',
  'Wheat___Yellow_Rust',
  'Invalid',
];

interface HFPrediction {
  label: string;
  score: number;
}

/**
 * Attempt inference using the Hugging Face Serverless Inference API for wambugu71/crop_leaf_diseases_vit.
 * Uses a strict 4.5s timeout. If unavailable, loading, or timed out, returns null to trigger fallback.
 */
async function tryHuggingFaceInference(
  imageBuffer: Buffer,
  mimeType: string
): Promise<{ label: ViTDiseaseClass; confidence: number } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const hfEndpoint = 'https://api-inference.huggingface.co/models/wambugu71/crop_leaf_diseases_vit';
    
    // Optional HF token if present in environment, otherwise anonymous call
    const headers: Record<string, string> = {
      'Content-Type': mimeType || 'image/jpeg',
    };
    if (process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN}`;
    }

    const response = await fetch(hfEndpoint, {
      method: 'POST',
      headers,
      body: new Uint8Array(imageBuffer),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[DiseaseAPI] Hugging Face inference returned status ${response.status}. Triggering fallback.`);
      return null;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[DiseaseAPI] Hugging Face returned non-array prediction. Triggering fallback.');
      return null;
    }

    const topPred: HFPrediction = data[0];
    const matchedClass = VALID_CLASSES.find((c) => c.toLowerCase() === (topPred.label || '').toLowerCase());

    if (!matchedClass) {
      console.warn(`[DiseaseAPI] Hugging Face returned unknown class: ${topPred.label}. Triggering fallback.`);
      return null;
    }

    return {
      label: matchedClass,
      confidence: Math.round((topPred.score || 0) * 100),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    console.warn('[DiseaseAPI] Hugging Face inference skipped or timed out:', err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Robust Gemini Vision fallback strictly constrained to the 13 classes of wambugu71/crop_leaf_diseases_vit.
 */
async function runGeminiVisionFallback(
  base64Data: string,
  mimeType: string
): Promise<{ label: ViTDiseaseClass; confidence: number; visualSymptoms?: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[DiseaseAPI] GEMINI_API_KEY is not configured in environment.');
    return null;
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert agricultural plant pathologist analyzing a leaf photo for crop disease diagnosis.
You MUST classify this photo STRICTLY into one of the following 13 predefined classes from the crop_leaf_diseases_vit taxonomy:
- Corn___Common_Rust
- Corn___Gray_Leaf_Spot
- Corn___Healthy
- Potato___Early_Blight
- Potato___Healthy
- Potato___Late_Blight
- Rice___Brown_Spot
- Rice___Healthy
- Rice___Leaf_Blast
- Wheat___Brown_Rust
- Wheat___Healthy
- Wheat___Yellow_Rust
- Invalid

RULES:
1. If the photo does not clearly show a leaf of Corn (Maize), Potato, Rice (Paddy), or Wheat, you MUST choose "Invalid".
2. If the photo is too blurry, too dark, heavily corrupted, or impossible to identify, choose "Invalid".
3. Do NOT force a disease diagnosis. If the leaf is healthy, choose the corresponding "___Healthy" class.
4. Do NOT invent or output any class name outside these exact 13 names.
5. Provide a realistic confidence percentage between 0 and 100 based on visible visual symptoms.`;

  const candidateModels = ['gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-3.8-flash'];
  let responseText = '';

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType || 'image/jpeg',
                },
              },
              { text: prompt },
            ],
          },
        ],
        config: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rawLabel: {
                type: Type.STRING,
                description: 'One of the exact 13 classes listed in the prompt.',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence percentage between 0 and 100.',
              },
              visualSymptoms: {
                type: Type.STRING,
                description: 'Brief description of symptoms observed on the leaf.',
              },
              isInvalid: {
                type: Type.BOOLEAN,
                description: 'True if non-leaf, non-target crop, or unidentifiable.',
              },
            },
            required: ['rawLabel', 'confidence', 'isInvalid'],
          },
        },
      });

      if (response && response.text) {
        responseText = response.text.trim();
        break;
      }
    } catch (modelErr) {
      console.warn(`[DiseaseAPI] Model ${modelName} failed, trying next candidate:`, modelErr instanceof Error ? modelErr.message : String(modelErr));
    }
  }

  if (!responseText) return null;

  try {
    const parsed = JSON.parse(responseText);
    let label = (parsed.rawLabel || '').trim() as ViTDiseaseClass;
    if (!VALID_CLASSES.includes(label) || parsed.isInvalid) {
      label = 'Invalid';
    }

    const confidence = Math.min(100, Math.max(0, Math.round(Number(parsed.confidence) || 75)));

    return {
      label,
      confidence,
      visualSymptoms: parsed.visualSymptoms,
    };
  } catch (e) {
    console.error('[DiseaseAPI] Failed to parse Gemini response:', e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    let imageBuffer: Buffer | null = null;
    let mimeType = 'image/jpeg';
    let base64Data = '';
    const lang = req.nextUrl.searchParams.get('lang') || 'en';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('image') || formData.get('file');

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json(
          { error: 'No image file uploaded' },
          { status: 400 }
        );
      }

      mimeType = file.type || 'image/jpeg';
      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
      base64Data = imageBuffer.toString('base64');
    } else {
      // JSON body with base64
      const body = await req.json().catch(() => ({}));
      if (body.image) {
        base64Data = String(body.image).replace(/^data:image\/[a-zA-Z]+;base64,/, '');
        imageBuffer = Buffer.from(base64Data, 'base64');
        if (body.mimeType) mimeType = body.mimeType;
      }
    }

    if (!imageBuffer || imageBuffer.length === 0 || !base64Data) {
      return NextResponse.json(
        { error: 'Invalid or missing image data' },
        { status: 400 }
      );
    }

    // 1. Try Pretrained Hugging Face Model first (wambugu71/crop_leaf_diseases_vit)
    let engine: 'huggingface' | 'gemini' = 'huggingface';
    let prediction = await tryHuggingFaceInference(imageBuffer, mimeType);

    // 2. If Hugging Face is unavailable, timed out, loading, or errored: Fall back to Gemini Flash
    if (!prediction) {
      engine = 'gemini';
      console.log('[DiseaseAPI] Using Gemini Vision fallback for crop disease analysis.');
      prediction = await runGeminiVisionFallback(base64Data, mimeType);
    }

    if (!prediction) {
      return NextResponse.json(
        { error: 'Unable to analyze image. Please try again.' },
        { status: 500 }
      );
    }

    const { label, confidence } = prediction;
    const meta = DISEASE_TAXONOMY[label] || DISEASE_TAXONOMY.Invalid;

    const langKey = (['hi', 'mr'].includes(lang) ? lang : 'en') as 'en' | 'hi' | 'mr';
    const isHealthy = meta.isHealthy;
    const isInvalid = meta.isInvalid || label === 'Invalid';
    const lowConfidence = !isInvalid && confidence < 60;

    let whatWeFound = meta.whatWeFound[langKey] || meta.whatWeFound.en;
    if (lowConfidence) {
      const lowConfMsg: Record<string, string> = {
        en: "We're not fully sure about this result. Try taking another clear photo of the affected leaf in good lighting.",
        hi: 'हम इस परिणाम के बारे में पूरी तरह सुनिश्चित नहीं हैं। अच्छी रोशनी में प्रभावित पत्ती की एक और स्पष्ट फोटो लेने का प्रयास करें।',
        mr: 'आम्हाला या निष्कर्षाबद्दल पूर्ण खात्री नाही. कृपया चांगल्या प्रकाशात बाधित पानाचा आणखी एक स्पष्ट फोटो काढून पहा.',
      };
      whatWeFound = `${lowConfMsg[langKey] || lowConfMsg.en} (${whatWeFound})`;
    }

    const result: DiseaseDetectionResult = {
      crop: meta.crop,
      cropEmoji: meta.cropEmoji,
      condition: meta.names[langKey]?.condition || meta.condition,
      rawLabel: label,
      confidence,
      isHealthy,
      isInvalid,
      lowConfidence,
      engine,
      whatWeFound,
      whatYouCanDo: isHealthy || isInvalid ? [] : (meta.whatYouCanDo[langKey] || meta.whatYouCanDo.en),
      disclaimer: DEFAULT_DISCLAIMER,
    };

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    console.error('[DiseaseAPI] Unhandled error during disease detection:', error);
    return NextResponse.json(
      { error: 'Something went wrong while checking the image. Please try again.' },
      { status: 500 }
    );
  }
}
