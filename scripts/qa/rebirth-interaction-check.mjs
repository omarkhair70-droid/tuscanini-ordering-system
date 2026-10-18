import { chromium } from 'playwright';

/**
 * Real Chromium interaction smoke: no production Supabase credentials.
 * Does NOT claim that live product checkout, staff permissions or real
 * order submission have been tested.
 */
const baseUrl = process.env.REBIRTH_BASE_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true });
let failures = 0;

async function check(ok, message) {
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${message}`);
  if (!ok) failures += 1;
}

try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const runtimeErrors = [];
    page.on('pageerror', err => runtimeErrors.push(err.message));
    await page.goto(baseUrl + '/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.locator('.t-hero__photo img').waitFor({ state:'visible', timeout:15000 });
    const heroLoaded = await page.locator('.t-hero__photo img').evaluate(img => img.complete && img.naturalWidth > 0);
    await check(heroLoaded, `${width}px original restaurant hero image loaded`);
    const tab = page.getByRole('tab', { name: /البيتزا/ });
    await tab.click();
    await check(await tab.getAttribute('aria-selected') === 'true', `${width}px food category tab interaction`);
    await check(await page.getByRole('tabpanel').getByText('البيتزا', { exact: true }).count() >= 1, `${width}px category content switch`);
    await page.getByRole('button', { name: /شوف صور المطعم/ }).click();
    const gallery = page.getByRole('dialog', { name: /صور الطعام الحقيقية/ });
    await check(await gallery.isVisible(), `${width}px genuine restaurant image gallery opens`);
    await gallery.getByRole('button', { name: 'إغلاق المعرض' }).click();
    await check(!(await gallery.isVisible()), `${width}px gallery closes safely`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await check(overflow <= 3, `${width}px Home no significant horizontal overflow (${overflow}px)`);
    await check(runtimeErrors.length === 0, `${width}px Home no uncaught JavaScript errors: ${runtimeErrors.join(' / ') || 'none'}`);
    await page.goto(baseUrl + '/menu', { waitUntil: 'networkidle', timeout:30000 });
    await check(await page.getByRole('searchbox', { name: /دور على أكلك/ }).count() === 1, `${width}px direct menu search exposed`);
    await check(await page.getByRole('button', { name: 'كل الأصناف' }).count() === 1, `${width}px food filter exposed`);
    const noLiveData = await page.getByText('المنيو مش متاحة حاليًا.').count();
    await check(noLiveData === 1, `${width}px no fabricated historical product prices without live Supabase`);
    const menuOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await check(menuOverflow <= 3, `${width}px Menu no significant horizontal overflow (${menuOverflow}px)`);
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
