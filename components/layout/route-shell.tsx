'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import type { ReactNode } from 'react';

type RouteShellProps = {
  children: ReactNode;
  legacyHeader: ReactNode;
  legacyFooter: ReactNode;
  legacyMobileNav: ReactNode;
};

/**
 * Only routes with a complete authored public shell suppress the old
 * site chrome. Legacy customer routes and all operations/admin screens
 * retain their existing shell until rebuilt and tested separately.
 */
// Heatmaps are opt-in, scoped to the customer discovery surface.
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_TUSCANINI_CLARITY_ID ?? '';
const CLARITY_ENABLED = /^[a-z0-9]{8,30}$/i.test(CLARITY_PROJECT_ID);
const INSIGHT_ROUTES = new Set(['/', '/menu', '/offers', '/food-finder', '/about', '/contact']);

const AUTHORED_PUBLIC_ROUTES = new Set([
  '/', '/menu', '/cart', '/order-success', '/food-finder', '/offers', '/about', '/contact', '/reviews', '/complaints',
]);
export function RouteShell({ children, legacyHeader, legacyFooter, legacyMobileNav }: RouteShellProps) {
  const pathname = usePathname();
  // Our private order-room routes have their own art-directed header and
  // tablet shell. Do not overlay the legacy sticky marketing nav or footer.
  const STUDIO_ROUTES = new Set(['/studio', '/operator/orders']);
  const isAuthoredRoute = AUTHORED_PUBLIC_ROUTES.has(pathname) || STUDIO_ROUTES.has(pathname);

  return (
    <>
      {CLARITY_ENABLED && INSIGHT_ROUTES.has(pathname) ? (
        <Script id="tuscanini-customer-heatmaps" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`}
        </Script>
      ) : null}
      {!isAuthoredRoute ? legacyHeader : null}
      {isAuthoredRoute ? (
        <div className="tuscanini-rebirth-main">{children}</div>
      ) : (
        <main id="main-content" className="container-tight pb-32 pt-5 md:pb-16 md:pt-6">{children}</main>
      )}
      {!isAuthoredRoute ? legacyFooter : null}
      {!isAuthoredRoute ? legacyMobileNav : null}
    </>
  );
}
