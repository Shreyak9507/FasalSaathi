import { POST } from '../src/app/api/detect-disease/route';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load .env.local into process.env for local test execution
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      process.env[key.trim()] = rest.join('=').trim();
    }
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function run() {
  console.log('====================================================');
  console.log('🧪 TESTING /api/detect-disease ROUTE HANDLER');
  console.log('====================================================\n');

  // Minimal valid 1x1 green JPEG image as Base64 (represents a non-leaf / synthetic image to test Invalid or Healthy detection)
  const sample1x1JpegBase64 =
    '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

  const body = {
    image: `data:image/jpeg;base64,${sample1x1JpegBase64}`,
    mimeType: 'image/jpeg',
  };

  const req = new NextRequest('http://localhost:3000/api/detect-disease?lang=en', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log('Sending sample image to /api/detect-disease...');
  const res = await POST(req);

  assert(res.status === 200, `API route returned status 200 (got ${res.status})`);

  const json = await res.json();
  console.log('API Response received:', JSON.stringify(json, null, 2));

  assert(json.success === true, 'Response contains success=true');
  assert(Boolean(json.result), 'Response contains result object');
  assert(Boolean(json.result.crop), `Result contains crop: ${json.result.crop}`);
  assert(Boolean(json.result.condition), `Result contains condition: ${json.result.condition}`);
  assert(typeof json.result.confidence === 'number', `Result contains numeric confidence: ${json.result.confidence}%`);
  assert(json.result.engine === 'huggingface' || json.result.engine === 'gemini', `Result engine is valid: ${json.result.engine}`);
  assert(Boolean(json.result.whatWeFound), 'Result contains whatWeFound explanation');
  assert(Boolean(json.result.disclaimer), 'Result contains disclaimer');

  console.log('\n====================================================');
  console.log('🎉 /api/detect-disease API ROUTE HANDLER PASSED!');
  console.log('====================================================');
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
