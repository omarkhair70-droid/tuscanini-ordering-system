import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

/**
 * Creative re-benchmark screenshots: unlike the Playwright CLI full-page
 * shortcut, actually VISIT each scroll position before capturing. This forces
 * loading/decoding of authentic restaurant photographs below the fold.
 * No network credentials or merchant data are used.
 */
const base = process.env.REBIRTH_BASE_URL ?? 'http://localhost:3000';
const combos = [
  ...['','menu','offers','food-finder','about','contact','cart','order-success','reviews','complaints']
    .flatMap(route => [390,1440].map(width => ({route,width,height:width===390?844:900}))),
  ...[320,768].map(width => ({route:'',width,height:width===320?720:1024})),
  ...['menu','offers','about','contact','reviews','complaints']
    .flatMap(route => [320,768].map(width => ({route,width,height:width===320?720:1024}))),
];

await mkdir('artifacts/screenshots',{recursive:true});
const browser = await chromium.launch({headless:true});
try {
  for (const {route,width,height} of combos) {
    const context = await browser.newContext({
      viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce',
    });
    try {
      const page = await context.newPage();
      const path = '/' + route;
      await page.goto(base+path,{waitUntil:'networkidle',timeout:30000});
      const media = await page.evaluate(async () => {
        await document.fonts.ready;
        // We deliberately scan the document rather than asking fullPage
        // screenshot to paint unvisited below-fold content in one frame.
        const yMax = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
        const hop = Math.max(200, Math.floor(window.innerHeight * .72));
        for (let y=0;y<yMax;y+=hop) {
          window.scrollTo(0,y);
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }
        // Keep the last view visible long enough for decoders and Next/Image.
        for (const img of document.querySelectorAll('main img')) {
          if (img.loading === 'lazy') img.loading = 'eager';
        }
        await Promise.all([...document.images].map(async img => {
          try {
            if (!img.complete) await new Promise(resolve => {
              img.addEventListener('load',resolve,{once:true});
              img.addEventListener('error',resolve,{once:true});
              setTimeout(resolve,7000);
            });
            if (img.naturalWidth > 0) await img.decode();
          } catch {
            // Broken images are reported below with their DOM source.
          }
        }));
        window.scrollTo(0,0);
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const main = [...document.querySelectorAll('main img')];
        const heroPhotos = [...document.querySelectorAll('.t-hero__visual img')];
        return {
          total:main.length,
          missing:main.filter(img => img.naturalWidth <= 0).map(img => img.getAttribute('src')),
          hero: heroPhotos.length === 2 && heroPhotos.every(img => img.complete && img.naturalWidth > 0),
          packaging: [...document.querySelectorAll('.t-packaging__photo-img')]
            .every(img => img.complete && img.naturalWidth > 0),
        };
      });
      if (media.missing.length) {
        throw new Error(`Broken content images ${path} ${width}px: ${media.missing.join(', ')}`);
      }
      if (!route && !media.hero) {
        throw new Error(`Both genuine hero photos must decode on Home at ${width}px`);
      }
      if (!route && !media.packaging) {
        throw new Error(`Real packaging photo did not decode on Home at ${width}px`);
      }
      const filename = `artifacts/screenshots/${route||'home'}-${width}.png`;
      await page.screenshot({path:filename,fullPage:true,animations:'disabled'});
      console.log(`SCREENSHOT ${path} ${width}px — ${media.total} content images decoded — ${filename}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
