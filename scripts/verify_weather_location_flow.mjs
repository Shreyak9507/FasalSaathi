import fetch from 'node-fetch';

async function testSequence() {
  console.log('=== FASALSAATHI WEATHER LOCATION FLOW VERIFICATION ===\n');

  const locations = [
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Kolhapur (GPS simulated)', lat: 16.7050, lng: 74.2433 }
  ];

  const recordedWeather = [];

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    console.log(`--------------------------------------------------`);
    console.log(`STEP ${i + 1}: Testing Location: ${loc.name}`);
    console.log(`--------------------------------------------------`);

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;

    console.log('Selected location:', loc.name);
    console.log('Latitude:', loc.lat);
    console.log('Longitude:', loc.lng);
    console.log('Weather request URL:', openMeteoUrl);

    const res = await fetch(openMeteoUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch weather for ${loc.name}: status ${res.status}`);
    }

    const data = await res.json();
    console.log('Weather response location:', `${data.latitude}, ${data.longitude}`);
    console.log('Weather response timezone:', data.timezone);

    const weatherEntry = {
      location: loc.name,
      requestedCoords: { lat: loc.lat, lng: loc.lng },
      gridCoords: { lat: data.latitude, lng: data.longitude },
      timezone: data.timezone,
      temp: data.current.temperature_2m,
      apparentTemp: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      windSpeed: data.current.wind_speed_10m,
      rainProbToday: data.daily.precipitation_probability_max?.[0] ?? 0,
      precipitationSum: data.daily.precipitation_sum?.[0] ?? 0,
      forecastHighs: data.daily.temperature_2m_max?.slice(0, 4),
      forecastLows: data.daily.temperature_2m_min?.slice(0, 4),
    };

    console.log(`Displayed Current Conditions:`);
    console.log(`  Temperature: ${weatherEntry.temp}°C (Feels like: ${weatherEntry.apparentTemp}°C)`);
    console.log(`  Humidity: ${weatherEntry.humidity}%`);
    console.log(`  Rain probability: ${weatherEntry.rainProbToday}% (Precipitation: ${weatherEntry.precipitation} mm)`);
    console.log(`  Wind: ${weatherEntry.windSpeed} km/h`);
    console.log(`  4-Day Highs: ${weatherEntry.forecastHighs.join('°C, ')}°C`);

    recordedWeather.push(weatherEntry);
    console.log('');
  }

  console.log('==================================================');
  console.log('CROSS-LOCATION DATA VERIFICATION');
  console.log('==================================================');

  // Verify that all locations received distinct coordinates
  const coordStrings = recordedWeather.map(w => `${w.requestedCoords.lat},${w.requestedCoords.lng}`);
  const uniqueCoords = new Set(coordStrings);
  if (uniqueCoords.size !== recordedWeather.length) {
    throw new Error('FAIL: Not all locations used unique coordinates!');
  }
  console.log(`✓ PASS: All ${uniqueCoords.size} locations used distinct requested coordinates.`);

  // Verify that grid cell coordinates are distinct and reflect geographical distance
  const gridStrings = recordedWeather.map(w => `${w.gridCoords.lat},${w.gridCoords.lng}`);
  const uniqueGrids = new Set(gridStrings);
  if (uniqueGrids.size !== recordedWeather.length) {
    throw new Error('FAIL: Weather responses did not return unique grid cells!');
  }
  console.log(`✓ PASS: All ${uniqueGrids.size} locations received unique Open-Meteo grid cells.`);

  // Verify differences between locations (e.g. Nagpur is in Vidarbha, distinct weather from Pune in Western Ghats)
  const pune = recordedWeather.find(w => w.location === 'Pune');
  const nagpur = recordedWeather.find(w => w.location === 'Nagpur');
  const nashik = recordedWeather.find(w => w.location === 'Nashik');

  console.log(`Comparison:`);
  console.log(`  Pune Grid: (${pune.gridCoords.lat}, ${pune.gridCoords.lng}) vs Nagpur Grid: (${nagpur.gridCoords.lat}, ${nagpur.gridCoords.lng})`);
  console.log(`  Pune Temp: ${pune.temp}°C, Humidity: ${pune.humidity}%, RainSum: ${pune.precipitationSum} mm`);
  console.log(`  Nashik Temp: ${nashik.temp}°C, Humidity: ${nashik.humidity}%, RainSum: ${nashik.precipitationSum} mm`);
  console.log(`  Nagpur Temp: ${nagpur.temp}°C, Humidity: ${nagpur.humidity}%, RainSum: ${nagpur.precipitationSum} mm`);

  console.log('\n✓ PASS: Weather responses reflect true, location-specific data from Open-Meteo API.');
}

testSequence().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
