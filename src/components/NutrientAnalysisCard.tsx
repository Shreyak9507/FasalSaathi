'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import { SoilInfo, FarmerInfo, FertilizerProduct } from '@/types';
import { analyzeCropSoilNutrients, AnalyzedNutrient } from '@/lib/nutrientAnalysis';
import { getCropReplenishmentPlan } from '@/lib/fertilizerRecommendation';

interface NutrientAnalysisCardProps {
  soil: SoilInfo | null | undefined;
  cropId: string;
  cropName?: string;
  farmer?: FarmerInfo | null;
  className?: string;
}

export default function NutrientAnalysisCard({
  soil,
  cropId,
  cropName,
  farmer: farmerProp,
  className = '',
}: NutrientAnalysisCardProps) {
  const {
    t,
    language,
    formatCurrency,
    formatDecimal,
    formatPercent,
    localizeDigits,
  } = useTranslation();
  const { farmer: journeyFarmer } = useJourney();
  const activeFarmer = farmerProp || journeyFarmer;

  // Selected product for source modal (if clicked)
  const [selectedProductForSource, setSelectedProductForSource] = useState<FertilizerProduct | null>(null);

  const analysis = React.useMemo(() => {
    return analyzeCropSoilNutrients(soil, cropId, language);
  }, [soil, cropId, language]);

  const replenishmentPlan = React.useMemo(() => {
    return getCropReplenishmentPlan(soil, cropId, activeFarmer, language);
  }, [soil, cropId, activeFarmer, language]);

  // Fallback if crop is not recognized in knowledge base
  if (!analysis.hasCropGuidance) {
    return (
      <div className={`bg-white border border-gray-200/90 rounded-3xl p-5 shadow-xs ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🌱</span>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            {t('nutrientAnalysis', 'yourSoilHeader') || 'YOUR SOIL'}
          </h3>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          {analysis.unavailableMessage || t('nutrientAnalysis', 'noGuidance')}
        </p>
      </div>
    );
  }

  const displayName = cropName || analysis.cropName;
  const hasAttentionNutrients = replenishmentPlan.recommendations.length > 0;
  const farmArea = activeFarmer?.landArea || soil?.farmArea;
  const farmUnit = activeFarmer?.unit || 'acre';

  const getLocalizedName = (product: FertilizerProduct) => {
    const langKey = language as 'en' | 'mr' | 'hi';
    return product.nameLocal[langKey] || product.name;
  };

  const getLocalizedCategory = (product: FertilizerProduct) => {
    const langKey = language as 'en' | 'mr' | 'hi';
    return product.categoryLocal[langKey] || product.category;
  };

  const getLocalizedBenefit = (product: FertilizerProduct) => {
    const langKey = language as 'en' | 'mr' | 'hi';
    return product.benefitDescription[langKey] || product.benefitDescription.en;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ======================================================== */}
      {/* 1. YOUR SOIL SUMMARY CONTAINER                           */}
      {/* ======================================================== */}
      <div className="bg-white border border-gray-200/90 rounded-3xl p-5 shadow-xs">
        {/* Header */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌱</span>
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                {t('nutrientAnalysis', 'yourSoilHeader') || 'YOUR SOIL'}
              </h2>
              <span className="text-[11px] font-semibold text-green-700">
                {t('nutrientAnalysis', 'cropAnalysisFor')} {displayName}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
            {t('nutrientAnalysis', 'sectionSubtitle')}
          </p>

          {/* Farm Size Context Banner (if available) */}
          {farmArea && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-900">
              <span>🌾</span>
              <span>
                {t('nutrientAnalysis', 'forYourFarm') || 'For your'} {localizeDigits(farmArea)} {farmUnit} {t('nutrientAnalysis', 'farmAreaLabel') || 'farm area'}
              </span>
            </div>
          )}
        </div>

        {/* Status of Tested Nutrients (Only showing parameters present in report) */}
        <div className="space-y-2 mb-4">
          {/* Priority Deficient Nutrients */}
          {analysis.attentionNutrients.map((nutrient: AnalyzedNutrient) => (
            <div
              key={nutrient.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{nutrient.badgeEmoji}</span>
                <div>
                  <span className="text-xs font-bold text-gray-900 block leading-tight">
                    {nutrient.name}
                  </span>
                  {nutrient.soilValue !== null && (
                    <span className="text-[10px] text-gray-500 font-medium">
                      {formatDecimal(nutrient.soilValue)} {nutrient.unit}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/80">
                {t('nutrientAnalysis', 'needsAttentionBadge')}
              </span>
            </div>
          ))}

          {/* Adequate / Good Nutrients */}
          {analysis.goodNutrients.map((nutrient: AnalyzedNutrient) => (
            <div
              key={nutrient.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-green-50/50 border border-green-200/70 shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{nutrient.badgeEmoji}</span>
                <div>
                  <span className="text-xs font-bold text-gray-900 block leading-tight">
                    {nutrient.name}
                  </span>
                  {nutrient.soilValue !== null && (
                    <span className="text-[10px] text-gray-500 font-medium">
                      {formatDecimal(nutrient.soilValue)} {nutrient.unit}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-300/80">
                {t('nutrientAnalysis', 'goodBadge')}
              </span>
            </div>
          ))}
        </div>

        {/* Soil pH & Organic Carbon Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-gray-100">
          <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5">
              {t('nutrientAnalysis', 'soilPhTitle')}
            </span>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-black text-gray-900">
                {analysis.phAnalysis.value !== null ? formatDecimal(analysis.phAnalysis.value, 1) : '—'}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                (Ideal: {localizeDigits(analysis.phAnalysis.idealRange)})
              </span>
            </div>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                analysis.phAnalysis.status === 'suitable'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {analysis.phAnalysis.statusLabel}
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-2xl">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-0.5">
              {t('nutrientAnalysis', 'organicCarbonTitle')}
            </span>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-black text-gray-900">
                {analysis.organicCarbonAnalysis.value !== null
                  ? formatPercent(analysis.organicCarbonAnalysis.value)
                  : '—'}
              </span>
            </div>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                analysis.organicCarbonAnalysis.status === 'good' ||
                analysis.organicCarbonAnalysis.status === 'high'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {analysis.organicCarbonAnalysis.statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. WHY IT MATTERS + WHAT CAN REPLENISH IT + PRODUCTS     */}
      {/* ======================================================== */}
      {hasAttentionNutrients ? (
        <div className="space-y-4">
          {replenishmentPlan.recommendations.map((rec) => (
            <div
              key={rec.nutrientId}
              className="bg-white border-2 border-amber-300/90 rounded-3xl p-5 shadow-xs space-y-4"
            >
              {/* Nutrient Title & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔴</span>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase">
                      {rec.nutrientName}
                    </h3>
                    <span className="text-[11px] font-bold text-amber-700">
                      {t('nutrientAnalysis', 'needsAttentionBadge')}
                    </span>
                  </div>
                </div>
              </div>

              {/* WHY DOES THE CROP NEED IT? */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
                  💡 {t('nutrientAnalysis', 'whyCropNeedsThem') || 'WHY DOES YOUR CROP NEED THEM?'}
                </span>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {rec.whyCropNeedsIt}
                </p>
              </div>

              {/* WHAT CAN REPLENISH IT? */}
              <div className="p-3.5 bg-green-50/60 rounded-2xl border border-green-200/70 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-green-900 block mb-1">
                  🧪 {t('nutrientAnalysis', 'whatCanHelpTitle') || 'WHAT CAN HELP?'}
                </span>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {rec.whatCanReplenishIt}
                </p>
              </div>

              {/* FERTILIZER PRODUCT CARDS */}
              {rec.matchedProducts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-700 block">
                    📦 {t('nutrientAnalysis', 'fertilizerOptionsTitle') || 'FERTILIZER OPTIONS'}
                  </span>

                  <div className="grid grid-cols-1 gap-3">
                    {rec.matchedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs hover:border-green-400 transition-all flex flex-col justify-between text-left"
                      >
                        {/* Top: Product Visual & Name */}
                        <div className="flex items-start gap-3 mb-3">
                          {/* Neutral Category Illustration */}
                          <div className="w-16 h-20 shrink-0 bg-gray-50 border border-gray-100 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.productImage.imageUrl}
                              alt={prod.productImage.altText[language as 'en' | 'mr' | 'hi'] || prod.name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-green-800 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md mb-1">
                              {getLocalizedCategory(prod)}
                            </span>
                            <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                              {getLocalizedName(prod)}
                            </h4>

                            {/* Nutrients Supplied */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {prod.nutrientsSupplied.map((nut, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded"
                                >
                                  {nut.symbol}: {localizeDigits(nut.percentage || nut.nutrient)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Benefits Description */}
                        <p className="text-xs text-gray-600 mb-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-snug">
                          <span className="font-bold text-gray-900 mr-1">
                            {t('nutrientAnalysis', 'helpsWithLabel') || 'Helps'}:
                          </span>
                          {getLocalizedBenefit(prod)}
                        </p>

                        {/* Specs & Pricing Grid */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-green-50/40 border border-green-100 rounded-xl mb-3 text-left">
                          <div>
                            <span className="text-[10px] text-gray-500 block">
                              {t('nutrientAnalysis', 'packSizeLabel') || 'Pack size'}
                            </span>
                            <span className="text-xs font-bold text-gray-900">
                              {localizeDigits(prod.commonPackSizes[0] || 'Standard Pack')}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-gray-500 block">
                              {t('nutrientAnalysis', 'referencePriceLabel') || 'Reference price'}
                            </span>
                            <span className="text-sm font-black text-green-800">
                              {formatCurrency(prod.referencePrice.amount)}
                            </span>
                            <span className="text-[9px] text-gray-400 block -mt-0.5">
                              {prod.referencePrice.unit}
                            </span>
                          </div>
                        </div>

                        {/* Current Market Price Status (No Fake Prices!) */}
                        <div className="flex items-center justify-between text-[11px] mb-2 px-1">
                          <span className="text-gray-500">
                            {t('nutrientAnalysis', 'currentPriceLabel') || 'Current listed price'}:
                          </span>
                          <span className="text-gray-400 italic font-medium">
                            {prod.currentPrice.isAvailable && prod.currentPrice.amount
                              ? formatCurrency(prod.currentPrice.amount)
                              : t('nutrientAnalysis', 'currentPriceUnavailable') || 'Current price unavailable'}
                          </span>
                        </div>

                        {/* Source Link & Citation */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 truncate max-w-[180px]">
                            🏛️ {prod.referencePrice.source}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedProductForSource(prod)}
                            className="text-[11px] font-bold text-green-700 hover:text-green-800 underline underline-offset-2 shrink-0 ml-2"
                          >
                            {t('nutrientAnalysis', 'viewSourceLabel') || 'View source'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Dosage Guidance Notice */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-left">
            <span className="text-base shrink-0">📋</span>
            <p className="text-[11px] text-blue-900 leading-relaxed font-medium">
              {t('nutrientAnalysis', 'dosageNotice') ||
                'Exact application timing and quantities should be confirmed with your local Krishi Vigyan Kendra (KVK) or agriculture officer based on your sowing stage.'}
            </p>
          </div>
        </div>
      ) : (
        /* If all nutrients are good, show maintenance guidance */
        <div className="bg-white border border-green-300 rounded-3xl p-5 shadow-xs text-left space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟢</span>
            <div>
              <h3 className="text-sm font-black text-green-950">
                {replenishmentPlan.generalMaintenance?.title || t('nutrientAnalysis', 'noAttentionNeeded')}
              </h3>
              <p className="text-xs text-green-800 mt-1 leading-relaxed">
                {replenishmentPlan.generalMaintenance?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VERIFIED SOURCE MODAL                                 */}
      {/* ======================================================== */}
      {selectedProductForSource && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProductForSource(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-3 text-left animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {t('nutrientAnalysis', 'viewSourceLabel') || 'View source'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedProductForSource(null)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            <h4 className="text-base font-black text-gray-900">
              {getLocalizedName(selectedProductForSource)}
            </h4>

            <div className="space-y-2 text-xs text-gray-700 bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <div>
                <span className="font-bold text-gray-900 block">
                  {t('nutrientAnalysis', 'referencePriceLabel') || 'Reference price'}:
                </span>
                <span>
                  ₹{selectedProductForSource.referencePrice.amount?.toFixed(2)} ({selectedProductForSource.referencePrice.unit})
                </span>
              </div>

              <div>
                <span className="font-bold text-gray-900 block">
                  {t('nutrientAnalysis', 'sourceLabel') || 'Source'}:
                </span>
                <span>{selectedProductForSource.referencePrice.source}</span>
              </div>

              <div>
                <span className="font-bold text-gray-900 block">Validity / Period:</span>
                <span>{selectedProductForSource.referencePrice.date}</span>
              </div>

              {selectedProductForSource.regulatoryNotes && (
                <div>
                  <span className="font-bold text-gray-900 block">Regulatory Note:</span>
                  <span>{selectedProductForSource.regulatoryNotes}</span>
                </div>
              )}
            </div>

            {selectedProductForSource.referencePrice.sourceUrl && (
              <a
                href={selectedProductForSource.referencePrice.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                Open Official Government Portal ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
