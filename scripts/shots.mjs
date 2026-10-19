/**
 * Screenshots pages of the local dev/preview server for visual QA.
 * Usage: node scripts/shots.mjs [baseUrl] [outDir]
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const base = process.argv[2] || 'http://127.0.0.1:4321';
const outDir = process.argv[3] || '_shots';

const pages = [
  ['home', '/'],
  ['about', '/o-iatros'],
  ['clinic', '/iatreio'],
  ['procedures', '/epemvaseis'],
  ['conditions', '/pathiseis'],
  ['contact', '/epikoinonia'],
  ['news', '/nea'],
  ['condition', '/pathiseis/kaysos-kai-palindromhsh'],
  ['procedure', '/epemvaseis/kolonoskophsh'],
];

const viewports = [
  { name: 'desk', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});

await mkdir(outDir, { recursive: true });

const only = process.env.SHOT_ONLY;

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    isMobile: Boolean(viewport.isMobile),
    hasTouch: Boolean(viewport.hasTouch),
  });
  const page = await context.newPage();
  const errors = [];
  const failed = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
  });

  for (const [name, route] of pages) {
    if (only && !only.split(',').includes(name)) continue;
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);

    // Trigger reveals by walking the page (smooth scrolling would swallow the jumps).
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const step = Math.round(window.innerHeight * 0.5);
      const height = document.documentElement.scrollHeight;
      for (let y = 0; y < height; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = '';
    });
    await page.waitForTimeout(700);

    const file = path.join(outDir, `${name}-${viewport.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const meta = await page.evaluate(() => ({
      title: document.title,
      h1: [...document.querySelectorAll('h1')].map((el) => el.textContent?.trim()),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      height: document.documentElement.scrollHeight,
    }));
    console.log(
      `${file}  ${meta.height}px  overflow=${meta.overflow}  h1=${meta.h1.length}  ${meta.title}`,
    );
    if (errors.length) console.log(`  ERRORS: ${errors.join(' | ')}`);
    if (failed.length) console.log(`  FAILED: ${[...new Set(failed)].join(' | ')}`);
    errors.length = 0;
    failed.length = 0;
  }

  await context.close();
}

await browser.close();
