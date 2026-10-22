import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(20000);
await page.goto('https://desalermos-website.web.app/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const sections = await page.locator('main > section').count();
console.log('sections', sections);
for (let i = 0; i < sections; i++) {
  const section = page.locator('main > section').nth(i);
  const box = await section.boundingBox();
  if (!box) continue;
  console.log(i, Math.round(box.height));
  if (box.height > 1400) continue;
  await section.screenshot({ path: `preview-feedback/home-section-${i}.png` });
}
await browser.close();
