/**
 * Two true visual models with TWENTY varied order tickets.
 * Pure UI fixtures in localhost staging. No external merchant requests.
 */
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true,...(process.env.TUSCANINI_SYSTEM_CHROME==='yes'?{channel:'chrome'}:{})});
await mkdir('artifacts/screenshots',{recursive:true});
try{
  const page=await browser.newPage({viewport:{width:1024,height:768},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:3099/operator/orders?preview=20',{waitUntil:'networkidle'});
  await page.locator('.op-root[data-preview="true"]').waitFor();
  await page.locator('.op-stage').waitFor();
  assert.equal(await page.locator('.op-ticket').count(),1,'Press must focus exactly one order');
  assert.equal(await page.locator('.op-queue-row').count(),19,'19 other orders in the queue');
  assert.equal(await page.locator('.op-pulse__live strong').innerText(),'٢٠','20 orders visible in count');
  assert.ok((await page.locator('.op-allday__counts>div').count())>=3,'All-day aggregation should have active products');
  assert.equal(await page.locator('.op-actions button:not([disabled])').count(),0,'Preview may not act on actual orders');

  const original=await page.locator('.op-ticket__masthead>strong').innerText();
  await page.locator('.op-queue-row').nth(2).click();
  await page.waitForFunction(previous=>
    document.querySelector('.op-stage .op-ticket__masthead>strong')?.textContent?.trim()!==previous,
    original,{timeout:8000});
  const focused=await page.locator('.op-ticket__masthead>strong').innerText();
  assert.notEqual(focused,original,'Press selection must change the focus ticket');
  await page.getByRole('button',{name:'المسرح الرئيسي'}).waitFor();
  await page.screenshot({path:'artifacts/screenshots/press-20-orders-1024.png',fullPage:true,animations:'disabled'});

  await page.getByRole('button',{name:'شريط التذاكر'}).click();
  await page.locator('.op-rail').waitFor();
  assert.equal(await page.locator('.op-rail .op-ticket').count(),20,'Rail must contain all twenty tickets');
  assert.ok(await page.locator('.op-rail__track').evaluate(e=>e.scrollWidth>e.clientWidth),
    'Horizontal scroll must be available without squeezing the tickets');
  await page.screenshot({path:'artifacts/screenshots/ticket-rail-20-orders-1024.png',fullPage:true,animations:'disabled'});
  await page.getByRole('button',{name:'المسرح الرئيسي'}).click();
  await page.locator('.op-stage').waitFor();
  assert.equal(await page.locator('.op-ticket__masthead>strong').innerText(),focused,
    'Switching layout without changing the filter must retain the chosen order');
  await page.getByRole('button',{name:'شريط التذاكر'}).click();
  await page.locator('.op-rail').waitFor();
  await page.getByRole('button',{name:/جديد/}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.op-rail .op-ticket').length===6,null,{timeout:8000});
  assert.equal(await page.locator('.op-rail .op-ticket').count(),6,'Received filter shows exactly six new orders');
  await page.getByRole('button',{name:/كل الطلبات/}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.op-rail .op-ticket').length===20,null,{timeout:8000});
  assert.equal(await page.locator('.op-rail .op-ticket').count(),20);
  await page.getByRole('button',{name:'المسرح الرئيسي'}).click();
  await page.locator('.op-stage').waitFor();
  assert.equal(await page.locator('.op-ticket').count(),1,'Press keeps one focus after filter reset');

  await page.setViewportSize({width:768,height:1024});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3),
    'No viewport horizontal overflow at portrait tablet 768');
  await page.screenshot({path:'artifacts/screenshots/press-20-orders-768.png',fullPage:true,animations:'disabled'});
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3),
    'No viewport horizontal overflow at 390 mobile');
  assert.equal(await page.locator('.op-queue-row').count(),19);
  await page.screenshot({path:'artifacts/screenshots/press-20-orders-390.png',fullPage:true,animations:'disabled'});
  await page.close();
  console.log('PASS: 20-ORDER PRESS / focus + 19 selectable queue items, All Day counts and disabled demo actions.');
  console.log('PASS: 20-ORDER TICKET RAIL / 20 scrollable tickets, 6 new filtered, selection preserved on switch.');
  console.log('PASS: 1024 landscape, 768 portrait and 390 mobile with no horizontal overflow.');
}finally{await browser.close()}
