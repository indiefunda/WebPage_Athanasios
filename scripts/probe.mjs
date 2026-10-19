import { chromium } from 'playwright-core';

const base = 'http://127.0.0.1:4321';
const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});

// 320 header
{
  const context = await browser.newContext({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const info = await page.evaluate(() => {
    const act = document.querySelector('.header-actions').getBoundingClientRect();
    return { actionsRight: act.right, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth };
  });
  console.log('320 header:', info);
  await page.screenshot({ path: '_shots/320-header.png', clip: { x: 0, y: 0, width: 320, height: 150 } });
  await context.close();
}

// 1920 home
{
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: '_shots/1920-hero.png' });
  const hero = await page.evaluate(() => {
    const title = document.querySelector('.hero__title').getBoundingClientRect();
    const media = document.querySelector('.hero__media').getBoundingClientRect();
    return { titleRight: title.right, mediaLeft: media.left, height: document.querySelector('.hero').getBoundingClientRect().height };
  });
  console.log('1920 hero:', hero);
  await context.close();
}

// mobile menu
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.click('[data-menu-open]');
  await page.waitForTimeout(700);
  await page.screenshot({ path: '_shots/menu-open.png' });
  await context.close();
}

// 404
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${base}/this-page-does-not-exist`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '_shots/404.png' });
  await context.close();
}

// news article
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${base}/nea/dysforia-fouskoma-koilia`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: '_shots/news-article.png', fullPage: true });
  await context.close();
}

// form fill + submit
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${base}/epikoinonia#rantevou`, { waitUntil: 'networkidle' });
  await page.fill('#cf-name', 'Δοκιμαστικός Χρήστης');
  await page.fill('#cf-email', 'test@example.com');
  await page.fill('#cf-phone', '6900000000');
  await page.selectOption('#cf-subject', 'Ραντεβού');
  await page.fill('#cf-message', 'Θα ήθελα να κλείσω ραντεβού.');
  await page.check('input[name="consent"]');
  await page.click('[data-contact-form] button[type="submit"]');
  await page.waitForTimeout(700);
  const status = await page.evaluate(() => document.querySelector('[data-status]')?.textContent?.trim());
  console.log('form submit status:', status, 'errors:', errors);
  await context.close();
}

await browser.close();
