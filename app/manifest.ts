import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tuscanini Ordering',
    short_name: 'Tuscanini',
    description: 'Order from Tuscanini, browse the menu, discover offers, and track your order live.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    theme_color: '#E10600',
    background_color: '#FFF8F8',
    categories: ['food', 'restaurants', 'shopping'],
    icons: [
      {
        src: '/images/brand/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/brand/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/brand/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
