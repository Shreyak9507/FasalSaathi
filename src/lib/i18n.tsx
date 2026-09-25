'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { allTranslations } from '@/translations';
import {
  formatNumber,
  formatCurrency,
  formatDecimal,
  formatPercent,
  formatDistance,
  formatDate,
  formatYield,
  localizeDigits,
} from '@/lib/formatters';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (section: string, key: string) => string;
  formatNumber: (value: number | string | null | undefined, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => string;
  formatCurrency: (amount: number | string | null | undefined) => string;
  formatDecimal: (value: number | string | null | undefined, decimals?: number) => string;
  formatPercent: (value: number | string | null | undefined) => string;
  formatDistance: (km: number | string | null | undefined) => string;
  formatDate: (date: string | Date | null | undefined, formatStyle?: 'long' | 'short') => string;
  formatYield: (quintals: number | string | null | undefined) => string;
  localizeDigits: (value: string | number | null | undefined) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  formatNumber: (v) => String(v ?? ''),
  formatCurrency: (v) => `₹${v ?? ''}`,
  formatDecimal: (v) => String(v ?? ''),
  formatPercent: (v) => `${v ?? ''}%`,
  formatDistance: (v) => `${v ?? ''} km`,
  formatDate: (v) => String(v ?? ''),
  formatYield: (v) => `${v ?? ''} quintals`,
  localizeDigits: (v) => String(v ?? ''),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fasalsaathi-language');
      if (saved && allTranslations[saved]) {
        setLang(saved);
      }
    } catch {
      // ignore
    } finally {
      setMounted(true);
    }
  }, []);

  const setLanguage = useCallback((lang: string) => {
    if (allTranslations[lang]) {
      setLang(lang);
      try {
        localStorage.setItem('fasalsaathi-language', lang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const t = useCallback((section: string, key: string): string => {
    const currentDict = allTranslations[language];
    const enDict = allTranslations['en'];

    const val = currentDict?.[section]?.[key];
    if (val !== undefined && val !== null && val !== '') {
      return String(val);
    }

    const fallbackVal = enDict?.[section]?.[key];
    if (fallbackVal !== undefined && fallbackVal !== null && fallbackVal !== '') {
      return String(fallbackVal);
    }

    return key;
  }, [language]);

  const boundFormatNumber = useCallback(
    (value: number | string | null | undefined, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) =>
      formatNumber(value, language, options),
    [language]
  );

  const boundFormatCurrency = useCallback(
    (amount: number | string | null | undefined) => formatCurrency(amount, language),
    [language]
  );

  const boundFormatDecimal = useCallback(
    (value: number | string | null | undefined, decimals?: number) =>
      formatDecimal(value, language, decimals),
    [language]
  );

  const boundFormatPercent = useCallback(
    (value: number | string | null | undefined) => formatPercent(value, language),
    [language]
  );

  const boundFormatDistance = useCallback(
    (km: number | string | null | undefined) => formatDistance(km, language),
    [language]
  );

  const boundFormatDate = useCallback(
    (date: string | Date | null | undefined, formatStyle?: 'long' | 'short') =>
      formatDate(date, language, formatStyle),
    [language]
  );

  const boundFormatYield = useCallback(
    (quintals: number | string | null | undefined) => formatYield(quintals, language),
    [language]
  );

  const boundLocalizeDigits = useCallback(
    (value: string | number | null | undefined) => localizeDigits(value, language),
    [language]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatNumber: boundFormatNumber,
        formatCurrency: boundFormatCurrency,
        formatDecimal: boundFormatDecimal,
        formatPercent: boundFormatPercent,
        formatDistance: boundFormatDistance,
        formatDate: boundFormatDate,
        formatYield: boundFormatYield,
        localizeDigits: boundLocalizeDigits,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
