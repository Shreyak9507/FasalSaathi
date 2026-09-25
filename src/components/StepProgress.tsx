'use client';

import React from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function StepProgress({ currentStep, totalSteps, labels }: StepProgressProps) {
  return (
    <div
      className="w-full px-4 py-3"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    >
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <React.Fragment key={i}>
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                i < currentStep
                  ? 'bg-green-600'
                  : i === currentStep
                  ? 'bg-green-600 ring-4 ring-green-100'
                  : 'bg-gray-200'
              }`}
            />
            {i < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 transition-all duration-300 ${
                  i < currentStep ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Labels */}
      {labels && labels.length > 0 && (
        <div className="flex justify-between mt-2">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`text-xs text-center transition-colors ${
                i <= currentStep ? 'text-green-700 font-medium' : 'text-gray-400'
              }`}
              style={{ width: `${100 / totalSteps}%` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
