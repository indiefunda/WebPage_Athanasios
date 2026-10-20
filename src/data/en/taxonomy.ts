import type { Condition, Procedure, ConditionCategory, ProcedureCategory } from '../types';

export const conditionCategoriesEn: {
  key: ConditionCategory;
  label: string;
  description: string;
}[] = [
  {
    key: 'oesophagus',
    label: 'Esophagus',
    description: 'Heartburn, reflux, difficulty swallowing.',
  },
  {
    key: 'stomach',
    label: 'Stomach',
    description: 'Dyspepsia, ulcers, H. pylori, bleeding.',
  },
  {
    key: 'intestine',
    label: 'Intestine',
    description: 'IBS, inflammatory bowel disease, polyps.',
  },
  {
    key: 'liver',
    label: 'Liver',
    description: 'Fatty liver, cirrhosis, viral hepatitis.',
  },
  {
    key: 'pancreas',
    label: 'Pancreas & Biliary',
    description: 'Pancreatitis, gallstones, biliary colic.',
  },
];

export const procedureCategoriesEn: {
  key: ProcedureCategory;
  label: string;
  description: string;
}[] = [
  {
    key: 'endoscopy',
    label: 'Endoscopy',
    description: 'Examination of the digestive tract with modern endoscopes.',
  },
  {
    key: 'functional',
    label: 'Functional tests',
    description: 'Measurement of esophageal function.',
  },
  {
    key: 'liver',
    label: 'Liver',
    description: 'Non-invasive assessment of liver fibrosis.',
  },
  {
    key: 'therapeutic',
    label: 'Therapeutic',
    description: 'Endoscopic treatment of strictures.',
  },
];

const proceduresByConditionCategory: Record<ConditionCategory, string[]> = {
  oesophagus: [
    'anwterh-endoskophsh',
    'ph-metria',
    'manometria-oisofagoy',
    'axiologisi-oisofagou-me-endoflip',
    'diastolh-oisofagoy',
  ],
  stomach: ['anwterh-endoskophsh'],
  intestine: ['kolonoskophsh', 'eykampth-sigmoeidoskophsh', 'kapsoyla-endoskophshs'],
  liver: ['elastografia-ipatos-me-fibroscan'],
  pancreas: ['anwterh-endoskophsh'],
};

const conditionsByProcedureCategory: Record<ProcedureCategory, ConditionCategory[]> = {
  endoscopy: ['oesophagus', 'stomach', 'intestine'],
  functional: ['oesophagus'],
  liver: ['liver'],
  therapeutic: ['oesophagus'],
};

export const conditionCategoryLabelEn = (key: ConditionCategory) =>
  conditionCategoriesEn.find((category) => category.key === key)?.label ?? key;

export const procedureCategoryLabelEn = (key: ProcedureCategory) =>
  procedureCategoriesEn.find((category) => category.key === key)?.label ?? key;

export function relatedProceduresEn(condition: Condition, all: Procedure[]): Procedure[] {
  const slugs = proceduresByConditionCategory[condition.category] ?? [];
  return slugs
    .map((slug) => all.find((procedure) => procedure.slug === slug))
    .filter((item): item is Procedure => Boolean(item));
}

export function relatedConditionsEn(procedure: Procedure, all: Condition[]): Condition[] {
  const categories = conditionsByProcedureCategory[procedure.category] ?? [];
  return all.filter((condition) => categories.includes(condition.category)).slice(0, 6);
}

export function groupConditionsEn(items: Condition[]) {
  return conditionCategoriesEn
    .map((category) => ({
      ...category,
      items: items.filter((condition) => condition.category === category.key),
    }))
    .filter((group) => group.items.length > 0);
}
