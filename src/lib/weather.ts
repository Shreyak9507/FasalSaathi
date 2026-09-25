import { fetchWeatherService } from '@/services/weather';
import { WeatherInfo } from '@/types';

export type WeatherResponse = WeatherInfo;

export async function fetchWeather(lat: number, lng: number, locationName?: string): Promise<WeatherInfo> {
  return fetchWeatherService(lat, lng, locationName);
}

export default fetchWeather;
