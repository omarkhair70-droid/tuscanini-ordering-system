'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
  const menuToggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const panel = document.getElementById('t-navigation-panel');
    const links = Array.from(panel?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []);
    links[0]?.focus();
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        menuToggle.current?.focus();
      } else if (event.key === 'Tab' && links.length) {
        const first = links[0];
        const last = links[links.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeydown);
    };
  }, [open]);

  return (
    <>
    <header className="t-header">
      <div className="t-header__inner">
        <Link href="/" className="t-logo" aria-label="توسكانيني - الرئيسية" onClick={() => setOpen(false)}>
          <span className="t-logo__latin" lang="en">Tuscanini<span aria-hidden="true">.</span></span>
          <span className="t-logo__arabic">كريب • بيتزا</span>
        </Link>

        <nav aria-label="التنقل الرئيسي" className="t-header__links">
          {primaryExperienceNavigation.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="t-header__actions">
          <Link href="/account" className="t-header__account"
            aria-label="حسابي وطلباتي" aria-current={pathname==='/account'?'page':undefined}
            title="حسابي وطلباتي">
            <span className="t-header__account-glyph"><MaterialGlyph name="account" size={26}/></span>
            <span className="t-header__account-label">حسابي</span>
          </Link>
          <Link href="/cart" className="t-header__cart" aria-label={itemsCount > 0 ? `السلة: ${itemsCount} منتجات` : 'السلة'}>
            السلة{itemsCount > 0 ? <span aria-hidden="true" className="t-header__cart-count">{itemsCount}</span> : null}
          </Link>
          <Link className="t-header__order" href="/menu">افتح المنيو <span aria-hidden="true">↗</span></Link>
          <div className="t-mobile-menu">
            <button
              type="button"
              className="t-mobile-menu__toggle"
              aria-expanded={open}
              ref={menuToggle}
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
    <nav className="t-app-dock" aria-label="التنقل السريع على الموبايل">
      {(pathname === '/' || pathname === '/menu'
        ? [
            {href:'/menu', label:'المنيو'},
            {href:'/offers', label:'العروض'},
            {href:'/account', label:'حسابي'},
            {href:'/cart', label:'السلة'},
          ]
        : [
            {href:'/', label:'الرئيسية'},
            {href:'/menu', label:'المنيو'},
            {href:'/offers', label:'العروض'},
            {href:'/cart', label:'السلة'},
          ]).map(link => {
        const active=pathname===link.href || (link.href==='/menu' && pathname==='/');
        return (
          <Link key={link.href} href={link.href} className="t-app-dock__link"
            aria-current={active?'page':undefined} onClick={()=>setOpen(false)}>
            <MaterialGlyph name={routeMaterialGlyph(link.href)} size={23}/>
            <span>{link.label}</span>
            {link.href==='/cart' && itemsCount>0 && <b className="t-app-dock__count" aria-label={itemsCount+' أصناف'}>{itemsCount}</b>}
          </Link>
        );
      })}
    </nav>
    </>
  );
}
