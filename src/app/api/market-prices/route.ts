import { NextRequest, NextResponse } from 'next/server';
import {
  APMC_DIRECTORY,
  CROP_TO_AGMARKNET_COMMODITY,
  calculateHaversineDistanceKm,
  OFFICIAL_AGMARKNET_BENCHMARKS,
  OfficialBenchmarkRecord,
} from '@/data/markets';
import { MarketPriceInfo, MarketPriceRecency, MarketIntelligenceResponse } from '@/types';

// In-memory cache with TTL (2 hours)
interface CacheEntry {
  data: MarketIntelligenceResponse;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Parse DD/MM/YYYY date string and calculate days ago
 */
function parseArrivalDate(dateStr: string): { daysAgo: number; recency: MarketPriceRecency } {
  try {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const recordDate = new Date(year, month, day);

      // Reference current date (September 2026)
      const now = new Date();
      const diffTime = Math.max(0, now.getTime() - recordDate.getTime());
      const daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let recency: MarketPriceRecency = 'older';
      if (daysAgo <= 1) recency = 'today';
      else if (daysAgo <= 7) recency = 'recent';

      return { daysAgo, recency };
    }
  } catch {
    // fallback
  }
  return { daysAgo: 1, recency: 'recent' };
}

/**
 * Find matching APMC directory entry by name
 */
function findApmcDirectory(marketName: string, district?: string) {
  const normName = marketName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return APMC_DIRECTORY.find(m => {
    const entryNorm = m.marketName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const districtMatch = !district || m.district.toLowerCase() === district.toLowerCase();
    return districtMatch && (normName.includes(entryNorm) || entryNorm.includes(normName));
  });
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cropId = (searchParams.get('crop') || 'soybean').toLowerCase();
    const state = searchParams.get('state') || 'Maharashtra';
    const district = searchParams.get('district') || 'Pune';
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const farmLat = latStr ? parseFloat(latStr) : null;
    const farmLng = lngStr ? parseFloat(lngStr) : null;

    const cacheKey = `${cropId}_${state.toLowerCase()}_${district.toLowerCase()}_${farmLat ?? 'na'}_${farmLng ?? 'na'}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json(cached.data);
    }

    const commodityAliases = CROP_TO_AGMARKNET_COMMODITY[cropId] || [cropId];
    const apiKey = process.env.DATA_GOV_IN_API_KEY;

    let rawRecords: Array<{
      state: string;
      district: string;
      market: string;
      commodity: string;
      variety?: string;
      arrival_date?: string;
      min_price?: string | number;
      max_price?: string | number;
      modal_price: string | number;
    }> = [];

    let isLiveAgmarknet = false;

    // 1. Try querying official data.gov.in AGMARKNET API if key is available
    if (apiKey) {
      try {
        const primaryCommodity = commodityAliases[0];
        const apiUrl = new URL('https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070');
        apiUrl.searchParams.set('api-key', apiKey);
        apiUrl.searchParams.set('format', 'json');
        apiUrl.searchParams.set('limit', '50');
        apiUrl.searchParams.set('filters[state]', state);
        if (district) apiUrl.searchParams.set('filters[district]', district);
        apiUrl.searchParams.set('filters[commodity]', primaryCommodity);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(apiUrl.toString(), {
          headers: {
            'User-Agent': 'FasalSaathi/1.0 (Government of India AGMARKNET Client)',
            Accept: 'application/json',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          if (json.records && Array.isArray(json.records) && json.records.length > 0) {
            rawRecords = json.records;
            isLiveAgmarknet = true;
          }
        }
      } catch {
        // Fall through cleanly to verified official AGMARKNET benchmark data
      }
    }

    // 2. If data.gov.in was not accessed or returned empty, use verified official AGMARKNET benchmark records
    if (rawRecords.length === 0) {
      const matchedBenchmarks = OFFICIAL_AGMARKNET_BENCHMARKS.filter(b => {
        const commodityMatch = commodityAliases.some(
          c => c.toLowerCase() === b.commodity.toLowerCase()
        );
        const districtMatch = !district || b.district.toLowerCase() === district.toLowerCase();
        return commodityMatch && districtMatch;
      });

      if (matchedBenchmarks.length > 0) {
        rawRecords = matchedBenchmarks.map(b => ({
          state: b.state,
          district: b.district,
          market: b.market,
          commodity: b.commodity,
          variety: b.variety,
          arrival_date: b.arrivalDate,
          min_price: b.minPrice,
          max_price: b.maxPrice,
          modal_price: b.modalPrice,
        }));
      }
    }

    // 3. If no verified records exist for this crop/district
    if (rawRecords.length === 0) {
      const unavailableResponse: MarketIntelligenceResponse = {
        primaryMarket: null,
        nearbyMarkets: [],
        grossValueEstimate: null,
        isAvailable: false,
        statusMessage: 'Market prices are temporarily unavailable for this crop and location.',
        officialSourceUrl: 'https://agmarknet.gov.in',
      };
      return NextResponse.json(unavailableResponse);
    }

    // 4. Map records into structured MarketPriceInfo objects
    const marketInfos: MarketPriceInfo[] = rawRecords.map(r => {
      const apmcEntry = findApmcDirectory(r.market, r.district);
      const distance = apmcEntry && farmLat != null && farmLng != null
        ? calculateHaversineDistanceKm(farmLat, farmLng, apmcEntry.lat, apmcEntry.lng)
        : null;

      const arrivalDateStr = r.arrival_date || '25/09/2026';
      const { daysAgo, recency } = parseArrivalDate(arrivalDateStr);

      const modalPriceNum = typeof r.modal_price === 'number'
        ? r.modal_price
        : parseFloat(String(r.modal_price).replace(/[^0-9.]/g, '')) || 0;

      const minPriceNum = r.min_price != null
        ? (typeof r.min_price === 'number' ? r.min_price : parseFloat(String(r.min_price).replace(/[^0-9.]/g, '')))
        : undefined;

      const maxPriceNum = r.max_price != null
        ? (typeof r.max_price === 'number' ? r.max_price : parseFloat(String(r.max_price).replace(/[^0-9.]/g, '')))
        : undefined;

      return {
        cropId,
        cropName: r.commodity,
        apmcName: r.market.includes('APMC') ? r.market : `${r.market} APMC`,
        marketLocation: `${r.market}, ${r.district}`,
        state: r.state,
        district: r.district,
        variety: r.variety || null,
        modalPrice: modalPriceNum,
        minPrice: minPriceNum,
        maxPrice: maxPriceNum,
        priceUnit: '₹/quintal',
        priceDate: arrivalDateStr,
        recency,
        daysAgo,
        distanceKm: distance,
        distanceLabel: distance != null ? `~${Math.round(distance)} km` : 'Nearby market',
        source: isLiveAgmarknet ? 'agmarknet_live' : 'agmarknet_benchmark',
        sourceName: 'Government of India / AGMARKNET',
        sourceUrl: 'https://agmarknet.gov.in',
        sourceTimestamp: new Date().toISOString(),
      };
    });

    // Sort markets: closest first if distances available; else alphabetical
    marketInfos.sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });

    // 5. Select Primary Market and compare others against it
    const primaryMarket = marketInfos[0];
    primaryMarket.comparison = 'primary';
    primaryMarket.priceDifference = null;

    const nearbyMarkets = marketInfos.slice(1).map(m => {
      let comparison: 'higher' | 'lower' | 'similar' = 'similar';
      let diff = 0;

      if (m.modalPrice > primaryMarket.modalPrice) {
        comparison = 'higher';
        diff = m.modalPrice - primaryMarket.modalPrice;
      } else if (m.modalPrice < primaryMarket.modalPrice) {
        comparison = 'lower';
        diff = primaryMarket.modalPrice - m.modalPrice;
      }

      return {
        ...m,
        comparison,
        priceDifference: diff,
      };
    });

    const responseData: MarketIntelligenceResponse = {
      primaryMarket,
      nearbyMarkets,
      grossValueEstimate: null, // calculated in client based on selected crop yield & farm size
      isAvailable: true,
      officialSourceUrl: 'https://agmarknet.gov.in',
    };

    // Cache the response
    cache.set(cacheKey, {
      data: responseData,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Market prices API error:', error);
    return NextResponse.json(
      {
        primaryMarket: null,
        nearbyMarkets: [],
        grossValueEstimate: null,
        isAvailable: false,
        statusMessage: 'Market prices are temporarily unavailable.',
        officialSourceUrl: 'https://agmarknet.gov.in',
      },
      { status: 500 }
    );
  }
}
