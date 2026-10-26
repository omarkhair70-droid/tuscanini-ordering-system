import { chromium } from 'playwright';

/**
 * Browser-level reverse shared-image QA. Uses the actual historic 113-item menu,
 * but never submits an order, uses production credentials or creates a deployment.
 */
const base = process.env.REBIRTH_BASE_URL ?? 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1440]) {
    for (const reduced of [false, true]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
        reducedMotion: reduced ? 'reduce' : 'no-preference',
      });
      const page = await context.newPage();
      try {
        await page.goto(base + '/menu', { waitUntil: 'networkidle', timeout: 30000 });
        const source = page.locator('.t-menu-items__grid--photo .t-menu-product__art-trigger').first();
        await source.scrollIntoViewIfNeeded();
        const sourceId = await source.locator('.t-product-art').getAttribute('data-product-id');
        if (!sourceId) throw new Error('Could not identify the original product-art source');

        await source.click();
        await page.locator('.t-product-dialog[open]').waitFor();
        if (!reduced) {
          await page.locator('.t-product-dialog[data-motion-technique="dom-flip"][data-motion-finished="true"]')
            .waitFor({ timeout: 5000 });
        }
        await page.getByRole('button', { name: 'إغلاق تفاصيل المنتج' }).click();
        if (!reduced) {
          await page.locator('.t-product-dialog[data-motion-phase="returning"]')
            .waitFor({ timeout: 2500 });
          const clone = page.locator('.t-product-dialog [data-motion-bridge="return"]');
          if (await clone.count() !== 1) throw new Error('Reverse FLIP missing actual sheet-art bridge');
          const itemSourceId = await source.locator('.t-product-art').getAttribute('data-product-id');
          if (itemSourceId !== sourceId) throw new Error('Product origin was replaced or mismatched');
        }
        await page.locator('.t-product-dialog').waitFor({ state: 'detached', timeout: 4000 });
        await page.waitForFunction(() =>
          document.activeElement?.classList.contains('t-menu-product__art-trigger'), null, { timeout: 3000 });
        if (await page.locator('[data-motion-bridge]').count())
          throw new Error('Orphan FLIP animation bridge remained after close');

        // Second open via keyboard; native Escape must share the same close path.
        await source.focus();
        await page.keyboard.press('Enter');
        await page.locator('.t-product-dialog[open]').waitFor();
        if (!reduced) {
          await page.locator('.t-product-dialog[data-motion-finished="true"]').waitFor({ timeout: 5000 });
        }
        await page.keyboard.press('Escape');
        if (!reduced) await page.locator('.t-product-dialog[data-motion-phase="returning"]')
          .waitFor({ timeout: 2500 });
        await page.locator('.t-product-dialog').waitFor({ state: 'detached', timeout: 4000 });
        if (await page.locator('[data-motion-bridge]').count())
          throw new Error('Escape left a ghost animated art copy');
        console.log(`RETURN FLIP ${width}px / reduced=${reduced}: thumbnail -> dialog -> SAME thumbnail, keyboard focus and Escape restored`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
