'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { FarmerInfo, SoilInfo, LocationInfo, WeatherInfo, ForecastDay } from '@/types';

export type { FarmerInfo, SoilInfo, LocationInfo, WeatherInfo, ForecastDay };

export interface JourneyState {
  currentStep: number;
  farmer: FarmerInfo | null;
  soil: SoilInfo | null;
  location: LocationInfo | null;
  weather: WeatherInfo | null;
  isDemo: boolean;
}

export interface JourneyContextType {
  state: JourneyState;
  farmer: FarmerInfo | null;
  farm: FarmerInfo | null;
  soil: SoilInfo | null;
  soilData: SoilInfo | null;
  location: LocationInfo | null;
  farmLocation: LocationInfo | null;
  weather: WeatherInfo | null;
  isDemo: boolean;
  isLoaded: boolean;
  setStep: (step: number) => void;
  setFarmer: (farmer: any) => void;
  setSoil: (soil: SoilInfo) => void;
  setSoilData: (soil: SoilInfo) => void;
  setLocation: (location: LocationInfo) => void;
  setFarmLocation: (loc: any) => void;
  setWeather: (weather: WeatherInfo | null) => void;
  clearWeather: () => void;
  setIsDemo: (isDemo: boolean) => void;
  reset: () => void;
}

const initialState: JourneyState = {
  currentStep: 0,
  farmer: null,
  soil: null,
  location: null,
  weather: null,
  isDemo: false,
};

const JourneyContext = createContext<JourneyContextType>({
  state: initialState,
  farmer: null,
  farm: null,
  soil: null,
  soilData: null,
  location: null,
  farmLocation: null,
  weather: null,
  isDemo: false,
  isLoaded: false,
  setStep: () => {},
  setFarmer: () => {},
  setSoil: () => {},
  setSoilData: () => {},
  setLocation: () => {},
  setFarmLocation: () => {},
  setWeather: () => {},
  clearWeather: () => {},
  setIsDemo: () => {},
  reset: () => {},
});

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<JourneyState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount safely without race conditions
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fasalsaathi-journey');
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage only after initial load is completed
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('fasalsaathi-journey', JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state, isLoaded]);

  const setStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const setFarmer = useCallback((raw: any) => {
    // Normalise fields
    const normalizedIrrigation = String(raw?.irrigation || 'available').toLowerCase();
    const irrigation: 'available' | 'limited' | 'rainfed' = 
      normalizedIrrigation.includes('rain') ? 'rainfed' :
      normalizedIrrigation.includes('limit') ? 'limited' : 'available';

    const normalizedUnit: 'acre' | 'hectare' = 
      String(raw?.unit || raw?.landUnit || 'acre').toLowerCase().includes('hec') ? 'hectare' : 'acre';

    const farmer: FarmerInfo = {
      name: raw?.name || '',
      farmLocation: raw?.farmLocation || raw?.location || '',
      landArea: Number(raw?.landArea) || 0,
      unit: normalizedUnit,
      irrigation,
    };
    setState(prev => ({ ...prev, farmer }));
  }, []);

  const setSoil = useCallback((soil: SoilInfo) => {
    setState(prev => ({ ...prev, soil }));
  }, []);

  const setSoilData = useCallback((soil: SoilInfo) => {
    setState(prev => ({ ...prev, soil }));
  }, []);

  const setLocation = useCallback((loc: LocationInfo) => {
    const display = loc.display || loc.name || '';
    setState(prev => {
      const coordsChanged = !prev.location || prev.location.lat !== loc.lat || prev.location.lng !== loc.lng;
      const soilCardLocation = loc.soilCardLocation !== undefined ? loc.soilCardLocation : (prev.location?.soilCardLocation ?? null);
      return {
        ...prev,
        location: { ...loc, display, name: display, soilCardLocation },
        weather: coordsChanged ? null : prev.weather,
      };
    });
  }, []);

  const setFarmLocation = useCallback((loc: any) => {
    const display = loc?.display || loc?.name || `${loc?.lat || 0}, ${loc?.lng || 0}`;
    const lat = Number(loc?.lat) || 0;
    const lng = Number(loc?.lng) || 0;
    const locationInfo: LocationInfo = {
      lat,
      lng,
      display,
      name: display,
      source: loc?.source || 'manual',
    };
    setState(prev => {
      const coordsChanged = !prev.location || prev.location.lat !== lat || prev.location.lng !== lng;
      return {
        ...prev,
        location: locationInfo,
        weather: coordsChanged ? null : prev.weather,
      };
    });
  }, []);

  const setWeather = useCallback((weather: WeatherInfo | null) => {
    setState(prev => ({ ...prev, weather }));
  }, []);

  const clearWeather = useCallback(() => {
    setState(prev => ({ ...prev, weather: null }));
  }, []);

  const setIsDemo = useCallback((isDemo: boolean) => {
    setState(prev => ({ ...prev, isDemo }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      localStorage.removeItem('fasalsaathi-journey');
    } catch {
      // ignore
    }
  }, []);

  const contextValue = useMemo<JourneyContextType>(() => ({
    state,
    farmer: state.farmer,
    farm: state.farmer,
    soil: state.soil,
    soilData: state.soil,
    location: state.location,
    farmLocation: state.location,
    weather: state.weather,
    isDemo: state.isDemo,
    isLoaded,
    setStep,
    setFarmer,
    setSoil,
    setSoilData,
    setLocation,
    setFarmLocation,
    setWeather,
    clearWeather,
    setIsDemo,
    reset,
  }), [state, isLoaded, setStep, setFarmer, setSoil, setSoilData, setLocation, setFarmLocation, setWeather, clearWeather, setIsDemo, reset]);

  return (
    <JourneyContext.Provider value={contextValue}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  return useContext(JourneyContext);
}
