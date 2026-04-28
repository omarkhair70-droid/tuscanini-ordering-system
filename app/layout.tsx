import type { Metadata } from 'next';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Providers } from '@/app/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'توسكانيني | Tuscanini',
  description: 'منيو توسكانيني - كريب وبيتزا وباستا وعروض.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          <SiteHeader />
          <main className="container-tight pb-32 pt-5 md:pb-16 md:pt-6">{children}</main>
          <SiteFooter />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
