'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import StepProgress from '@/components/StepProgress';
import FileUpload from '@/components/FileUpload';
import FloatingNav from '@/components/FloatingNav';
import { setPendingSoilFile } from '@/services/soil-extraction';

export default function SoilUploadPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setIsDemo } = useJourney();

  const handleFileSelect = (file: File) => {
    // Retain real uploaded file for vision processing
    setPendingSoilFile(file);
    setIsDemo(false);
    router.push('/soil-processing');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-4 pb-8 pt-2">
        <FloatingNav backHref="/farmer-info" />

        <StepProgress currentStep={1} totalSteps={4} />
        
        <main className="flex-1 mt-6 flex flex-col">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1.5">
              {t('soil', 'title')}
            </h1>
            <p className="text-gray-600 text-sm">
              {t('soil', 'subtitle')}
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center my-2">
            <FileUpload 
              onFileSelect={handleFileSelect} 
            />
          </div>

          {/* No card helper card */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-between">
            <div className="pr-2">
              <p className="text-xs font-bold text-gray-800">
                {t('soil', 'noCardQuestion')}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {t('soil', 'noCardLink')}
              </p>
            </div>
            <button
              onClick={() => router.push('/no-card')}
              className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-xs rounded-xl whitespace-nowrap transition-colors"
            >
              {t('common', 'continue')} →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
