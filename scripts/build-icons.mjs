import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svg = await readFile(path.join(ROOT, 'public', 'favicon.svg'));

for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(path.join(ROOT, 'public', name));
  console.log(`public/${name} (${size}x${size})`);
}
