'use client';

import React from 'react';

interface OpenStreetMapProps {
  lat: number;
  lng: number;
  className?: string;
  zoomDelta?: number;
}

export default function OpenStreetMap({
  lat,
  lng,
  className = 'h-44',
  zoomDelta = 0.02,
}: OpenStreetMapProps) {
  // Calculate bounding box centered around coordinates
  const minLng = (lng - zoomDelta).toFixed(4);
  const minLat = (lat - zoomDelta).toFixed(4);
  const maxLng = (lng + zoomDelta).toFixed(4);
  const maxLat = (lat + zoomDelta).toFixed(4);

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat.toFixed(4)}%2C${lng.toFixed(4)}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-slate-100 shadow-xs relative">
      <div className={`w-full ${className} relative`}>
        <iframe
          title="OpenStreetMap Farm Location"
          src={embedUrl}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>

      {/* Required OpenStreetMap Attribution */}
      <div className="bg-white/95 px-3 py-1 border-t border-gray-100 text-[10px] text-gray-500 flex items-center justify-between">
        <span className="flex items-center gap-1 font-medium">
          <span>📍</span>
          <span>OpenStreetMap</span>
        </span>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-800 transition-colors"
        >
          © OpenStreetMap contributors
        </a>
      </div>
    </div>
  );
}
