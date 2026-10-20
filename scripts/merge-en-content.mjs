/**
 * Merges the translated English batch files into the English content data.
 * Metadata (category, image, featured, references) always comes from the
 * corresponding Greek entry, so the two sites share the same taxonomy.
 *
 * Run: node scripts/merge-en-content.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BATCH_DIR = path.join(ROOT, 'greek-batches');

const parseArray = (source) =>
  JSON.parse(source.slice(source.indexOf('= [') + 2, source.lastIndexOf(']') + 1));

const readGreek = async (name) =>
  parseArray(await readFile(path.join(ROOT, 'src', 'data', `${name}.ts`), 'utf8'));

const readEnglishFocus = async (fileBase) => {
  const source = await readFile(path.join(ROOT, 'src', 'data', 'en', `${fileBase}.ts`), 'utf8');
  const array = source.slice(source.indexOf('= [') + 2, source.lastIndexOf(']') + 1);
  // The hand-written focus file uses TS/JS object syntax, not strict JSON.
  return new Function(`return (${array});`)();
};

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

const files = await readdir(BATCH_DIR);

const merge = async (kind, greekName, englishName, prefix) => {
  const greek = await readGreek(greekName);
  const focus = await readEnglishFocus(greekName);
  const focusBySlug = new Map(focus.map((item) => [item.slug, item]));

  const translated = new Map();
  const batchFiles = files.filter((name) => new RegExp(`^${kind}-\\d+\\.en\\.json$`).test(name));
  for (const file of batchFiles) {
    const items = await readJson(path.join(BATCH_DIR, file));
    for (const item of items) translated.set(item.slug, item);
  }

  const result = [];
  let focusCount = 0;
  let translatedCount = 0;
  let missing = 0;

  for (const greekItem of greek) {
    const focusItem = focusBySlug.get(greekItem.slug);
    if (focusItem) {
      result.push(focusItem);
      focusCount += 1;
      continue;
    }
    const english = translated.get(greekItem.slug);
    if (!english) {
      missing += 1;
      continue;
    }
    result.push({
      slug: greekItem.slug,
      title: english.title,
      short: english.short,
      category: greekItem.category,
      image: greekItem.image,
      featured: greekItem.featured,
      paragraphs: english.paragraphs,
      references: greekItem.references,
    });
    translatedCount += 1;
  }

  const header = `import type { ${prefix} } from '../types';\n\n`;
  await writeFile(
    path.join(ROOT, 'src', 'data', 'en', `${greekName}.ts`),
    `${header}export const ${englishName}: ${prefix}[] = ${JSON.stringify(result, null, 2)};\n`,
  );

  console.log(
    `${englishName}: ${result.length} items (focus ${focusCount}, translated ${translatedCount}, missing ${missing})`,
  );
  if (missing) console.warn(`  missing English translations: ${missing}`);
};

await merge('conditions', 'conditions', 'conditionsEn', 'Condition');
await merge('procedures', 'procedures', 'proceduresEn', 'Procedure');
