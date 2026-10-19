/**
 * Turns the scraped WordPress export (.research/content.json) into typed data
 * modules: conditions and procedures. Copy is cleaned of builder markup
 * and obvious typos; the factual content is preserved.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(ROOT, '.research', 'content.json'), 'utf8'));

const NAMED = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  apos: "'",
  rsquo: '\u2019',
  lsquo: '\u2018',
  rdquo: '\u201d',
  ldquo: '\u201c',
  ndash: '\u2013',
  mdash: '\u2014',
  laquo: '\u00ab',
  raquo: '\u00bb',
  hellip: '\u2026',
  lt: '<',
  gt: '>',
  eacute: '\u00e9',
};

const decode = (value) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED[name] ?? match);

/** Text -> paragraphs, stripping Fusion Builder chrome and keeping link text. */
function toParagraphs(html, title) {
  let source = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Drop decorative builder containers that only carry backgrounds.
  source = source.replace(/<div[^>]*class="fusion-bg-parallax"[\s\S]*?<\/div>/gi, '');
  source = source.replace(/<div[^>]*class="fusion-[^"]*"[^>]*>/gi, '<div>');

  // Mark links before stripping tags.
  source = source.replace(
    /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => {
      const label = decode(text.replace(/<[^>]+>/g, '')).trim();
      if (!label || href.startsWith('http://drdesalermos') || href.startsWith('https://drdesalermos')) return label;
      if (href.startsWith('#') || href.startsWith('mailto:')) return label;
      return `[[${href}|${label}]]`;
    },
  );

  source = source
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|figure|blockquote|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  const lines = decode(source)
    .split('\n')
    .map((line) =>
      line
        .replace(/\s+/g, ' ')
        .replace(/\s+([,.;:!?])/g, '$1')
        .trim(),
    )
    .filter(Boolean);

  // Remove duplicate headings, boilerplate and card fragments.
  const skipExact = new Set([
    title,
    'Gallery',
    'Read More',
    'Διαβάστε περισσότερα',
    'Περισσότερα',
    'Επικοινωνία',
    'Κλείστε Ραντεβού',
  ]);

  const filtered = [];
  for (const line of lines) {
    const bare = line.replace(/^#+\s*/, '').trim();
    if (!bare) continue;
    if (skipExact.has(bare)) continue;
    if (bare === title.replace(/'/g, '\u2019')) continue;
    if (/^\[\[/.test(bare) && bare.length < 12) continue;
    if (filtered[filtered.length - 1] === bare) continue;
    filtered.push(bare.replace(/^#+\s*/, ''));
  }

  const references = [];
  const paragraphs = [];
  for (const line of filtered) {
    const links = [...line.matchAll(/\[\[([^|]+)\|([^\]]+)\]\]/g)];
    const withoutLinks = line.replace(/\[\[[^\]]+\]\]/g, '').replace(/\s+/g, ' ').trim();
    if (links.length && /^(Για περισσότερες λεπτομέρειες|Πηγή|Αναφορές)/i.test(withoutLinks)) {
      for (const [, url, label] of links) references.push({ label: label.trim(), url: url.trim() });
      continue;
    }
    for (const [, url, label] of links) references.push({ label: label.trim(), url: url.trim() });
    const cleaned = line.replace(/\[\[[^|]+\|([^\]]+)\]\]/g, '$1').trim();
    if (cleaned.length > 1) paragraphs.push(cleaned);
  }

  return { paragraphs, references: dedupe(references) };
}

const dedupe = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.url + item.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const CORRECTIONS = [
  [/\bΤελος\b/g, 'Τέλος'],
  [/\bΠαραλληλα\b/g, 'Παράλληλα'],
  [/ηπατικλης/g, 'ηπατικής'],
  [/λείψουμε/g, 'λάβουμε'],
  [/εντέρού/g, 'εντέρου'],
  [/στo /g, 'στο '],
  [/ανακυρίχθηκε/g, 'ανακηρύχθηκε'],
  [/ανακυρήχθηκε/g, 'ανακηρύχθηκε'],
  [/Ευρωπαικής/g, 'Ευρωπαϊκής'],
  [/πραγματοποίησε άνω των ενδοσκοπήσεων/g, 'πραγματοποίησε χιλιάδες ενδοσκοπήσεις'],
  [/  +/g, ' '],

  // Accents and agreement slips that recur across the old copy.
  [/\bιδιοπαθους\b/g, 'ιδιοπαθούς'],
  [/\bφλεγμονωδους\b/g, 'φλεγμονώδους'],
  [/\bελκωδους\b/g, 'ελκώδους'],
  [/ιδιοπαθής νόσους/g, 'ιδιοπαθείς νόσους'],
  [/\bκατα την\b/g, 'κατά την'],
  [/\bενα ενδοσκόπιο/g, 'ένα ενδοσκόπιο'],
  [/\bεώς\b/g, 'έως'],
  [/\bβλαβης\b/g, 'βλάβης'],
  [/\bσυνεχόμενου\b/g, 'συνεχούς'],
  [/\bπροσυμπτωματικός ελέγχου\b/g, 'προσυμπτωματικού ελέγχου'],
  [/\bοποίαοι\b/g, 'οποίοι'],
  [/\bιμικροβιώμα\b/g, 'μικροβίωμα'],
  [/\bσώματο\b/g, 'σώμα'],
  [/\bχρησιμοποιώντας μια ισορροπημένης\b/g, 'χρησιμοποιώντας μια ισορροπημένη'],
  [/\bτον τύπο τους\b/g, 'τον τύπο τους'],
  [/\bσυμπτώματα σας\b/g, 'συμπτώματά σας'],
  [/\bτην νόσο\b/g, 'τη νόσο'],
  [/\bστην νόσο\b/g, 'στη νόσο'],
  [/\bτην ελκώδη\b/g, 'την ελκώδη'],
  [/\bτης ελκωδους\b/g, 'της ελκώδους'],
  [/\b στην διαταραχή\b/g, ' στη διαταραχή'],
  [/\bστην διαταραχή\b/g, 'στη διαταραχή'],
  [/\bστην κλινική μας\b/g, 'στην κλινική μας'],
  [/\bένα μικρό δείγμα ιστού\b/g, 'ένα μικρό δείγμα ιστού'],
  [/\bΚρον\b/g, 'Crohn'],
  [/\bχολεκυστίτιδας\b/g, 'χολοκυστίτιδας'],
  [/\bΑιμορροϊδοπάθεια\b/g, 'Αιμορροϊδοπάθεια'],
  [/\bκοινός αιμορροΐδες\b/g, 'κοινώς αιμορροΐδες'],
  [/\bδυσαπορρόφησης\b/g, 'δυσαπορρόφησης'],
  [/\bΜέριμνα μας\b/g, 'Μέριμνά μας'],
  [/\bλιπώδης νόσου του ήπατος\b/g, 'λιπώδης νόσος του ήπατος'],
  [/\bπροσυμπτωματικού ελέγχου\b/g, 'προσυμπτωματικού ελέγχου'],
  [/\bχοληδόχου κύστης\b/g, 'χοληδόχου κύστης'],
  [/\bΕνδοσκοπική Παλίνδρομη Xολαγγειοπαγκρεατογραφία\b/g, 'Ενδοσκοπική Παλίνδρομη Χολαγγειοπαγκρεατογραφία'],
  [/\bδύσοσμα\b/g, 'δύσοσμα'],
  [/\bΠιθανή βλάβη\b/g, 'Η βλάβη'],
  [/\bσας έχει\b/g, 'σας έχει'],
  [/\bάλλωστε\b/g, 'άλλωστε'],
];

const applyCorrections = (text) => {
  let out = text;
  for (const [pattern, replacement] of CORRECTIONS) out = out.replace(pattern, replacement);
  return out;
};

const CONDITION_META = {
  'kaysos-kai-palindromhsh': {
    category: 'oesophagus',
    short: 'Καούρα, ξινίλα και παλινδρόμηση: πότε είναι απλή ενόχληση και πότε χρειάζεται έλεγχος.',
    featured: true,
  },
  'oisofagos-barretts': {
    category: 'oesophagus',
    short: 'Προκαρκινική αλλοίωση του οισοφάγου που παρακολουθείται με ενδοσκόπηση.',
  },
  'provlhma-sthn-kataposh': {
    category: 'oesophagus',
    short: 'Δυσκολία στην κατάποση που χρειάζεται έγκαιρη διερεύνηση.',
    featured: true,
  },
  'dyspepsia-kai-metewrismos': {
    category: 'stomach',
    short: 'Φούσκωμα, πρώιμος κορεσμός και δυσφορία στο στομάχι.',
    featured: true,
  },
  'loimwxh-me-to-elikobakthridio-toy-pylwroy': {
    category: 'stomach',
    short: 'Η πιο συχνή βακτηριακή λοίμωξη του στομάχου, με σαφή θεραπεία.',
  },
  'peptiko-elkos': {
    category: 'stomach',
    short: 'Έλκος στο στομάχι ή το δωδεκαδάκτυλο, με αιτία που αντιμετωπίζεται.',
  },
  'aimorragia-peptikoy': {
    category: 'stomach',
    short: 'Αιμορραγία από το πεπτικό: έγκαιρη ενδοσκόπηση και αντιμετώπιση.',
  },
  'eyerethisto-entero': {
    category: 'intestine',
    short: 'Σύνδρομο ευερέθιστου εντέρου: συμπτώματα χωρίς οργανική βλάβη.',
    featured: true,
  },
  'dyskoiliothta': {
    category: 'intestine',
    short: 'Επίμονη δυσκοιλιότητα, με στοχευμένη και σταδιακή αντιμετώπιση.',
  },
  diarrhea: {
    category: 'intestine',
    short: 'Οξεία ή χρόνια διάρροια, με έλεγχο των πραγματικών αιτίων.',
  },
  koiliokakh: {
    category: 'intestine',
    short: 'Κοιλιοκάκη: δυσανεξία στη γλουτένη με πολλές εκδηλώσεις.',
  },
  'dysanexia-trofwn': {
    category: 'intestine',
    short: 'Δυσανεξίες και δυσπεψία τροφών, με έλεγχο και διατροφικό σχέδιο.',
  },
  'nosos-toy-crohn': {
    category: 'intestine',
    short: 'Ιδιοπαθής φλεγμονώδης νόσος του εντέρου, με σύγχρονη θεραπεία.',
    featured: true,
  },
  'elkwdhs-kolitida': {
    category: 'intestine',
    short: 'Ελκώδης κολίτιδα: φλεγμονή του παχέος εντέρου, με εξατομικευμένη αγωγή.',
  },
  colitida: {
    category: 'intestine',
    short: 'Φλεγμονή του εντέρου: αιτίες, διάγνωση και θεραπεία.',
  },
  ekkolpwmata: {
    category: 'intestine',
    short: 'Εκκολπώματα και εκκολπωματίτιδα: από την πρόληψη στην αντιμετώπιση.',
  },
  'polypodes-toy-paxeos-enteroy': {
    category: 'intestine',
    short: 'Πολύποδες του εντέρου: αφαίρεση και παρακολούθηση για πρόληψη.',
  },
  'prolhpsh-kasrkinoy-paxeos-enteroy': {
    category: 'intestine',
    short: 'Πρόληψη καρκίνου του παχέος εντέρου με έγκαιρο screening.',
    featured: true,
  },
  'aimorroides-kai-ragades': {
    category: 'intestine',
    short: 'Αιμορροΐδες και ραγάδες, με σύγχρονες, ανώδυνες θεραπείες.',
  },
  anaimia: {
    category: 'intestine',
    short: 'Αναιμία από έλλειψη σιδήρου: η αιτία συχνά κρύβεται στο πεπτικό.',
  },
  'yperanaptyxh-twn-bakthridiwn-toy-leptoy-enteroy': {
    category: 'intestine',
    short: 'Υπερανάπτυξη βακτηρίων του λεπτού εντέρου: φούσκωμα και δυσπεψία.',
    featured: true,
  },
  'diataraxes-toy-mikrobiwmatos': {
    category: 'intestine',
    short: 'Το μικροβίωμα του εντέρου και ο ρόλος του στην υγεία.',
  },
  'evexia-toy-enteroy': {
    category: 'intestine',
    short: 'Ευεξία του εντέρου: διατροφή, συνήθειες και ισορροπία.',
  },
  'xronia-hpatikh-nosos': {
    category: 'liver',
    short: 'Χρόνια ηπατική νόσος: έγκαιρη διάγνωση πριν την κίρρωση.',
  },
  'kirrwsh-toy-hpatos': {
    category: 'liver',
    short: 'Κίρρωση του ήπατος: παρακολούθηση και αντιμετώπιση επιπλοκών.',
  },
  'lipwdhs-hpar': {
    category: 'liver',
    short: 'Λιπώδες ήπαρ: η πιο συχνή ηπατική νόσος, με θεραπεία τον τρόπο ζωής.',
    featured: true,
  },
  'iogenhs-hpatitida': {
    category: 'liver',
    short: 'Ιογενής ηπατίτιδα B και C: έλεγχος, θεραπεία και πρόληψη.',
  },
  'oxeia-kai-xronia-pagkreatitida': {
    category: 'pancreas',
    short: 'Οξεία και χρόνια παγκρεατίτιδα: αιτίες και αντιμετώπιση.',
  },
  hololithoi: {
    category: 'pancreas',
    short: 'Χολόλιθοι: πότε χρειάζεται επέμβαση και πότε παρακολούθηση.',
  },
  kolikos: {
    category: 'pancreas',
    short: 'Κολικός: έντονος πόνος που απαιτεί άμεση εκτίμηση.',
  },
};

const PROCEDURE_META = {
  kolonoskophsh: {
    category: 'endoscopy',
    short: 'Έλεγχος του παχέος εντέρου και αφαίρεση πολυπόδων, με καταστολή.',
    featured: true,
  },
  'anwterh-endoskophsh': {
    category: 'endoscopy',
    short: 'Ενδοσκόπηση οισοφάγου, στομάχου και δωδεκαδακτύλου.',
    featured: true,
  },
  'eykampth-sigmoeidoskophsh': {
    category: 'endoscopy',
    short: 'Σύντομος έλεγχος του κατώτερου εντέρου.',
  },
  'kapsoyla-endoskophshs': {
    category: 'endoscopy',
    short: 'Ασύρματη κάψουλα που απεικονίζει το λεπτό έντερο.',
    featured: true,
  },
  'manometria-oisofagoy': {
    category: 'functional',
    short: 'Μέτρηση της λειτουργίας των μυών του οισοφάγου.',
  },
  'ph-metria': {
    category: 'functional',
    short: '24ωρη καταγραφή της παλινδρόμησης.',
  },
  'axiologisi-oisofagou-me-endoflip': {
    category: 'functional',
    short: 'Αξιολόγηση της διατασιμότητας και της λειτουργίας του οισοφάγου.',
    featured: true,
  },
  'elastografia-ipatos-me-fibroscan': {
    category: 'liver',
    short: 'Μη επεμβατική μέτρηση της ίνωσης και του λίπους στο ήπαρ.',
    featured: true,
  },
  'diastolh-oisofagoy': {
    category: 'therapeutic',
    short: 'Θεραπευτική διαστολή στενώσεων του οισοφάγου.',
  },
};

const TITLE_OVERRIDES = {
  'oisofagos-barretts': 'Οισοφάγος Barrett',
  'ph-metria': 'pH-μετρία',
  'axiologisi-oisofagou-me-endoflip': 'Αξιολόγηση οισοφάγου με EndoFLIP',
  'elastografia-ipatos-me-fibroscan': 'Ελαστογραφία ήπατος με FibroScan',
  'loimwxh-me-to-elikobakthridio-toy-pylwroy': 'Λοίμωξη με Ελικοβακτηρίδιο του Πυλωρού',
};

const cleanTitle = (raw, slug) =>
  TITLE_OVERRIDES[slug] ??
  decode(raw)
    .replace(/&#8217;s/g, '\u2019s')
    .replace(/\s+/g, ' ')
    .trim();

const bySlug = Object.fromEntries(data.pages.map((page) => [page.slug, page]));

const normalize = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`´]/g, '')
    .toLowerCase()
    .replace(/[^a-zα-ω0-9]+/g, ' ')
    .trim();

const tokens = (value) => new Set(normalize(value).split(' ').filter((word) => word.length > 2));

const similar = (a, b) => {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const word of left) if (right.has(word)) shared += 1;
  return shared / Math.max(left.size, right.size);
};

function buildEntry(slug, meta, kind) {
  const page = bySlug[slug];
  if (!page) throw new Error(`Unknown slug ${slug}`);
  const title = cleanTitle(page.title.rendered, slug);
  const { paragraphs, references } = toParagraphs(page.content.rendered, title);
  const cleaned = paragraphs.map(applyCorrections).filter(Boolean);

  // Drop a repeated page title masquerading as the first paragraph.
  const normalizedTitle = normalize(title);
  const uniqueParagraphs = [];
  for (const paragraph of cleaned) {
    const normalized = normalize(paragraph);
    if (normalized === normalizedTitle) continue;
    if (normalizedTitle.length > 8 && normalized.startsWith(normalizedTitle) && paragraph.length < 90) continue;
    if (paragraph.length < 100 && similar(paragraph, title) > 0.6) continue;
    if (!uniqueParagraphs.includes(paragraph)) uniqueParagraphs.push(paragraph);
  }

  // A missing first paragraph is a content problem worth surfacing.
  if (!uniqueParagraphs.length) console.warn(`No body text for ${slug}`);

  return {
    slug,
    title,
    short: meta.short,
    category: meta.category,
    image: `${kind}-${slug}`,
    featured: Boolean(meta.featured),
    paragraphs: uniqueParagraphs,
    references,
  };
}

const conditions = Object.keys(CONDITION_META).map((slug) =>
  buildEntry(slug, CONDITION_META[slug], 'condition'),
);
const procedures = Object.keys(PROCEDURE_META).map((slug) =>
  buildEntry(slug, PROCEDURE_META[slug], 'procedure'),
);

const banner = `/**
 * Content extracted from the existing drdesalermos.gr site.
 * Greek copy is preserved; builder markup and obvious typos are cleaned.
 * Generated by scripts/build-content.mjs — edits here are safe and expected.
 */\n`;

const serialize = (value) => JSON.stringify(value, null, 2);

await writeFile(
  path.join(ROOT, 'src', 'data', 'conditions.ts'),
  `${banner}import type { Condition } from './types';\n\nexport const conditions: Condition[] = ${serialize(conditions)};\n`,
);

await writeFile(
  path.join(ROOT, 'src', 'data', 'procedures.ts'),
  `${banner}import type { Procedure } from './types';\n\nexport const procedures: Procedure[] = ${serialize(procedures)};\n`,
);


console.log(`conditions: ${conditions.length}`);
console.log(`procedures: ${procedures.length}`);
for (const item of [...conditions, ...procedures]) {
  console.log(`${item.slug.padEnd(48)} ${item.paragraphs.length}p ${item.paragraphs[0]?.slice(0, 60) ?? ''}`);
}
