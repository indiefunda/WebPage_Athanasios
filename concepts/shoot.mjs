import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const ALL = ['atlas', 'marble', 'nocturne', 'care', 'aegean'];
const names = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

await mkdir(path.join(ROOT, 'shots'), { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});

for (const name of names) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto(pathToFileURL(path.join(ROOT, 'mockups', `${name}.html`)).href, {
    waitUntil: 'networkidle',
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const info = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    width: document.documentElement.scrollWidth,
    fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`),
  }));

  await page.screenshot({ path: path.join(ROOT, 'shots', `${name}.png`) });
  console.log(`${name}: ${info.width}x${info.height}`, errors.length ? errors : 'ok');
  await page.close();
}

await browser.close();
