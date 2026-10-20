import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(20000);
for (const [url, prefix] of [
  ['http://localhost:4321/nea/mikrobiwma-enteroy-ti-kseroume', 'gr-microbiome-new'],
  ['http://localhost:4321/en/articles/mikrobiwma-enteroy-ti-kseroume', 'en-microbiome-new'],
]) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  await page.screenshot({ path: `preview-feedback/${prefix}-top.png` });
  const kp = await page.locator('.article-keypoints').first().boundingBox();
  if (kp) {
    await page.evaluate((y) => window.scrollTo(0, y - 120), kp.y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `preview-feedback/${prefix}-keypoints.png` });
  }
  const refs = await page.locator('.article-references').first().boundingBox();
  if (refs) {
    await page.evaluate((y) => window.scrollTo(0, y - 150), refs.y);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `preview-feedback/${prefix}-refs.png` });
  }
  console.log(prefix);
}
await browser.close();
