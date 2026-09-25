'use client';

import React, { useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export default function FileUpload({
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png'
}: FileUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelect = (file: File) => {
    setError(null);
    if (!file) return;

    // Check size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('errors', 'fileTooLarge'));
      return;
    }

    // Check type
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    const isPdf = name.endsWith('.pdf') || type.includes('pdf');
    const isImage = /\.(jpe?g|png)$/i.test(name) || type.includes('image/');

    if (!isPdf && !isImage) {
      setError(t('errors', 'invalidFormat'));
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelect(file);
    }
    if (e.target) e.target.value = '';
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-green-50/50 border-2 border-dashed border-green-300 rounded-2xl">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 mb-3 shadow-inner">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <p className="text-xs text-gray-500 mb-5 text-center font-medium">
          {t('soil', 'supportedFormats')}
        </p>

        {error && (
          <div className="w-full p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center flex items-center justify-center gap-1.5 font-medium animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col w-full gap-3 sm:max-w-xs">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3.5 px-4 min-h-[48px] bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium rounded-xl transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>📄</span>
            <span>{t('soil', 'uploadReport')}</span>
          </button>

          <input
            type="file"
            ref={cameraInputRef}
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="w-full py-3.5 px-4 min-h-[48px] bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>📷</span>
            <span>{t('soil', 'takePhoto')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
