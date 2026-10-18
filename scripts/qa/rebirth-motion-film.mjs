import { chromium } from 'playwright';
import { rename, mkdir } from 'node:fs/promises';

/**
 * Real WebM Chromium screen recordings for the owner's MOTION review.
 * No simulated screenshots, no customer order POST, no fake assets.
 * Unlike the still-image baseline, reduced motion is intentionally OFF here
 * to demonstrate optional composition, while the separate smoke test verifies
 * that reduced-motion mode removes the moving parts.
 */
const base=process.env.REBIRTH_BASE_URL??'http://localhost:3000';
const folder='artifacts/screenshots';
await mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true});
async function glide(page,selector){
  await page.evaluate(s=>{
    const el=document.querySelector(s);
    if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
  },selector);
  await page.waitForTimeout(1400);
}
try{
  for(const width of [390,1440]){
    const context=await browser.newContext({
      viewport:{width,height:width===390?844:900},
      reducedMotion:'no-preference',
      deviceScaleFactor:1,
      recordVideo:{dir:folder,size:{width,height:width===390?844:900}},
    });
    const page=await context.newPage();
    const video=page.video();
    try{
      await page.goto(base+'/',{waitUntil:'networkidle',timeout:30000});
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(750);
      if(width===390){
        await page.getByRole('button',{name:'افتح القائمة'}).click();
        await page.waitForTimeout(900);
        await page.getByRole('button',{name:'اقفل القائمة'}).click();
        await page.waitForTimeout(400);
      }
      await glide(page,'.t-discover__tabs');
      await page.getByRole('tab',{name:'البيتزا'}).click();
      await page.waitForTimeout(850);
      await page.getByRole('tab',{name:'الساندوتشات'}).click();
      await page.waitForTimeout(800);
      await glide(page,'.t-packaging__chooser');
      await page.getByRole('button',{name:'الأكل من جوا'}).click();
      await page.waitForTimeout(850);
      await page.getByRole('button',{name:'العلبة والورق'}).click();
      await page.waitForTimeout(850);
      const shown=await page.locator('.t-packaging__photo-img--package[data-current="true"]').count();
      if(shown!==1)throw new Error('Packaging film cannot conclude before first-source image is restored');

      // Same recording continues onto the real former-price menu.
      // No made-up dish images: every SKU has distinct printed graphic artwork.
      await page.goto(base+'/menu',{waitUntil:'networkidle',timeout:30000});
      await page.getByRole('button',{name:'كريب لحوم',exact:true}).click();
      await page.waitForTimeout(650);
      await glide(page,'.t-menu-items__grid');
      const first=page.locator('.t-menu-product').first();
      if(width===1440)await first.hover();
      await page.waitForTimeout(520);
      await first.locator('.t-menu-product__bottom button').click();
      await page.locator('.t-product-dialog[open]').waitFor({timeout:6000});
      if((await page.locator('.t-product-dialog__identity .t-product-art').count())!==1)
        throw new Error('Product illustration must continue into item sheet');
      await page.waitForTimeout(800);
      const extra=page.locator('.t-product-dialog__options input[type="checkbox"]').first();
      if(await extra.count())await extra.check();
      await page.waitForTimeout(440);
      await page.getByRole('button',{name:'إغلاق تفاصيل المنتج'}).click();
      await page.waitForTimeout(480);
      console.log(`MOTION VIDEO ${width}px: illustrated nav, real-category pictures and physical-material change, plus restaurant menu filter → unique SKU fold graphic → native product sheet — NO order submitted`);
    }finally{
      await page.close();
      await context.close();
    }
    if(!video)throw new Error('Browser did not provide video recorder');
    const original=await video.path();
    const filename=`${folder}/tuscanini-motion-proof-${width}.webm`;
    await rename(original,filename);
    console.log(`RECORDED ${filename}`);
  }
}finally{await browser.close()}
