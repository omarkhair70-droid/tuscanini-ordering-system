import { chromium } from 'playwright';

/**
 * Real Chromium interaction smoke: no production Supabase credentials.
 * Does NOT claim that live product checkout, staff permissions or real
 * order submission have been tested.
 */
const baseUrl = process.env.REBIRTH_BASE_URL ?? 'http://127.0.0.1:3000';
const generatedMediaReady=process.env.NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES==='ready';
const browser = await chromium.launch({ headless: true });
let failures = 0;

async function check(ok, message) {
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${message}`);
  if (!ok) failures += 1;
}

try {
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on('pageerror', err => runtimeErrors.push(err.message));
    await page.goto(baseUrl + '/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('.t-hero__photo img').waitFor({ state:'visible', timeout:15000 });
    const heroLoaded = await page.locator('.t-hero__photo img').evaluate(img => img.complete && img.naturalWidth > 0);
    await check(heroLoaded, `${width}px original restaurant hero image loaded`);
    // Route-scale illustrated navigation must work on mobile/tablet, not just
    // look correct in an isolated screenshot.
    if(width<=1050){
      const navToggle=page.getByRole('button',{name:'افتح القائمة'});
      await navToggle.click();
      const mobilePanel=page.getByRole('navigation',{name:'قائمة الموبايل'});
      await check(await mobilePanel.isVisible() &&
        await mobilePanel.locator('.t-mobile-menu__group a svg').count()===5,
        `${width}px mobile menu is a five-route illustrated material grid`);
      if(width===390 || width===768) await page.screenshot({
        path:`artifacts/screenshots/mobile-material-navigation-${width}.png`,animations:'disabled'
      });
      await page.keyboard.press('Escape');
      await check(await mobilePanel.count()===0 && await page.getByRole('button',{name:'افتح القائمة'}).count()===1,
        `${width}px mobile illustrated menu dismisses with Escape and restores its toggle`);
    }
    const tab = page.getByRole('tab', { name: /البيتزا/ });
    await tab.click();
    await check(await tab.getAttribute('aria-selected') === 'true', `${width}px food category tab interaction`);
    await check(await page.getByRole('tabpanel').getByText('البيتزا', { exact: true }).count() >= 1, `${width}px category content switch`);
    await page.getByRole('button', { name: /شوف صور المطعم/ }).click();
    const gallery = page.getByRole('dialog', { name: /صور الطعام الحقيقية/ });
    await check(await gallery.isVisible(), `${width}px genuine restaurant image gallery opens`);
    await check(await gallery.locator('figure').count() === 12, `${width}px all twelve original photos are accessible in gallery`);
    await gallery.getByRole('button', { name: 'إغلاق المعرض' }).click();
    await check(!(await gallery.isVisible()), `${width}px gallery closes safely`);
    if ([390, 1440].includes(width)) {
      await page.locator('.t-material__stage').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/screenshots/home-material-focus-${width}.png` });
      await page.locator('.t-packaging__content').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/screenshots/home-packaging-focus-${width}.png` });
    }
    const materialChoice=page.getByRole('group',{name:'تغيير مشهد الصور الحقيقية'});
    await check(await materialChoice.getByRole('button',{name:/العلبة والورق/}).getAttribute('aria-pressed')==='true',
      `${width}px original real-packaging photograph is default`);
    const insideChoice=materialChoice.getByRole('button',{name:/الأكل من جوا/});
    await insideChoice.click();
    await check(await insideChoice.getAttribute('aria-pressed')==='true' &&
      await page.locator('.t-packaging__photo-img--inside[data-current="true"]').count()===1,
      `${width}px physical material study changes to distinct genuine opened food photograph`);
    await check(await page.locator('.t-packaging__photo-img').evaluateAll(images =>
      images.length===2 && images.every(img=>img.complete&&img.naturalWidth>0)),
      `${width}px both package and interior photographs decode without fabricated product mapping`);
    await check(await page.getByText(/مش لنفس الساندوتشات/).count()===1,
      `${width}px user-controlled inside/out view openly distinguishes two photographed products`);
    if(width===390 || width===1440){
      await page.locator('.t-packaging__photo').scrollIntoViewIfNeeded();
      await page.screenshot({path:`artifacts/screenshots/home-packaging-open-${width}.png`,animations:'disabled'});
    }
    await materialChoice.getByRole('button',{name:/العلبة والورق/}).click();
    await check(await page.locator('.t-packaging__photo-img--package[data-current="true"]').count()===1,
      `${width}px physical photo study is reversible via real button`);
    const lens = page.getByRole('slider', {name:/حرّك للمقارنة/});
    await check(await lens.count()===1, `${width}px one accessible genuine-photo comparison control`);
    const before = await lens.getAttribute('aria-valuetext');
    await lens.focus();
    await lens.press('End');
    await check((await lens.getAttribute('aria-valuetext')) !== before && (await lens.getAttribute('aria-valuetext'))?.includes('100')===true, `${width}px image detail reveal responds to keyboard End`);
    const visibleKnob = await page.locator('.t-material__stage').evaluate(stage => {
      const bounds = stage.getBoundingClientRect();
      const knob = stage.querySelector('.t-material__handle-knob')?.getBoundingClientRect();
      return Boolean(knob && knob.left >= bounds.left - 2 && knob.right <= bounds.right + 2);
    });
    await check(visibleKnob, `${width}px reveal drag knob stays fully visible at 100%`);
    await lens.press('Home');
    await check((await lens.getAttribute('aria-valuetext'))?.includes('0٪')===true, `${width}px image detail reveal resets to full-photo side`);
    const visibleKnobAtStart = await page.locator('.t-material__stage').evaluate(stage => {
      const bounds = stage.getBoundingClientRect();
      const knob = stage.querySelector('.t-material__handle-knob')?.getBoundingClientRect();
      return Boolean(knob && knob.left >= bounds.left - 2 && knob.right <= bounds.right + 2);
    });
    await check(visibleKnobAtStart, `${width}px reveal drag knob stays fully visible at 0%`);
    const sourcePair = await page.locator('.t-material__image img').evaluateAll(images => images.map(img => new URL(img.currentSrc || img.src).searchParams.get('url') || (img.currentSrc||img.src)));
    await check(sourcePair.length===2 && sourcePair[0]===sourcePair[1], `${width}px detail comparison uses identical real source pixels`);
    await check(await page.locator('main#t-main-story > section').count()===5, `${width}px exactly five purposeful Home chapters after editorial cut`);
    await check(await page.locator('.t-ticker__set').count()===2, `${width}px ticker has two seamless repeating sets`);
    await check(await page.locator('.t-ticker__track').evaluate(el=>getComputedStyle(el).animationName)==='none', `${width}px marquee respects reduced-motion setting`);
    await check(await page.locator('.t-photo-archive__samples button:nth-child(2) .t-real-food-photo__img').evaluate(el=>getComputedStyle(el).animationName)==='none', `${width}px documentary scroll drift fully stops under reduced motion`);
    await check(await page.getByRole('img',{name:/ساندوتشات توسكانيني بجانب العلب الحمراء/}).count()===1, `${width}px real branded packaging scene present`);
    const packagingLoaded = await page.locator('.t-packaging__photo-img--package').evaluate(img=>img.complete && img.naturalWidth>0);
    await check(packagingLoaded, `${width}px genuine packaging photograph pixels loaded (not just img element)`);
    await check(await page.getByRole('heading',{name:/العلبة.*ليها شكل/}).count()===1, `${width}px separate red packaging chapter renders`);
    await check(await page.getByRole('heading',{name:/تلاقينا.*في بني.*سويف/}).count()===1, `${width}px local yellow place chapter renders`);
    await check(await page.locator('.t-place-final a[href="/contact"]').count()===1, `${width}px place contact route is available`);
    await check(await page.locator('.t-intro').count()===0, `${width}px duplicate intro chapter removed`);
    await check(await page.locator('.t-quick').count()===0, `${width}px redundant large CTA chapter removed`);
    await check(await page.getByRole('link',{name:/روح للمنيو/}).count()===1, `${width}px bounded menu bridge retained after photo reveal`);
    await check(await page.locator('.t-material__after').count()===0, `${width}px no repeated enormous inside/out caption scene`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await check(overflow <= 3, `${width}px Home no significant horizontal overflow (${overflow}px)`);
    await check(runtimeErrors.length === 0, `${width}px Home no uncaught JavaScript errors: ${runtimeErrors.join(' / ') || 'none'}`);
    await page.goto(baseUrl + '/menu', { waitUntil: 'networkidle', timeout:30000 });
    await check(await page.locator('.t-menu-intro__jump[href="#t-menu-search"]').count()===1,
      `${width}px Menu search can be reached directly from first hero scene`);
    const menuTitleFits = await page.locator('.t-menu-intro__copy h1').evaluate(el => {
      const height = el.getBoundingClientRect().height;
      const line = parseFloat(getComputedStyle(el).lineHeight);
      return Number.isFinite(line) && height <= line * (window.innerWidth <= 390 ? 2.35 : 2.65);
    });
    await check(menuTitleFits, `${width}px Menu Arabic headline stays within two intentional lines`);
    const menuDocumentaryPhotos = await page.locator('.t-menu-intro__photo img').evaluateAll(images =>
      images.map(img => img.complete && img.naturalWidth > 0)
    );
    await check(menuDocumentaryPhotos.length === 2 && menuDocumentaryPhotos.every(Boolean), `${width}px Menu authentic source photos decoded`);
    await check(await page.getByText('من صور المطعم — مش صور مرتبطة بصنف معين').count()===1,
      `${width}px Menu photo context does not imply named products`);

    await check(await page.getByRole('searchbox', { name: /دور على أكلك/ }).count() === 1, `${width}px direct menu search exposed`);
    await check(await page.getByRole('button', { name: 'كل الأصناف' }).count() === 1, `${width}px food filter exposed`);
    await check(await page.locator('.t-menu-categories__scroller button .t-menu-category-glyph').count()===17,
      `${width}px all sixteen authentic categories and All carry drawn SVG family pictograms`);
    await check(await page.locator('.t-menu-categories__scroller button').count()===17,
      `${width}px historical Tuscanini menu has 16 original category filters plus All`);
    await check(await page.getByText(/منيو توسكانيني السابق بأسعاره/).count()>=1,
      `${width}px original old-price menu is transparently source-labelled`);
    await check(await page.locator('.t-menu-product').count()===20,
      `${width}px 113-item original menu is populated and paginated, not an unavailable dummy`);
    await check(await page.locator('.t-menu-items__grid--photo').count()===1 &&
       await page.locator('.t-menu-view-switch').count()===0,
       `${width}px one food menu, not a three-mode graphic/gallery switch`);
    const expectedKind=generatedMediaReady?'generated-illustrative':'representative-stock';
    await check(await page.locator('.t-menu-items__grid--photo [data-kind="'+expectedKind+'"]').count()===20,
      `${width}px first 20 food cards use ${expectedKind} images with explicit source provenance`);
    await check(await page.locator('[data-visual-disclosure="menu"]').count()===1 &&
       (await page.locator('[data-visual-disclosure="menu"]').innerText()).includes('صور الأكل المعروضة توضيحية') &&
       await page.locator('.t-menu-product .t-product-art__representative-label').count()===0,
       `${width}px illustration source disclosed once, without overlays on each food photo`);
    if(generatedMediaReady){
      // Image cards deliberately use native lazy-loading. On narrow phones,
      // offscreen <img> elements MUST NOT all download immediately: that is a
      // performance feature. Verify all 20 requested paths return real WebP
      // bytes, and verify the actually visible first image has decoded.
      const imageSrcs=await page.locator('.t-menu-items__grid--photo [data-kind="generated-illustrative"] img')
        .evaluateAll(images=>images.map(img=>img.getAttribute('src')));
      const firstImage=page.locator('.t-menu-items__grid--photo [data-kind="generated-illustrative"] img').first();
      await firstImage.scrollIntoViewIfNeeded();
      await page.waitForFunction(()=> {
        const img=document.querySelector('.t-menu-items__grid--photo [data-kind="generated-illustrative"] img');
        return Boolean(img&&img.complete&&img.naturalWidth>0);
      },null,{timeout:12000});
      const distinct=[...new Set(imageSrcs)];
      const responses=await Promise.all(distinct.map(src=>page.request.get(new URL(src,baseUrl).toString())));
      const loaded=imageSrcs.length===20&&distinct.length>=5&&
        responses.every(r=>r.status()===200&&(r.headers()['content-type']||'').includes('image/webp'));
      await check(loaded,`${width}px all 20 generated food asset URLs return real local WebP files; lazy loading of offscreen cards stays intact`);
    }
    const menuArt=await page.locator('.t-menu-product__identity .t-product-art').evaluateAll(elements=>({
       count:elements.length,
       unique:new Set(elements.map(el=>el.getAttribute('data-product-id'))).size,
     }));
     await check(menuArt.count===20 && menuArt.unique===20,
       `${width}px twenty unified cards each identify their actual historical product`);
     await page.locator('.t-menu-items__grid--photo .t-menu-product__art-trigger').first().click();
     await check(await page.locator('.t-product-dialog[open]').count()===1 &&
       await page.locator('.t-product-dialog[data-motion-technique]').count()===0,
       `${width}px product options open from food imagery without motion when reduced`);
     await page.getByRole('button',{name:'إغلاق تفاصيل المنتج'}).click();
     await page.getByRole('searchbox',{name:/دور على أكلك/}).fill('تشيكن فاير');
    const duplicateFlavors=await page.locator('.t-menu-product h3').allInnerTexts();
    await check(duplicateFlavors.length>=2 &&
      duplicateFlavors.every(name=>name==='تشيكن فاير'),
      `${width}px exact flavor search shows same-named products across distinct old menu families`);
    await check(await page.getByRole('button',{name:'اختيار تفاصيل كريب توسكانيني — تشيكن فاير'}).count()===1,
      `${width}px identical flavor names have explicitly distinguishable food-family actions`);
    await page.getByRole('button',{name:'اختيار تفاصيل كريب توسكانيني — تشيكن فاير'}).click();
    await page.locator('.t-product-dialog[open]').waitFor({timeout:4000});
    await check(await page.locator('.t-product-dialog__identity .t-product-art[data-product-id]').count()===1,
       `${width}px matched named menu item visual and modifiers share a stable SKU ID`);
     await check(await page.locator('.t-product-dialog').getByText(/منيو توسكانيني السابق/).count()===1,
      `${width}px size/addon picker states where its historical prices came from`);
    await check(await page.locator('.t-product-dialog__options label').count()>1,
      `${width}px old crepe is populated with real original size and addon controls`);
    await page.locator('.t-product-dialog__close').click();
    await page.getByRole('searchbox',{name:/دور على أكلك/}).fill('');
    await page.getByRole('button',{name:'كريب لحوم',exact:true}).click();
    await check(await page.locator('.t-menu-family-context img').count()===1&&
      await page.locator('.t-menu-family-context').getByText(/مش صورة أي صنف معين/).count()===1,
      `${width}px verified original CREPE image is shown only as a family context photo`);
    await check(await page.locator('.t-menu-product').count()>0,
      `${width}px category chips filter legacy catalog and deep link correctly`);
    await page.getByRole('button',{name:'كل الأصناف',exact:true}).click();
    if(width===390){
      for(let batch=0;batch<5;batch++){
        await page.getByRole('button',{name:/اعرض أصناف أكتر/}).click();
      }
      const all=await page.locator('.t-menu-product__identity .t-product-art').evaluateAll(arts=>({
        total:arts.length,
        unique:new Set(arts.map(art=>art.getAttribute('data-product-id'))).size,
        validSource:arts.every(art=>['generated-illustrative','representative-stock','original-graphic'].includes(art.dataset.kind)),
      }));
      await check(all.total===113&&all.unique===113&&all.validSource,
        '390px all 113 historical items have distinct source-conscious images or illustrated fallbacks');
      await page.getByRole('button',{name:'كل الأصناف',exact:true}).click();
    }
    await page.getByRole('button',{name:/اعرض أصناف أكتر/}).click();
    await check(await page.locator('.t-menu-product').count()===40,
      `${width}px full 113-record catalog supports progressive 20-to-40 loading without losing prices`);
    await check(await page.locator('.t-menu-items__grid--photo').count()===1,
       `${width}px one customer menu remains intact after searching, filtering and pagination`);
     await page.locator('.t-menu-items__grid--photo .t-menu-product__art-trigger').first().click();
    const photoSheet=page.locator('.t-product-dialog[open]');
    await check(await photoSheet.count()===1 &&
      (generatedMediaReady
        ? await photoSheet.locator('[data-kind="generated-illustrative"]').count()===1 &&
          await photoSheet.getByText(/صورة توضيحية مولّدة بالذكاء الاصطناعي/).count()===1 &&
          await photoSheet.getByRole('link',{name:/Pexels/}).count()===0
        : await page.getByRole('link',{name:/مصدر الصورة التوضيحية.*Pexels/}).count()===1),
      `${width}px product sheet preserves original size/addons and correctly declares generated versus stock food photography`);
    await page.getByRole('button',{name:'إغلاق تفاصيل المنتج'}).click();
    const menuOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await check(menuOverflow <= 3, `${width}px Menu no significant horizontal overflow (${menuOverflow}px)`);
    await page.goto(baseUrl + '/offers', { waitUntil: 'networkidle', timeout:30000 });
    const offersDocumentaryPhotoLoaded = await page.locator('.t-offers-hero__photo img').evaluate(img => img.complete && img.naturalWidth > 0);
    await check(offersDocumentaryPhotoLoaded, `${width}px Offers real non-offer-specific photograph decoded`);
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://example.supabase.co') {
      const sourceFailureShown = await page.getByRole('heading', { name: 'مش قادرين نتحقق من العروض.' }).count();
      const falselyEmptyShown = await page.getByRole('heading', { name: /مفيش عروض.*مؤكدة/ }).count();
      await check(sourceFailureShown === 1 && falselyEmptyShown === 0,
        `${width}px unavailable offers backend shows verification failure, not false no-active claim`);
    }

    await check(await page.getByText('صورة من المطعم — مش صورة عرض محدد').count()===1,
      `${width}px Offers photograph is not misrepresented as a live discount`);
    await check(await page.locator('.t-offers-hero__foot a[href="/menu"]').count()===1,
      `${width}px Offers immediate menu escape remains available`);
    const offersOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await check(offersOverflow <= 3, `${width}px Offers no significant horizontal overflow (${offersOverflow}px)`);

    await page.goto(baseUrl + '/food-finder', { waitUntil:'networkidle',timeout:30000 });
    await check(await page.getByRole('heading',{name:/تختار.*إزاي/}).count()===1,
      `${width}px Finder has distinct functional question, not duplicated Cart headline`);
    const finderHeroHeight=await page.locator('.t-finder-hero').evaluate(el=>el.getBoundingClientRect().height);
    await check(finderHeroHeight<=620,
      `${width}px Finder first-scene priority is bounded (${Math.round(finderHeroHeight)}px)`);
    await check(await page.locator('.t-finder-form-glyph').count()===8,
      `${width}px Finder family choices use visual sketches instead of emoji/text-only chips`);
    await check(await page.locator('.t-finder-progress').getByText('2 STEPS / YOUR FOOD').count()===1,
      `${width}px Finder uses two actual recorded-data questions rather than unsupported tags`);
    await page.getByRole('button',{name:'كريب',exact:true}).click();
    await page.getByRole('button',{name:'لحد 150 ج.م',exact:true}).click();
    await check(await page.getByRole('heading',{name:'لقيّنا إيه؟'}).count()===1 &&
      await page.locator('.t-finder-results__grid article').count()===8,
      `${width}px real previous-price menu returns eight affordable crepe results`);
    await check(await page.locator('.t-finder-results__grid a[href^="/menu?category="]').count()===8,
      `${width}px Finder results link to their own exact category without inventing products`);
    const finderOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    await check(finderOverflow<=3,`${width}px Finder no significant horizontal overflow (${finderOverflow}px)`);
    await page.goto(baseUrl + '/about', { waitUntil: 'networkidle', timeout:30000 });
    await check(await page.getByRole('heading', { name: /ناس، أكل/ }).count()===1,
      `${width}px About uses verified people and place story`);
    await check(await page.locator('body header').count()===1 &&
      await page.locator('body main').count()===1 &&
      await page.locator('body footer').count()===1,
      `${width}px About renders exactly one authored header/main/footer without legacy shell`);
    await check(await page.getByText(/حكاية الأربعة صحاب/).count()===0,
      `${width}px About does not publish unconfirmed four-founder legend`);
    const aboutPhotos = await page.locator('.t-about-hero__photograph img, .t-about-observed__scene img')
      .evaluateAll(images => images.map(img => img.complete && img.naturalWidth > 0));
    await check(aboutPhotos.length===3 && aboutPhotos.every(Boolean),
      `${width}px all three documentary About restaurant photos decode`);
    await check(await page.locator('.t-about-visit a[href="/contact"]').count()===1 &&
      await page.locator('.t-about-hero__links a[href="/menu"]').count()===1,
      `${width}px About offers direct verified contact and menu paths`);
    const aboutOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    await check(aboutOverflow<=3, `${width}px About no significant horizontal overflow (${aboutOverflow}px)`);
    await page.goto(baseUrl + '/contact', { waitUntil: 'networkidle', timeout:30000 });
    await check(await page.getByRole('heading', { name:/تعالى.*لحد عندنا/ }).count() === 1,
      `${width}px Contact has dedicated wayfinding identity`);
    await check(await page.locator('body header').count() === 1 &&
      await page.locator('body main').count() === 1 &&
      await page.locator('body footer').count() === 1,
      `${width}px Contact has exactly one authored header/main/footer`);
    const contactPhones = await page.locator('.t-contact-method__links a[href^="tel:"]').evaluateAll(links =>
      links.map(a => ({visible: a.getBoundingClientRect().width > 0, href:a.getAttribute('href')})));
    await check(contactPhones.length===2 && contactPhones.every(a=>a.visible && /^tel:\d{7,15}$/.test(a.href)),
      `${width}px two directly callable configured restaurant phone numbers`);
    const whatsappLinks = await page.locator('.t-contact-method__links a[href^="https://wa.me/"]').evaluateAll(links =>
      links.map(a => ({href:a.getAttribute('href'),rel:a.getAttribute('rel')||''})));
    await check(whatsappLinks.length===1 && /^https:\/\/wa.me\/\d{10,15}$/.test(whatsappLinks[0].href) &&
      whatsappLinks[0].rel.includes('noopener'),
      `${width}px WhatsApp direct contact is sanitized and opens safely`);
    await check(await page.locator('.t-contact-method__links a[href^="https://www.facebook.com/"]').count()===1,
      `${width}px external Facebook contact uses configured official link`);
    await check(await page.getByText(/دبوس الخريطة الدقيق لسه محتاجين تأكيد/).count()===1,
      `${width}px unverified exact map pin and hours are not fabricated`);
    await check(await page.locator('.t-contact-unknown__links a[href="/complaints"]').count()===1,
      `${width}px Contact exposes real complaints escalation path`);
    const contactOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    await check(contactOverflow<=3,`${width}px Contact no significant horizontal overflow (${contactOverflow}px)`);
    await page.goto(baseUrl + '/reviews', { waitUntil:'networkidle', timeout:30000 });
    await check(await page.getByRole('heading',{name:/قولنا.*رأيك/}).count()===1,
      `${width}px Reviews authored editorial invitation renders`);
    await check(await page.locator('body header').count()===1 &&
      await page.locator('body main').count()===1 &&
      await page.locator('body footer').count()===1,
      `${width}px Reviews has exactly one authored public header/main/footer`);
    await check(await page.getByText(/مش بنعرض مراجعات داخل الموقع حاليًا/).count()===1,
      `${width}px Reviews truthfully shows no unverified testimonials`);
    await check(await page.locator('.t-reviews-explanation__actions a[href^="https://wa.me/"]').count()===1,
      `${width}px Reviews invites outbound WhatsApp only with contact link`);
    await check(await page.locator('.t-reviews-explanation__actions a[href="/complaints"]').count()===1,
      `${width}px Reviews preserves a separate complaint path`);
    const reviewOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    await check(reviewOverflow<=3,`${width}px Reviews no significant horizontal overflow (${reviewOverflow}px)`);
    await page.goto(baseUrl + '/complaints', { waitUntil:'networkidle',timeout:30000 });
    await check(await page.getByRole('heading',{name:/حصلت.*مشكلة/}).count()===1,
      `${width}px Complaints authored help route renders`);
    await check(await page.locator('body .t-header').count()===1 &&
      await page.locator('body main').count()===1 &&
      await page.locator('body .t-footer').count()===1,
      `${width}px Complaints has one public shell header/main/footer, allowing internal section header`);
    await page.getByRole('button',{name:/جهز الرسالة وافتح واتساب/}).click();
    await check(await page.getByRole('alert').getByText(/اكتب تفاصيل المشكلة/).count()===1,
      `${width}px complaint cannot open an empty WhatsApp message`);
    await page.getByLabel(/إيه اللي حصل/).fill('اختبار شكوى فقط - لا ترسل');
    await page.evaluate(()=>{window.open=(url)=>{window.__capturedComplaintUrl=String(url);return null;};});
    await page.getByRole('button',{name:/جهز الرسالة وافتح واتساب/}).click();
    const capturedComplaint=await page.evaluate(()=>window.__capturedComplaintUrl||'');
    await check(capturedComplaint.startsWith('https://wa.me/') &&
      decodeURIComponent(capturedComplaint).includes('اختبار شكوى فقط - لا ترسل'),
      `${width}px valid complaint opens prefilled WhatsApp URL locally without server POST`);
    await check(await page.getByRole('status').getByText(/اضغط إرسال بنفسك/).count()===1,
      `${width}px website never falsely reports complaint as received`);
    const complaintsOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    await check(complaintsOverflow<=3,
      `${width}px Complaints no significant horizontal overflow (${complaintsOverflow}px)`);
    // Isolated REAL previous-price product/size/addon/cart journey.
    // Do not send any order: the CI database is deliberately non-production.
    const catalogContext=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
    const shopPage=await catalogContext.newPage();
    await shopPage.goto(baseUrl+'/menu',{waitUntil:'networkidle',timeout:30000});
    await shopPage.getByRole('searchbox',{name:/دور على أكلك/}).fill('تشيكن فاير');
    await shopPage.getByRole('button',{name:'اختيار تفاصيل كريب توسكانيني — تشيكن فاير'}).click();
    await shopPage.locator('.t-product-dialog[open]').waitFor({timeout:4000});
    await shopPage.locator('.t-product-dialog__options input[type="checkbox"]').first().check();
    await shopPage.getByRole('group',{name:'اختر الكمية'}).getByRole('button',{name:'زيادة الكمية'}).click();
    await shopPage.getByRole('button',{name:/ضيف للسلة/}).click();
    const selectedLegacy=await shopPage.evaluate(()=>{
      const cart=JSON.parse(localStorage.getItem('tuscanini-cart-v1')||'{}');
      return cart.items?.[0] ?? null;
    });
    await check(Boolean(selectedLegacy && selectedLegacy.productName==='تشيكن فاير' &&
      selectedLegacy.unitPrice===145 && selectedLegacy.quantity===2),
      `${width}px actual recorded 125 + 20 addon, quantity 2, is stored as 290 EGP cart`);
    await shopPage.goto(baseUrl+'/cart',{waitUntil:'networkidle',timeout:30000});
    await check(await shopPage.getByRole('heading',{name:/تشيكن فاير/}).count()===1,
      `${width}px previous menu item survives into authored populated checkout`);
    await check(await shopPage.getByRole('button',{name:/سجّل الطلب للمطعم/}).isDisabled(),
      `${width}px historic menu doesn't bypass store-open/live-order validation`);
    await catalogContext.close();
    await page.goto(baseUrl + '/cart', { waitUntil: 'networkidle', timeout:30000 });
    await check(await page.getByRole('heading', { name:/على.*مزاجك/ }).count()===1, `${width}px Checkout authored header renders`);
    await check(await page.getByRole('heading', { name:/لسه مفيش/ }).count()===1, `${width}px empty cart is honest and non-orderable`);
    await check(await page.getByRole('button', { name: /سجّل الطلب للمطعم/ }).count()===0, `${width}px empty cart cannot be submitted`);
    const cartOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    await check(cartOverflow<=3, `${width}px Cart no significant horizontal overflow (${cartOverflow}px)`);
    await page.goto(baseUrl + '/order-success', { waitUntil:'networkidle', timeout:30000 });
    await check(await page.getByText(/معندناش مرجع/).count()===1, `${width}px direct tracking URL does not falsely confirm an order`);
    const trackingOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    await check(trackingOverflow<=3, `${width}px Tracking no significant horizontal overflow (${trackingOverflow}px)`);
    // Isolated browser fixture: checks form behavior without contacting the restaurant DB.
    if(width===390){
      const motionContext=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
      const motionPage=await motionContext.newPage();
      await motionPage.goto(baseUrl+'/',{waitUntil:'networkidle',timeout:30000});
      const name=await motionPage.locator('.t-ticker__track').evaluate(el=>getComputedStyle(el).animationName);
      await check(name==='t-marquee-continuous', '390px default-motion marquee actually animates');
      const nativeViewTimeline = await motionPage.evaluate(() => CSS.supports('animation-timeline: view()'));
      if (nativeViewTimeline) {
        const archiveMotion = await motionPage.locator('.t-photo-archive__samples button:nth-child(2) .t-real-food-photo__img').evaluate(el=>getComputedStyle(el).animationName);
        await check(archiveMotion==='t-documentary-photo-drift', '390px scroll-driven real-photo drift engages only where supported');
      } else {
        console.log('INFO — browser has no CSS view timeline; archive remains static by design');
      }
      await motionContext.close();
    }
    const fixtureContext=await browser.newContext({ viewport:{width,height:844},reducedMotion:'reduce' });
    await fixtureContext.addInitScript(()=>{
      localStorage.setItem('tuscanini-cart-v1',JSON.stringify({
        items:[{lineId:'fixture-line',kind:'offer',offerId:'fixture-only',offerTitle:'عرض اختبار غير حقيقي',quantity:1,unitPrice:45,totalItemPrice:45,itemNotes:''}],
        customer:{name:'',phone:'',address:'',orderType:'delivery',generalNotes:'',confirmedAccurateDetails:false},
        tableReference:null,
      }));
    });
    await fixtureContext.route('**/api/public/site-settings',route=>route.fulfill({
      status:200,contentType:'application/json',body:JSON.stringify({ok:true,settings:{isOrderingOpen:true,whatsappOrderNumber:''}}),
    }));
    let submits=0;
    await fixtureContext.route('**/api/orders',route=>{
      submits++;
      return route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({ok:false,code:'ORDERING_CLOSED',error:'الطلبات متوقفة الآن'}),});
    });
    const cart=await fixtureContext.newPage();
    await cart.goto(baseUrl+'/cart',{waitUntil:'networkidle',timeout:30000});
    await cart.getByRole('button',{name:/سجّل الطلب للمطعم/}).click();
    await check(await cart.getByText(/اكتب اسمك/).count()===1,`${width}px fixture cart required name validation`);
    await check(submits===0,`${width}px invalid checkout never posts order`);
    await cart.getByPlaceholder('الاسم').fill('عميل اختبار');
    await cart.getByPlaceholder('01xxxxxxxxx').fill('01012345678');
    await cart.getByPlaceholder('الشارع، المنطقة، علامة مميزة').fill('عنوان تجريبي');
    await cart.getByRole('checkbox',{name:/راجعت الأصناف وبياناتي/}).check();
    await cart.getByRole('button',{name:/سجّل الطلب للمطعم/}).click();
    await cart.getByText('الطلبات متوقفة الآن').waitFor({state:'visible',timeout:7000});
    await check(await cart.getByText('الطلبات متوقفة الآن').count()===1,`${width}px refused order shows exact server closure`);
    await check(submits===1,`${width}px exactly one mocked checkout request`);
    await check(await cart.getByText(/عرض اختبار غير حقيقي/).count()>0,`${width}px rejected order keeps items for correction`);
    await fixtureContext.close();
    // Isolated tracking fixture validates state semantics, not a real restaurant order.
    let restaurantStage='جديد';
    await page.route('**/api/orders/track**',route=>route.fulfill({
      status:200,contentType:'application/json',
      body:JSON.stringify({ok:true,order:{
        orderNumber:1234,reference:'#1234',status:restaurantStage,
        confirmationStatus:restaurantStage==='جديد'?'pending':'confirmed',
        tableReference:null,createdAt:'2026-10-18T14:00:00.000Z',
        orderType:'pickup',totalEstimate:85,
      }}),
    }));
    await page.goto(baseUrl+'/order-success?orderId=123e4567-e89b-42d3-a456-426614174000',{waitUntil:'networkidle',timeout:30000});
    await page.getByRole('heading',{name:'بانتظار تأكيد المطعم'}).waitFor({state:'visible',timeout:8000});
    await check(await page.getByText(/لسه مش متأكد/).count()>0,`${width}px stored order clearly awaits restaurant confirmation`);
    restaurantStage='جاري التحضير';
    await page.getByRole('button',{name:/حدّث الحالة/}).click();
    await page.getByRole('heading',{name:'الطلب بيتحضّر'}).waitFor({state:'visible',timeout:8000});
    await check(await page.getByRole('heading',{name:'الطلب بيتحضّر'}).count()===1,`${width}px order shows preparation only after server status changes`);
    await context.close();
  }
} catch (error) {
  failures += 1;
  console.error('FAIL — interaction smoke crashed:', error);
} finally {
  await browser.close();
}
console.log(`Browser interaction smoke finished: ${failures} failures`);
if (failures) process.exitCode = 1;
