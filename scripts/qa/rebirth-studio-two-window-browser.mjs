/**
 * Browser proof that the two actual Next.js pages share a single local
 * Postgres order. No real restaurant customer, merchant or payment APIs.
 */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base='http://127.0.0.1:3099',key=process.env.TUSCANINI_STUDIO_OPERATOR_KEY;
assert.ok(key&&key.length>24);
const browser=await chromium.launch({headless:true});
const customer=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
const tablet=await browser.newPage({viewport:{width:1024,height:800},reducedMotion:'reduce'});
try{
  await customer.goto(base+'/studio',{waitUntil:'networkidle'});
  await customer.locator('.t-studio__food input').first().waitFor();
  await customer.locator('.t-studio__food input').first().fill('2');
  await customer.getByRole('button',{name:/سجّل طلب تجربة/}).click();
  await customer.locator('.t-studio__ticket').waitFor({state:'visible',timeout:12000});
  const orderId=await customer.evaluate(()=>window.localStorage.getItem('tuscanini:studio:last-order'));
  assert.match(orderId,/^[0-9a-f-]{36}$/i);
  await customer.getByRole('heading',{name:'اتسجّل الطلب'}).waitFor({timeout:10000});
  await tablet.goto(base+'/operator/orders',{waitUntil:'networkidle'});
  assert.equal(await customer.locator('header.bg-brand-red').count(),0,
    'Customer studio must not inherit the old red sticky navbar'); 
  assert.equal(await tablet.locator('header.bg-brand-red').count(),0,
    'Operator tablet must not inherit public sticky navbar');
  await tablet.getByPlaceholder('Studio operator key').fill(key);
  await tablet.getByRole('button',{name:/حدّث الأوردرات/}).click();
  await tablet.locator('.t-studio__order').filter({hasText:'#'+orderId.slice(0,8).toUpperCase()}).waitFor({timeout:10000});
  const orderCard=tablet.locator('.t-studio__order').filter({hasText:'#'+orderId.slice(0,8).toUpperCase()});
  await orderCard.getByRole('button',{name:'اقبل الأوردر'}).click();
  await customer.getByRole('heading',{name:'المطعم أكّد الطلب'}).waitFor({timeout:12000});
  await orderCard.getByRole('button',{name:'ابدأ التحضير'}).waitFor({timeout:10000});
  await orderCard.getByRole('button',{name:'ابدأ التحضير'}).click();
  await customer.getByRole('heading',{name:'أكلك بيتجهّز'}).waitFor({timeout:12000});
  await customer.locator('.t-studio__events li').nth(2).waitFor({timeout:8000});
  const lineCount=await customer.locator('.t-studio__events li').count();
  assert.equal(lineCount,3);
  const noHorizontalOverflow=await customer.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth + 2);
  assert.ok(noHorizontalOverflow,'Customer tracking must fit within 390px');
  await mkdir('artifacts/screenshots',{recursive:true});
  await customer.screenshot({path:'artifacts/screenshots/studio-customer-tracking-390.png',fullPage:true,animations:'disabled'});
  await tablet.screenshot({path:'artifacts/screenshots/studio-operator-tablet-1024.png',fullPage:true,animations:'disabled'});
  console.log('PASS browser: 390px customer & 1024px tablet control the same PostgreSQL order.');
  console.log('PASS browser: saved → accepted → preparing status and three durable events.');

  // The original artist-designed Rebirth Menu/Cart/Order Success now talks to
  // the very same PostgreSQL operator tablet. This is NOT the toy /studio form.
  const real=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await real.goto(base+'/menu',{waitUntil:'networkidle'});
  await real.getByRole('searchbox',{name:/دور على أكلك/}).fill('تشيكن فاير');
  await real.getByRole('button',{name:'اختيار تفاصيل كريب توسكانيني — تشيكن فاير'}).click();
  await real.locator('.t-product-dialog__options input[type="checkbox"]').first().check();
  await real.getByRole('group',{name:'اختر الكمية'}).getByRole('button',{name:'زيادة الكمية'}).click();
  await real.getByRole('button',{name:/ضيف للسلة/}).click();
  await real.goto(base+'/cart',{waitUntil:'networkidle'});
  await real.getByPlaceholder('الاسم').fill('عميل اختبار من الموقع');
  await real.getByPlaceholder('01xxxxxxxxx').fill('01012345678');
  await real.getByPlaceholder('الشارع، المنطقة، علامة مميزة').fill('عنوان محلي للتجربة فقط');
  await real.getByRole('checkbox',{name:/راجعت الأصناف وبيانات الطلب/}).check();
  await real.getByRole('button',{name:/سجّل الطلب للمطعم/}).click();
  await real.waitForURL(/\/order-success\?orderId=/,{timeout:15000});
  const realId=new URL(real.url()).searchParams.get('orderId');
  assert.match(realId,/^[0-9a-f-]{36}$/i);
  await real.getByRole('heading',{name:'بانتظار تأكيد المطعم'}).waitFor({timeout:12000});
  await tablet.getByRole('button',{name:/حدّث الأوردرات/}).click();
  const realCard=tablet.locator('.t-studio__order').filter({hasText:'#'+realId.slice(0,8).toUpperCase()});
  await realCard.waitFor({timeout:10000});
  assert.match(await realCard.innerText(),/تشيكن فاير/);
  assert.match(await realCard.innerText(),/موتزاريلا/);
  await realCard.getByRole('button',{name:'اقبل الأوردر'}).click();
  await realCard.getByRole('button',{name:'ابدأ التحضير'}).waitFor({timeout:10000});
  await realCard.getByRole('button',{name:'ابدأ التحضير'}).click();
  await real.getByRole('button',{name:/حدّث الحالة/}).click();
  await real.getByRole('heading',{name:'الطلب بيتحضّر'}).waitFor({timeout:12000});
  assert.equal(await real.locator('.t-order-tracking[data-current-status="preparing"]').count(),1);
  const overflow=await real.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  assert.ok(overflow<=3,'Rebirth order ticket must not horizontally overflow on mobile');
  await real.evaluate(()=>window.scrollTo(0,0));
  await real.screenshot({path:'artifacts/screenshots/studio-original-rebirth-tracking-390.png',fullPage:true,animations:'disabled'});
  await tablet.screenshot({path:'artifacts/screenshots/studio-rebirth-order-operator-1024.png',fullPage:true,animations:'disabled'});
  console.log('PASS browser: original Rebirth Menu → custom Cart → Order Success updated by real operator actions.');
  await real.close();

}finally{await browser.close();}
