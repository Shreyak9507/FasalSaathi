import fetch from 'node-fetch';

async function testStateSimulation() {
  console.log('=== TESTING CLIENT STATE AND WEATHER FLOW SIMULATION ===\n');

  // Simulated Journey Store
  let state = {
    location: null,
    weather: null,
  };

  function setLocation(loc) {
    const coordsChanged = !state.location || state.location.lat !== loc.lat || state.location.lng !== loc.lng;
    state = {
      ...state,
      location: loc,
      weather: coordsChanged ? null : state.weather,
    };
  }

  function clearWeather() {
    state = { ...state, weather: null };
  }

  function setWeather(w) {
    state = { ...state, weather: w };
  }

  async function simulateWeatherScreenLoad(location) {
    // WeatherScreen logic
    const isMatchingLocation = Boolean(
      state.weather &&
      location?.lat != null &&
      location?.lng != null &&
      state.weather.lat === location.lat &&
      state.weather.lng === location.lng
    );

    let weatherData = isMatchingLocation ? state.weather : null;
    let isLoading = !isMatchingLocation;

    if (isLoading) {
      console.log(`[UI State] Displaying: "Updating weather..." for ${location.name}`);
      if (weatherData !== null) {
        throw new Error('FAIL: Stale weather was displayed while loading!');
      }

      // Fetch
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();

      const freshWeather = {
        lat: location.lat,
        lng: location.lng,
        gridLat: data.latitude,
        gridLng: data.longitude,
        timezone: data.timezone,
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: Math.round(data.current.relative_humidity_2m),
        rainProbability: data.daily.precipitation_probability_max?.[0] ?? 0,
        windSpeed: Math.round(data.current.wind_speed_10m),
      };

      weatherData = freshWeather;
      setWeather(freshWeather);
      isLoading = false;
    }

    console.log(`[UI State] Loaded weather for ${location.name}: Temp=${weatherData.temp}°C, Humidity=${weatherData.humidity}%, Rain=${weatherData.rainProbability}%, Coordinates=(${weatherData.lat}, ${weatherData.lng})`);
    return weatherData;
  }

  // 1. Search Pune -> Select Pune
  console.log('--- Step 1: Select Pune ---');
  const puneLoc = { name: 'Pune', lat: 18.5204, lng: 73.8567 };
  setLocation(puneLoc);
  const w1 = await simulateWeatherScreenLoad(state.location);

  // 2. Change location -> Select Nashik
  console.log('\n--- Step 2: Change Location -> Select Nashik ---');
  clearWeather();
  const nashikLoc = { name: 'Nashik', lat: 19.9975, lng: 73.7898 };
  setLocation(nashikLoc);
  const w2 = await simulateWeatherScreenLoad(state.location);

  if (w2.lat !== 19.9975 || w2.lng !== 73.7898) {
    throw new Error('FAIL: Weather did not use Nashik coordinates!');
  }

  // 3. Change location -> Select Nagpur
  console.log('\n--- Step 3: Change Location -> Select Nagpur ---');
  clearWeather();
  const nagpurLoc = { name: 'Nagpur', lat: 21.1458, lng: 79.0882 };
  setLocation(nagpurLoc);
  const w3 = await simulateWeatherScreenLoad(state.location);

  if (w3.lat !== 21.1458 || w3.lng !== 79.0882) {
    throw new Error('FAIL: Weather did not use Nagpur coordinates!');
  }

  // 4. Edge Case: Farmer changes location WITHOUT explicitly calling clearWeather (store automatic protection)
  console.log('\n--- Step 4: Edge Case: Location changed without explicit clearWeather ---');
  const kolhapurLoc = { name: 'Kolhapur', lat: 16.7050, lng: 74.2433 };
  setLocation(kolhapurLoc); // setLocation detects coordsChanged and clears weather
  if (state.weather !== null) {
    throw new Error('FAIL: setLocation did not clear weather on coordinate change!');
  }
  const w4 = await simulateWeatherScreenLoad(state.location);
  if (w4.lat !== 16.7050 || w4.lng !== 74.2433) {
    throw new Error('FAIL: Weather did not use Kolhapur coordinates!');
  }

  console.log('\n✓ ALL STATE TRANSITIONS & WEATHER FLOW CHECKS PASSED SUCCESSFULLY!');
}

testStateSimulation().catch(err => {
  console.error(err);
  process.exit(1);
});
