'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { languages } from '@/data/languages';
import LanguageSelector from '@/components/LanguageSelector';
import Button from '@/components/ui/Button';

export default function Home() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-md mx-auto min-h-screen flex flex-col relative px-4 pb-8">
        {/* Top bar */}
        <header className="flex justify-between items-center py-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="font-extrabold text-green-900 text-xl tracking-tight">FasalSaathi</span>
          </div>
          
          <button 
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 text-gray-700 hover:border-green-400 hover:text-green-800 transition-all shadow-2xs"
            aria-label="Change language"
          >
            <span className="text-sm">🌐</span>
            <span className="text-xs font-bold">{currentLangObj.native}</span>
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center my-auto py-6">
          <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
            {/* Plant sprout SVG */}
            <div className="w-24 h-24 rounded-3xl bg-green-100/70 border border-green-200 flex items-center justify-center shadow-inner">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22V12" stroke="#1b4d3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12C12 12 8 8 5 8C2 8 2 12 5 15C8 18 12 12 12 12Z" fill="#2d7a4f" stroke="#1b4d3e" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M12 12C12 12 16 8 19 8C22 8 22 12 19 15C16 18 12 12 12 12Z" fill="#52b788" stroke="#1b4d3e" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 leading-tight">
            {t('home', 'title')}
          </h1>
          
          <p className="text-gray-600 text-sm mb-8 max-w-[300px] leading-relaxed">
            {t('home', 'subtitle')}
          </p>

          <div className="w-full space-y-3">
            <Button 
              className="w-full py-4 text-base shadow-sm font-bold"
              onClick={() => router.push('/farmer-info')}
              size="lg"
            >
              {t('common', 'start')} →
            </Button>

            <button
              type="button"
              onClick={() => router.push('/disease-detection')}
              className="w-full py-3.5 px-4 rounded-2xl bg-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/50 active:scale-[0.99] transition-all text-emerald-900 font-bold text-sm shadow-xs flex items-center justify-center gap-2"
            >
              <span>{t('home', 'checkDisease') || '📸 Check Crop Leaf Disease'}</span>
            </button>
          </div>

          <p className="text-[11px] text-green-800 font-semibold mt-6 bg-green-50/80 px-3 py-1 rounded-full border border-green-200/60">
            ✓ {t('home', 'freeTool')}
          </p>
        </main>
      </div>

      <LanguageSelector 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
      />
    </div>
  );
}
