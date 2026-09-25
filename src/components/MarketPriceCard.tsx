'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { CropRequirements, crops, getCropLocalizedName } from '@/data/crops';
import { MarketPriceInfo, MarketIntelligenceResponse, GrossCropValueEstimate } from '@/types';
import { fetchMarketIntelligence, calculateGrossCropValue } from '@/services/marketPrice';

interface MarketPriceCardProps {
  cropId: string;
  state?: string;
  district?: string;
  farmLat?: number | null;
  farmLng?: number | null;
  farmSizeAcres?: number | null;
}

export default function MarketPriceCard({
  cropId,
  state = 'Maharashtra',
  district = 'Pune',
  farmLat,
  farmLng,
  farmSizeAcres,
}: MarketPriceCardProps) {
  const {
    t,
    language,
    formatCurrency,
    formatNumber,
    formatDecimal,
    formatDate,
    formatDistance,
    localizeDigits,
  } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MarketIntelligenceResponse | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketPriceInfo | null>(null);

  const crop = useMemo(() => {
    return crops.find(c => c.id === cropId) || crops[0];
  }, [cropId]);

  const localizedCropName = getCropLocalizedName(crop, language);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchMarketIntelligence({
      cropId,
      state,
      district,
      lat: farmLat,
      lng: farmLng,
    })
      .then(res => {
        if (isMounted) {
          setData(res);
          setSelectedMarket(res.primaryMarket);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Market price fetch failed:', err);
        if (isMounted) {
          setData({
            primaryMarket: null,
            nearbyMarkets: [],
            grossValueEstimate: null,
            isAvailable: false,
            statusMessage: 'Market prices are temporarily unavailable.',
            officialSourceUrl: 'https://agmarknet.gov.in',
          });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cropId, state, district, farmLat, farmLng]);

  // Calculate gross crop value dynamically based on currently selected market modal price
  const grossValueEstimate: GrossCropValueEstimate | null = useMemo(() => {
    if (!selectedMarket || !crop) return null;
    return calculateGrossCropValue({
      crop,
      modalPrice: selectedMarket.modalPrice,
      farmSizeAcres,
    });
  }, [selectedMarket, crop, farmSizeAcres]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <div className="h-4 bg-slate-200 rounded w-48" />
        </div>
        <div className="h-20 bg-slate-100 rounded-2xl mb-3" />
        <div className="h-12 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  // Graceful Unavailable State
  if (!data || !data.isAvailable || !selectedMarket) {
    return (
      <div className="bg-white rounded-3xl border border-amber-200 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🏪</span>
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              {t('market', 'marketIntelligenceTitle') || 'Nearby APMC Market Intelligence'}
            </h3>
            <p className="text-xs text-amber-800 font-medium mb-3">
              {data?.statusMessage || t('market', 'marketDataUnavailable') || 'Market prices are temporarily unavailable.'}
            </p>
            <a
              href="https://agmarknet.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
            >
              <span>🏛️</span>
              {t('market', 'viewAgmarknetPortal') || 'View official AGMARKNET portal'} →
            </a>
          </div>
        </div>
      </div>
    );
  }

  const primary = data.primaryMarket;
  const isPrimarySelected = selectedMarket.apmcName === primary?.apmcName;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Header with Crop Name and Location */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{crop.emoji}</span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              {t('market', 'marketPriceTitle') || 'Nearby Market Price'}
            </span>
            <h3 className="text-sm font-black text-slate-900 leading-tight">
              {localizedCropName} {selectedMarket.variety ? `(${selectedMarket.variety})` : ''}
            </h3>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {district}
        </span>
      </div>

      {/* Main Selected Market Card */}
      <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 rounded-2xl p-4 border border-emerald-200/90">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🏪</span>
              <h4 className="text-sm font-extrabold text-slate-900">
                {selectedMarket.apmcName}
              </h4>
            </div>
            <div className="text-[11px] text-slate-600 font-medium mt-0.5">
              📍 {selectedMarket.distanceKm != null ? `~${formatDistance(selectedMarket.distanceKm)}` : (t('market', 'nearbyMarket') || 'Nearby market')} • {selectedMarket.marketLocation}
            </div>
          </div>

          {/* Recency Badge */}
          <div className="text-right">
            {selectedMarket.recency === 'today' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {t('market', 'today') || 'TODAY'}
              </span>
            ) : selectedMarket.recency === 'recent' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                {t('market', 'recent') || 'RECENT'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {t('market', 'older') || 'OLDER'}
              </span>
            )}
          </div>
        </div>

        {/* Modal Price (Typical Market Price) Emphasis */}
        <div className="mt-3 bg-white/95 rounded-xl p-3 border border-emerald-200 shadow-2xs">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                {t('market', 'typicalMarketPrice') || 'Typical market price'}
              </span>
              <p className="text-[10px] text-slate-500 italic">
                {t('market', 'modalPriceExplanation') || 'The price most commonly reported in this market.'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-emerald-800">
                {formatCurrency(selectedMarket.modalPrice)}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 block">
                / {t('recommendation', 'perQuintal') || 'quintal'}
              </span>
            </div>
          </div>

          {/* Min - Max Price Range */}
          {(selectedMarket.minPrice != null && selectedMarket.maxPrice != null) && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">
                {t('market', 'priceRange') || 'Reported Range'}:
              </span>
              <span className="font-bold text-slate-800">
                {formatCurrency(selectedMarket.minPrice)} – {formatCurrency(selectedMarket.maxPrice)} / q
              </span>
            </div>
          )}
        </div>

        {/* Reporting Date & Stale Indicator */}
        <div className="mt-2.5 text-[10px] text-slate-500 flex items-center justify-between">
          <span>
            {t('market', 'arrivalDate') || 'Arrival Date'}: <strong className="text-slate-700">{formatDate(selectedMarket.priceDate, 'short')}</strong>
          </span>
          {selectedMarket.daysAgo > 0 && (
            <span className="italic">
              {t('market', 'latestAvailableData') || 'Latest available data'}: {formatNumber(selectedMarket.daysAgo)} {t('market', 'daysAgo') || 'days ago'}
            </span>
          )}
        </div>
      </div>

      {/* Other Nearby Markets Comparison */}
      {data.nearbyMarkets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t('market', 'otherNearbyMarkets') || 'Other Nearby Markets'}
            </h4>
            <span className="text-[10px] text-slate-500">
              {t('market', 'clickToSelect') || 'Tap to compare'}
            </span>
          </div>

          <div className="space-y-1.5">
            {/* If primary is not currently selected, show primary in comparison list */}
            {!isPrimarySelected && primary && (
              <button
                type="button"
                onClick={() => setSelectedMarket(primary)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{primary.apmcName}</div>
                  <div className="text-[10px] text-slate-500">
                    {primary.distanceKm != null ? `~${formatDistance(primary.distanceKm)}` : (t('market', 'nearbyMarket') || 'Nearby market')} • {primary.variety || localizedCropName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-800">
                    {formatCurrency(primary.modalPrice)}/q
                  </div>
                  <span className="text-[9px] font-semibold text-slate-500">
                    {formatDate(primary.priceDate, 'short')}
                  </span>
                </div>
              </button>
            )}

            {data.nearbyMarkets.map((m, idx) => {
              if (selectedMarket.apmcName === m.apmcName) return null;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMarket(m)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/30 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{m.apmcName}</div>
                    <div className="text-[10px] text-slate-500">
                      {m.distanceKm != null ? `~${formatDistance(m.distanceKm)}` : (t('market', 'nearbyMarket') || 'Nearby market')} • {m.variety || localizedCropName}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-slate-800">
                      {formatCurrency(m.modalPrice)}/q
                    </div>
                    {/* Honest Price Comparison Tag (No "Best Market" ranking) */}
                    {m.comparison === 'higher' && m.priceDifference ? (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        +{t('market', 'higherPriceReported') || 'Higher price'} (+{formatCurrency(m.priceDifference)})
                      </span>
                    ) : m.comparison === 'lower' && m.priceDifference ? (
                      <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        -{t('market', 'lowerPriceReported') || 'Lower price'} (-{formatCurrency(m.priceDifference)})
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-500">
                        {formatDate(m.priceDate, 'short')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Estimated Gross Crop Value Box */}
      {grossValueEstimate && (
        <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl p-4 border border-amber-200/90 shadow-2xs">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base">📊</span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
              {t('market', 'estimatedGrossValue') || 'Estimated Gross Crop Value'}
            </h4>
          </div>

          <div className="bg-white/95 rounded-xl p-3 border border-amber-200/80 mb-2">
            <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
              <span>
                {t('market', 'expectedYield') || 'Expected Yield'}:
              </span>
              <strong className="text-slate-900 font-extrabold">
                {formatNumber(grossValueEstimate.totalExpectedYieldQuintals)} {t('recommendation', 'quintals') || 'quintals'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">
                  ({formatDecimal(grossValueEstimate.farmSizeAcres, 1)} {t('farmerInfo', 'acres') || 'Acres'})
                </span>
              </strong>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-600 mb-2">
              <span>
                {t('market', 'selectedMarketRate') || 'Selected Market Rate'}:
              </span>
              <span className="text-slate-800 font-bold">
                {formatCurrency(grossValueEstimate.modalPricePerQuintal)} / q
              </span>
            </div>

            <div className="pt-2 border-t border-amber-100 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wide block">
                  {t('market', 'estimatedGrossValue') || 'Estimated Gross Value'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {formatNumber(grossValueEstimate.totalExpectedYieldQuintals)} q × {formatCurrency(grossValueEstimate.modalPricePerQuintal)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-950">
                  ≈ {formatCurrency(grossValueEstimate.estimatedGrossValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Disclaimers */}
          <div className="space-y-1 text-[10px] text-slate-600 leading-snug">
            <p className="font-medium text-amber-950">
              ⚠️ <strong>{t('market', 'disclaimerHeading') || 'Important Notice'}:</strong> {t('market', 'grossValueDisclaimer') || grossValueEstimate.disclaimer}
            </p>
            <p className="text-slate-500 italic">
              ℹ️ {t('market', 'grossValueNote') || 'This is estimated gross value before transport and input deductions. It does not represent net profit.'}
            </p>
          </div>
        </div>
      )}

      {/* Source Citation & Official Portal Link */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
        <div>
          <span>{t('market', 'sourceLabel') || 'Source'}: </span>
          <strong className="text-slate-700">
            {t('market', 'sourceGovtAgmarknet') || 'Government of India / AGMARKNET (data.gov.in)'}
          </strong>
        </div>
        <a
          href="https://agmarknet.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 hover:text-emerald-800 font-semibold underline underline-offset-2 flex items-center gap-1"
        >
          {t('market', 'viewAgmarknetPortal') || 'View AGMARKNET Portal'} ↗
        </a>
      </div>
    </div>
  );
}
