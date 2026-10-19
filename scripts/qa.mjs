/**
 * Site QA: layout at multiple widths, console errors, broken images/links,
 * mobile menu, condition filtering and contact-form validation.
 *
 * Usage: node scripts/qa.mjs [baseUrl]
 */
import { chromium } from 'playwright-core';

const base = process.argv[2] || 'http://127.0.0.1:4321';

const pages = [
  '/',
  '/o-iatros',
  '/iatreio',
  '/pathiseis',
  '/epemvaseis',
  '/nea',
  '/epikoinonia',
  '/apopoiisi',
  '/pathiseis/kaysos-kai-palindromhsh',
  '/pathiseis/nosos-toy-crohn',
  '/epemvaseis/kolonoskophsh',
  '/epemvaseis/axiologisi-oisofagou-me-endoflip',
  '/nea/dysforia-fouskoma-koilia',
  '/404',
];

const widths = [320, 390, 768, 1024, 1440, 1920];

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  headless: true,
});

const problems = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 600 ? 844 : 1000 },
    isMobile: width < 600,
    hasTouch: width < 600,
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });

  for (const path of pages) {
    errors.length = 0;
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });

    const info = await page.evaluate(() => {
      const html = document.documentElement;
      const images = [...document.images];
      const broken = images
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src);
      const missingAlt = images.filter((img) => !img.hasAttribute('alt')).length;
      const h1s = [...document.querySelectorAll('h1')].length;
      const overflowing = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const style = getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'absolute') return false;
          if (style.display === 'none' || style.visibility === 'hidden') return false;
          if (el.closest('.marquee, .proc-grid')) return false;
          const rect = el.getBoundingClientRect();
          return rect.right > html.clientWidth + 2 || rect.left < -2;
        })
        .slice(0, 5)
        .map((el) => `${el.tagName}.${typeof el.className === 'string' ? el.className : ''}`);
      const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      return {
        title: document.title,
        lang: html.lang,
        overflow: html.scrollWidth - html.clientWidth,
        broken,
        missingAlt,
        h1s,
        overflowing,
        duplicateIds: [...new Set(duplicateIds)],
      };
    });

    const status = response?.status();
    if (
      status !== 200 ||
      info.overflow > 1 ||
      info.broken.length ||
      info.missingAlt ||
      info.h1s !== 1 ||
      info.overflowing.length ||
      info.duplicateIds.length ||
      errors.length
    ) {
      problems.push({ width, path, status, ...info, errors: [...errors] });
    }
  }

  await context.close();
}

// Interaction checks at mobile width.
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mobilePage = await mobile.newPage();

await mobilePage.goto(`${base}/`, { waitUntil: 'networkidle' });
await mobilePage.click('[data-menu-open]');
await mobilePage.waitForTimeout(500);
const menuState = await mobilePage.evaluate(() => {
  const dialog = document.querySelector('[data-menu]');
  return {
    open: dialog?.hasAttribute('open') ?? false,
    visibleLinks: dialog ? [...dialog.querySelectorAll('nav a')].filter((a) => a.getBoundingClientRect().height > 0).length : 0,
    bodyLocked: getComputedStyle(document.documentElement).overflow,
  };
});
await mobilePage.screenshot({ path: '_shots/menu-mobile.png' });
await mobilePage.click('[data-menu-close]');
const menuClosed = await mobilePage.evaluate(
  () => !document.querySelector('[data-menu]')?.hasAttribute('open'),
);

await mobilePage.goto(`${base}/pathiseis`, { waitUntil: 'networkidle' });
await mobilePage.fill('[data-search]', 'ήπαρ');
await mobilePage.waitForTimeout(400);
const searchState = await mobilePage.evaluate(() => ({
  visibleRows: [...document.querySelectorAll('[data-condition-row]')].filter((row) => !row.hidden).length,
  visibleGroups: [...document.querySelectorAll('[data-group]')].filter((group) => !group.hidden).length,
  count: document.querySelector('[data-count]')?.textContent?.trim(),
}));

await mobilePage.fill('[data-search]', '');
await mobilePage.click('[data-filter="liver"]');
await mobilePage.waitForTimeout(400);
const filterState = await mobilePage.evaluate(() => ({
  visibleRows: [...document.querySelectorAll('[data-condition-row]')].filter((row) => !row.hidden).length,
  visibleGroups: [...document.querySelectorAll('[data-group]')].filter((group) => !group.hidden).length,
  count: document.querySelector('[data-count]')?.textContent?.trim(),
}));

await mobilePage.goto(`${base}/epikoinonia#rantevou`, { waitUntil: 'networkidle' });
await mobilePage.click('[data-contact-form] button[type="submit"]');
await mobilePage.waitForTimeout(400);
const formState = await mobilePage.evaluate(() => ({
  status: document.querySelector('[data-status]')?.textContent?.trim(),
  invalid: document.querySelector('[data-contact-form]')?.matches(':invalid'),
}));

await mobile.close();

await browser.close();

console.log('--- Interaction checks ---');
console.log('menu:', menuState, 'closed:', menuClosed);
console.log('search "ήπαρ":', searchState);
console.log('filter Ήπαρ:', filterState);
console.log('empty form submit:', formState);

console.log('\n--- Layout / link checks ---');
if (!problems.length) {
  console.log(`OK: ${pages.length * widths.length} page/width combinations clean.`);
} else {
  console.log(JSON.stringify(problems, null, 2));
}
