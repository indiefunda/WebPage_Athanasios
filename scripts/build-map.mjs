/**
 * Builds a static, warm-toned map of the clinic from OpenStreetMap tiles.
 * Output: public/images/map-marousi.jpg (1600x720) + -800.jpg
 *
 * Marker: Kifisias 58, Marousi (38.0439472, 23.8056257)
 * Tiles © OpenStreetMap contributors (ODbL).
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.research', 'tiles');
const OUT = path.join(ROOT, 'public', 'images');

const LAT = 38.0439472;
const LON = 23.8056257;
const ZOOM = 17;
const WIDTH = 1600;
const HEIGHT = 720;
const MARKER_X = Math.round(WIDTH * 0.52);
const MARKER_Y = Math.round(HEIGHT * 0.54);

const TILE = 256;
const n = 2 ** ZOOM;

const lonToX = (lon) => ((lon + 180) / 360) * n;
const latToY = (lat) => {
  const rad = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
};

const worldX = lonToX(LON) * TILE;
const worldY = latToY(LAT) * TILE;

const left = Math.round(worldX - MARKER_X);
const top = Math.round(worldY - MARKER_Y);

const firstTileX = Math.floor(left / TILE);
const firstTileY = Math.floor(top / TILE);
const lastTileX = Math.floor((left + WIDTH) / TILE);
const lastTileY = Math.floor((top + HEIGHT) / TILE);

await mkdir(CACHE, { recursive: true });
await mkdir(OUT, { recursive: true });

const composites = [];

for (let tx = firstTileX; tx <= lastTileX; tx += 1) {
  for (let ty = firstTileY; ty <= lastTileY; ty += 1) {
    const file = path.join(CACHE, `${ZOOM}-${tx}-${ty}.png`);
    if (!existsSync(file)) {
      const url = `https://tile.openstreetmap.org/${ZOOM}/${tx}/${ty}.png`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'drdesalermos-website/1.0 (desalermosclinic@gmail.com)',
        },
      });
      if (!response.ok) {
        console.warn(`skip tile ${ZOOM}/${tx}/${ty}: ${response.status}`);
        continue;
      }
      await writeFile(file, Buffer.from(await response.arrayBuffer()));
      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    const px = tx * TILE - left;
    const py = ty * TILE - top;
    if (px > WIDTH || py > HEIGHT || px + TILE < 0 || py + TILE < 0) continue;

    composites.push({
      input: await sharp(file).resize(TILE, TILE).toBuffer(),
      left: px,
      top: py,
    });
  }
}

const markerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <circle cx="${MARKER_X}" cy="${MARKER_Y}" r="46" fill="#b0522e" opacity="0.10"/>
  <circle cx="${MARKER_X}" cy="${MARKER_Y}" r="26" fill="#b0522e" opacity="0.18"/>
  <circle cx="${MARKER_X}" cy="${MARKER_Y}" r="11" fill="#b0522e" stroke="#faf8f2" stroke-width="4"/>
</svg>`;

const tintSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#f2e9d9"/>
</svg>`;

const base = await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 3,
    background: '#ece6da',
  },
})
  .composite(composites)
  .png()
  .toBuffer();

const graded = await sharp(base)
  .modulate({ saturation: 0.38, brightness: 1.04 })
  .composite([
    { input: Buffer.from(tintSvg), blend: 'soft-light', opacity: 0.5 },
    { input: Buffer.from(markerSvg) },
  ])
  .jpeg({ quality: 86, chromaSubsampling: '4:4:4' })
  .toBuffer();

await writeFile(path.join(OUT, 'map-marousi.jpg'), graded);
await sharp(graded).resize(800).jpeg({ quality: 82 }).toFile(path.join(OUT, 'map-marousi-800.jpg'));

console.log(`map: ${WIDTH}x${HEIGHT}, ${composites.length} tiles`);
console.log('public/images/map-marousi.jpg');
