'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useCart } from '@/components/cart/cart-provider';
import { customerUtilityNavigation, primaryExperienceNavigation } from '@/lib/rebirth/site-map';
import { MaterialGlyph, routeMaterialGlyph } from '@/components/rebirth/material-glyph';
import { ActiveOrderStatusStrip } from '@/components/rebirth/active-order-status-strip';

/**
 * The same navigation will be used across every new public experience.
 * Operations/admin stay in their own shell.
 * Intentional split: rich discovery is optional; Menu/Cart are always one action away.
 */
export function ExperienceHeader() {
  const pathname = usePathname();
  const { itemsCount } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open]);

  return (
    <header className="t-header">
      <div className="t-header__inner">
        <Link href="/" className="t-logo" aria-label="توسكانيني - الرئيسية" onClick={() => setOpen(false)}>
          <span className="t-logo__latin" lang="en">Tuscanini<span aria-hidden="true">.</span></span>
          <span className="t-logo__arabic">توسكانيني / بني سويف</span>
        </Link>

        <nav aria-label="التنقل الرئيسي" className="t-header__links">
          {primaryExperienceNavigation.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="t-header__actions">
          <Link href="/cart" className="t-header__cart" aria-label={itemsCount > 0 ? `السلة: ${itemsCount} منتجات` : 'السلة'}>
            السلة{itemsCount > 0 ? <span aria-hidden="true" className="t-header__cart-count">{itemsCount}</span> : null}
          </Link>
          <Link className="t-header__order" href="/menu">اطلب دلوقتي <span aria-hidden="true">↗</span></Link>
          <div className="t-mobile-menu">
            <button
              type="button"
              className="t-mobile-menu__toggle"
              aria-expanded={open}
              aria-controls="t-navigation-panel"
              onClick={() => setOpen((current) => !current)}
            >
              <span className="sr-only">{open ? 'اقفل القائمة' : 'افتح القائمة'}</span>
              <MaterialGlyph name={open ? 'cut' : 'menu'} size={27} className="t-mobile-menu__toggle-glyph"/>
            </button>
            {open ? (
              <>
                <button type="button" className="t-mobile-menu__scrim" onClick={()=>setOpen(false)}
                  aria-label="إغلاق قائمة الموبايل" tabIndex={-1}/>
                <nav id="t-navigation-panel" aria-label="قائمة الموبايل" className="t-mobile-menu__panel">
                  <div className="t-mobile-menu__masthead" aria-hidden="true">
                    <MaterialGlyph name="fold" size={78}/>
                    <div><span lang="en">TUSCANINI / BENI SUEF</span><strong>افتح اللي نفسك فيه.</strong></div>
                  </div>
                  <div className="t-mobile-menu__group" aria-label="أقسام الموقع">
                    {primaryExperienceNavigation.map((link, i) => (
                      <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} onClick={() => setOpen(false)}>
                        <MaterialGlyph name={routeMaterialGlyph(link.href)} size={29}/>
                        <span>{link.label}</span>
                        <small lang="en">{String(i+1).padStart(2,'0')}</small>
                      </Link>
                    ))}
                  </div>
                  <div className="t-mobile-menu__utility">
                    <Link href="/cart" onClick={() => setOpen(false)}><MaterialGlyph name="cart" size={25}/>السلة {itemsCount > 0 ? `(${itemsCount})` : ''}</Link>
                    {customerUtilityNavigation.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                        <MaterialGlyph name={routeMaterialGlyph(link.href)} size={25}/>{link.label}
                      </Link>
                    ))}
                  </div>
                  <span className="t-mobile-menu__footer" lang="en">REAL FOOD / BENI SUEF / 01</span>
                </nav>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <ActiveOrderStatusStrip />
    </header>
  );
}
