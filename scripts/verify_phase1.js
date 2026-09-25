const http = require('http');

const PORT = 3005;
const routes = [
  '/',
  '/farmer-info',
  '/soil-upload',
  '/no-card',
  '/soil-processing',
  '/soil-result',
  '/soil-freshness',
  '/location',
  '/weather',
  '/recommendation',
  '/crop-detail?crop=soybean',
  '/manifest.webmanifest',
  '/api/weather?lat=18.5204&lng=73.8567',
  '/translations/en.json',
  '/translations/hi.json',
  '/translations/mr.json',
  '/icons/icon-192x192.png',
  '/sw.js',
];

function fetchRoute(route) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PORT}${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ route, status: res.statusCode, length: data.length });
      });
    });
    req.on('error', (err) => {
      resolve({ route, status: 'ERROR', error: err.message });
    });
  });
}

async function verifyAll() {
  console.log(`Verifying all ${routes.length} routes against localhost:${PORT}...`);
  let allPass = true;
  for (const r of routes) {
    const res = await fetchRoute(r);
    const ok = res.status === 200;
    if (!ok) allPass = false;
    console.log(`[${ok ? 'PASS' : 'FAIL'}] ${r.padEnd(38)} -> HTTP ${res.status} (${res.length || 0} bytes)`);
  }
  if (allPass) {
    console.log('\nAll routes verified successfully with HTTP 200 OK!');
    process.exit(0);
  } else {
    console.error('\nSome routes failed verification.');
    process.exit(1);
  }
}

verifyAll();
