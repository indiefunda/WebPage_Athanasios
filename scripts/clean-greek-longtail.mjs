/**
 * Mechanical cleanup of the remaining Greek condition/procedure texts:
 * common accent/terminology errors and paragraphs that were split in the
 * middle of the doctor's name.
 *
 * Run: node scripts/clean-greek-longtail.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const replacements = [
  ['πρός', 'προς'],
  ['Κρόν', 'Crohn'],
  ['ελκωδους', 'ελκώδους'],
  ['φλεγμονωδους', 'φλεγμονώδους'],
  ['πολικά οξέα', 'χολικά οξέα'],
  ['τεστ αναπνοής', 'δοκιμασία αναπνοής'],
  ['τεστ', 'δοκιμασία'],
  ['διαιτητικό', 'διατροφικό'],
  ['ενόχων', 'ένοχων'],
  ['στον έλεγχο τους', 'στον έλεγχό τους'],
  ['στον έλεγχο του', 'στον έλεγχό του'],
  ['3 ή περισσότερες', 'τρεις ή περισσότερες'],
  ['4 εβδομάδες', 'τέσσερις εβδομάδες'],
  ['η οξεία κατάσταση', 'η οξεία διάρροια'],
  ['Οι θεραπείες ακόμη περιλαμβάνουν', 'Η θεραπεία περιλαμβάνει επίσης'],
];

const clean = (value) => {
  if (typeof value === 'string') {
    return replacements.reduce((text, [from, to]) => text.split(from).join(to), value);
  }
  if (Array.isArray(value)) return value.map(clean);
  return value;
};

const mergeSplitNames = (paragraphs) => {
  const result = [];
  for (const paragraph of paragraphs) {
    const previous = result[result.length - 1];
    if (
      previous &&
      /(?:κ\.|κ\.)$/.test(previous.trim()) &&
      /^(?:Δεσαλέρμος|Δεσαλέρμου)/.test(paragraph.trim())
    ) {
      result[result.length - 1] = `${previous.trim()} ${paragraph.trim()}`;
    } else {
      result.push(paragraph);
    }
  }
  return result;
};

const load = async (file) => {
  const source = await readFile(file, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(']') + 1;
  return {
    prefix: source.slice(0, start),
    suffix: source.slice(end),
    items: JSON.parse(source.slice(start, end)),
  };
};

const save = async (file, data) => {
  await writeFile(file, `${data.prefix}${JSON.stringify(data.items, null, 2)}${data.suffix}`);
};

for (const name of ['conditions', 'procedures']) {
  const file = path.join(ROOT, 'src', 'data', `${name}.ts`);
  const data = await load(file);
  for (const item of data.items) {
    item.title = clean(item.title);
    item.short = clean(item.short);
    item.paragraphs = mergeSplitNames(clean(item.paragraphs));
  }
  await save(file, data);
  console.log(`${name}: cleaned`);
}
