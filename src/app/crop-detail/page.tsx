'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import { calculateSuitability } from '@/lib/recommendation';
import { crops, getCropLocalizedName } from '@/data/crops';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import NutrientAnalysisCard from '@/components/NutrientAnalysisCard';
import MarketPriceCard from '@/components/MarketPriceCard';
import FloatingNav from '@/components/FloatingNav';

function CropDetailContent() {
  const { t, language, formatPercent } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { soil, weather, farmer, location } = useJourney();
  
  const cropId = searchParams.get('crop') || 'soybean';
  const crop = useMemo(() => crops.find(c => c.id === cropId) || crops[0], [cropId]);

  const suitability = useMemo(() => {
    const s = soil || {
      nitrogen: 245,
      phosphorus: 18,
      potassium: 165,
      ph: 7.2,
      organicCarbon: 0.62,
    };
    const w = weather ? {
      temp: weather.temp,
      humidity: weather.humidity,
      rainProbability: weather.rainProbability,
    } : {
      temp: 27,
      humidity: 72,
      rainProbability: 40,
    };
    let irrigationStatus: 'available' | 'limited' | 'rainfed' = 'available';
    if (farmer?.irrigation) {
      irrigationStatus = farmer.irrigation;
    } else if (soil?.irrigationType) {
      const it = soil.irrigationType.toLowerCase();
      if (it.includes('rainfed') || it.includes('rain')) irrigationStatus = 'rainfed';
      else if (it.includes('limited')) irrigationStatus = 'limited';
    }

    const f = {
      irrigation: irrigationStatus,
    };
    
    return calculateSuitability(crop, s, w, f);
  }, [crop, soil, weather, farmer]);

  const getLocalizedName = () => {
    return getCropLocalizedName(crop, language);
  };

  const getFactorExplanation = (reasonKey: string) => {
    return t('cropDetail', reasonKey) || reasonKey;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-2 pb-28 max-w-md mx-auto w-full">
      <FloatingNav backHref="/recommendation" />

      <div className="text-center mb-4 bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs">
        <div className="text-6xl mb-2">{crop.emoji}</div>
        <h1 className="text-2xl font-black text-gray-900 mb-0.5">
          {getLocalizedName()}
        </h1>
        <p className="text-gray-500 text-xs font-medium">
          {t('cropDetail', 'title')} {getLocalizedName()}
        </p>
      </div>

      {/* Official Card Recommendation Banner */}
      {suitability.isCardRecommended && (
        <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl flex-shrink-0">
            📜
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-950 block">
              {t('cropDetail', 'cardRecommendedBadge')}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium">
              {t('cropDetail', 'cardRecommended')}
            </span>
          </div>
        </div>
      )}

      {/* Overall score card */}
      <Card className="p-4 mb-5 bg-green-50/70 border border-green-200/90 flex items-center justify-between rounded-2xl shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-green-900 block">
            {t('cropDetail', 'overallScore')}
          </span>
          <span className="text-[11px] text-gray-600">
            {t('cropDetail', 'basedOn')}
          </span>
        </div>
        <div className="text-2xl font-black text-green-700 bg-white px-4 py-1.5 rounded-xl shadow-xs border border-green-200">
          {formatPercent(suitability.overallScore)}
        </div>
      </Card>
 
      {/* Crop-Specific Soil Nutrient Analysis (Phase 3A) */}
      <div className="mb-6">
        <NutrientAnalysisCard
          soil={soil}
          cropId={crop.id}
          cropName={getLocalizedName()}
        />
      </div>

      {/* Official Soil Health Card Prescription */}
      {(suitability.cardDosage || soil?.fertilizerRecommendations) && (
        <div className="mb-6 bg-white rounded-3xl border border-blue-200/90 p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-gray-100">
            <span className="text-lg">🧪</span>
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {t('cropDetail', 'cardDosageTitle')}
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">
                Official recommendations from your Soil Health Card
              </p>
            </div>
          </div>

          {suitability.cardDosage && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-3.5 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-0.5">
                {getLocalizedName()} Prescribed NPK Dosage
              </span>
              <span className="text-base font-black text-blue-950">
                {suitability.cardDosage}
              </span>
            </div>
          )}

          {soil?.fertilizerRecommendations && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-gray-700 block">
                {t('cropDetail', 'generalAmendmentsTitle')}
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {soil.fertilizerRecommendations.organicManure && (
                  <div className="flex items-center text-xs text-amber-950 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
                    <span className="mr-2.5 text-base flex-shrink-0">🍂</span>
                    <span className="font-semibold">{soil.fertilizerRecommendations.organicManure}</span>
                  </div>
                )}
                {soil.fertilizerRecommendations.biofertilizer && (
                  <div className="flex items-center text-xs text-green-950 bg-green-50/70 p-2.5 rounded-xl border border-green-200/80">
                    <span className="mr-2.5 text-base flex-shrink-0">🦠</span>
                    <span className="font-semibold">{soil.fertilizerRecommendations.biofertilizer}</span>
                  </div>
                )}
                {soil.fertilizerRecommendations.gypsumLime && (
                  <div className="flex items-center text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="mr-2.5 text-base flex-shrink-0">⚪</span>
                    <span className="font-semibold">{soil.fertilizerRecommendations.gypsumLime}</span>
                  </div>
                )}
                {soil.fertilizerRecommendations.zinc && (
                  <div className="flex items-center text-xs text-indigo-950 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200/80">
                    <span className="mr-2.5 text-base flex-shrink-0">⚡</span>
                    <span className="font-semibold">{soil.fertilizerRecommendations.zinc}</span>
                  </div>
                )}
                {soil.fertilizerRecommendations.boron && (
                  <div className="flex items-center text-xs text-purple-950 bg-purple-50/70 p-2.5 rounded-xl border border-purple-200/80">
                    <span className="mr-2.5 text-base flex-shrink-0">💎</span>
                    <span className="font-semibold">{soil.fertilizerRecommendations.boron}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* APMC / Mandi Market Intelligence (Phase 4) */}
      <div className="mb-6">
        <MarketPriceCard
          cropId={crop.id}
          state={location?.state || 'Maharashtra'}
          district={location?.district || 'Pune'}
          farmLat={location?.lat ?? location?.latitude}
          farmLng={location?.lng ?? location?.longitude}
          farmSizeAcres={farmer?.landArea || farmer?.farmSize || soil?.farmArea || null}
        />
      </div>

      {/* Factor Breakdown */}
      <div className="space-y-2.5 mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
          {t('cropDetail', 'positiveReasons')}
        </h3>
        {suitability.factors.map((factor, idx) => {
          const isOk = factor.suitable;
          return (
            <div 
              key={idx} 
              className={`flex items-center p-3 rounded-2xl border transition-all ${
                isOk 
                  ? 'bg-white border-green-200/80 shadow-xs' 
                  : 'bg-amber-50/50 border-amber-200/80 shadow-xs'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0 ${
                isOk ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isOk ? '✓' : '!'}
              </div>
              <div className="flex-1 pr-2">
                <p className="text-gray-800 text-xs font-semibold leading-snug">
                  {getFactorExplanation(factor.reason)}
                </p>
              </div>
              <Badge 
                status={isOk ? 'good' : 'moderate'} 
                size="sm"
                className="flex-shrink-0"
              >
                {formatPercent(factor.score)}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CropDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <CropDetailContent />
      </Suspense>
      
      <div className="p-4 bg-white/95 backdrop-blur-sm fixed bottom-0 left-0 right-0 border-t border-gray-200 shadow-md z-10">
        <div className="max-w-md mx-auto">
          <Button onClick={() => router.push('/recommendation')} className="w-full" size="lg">
            {t('cropDetail', 'backToRecommendations')}
          </Button>
        </div>
      </div>
    </div>
  );
}
