/**
 * Renders /og-card at 1200x630 and writes public/og.jpg.
 * Run the dev server first, then: node scripts/make-og.mjs [baseUrl]
 */
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] || 'http://127.0.0.1:4321';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});

const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await page.goto(`${base}/og-card`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);

await page.screenshot({
  path: path.join(ROOT, 'public', 'og.jpg'),
  type: 'jpeg',
  quality: 92,
});

console.log('public/og.jpg written (1200x630)');
await browser.close();
