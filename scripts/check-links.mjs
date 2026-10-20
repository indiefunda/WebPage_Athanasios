import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) files.push(p);
  }
  return files;
}
const files = await walk(root);
const exists = async (p) => { try { await stat(p); return true; } catch { return false; } };
const bad = new Map();
for (const file of files) {
  const rel = path.relative(root, file);
  const html = await readFile(file, 'utf8');
  const hrefs = [...html.matchAll(/href="([^"#?]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (href.startsWith('/images/') || href.startsWith('/fonts/') || href === '/favicon.svg') continue;
    const clean = href.replace(/\/+$/, '') || '/';
    const candidates = clean === '/'
      ? [path.join(root, 'index.html')]
      : [path.join(root, clean + '.html'), path.join(root, clean, 'index.html')];
    let ok = false;
    for (const c of candidates) if (await exists(c)) { ok = true; break; }
    if (!ok && !(await exists(path.join(root, clean)))) {
      const list = bad.get(rel) || [];
      list.push(href);
      bad.set(rel, list);
    }
  }
}
console.log('pages checked:', files.length);
console.log('broken link pages:', bad.size);
for (const [page, links] of [...bad].slice(0, 20)) console.log(page, '->', [...new Set(links)].join(', '));
