import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(20000);
const shots = [
  ['https://desalermos-website.web.app/', 'review-home-top', false],
  ['https://desalermos-website.web.app/', 'review-home-full', true],
  ['https://desalermos-website.web.app/o-iatros', 'review-about-top', false],
  ['https://desalermos-website.web.app/iatreio', 'review-clinic-top', false],
  ['https://desalermos-website.web.app/epemvaseis', 'review-procedures-top', false],
  ['https://desalermos-website.web.app/pathiseis', 'review-conditions-top', false],
];
for (const [url, name, fullPage] of shots) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `preview-feedback/${name}.png`, fullPage });
  console.log(name);
}
await browser.close();
