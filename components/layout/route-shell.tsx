'use client';

import { usePathname } from 'next/navigation';
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
