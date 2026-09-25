import { WeatherInfo } from '@/types';

export async function fetchWeatherService(lat: number, lng: number, locationName?: string): Promise<WeatherInfo> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const locParam = locationName ? `&location=${encodeURIComponent(locationName)}` : '';
    const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}${locParam}`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error('Weather information is temporarily unavailable.');
    }

    const data = await res.json();
    if (!data || !data.success || typeof data.temp !== 'number') {
      throw new Error(data?.error || 'Weather information is temporarily unavailable.');
    }

    return {
      lat,
      lng,
      gridLat: data.gridLat,
      gridLng: data.gridLng,
      timezone: data.timezone,
      temp: Math.round(data.temp),
      feelsLike: Math.round(data.feelsLike ?? data.temp),
      humidity: Math.round(data.humidity ?? 60),
      rainProbability: Math.round(data.rainProbability ?? 20),
      windSpeed: Math.round(data.windSpeed ?? 10),
      description: data.description || 'Clear sky',
      icon: data.icon || '01d',
      forecast: Array.isArray(data.forecast) ? data.forecast : [],
      source: 'api',
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Weather service fetch failed:', error);
    throw new Error('Weather information is temporarily unavailable.');
  }
}

// Backward-compatible alias
export const fetchWeather = fetchWeatherService;
