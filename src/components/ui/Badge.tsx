import React from 'react';

type BadgeStatus = 'good' | 'moderate' | 'low' | 'high' | 'suitable' | 'acidic' | 'alkaline' | 'poor' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  status?: BadgeStatus | string;
  variant?: BadgeStatus | string;
  label?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  good: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  suitable: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  success: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  low: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  high: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  acidic: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  alkaline: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  poor: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  error: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  info: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
};

export default function Badge({
  status,
  variant,
  label,
  children,
  size = 'md',
  className = '',
}: BadgeProps) {
  const key = (status || variant || 'good').toLowerCase();
  const colors = colorMap[key] || colorMap.moderate;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const content = children || label;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colors.bg} ${colors.text} ${sizeClasses[size]} ${className}`}>
      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
      {content}
    </span>
  );
}

export { Badge };
