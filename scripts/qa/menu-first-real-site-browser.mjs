import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

/**
 * Next.js-only design lab, intentionally different from the OLD Home/gallery
 * motion tests. Tests actual RebirthMenu, cart and shared / + /menu entry.
 *
 * No checkout submission, live restaurant requests, backend writes,
 * provider credentials or fake accepted order statuses.
 */
const base = process.env.REBIRTH_BASE_URL ?? 'http://localhost:3000';
await mkdir('artifacts/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [320,390,768,1440]) {
    const height = width <= 390 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height }, reducedMotion:'reduce',
      deviceScaleFactor:1,
    });
    const page = await context.newPage();
    let orderPosts = 0;
    const runtimeErrors = [];
    page.on('pageerror', error => runtimeErrors.push(error.message));
    await page.route('**/api/orders', async route => {
      if(route.request().method() === 'POST') orderPosts++;
      await route.fulfill({status:503,contentType:'application/json',
        body:JSON.stringify({error:'Design-only browser test never accepts orders'})});
    });
    try {
      const response = await page.goto(base+'/', {waitUntil:'networkidle',timeout:30000});
      assert.equal(response.status(),200,'Home route HTTP status');
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.t-menu-page--first .t-menu-items__grid .t-menu-product').first()
        .waitFor({state:'visible',timeout:12000});

      const h1 = page.locator('.t-menu-page--first .t-menu-first__title h1');
      assert.equal((await h1.textContent()).trim(),'المنيو.');
      const search=page.getByRole('searchbox',{name:/دور على أكلك/});
      assert(await search.isVisible(),'real catalog search visible on entry');
      const all=page.locator('.t-menu-product');
      assert((await all.count())>0,'original restaurant catalog rows rendered');

      const geometry=await page.evaluate(()=>{
        const first=document.querySelector('.t-menu-items__grid .t-menu-product')?.getBoundingClientRect();
        return {firstY:first?.top??99999,
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      assert(geometry.firstY<=height,
        `First real food row pushed below viewport at ${width}px: ${geometry.firstY}`);
      assert(geometry.overflow<=3,`Horizontal overflow at ${width}px: ${geometry.overflow}`);
      assert(await page.locator('[data-visual-disclosure="menu"]').isVisible(),
        'Historical menu and prices remain disclosed');
      assert.equal(await page.locator('#t-menu-categories button').count(),8,
        'Seven grouped food families plus all');
      if(width<=390){
        const dock=page.getByRole('navigation',{name:'التنقل السريع على الموبايل'});
        assert(await dock.isVisible(),'mobile dock visible');
        assert.equal(await dock.locator('a[href="/"]').count(),0,
          'No redundant Home tab on a home-as-menu surface');
        assert.equal(await dock.locator('a[href="/menu"][aria-current="page"]').count(),1,
          'Menu is current even at /');
      }
      await page.screenshot({
        path:`artifacts/screenshots/menu-first-home-${width}.png`,
        fullPage:true,animations:'disabled',timeout:45000,
      });
      await page.getByRole('button',{name:'البيتزا',exact:true}).click();
      const selectedPizza=page.locator('#t-menu-categories button[aria-pressed="true"]');
      assert((await selectedPizza.textContent()).includes('البيتزا'));
      assert((await all.count())>0,'Pizza group actually filters products');
      assert((await page.locator('.t-menu-product__family').first().textContent()).includes('بيتزا'),
        'Pizza results are actual pizza items');

      await search.fill('شاورما فراخ');
      assert((await all.count())>=2,
        'Search automatically crosses category boundaries, distinguishing crepe and pizza');
      assert(await page.locator('#t-menu-categories button[aria-pressed="true"]')
        .getByText('كل الأصناف').isVisible(),
        'Search leaves category filter and searches whole catalog');
      await page.screenshot({
        path:`artifacts/screenshots/menu-first-search-${width}.png`,
        fullPage:false,animations:'disabled',
      });

      const firstArt=page.locator('.t-menu-product__art-trigger').first();
      await firstArt.click();
      await page.locator('.t-product-dialog[open]').waitFor({timeout:8000});
      assert(await page.getByRole('button',{name:'إغلاق تفاصيل المنتج'}).isVisible(),
        'Original product sheet opens');
      await page.screenshot({
        path:`artifacts/screenshots/menu-first-product-${width}.png`,
        fullPage:false,animations:'disabled',
      });
      await page.getByRole('button',{name:'إغلاق تفاصيل المنتج'}).click();
      await page.locator('.t-product-dialog').waitFor({state:'detached',timeout:8000});

      const menuResponse=await page.goto(base+'/menu',{waitUntil:'networkidle',timeout:30000});
      assert.equal(menuResponse.status(),200,'Menu route HTTP status');
      assert.equal(await page.locator('.t-menu-page--first .t-menu-first__title h1').count(),1,
        '/ and /menu must use same product surface');
      assert.equal(orderPosts,0,'No live restaurant order was posted');
      assert.equal(runtimeErrors.length,0,
        `No uncaught runtime errors: ${runtimeErrors.join(' / ')}`);
      console.log(`MENU-FIRST SITE QA PASS ${width}px: food above fold, cross-family search, product sheet, shared routes, no order POST`);
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
