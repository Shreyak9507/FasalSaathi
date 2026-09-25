'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import { getRecommendations, CropSuitability } from '@/lib/recommendation';
import { crops, getCropLocalizedName } from '@/data/crops';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import NutrientAnalysisCard from '@/components/NutrientAnalysisCard';
import MarketPriceCard from '@/components/MarketPriceCard';
import FloatingNav from '@/components/FloatingNav';

export default function RecommendationScreen() {
  const { t, language, formatPercent, formatYield, localizeDigits } = useTranslation();
  const router = useRouter();
  const { soil, weather, farmer, location, isDemo } = useJourney();
  const [recommendations, setRecommendations] = useState<CropSuitability[]>([]);

  useEffect(() => {
    // Soil fallback (demo values if not set)
    const soilData = soil || {
      nitrogen: 245,
      phosphorus: 18,
      potassium: 165,
      ph: 7.2,
      organicCarbon: 0.62,
    };

    // Weather fallback (demo values if not set)
    const weatherData = weather ? {
      temp: weather.temp,
      humidity: weather.humidity,
      rainProbability: weather.rainProbability,
    } : {
      temp: 27,
      humidity: 72,
      rainProbability: 40,
    };

    // Farm fallback - prioritize farmer setting, or deduce from soil card irrigationType
    let irrigationStatus: 'available' | 'limited' | 'rainfed' = 'available';
    if (farmer?.irrigation) {
      irrigationStatus = farmer.irrigation;
    } else if (soil?.irrigationType) {
      const it = soil.irrigationType.toLowerCase();
      if (it.includes('rainfed') || it.includes('rain')) irrigationStatus = 'rainfed';
      else if (it.includes('limited')) irrigationStatus = 'limited';
    }

    const farmData = {
      irrigation: irrigationStatus,
    };

    const recs = getRecommendations(crops, soilData, weatherData, farmData);
    setRecommendations(recs);
  }, [soil, weather, farmer]);

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm font-medium">{t('common', 'loading')}</p>
        </div>
      </div>
    );
  }

  const topCrop = recommendations[0];
  const otherCrops = recommendations.slice(1, 4);

  const getCropData = (cropId: string) => {
    return crops.find(c => c.id === cropId) || crops[0];
  };

  const getLocalizedName = (cropId: string) => {
    const crop = getCropData(cropId);
    return getCropLocalizedName(crop, language);
  };

  const getMatchLabel = (matchLevel: string) => {
    if (matchLevel === 'strong') return t('recommendation', 'strongMatch');
    if (matchLevel === 'good') return t('recommendation', 'goodMatch');
    return t('recommendation', 'moderateMatch');
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (topCrop.overallScore / 100) * circumference;
  const topCropData = getCropData(topCrop.cropId);

  // APMC Sample Market Architecture data (Phase 1 prepared, Phase 2 live)
  const marketDistrict = location?.district || 'Pune';
  const marketState = location?.state || 'Maharashtra';

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col p-4 pb-20">
      <div className="max-w-md mx-auto w-full">
        <FloatingNav backHref="/weather" />

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('recommendation', 'title')}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{t('recommendation', 'subtitle')}</p>
        </div>

        {/* HERO RECOMMENDATION CARD (~40%+ visual focus) */}
        <Card className="mb-6 p-5 flex flex-col items-center text-center relative overflow-hidden bg-white border border-green-300 shadow-md rounded-3xl">
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
              {t('recommendation', 'heroBadge')}
            </span>
            {topCrop.isCardRecommended && (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold rounded-full flex items-center gap-1 shadow-xs">
                <span>📜</span> {t('recommendation', 'soilCardRecommended')}
              </span>
            )}
          </div>

          <div className="text-6xl mb-2 mt-1 drop-shadow-sm">
            {topCropData.emoji}
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-wide mb-0.5">
            {getLocalizedName(topCrop.cropId)}
          </h2>
          
          <p className="text-green-700 text-xs font-bold mb-4">
            {getMatchLabel(topCrop.matchLevel)}
          </p>
          
          {/* Circular Suitability Progress */}
          <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e8f5e9" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" stroke="#2d7a4f" strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900">{formatPercent(topCrop.overallScore)}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                {t('recommendation', 'suitability')}
              </span>
            </div>
          </div>

          {/* Key Agronomic Highlights (Yield & Duration) */}
          <div className="w-full grid grid-cols-2 gap-2 mb-4">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-2.5 text-left">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 mb-0.5">
                <span>🌾</span> {t('recommendation', 'expectedYield')}
              </div>
              <div className="text-sm font-extrabold text-amber-950">
                {formatYield(topCropData.expectedYield || '50 - 65 q/ha')}
              </div>
            </div>
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-2.5 text-left">
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-900 mb-0.5">
                <span>⏱️</span> {t('recommendation', 'duration')}
              </div>
              <div className="text-sm font-extrabold text-blue-950">
                {localizeDigits(topCropData.approxDuration || '90 - 110 days')}
              </div>
            </div>
          </div>

          {/* Dynamic Key Reasons (WHY checklist) */}
          <div className="w-full space-y-2 mb-4">
            <h4 className="text-left text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              {t('recommendation', 'whyThisCrop')}
            </h4>
            {topCrop.keyReasons.map((reasonKey, idx) => (
              <div key={idx} className="flex items-start text-left bg-green-50/80 border border-green-200/80 p-2.5 rounded-xl">
                <span className="text-green-600 font-bold mr-2 text-sm flex-shrink-0">✓</span>
                <p className="text-xs font-medium text-gray-800 leading-snug">
                  {t('cropDetail', reasonKey) || reasonKey}
                </p>
              </div>
            ))}

            {/* Potential Concerns if any */}
            {topCrop.potentialConcerns.length > 0 && (
              <div className="pt-1">
                <h4 className="text-left text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                  {t('recommendation', 'potentialConcerns')}
                </h4>
                {topCrop.potentialConcerns.map((concernKey, idx) => (
                  <div key={idx} className="flex items-start text-left bg-amber-50/70 border border-amber-200/80 p-2 rounded-xl mb-1.5">
                    <span className="text-amber-600 font-bold mr-2 text-xs flex-shrink-0">⚠️</span>
                    <p className="text-[11px] text-amber-900 leading-snug">
                      {t('cropDetail', concernKey) || concernKey}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA: Why this crop? */}
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => router.push(`/crop-detail?crop=${topCrop.cropId}`)}
          >
            {t('recommendation', 'viewFactorBreakdown')} →
          </Button>
        </Card>

        {/* CROP-SPECIFIC NUTRIENT ANALYSIS FOR TOP CROP (PHASE 3A) */}
        <div className="mb-6">
          <NutrientAnalysisCard
            soil={soil}
            cropId={topCrop.cropId}
            cropName={getLocalizedName(topCrop.cropId)}
          />
        </div>

        {/* OTHER SUITABLE OPTIONS */}
        <div className="mt-5">
          <h3 className="font-bold text-gray-700 mb-2.5 uppercase tracking-wider text-xs">
            {t('recommendation', 'otherOptions')}
          </h3>
          <div className="space-y-2.5">
            {otherCrops.map((cropSuitability) => {
              const cData = getCropData(cropSuitability.cropId);
              return (
                <div
                  key={cropSuitability.cropId} 
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(`/crop-detail?crop=${cropSuitability.cropId}`);
                    }
                  }}
                  className="flex items-center p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs active:scale-[0.99] transition-all cursor-pointer hover:border-green-400"
                  onClick={() => router.push(`/crop-detail?crop=${cropSuitability.cropId}`)}
                >
                  <div className="text-3xl mr-3 flex-shrink-0">{cData.emoji}</div>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-900">{getLocalizedName(cropSuitability.cropId)}</h4>
                      {cropSuitability.isCardRecommended && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 flex-shrink-0">
                          📜 {t('recommendation', 'cardRecBadge')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500 font-medium">
                      <span>{getMatchLabel(cropSuitability.matchLevel)}</span>
                      <span>•</span>
                      <span>{formatYield(cData.expectedYield)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-base font-extrabold text-green-700">{formatPercent(cropSuitability.overallScore)}</span>
                    <span className="text-[9px] text-gray-400 uppercase font-semibold">
                      {t('recommendation', 'suitability')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* APMC MARKET INTELLIGENCE (Phase 4) */}
        <div className="mt-6">
          <MarketPriceCard
            cropId={topCrop.cropId}
            state={marketState}
            district={marketDistrict}
            farmLat={location?.lat ?? location?.latitude}
            farmLng={location?.lng ?? location?.longitude}
            farmSizeAcres={farmer?.landArea || farmer?.farmSize || soil?.farmArea || null}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-800 text-xs font-semibold py-2 px-4 rounded-xl border border-gray-200 bg-white"
          >
            ← {t('recommendation', 'startNew')}
          </button>
        </div>
      </div>
    </div>
  );
}

