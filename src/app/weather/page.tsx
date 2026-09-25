'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import { fetchWeatherService } from '@/services/weather';
import { WeatherInfo } from '@/types';
import StepProgress from '@/components/StepProgress';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FloatingNav from '@/components/FloatingNav';

function getWeatherEmoji(rain: number): string {
  if (rain > 60) return '⛈️';
  if (rain > 30) return '🌧️';
  if (rain > 10) return '🌤️';
  return '☀️';
}

export default function WeatherScreen() {
  const { t, formatNumber, formatPercent } = useTranslation();
  const router = useRouter();
  const { weather, location, setWeather } = useJourney();

  const isMatchingLocation = Boolean(
    weather &&
    location?.lat != null &&
    location?.lng != null &&
    weather.lat === location.lat &&
    weather.lng === location.lng
  );

  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(isMatchingLocation ? weather : null);
  const [isLoading, setIsLoading] = useState(!isMatchingLocation);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setWeatherData(null); // Clear previous weather state immediately

    // Coordinate validation: must use confirmed location
    if (!location?.lat || !location?.lng) {
      setErrorMsg(t('weather', 'weatherUnavailable'));
      setIsLoading(false);
      return;
    }

    try {
      const locationName = location.name || location.village || location.taluka || location.district || location.display;
      const data = await fetchWeatherService(location.lat, location.lng, locationName);
      setWeatherData(data);
      setWeather(data);
    } catch {
      setWeatherData(null);
      setErrorMsg(t('weather', 'weatherUnavailable'));
    } finally {
      setIsLoading(false);
    }
  }, [location, setWeather, t]);

  useEffect(() => {
    // If no coordinates stored, redirect to location page
    if (!location?.lat || !location?.lng) {
      router.push('/location');
      return;
    }

    const matches = Boolean(
      weather &&
      weather.lat === location.lat &&
      weather.lng === location.lng
    );

    if (!matches) {
      loadWeather();
    } else {
      setWeatherData(weather);
      setIsLoading(false);
    }
  }, [weather, location, loadWeather, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-700 font-semibold text-sm">
            {t('location', 'updatingInformation') || t('weather', 'updatingWeather') || 'Updating information...'}
          </p>
        </div>
      </div>
    );
  }

  // Weather service failure state (no fake fallback)
  if (errorMsg && !weatherData) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mb-4">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {errorMsg}
        </h2>
        <p className="text-xs text-gray-600 mb-6 max-w-xs leading-relaxed">
          {t('weather', 'weatherNotice')}
        </p>
        <Button onClick={loadWeather} size="lg" className="w-full font-bold">
          🔄 {t('weather', 'retry')}
        </Button>
      </div>
    );
  }

  const current = weatherData;
  if (!current) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-700 font-semibold text-sm">
            {t('location', 'updatingInformation') || t('weather', 'updatingWeather') || 'Updating information...'}
          </p>
        </div>
      </div>
    );
  }

  // Simple rule-based agricultural interpretation (not called AI)
  const rainProb = current?.rainProbability ?? 0;
  const temp = current?.temp ?? 28;
  const humidity = current?.humidity ?? 65;

  let agriMessage = t('weather', 'rulePlanning');
  let agriIcon = '🌱';

  if (rainProb >= 40) {
    agriMessage = t('weather', 'ruleRain');
    agriIcon = '🌧️';
  } else if (temp >= 33 && humidity < 50) {
    agriMessage = t('weather', 'ruleHotDry');
    agriIcon = '☀️';
  }

  const locationTitle = location?.name
    ? `${location.name}${location.district ? `, ${location.district}` : ''}`
    : location?.display || '';

  // Determine source indicator label and style
  const getSourceBadge = () => {
    if (location?.source === 'soil_report') {
      return {
        label: t('location', 'sourceSoilCard') || 'Farm location from Soil Health Card',
        icon: '🌾',
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (location?.source === 'current_gps') {
      return {
        label: t('location', 'sourceGps') || 'Using your current location',
        icon: '📱',
        className: 'bg-blue-50 text-blue-800 border-blue-200',
      };
    }
    return {
      label: t('location', 'sourceManual') || 'Using manually selected farm location',
      icon: '📝',
      className: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  };

  const sourceBadge = getSourceBadge();

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col">
      <div className="px-4 pt-2 pb-2 max-w-md mx-auto w-full">
        <FloatingNav backHref="/location" />
        <StepProgress currentStep={3} totalSteps={4} />
      </div>

      <div className="flex-1 px-4 py-3 max-w-md mx-auto w-full pb-24">
        {/* Location & Title */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${sourceBadge.className}`}>
              <span>{sourceBadge.icon}</span>
              <span>{sourceBadge.label}</span>
            </span>
          </div>
          <p className="text-base font-black text-gray-900 flex items-center gap-1.5">
            <span>📍</span>
            <span>{locationTitle}</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('weather', 'weatherForFarm')}
          </p>
        </div>

        {/* Temperature Hero */}
        <div className="flex flex-col items-center py-6 mb-4 bg-white rounded-3xl border border-gray-200/80 shadow-xs">
          <span className="text-6xl font-black text-gray-900 tracking-tight">
            {formatNumber(current?.temp ?? 28)}°C
          </span>
          <span className="text-xs font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full mt-2 capitalize">
            {current?.description || 'Partly cloudy'}
          </span>
          <p className="text-gray-400 text-xs mt-1.5 font-medium">
            {t('weather', 'feelsLike')} {formatNumber(current?.feelsLike ?? current?.temp ?? 28)}°C
          </p>
        </div>

        {/* Weather Metrics */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {/* Humidity */}
          <Card className="flex flex-col items-center p-3 text-center bg-white border border-gray-200/80 shadow-xs rounded-2xl">
            <span className="text-2xl mb-1">💧</span>
            <span className="text-[11px] text-gray-500 font-medium leading-tight">
              {t('weather', 'humidity')}
            </span>
            <span className="font-extrabold text-gray-900 text-base mt-0.5">
              {formatPercent(current?.humidity ?? 65)}
            </span>
          </Card>

          {/* Rain chance */}
          <Card className="flex flex-col items-center p-3 text-center bg-white border border-gray-200/80 shadow-xs rounded-2xl">
            <span className="text-2xl mb-1">🌧️</span>
            <span className="text-[11px] text-gray-500 font-medium leading-tight">
              {t('weather', 'rainChance')}
            </span>
            <span className="font-extrabold text-gray-900 text-base mt-0.5">
              {formatPercent(current?.rainProbability ?? 20)}
            </span>
          </Card>

          {/* Wind */}
          <Card className="flex flex-col items-center p-3 text-center bg-white border border-gray-200/80 shadow-xs rounded-2xl">
            <span className="text-2xl mb-1">🌬️</span>
            <span className="text-[11px] text-gray-500 font-medium leading-tight">
              {t('weather', 'wind')}
            </span>
            <span className="font-extrabold text-gray-900 text-base mt-0.5">
              {formatNumber(current?.windSpeed ?? 12)} {t('weather', 'kmh')}
            </span>
          </Card>
        </div>

        {/* Short Upcoming Forecast */}
        {current?.forecast && current.forecast.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t('weather', 'nextFewDays')}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {current.forecast.slice(0, 4).map((day, idx) => (
                <div key={idx} className="flex flex-col items-center p-2.5 bg-white rounded-2xl border border-gray-200/80 shadow-xs text-center">
                  <span className="text-[11px] font-bold text-gray-600 truncate w-full">{day.day}</span>
                  <span className="text-xl my-1">{getWeatherEmoji(day.rain)}</span>
                  <span className="font-extrabold text-gray-900 text-xs">{formatNumber(day.high)}°</span>
                  <span className="text-[10px] text-gray-400">{formatNumber(day.low)}°</span>
                  <span className="text-[10px] font-bold text-blue-600 mt-0.5">💧{formatPercent(day.rain)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rule-Based Agricultural Interpretation */}
        <div className="mb-4 p-4 bg-white border border-green-200/90 rounded-2xl shadow-xs">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">{agriIcon}</span>
            <p className="text-xs text-gray-800 font-semibold leading-relaxed">
              {agriMessage}
            </p>
          </div>
        </div>

        {/* Transparency / Accuracy Note */}
        <p className="text-[11px] text-gray-400 text-center px-4 leading-relaxed">
          {t('weather', 'weatherNotice')}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-10">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={() => router.push('/recommendation')}
            className="w-full font-bold text-base py-3.5"
            size="lg"
          >
            {t('weather', 'continue')} →
          </Button>
        </div>
      </div>
    </div>
  );
}
