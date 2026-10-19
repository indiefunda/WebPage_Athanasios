/**
 * Builds responsive AVIF + WebP renditions for every image the site uses
 * and writes src/data/images.json for the <Pic> component.
 *
 * Source material lives in .research/img-all (scraped from the current site).
 * Run: npm run images
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, '.research', 'img-all');
const OUT = path.join(ROOT, 'public', 'images');
const MANIFEST = path.join(ROOT, 'src', 'data', 'images.json');

const ROLES = {
  portrait: { widths: [560, 840, 1120], aspect: null, quality: 62 },
  clinic: { widths: [640, 1000], aspect: 4 / 3, quality: 58 },
  city: { widths: [720, 1200], aspect: 3 / 2, quality: 58 },
  card: { widths: [560, 840], aspect: 4 / 3, quality: 56 },
  article: { widths: [720, 1080], aspect: 3 / 2, quality: 58 },
  news: { widths: [720, 1200], aspect: 16 / 9, quality: 58 },
};

/** slug -> { group, source, role, alt } */
const ITEMS = [
  {
    key: 'portrait',
    group: 'portrait',
    source: 'main-1.jpg',
    role: 'portrait',
    alt: 'Ο Αθανάσιος Δεσαλέρμος σε επαγγελματικό πορτρέτο, με σκούρο φόντο.',
  },
  {
    key: 'portrait-crossed',
    group: 'portrait',
    source: 'main2-doc.webp',
    role: 'portrait',
    alt: 'Ο Αθανάσιος Δεσαλέρμος με σταυρωμένα χέρια.',
  },
  {
    key: 'portrait-profile',
    group: 'portrait',
    source: 'profile-photo.jpg',
    role: 'portrait',
    alt: 'Πορτρέτο του Αθανάσιου Δεσαλέρμου.',
  },
  {
    key: 'clinic-1',
    group: 'clinic',
    source: '1.webp',
    role: 'clinic',
    alt: 'Εξεταστική κλίνη στο ιατρείο, δίπλα σε παράθυρο με θέα πράσινο.',
  },
  {
    key: 'clinic-2',
    group: 'clinic',
    source: '2.webp',
    role: 'clinic',
    alt: 'Ο χώρος εξέτασης του ιατρείου με τα διπλώματα και τον εξοπλισμό.',
  },
  {
    key: 'clinic-3',
    group: 'clinic',
    source: '3.webp',
    role: 'clinic',
    alt: 'Το γραφείο του ιατρού, με βιβλιοθήκη και πιστοποιητικά στον τοίχο.',
  },
  {
    key: 'boston',
    group: 'city',
    source: 'bio-photo-1.webp',
    role: 'city',
    alt: 'Άποψη της Βοστώνης την ώρα του ηλιοβασιλέματος.',
  },
  {
    key: 'san-diego',
    group: 'city',
    source: 'bio-photo-3.webp',
    role: 'city',
    alt: 'Το πανεπιστήμιο UC San Diego και το τοπίο της Καλιφόρνιας.',
  },
  {
    key: 'campus',
    group: 'city',
    source: 'bio-photo-2.webp',
    role: 'city',
    alt: 'Πανεπιστημιακό κτίριο με σημαία, στις Ηνωμένες Πολιτείες.',
  },
  {
    key: 'news-bloating',
    group: 'news',
    source: 'foyskoma_koilias-1.webp',
    role: 'news',
    alt: 'Εικόνα για το άρθρο σχετικά με τη δυσφορία και το φούσκωμα στην κοιλιά.',
  },
];

const CONDITION_IMAGES = {
  'kaysos-kai-palindromhsh': 'colic.webp',
  'oisofagos-barretts': 'barretts-esophagus.webp',
  'provlhma-sthn-kataposh': 'dysphagia.webp',
  'dyspepsia-kai-metewrismos': 'functional-dyspepsia.webp',
  'loimwxh-me-to-elikobakthridio-toy-pylwroy': 'helicobacter-pylori-infection.webp',
  'peptiko-elkos': 'peptic_ulcer.webp',
  'aimorragia-peptikoy': 'operation-room.webp',
  'eyerethisto-entero': 'colic.webp',
  'dyskoiliothta': 'constipation.webp',
  'diarrhea': 'diarrhea.webp',
  'koiliokakh': 'koiliokakh.webp',
  'dysanexia-trofwn': 'dysanexia-trofwn.webp',
  'nosos-toy-crohn': 'crohns-disease.webp',
  'elkwdhs-kolitida': 'ulcerative-colitis.webp',
  'colitida': 'colitis.webp',
  'ekkolpwmata': 'diverticular-disease.webp',
  'polypodes-toy-paxeos-enteroy': 'colonic-polyps.webp',
  'prolhpsh-kasrkinoy-paxeos-enteroy': 'colon-cancer-screening.webp',
  'aimorroides-kai-ragades': 'hemorrhoids-and-anal-fissure.webp',
  'anaimia': 'iron-deficiency-anemia.webp',
  'yperanaptyxh-twn-bakthridiwn-toy-leptoy-enteroy': 'SIBO.webp',
  'diataraxes-toy-mikrobiwmatos': 'microbiome-disorders.webp',
  'evexia-toy-enteroy': 'gut-wellness.webp',
  'xronia-hpatikh-nosos': 'chronic-liver-disease.webp',
  'kirrwsh-toy-hpatos': 'xronia-hpatikh-nosos.webp',
  'lipwdhs-hpar': 'liver-elastography.webp',
  'iogenhs-hpatitida': 'viral-hepatitis.webp',
  'oxeia-kai-xronia-pagkreatitida': 'acute-pancreatitis.webp',
  'hololithoi': 'gallstones-and-pancreatic-disease.webp',
  'kolikos': 'gut-colic.webp',
};

const PROCEDURE_IMAGES = {
  'kolonoskophsh': 'kolonoskophsh.jpg',
  'anwterh-endoskophsh': 'upper-endoscopy-md.jpg',
  'eykampth-sigmoeidoskophsh': 'eykampth-sigmoeidoskophsh.jpg',
  'kapsoyla-endoskophshs': 'pilcam.webp',
  'manometria-oisofagoy': 'manometria.jpg',
  'ph-metria': 'ph-metria.jpg',
  'axiologisi-oisofagou-me-endoflip': 'EndoFLIP-Esophageal-Evaluation-1.webp',
  'elastografia-ipatos-me-fibroscan': 'elastography.webp',
  'diastolh-oisofagoy': 'diastolh-oisofagoy.jpg',
};

const CONDITION_ALTS = {
  'kaysos-kai-palindromhsh': 'Απεικόνιση του πεπτικού συστήματος για την καούρα και την παλινδρόμηση.',
  'oisofagos-barretts': 'Απεικόνιση οισοφάγου Barrett.',
  'provlhma-sthn-kataposh': 'Απεικόνιση της κατάποσης και του οισοφάγου.',
  'dyspepsia-kai-metewrismos': 'Απεικόνιση λειτουργικής δυσπεψίας.',
  'loimwxh-me-to-elikobakthridio-toy-pylwroy': 'Απεικόνιση της λοίμωξης από ελικοβακτηρίδιο του πυλωρού.',
  'peptiko-elkos': 'Απεικόνιση πεπτικού έλκους.',
  'aimorragia-peptikoy': 'Αίθουσα επεμβατικής ενδοσκόπησης.',
  'eyerethisto-entero': 'Απεικόνιση ευερέθιστου εντέρου.',
  'dyskoiliothta': 'Απεικόνιση δυσκοιλιότητας.',
  'diarrhea': 'Απεικόνιση διάρροιας.',
  'koiliokakh': 'Απεικόνιση κοιλιοκάκης.',
  'dysanexia-trofwn': 'Απεικόνιση δυσανεξίας τροφών.',
  'nosos-toy-crohn': 'Απεικόνιση νόσου του Crohn.',
  'elkwdhs-kolitida': 'Απεικόνιση ελκώδους κολίτιδας.',
  'colitida': 'Απεικόνιση κολίτιδας.',
  'ekkolpwmata': 'Απεικόνιση εκκολπωμάτων.',
  'polypodes-toy-paxeos-enteroy': 'Απεικόνιση πολυπόδων του παχέος εντέρου.',
  'prolhpsh-kasrkinoy-paxeos-enteroy': 'Απεικόνιση πρόληψης καρκίνου του παχέος εντέρου.',
  'aimorroides-kai-ragades': 'Απεικόνιση αιμορροΐδων και ραγάδων.',
  'anaimia': 'Απεικόνιση αναιμίας από έλλειψη σιδήρου.',
  'yperanaptyxh-twn-bakthridiwn-toy-leptoy-enteroy': 'Απεικόνιση υπερανάπτυξης βακτηριδίων του λεπτού εντέρου.',
  'diataraxes-toy-mikrobiwmatos': 'Απεικόνιση διαταραχών του μικροβιώματος.',
  'evexia-toy-enteroy': 'Απεικόνιση ευεξίας του εντέρου.',
  'xronia-hpatikh-nosos': 'Απεικόνιση χρόνιας ηπατικής νόσου.',
  'kirrwsh-toy-hpatos': 'Απεικόνιση κίρρωσης του ήπατος.',
  'lipwdhs-hpar': 'Απεικόνιση λιπώδους ήπατος.',
  'iogenhs-hpatitida': 'Απεικόνιση ιογενούς ηπατίτιδας.',
  'oxeia-kai-xronia-pagkreatitida': 'Απεικόνιση παγκρεατίτιδας.',
  'hololithoi': 'Απεικόνιση χολόλιθων και παθήσεων των χοληφόρων.',
  'kolikos': 'Απεικόνιση κολικού.',
};

const PROCEDURE_ALTS = {
  'kolonoskophsh': 'Απεικόνιση κολονοσκόπησης.',
  'anwterh-endoskophsh': 'Απεικόνιση ανώτερης ενδοσκόπησης.',
  'eykampth-sigmoeidoskophsh': 'Απεικόνιση εύκαμπτης σιγμοειδοσκόπησης.',
  'kapsoyla-endoskophshs': 'Κάψουλα ενδοσκόπησης.',
  'manometria-oisofagoy': 'Απεικόνιση μανομετρίας οισοφάγου.',
  'ph-metria': 'Απεικόνιση pH-μετρίας.',
  'axiologisi-oisofagou-me-endoflip': 'Συσκευή EndoFLIP για την αξιολόγηση του οισοφάγου.',
  'elastografia-ipatos-me-fibroscan': 'Απεικόνιση ελαστογραφίας ήπατος.',
  'diastolh-oisofagoy': 'Απεικόνιση διαστολής οισοφάγου.',
};

for (const [slug, file] of Object.entries(CONDITION_IMAGES)) {
  ITEMS.push({
    key: `condition-${slug}`,
    group: 'conditions',
    source: file,
    role: 'article',
    alt: CONDITION_ALTS[slug] || `Απεικόνιση για τη πάθηση ${slug}.`,
    card: true,
  });
}
for (const [slug, file] of Object.entries(PROCEDURE_IMAGES)) {
  ITEMS.push({
    key: `procedure-${slug}`,
    group: 'procedures',
    source: file,
    role: 'article',
    alt: PROCEDURE_ALTS[slug] || `Απεικόνιση για την επέμβαση ${slug}.`,
    card: true,
  });
}

await mkdir(OUT, { recursive: true });

const manifest = {};
const missing = [];

for (const item of ITEMS) {
  const sourcePath = path.join(SRC, item.source);
  if (!existsSync(sourcePath)) {
    missing.push(item.source);
    continue;
  }

  const meta = await sharp(sourcePath).metadata();
  const role = ROLES[item.role];
  const aspect = role.aspect ?? (meta.width && meta.height ? meta.width / meta.height : 1);

  const variants = [];

  for (const targetWidth of role.widths) {
    // Never upscale beyond the source.
    const width = Math.min(targetWidth, meta.width ?? targetWidth);
    const height = Math.round(width / aspect);

    const base = sharp(sourcePath).rotate();
    const pipeline = () =>
      base.clone().resize({
        width,
        height,
        fit: 'cover',
        position: 'attention',
        withoutEnlargement: false,
      });

    const avifName = `${item.key}-${width}.avif`;
    const webpName = `${item.key}-${width}.webp`;

    await pipeline().avif({ quality: role.quality, effort: 5 }).toFile(path.join(OUT, avifName));
    await pipeline().webp({ quality: Math.min(role.quality + 18, 82), effort: 4 }).toFile(path.join(OUT, webpName));

    variants.push({ width, height, avif: `/images/${avifName}`, webp: `/images/${webpName}` });
  }

  // Deduplicate widths that collapsed because of small sources.
  const unique = [];
  const seen = new Set();
  for (const variant of variants) {
    if (seen.has(variant.width)) continue;
    seen.add(variant.width);
    unique.push(variant);
  }
  unique.sort((a, b) => a.width - b.width);

  manifest[item.key] = {
    alt: item.alt,
    width: unique[unique.length - 1].width,
    height: unique[unique.length - 1].height,
    variants: unique,
  };
}

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

if (missing.length) console.warn(`Missing sources: ${missing.join(', ')}`);

const totalFiles = Object.values(manifest).reduce((sum, image) => sum + image.variants.length * 2, 0);
console.log(`Generated ${totalFiles} files for ${Object.keys(manifest).length} images.`);
console.log(`Manifest: ${path.relative(ROOT, MANIFEST)}`);
