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
 * The redesign is delivered lane-by-lane, starting with Home.
 * Existing commerce/admin routes keep their tested legacy shell until
 * their specific production lane has been reviewed and rebuilt.
 */
export function RouteShell({ children, legacyHeader, legacyFooter, legacyMobileNav }: RouteShellProps) {
  const pathname = usePathname();
  const isNewHome = pathname === '/' || pathname === '/menu' || pathname === '/cart';

  return (
    <>
      {!isNewHome ? legacyHeader : null}
      {isNewHome ? (
        <div className="tuscanini-rebirth-main">{children}</div>
      ) : (
        <main id="main-content" className="container-tight pb-32 pt-5 md:pb-16 md:pt-6">{children}</main>
      )}
      {!isNewHome ? legacyFooter : null}
      {!isNewHome ? legacyMobileNav : null}
    </>
  );
}
