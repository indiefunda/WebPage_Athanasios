import { chromium } from 'playwright-core';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, 'deck-shots');
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});

const page = await browser.newPage({
  viewport: { width: 1123, height: 794 },
  deviceScaleFactor: 2,
});

const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});

await page.goto(pathToFileURL(path.join(ROOT, 'deck.html')).href, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((img) =>
      img.complete ? Promise.resolve() : new Promise((resolve) => (img.onload = img.onerror = resolve)),
    ),
  );
});
await page.waitForTimeout(600);

const slides = page.locator('.slide');
const count = await slides.count();
console.log(`slides: ${count}`);

for (let i = 0; i < count; i += 1) {
  const file = path.join(OUT, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await slides.nth(i).screenshot({ path: file });
}

const overflow = await page.evaluate(() =>
  [...document.querySelectorAll('.slide')].map((slide, index) => {
    const overflowX = slide.scrollWidth - slide.clientWidth;
    const overflowY = slide.scrollHeight - slide.clientHeight;
    return { index: index + 1, overflowX, overflowY };
  }),
);
console.log('overflow:', overflow.filter((item) => item.overflowX > 1 || item.overflowY > 1));

await page.pdf({
  path: path.join(ROOT, 'Desalermos-Website-Concepts-2026.pdf'),
  preferCSSPageSize: true,
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

console.log('PDF written');
if (errors.length) console.log('ERRORS:', errors);
await browser.close();
