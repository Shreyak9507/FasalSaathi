import { NextRequest, NextResponse } from 'next/server';

function mapWmoCode(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'Clear sky', icon: '01d' };
  if (code === 1) return { description: 'Mainly clear', icon: '02d' };
  if (code === 2) return { description: 'Partly cloudy', icon: '02d' };
  if (code === 3) return { description: 'Overcast', icon: '03d' };
  if (code === 45 || code === 48) return { description: 'Foggy conditions', icon: '50d' };
  if (code >= 51 && code <= 55) return { description: 'Light drizzle', icon: '09d' };
  if (code >= 61 && code <= 65) return { description: 'Rain showers', icon: '10d' };
  if (code >= 71 && code <= 77) return { description: 'Snow / Hail', icon: '13d' };
  if (code >= 80 && code <= 82) return { description: 'Heavy rain showers', icon: '09d' };
  if (code >= 95) return { description: 'Thunderstorm with rain', icon: '11d' };
  return { description: 'Partly cloudy', icon: '02d' };
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const locationName = searchParams.get('location') || searchParams.get('name') || '';

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { success: false, error: 'Latitude and longitude coordinates are required.' },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { success: false, error: 'Invalid coordinates provided.' },
      { status: 400 }
    );
  }

  // Pure Open-Meteo Weather API query based strictly on dynamic coordinates
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Open-Meteo API returned status ${res.status}`);
    }

    const data = await res.json();

    // Temporary development logging requested to verify requests across locations
    console.log('Selected location:', locationName || `${lat}, ${lng}`);
    console.log('Latitude:', lat);
    console.log('Longitude:', lng);
    console.log('Weather request URL:', url);
    console.log('Weather response location:', `${data.latitude}, ${data.longitude}`);
    console.log('Weather response timezone:', data.timezone);

    const current = data.current || {};
    const daily = data.daily || {};

    const codeInfo = mapWmoCode(current.weather_code ?? 0);
    const rainProb = Array.isArray(daily.precipitation_probability_max) && daily.precipitation_probability_max.length > 0
      ? daily.precipitation_probability_max[0]
      : (current.precipitation > 0 ? 80 : 15);

    const dayLabels = ['Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
    const forecast = (daily.time || []).slice(1, 5).map((dateStr: string, idx: number) => {
      const code = daily.weather_code?.[idx + 1] ?? 0;
      const wInfo = mapWmoCode(code);
      return {
        day: dayLabels[idx] || `Day ${idx + 2}`,
        high: Math.round(daily.temperature_2m_max?.[idx + 1] ?? current.temperature_2m ?? 28),
        low: Math.round(daily.temperature_2m_min?.[idx + 1] ?? 21),
        rain: Math.round(daily.precipitation_probability_max?.[idx + 1] ?? 0),
        precipitationMm: daily.precipitation_sum?.[idx + 1] ?? 0,
        icon: wInfo.icon,
        description: wInfo.description,
      };
    });

    return NextResponse.json({
      success: true,
      lat,
      lng,
      gridLat: data.latitude,
      gridLng: data.longitude,
      timezone: data.timezone,
      temp: Math.round(current.temperature_2m ?? 28),
      feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 28),
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      rainProbability: Math.round(rainProb),
      precipitationMm: current.precipitation ?? 0,
      windSpeed: Math.round(current.wind_speed_10m ?? 12),
      description: codeInfo.description,
      icon: codeInfo.icon,
      forecast,
      source: 'api',
    });
  } catch (err: any) {
    console.error('Open-Meteo weather fetch failed:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Weather information is temporarily unavailable.',
      },
      { status: 503 }
    );
  }
}
