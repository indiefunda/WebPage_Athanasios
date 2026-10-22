import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('https://desalermos-website.web.app/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
const texts = await page.locator('main > section').evaluateAll(els => els.map(el => el.innerText.slice(0,160).replace(/\n/g,' | ')));
texts.forEach((t,i)=>console.log(i, t));
await browser.close();
