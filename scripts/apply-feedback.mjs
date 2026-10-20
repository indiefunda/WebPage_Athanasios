/**
 * Applies the doctor's content-hierarchy feedback to the content data:
 * promotes five procedures, refocuses featured conditions, and updates
 * the terminology used on cards.
 *
 * Run: node scripts/apply-feedback.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const FEATURED_CONDITIONS = new Set([
  'diarrhea',
  'kaysos-kai-palindromhsh',
  'oisofagos-barretts',
  'nosos-toy-crohn',
  'elkwdhs-kolitida',
  'prolhpsh-kasrkinoy-paxeos-enteroy',
]);

const FEATURED_PROCEDURES = new Set([
  'kolonoskophsh',
  'anwterh-endoskophsh',
  'kapsoyla-endoskophshs',
  'manometria-oisofagoy',
  'ph-metria',
]);

const CONDITION_UPDATES = {
  'kaysos-kai-palindromhsh': {
    title: 'Γαστροοισοφαγική Παλινδρόμηση (ΓΟΠ)',
    short: 'Καούρα, ξινίλη και παλινδρόμηση: πότε είναι απλή ενόχληση και πότε χρειάζεται έλεγχος.',
  },
  'oisofagos-barretts': {
    short: 'Προκαρκινική αλλοίωση του οισοφάγου — παρακολούθηση με ενδοσκόπηση.',
  },
  'nosos-toy-crohn': {
    short: 'Νόσος Crohn: ιδιοπαθής φλεγμονώδης νόσος του εντέρου (ΙΦΝΕ).',
  },
  'elkwdhs-kolitida': {
    short: 'Ελκώδης κολίτιδα: η πιο συχνή μορφή ΙΦΝΕ στο παχύ έντερο.',
  },
  diarrhea: {
    short: 'Οξεία ή χρόνια διάρροια: έλεγχος των αιτίων και στοχευμένη αντιμετώπιση.',
  },
  'prolhpsh-kasrkinoy-paxeos-enteroy': {
    short: 'Πρόληψη καρκίνου παχέος εντέρου με έγκαιρο screening και κολονοσκόπηση.',
  },
};

const PROCEDURE_UPDATES = {
  'anwterh-endoskophsh': {
    short: 'Γαστροσκόπηση: έλεγχος οισοφάγου, στομάχου και δωδεκαδακτύλου.',
  },
  'kapsoyla-endoskophshs': {
    short: 'Κάψουλα λεπτού εντέρου: ασύρματη απεικόνιση του λεπτού εντέρου.',
  },
  'manometria-oisofagoy': {
    short: 'Μέτρηση της λειτουργίας των μυών του οισοφάγου.',
  },
  'ph-metria': {
    short: '24ωρη καταγραφή της παλινδρόμησης (pH-μετρία / πεχαμετρία).',
  },
  'axiologisi-oisofagou-me-endoflip': {
    short: 'Εξειδικευμένη αξιολόγηση της διατασιμότητας του οισοφάγου.',
  },
  'elastografia-ipatos-me-fibroscan': {
    short: 'Εξειδικευμένη, μη επεμβατική μέτρηση ίνωσης και λίπους στο ήπαρ.',
  },
};

const load = async (file) => {
  const source = await readFile(file, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(']') + 1;
  return {
    source,
    prefix: source.slice(0, start),
    suffix: source.slice(end),
    items: JSON.parse(source.slice(start, end)),
  };
};

const save = async (file, data, items) => {
  await writeFile(file, `${data.prefix}${JSON.stringify(items, null, 2)}${data.suffix}`);
};

// Conditions
{
  const file = path.join(ROOT, 'src', 'data', 'conditions.ts');
  const data = await load(file);
  let changed = 0;
  for (const item of data.items) {
    const nextFeatured = FEATURED_CONDITIONS.has(item.slug);
    if (item.featured !== nextFeatured) {
      item.featured = nextFeatured;
      changed += 1;
    }
    const update = CONDITION_UPDATES[item.slug];
    if (update) {
      Object.assign(item, update);
      changed += 1;
    }
  }
  await save(file, data, data.items);
  console.log(`conditions: ${changed} updates`);
}

// Procedures
{
  const file = path.join(ROOT, 'src', 'data', 'procedures.ts');
  const data = await load(file);
  let changed = 0;
  for (const item of data.items) {
    const nextFeatured = FEATURED_PROCEDURES.has(item.slug);
    if (item.featured !== nextFeatured) {
      item.featured = nextFeatured;
      changed += 1;
    }
    const update = PROCEDURE_UPDATES[item.slug];
    if (update) {
      Object.assign(item, update);
      changed += 1;
    }
  }
  await save(file, data, data.items);
  console.log(`procedures: ${changed} updates`);
}
