/**
 * Adds sentence/paragraph-level citations to the three patient articles and
 * aligns each reference list with the claims in the text.
 *
 * Run: node scripts/add-article-citations.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const references = {
  reflux: [
    {
      label:
        '1. Fass R, Boeckxstaens GE, El-Serag H, et al. Gastro-oesophageal reflux disease. Nature Reviews Disease Primers, 2021.',
      url: 'https://doi.org/10.1038/s41572-021-00287-w',
    },
    {
      label:
        '2. Katz PO, Dunbar KB, Schnoll-Sussman FH, et al. ACG Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease. American Journal of Gastroenterology, 2022.',
      url: 'https://doi.org/10.14309/ajg.0000000000001538',
    },
    {
      label:
        '3. Shaheen NJ, Falk GW, Iyer PG, et al. Diagnosis and Management of Barrett’s Esophagus: An Updated ACG Guideline. American Journal of Gastroenterology, 2022.',
      url: 'https://doi.org/10.14309/ajg.0000000000001680',
    },
    {
      label:
        '4. Reimer C, Søndergaard B, Hilsted L, Bytzer P. Proton-pump inhibitor therapy induces acid-related symptoms in healthy volunteers after withdrawal of therapy. Gastroenterology, 2009.',
      url: 'https://doi.org/10.1053/j.gastro.2009.03.058',
    },
  ],
  microbiome: [
    {
      label:
        '1. Porcari S, Mullish BH, Asnicar F, et al. International consensus statement on microbiome testing in clinical practice. Lancet Gastroenterology & Hepatology, 2024.',
      url: 'https://doi.org/10.1016/S2468-1253(24)00311-X',
    },
    {
      label:
        '2. Microbiome risk profiles as biomarkers for inflammatory and metabolic disorders. Nature Reviews Gastroenterology & Hepatology, 2022.',
      url: 'https://www.nature.com/articles/s41575-022-00581-2',
    },
    {
      label:
        '3. David LA, et al. Diet rapidly and reproducibly alters the human gut microbiome. Nature, 2014.',
      url: 'https://doi.org/10.1038/nature12820',
    },
    {
      label:
        '4. Wastyk HC, et al. Gut-microbiota-targeted diets modulate human immune status. Cell, 2021.',
      url: 'https://doi.org/10.1016/j.cell.2021.06.019',
    },
    {
      label:
        '5. Sanders ME, et al. Probiotics and prebiotics in intestinal health and disease: from biology to the clinic. Nature Reviews Gastroenterology & Hepatology, 2019.',
      url: 'https://doi.org/10.1038/s41575-019-0173-3',
    },
    {
      label:
        '6. The use of faecal microbiota transplant as treatment for recurrent or refractory Clostridioides difficile infection and other potential indications: second edition of joint BSG/HIS guidelines. Gut, 2024.',
      url: 'https://doi.org/10.1136/gutjnl-2023-331550',
    },
    {
      label:
        '7. Kwon SY, et al. Exploiting bacteria for cancer immunotherapy. Nature Reviews Clinical Oncology, 2024.',
      url: 'https://doi.org/10.1038/s41571-024-00908-9',
    },
    {
      label:
        '8. de Vos WM, Tilg H, Van Hul M, Cani PD. Gut microbiome and health: mechanistic insights. Gut, 2022.',
      url: 'https://doi.org/10.1136/gutjnl-2021-326789',
    },
  ],
  bloating: [
    {
      label:
        '1. Moshiree B, Drossman D, Shaukat A. AGA Clinical Practice Update on Evaluation and Management of Belching, Abdominal Bloating, and Distention. Gastroenterology, 2023.',
      url: 'https://doi.org/10.1053/j.gastro.2023.04.039',
    },
    {
      label:
        '2. Prevalence and Associated Factors of Bloating: Results From the Rome Foundation Global Epidemiology Study. Gastroenterology, 2023.',
      url: 'https://doi.org/10.1053/j.gastro.2023.05.049',
    },
    {
      label:
        '3. Halmos EP, Power VA, Shepherd SJ, Gibson PR, Muir JG. A diet low in FODMAPs reduces symptoms of irritable bowel syndrome. Gastroenterology, 2014.',
      url: 'https://doi.org/10.1053/j.gastro.2013.09.046',
    },
  ],
};

const config = {
  'kaysos-palindromhsh-odigos': {
    refs: references.reflux,
    keyPoints: ['1', '2', '2,3'],
    paragraphs: {
      0: '1',
      2: '1',
      3: '1',
      5: '2,3',
      6: '1,3',
      8: '2',
      9: '2',
      11: '2,4',
      12: '2',
      14: '2,3',
      15: '2',
      17: '2',
    },
  },
  'mikrobiwma-enteroy-ti-kseroume': {
    refs: references.microbiome,
    keyPoints: ['8', '1', '5,6,7'],
    paragraphs: {
      0: '8',
      2: '8',
      4: '2',
      6: '1',
      7: '1',
      9: '3,4',
      10: '5,6,7',
      12: '1',
      13: '2',
      15: '2',
    },
  },
  'dysforia-fouskoma-koilia': {
    refs: references.bloating,
    keyPoints: ['1', '1', '1'],
    paragraphs: {
      0: '1,2',
      2: '1',
      3: '1',
      5: '1',
      6: '1,3',
      7: '1',
      9: '1',
      11: '1',
    },
  },
};

const addSup = (text, numbers) => {
  const cleaned = text.replace(/<sup>[\d,]+<\/sup>\s*$/, '').trimEnd();
  return `${cleaned}<sup>${numbers}</sup>`;
};

const load = async (file) => {
  const source = await readFile(file, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(']') + 1;
  return {
    prefix: source.slice(0, start),
    suffix: source.slice(end),
    items: new Function(`return (${source.slice(start, end)});`)(),
  };
};

const save = async (file, data) => {
  await writeFile(file, `${data.prefix}${JSON.stringify(data.items, null, 2)}${data.suffix}`);
};

for (const file of [
  path.join(ROOT, 'src', 'data', 'news.ts'),
  path.join(ROOT, 'src', 'data', 'en', 'news.ts'),
]) {
  const data = await load(file);
  for (const post of data.items) {
    const update = config[post.slug];
    if (!update) continue;
    post.references = update.refs;
    post.keyPoints = post.keyPoints.map((point, index) =>
      update.keyPoints[index] ? addSup(point, update.keyPoints[index]) : point,
    );
    for (const [index, numbers] of Object.entries(update.paragraphs)) {
      const i = Number(index);
      if (post.paragraphs[i]) post.paragraphs[i] = addSup(post.paragraphs[i], numbers);
    }
  }
  await save(file, data);
  console.log('citations added:', file);
}
