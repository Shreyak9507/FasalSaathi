import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FasalSaathi - Agricultural Crop Decision Support',
    short_name: 'FasalSaathi',
    description: 'Better crop decisions, made simple. Personalized crop suitability for Indian farmers using Soil Health Card data, weather and location.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f5',
    theme_color: '#2d7a4f',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
