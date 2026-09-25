import { OfficialSoilLab } from '@/types';

export interface SoilTestingLabsResponse {
  success: boolean;
  total: number;
  state?: string;
  district?: string;
  source?: string;
  sourceUrl?: string;
  labs: OfficialSoilLab[];
  error?: string;
  message?: string;
}

export async function fetchNearbySoilTestingLabs(params: {
  state?: string;
  district?: string;
  taluka?: string;
  lat?: number;
  lng?: number;
}): Promise<SoilTestingLabsResponse> {
  const query = new URLSearchParams();
  if (params.state) query.set('state', params.state);
  if (params.district) query.set('district', params.district);
  if (params.taluka) query.set('taluka', params.taluka);
  if (params.lat != null) query.set('lat', params.lat.toString());
  if (params.lng != null) query.set('lng', params.lng.toString());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

  try {
    const res = await fetch(`/api/soil-testing-labs?${query.toString()}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error('Soil testing laboratory information is temporarily unavailable from the official portal.');
    }

    const data: SoilTestingLabsResponse = await res.json();
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error('Failed to fetch nearby soil testing labs:', err);
    throw new Error(err.message || 'Soil testing laboratory information is temporarily unavailable from the official portal.');
  }
}
