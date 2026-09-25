import {
  SoilInfo,
  FarmerInfo,
  FertilizerProduct,
  FertilizerRecommendation,
  CropReplenishmentPlan,
} from '@/types';
import { FERTILIZERS } from '@/data/fertilizers';
import { analyzeCropSoilNutrients, AnalyzedNutrient } from '@/lib/nutrientAnalysis';

/**
 * Builds a crop-specific, soil-grounded replenishment plan.
 * Connects:
 * - Soil Health Card status
 * - Selected crop agronomic requirements
 * - Farm size context (without inventing arbitrary dosages)
 * - Documented official Indian fertilizer grades
 */
export function getCropReplenishmentPlan(
  soil: SoilInfo | null | undefined,
  cropId: string,
  farmer?: FarmerInfo | null,
  lang: string = 'en'
): CropReplenishmentPlan {
  const currentLang = (lang === 'mr' || lang === 'hi') ? lang : 'en';
  const analysis = analyzeCropSoilNutrients(soil, cropId, currentLang);

  const farmArea = farmer?.landArea || soil?.farmArea;
  const farmUnit = farmer?.unit || 'acre';

  const recommendations: FertilizerRecommendation[] = [];

  // 1. Process nutrients requiring attention (status === 'low')
  const deficientNutrients = analysis.attentionNutrients.filter(
    (n) => n.status === 'low'
  );

  const matchedProductIds = new Set<string>();

  for (const nutrient of deficientNutrients) {
    const matched = FERTILIZERS.filter((prod) =>
      prod.targetedDeficiencies.includes(nutrient.id as any)
    );

    matched.forEach((p) => matchedProductIds.add(p.id));

    let replenishmentGuidance = '';
    if (currentLang === 'mr') {
      switch (nutrient.id as string) {
        case 'nitrogen':
          replenishmentGuidance = 'युरिया (४६% नत्र) किंवा नत्रयुक्त संयुक्त खतांचा वापर करा.';
          break;
        case 'phosphorus':
          replenishmentGuidance = 'डीएपी किंवा सिंगल सुपर फॉस्फेट (एसएसपी) सारख्या स्फुरदयुक्त खतांचा वापर करा.';
          break;
        case 'potassium':
          replenishmentGuidance = 'एमओपी (म्युरिएट ऑफ पोटॅश) किंवा पालाशयुक्त एनपीके खते द्या.';
          break;
        case 'sulphur':
          replenishmentGuidance = 'बेंटोनाइट सल्फर (९०% गंधक) किंवा एसएसपी द्वारे गंधकाची पूर्तता करा.';
          break;
        case 'zinc':
          replenishmentGuidance = 'झिंक सल्फेट (२१% किंवा ३३%) द्वारे जस्ताची कमतरता भरून काढा.';
          break;
        case 'boron':
          replenishmentGuidance = 'बोराक्स (१०.५% बोरॉन) द्वारे फुलोरा व फळधारणेच्या वेळी बोरॉन द्या.';
          break;
        case 'organicCarbon':
          replenishmentGuidance = 'चांगले कुजलेले शेणखत किंवा कंपोस्ट खताचा वापर करा.';
          break;
        default:
          replenishmentGuidance = `${nutrient.name} पुरवणारी शिफारशीत खते वापरा.`;
      }
    } else if (currentLang === 'hi') {
      switch (nutrient.id as string) {
        case 'nitrogen':
          replenishmentGuidance = 'यूरिया (46% नाइट्रोजन) या नाइट्रोजन युक्त खादों का प्रयोग करें।';
          break;
        case 'phosphorus':
          replenishmentGuidance = 'डीएपी या सिंगल सुपर फास्फेट (एसएसपी) जैसे फास्फोरस युक्त उर्वरकों का उपयोग करें।';
          break;
        case 'potassium':
          replenishmentGuidance = 'एमओपी (म्यूरिएट ऑफ पोटाश) या पोटाश युक्त एनपीके खादों का उपयोग करें।';
          break;
        case 'sulphur':
          replenishmentGuidance = 'बेंटोनाइट सल्फर (90% गंधक) या एसएसपी द्वारा सल्फर की पूर्ति करें।';
          break;
        case 'zinc':
          replenishmentGuidance = 'जिंक सल्फेट (21% या 33%) द्वारा जस्ते की कमी दूर करें।';
          break;
        case 'boron':
          replenishmentGuidance = 'बोरेक्स (10.5% बोरॉन) द्वारा फूल व दाने बनते समय बोरॉन की पूर्ति करें।';
          break;
        case 'organicCarbon':
          replenishmentGuidance = 'अच्छी सड़ी गोबर की खाद या जैविक कंपोस्ट का प्रयोग करें।';
          break;
        default:
          replenishmentGuidance = `${nutrient.name} की पूर्ति करने वाले अनुशंसित उर्वरकों का उपयोग करें।`;
      }
    } else {
      switch (nutrient.id as string) {
        case 'nitrogen':
          replenishmentGuidance = 'Apply Nitrogen-supplying fertilizers such as Neem Coated Urea or NPK complexes.';
          break;
        case 'phosphorus':
          replenishmentGuidance = 'Apply Phosphorus-rich fertilizers such as DAP or Single Super Phosphate (SSP).';
          break;
        case 'potassium':
          replenishmentGuidance = 'Apply Potash fertilizers like MOP (Muriate of Potash) or balanced NPK grades.';
          break;
        case 'sulphur':
          replenishmentGuidance = 'Replenish with Bentonite Sulphur (90% S) or Single Super Phosphate (SSP).';
          break;
        case 'zinc':
          replenishmentGuidance = 'Apply Zinc Sulphate (21% or 33% Zn) to correct soil zinc deficiency.';
          break;
        case 'boron':
          replenishmentGuidance = 'Apply Borax (10.5% B) to support flowering, pollen fertility, and seed set.';
          break;
        case 'organicCarbon':
          replenishmentGuidance = 'Apply well-rotted farmyard manure (FYM) or organic compost to build soil humus.';
          break;
        default:
          replenishmentGuidance = `Apply fertilizers supplying ${nutrient.name} as recommended by agricultural officers.`;
      }
    }

    recommendations.push({
      nutrientId: nutrient.id,
      nutrientName: nutrient.name,
      nutrientSymbol: nutrient.chemicalSymbol,
      status: nutrient.status,
      statusLabel: nutrient.statusLabel,
      whyCropNeedsIt: nutrient.whyItMatters,
      whatCanReplenishIt: replenishmentGuidance,
      matchedProducts: matched,
    });
  }

  // 2. If multiple major nutrients (N, P, K) are low, suggest multi-nutrient complexes (NPK 10:26:26 / 12:32:16)
  const isMultipleMajorDeficient =
    deficientNutrients.filter((n) =>
      ['nitrogen', 'phosphorus', 'potassium'].includes(n.id)
    ).length >= 2;

  if (isMultipleMajorDeficient) {
    const complexProducts = FERTILIZERS.filter(
      (p) => p.id === 'npk-10-26-26' || p.id === 'npk-12-32-16'
    );
    complexProducts.forEach((p) => matchedProductIds.add(p.id));
  }

  // 3. General Soil Maintenance Note if all nutrients are good
  let generalMaintenance: { title: string; description: string } | undefined;
  if (deficientNutrients.length === 0) {
    if (currentLang === 'mr') {
      generalMaintenance = {
        title: 'मातीचे उत्तम पोषण राखण्यासाठी सल्ला',
        description:
          'तुमच्या मातीमध्ये या पिकासाठी आवश्यक असणाऱ्या मुख्य अन्नद्रव्यांची पातळी समाधानकारक आहे. जमिनीची सुपीकता टिकवून ठेवण्यासाठी सेंद्रिय खते (शेणखत / कंपोस्ट) आणि सूक्ष्मजीव जिवाणू खतांचा नियमित वापर चालू ठेवावा.',
      };
    } else if (currentLang === 'hi') {
      generalMaintenance = {
        title: 'मिट्टी की उर्वरता बनाए रखने की सलाह',
        description:
          'आपकी मिट्टी में इस फसल के लिए आवश्यक प्रमुख पोषक तत्वों का स्तर अच्छा है। भविष्य में उर्वरता बनाए रखने के लिए सड़ी गोबर की खाद (FYM) और जैव उर्वरकों का नियमित प्रयोग जारी रखें।',
      };
    } else {
      generalMaintenance = {
        title: 'Soil Maintenance Guidance',
        description:
          'Your soil currently contains adequate levels of primary nutrients for this crop. Continue standard basal maintenance with well-decomposed organic manure (FYM) and biofertilizers to preserve biological soil health.',
      };
    }
  }

  return {
    cropId: analysis.cropId,
    cropName: analysis.cropName,
    farmArea: farmArea ?? undefined,
    farmUnit: farmUnit,
    recommendations,
    generalMaintenance,
  };
}
