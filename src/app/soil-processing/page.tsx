'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import StepProgress from '@/components/StepProgress';
import Button from '@/components/ui/Button';
import FloatingNav from '@/components/FloatingNav';
import { extractSoilDataFromFile, getPendingSoilFile } from '@/services/soil-extraction';
import { ValidationIssue, CardValidityPeriod, CardFertilizerRecommendations } from '@/types';

export default function SoilProcessingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDemo, soil, farmer, location, setSoil, setFarmer, setLocation } = useJourney();

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [extractionFailed, setExtractionFailed] = useState(false);
  const [extractionNote, setExtractionNote] = useState<string>('');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [readFields, setReadFields] = useState<Set<string>>(new Set());
  const [showMicronutrients, setShowMicronutrients] = useState(true);

  // Recommendations and Validity State
  const [validityPeriod, setValidityPeriod] = useState<CardValidityPeriod | undefined>(soil?.validityPeriod);
  const [cropRecs, setCropRecs] = useState<string[]>(soil?.cropRecommendations || ['Soybean', 'Wheat', 'Maize', 'Groundnut', 'Sugarcane', 'Paddy']);
  const [fertilizerRecs, setFertilizerRecs] = useState<CardFertilizerRecommendations | undefined>(soil?.fertilizerRecommendations);

  // Grouped Form State
  const [formData, setFormData] = useState({
    // Farm Details
    farmerName: farmer?.name || '',
    landArea: farmer?.landArea || 2.5,
    unit: (farmer?.unit || 'hectare') as 'acre' | 'hectare',
    irrigation: (farmer?.irrigation || 'available') as 'available' | 'limited' | 'rainfed',

    // Soil Nutrients
    ph: soil?.ph ?? 6.8,
    ec: soil?.ec ?? 0.42,
    organicCarbon: soil?.organicCarbon ?? 0.68,
    nitrogen: soil?.nitrogen ?? 285,
    phosphorus: soil?.phosphorus ?? 18,
    potassium: soil?.potassium ?? 210,
    sulphur: soil?.sulphur ?? 14,
    zinc: soil?.zinc ?? 0.72,
    boron: soil?.boron ?? 0.48,
    iron: soil?.iron ?? 4.8,
    manganese: soil?.manganese ?? 8.5,
    copper: soil?.copper ?? 0.55,

    // Location
    village: location?.name || 'Khedgaon',
    subDistrict: 'Khed',
    district: location?.district || 'Pune',
    state: location?.state || 'Maharashtra',
    latitude: (location?.lat || 18.5204) as number | null,
    longitude: (location?.lng || 73.8567) as number | null,

    // Sample Information
    soilHealthCardNumber: soil?.soilHealthCardNumber || 'SHC-DEMO-2026-001',
    sampleDate: soil?.sampleDate || '2026-09-15',
    testDate: soil?.testDate || '2026-09-20',
    labName: soil?.labName || 'District Soil Testing Laboratory',
  });

  useEffect(() => {
    let isSubscribed = true;

    async function processCard() {
      // If Demo Mode, use demo constants
      if (isDemo) {
        setLoadingMessage('Loading demo soil health report...');
        setTimeout(() => {
          if (!isSubscribed) return;
          setReadFields(new Set(['ph', 'ec', 'organicCarbon', 'nitrogen', 'phosphorus', 'potassium', 'sulphur', 'zinc', 'boron', 'iron', 'manganese', 'copper']));
          setIsLoading(false);
        }, 800);
        return;
      }

      // Check for pending uploaded file
      const file = getPendingSoilFile();
      if (!file) {
        // No uploaded file found (direct navigation or reload)
        setIsLoading(false);
        return;
      }

      setLoadingMessage(t('soil', 'readingVisionAI'));
      try {
        const result = await extractSoilDataFromFile(file);

        if (!isSubscribed) return;

        if (result.success && result.extractedCard) {
          const card = result.extractedCard;
          const readKeys = new Set<string>();

          // Mark detected fields
          if (card.farmer?.name || card.farmer?.farmerName) readKeys.add('farmerName');
          if (card.sample?.farmSize) readKeys.add('landArea');
          if (card.sample?.irrigation) readKeys.add('irrigation');

          if (card.soil?.ph?.value != null) readKeys.add('ph');
          if (card.soil?.ec?.value != null) readKeys.add('ec');
          if (card.soil?.organicCarbon?.value != null) readKeys.add('organicCarbon');
          if (card.soil?.nitrogen?.value != null) readKeys.add('nitrogen');
          if (card.soil?.phosphorus?.value != null) readKeys.add('phosphorus');
          if (card.soil?.potassium?.value != null) readKeys.add('potassium');
          if (card.soil?.sulphur?.value != null) readKeys.add('sulphur');
          if (card.soil?.zinc?.value != null) readKeys.add('zinc');
          if (card.soil?.boron?.value != null) readKeys.add('boron');
          if (card.soil?.iron?.value != null) readKeys.add('iron');
          if (card.soil?.manganese?.value != null) readKeys.add('manganese');
          if (card.soil?.copper?.value != null) readKeys.add('copper');

          if (card.farmer?.village) readKeys.add('village');
          if (card.farmer?.district) readKeys.add('district');
          if (card.farmer?.subDistrict) readKeys.add('subDistrict');
          if (card.sample?.latitude) readKeys.add('latitude');
          if (card.sample?.longitude) readKeys.add('longitude');

          if (card.sample?.sampleNumber || card.sample?.cardNumber) readKeys.add('soilHealthCardNumber');
          if (card.sample?.sampleDate) readKeys.add('sampleDate');
          if (card.sample?.testDate) readKeys.add('testDate');
          if (card.sample?.labName) readKeys.add('labName');

          setReadFields(readKeys);

          // Populate form state from card without rounding or modifying decimals
          setFormData(prev => ({
            ...prev,
            farmerName: card.farmer?.name || card.farmer?.farmerName || prev.farmerName,
            landArea: card.sample?.farmSize || prev.landArea,
            unit: (card.sample?.farmSizeUnit?.toLowerCase().includes('hec') ? 'hectare' : 'acre'),
            irrigation: card.sample?.irrigation?.toLowerCase().includes('rain') ? 'rainfed' :
                        card.sample?.irrigation?.toLowerCase().includes('limit') ? 'limited' : 'available',

            ph: card.soil?.ph?.value ?? prev.ph,
            ec: card.soil?.ec?.value ?? prev.ec,
            organicCarbon: card.soil?.organicCarbon?.value ?? prev.organicCarbon,
            nitrogen: card.soil?.nitrogen?.value ?? prev.nitrogen,
            phosphorus: card.soil?.phosphorus?.value ?? prev.phosphorus,
            potassium: card.soil?.potassium?.value ?? prev.potassium,
            sulphur: card.soil?.sulphur?.value ?? prev.sulphur,
            zinc: card.soil?.zinc?.value ?? prev.zinc,
            boron: card.soil?.boron?.value ?? prev.boron,
            iron: card.soil?.iron?.value ?? prev.iron,
            manganese: card.soil?.manganese?.value ?? prev.manganese,
            copper: card.soil?.copper?.value ?? prev.copper,

            village: card.farmer?.village || prev.village,
            subDistrict: card.farmer?.subDistrict || prev.subDistrict,
            district: card.farmer?.district || prev.district,
            state: card.farmer?.state || prev.state,
            latitude: (typeof card.sample?.latitude === 'number' && !isNaN(card.sample.latitude) && card.sample.latitude >= 6.0 && card.sample.latitude <= 38.0)
              ? card.sample.latitude
              : null,
            longitude: (typeof card.sample?.longitude === 'number' && !isNaN(card.sample.longitude) && card.sample.longitude >= 68.0 && card.sample.longitude <= 98.0)
              ? card.sample.longitude
              : null,

            soilHealthCardNumber: card.sample?.sampleNumber || card.sample?.cardNumber || prev.soilHealthCardNumber,
            sampleDate: card.sample?.sampleDate || prev.sampleDate,
            testDate: card.sample?.testDate || prev.testDate,
            labName: card.sample?.labName || prev.labName,
          }));

          if (card.validityPeriod) {
            setValidityPeriod(card.validityPeriod);
          }
          if (card.cropRecommendations && card.cropRecommendations.length > 0) {
            setCropRecs(card.cropRecommendations);
          }
          if (card.fertilizerRecommendations) {
            setFertilizerRecs(card.fertilizerRecommendations);
          }

          setIssues(result.validationIssues || []);
          setExtractionNote(result.notes || '');
        } else {
          // Extraction returned fallback / failure
          setExtractionFailed(true);
          setExtractionNote(result.notes || result.error || 'Please review and enter your report details below.');
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        setExtractionFailed(true);
        setExtractionNote('Could not connect to extraction service. You can enter your details manually.');
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    processCard();

    return () => {
      isSubscribed = false;
    };
  }, [isDemo]);

  const handleNumChange = (field: string, val: string) => {
    const num = parseFloat(val);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
  };

  const handleTextChange = (field: string, val: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: val,
    }));
  };

  const getIssueForField = (field: string) => {
    return issues.find(i => i.field.toLowerCase().includes(field.toLowerCase()));
  };

  const handleConfirmEverything = () => {
    // 1. Update Soil Data in Store
    setSoil({
      ph: formData.ph,
      ec: formData.ec,
      organicCarbon: formData.organicCarbon,
      nitrogen: formData.nitrogen,
      phosphorus: formData.phosphorus,
      potassium: formData.potassium,
      sulphur: formData.sulphur,
      zinc: formData.zinc,
      boron: formData.boron,
      iron: formData.iron,
      manganese: formData.manganese,
      copper: formData.copper,
      sampleDate: formData.sampleDate,
      testDate: formData.testDate,
      labName: formData.labName,
      soilHealthCardNumber: formData.soilHealthCardNumber,
      validityPeriod,
      cropRecommendations: cropRecs,
      fertilizerRecommendations: fertilizerRecs,
      source: isDemo ? 'demo' : 'upload',
    });

    // 2. Update Farmer Data in Store
    setFarmer({
      name: formData.farmerName,
      farmLocation: [formData.village, formData.district, formData.state].filter(Boolean).join(', '),
      landArea: formData.landArea,
      unit: formData.unit,
      irrigation: formData.irrigation,
    });

    // 3. Update Location Data in Store with Soil Report Priority
    const rawLat = Number(formData.latitude);
    const rawLng = Number(formData.longitude);
    const hasValidCoords =
      !isNaN(rawLat) &&
      !isNaN(rawLng) &&
      rawLat >= 6.0 &&
      rawLat <= 38.0 &&
      rawLng >= 68.0 &&
      rawLng <= 98.0;

    const locDisplay = [formData.village, formData.subDistrict, formData.district, formData.state]
      .filter(Boolean)
      .join(', ');

    if (hasValidCoords) {
      setLocation({
        lat: rawLat,
        lng: rawLng,
        display: locDisplay,
        name: formData.village || formData.subDistrict || formData.district || 'Farm Location',
        village: formData.village,
        taluka: formData.subDistrict,
        district: formData.district,
        state: formData.state,
        source: 'soil_report',
        soilCardLocation: {
          lat: rawLat,
          lng: rawLng,
          display: locDisplay,
          name: formData.village || formData.subDistrict || formData.district || 'Farm Location',
          village: formData.village,
          taluka: formData.subDistrict,
          district: formData.district,
          state: formData.state,
          isValid: true,
        },
      });
    } else {
      setLocation({
        lat: 0,
        lng: 0,
        display: locDisplay,
        name: formData.village || formData.subDistrict || formData.district || '',
        village: formData.village,
        taluka: formData.subDistrict,
        district: formData.district,
        state: formData.state,
        source: 'manual',
        soilCardLocation: null,
      });
    }

    // Advance to next user journey step: Soil Freshness Check
    router.push('/soil-freshness');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="relative w-16 h-16 mb-5">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🌱</div>
        </div>
        <p className="text-lg font-bold text-gray-800">{loadingMessage || t('soil', 'readingVisionAI')}</p>
        <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed">
          {t('soil', 'processingSubtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      {/* Top Header & Progress */}
      <div className="px-4 pt-2 pb-2 max-w-md mx-auto w-full">
        <FloatingNav backHref="/soil-upload" />
        <StepProgress currentStep={1} totalSteps={4} />
      </div>

      <main className="flex-1 px-4 py-3 max-w-md mx-auto w-full space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('soil', 'verifyTitle')}</h1>
          <p className="text-gray-600 text-sm mt-1">{t('soil', 'verifySubtitle')}</p>
        </div>

        {/* Fallback / Alert Banner if Vision could not parse everything */}
        {extractionFailed && (
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <p className="text-xs font-bold text-amber-900">{t('soil', 'cardReadFail')}</p>
              <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                {extractionNote || t('soil', 'cardReadFailDesc')}
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 1: Farm Details                                  */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌾</span> {t('soil', 'farmDetails')}
            </h2>
            {readFields.has('farmerName') && (
              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                ✓ {t('soil', 'readFromCard')}
              </span>
            )}
          </div>

          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('farmerInfo', 'name')}
            </label>
            <input
              type="text"
              value={formData.farmerName}
              onChange={(e) => handleTextChange('farmerName', e.target.value)}
              placeholder={t('farmerInfo', 'namePlaceholder')}
              className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            />
          </div>

          {/* Land Area & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('farmerInfo', 'landArea')}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.landArea}
                onChange={(e) => handleNumChange('landArea', e.target.value)}
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('farmerInfo', 'unit')}
              </label>
              <select
                value={formData.unit}
                onChange={(e) => handleTextChange('unit', e.target.value)}
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              >
                <option value="hectare">{t('farmerInfo', 'hectare')}</option>
                <option value="acre">{t('farmerInfo', 'acre')}</option>
              </select>
            </div>
          </div>

          {/* Irrigation Facility */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('farmerInfo', 'irrigation')}
            </label>
            <select
              value={formData.irrigation}
              onChange={(e) => handleTextChange('irrigation', e.target.value)}
              className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
            >
              <option value="available">{t('farmerInfo', 'irrigationAvailable')}</option>
              <option value="limited">{t('farmerInfo', 'irrigationLimited')}</option>
              <option value="rainfed">{t('farmerInfo', 'irrigationRainfed')}</option>
            </select>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: Soil Nutrients & Chemistry                    */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🧪</span> {t('soil', 'soilNutrients')}
            </h2>
            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
              ✓ {t('soil', 'readFromCard')}
            </span>
          </div>

          {/* Core Chemistry: pH, EC, Organic Carbon */}
          <div className="space-y-3 pb-3 border-b border-gray-100">
            {/* pH */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{t('soil', 'ph')}</label>
                {getIssueForField('ph') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    ⚠️ {t('soil', 'pleaseCheck')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.ph}
                  onChange={(e) => handleNumChange('ph', e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-16 text-right">pH units</span>
              </div>
            </div>

            {/* EC */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{t('soil', 'ec')}</label>
                {getIssueForField('ec') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    ⚠️ {t('soil', 'pleaseCheck')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.ec}
                  onChange={(e) => handleNumChange('ec', e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-16 text-right">dS/m</span>
              </div>
            </div>

            {/* Organic Carbon */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{t('soil', 'organicCarbon')}</label>
                {getIssueForField('organicCarbon') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    ⚠️ {t('soil', 'pleaseCheck')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.organicCarbon}
                  onChange={(e) => handleNumChange('organicCarbon', e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-16 text-right">%</span>
              </div>
            </div>
          </div>

          {/* Primary Macronutrients: N, P, K */}
          <div className="space-y-3 pb-3 border-b border-gray-100">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {t('soil', 'primaryNutrients')}
            </h3>

            {/* Nitrogen */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{t('soil', 'nitrogen')}</label>
                {getIssueForField('nitrogen') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    ⚠️ {t('soil', 'pleaseCheck')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.nitrogen}
                  onChange={(e) => handleNumChange('nitrogen', e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-16 text-right">kg/ha</span>
              </div>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{t('soil', 'phosphorus')}</label>
                {getIssueForField('phosphorus') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    ⚠️ {t('soil', 'pleaseCheck')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.phosphorus}
                  onChange={(e) => handleNumChange('phosphorus', e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-16 text-right">kg/ha</span>
              </div>
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">{t('soil', 'potassium')}</label>
                {getIssueForField('potassium') && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    ⚠️ {t('soil', 'pleaseCheck')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={formData.potassium}
                  onChange={(e) => handleNumChange('potassium', e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <span className="text-xs text-gray-400 w-16 text-right">kg/ha</span>
              </div>
            </div>
          </div>

          {/* Secondary & Micronutrients Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowMicronutrients(!showMicronutrients)}
              className="w-full flex items-center justify-between text-xs font-bold text-green-700 py-1"
            >
              <span>{showMicronutrients ? t('soilResult', 'hideDetails') : t('soilResult', 'viewDetails')} ({t('soil', 'secondaryNutrients')})</span>
              <span>{showMicronutrients ? '▲' : '▼'}</span>
            </button>

            {showMicronutrients && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                {/* Sulphur */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t('soil', 'sulphur')}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.sulphur}
                      onChange={(e) => handleNumChange('sulphur', e.target.value)}
                      className="w-24 p-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-right text-xs font-bold text-gray-800"
                    />
                    <span className="text-[11px] text-gray-400 w-12 text-right">mg/kg</span>
                  </div>
                </div>

                {/* Zinc */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t('soil', 'zinc')}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.zinc}
                      onChange={(e) => handleNumChange('zinc', e.target.value)}
                      className="w-24 p-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-right text-xs font-bold text-gray-800"
                    />
                    <span className="text-[11px] text-gray-400 w-12 text-right">mg/kg</span>
                  </div>
                </div>

                {/* Boron */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t('soil', 'boron')}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.boron}
                      onChange={(e) => handleNumChange('boron', e.target.value)}
                      className="w-24 p-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-right text-xs font-bold text-gray-800"
                    />
                    <span className="text-[11px] text-gray-400 w-12 text-right">mg/kg</span>
                  </div>
                </div>

                {/* Iron */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t('soil', 'iron')}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.iron}
                      onChange={(e) => handleNumChange('iron', e.target.value)}
                      className="w-24 p-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-right text-xs font-bold text-gray-800"
                    />
                    <span className="text-[11px] text-gray-400 w-12 text-right">mg/kg</span>
                  </div>
                </div>

                {/* Manganese */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t('soil', 'manganese')}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.manganese}
                      onChange={(e) => handleNumChange('manganese', e.target.value)}
                      className="w-24 p-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-right text-xs font-bold text-gray-800"
                    />
                    <span className="text-[11px] text-gray-400 w-12 text-right">mg/kg</span>
                  </div>
                </div>

                {/* Copper */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">{t('soil', 'copper')}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.copper}
                      onChange={(e) => handleNumChange('copper', e.target.value)}
                      className="w-24 p-1.5 bg-gray-50/50 border border-gray-200 rounded-lg text-right text-xs font-bold text-gray-800"
                    />
                    <span className="text-[11px] text-gray-400 w-12 text-right">mg/kg</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: Location Details                              */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>📍</span> {t('soil', 'locationDetails')}
            </h2>
            {readFields.has('village') && (
              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                ✓ {t('soil', 'readFromCard')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('location', 'village')}
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => handleTextChange('village', e.target.value)}
                placeholder="e.g. Khedgaon"
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('location', 'taluka')}
              </label>
              <input
                type="text"
                value={formData.subDistrict}
                onChange={(e) => handleTextChange('subDistrict', e.target.value)}
                placeholder="e.g. Khed"
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('location', 'district')}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleTextChange('district', e.target.value)}
                placeholder="e.g. Pune"
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('location', 'state')}
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleTextChange('state', e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                {t('location', 'latitude')}
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude ?? ''}
                onChange={(e) => handleNumChange('latitude', e.target.value)}
                className="w-full p-2 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                {t('location', 'longitude')}
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude ?? ''}
                onChange={(e) => handleNumChange('longitude', e.target.value)}
                className="w-full p-2 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold text-gray-700 text-xs focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: Sample Information                            */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>📋</span> {t('soil', 'sampleInformation')}
            </h2>
            {readFields.has('soilHealthCardNumber') && (
              <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                ✓ {t('soil', 'readFromCard')}
              </span>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('soil', 'cardNo')}
            </label>
            <input
              type="text"
              value={formData.soilHealthCardNumber}
              onChange={(e) => handleTextChange('soilHealthCardNumber', e.target.value)}
              placeholder="e.g. SHC-DEMO-2026-001"
              className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('soil', 'sampleDate')}
              </label>
              <input
                type="text"
                value={formData.sampleDate}
                onChange={(e) => handleTextChange('sampleDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('soilFreshness', 'reportDate')}
              </label>
              <input
                type="text"
                value={formData.testDate}
                onChange={(e) => handleTextChange('testDate', e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Lab Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              {t('soil', 'labName')}
            </label>
            <input
              type="text"
              value={formData.labName}
              onChange={(e) => handleTextChange('labName', e.target.value)}
              placeholder="District Soil Testing Laboratory"
              className="w-full p-2.5 bg-gray-50/50 border border-gray-200 rounded-xl font-bold text-gray-800 text-sm focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 5: Recommendations & Card Validity               */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌾</span> {t('soilFreshness', 'cardRecommendationsTitle')}
            </h2>
            <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {t('soilFreshness', 'activeValid')}
            </span>
          </div>

          {/* Validity Period */}
          <div className="p-3 bg-green-50/70 border border-green-100 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-green-900">{t('soilFreshness', 'cardValidityPeriod')}</p>
              <p className="text-xs font-bold text-green-800 mt-0.5">
                {validityPeriod?.startDate || formData.sampleDate} {t('soilFreshness', 'to')} {validityPeriod?.endDate || '14/09/2029'} {t('soilFreshness', 'threeYears')}
              </p>
            </div>
            <span className="text-xs bg-green-600 text-white font-bold px-2 py-1 rounded-lg">
              {t('soilFreshness', 'validReport')}
            </span>
          </div>

          {/* Recommended Crops on Card */}
          {cropRecs && cropRecs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1.5">
                {t('soilFreshness', 'recommendedCrops')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {cropRecs.map((cropName, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100/70 text-green-900 text-xs font-semibold rounded-lg border border-green-200"
                  >
                    <span>🌱</span>
                    <span>{cropName}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Organic & Mineral Recommendations */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <p className="text-xs font-semibold text-gray-700">{t('soilFreshness', 'generalAmendments')}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">{t('soilFreshness', 'organicManure')}</span>
                <span className="font-bold text-gray-800">{fertilizerRecs?.organicManure || '5 t/ha FYM / Compost'}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">{t('soilFreshness', 'biofertilizer')}</span>
                <span className="font-bold text-gray-800">{fertilizerRecs?.biofertilizer || 'Azotobacter + PSB'}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">{t('soilFreshness', 'zincSulphate')}</span>
                <span className="font-bold text-gray-800">{fertilizerRecs?.zinc || '25 kg/ha ZnSO₄'}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-500 block text-[10px]">{t('soilFreshness', 'boronBorax')}</span>
                <span className="font-bold text-gray-800">{fertilizerRecs?.boron || '10 kg/ha Borax'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Confirmation Button */}
      <div className="sticky bottom-0 p-4 bg-white/95 backdrop-blur-xs border-t border-gray-200/80 max-w-md mx-auto w-full z-10">
        <Button onClick={handleConfirmEverything} className="w-full text-base font-bold shadow-md shadow-green-900/10" size="lg">
          ✓ {t('soil', 'everythingCorrect')} →
        </Button>
      </div>
    </div>
  );
}
