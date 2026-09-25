'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import StepProgress from '@/components/StepProgress';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import FloatingNav from '@/components/FloatingNav';
import { classifySoil } from '@/lib/soil';

export default function SoilResultPage() {
  const { t, formatNumber, formatDecimal, formatPercent } = useTranslation();
  const router = useRouter();
  const { soil } = useJourney();
  const [showDetails, setShowDetails] = useState(false);

  // Fallback values if navigating directly
  const data = soil || {
    nitrogen: 245,
    phosphorus: 18,
    potassium: 165,
    ph: 7.2,
    organicCarbon: 0.62,
    sulphur: 12,
    zinc: 0.65,
    iron: 4.5,
    boron: 0.45,
    manganese: 7.5,
    copper: 0.5,
  };

  const classification = classifySoil(data);

  const getOverallLabel = (overall: 'good' | 'moderate' | 'poor') => {
    if (overall === 'good') return t('soilResult', 'overallGood');
    if (overall === 'moderate') return t('soilResult', 'overallModerate');
    return t('soilResult', 'overallPoor');
  };

  const getParamLabel = (key: string) => {
    return t('soil', key) || key;
  };

  const getStatusText = (status: string) => {
    return t('soilResult', status) || status;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-4 pt-2 pb-2 max-w-md mx-auto w-full">
        <FloatingNav backHref="/soil-processing" />
        <StepProgress currentStep={1} totalSteps={4} />
      </div>

      <main className="flex-1 px-4 py-4 max-w-md mx-auto w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('soilResult', 'title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t('soilResult', 'subtitle')}</p>
        </div>

        {/* Overall condition card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mb-3 shadow-inner">
            {classification.overall === 'good' ? '🌿' : classification.overall === 'moderate' ? '🌱' : '⚠️'}
          </div>
          <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
            {t('soilResult', 'overallCondition')}
          </span>
          <Badge size="lg" status={classification.overall} className="text-base px-5 py-1.5 font-bold">
            {getOverallLabel(classification.overall)}
          </Badge>
        </div>

        {/* Primary Parameters list */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-200/80 space-y-3 mb-4">
          {(['nitrogen', 'phosphorus', 'potassium', 'ph', 'organicCarbon'] as const).map((param) => {
            const status = classification[param];
            return (
              <div key={param} className="flex justify-between items-center py-1">
                <span className="text-gray-700 font-semibold text-sm">
                  {getParamLabel(param)}
                </span>
                <Badge status={status} size="md">
                  {getStatusText(status)}
                </Badge>
              </div>
            );
          })}
        </div>

        {/* View Details Accordion */}
        <div className="flex justify-center mb-3">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-green-700 font-semibold text-xs hover:text-green-800 transition-colors py-2 px-3 rounded-lg hover:bg-green-50"
          >
            {showDetails ? t('soilResult', 'hideDetails') : t('soilResult', 'viewDetails')}
          </button>
        </div>

        {showDetails && (
          <Card className="p-4 bg-white space-y-2.5 shadow-xs border border-gray-200/80 mb-5 animate-fadeIn">
            <div className="flex justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-500">{t('soil', 'nitrogen')}</span>
              <span className="font-bold text-gray-800">{formatNumber(data.nitrogen)} {t('soil', 'kgPerHa')}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-500">{t('soil', 'phosphorus')}</span>
              <span className="font-bold text-gray-800">{formatNumber(data.phosphorus)} {t('soil', 'kgPerHa')}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-500">{t('soil', 'potassium')}</span>
              <span className="font-bold text-gray-800">{formatNumber(data.potassium)} {t('soil', 'kgPerHa')}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-500">{t('soil', 'ph')}</span>
              <span className="font-bold text-gray-800">{formatDecimal(data.ph, 1)}</span>
            </div>
            <div className="flex justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-500">{t('soil', 'organicCarbon')}</span>
              <span className="font-bold text-gray-800">{formatPercent(data.organicCarbon)}</span>
            </div>
            {data.sulphur !== undefined && (
              <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                <span className="text-gray-500">{t('soil', 'sulphur')}</span>
                <span className="font-bold text-gray-800">{formatNumber(data.sulphur)} {t('soil', 'ppm')}</span>
              </div>
            )}
            {data.zinc !== undefined && (
              <div className="flex justify-between text-xs py-1">
                <span className="text-gray-500">{t('soil', 'zinc')}</span>
                <span className="font-bold text-gray-800">{formatDecimal(data.zinc, 2)} {t('soil', 'ppm')}</span>
              </div>
            )}
          </Card>
        )}
      </main>

      <div className="p-4 bg-white border-t border-gray-100 max-w-md mx-auto w-full">
        <Button onClick={() => router.push('/soil-freshness')} className="w-full" size="lg">
          {t('soilResult', 'nextStep')} →
        </Button>
      </div>
    </div>
  );
}
