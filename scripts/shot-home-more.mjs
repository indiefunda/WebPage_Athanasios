import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(20000);
await page.goto('https://desalermos-website.web.app/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
for (const [text, name] of [['Από την Αθήνα', 'home-journey'], ['Ήρεμο, διακριτικό', 'home-clinic'], ['Ενημέρωση για την', 'home-articles']]) {
  const el = page.locator('h2', { hasText: text }).first();
  const box = await el.boundingBox();
  if (box) await page.evaluate((y) => window.scrollTo(0, y - 160), box.y);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `preview-feedback/${name}.png` });
  console.log(name);
}
await browser.close();
