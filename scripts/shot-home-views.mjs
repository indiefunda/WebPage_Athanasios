import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(20000);
await page.goto('https://desalermos-website.web.app/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
for (const i of [1,2,3,5,7,8]) {
  const section = page.locator('main > section').nth(i);
  const box = await section.boundingBox();
  if (!box) continue;
  await page.evaluate((y) => window.scrollTo(0, y - 100), box.y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `preview-feedback/home-view-${i}.png` });
}
// procedure section 4: top and bottom
const proc = page.locator('main > section').nth(4);
const pbox = await proc.boundingBox();
if (pbox) {
  await page.evaluate((y) => window.scrollTo(0, y - 100), pbox.y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'preview-feedback/home-procedures-top.png' });
  await page.evaluate((y) => window.scrollTo(0, y + 900), pbox.y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'preview-feedback/home-procedures-bottom.png' });
}
await browser.close();
