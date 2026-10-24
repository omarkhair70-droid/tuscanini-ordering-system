import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

/**
 * Authored catalog visual QA with the original repository's previous menu.
 * Real 113 legacy product records, recorded prices/size/addons, NO fake promo,
 * NO live restaurant order submissions, NO production credentials.
 * These captures fill the earlier gap: empty-state screenshots alone are
 * not evidence of how Menu/Finder/Checkout look when actually used.
 */
const base=process.env.REBIRTH_BASE_URL??'http://localhost:3000';
const browser=await chromium.launch({headless:true});
await mkdir('artifacts/screenshots',{recursive:true});
try{
  for(const width of [390,1440]){
    const ctx=await browser.newContext({
      viewport:{width,height:width===390?844:900},
      reducedMotion:'reduce',deviceScaleFactor:1,
    });
    const page=await ctx.newPage();
    try{
      await page.goto(base+'/menu',{waitUntil:'networkidle',timeout:30000});
      await page.evaluate(()=>document.fonts.ready);
      // One customer food catalog, no repeated image stickers or art/fast/photo toggles.
      // Provenance remains visible in one catalog note and product details.
      await page.locator('.t-menu-items__grid--photo .t-product-art--representative').first().scrollIntoViewIfNeeded();
      const generatedMediaReady=process.env.NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES==='ready';
      if(generatedMediaReady){
        const photo=page.locator('.t-menu-items__grid--photo [data-kind="generated-illustrative"] img').first();
        await photo.waitFor({state:'visible',timeout:6000});
        await page.waitForFunction(()=>document.querySelector('.t-menu-items__grid--photo [data-kind="generated-illustrative"] img')?.naturalWidth>0,null,{timeout:9000});
        // Screenshot fidelity only: scroll/decode ALL 20 lazy item images
        // before recording a full-page catalog. We DO NOT eager-load them
        // in the actual customer app or disable browser lazy loading.
        const catalogPhotos=page.locator('.t-menu-items__grid--photo [data-kind="generated-illustrative"] img');
        for(let index=0;index<await catalogPhotos.count();index++){
          const photo=catalogPhotos.nth(index);
          await photo.scrollIntoViewIfNeeded({timeout:10000});
          await photo.evaluate(el=>el.decode());
        }
        // Case study: a complete-page Chromium screenshot has sometimes shown
        // cm8 as a dark empty rectangle despite the real B04-06 WebP being
        // valid. Verify the actual ON-SCREEN artwork independently, rather than
        // mistaking a stitched full-page capture for a live rendering defect.
        const focusCard=page.locator('.t-menu-items__grid--photo .t-menu-product').nth(7);
        const focusArt=focusCard.locator('.t-product-art');
        if(await focusArt.getAttribute('data-product-id')!=='cm8' ||
           await focusArt.getAttribute('data-source-photo-id')!=='B04-02')
          throw Error('Focused screenshot source mapping unexpectedly changed');
        await focusCard.scrollIntoViewIfNeeded();
        const natural=await focusArt.locator('img').evaluate(el=>el.decode().then(()=>el.naturalWidth));
        if(natural<=0)throw Error('Specific formerly blank item does not decode on screen');
        await focusCard.screenshot({
          path:`artifacts/screenshots/menu-on-screen-cm8-${width}.png`,animations:'disabled'
        });
        await page.evaluate(()=>window.scrollTo(0,0));
        console.log(`MENU PHOTO CAPTURE ${width}px: all ${await catalogPhotos.count()} decoded, cm8/B04-02 focused card also captured at real viewport width`);
      }
      await page.waitForTimeout(800);
      await page.screenshot({path:`artifacts/screenshots/menu-representative-photo-${width}.png`,fullPage:true,animations:'disabled'});
      await page.locator('.t-menu-items__grid--photo .t-menu-product').first().screenshot({
        path:`artifacts/screenshots/menu-representative-photo-item-${width}.png`,animations:'disabled'});
      await page.locator('.t-menu-items__grid--photo .t-menu-product__art-trigger').first().click();
      await page.locator('.t-product-dialog[open]').waitFor({timeout:6000});
      await page.screenshot({path:`artifacts/screenshots/menu-representative-photo-sheet-${width}.png`,animations:'disabled'});
      await page.getByRole('button',{name:'إغلاق تفاصيل المنتج'}).click();
      await page.locator('.t-product-dialog').waitFor({state:'detached'});
      if(await page.locator('.t-menu-view-switch').count()!==0 ||
        await page.locator('.t-product-art__representative-label').count()!==0)
        throw Error('Menu must not expose three modes or repeat proof stickers over food images');
      if(await page.locator('[data-visual-disclosure="menu"]').count()!==1)
        throw Error('One visible provenance note missing');
      await page.screenshot({path:`artifacts/screenshots/menu-unified-catalog-${width}.png`,fullPage:true,animations:'disabled'});
      await page.getByRole('button',{name:'كريب لحوم',exact:true}).click();
      await page.locator('.t-menu-family-context img').scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>{
        const img=document.querySelector('.t-menu-family-context img');
        return Boolean(img&&img.complete&&img.naturalWidth>0);
      },null,{timeout:15000});
      await page.screenshot({path:`artifacts/screenshots/menu-verified-family-context-${width}.png`,fullPage:true,animations:'disabled'});
      await page.getByRole('button',{name:'كل الأصناف',exact:true}).click();
      const search=page.getByRole('searchbox',{name:/دور على أكلك/});
      await search.fill('تشيكن فاير');
      const results=await page.locator('.t-menu-product').count();
      if(results<2)throw new Error('Expected identical-flavor categories in previous restaurant menu');
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`artifacts/screenshots/menu-search-${width}.png`,fullPage:true,animations:'disabled'});
      await page.locator('.t-menu-product').first().screenshot({path:`artifacts/screenshots/menu-unique-product-art-${width}.png`,animations:'disabled'});
      await page.getByRole('button',{name:'اختيار تفاصيل كريب توسكانيني — تشيكن فاير'}).click();
      await page.locator('.t-product-dialog[open]').waitFor({timeout:5000});
      if((await page.locator('.t-product-dialog__identity .t-product-art[data-product-id]').count())!==1)
        throw Error('Selected historical item visual missing from product details');
      await page.screenshot({path:`artifacts/screenshots/menu-product-dialog-${width}.png`,animations:'disabled'});
      await page.locator('.t-product-dialog__options input[type="checkbox"]').first().check();
      await page.getByRole('group',{name:'اختر الكمية'}).getByRole('button',{name:'زيادة الكمية'}).click();
      await page.screenshot({path:`artifacts/screenshots/menu-size-addon-${width}.png`,animations:'disabled'});
      await page.getByRole('button',{name:/ضيف للسلة/}).click();
      await page.waitForFunction(()=>{
        const cart=JSON.parse(localStorage.getItem('tuscanini-cart-v1')||'{}');
        return cart.items?.[0]?.unitPrice===145 && cart.items?.[0]?.quantity===2 &&
          cart.items?.[0]?.totalItemPrice===290;
      },null,{timeout:7000});
      await page.goto(base+'/cart',{waitUntil:'networkidle',timeout:30000});
      await page.getByRole('heading',{name:'تشيكن فاير'}).waitFor({state:'visible',timeout:5000});
      if(width===390){
        const order=await page.evaluate(()=>{
          const item=document.querySelector('.t-checkout-item')?.getBoundingClientRect();
          const fields=document.querySelector('.t-checkout-inputs')?.getBoundingClientRect();
          const summary=document.querySelector('.t-checkout-summary')?.getBoundingClientRect();
          return Boolean(item&&fields&&summary&&item.top < fields.top && fields.bottom <= summary.top+4);
        });
        if(!order) throw new Error('Phone checkout must read item -> customer -> final summary');
      }
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`artifacts/screenshots/cart-with-old-menu-${width}.png`,fullPage:true,animations:'disabled'});
      await page.goto(base+'/food-finder',{waitUntil:'networkidle',timeout:30000});
      await page.getByRole('button',{name:'كريب',exact:true}).click();
      await page.getByRole('button',{name:'لحد 150 ج.م',exact:true}).click();
      if((await page.locator('.t-finder-results__grid article').count())!==8){
        throw new Error('Finder must render 8 previous-price crepe matches');
      }
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`artifacts/screenshots/finder-matches-${width}.png`,fullPage:true,animations:'disabled'});
      if(generatedMediaReady){
        await page.goto(base+'/menu/visual-atlas',{waitUntil:'networkidle',timeout:30000});
        const all=page.locator('.t-menu-atlas__item');
        if(await all.count()!==100)throw Error('Owner 100 photo atlas must show 100 real locally installed food visuals');
        const first=page.locator('.t-menu-atlas__item img').first();
        await first.scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>document.querySelector('.t-menu-atlas__item img')?.naturalWidth>0,null,{timeout:15000});
        await page.screenshot({path:`artifacts/screenshots/owner-100-food-visual-atlas-${width}.png`,animations:'disabled'});
        // The atlas correctly uses lazy-loading for hundreds of image cards.
        // Scroll and DECODE the actual photographed pizza studies before
        // capturing this QA proof; a premature screenshot only shows empty
        // placeholders, even when the stored 720px WebP is valid.
        const pizza=page.locator('.t-menu-atlas__batch').nth(6);
        const pizzaImages=pizza.locator('img');
        for(let i=0;i<4;i++){
          const img=pizzaImages.nth(i);
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(el=>el.decode());
        }
        await pizzaImages.first().scrollIntoViewIfNeeded();
        await page.screenshot({path:`artifacts/screenshots/owner-pizza-collage-preserved-${width}.png`,animations:'disabled'});

        // Editorial curation requires actual visual evidence for ALL 100
        // installed frames. A first-viewport atlas screenshot + four pizza
        // studies cannot certify the other 86 image crops and near-duplicates.
        // Scroll into view and decode each lazy image before taking a full-page
        // comparison sheet at both real browser widths.
        const atlasImages = page.locator('.t-menu-atlas__item img');
        for(let index=0;index<100;index++){
          const image=atlasImages.nth(index);
          await image.scrollIntoViewIfNeeded({timeout:12000});
          await image.evaluate(element=>element.decode());
        }
        await page.evaluate(()=>window.scrollTo(0,0));
        await page.screenshot({
          path:`artifacts/screenshots/owner-100-food-visual-atlas-FULL-${width}.png`,
          fullPage:true,animations:'disabled',timeout:120000
        });
        console.log(`ATLAS FULL ${width}px: ALL 100 illustrative WebP images scrolled, decoded, and captured; not a named-menu photo approval`);
      }
      console.log(`POPULATED VISUALS ${width}px: ${results} same-flavor family choices; old product 125+20, x2 = 290 EGP; cart and 8 finder matches photographed`);
    }finally{await ctx.close()}
  }
}finally{await browser.close()}
