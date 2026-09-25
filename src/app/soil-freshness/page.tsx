'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StepProgress from '@/components/StepProgress';
import FloatingNav from '@/components/FloatingNav';

interface ParsedDateResult {
  timestamp: number;
  displayDate: string | null;
  rawDate: string | null;
  isValid: boolean;
}

function parseSoilReportDate(rawInput?: string | null): ParsedDateResult {
  if (!rawInput || !String(rawInput).trim()) {
    return { timestamp: NaN, displayDate: null, rawDate: null, isValid: false };
  }

  const str = String(rawInput).trim();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // 1. Look for DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = str.match(/(\b\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})\b/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) year += 2000;

    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return {
        timestamp: d.getTime(),
        displayDate: `${day} ${months[month]} ${year}`,
        rawDate: `${dmyMatch[1]}/${dmyMatch[2]}/${year}`,
        isValid: true,
      };
    }
  }

  // 2. Look for ISO YYYY-MM-DD
  const ymdMatch = str.match(/(\b\d{4})[/.-](\d{1,2})[/.-](\d{1,2})\b/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);

    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      return {
        timestamp: d.getTime(),
        displayDate: `${day} ${months[month]} ${year}`,
        rawDate: `${day}/${month + 1}/${year}`,
        isValid: true,
      };
    }
  }

  // 3. Fallback to native Date parsing
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return {
      timestamp: d.getTime(),
      displayDate: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
      rawDate: str,
      isValid: true,
    };
  }

  return { timestamp: NaN, displayDate: str, rawDate: str, isValid: false };
}

export default function SoilFreshnessPage() {
  const router = useRouter();
  const { t, language, formatDate } = useTranslation();
  const { soil, isDemo, isLoaded } = useJourney();

  const freshnessInfo = useMemo(() => {
    // Check sampleDate, testDate, or validity period start
    const rawDateCandidate = soil?.sampleDate || soil?.testDate || soil?.validityPeriod?.startDate;
    const parsed = parseSoilReportDate(rawDateCandidate);

    if (!parsed.isValid || isNaN(parsed.timestamp)) {
      return {
        hasDate: false,
        displayDate: null,
        rawDate: null,
        status: 'unavailable' as const,
        ageText: '',
      };
    }

    const now = Date.now();
    const diffMs = now - parsed.timestamp;
    // 2 years (24 months) threshold for soil health validity
    const monthsDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375));

    // If report is from future or within last 24 months, it is fresh and recent
    const isRecent = monthsDiff <= 24;

    let ageText = '';
    if (monthsDiff <= 0) {
      ageText = t('soilFreshness', 'recentReport');
    } else if (monthsDiff < 12) {
      ageText = `${monthsDiff} ${t('soilFreshness', 'monthsAgo')}`;
    } else {
      const years = (monthsDiff / 12).toFixed(1).replace('.0', '');
      ageText = `${years} ${t('soilFreshness', 'yearsAgo')}`;
    }

    return {
      hasDate: true,
      displayDate: parsed.displayDate,
      rawDate: parsed.rawDate,
      status: isRecent ? ('recent' as const) : ('old' as const),
      ageText,
    };
  }, [soil, t]);

  if (!isLoaded && !soil) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-500 text-xs font-medium">{t('common', 'loading')}</p>
        </div>
      </div>
    );
  }

  const fertRecs = soil?.fertilizerRecommendations;
  const cropRecs = soil?.cropRecommendations;

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col min-h-screen bg-[#faf8f5]">
      <FloatingNav backHref="/soil-processing" />

      <StepProgress currentStep={1} totalSteps={4} />

      <div className="mt-4 mb-5">
        <h1 className="text-2xl font-black text-gray-900 leading-tight">
          {t('soilFreshness', 'title')}
        </h1>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          {t('soilFreshness', 'subtitle')}
        </p>
      </div>

      {/* Freshness & Validity Card */}
      <Card className="p-5 mb-4 border border-green-200/90 bg-white shadow-xs rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {t('soilFreshness', 'reportDate')}
          </span>
          {freshnessInfo.status === 'recent' && (
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
              {t('soilFreshness', 'statusRecent')}
            </span>
          )}
          {freshnessInfo.status === 'old' && (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1">
              {t('soilFreshness', 'statusOld')}
            </span>
          )}
          {freshnessInfo.status === 'unavailable' && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full text-xs font-semibold">
              {t('soilFreshness', 'statusUnknown')}
            </span>
          )}
        </div>

        {freshnessInfo.hasDate ? (
          <div className="mb-3">
            <div className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>🗓️</span>
              <span>{formatDate(freshnessInfo.rawDate || freshnessInfo.displayDate) || freshnessInfo.displayDate}</span>
            </div>
            {freshnessInfo.ageText && (
              <p className="text-xs text-gray-500 font-medium mt-0.5 ml-7">
                ({freshnessInfo.ageText})
              </p>
            )}
          </div>
        ) : (
          <div className="text-sm font-semibold text-gray-600 mb-3 italic flex items-center gap-2">
            <span>🗓️</span>
            <span>{t('soilFreshness', 'statusUnknown')}</span>
          </div>
        )}

        {/* Government Validity window if available on card */}
        {soil?.validityPeriod?.endDate && (
          <div className="p-2.5 mb-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-semibold">
              {t('soilFreshness', 'govtValidity')}
            </span>
            <span className="font-bold text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-lg">
              {t('soilFreshness', 'validUntil')} {formatDate(soil.validityPeriod.endDate) || soil.validityPeriod.endDate}
            </span>
          </div>
        )}

        {/* Descriptive Freshness Message */}
        <div className={`p-3.5 rounded-xl text-xs leading-relaxed mb-3 border ${
          freshnessInfo.status === 'recent'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
            : freshnessInfo.status === 'old'
            ? 'bg-amber-50/70 border-amber-200 text-amber-950 font-medium'
            : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          {freshnessInfo.status === 'recent' && t('soilFreshness', 'msgRecent')}
          {freshnessInfo.status === 'old' && t('soilFreshness', 'msgOld')}
          {freshnessInfo.status === 'unavailable' && t('soilFreshness', 'msgUnknown')}
        </div>

        {/* Laboratory & Card Number Metadata */}
        {(soil?.labName || soil?.soilHealthCardNumber) && (
          <div className="text-xs text-gray-600 pt-3 border-t border-gray-100 flex flex-col gap-1.5">
            {soil.labName && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-700">{t('soil', 'labName')}:</span>
                <span className="text-gray-900 font-medium">{soil.labName}</span>
              </div>
            )}
            {soil.soilHealthCardNumber && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-700">{t('soil', 'cardNo')}:</span>
                <span className="text-gray-900 font-medium font-mono">{soil.soilHealthCardNumber}</span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Card Prescribed Recommendations if present */}
      {(fertRecs || (cropRecs && cropRecs.length > 0)) && (
        <Card className="p-4 mb-4 border border-green-200/80 bg-white shadow-xs rounded-2xl">
          <h3 className="text-xs font-bold text-green-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>🌱</span> {t('soilFreshness', 'prescribedPractices')}
          </h3>

          {cropRecs && cropRecs.length > 0 && (
            <div className="mb-3">
              <span className="text-[11px] text-gray-500 font-medium block mb-1">
                {t('soilFreshness', 'recommendedCrops')}
              </span>
              <div className="flex flex-wrap gap-1">
                {cropRecs.map((c, i) => (
                  <span key={i} className="text-xs font-semibold px-2 py-0.5 bg-green-50 text-green-800 rounded-md border border-green-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {fertRecs && (
            <div className="space-y-1.5 text-xs pt-2 border-t border-gray-100">
              {fertRecs.organicManure && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('soilFreshness', 'organicManure')}</span>
                  <span className="font-bold text-gray-800">{fertRecs.organicManure}</span>
                </div>
              )}
              {fertRecs.biofertilizer && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('soilFreshness', 'biofertilizer')}</span>
                  <span className="font-bold text-gray-800">{fertRecs.biofertilizer}</span>
                </div>
              )}
              {fertRecs.zinc && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('soilFreshness', 'zincSulphate')}</span>
                  <span className="font-bold text-gray-800">{fertRecs.zinc}</span>
                </div>
              )}
              {fertRecs.boron && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('soilFreshness', 'boronBorax')}</span>
                  <span className="font-bold text-gray-800">{fertRecs.boron}</span>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Agronomist Advice Box */}
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-6 flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">🌾</span>
        <div>
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
            {t('soilFreshness', 'adviceTitle')}
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            {t('soilFreshness', 'adviceText')}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto space-y-3 pt-2">
        <Button
          onClick={() => router.push('/location')}
          fullWidth
          size="lg"
        >
          {t('soilFreshness', 'continue')} →
        </Button>
      </div>
    </div>
  );
}
