/**
 * Merges the corrected Greek batch outputs back into the content data.
 * Run after all greek-batches/*.out.json files exist:
 *   node scripts/merge-greek-batches.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BATCH_DIR = path.join(ROOT, 'greek-batches');

const loadData = async (file) => {
  const source = await readFile(file, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(']') + 1;
  return {
    prefix: source.slice(0, start),
    suffix: source.slice(end),
    items: JSON.parse(source.slice(start, end)),
  };
};

const saveData = async (file, data) => {
  await writeFile(file, `${data.prefix}${JSON.stringify(data.items, null, 2)}${data.suffix}`);
};

const validate = (input, output, label) => {
  if (!Array.isArray(output)) throw new Error(`${label}: output is not an array`);
  if (output.length !== input.length) throw new Error(`${label}: length ${output.length} !== ${input.length}`);
  const inputSlugs = input.map((item) => item.slug).sort();
  const outputSlugs = output.map((item) => item.slug).sort();
  if (JSON.stringify(inputSlugs) !== JSON.stringify(outputSlugs)) {
    throw new Error(`${label}: slug mismatch`);
  }
  for (const item of output) {
    const original = input.find((entry) => entry.slug === item.slug);
    if (item.paragraphs.length !== original.paragraphs.length) {
      throw new Error(`${label}/${item.slug}: paragraph count changed`);
    }
    if (!item.title?.trim() || !item.short?.trim()) {
      throw new Error(`${label}/${item.slug}: empty title/short`);
    }
  }
};

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

const files = await readdir(BATCH_DIR);
const batches = files
  .filter((name) => /^(conditions|procedures)-\d+\.json$/.test(name))
  .map((name) => name.replace(/\.json$/, ''));

const merged = new Map();
for (const name of batches) {
  const outFile = path.join(BATCH_DIR, `${name}.out.json`);
  try {
    await readFile(outFile, 'utf8');
  } catch {
    console.warn(`SKIP ${name}: ${name}.out.json is missing`);
    continue;
  }
  const input = await readJson(path.join(BATCH_DIR, `${name}.json`));
  const output = await readJson(outFile);
  validate(input, output, name);
  for (const item of output) merged.set(item.slug, item);
  console.log(`OK ${name}: ${output.length} articles`);
}

for (const name of ['conditions', 'procedures']) {
  const file = path.join(ROOT, 'src', 'data', `${name}.ts`);
  const data = await loadData(file);
  let changed = 0;
  for (const item of data.items) {
    const update = merged.get(item.slug);
    if (!update) continue;
    item.title = update.title;
    item.short = update.short;
    item.paragraphs = update.paragraphs;
    // Some source articles lost their heading marker and repeated the title
    // as the first paragraph. Restore it as a heading.
    if (item.paragraphs[0]?.trim() === item.title.trim()) {
      item.paragraphs[0] = `## ${item.paragraphs[0].trim()}`;
    }
    changed += 1;
  }
  await saveData(file, data);
  console.log(`${name}: ${changed} articles updated`);
}

const expected = batches.length;
console.log(`batches complete: ${merged.size > 0 ? [...merged.keys()].length : 0} articles from ${expected} batches`);
