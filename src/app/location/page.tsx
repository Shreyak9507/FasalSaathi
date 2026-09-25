'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import {
  getCurrentGpsPosition,
  searchLocationOpenMeteo,
  LocationSearchResult,
  STATE_DISTRICTS,
  INDIAN_STATES,
  getTalukasForDistrict,
  getVillagesForTaluka,
  getTalukaCoordinates,
} from '@/services/location';
import { FarmLocationSource } from '@/types';
import OpenStreetMap from '@/components/OpenStreetMap';
import StepProgress from '@/components/StepProgress';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FloatingNav from '@/components/FloatingNav';

export default function LocationPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { location, setLocation, clearWeather } = useJourney();

  const soilCard = location?.soilCardLocation;
  const hasValidCard = Boolean(soilCard && soilCard.isValid && soilCard.lat && soilCard.lng);

  // Active Location Coordinates & Details
  const [activeSource, setActiveSource] = useState<FarmLocationSource>(() => {
    if (location?.source) return location.source;
    return hasValidCard ? 'soil_report' : 'manual';
  });

  const [activeLat, setActiveLat] = useState<number>(() => {
    if (location?.lat) return location.lat;
    if (hasValidCard && soilCard?.lat) return soilCard.lat;
    return 18.5204;
  });

  const [activeLng, setActiveLng] = useState<number>(() => {
    if (location?.lng) return location.lng;
    if (hasValidCard && soilCard?.lng) return soilCard.lng;
    return 73.8567;
  });

  const [activeName, setActiveName] = useState<string>(() => {
    if (location?.name) return location.name;
    if (hasValidCard && soilCard) return soilCard.village || soilCard.taluka || 'Farm Location';
    return 'Pune';
  });

  const [activeTaluka, setActiveTaluka] = useState<string>(() => {
    if (location?.taluka) return location.taluka;
    if (hasValidCard && soilCard?.taluka) return soilCard.taluka;
    return 'Haveli';
  });

  const [activeDistrict, setActiveDistrict] = useState<string>(() => {
    if (location?.district) return location.district;
    if (hasValidCard && soilCard?.district) return soilCard.district;
    return 'Pune';
  });

  const [activeState, setActiveState] = useState<string>(() => {
    if (location?.state) return location.state;
    if (hasValidCard && soilCard?.state) return soilCard.state;
    return 'Maharashtra';
  });

  const [activeVillage, setActiveVillage] = useState<string>(() => {
    if (location?.village) return location.village;
    if (hasValidCard && soilCard?.village) return soilCard.village;
    return '';
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // GPS State
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState(false);

  // Admin Cascading Dropdown State (Manual Fallback)
  const [showAdminDropdowns, setShowAdminDropdowns] = useState(false);
  const [manualState, setManualState] = useState(activeState || 'Maharashtra');
  const [manualDistrict, setManualDistrict] = useState(activeDistrict || 'Pune');
  const [manualTaluka, setManualTaluka] = useState(activeTaluka || 'Haveli');
  const [manualVillage, setManualVillage] = useState(activeVillage || '');

  // Synchronize from store if location updates externally
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setActiveLat(location.lat);
      setActiveLng(location.lng);
      if (location.source) setActiveSource(location.source);
      if (location.name) setActiveName(location.name);
      if (location.taluka) setActiveTaluka(location.taluka);
      if (location.district) setActiveDistrict(location.district);
      if (location.state) setActiveState(location.state);
      if (location.village) setActiveVillage(location.village);
    }
  }, [location]);

  // Debounced Search using Open-Meteo
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocationOpenMeteo(trimmed);
        setSearchResults(results);
        setHasSearched(true);
      } catch (err) {
        console.error('Location search error:', err);
        setSearchResults([]);
        setHasSearched(true);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handler: Switch to Soil Card Location (Default Priority)
  const handleUseSoilCardLocation = () => {
    if (!hasValidCard || !soilCard) return;
    clearWeather();
    setActiveSource('soil_report');
    setActiveLat(soilCard.lat);
    setActiveLng(soilCard.lng);
    setActiveName(soilCard.village || soilCard.taluka || 'Farm Location');
    setActiveTaluka(soilCard.taluka || '');
    setActiveDistrict(soilCard.district || '');
    setActiveState(soilCard.state || '');
    setActiveVillage(soilCard.village || '');
  };

  // Handler: Switch to Phone GPS (Secondary Priority)
  const handleUseMyLocation = async () => {
    setGpsError(false);
    setIsDetectingGps(true);

    try {
      const loc = await getCurrentGpsPosition();
      clearWeather();
      setActiveSource('current_gps');
      setActiveLat(loc.lat);
      setActiveLng(loc.lng);
      setActiveName(loc.name || loc.village || 'Detected Phone Area');
      setActiveTaluka(loc.taluka || '');
      setActiveDistrict(loc.district || '');
      setActiveState(loc.state || '');
      setActiveVillage(loc.village || '');
    } catch {
      setGpsError(true);
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Handler: Select Search Result (Fallback Priority)
  const handleSelectSearchResult = (item: LocationSearchResult) => {
    clearWeather();
    setActiveSource('manual');
    setActiveLat(item.lat);
    setActiveLng(item.lng);
    setActiveName(item.name);
    setActiveTaluka(item.taluka || '');
    setActiveDistrict(item.district || '');
    setActiveState(item.state || '');
    setActiveVillage(item.village || '');
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handler: Save Cascading Administrative Dropdowns
  const handleManualAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    const coords = getTalukaCoordinates(manualDistrict, manualTaluka);
    const primaryName = manualVillage || manualTaluka || manualDistrict;
    clearWeather();
    setActiveSource('manual');
    setActiveLat(coords.lat);
    setActiveLng(coords.lng);
    setActiveName(primaryName);
    setActiveTaluka(manualTaluka);
    setActiveDistrict(manualDistrict);
    setActiveState(manualState);
    setActiveVillage(manualVillage);
    setShowAdminDropdowns(false);
  };

  // Handler: Confirm Location & Advance to Weather Screen
  const handleConfirmLocation = () => {
    const display = [activeName, activeTaluka, activeDistrict, activeState]
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');

    clearWeather();

    setLocation({
      lat: activeLat,
      lng: activeLng,
      display,
      name: activeName,
      village: activeVillage || activeName,
      taluka: activeTaluka,
      district: activeDistrict,
      state: activeState,
      source: activeSource,
      soilCardLocation: location?.soilCardLocation,
    });

    router.push('/weather');
  };

  const districtsForState = STATE_DISTRICTS[manualState] || [];
  const talukasForDistrict = getTalukasForDistrict(manualDistrict);
  const villagesForTaluka = getVillagesForTaluka(manualDistrict, manualTaluka);

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col pb-16">
      <div className="px-4 pt-2 pb-2 max-w-md mx-auto w-full">
        <FloatingNav backHref="/soil-freshness" />
        <StepProgress currentStep={2} totalSteps={4} />
      </div>

      <main className="flex-1 px-4 py-2 max-w-md mx-auto w-full flex flex-col space-y-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            {t('location', 'title')}
          </h1>
          <p className="text-gray-600 text-xs mt-1 leading-relaxed">
            {t('location', 'subtitle')}
          </p>
        </div>

        {/* Missing/Invalid Card Warning Banner */}
        {!hasValidCard && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-xs font-bold text-amber-900">
                {t('location', 'invalidCardLocation')}
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                {t('location', 'invalidCardLocationDesc')}
              </p>
            </div>
          </div>
        )}

        {/* Active Farm Location Preview & OpenStreetMap */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs">
          <OpenStreetMap lat={activeLat} lng={activeLng} className="h-44" />

          <div className="p-3.5 text-center">
            {/* Active Source Badge */}
            <div className="flex items-center justify-center mb-1.5">
              {activeSource === 'soil_report' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>🌾</span>
                  <span>{t('location', 'sourceSoilCard')}</span>
                </span>
              )}
              {activeSource === 'current_gps' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  <span>📱</span>
                  <span>{t('location', 'sourceGps')}</span>
                </span>
              )}
              {activeSource === 'manual' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span>📝</span>
                  <span>{t('location', 'sourceManual')}</span>
                </span>
              )}
            </div>

            <h2 className="text-lg font-black text-gray-900 leading-tight">
              📍 {activeName}
            </h2>

            {(activeTaluka || activeDistrict) && (
              <p className="text-xs font-bold text-gray-700 mt-0.5">
                {[activeTaluka, activeDistrict].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
              </p>
            )}

            {activeState && (
              <p className="text-[11px] text-gray-500 mt-0.5">
                {activeState}
              </p>
            )}
          </div>
        </div>

        {/* Priority 1: Soil Health Card Location (Default) */}
        {hasValidCard && soilCard && (
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              activeSource === 'soil_report'
                ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                  🌾 {t('location', 'farmLocationTitle')} (1)
                </span>
                <p className="text-xs font-bold text-gray-900 mt-0.5">
                  {t('location', 'farmLocationFromCard')}
                </p>
                <p className="text-sm font-black text-emerald-950 mt-1">
                  {soilCard.village || soilCard.taluka || 'Farm Location'}
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  {[soilCard.taluka, soilCard.district, soilCard.state].filter(Boolean).join(', ')}
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  ✓ {t('location', 'coordsDetectedFromCard')}
                </p>
              </div>

              {activeSource === 'soil_report' ? (
                <span className="shrink-0 px-2.5 py-1 bg-emerald-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs">
                  ✓ {t('location', 'activeFarmLocationBadge')}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleUseSoilCardLocation}
                  className="shrink-0 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  {t('location', 'useFarmLocation')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Priority 2: Current Phone Location (Secondary) */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            activeSource === 'current_gps'
              ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">
                📱 {t('location', 'useCurrentLocation')} (2)
              </span>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {t('location', 'currentLocationDesc')}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                ℹ️ {t('location', 'notAtFarmNote')}
              </p>
            </div>

            {activeSource === 'current_gps' && !isDetectingGps && (
              <span className="shrink-0 px-2 py-1 bg-blue-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs">
                ✓
              </span>
            )}
          </div>

          <div className="mt-2.5">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isDetectingGps}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              {isDetectingGps ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('location', 'detecting')}</span>
                </>
              ) : (
                <>
                  <span>📍</span>
                  <span>
                    {hasValidCard
                      ? t('location', 'useCurrentLocationInstead')
                      : t('location', 'useCurrentLocation')}
                  </span>
                </>
              )}
            </button>
          </div>

          {gpsError && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-left">
              <p className="text-[11px] font-bold text-amber-900">
                {t('location', 'gpsFailedTitle')}
              </p>
            </div>
          )}
        </div>

        {/* Priority 3: Search for Farm Location (Fallback) */}
        <div
          className={`p-3.5 rounded-2xl border transition-all ${
            activeSource === 'manual'
              ? 'bg-amber-50/50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
              : 'bg-white border-gray-200'
          }`}
        >
          <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block mb-1">
            🔍 {t('location', 'searchFarmLocation')} (3)
          </span>

          <div className="relative mt-1">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('location', 'searchPlaceholder')}
              className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-green-600 focus:ring-1 focus:ring-green-500/20 focus:outline-none transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setHasSearched(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 text-xs"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                🔎
              </span>
            )}
          </div>

          {/* Searching Indicator */}
          {isSearching && (
            <div className="flex items-center gap-2 py-2 px-1 text-xs text-gray-500">
              <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <span>{t('location', 'searching')}</span>
            </div>
          )}

          {/* Search Results List */}
          {searchResults.length > 0 && (
            <div className="mt-2 divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden bg-white shadow-xs max-h-48 overflow-y-auto">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full text-left p-2.5 hover:bg-green-50/70 active:bg-green-100 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-900 group-hover:text-green-900">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {item.secondary}
                    </p>
                  </div>
                  <span className="text-gray-400 group-hover:text-green-700 text-xs">
                    →
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search Not Found Banner */}
          {!isSearching && hasSearched && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-left">
              <p className="text-xs font-bold text-amber-900">
                {t('location', 'noResultsTitle')}
              </p>
              <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                {t('location', 'noResultsSuggest')}
              </p>
            </div>
          )}

          {/* Manual Cascading Administrative Dropdowns Toggle */}
          <div className="mt-3 pt-2 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => setShowAdminDropdowns(!showAdminDropdowns)}
              className="text-xs font-semibold text-gray-500 hover:text-green-800 underline underline-offset-4 transition-colors"
            >
              {showAdminDropdowns ? '✕ Close manual selection' : `📋 ${t('location', 'selectLocationManually')}`}
            </button>
          </div>

          {/* Manual Cascading Administrative Dropdown Form */}
          {showAdminDropdowns && (
            <form onSubmit={handleManualAdminSave} className="mt-3 space-y-3 bg-gray-50 p-3 rounded-xl border border-gray-200 animate-fadeIn text-left">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {t('location', 'step1State')}
                </label>
                <select
                  value={manualState}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setManualState(newState);
                    const newDists = STATE_DISTRICTS[newState] || [];
                    if (newDists.length > 0) {
                      setManualDistrict(newDists[0].name);
                      const newTalukas = getTalukasForDistrict(newDists[0].name);
                      setManualTaluka(newTalukas[0] || '');
                    }
                  }}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {t('location', 'step2District')}
                </label>
                <select
                  value={manualDistrict}
                  onChange={(e) => {
                    const newDist = e.target.value;
                    setManualDistrict(newDist);
                    const newTalukas = getTalukasForDistrict(newDist);
                    setManualTaluka(newTalukas[0] || '');
                  }}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  {districtsForState.map((d) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {t('location', 'step3Taluka')}
                </label>
                <select
                  value={manualTaluka}
                  onChange={(e) => setManualTaluka(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  {talukasForDistrict.map((tal) => (
                    <option key={tal} value={tal}>{tal}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {t('location', 'step4Village')}
                </label>
                {villagesForTaluka.length > 0 ? (
                  <select
                    value={manualVillage}
                    onChange={(e) => setManualVillage(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                  >
                    <option value="">-- {t('location', 'villageOptional')} --</option>
                    {villagesForTaluka.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={manualVillage}
                    onChange={(e) => setManualVillage(e.target.value)}
                    placeholder={t('location', 'villagePlaceholder')}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                ✓ {t('location', 'saveLocation')}
              </button>
            </form>
          )}
        </div>

        {/* Confirmation Button */}
        <div className="pt-2">
          <Button
            onClick={handleConfirmLocation}
            className="w-full py-3.5 text-sm font-bold shadow-md"
            size="lg"
          >
            ✓ {t('location', 'continue')}
          </Button>
        </div>
      </main>
    </div>
  );
}
