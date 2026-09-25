'use client';

import React, { useState } from 'react';
import { useTranslation } from '../lib/i18n';
import { languages } from '../data/languages';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { t, language, setLanguage } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = languages.filter((lang) => {
    const nativeStr = lang.native || (lang as any).nativeName || '';
    const q = searchQuery.toLowerCase();
    return lang.name.toLowerCase().includes(q) || nativeStr.toLowerCase().includes(q);
  });

  const handleSelect = (code: string, implemented: boolean) => {
    if (implemented) {
      setLanguage(code);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 max-w-md mx-auto w-full">
        <h2 className="text-xl font-bold text-gray-800">{t('language', 'title') || 'Choose your language'}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 max-w-md mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder={t('language', 'search') || 'Search language...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[48px] text-base"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Language List */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-2 py-2">
        <ul className="space-y-1">
          {filteredLanguages.map((lang) => {
            const isSelected = language === lang.code;
            const nativeText = lang.native || (lang as any).nativeName || lang.name;
            return (
              <li key={lang.code}>
                <button
                  onClick={() => handleSelect(lang.code, lang.implemented)}
                  disabled={!lang.implemented}
                  className={`w-full flex items-center justify-between px-4 py-3.5 min-h-[52px] rounded-2xl text-left transition-all ${
                    lang.implemented
                      ? isSelected
                        ? 'bg-green-50 border border-green-200 shadow-xs'
                        : 'hover:bg-gray-50 active:bg-gray-100'
                      : 'opacity-50 cursor-not-allowed bg-transparent'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-900">{nativeText}</span>
                    <span className="text-xs text-gray-500 font-medium">{lang.name}</span>
                  </div>
                  <div className="flex items-center">
                    {!lang.implemented && (
                      <span className="px-2.5 py-1 text-[11px] font-medium text-gray-500 bg-gray-100 rounded-full">
                        {t('language', 'comingSoon') || 'Coming soon'}
                      </span>
                    )}
                    {isSelected && lang.implemented && (
                      <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
