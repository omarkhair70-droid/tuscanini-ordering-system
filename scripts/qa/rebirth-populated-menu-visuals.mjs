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
      // Browse the newly sourced external PHOTO mode first. A separate photo
      // honesty badge + true photographer credit must remain visible.
      await page.locator('.t-menu-items__grid--photo .t-product-art--representative').first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({path:`artifacts/screenshots/menu-representative-photo-${width}.png`,fullPage:true,animations:'disabled'});
      await page.locator('.t-menu-items__grid--photo .t-menu-product').first().screenshot({
        path:`artifacts/screenshots/menu-representative-photo-item-${width}.png`,animations:'disabled'});
      await page.locator('.t-menu-items__grid--photo .t-menu-product__art-trigger').first().click();
      await page.locator('.t-product-dialog[open]').waitFor({timeout:6000});
      await page.screenshot({path:`artifacts/screenshots/menu-representative-photo-sheet-${width}.png`,animations:'disabled'});
      await page.getByRole('button',{name:'إغلاق تفاصيل المنتج'}).click();
      await page.getByRole('button',{name:'عرض الرسومات'}).click();
      await page.locator('.t-menu-items__grid--art .t-product-art').first().waitFor({state:'visible',timeout:6000});
      await page.locator('.t-menu-items__grid--art').evaluate(el=>
        window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY-130));
      await page.screenshot({path:`artifacts/screenshots/menu-illustrated-grid-${width}.png`,fullPage:true,animations:'disabled'});
      await page.screenshot({path:`artifacts/screenshots/menu-illustrated-item-${width}.png`,animations:'disabled'});
      await page.getByRole('button',{name:'المنيو السريع'}).click();
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
      if((await page.locator('.t-product-dialog__identity .t-product-art[data-kind="original-graphic"]').count())!==1)
        throw Error('Expected same individual source-conscious printed art in modal');
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
      console.log(`POPULATED VISUALS ${width}px: ${results} same-flavor family choices; old product 125+20, x2 = 290 EGP; cart and 8 finder matches photographed`);
    }finally{await ctx.close()}
  }
}finally{await browser.close()}
