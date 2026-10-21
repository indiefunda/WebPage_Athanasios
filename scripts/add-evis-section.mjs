import { readFile, writeFile } from 'node:fs/promises';

const updates = [
  {
    file: 'src/data/procedures.ts',
    slug: 'anwterh-endoskophsh',
    heading: '## Ο εξοπλισμός',
    text: 'Η γαστροσκόπηση πραγματοποιείται με το σύστημα ενδοσκόπησης Olympus EVIS X1 και τον γαστροσκόπο GIF-1100 — την πιο σύγχρονη πλατφόρμα της Olympus. Οι τεχνολογίες TXI, NBI και RDI ενισχύουν την απεικόνιση του βλεννογόνου και βοηθούν στην ανάδειξη λεπτών αλλοιώσεων. Ο λεπτός σχεδιασμός (8,9 mm) και το κανάλι των 2,8 mm επιτρέπουν άνετη εξέταση και, όταν χρειάζεται, λήψη βιοψιών ή μικρές επεμβάσεις.',
  },
  {
    file: 'src/data/en/procedures.ts',
    slug: 'anwterh-endoskophsh',
    heading: '## The equipment',
    text: 'Gastroscopy is performed with the Olympus EVIS X1 endoscopy system and the GIF-1100 gastroscope — Olympus’s most advanced endoscopy platform. TXI, NBI and RDI enhance visualization of the mucosal surface and help identify subtle lesions. The slim 8.9 mm design and 2.8 mm working channel support a comfortable examination and, when needed, biopsy or minor therapy.',
  },
];

for (const update of updates) {
  const source = await readFile(update.file, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(']') + 1;
  const items = JSON.parse(source.slice(start, end));
  const item = items.find((entry) => entry.slug === update.slug);
  if (!item) throw new Error('procedure not found: ' + update.slug);
  if (!item.paragraphs.includes(update.heading)) {
    item.paragraphs.push(update.heading, update.text);
  }
  await writeFile(update.file, `${source.slice(0, start)}${JSON.stringify(items, null, 2)}${source.slice(end)}`);
  console.log('added equipment section:', update.file);
}
