import { readFile, writeFile } from 'node:fs/promises';

const updates = [
  {
    file: 'src/data/procedures.ts',
    slug: 'anwterh-endoskophsh',
    replace: {
      from: 'Η γαστροσκόπηση πραγματοποιείται με το σύστημα ενδοσκόπησης Olympus EVIS X1 και τον γαστροσκόπο GIF-1100 — την πιο σύγχρονη πλατφόρμα της Olympus. Οι τεχνολογίες',
      to: 'Η γαστροσκόπηση πραγματοποιείται με το σύστημα ενδοσκόπησης Olympus EVIS X1 και τον γαστροσκόπο GIF-1100 — την πιο σύγχρονη πλατφόρμα της Olympus. Το ίδιο σύστημα χρησιμοποιείται στην κολονοσκόπηση και την εύκαμπτη σιγμοειδοσκόπηση. Οι τεχνολογίες',
    },
  },
  {
    file: 'src/data/procedures.ts',
    slug: 'kolonoskophsh',
    heading: '## Ο εξοπλισμός',
    text: 'Η κολονοσκόπηση πραγματοποιείται με το σύστημα ενδοσκόπησης Olympus EVIS X1 και κολονοσκόπιο υψηλής ευκρίνειας. Το ίδιο σύστημα χρησιμοποιείται στη γαστροσκόπηση και την εύκαμπτη σιγμοειδοσκόπηση. Οι τεχνολογίες TXI, NBI και RDI ενισχύουν την απεικόνιση του βλεννογόνου και βοηθούν στην ανάδειξη λεπτών αλλοιώσεων, όπως οι πολύποδες.',
  },
  {
    file: 'src/data/procedures.ts',
    slug: 'eykampth-sigmoeidoskophsh',
    heading: '## Ο εξοπλισμός',
    text: 'Η εύκαμπτη σιγμοειδοσκόπηση πραγματοποιείται με το σύστημα ενδοσκόπησης Olympus EVIS X1 και σιγμοειδοσκόπιο υψηλής ευκρίνειας. Το ίδιο σύστημα χρησιμοποιείται στην κολονοσκόπηση και τη γαστροσκόπηση. Οι τεχνολογίες TXI, NBI και RDI ενισχύουν την απεικόνιση του βλεννογόνου και βοηθούν στην ανάδειξη λεπτών αλλοιώσεων.',
  },
  {
    file: 'src/data/en/procedures.ts',
    slug: 'anwterh-endoskophsh',
    replace: {
      from: 'Gastroscopy is performed with the Olympus EVIS X1 endoscopy system and the GIF-1100 gastroscope — Olympus’s most advanced endoscopy platform. TXI, NBI and RDI',
      to: 'Gastroscopy is performed with the Olympus EVIS X1 endoscopy system and the GIF-1100 gastroscope — Olympus’s most advanced endoscopy platform. The same system is used for colonoscopy and flexible sigmoidoscopy. TXI, NBI and RDI',
    },
  },
  {
    file: 'src/data/en/procedures.ts',
    slug: 'kolonoskophsh',
    heading: '## The equipment',
    text: 'Colonoscopy is performed with the Olympus EVIS X1 endoscopy system and a high-definition colonoscope. The same system is used for gastroscopy and flexible sigmoidoscopy. TXI, NBI and RDI enhance visualization of the mucosal surface and help identify subtle lesions such as polyps.',
  },
  {
    file: 'src/data/en/procedures.ts',
    slug: 'eykampth-sigmoeidoskophsh',
    heading: '## The equipment',
    text: 'Flexible sigmoidoscopy is performed with the Olympus EVIS X1 endoscopy system and a high-definition sigmoidoscope. The same system is used for colonoscopy and gastroscopy. TXI, NBI and RDI enhance visualization of the mucosal surface and help identify subtle lesions.',
  },
];

for (const update of updates) {
  const source = await readFile(update.file, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(']') + 1;
  const items = JSON.parse(source.slice(start, end));
  const item = items.find((entry) => entry.slug === update.slug);
  if (!item) throw new Error('procedure not found: ' + update.slug);
  if (update.replace) {
    const index = item.paragraphs.findIndex((p) => p.includes(update.replace.from));
    if (index === -1) throw new Error('text to replace not found: ' + update.slug);
    item.paragraphs[index] = item.paragraphs[index].replace(update.replace.from, update.replace.to);
  }
  if (update.heading && !item.paragraphs.includes(update.heading)) {
    item.paragraphs.push(update.heading, update.text);
  }
  await writeFile(update.file, `${source.slice(0, start)}${JSON.stringify(items, null, 2)}${source.slice(end)}`);
  console.log('updated:', update.file, update.slug);
}
