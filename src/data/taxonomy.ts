import type { Condition, Procedure, ConditionCategory, ProcedureCategory } from './types';

export const conditionCategories: { key: ConditionCategory; label: string; description: string }[] = [
  {
    key: 'oesophagus',
    label: 'Οισοφάγος',
    description: 'Καούρα, παλινδρόμηση, δυσκολία στην κατάποση.',
  },
  {
    key: 'stomach',
    label: 'Στόμαχος',
    description: 'Δυσπεψία, έλκος, H. pylori, αιμορραγία.',
  },
  {
    key: 'intestine',
    label: 'Έντερο',
    description: 'Ευερέθιστο έντερο, φλεγμονώδεις νόσοι, πολύποδες.',
  },
  {
    key: 'liver',
    label: 'Ήπαρ',
    description: 'Λιπώδες ήπαρ, κίρρωση, ιογενείς ηπατίτιδες.',
  },
  {
    key: 'pancreas',
    label: 'Πάγκρεας & Χοληφόρα',
    description: 'Παγκρεατίτιδα, χολόλιθοι, κολικός.',
  },
];

export const procedureCategories: { key: ProcedureCategory; label: string; description: string }[] = [
  {
    key: 'endoscopy',
    label: 'Ενδοσκοπήσεις',
    description: 'Έλεγχος του πεπτικού σωλήνα με σύγχρονα ενδοσκόπια.',
  },
  {
    key: 'functional',
    label: 'Λειτουργικές εξετάσεις',
    description: 'Μέτρηση της λειτουργίας του οισοφάγου.',
  },
  {
    key: 'liver',
    label: 'Ήπαρ',
    description: 'Μη επεμβατική εκτίμηση της ηπατικής ίνωσης.',
  },
  {
    key: 'therapeutic',
    label: 'Θεραπευτικές',
    description: 'Ενδοσκοπικές θεραπείες στενώσεων.',
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

export const conditionCategoryLabel = (key: ConditionCategory) =>
  conditionCategories.find((category) => category.key === key)?.label ?? key;

export const procedureCategoryLabel = (key: ProcedureCategory) =>
  procedureCategories.find((category) => category.key === key)?.label ?? key;

export function relatedProcedures(condition: Condition, all: Procedure[]): Procedure[] {
  const slugs = proceduresByConditionCategory[condition.category] ?? [];
  return slugs
    .map((slug) => all.find((procedure) => procedure.slug === slug))
    .filter((item): item is Procedure => Boolean(item));
}

export function relatedConditions(procedure: Procedure, all: Condition[]): Condition[] {
  const categories = conditionsByProcedureCategory[procedure.category] ?? [];
  return all.filter((condition) => categories.includes(condition.category)).slice(0, 6);
}

export function groupConditions(items: Condition[]) {
  return conditionCategories
    .map((category) => ({
      ...category,
      items: items.filter((condition) => condition.category === category.key),
    }))
    .filter((group) => group.items.length > 0);
}

/**
 * Priority is a display order, not a statement that these are the only
 * conditions the clinic treats. Every condition remains listed.
 */
export const priorityConditionSlugs = [
  'kaysos-kai-palindromhsh',
  'oisofagos-barretts',
  'diarrhea',
  'nosos-toy-crohn',
  'elkwdhs-kolitida',
  'prolhpsh-kasrkinoy-paxeos-enteroy',
];

export function priorityRank(slug: string) {
  const index = priorityConditionSlugs.indexOf(slug);
  return index === -1 ? 999 : index;
}
