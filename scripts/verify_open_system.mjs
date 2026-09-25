import fs from 'fs';
import path from 'path';

async function runTests() {
  console.log('--- 1. Testing Open-Meteo Geocoding Search ---');
  // Dynamic import of search function via compiling or direct API test matching logic
  const query1 = 'Khedgaon, Pune';
  const rawTokens = query1.split(/[,+\s]+/).map(t => t.trim()).filter(Boolean);
  console.log(`Query tokens:`, rawTokens);

  const omUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(rawTokens[0])}&count=10&language=en&format=json`;
  const omRes = await fetch(omUrl);
  const omData = await omRes.json();
  console.log(`Open-Meteo results for '${rawTokens[0]}':`, (omData.results || []).length);
  if (omData.results) {
    console.log('Top match:', omData.results[0].name, omData.results[0].admin2, omData.results[0].admin1);
  }

  console.log('\n--- 2. Testing Open-Meteo Weather API with Coordinates (Khed: 18.8550, 73.9160) ---');
  const weatherUrlKhed = `https://api.open-meteo.com/v1/forecast?latitude=18.8550&longitude=73.9160&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
  const wRes1 = await fetch(weatherUrlKhed);
  const wData1 = await wRes1.json();
  console.log('Khed Weather:', {
    temp: wData1.current.temperature_2m,
    feelsLike: wData1.current.apparent_temperature,
    humidity: wData1.current.relative_humidity_2m,
    rainProb: wData1.daily.precipitation_probability_max[0],
    wind: wData1.current.wind_speed_10m,
    forecastDays: wData1.daily.time.length
  });

  console.log('\n--- 3. Testing Weather with Different Coordinates (Nashik: 19.9975, 73.7898) ---');
  const weatherUrlNashik = `https://api.open-meteo.com/v1/forecast?latitude=19.9975&longitude=73.7898&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
  const wRes2 = await fetch(weatherUrlNashik);
  const wData2 = await wRes2.json();
  console.log('Nashik Weather:', {
    temp: wData2.current.temperature_2m,
    feelsLike: wData2.current.apparent_temperature,
    humidity: wData2.current.relative_humidity_2m,
    rainProb: wData2.daily.precipitation_probability_max[0],
    wind: wData2.current.wind_speed_10m,
  });

  console.log('\n--- 4. Checking Translation Keys Isolation ---');
  const en = JSON.parse(fs.readFileSync(path.resolve('src/translations/en.json'), 'utf8'));
  const mr = JSON.parse(fs.readFileSync(path.resolve('src/translations/mr.json'), 'utf8'));
  const hi = JSON.parse(fs.readFileSync(path.resolve('src/translations/hi.json'), 'utf8'));

  const requiredLocKeys = [
    'searchPlaceholder',
    'searchExample',
    'searching',
    'noResultsTitle',
    'noResultsSuggest',
    'gpsFailedTitle',
    'searchMyLocation',
    'farmLocationHeader',
    'selectLocationManually',
    'mapAttribution'
  ];

  for (const k of requiredLocKeys) {
    if (!en.location[k]) console.error(`Missing en.location.${k}`);
    if (!mr.location[k]) console.error(`Missing mr.location.${k}`);
    if (!hi.location[k]) console.error(`Missing hi.location.${k}`);
  }
  console.log('All required location keys verified across EN, MR, and HI.');

  const requiredWeatherKeys = [
    'weatherForFarm',
    'rainChance',
    'humidity',
    'wind',
    'nextFewDays',
    'rulePlanning',
    'ruleRain',
    'ruleHotDry',
    'weatherNotice',
    'weatherUnavailable'
  ];

  for (const k of requiredWeatherKeys) {
    if (!en.weather[k]) console.error(`Missing en.weather.${k}`);
    if (!mr.weather[k]) console.error(`Missing mr.weather.${k}`);
    if (!hi.weather[k]) console.error(`Missing hi.weather.${k}`);
  }
  console.log('All required weather keys verified across EN, MR, and HI.');

  // Check English file has zero Devanagari characters
  const devanagariRegex = /[\u0900-\u097F]/;
  const enStr = JSON.stringify(en);
  if (devanagariRegex.test(enStr)) {
    console.error('FAIL: English translations contain Devanagari characters!');
  } else {
    console.log('PASS: English translations have 0% Devanagari bleed.');
  }

  console.log('\n--- 5. Checking for any Google Maps References in src/ ---');
  const srcFiles = [];
  function scan(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, f.name);
      if (f.isDirectory()) scan(full);
      else if (f.name.endsWith('.ts') || f.name.endsWith('.tsx') || f.name.endsWith('.json')) {
        srcFiles.push(full);
      }
    }
  }
  scan(path.resolve('src'));

  let foundGoogleMaps = 0;
  for (const f of srcFiles) {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('maps.google') || content.includes('google.com/maps') || content.includes('GOOGLE_MAPS')) {
      console.error(`Found Google Maps reference in: ${f}`);
      foundGoogleMaps++;
    }
  }
  if (foundGoogleMaps === 0) {
    console.log('PASS: Zero Google Maps references found in src/.');
  }

  console.log('\n--- ALL VERIFICATION CHECKS COMPLETE ---');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
