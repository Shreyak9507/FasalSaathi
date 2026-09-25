'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import StepProgress from '@/components/StepProgress';
import Button from '@/components/ui/Button';
import FloatingNav from '@/components/FloatingNav';

export default function FarmerInfoPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { farmer, setFarmer } = useJourney();
  
  const [name, setName] = useState(farmer?.name || '');
  const [location, setLocationState] = useState(farmer?.farmLocation || '');
  const [landArea, setLandArea] = useState(farmer?.landArea ? String(farmer.landArea) : '');
  const [landUnit, setLandUnit] = useState<'acre' | 'hectare'>(farmer?.unit || 'acre');
  const [irrigation, setIrrigation] = useState<'available' | 'limited' | 'rainfed'>(farmer?.irrigation || 'available');

  const handleContinue = () => {
    if (!name.trim()) return;
    
    setFarmer({
      name: name.trim(),
      farmLocation: location.trim(),
      landArea: parseFloat(landArea) || 0,
      unit: landUnit,
      irrigation,
    });
    
    router.push('/soil-upload');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-4 pb-8 pt-2">
        <FloatingNav backHref="/" />

        <StepProgress currentStep={0} totalSteps={4} />
        
        <main className="flex-1 mt-5">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {t('farmerInfo', 'title')}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            {t('farmerInfo', 'subtitle')}
          </p>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('farmerInfo', 'name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('farmerInfo', 'namePlaceholder')}
                className="w-full min-h-[52px] px-4 rounded-2xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-xs"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('farmerInfo', 'farmLocation')}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocationState(e.target.value)}
                placeholder={t('farmerInfo', 'farmLocationPlaceholder')}
                className="w-full min-h-[52px] px-4 rounded-2xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-xs"
              />
            </div>

            {/* Land Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('farmerInfo', 'landArea')}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder={t('farmerInfo', 'landAreaPlaceholder') || '2.5'}
                  step="0.1"
                  min="0"
                  className="flex-1 min-h-[52px] px-4 rounded-2xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-xs"
                />
                <div className="flex bg-gray-100 rounded-2xl p-1 h-[52px] border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setLandUnit('acre')}
                    className={`px-4 rounded-xl text-sm font-semibold transition-all ${
                      landUnit === 'acre' ? 'bg-white text-green-700 shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    {t('farmerInfo', 'acre')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLandUnit('hectare')}
                    className={`px-4 rounded-xl text-sm font-semibold transition-all ${
                      landUnit === 'hectare' ? 'bg-white text-green-700 shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    {t('farmerInfo', 'hectare')}
                  </button>
                </div>
              </div>
            </div>

            {/* Irrigation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t('farmerInfo', 'irrigation')}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: 'available' as const, label: t('farmerInfo', 'irrigationAvailable'), icon: '💧' },
                  { value: 'limited' as const, label: t('farmerInfo', 'irrigationLimited'), icon: '💦' },
                  { value: 'rainfed' as const, label: t('farmerInfo', 'irrigationRainfed'), icon: '🌧️' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setIrrigation(option.value)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all min-h-[90px] ${
                      irrigation === option.value
                        ? 'border-green-600 bg-green-50/70 shadow-xs'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{option.icon}</span>
                    <span className={`text-xs text-center leading-tight ${irrigation === option.value ? 'font-bold text-green-800' : 'text-gray-600'}`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>

        <div className="mt-8">
          <Button 
            className="w-full"
            onClick={handleContinue}
            disabled={!name.trim()}
            size="lg"
          >
            {t('common', 'continue')} →
          </Button>
        </div>
      </div>
    </div>
  );
}
