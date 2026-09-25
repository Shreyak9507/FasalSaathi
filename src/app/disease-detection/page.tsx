'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import FloatingNav from '@/components/FloatingNav';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useTranslation } from '@/lib/i18n';
import { compressImage } from '@/services/imageCompression';
import { DiseaseDetectionResult } from '@/types/disease';

export default function DiseaseDetectionPage() {
  const { t, language, formatPercent } = useTranslation();

  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setResult(null);

    try {
      const compressed = await compressImage(file, 1024, 0.85);
      setSelectedFile(compressed.blob);
      setPreviewUrl(compressed.previewUrl);
    } catch (err) {
      console.error('[DiseaseUI] Failed to process image:', err);
      // Fallback to uncompressed file
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile, 'leaf_photo.jpg');

      const response = await fetch(`/api/detect-disease?lang=${language || 'en'}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze crop');
      }

      setResult(data.result);
    } catch (err) {
      console.error('[DiseaseUI] Analysis error:', err);
      setErrorMessage(
        t('common', 'error') || 'Something went wrong while checking the image. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMessage(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col pb-16">
      {/* Persistent Nav */}
      <div className="max-w-md mx-auto w-full px-4 pt-2">
        <FloatingNav backHref="/" />

        {/* Header */}
        <div className="mb-4 text-center sm:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 text-2xl mb-2 shadow-xs">
            🌿
          </div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            Check Your Crop
          </h1>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Take a clear photo of a crop leaf to check for common diseases.
          </p>
        </div>

        {/* Supported crops info pill */}
        <div className="mb-4 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <span className="font-semibold flex items-center gap-1.5">
            <span>🌾</span> Supported Crops:
          </span>
          <span className="font-bold flex items-center gap-1">
            <span>🌽 Corn</span> • <span>🥔 Potato</span> • <span>🌾 Rice</span> • <span>🌾 Wheat</span>
          </span>
        </div>

        {/* ERROR BANNER */}
        {errorMessage && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <span className="text-base flex-shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-[11px] underline font-bold mt-1 text-amber-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id="camera-input"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
          id="gallery-input"
        />

        {/* STEP 1: PHOTO CAPTURE / UPLOAD (When no photo or want to change) */}
        {!previewUrl && (
          <Card className="p-6 bg-white border border-gray-200/80 rounded-3xl shadow-xs text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-green-50 border border-green-200/60 flex items-center justify-center text-4xl mb-4 shadow-inner">
              📸
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Capture or Upload Leaf Photo
            </h2>
            <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
              For best results, photograph a single leaf showing visible spots or markings in good natural light.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl text-xs font-black shadow-xs transition-all active:scale-95 touch-manipulation min-h-[54px]"
              >
                <span className="text-xl">📷</span>
                <span>Take Photo</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 bg-white border-2 border-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-black shadow-xs transition-all active:scale-95 touch-manipulation min-h-[54px]"
              >
                <span className="text-xl">🖼️</span>
                <span>Upload Photo</span>
              </button>
            </div>
          </Card>
        )}

        {/* STEP 2: PHOTO PREVIEW & TRIGGER ANALYSIS */}
        {previewUrl && !result && (
          <Card className="p-4 bg-white border border-gray-200/80 rounded-3xl shadow-xs mb-6 text-center">
            <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-gray-200 mb-4 bg-stone-100">
              <Image
                src={previewUrl}
                alt="Selected crop leaf"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover"
                unoptimized
              />
            </div>

            {isAnalyzing ? (
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm font-black text-gray-900">
                  Checking your crop...
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  AI Crop Health Analysis
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <Button
                  onClick={handleAnalyze}
                  className="w-full py-3.5 text-sm font-black shadow-sm"
                  size="lg"
                >
                  🔍 Analyze Crop Leaf
                </Button>

                <div className="flex justify-center gap-4 text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Retake Photo
                  </button>
                  <span className="text-gray-300">•</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    Choose Different Photo
                  </button>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* STEP 3: ANALYSIS RESULT */}
        {result && (
          <div className="space-y-4 animate-fadeIn">
            {/* Main Result Card */}
            <Card className="p-5 bg-white border border-gray-200/80 rounded-3xl shadow-xs overflow-hidden relative">
              {/* Badge for AI Engine without technical clutter */}
              <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>🌿</span> AI Crop Health Analysis
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Diagnosis
                </span>
              </div>

              {/* Photo Thumbnail + Crop & Condition */}
              <div className="flex items-center gap-3.5 mb-4">
                {previewUrl && (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0 bg-stone-100">
                    <Image
                      src={previewUrl}
                      alt="Analyzed leaf"
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span>{result.cropEmoji}</span>
                    <span>Crop: {result.crop}</span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 leading-snug truncate">
                    {result.condition}
                  </h3>
                </div>

                {/* Confidence Badge */}
                {!result.isInvalid && (
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-base font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-xl">
                      {formatPercent(result.confidence)}
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                      Confidence
                    </span>
                  </div>
                )}
              </div>

              {/* INVALID IMAGE STATE */}
              {result.isInvalid ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-950 text-xs mb-3">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <span>⚠️</span> We couldn&apos;t analyze this image.
                  </div>
                  <p className="leading-relaxed text-amber-900">
                    Please take a clear photo of a crop leaf from Corn, Potato, Rice, or Wheat.
                  </p>
                </div>
              ) : (
                <>
                  {/* LOW CONFIDENCE CAUTION NOTE */}
                  {result.lowConfidence && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 mb-3 flex items-start gap-2">
                      <span className="text-base flex-shrink-0">ℹ️</span>
                      <p className="leading-snug">
                        <strong>We&apos;re not fully sure about this result.</strong> Try taking another clear photo of the affected leaf in good lighting.
                      </p>
                    </div>
                  )}

                  {/* HEALTHY STATE */}
                  {result.isHealthy ? (
                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-emerald-950 text-xs mb-3 flex items-start gap-2.5">
                      <span className="text-2xl flex-shrink-0">🌿</span>
                      <div>
                        <p className="font-bold text-emerald-900 text-sm mb-0.5">
                          Your leaf appears healthy.
                        </p>
                        <p className="text-emerald-800 leading-snug">
                          {result.whatWeFound}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* DISEASE STATE */
                    <div className="mb-4">
                      {/* What We Found */}
                      <div className="mb-3.5">
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <span>🔍</span> What We Found
                        </h4>
                        <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-gray-800 leading-relaxed font-medium">
                          {result.whatWeFound}
                        </div>
                      </div>

                      {/* What You Can Do */}
                      {result.whatYouCanDo.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <span>🌱</span> What You Can Do
                          </h4>
                          <div className="space-y-1.5">
                            {result.whatYouCanDo.map((tip, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 p-2.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl text-xs text-emerald-950"
                              >
                                <span className="font-bold text-emerald-600 mt-0.5">•</span>
                                <span className="leading-snug">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Disclaimer */}
              <div className="pt-3 border-t border-gray-100 text-[10px] text-gray-500 leading-relaxed italic">
                ℹ️ {result.disclaimer}
              </div>
            </Card>

            {/* ACTION: Check another crop photo */}
            <div className="pt-2">
              <Button
                variant="secondary"
                onClick={handleReset}
                className="w-full py-3.5 text-xs font-bold"
              >
                📸 Check Another Leaf
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
