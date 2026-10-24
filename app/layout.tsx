import type { Metadata, Viewport } from 'next';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Providers } from '@/app/providers';
import { RouteShell } from '@/components/layout/route-shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'توسكانيني | Tuscanini',
  description: 'منيو توسكانيني - كريب وبيتزا وباستا وعروض.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Tuscanini',
    statusBarStyle: 'default',
  },
  icons: {
    apple: '/images/brand/icons/apple-touch-icon.png',
  },
};


export const viewport: Viewport = {
  themeColor: '#E10600',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          <RouteShell
            legacyHeader={<SiteHeader />}
            legacyFooter={<SiteFooter />}
            legacyMobileNav={<MobileNav />}
          >
            {children}
          </RouteShell>
        </Providers>
      </body>
    </html>
  );
}
