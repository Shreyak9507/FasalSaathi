'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useJourney } from '@/lib/store';
import { fetchNearbySoilTestingLabs } from '@/services/soilTestingLabs';
import { OfficialSoilLab } from '@/types';
import {
  INDIAN_STATES,
  STATE_DISTRICTS,
  getTalukasForDistrict,
  getVillagesForTaluka,
  getTalukaCoordinates,
  getCurrentGpsPosition,
} from '@/services/location';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OpenStreetMap from '@/components/OpenStreetMap';
import FloatingNav from '@/components/FloatingNav';

export default function NoCardPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { location, setLocation, farmer } = useJourney();

  // Location Hierarchy State
  const [selectedState, setSelectedState] = useState<string>(location?.state || 'Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(location?.district || 'Pune');
  const [selectedTaluka, setSelectedTaluka] = useState<string>(location?.taluka || 'Khed');
  const [selectedVillage, setSelectedVillage] = useState<string>(location?.village || '');
  const [currentLat, setCurrentLat] = useState<number>(location?.lat || 18.8550);
  const [currentLng, setCurrentLng] = useState<number>(location?.lng || 73.9160);
  const [locationSource, setLocationSource] = useState<'gps' | 'manual'>(location?.source === 'gps' ? 'gps' : 'manual');

  // Display / Flow State
  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(!location);
  const [showManualForm, setShowManualForm] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync if location changes in store
  useEffect(() => {
    if (location) {
      if (location.state) setSelectedState(location.state);
      if (location.district) setSelectedDistrict(location.district);
      if (location.taluka) setSelectedTaluka(location.taluka);
      if (location.village) setSelectedVillage(location.village);
      setCurrentLat(location.lat);
      setCurrentLng(location.lng);
      setLocationSource(location.source === 'gps' ? 'gps' : 'manual');
      setIsEditingLocation(false);
    }
  }, [location]);

  const districtsForState = useMemo(() => {
    return STATE_DISTRICTS[selectedState] || STATE_DISTRICTS['Maharashtra'] || [];
  }, [selectedState]);

  const talukasForDistrict = useMemo(() => {
    return getTalukasForDistrict(selectedDistrict);
  }, [selectedDistrict]);

  const villagesForTaluka = useMemo(() => {
    return getVillagesForTaluka(selectedDistrict, selectedTaluka);
  }, [selectedDistrict, selectedTaluka]);

  // Official Government Soil Health Card Testing Laboratories State
  const [labs, setLabs] = useState<OfficialSoilLab[]>([]);
  const [isLoadingLabs, setIsLoadingLabs] = useState<boolean>(true);
  const [labsError, setLabsError] = useState<string | null>(null);

  // Fetch official soil testing labs whenever location changes
  useEffect(() => {
    let isCancelled = false;
    async function loadLabs() {
      setIsLoadingLabs(true);
      setLabsError(null);
      try {
        const resp = await fetchNearbySoilTestingLabs({
          state: selectedState,
          district: selectedDistrict,
          taluka: selectedTaluka,
          lat: currentLat,
          lng: currentLng,
        });
        if (!isCancelled) {
          if (resp.success) {
            setLabs(resp.labs || []);
          } else {
            setLabs([]);
            setLabsError(resp.error || t('noCard', 'labsUnavailable'));
          }
        }
      } catch {
        if (!isCancelled) {
          setLabs([]);
          setLabsError(t('noCard', 'labsUnavailable'));
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingLabs(false);
        }
      }
    }

    loadLabs();
    return () => {
      isCancelled = true;
    };
  }, [selectedState, selectedDistrict, selectedTaluka, currentLat, currentLng, t]);

  // Choice A: Use My Current Location (GPS)
  const handleUseMyLocation = async () => {
    setErrorMsg(null);
    setIsDetecting(true);

    try {
      const loc = await getCurrentGpsPosition();
      setCurrentLat(loc.lat);
      setCurrentLng(loc.lng);
      setSelectedState(loc.state || 'Maharashtra');
      setSelectedDistrict(loc.district || 'Pune');
      setSelectedTaluka(loc.taluka || 'Khed');
      setSelectedVillage(loc.village || '');
      setLocationSource('gps');

      // Persist to unified store
      setLocation({
        ...loc,
        source: 'gps',
      });

      setIsEditingLocation(false);
      setShowManualForm(false);
    } catch {
      setErrorMsg(t('location', 'denied'));
      setShowManualForm(true);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const newDists = STATE_DISTRICTS[newState] || [];
    if (newDists.length > 0) {
      const firstDist = newDists[0];
      setSelectedDistrict(firstDist.name);
      const newTalukas = getTalukasForDistrict(firstDist.name);
      if (newTalukas.length > 0) {
        setSelectedTaluka(newTalukas[0]);
        const coords = getTalukaCoordinates(firstDist.name, newTalukas[0]);
        setCurrentLat(coords.lat);
        setCurrentLng(coords.lng);
        const newVillages = getVillagesForTaluka(firstDist.name, newTalukas[0]);
        setSelectedVillage(newVillages.length > 0 ? newVillages[0] : '');
      } else {
        setCurrentLat(firstDist.lat);
        setCurrentLng(firstDist.lng);
      }
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDist = e.target.value;
    setSelectedDistrict(newDist);
    const newTalukas = getTalukasForDistrict(newDist);
    if (newTalukas.length > 0) {
      setSelectedTaluka(newTalukas[0]);
      const coords = getTalukaCoordinates(newDist, newTalukas[0]);
      setCurrentLat(coords.lat);
      setCurrentLng(coords.lng);
      const newVillages = getVillagesForTaluka(newDist, newTalukas[0]);
      setSelectedVillage(newVillages.length > 0 ? newVillages[0] : '');
    } else {
      const distData = districtsForState.find(d => d.name === newDist);
      if (distData) {
        setCurrentLat(distData.lat);
        setCurrentLng(distData.lng);
      }
    }
  };

  const handleTalukaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTaluka = e.target.value;
    setSelectedTaluka(newTaluka);
    const coords = getTalukaCoordinates(selectedDistrict, newTaluka);
    setCurrentLat(coords.lat);
    setCurrentLng(coords.lng);
    const newVillages = getVillagesForTaluka(selectedDistrict, newTaluka);
    setSelectedVillage(newVillages.length > 0 ? newVillages[0] : '');
  };

  const handleSaveManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const primaryName = selectedVillage && selectedVillage !== selectedTaluka ? selectedVillage : selectedTaluka;
    const display = `${primaryName}, ${selectedDistrict}, ${selectedState}`;

    // Persist to unified store
    setLocation({
      lat: currentLat,
      lng: currentLng,
      display,
      name: primaryName,
      village: selectedVillage || selectedTaluka,
      taluka: selectedTaluka,
      district: selectedDistrict,
      state: selectedState,
      source: 'manual',
    });

    setLocationSource('manual');
    setIsEditingLocation(false);
    setShowManualForm(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col pb-16">
      <div className="max-w-md mx-auto w-full px-4 pt-2">
        <FloatingNav backHref="/soil-upload" />

        <div className="mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 text-2xl mb-2.5 shadow-xs">
            🧪
          </div>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            {t('noCard', 'title')}
          </h1>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {t('noCard', 'subtitle')}
          </p>
        </div>

        {/* Friendly Note on Laboratory Testing vs FasalSaathi */}
        <div className="mb-4 p-3.5 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl text-emerald-950 text-xs flex items-start gap-2.5 shadow-2xs">
          <span className="text-base flex-shrink-0">🌱</span>
          <p className="leading-snug">
            {t('noCard', 'officialDisclaimer')}
          </p>
        </div>

        {/* SECTION 1: LOCATION SELECTION / CONFIRMATION */}
        {isEditingLocation ? (
          <div className="mb-6 space-y-3.5">
            {errorMsg && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-start gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {!showManualForm ? (
              <div className="space-y-3">
                {/* Choice A: GPS */}
                <div className="bg-white border-2 border-green-300/80 rounded-2xl p-4 shadow-xs text-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-800 text-xl flex items-center justify-center mx-auto mb-2">
                    📍
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">
                    {t('location', 'useMyLocation')}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {t('location', 'gpsDesc')}
                  </p>
                  <Button
                    onClick={handleUseMyLocation}
                    disabled={isDetecting}
                    className="w-full py-3 text-xs font-bold"
                    size="md"
                  >
                    {isDetecting ? t('location', 'detecting') : `📍 ${t('location', 'useMyLocation')}`}
                  </Button>
                </div>

                {/* Choice B: Manual */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-xl flex items-center justify-center mx-auto mb-2">
                    📋
                  </div>
                  <h3 className="text-sm font-black text-gray-900 mb-1">
                    {t('location', 'enterManually')}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {t('location', 'manualDesc')}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowManualForm(true)}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-xs font-bold transition-all shadow-2xs"
                  >
                    📋 {t('location', 'enterManually')}
                  </button>
                </div>
              </div>
            ) : (
              <Card className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    {t('location', 'enterManually')}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (location) setIsEditingLocation(false);
                      setShowManualForm(false);
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 font-semibold"
                  >
                    {t('noCard', 'closeFilter')}
                  </button>
                </div>

                <form onSubmit={handleSaveManualLocation} className="space-y-3.5">
                  {/* State */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t('location', 'step1State')}
                    </label>
                    <select
                      value={selectedState}
                      onChange={handleStateChange}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t('location', 'step2District')}
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none"
                    >
                      {districtsForState.map((d) => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Taluka */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t('location', 'step3Taluka')}
                    </label>
                    <select
                      value={selectedTaluka}
                      onChange={handleTalukaChange}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none"
                    >
                      {talukasForDistrict.map((taluka) => (
                        <option key={taluka} value={taluka}>{taluka}</option>
                      ))}
                    </select>
                  </div>

                  {/* Optional Village */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {t('location', 'step4Village')}
                    </label>
                    {villagesForTaluka.length > 0 && (
                      <select
                        value={selectedVillage}
                        onChange={(e) => setSelectedVillage(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-900 focus:bg-white focus:outline-none mb-1.5"
                      >
                        <option value="">-- {t('location', 'villageOptional')} --</option>
                        {villagesForTaluka.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      placeholder={t('location', 'villagePlaceholder')}
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-800 focus:outline-none"
                    />
                  </div>

                  <Button type="submit" size="md" className="w-full font-bold pt-2">
                    {t('location', 'saveLocation')} →
                  </Button>
                </form>
              </Card>
            )}
          </div>
        ) : (
          /* Visual Map & Current Confirmed Location Card */
          <div className="mb-5 rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-white relative animate-fadeIn">
            <OpenStreetMap lat={currentLat} lng={currentLng} className="h-36" />

            <div className="p-3.5 bg-white flex items-center justify-between border-t border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">
                  {t('location', 'yourLocation')}
                </span>
                <h3 className="text-base font-black text-gray-900 leading-tight">
                  {selectedTaluka}, {selectedDistrict}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {selectedState}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditingLocation(true);
                  setShowManualForm(true);
                }}
                className="py-1.5 px-3 text-xs font-bold text-gray-700 hover:text-green-800 bg-gray-50 border border-gray-200 rounded-xl hover:border-green-300 transition-colors shadow-2xs"
              >
                ✎ {t('location', 'changeLocation')}
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: LIST OF TESTING CENTRES (OFFICIAL GOVERNMENT PORTAL DATA) */}
        <div className="mb-6">
          <div className="mb-3">
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">
              {t('noCard', 'nearbyCentresHeader') || 'NEARBY SOIL TESTING CENTRES'}
            </span>
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-1.5 mt-0.5">
              <span>📍</span>
              <span>{selectedDistrict} {t('noCard', 'centresInArea')}</span>
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {t('noCard', 'centresSubtitle')}
            </p>
          </div>

          {/* Loading State */}
          {isLoadingLabs && (
            <div className="py-8 bg-white border border-gray-200/90 rounded-2xl p-6 text-center space-y-2 shadow-xs">
              <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-800">
                {t('noCard', 'findingCentres')}
              </p>
            </div>
          )}

          {/* Error State */}
          {!isLoadingLabs && labsError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left space-y-2 shadow-xs">
              <p className="text-xs font-bold text-amber-900">
                ⚠️ {labsError}
              </p>
              <a
                href="https://soilhealth.dac.gov.in/soilTestingLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-green-800 underline underline-offset-2"
              >
                <span>{t('noCard', 'viewOfficialPortal')}</span> ↗
              </a>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingLabs && !labsError && labs.length === 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-2">
              <p className="text-xs font-bold text-gray-800">
                {t('noCard', 'noNearbyInArea')}
              </p>
              <a
                href="https://soilhealth.dac.gov.in/soilTestingLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-green-700 underline"
              >
                {t('noCard', 'viewOfficialPortal')} ↗
              </a>
            </div>
          )}

          {/* Real Official Laboratories List */}
          {!isLoadingLabs && !labsError && labs.length > 0 && (
            <div className="space-y-3">
              {labs.slice(0, 6).map((lab) => {
                const hasCoords = lab.lat !== null && lab.lng !== null;
                const directionsUrl = hasCoords
                  ? `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${currentLat},${currentLng};${lab.lat},${lab.lng}`
                  : `https://www.openstreetmap.org/search?query=${encodeURIComponent(lab.name + ', ' + selectedDistrict + ', ' + selectedState)}`;

                return (
                  <div
                    key={lab.id}
                    className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-xs hover:border-green-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-bold text-gray-900 leading-snug">
                        {lab.name}
                      </h3>
                      {lab.distanceKm !== null && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-800 border border-green-200 flex-shrink-0">
                          📍 ~{lab.distanceKm} {t('noCard', 'kmAway')}
                        </span>
                      )}
                    </div>

                    <div className="mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                        {lab.type}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      📍 {lab.address}
                    </p>

                    {/* Primary Action Buttons: Call & Directions */}
                    <div className={`grid ${lab.phone ? 'grid-cols-2' : 'grid-cols-1'} gap-2 pt-1`}>
                      {lab.phone && (
                        <a
                          href={`tel:${lab.phone.replace(/[^0-9+]/g, '')}`}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs text-center"
                        >
                          <span>📞</span>
                          <span>{t('noCard', 'callCentre')}</span>
                        </a>
                      )}

                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-800 rounded-xl text-xs font-bold transition-all shadow-2xs text-center"
                      >
                        <span>📍</span>
                        <span>{t('noCard', 'getDirections')}</span>
                      </a>
                    </div>
                  </div>
                );
              })}

              {/* Official Source Note & Portal Link */}
              <div className="mt-3.5 p-3 bg-gray-50 border border-gray-200/80 rounded-xl text-[11px] text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span>🏛️ {t('noCard', 'sourcedFromPortal')}</span>
                <a
                  href="https://soilhealth.dac.gov.in/soilTestingLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-900 font-bold underline whitespace-nowrap"
                >
                  {t('noCard', 'viewOfficialPortal')} ↗
                </a>
              </div>
            </div>
          )}

          {/* Useful guidance on what to ask */}
          <div className="mt-3.5 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
            <h4 className="text-xs font-bold text-blue-950 mb-1.5 flex items-center gap-1">
              <span>💡</span>
              <span>{t('noCard', 'questionsTitle')}</span>
            </h4>
            <ul className="text-[11px] text-blue-900 space-y-1 pl-4 list-disc">
              <li>{t('noCard', 'q1')}</li>
              <li>{t('noCard', 'q2')}</li>
              <li>{t('noCard', 'q3')}</li>
              <li>{t('noCard', 'q4')}</li>
            </ul>
          </div>
        </div>

        {/* SECTION 3: 4-STEP PROCESS TO GET TESTED */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <span>📋</span>
            <span>{t('noCard', 'stepsTitle')}</span>
          </h2>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-3.5 bg-white border border-gray-200/90 rounded-2xl shadow-xs flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-green-100 text-green-900 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {t('noCard', 'stepNum1')}
              </span>
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">
                  {t('noCard', 'step1Title')}
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {t('noCard', 'step1Desc')}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-white border border-gray-200/90 rounded-2xl shadow-xs flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-green-100 text-green-900 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {t('noCard', 'stepNum2')}
              </span>
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">
                  {t('noCard', 'step2Title')}
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {t('noCard', 'step2Desc')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-white border border-gray-200/90 rounded-2xl shadow-xs flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-green-100 text-green-900 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {t('noCard', 'stepNum3')}
              </span>
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">
                  {t('noCard', 'step3Title')}
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {t('noCard', 'step3Desc')}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 bg-white border border-gray-200/90 rounded-2xl shadow-xs flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-green-100 text-green-900 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {t('noCard', 'stepNum4')}
              </span>
              <div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">
                  {t('noCard', 'step4Title')}
                </h3>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {t('noCard', 'step4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: GOVERNMENT SOIL HEALTH INFORMATION */}
        <div className="mb-6 p-4 bg-gradient-to-br from-green-50/70 to-emerald-50/40 border border-green-200 rounded-2xl shadow-xs">
          <h2 className="text-xs font-bold text-green-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>🇮🇳</span>
            <span>{t('noCard', 'govtTitle')}</span>
          </h2>

          <div className="space-y-1.5 text-xs text-gray-700 mb-4 leading-relaxed">
            <p>{t('noCard', 'govtStep1')}</p>
            <p>{t('noCard', 'govtStep2')}</p>
            <p>{t('noCard', 'govtStep3')}</p>
            <p>{t('noCard', 'govtStep4')}</p>
            <p>{t('noCard', 'govtStep5')}</p>
          </div>

          <a
            href="https://soilhealth.dac.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span>🌐</span>
            <span>{t('noCard', 'govtButton')} ↗</span>
          </a>
        </div>

        {/* Return to Upload Button */}
        <div className="pt-2">
          <Button
            variant="secondary"
            onClick={() => router.push('/soil-upload')}
            className="w-full py-3.5 text-xs font-bold"
          >
            ← {t('noCard', 'returnToUpload')}
          </Button>
        </div>
      </div>
    </div>
  );
}
