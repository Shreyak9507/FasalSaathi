'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

interface FloatingNavProps {
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  title?: string;
  className?: string;
  hideHome?: boolean;
}

export default function FloatingNav({
  backHref,
  onBack,
  backLabel,
  title,
  className = '',
  hideHome = false,
}: FloatingNavProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const handleHome = () => {
    // Navigates to home screen while preserving stored journey session
    router.push('/');
  };

  return (
    <nav
      aria-label="Screen Navigation"
      className={`sticky top-2 z-40 mb-3 px-1 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-xs max-w-md mx-auto w-full">
        {/* Left: Accessible Back Button */}
        <button
          type="button"
          onClick={handleBack}
          aria-label={t('common', 'backAria') || 'Go back to previous screen'}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/60 active:scale-95 transition-all min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <span className="text-sm font-black" aria-hidden="true">
            ←
          </span>
          <span>{backLabel || t('common', 'back') || 'Back'}</span>
        </button>

        {/* Center: Optional page context or subtle badge */}
        {title && (
          <div className="truncate px-2 text-center">
            <span className="text-[11px] font-bold text-slate-600 truncate block">
              {title}
            </span>
          </div>
        )}

        {/* Right: Accessible Home Button */}
        {!hideHome && (
          <button
            type="button"
            onClick={handleHome}
            aria-label={t('common', 'homeAria') || 'Return to FasalSaathi home'}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/60 active:scale-95 transition-all min-h-[40px] touch-manipulation focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <span className="text-sm" aria-hidden="true">
              🏠
            </span>
            <span>{t('common', 'home') || 'Home'}</span>
          </button>
        )}
      </div>
    </nav>
  );
}
