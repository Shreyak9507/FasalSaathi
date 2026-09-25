import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'mint' | 'flat';
  onClick?: () => void;
}

export default function Card({ children, className = '', variant = 'default', onClick }: CardProps) {
  const variants = {
    default: 'bg-white shadow-sm border border-gray-100',
    mint: 'bg-emerald-50/60 border border-emerald-100',
    flat: 'bg-gray-50',
  };

  return (
    <div
      className={`rounded-2xl p-5 ${variants[variant]} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
