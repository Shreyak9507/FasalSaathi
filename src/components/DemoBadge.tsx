'use client';

import React from 'react';
import { useTranslation } from '../lib/i18n';

interface DemoBadgeProps {
  className?: string;
}

export default function DemoBadge({ className = '' }: DemoBadgeProps) {
  const { t } = useTranslation();

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full shadow-sm border border-amber-100 ${className}`}>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{t('common', 'demoData') || 'Demo Data'}</span>
    </div>
  );
}
