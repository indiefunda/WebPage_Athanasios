/**
 * Splits very long article paragraphs into readable blocks at sentence
 * boundaries. Operates on the generated conditions/procedures data modules.
 *
 * Run after scripts/build-content.mjs: node scripts/split-paragraphs.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX = 620;
const MIN_SENTENCES = 3;

const ABBREVIATIONS = ['Dr.', 'dr.', 'κ.', 'κα.', 'π.χ.', 'κ.λπ.', 'κ.ά.', 'π.Χ.', 'μ.Χ.', 'No.'];

const splitSentences = (text) => {
  const parts = [];
  let rest = text;
  const regex = /(?<=[.!;·])\s+(?=\p{Lu})/gu;
  let lastIndex = 0;
  for (const match of text.matchAll(regex)) {
    const index = match.index ?? 0;
    const before = text.slice(Math.max(0, index - 6), index + 1);
    if (ABBREVIATIONS.some((abbr) => before.endsWith(abbr))) continue;
    parts.push(text.slice(lastIndex, index + 1).trim());
    lastIndex = index + 1;
  }
  const tail = text.slice(lastIndex).trim();
  if (tail) parts.push(tail);
  return parts.filter(Boolean);
};

const splitParagraph = (paragraph) => {
  if (paragraph.startsWith('## ') || paragraph.length <= MAX) return [paragraph];

  const sentences = splitSentences(paragraph);
  if (sentences.length < MIN_SENTENCES) return [paragraph];

  const chunks = [];
  let current = '';
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (current && candidate.length > MAX) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 1 ? chunks : [paragraph];
};

const processFile = async (file) => {
  const source = await readFile(file, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(']') + 1;
  const prefix = source.slice(0, start);
  const suffix = source.slice(end);
  const items = JSON.parse(source.slice(start, end));

  let before = 0;
  let after = 0;
  for (const item of items) {
    before += item.paragraphs.length;
    item.paragraphs = item.paragraphs.flatMap(splitParagraph);
    after += item.paragraphs.length;
  }

  await writeFile(file, `${prefix}${JSON.stringify(items, null, 2)}${suffix}`);
  console.log(`${path.basename(file)}: ${before} -> ${after} paragraphs`);
};

await processFile(path.join(ROOT, 'src', 'data', 'conditions.ts'));
await processFile(path.join(ROOT, 'src', 'data', 'procedures.ts'));
