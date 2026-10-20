export const siteEn = {
  name: 'Athanasios Desalermos',
  firstName: 'Athanasios',
  lastName: 'Desalermos',
  credentials: 'MD, FESBGH',
  role: 'Gastroenterologist – Hepatologist',
  city: 'Athens',
  url: 'https://drdesalermos.gr',
  title: 'Gastroenterologist & Hepatologist in Athens | Athanasios Desalermos',
  description:
    'Athanasios Desalermos, MD, FESBGH is a US-trained, board-certified gastroenterologist and hepatologist in Athens. Colonoscopy, gastroscopy and specialized care in Marousi.',
  email: 'desalermosclinic@gmail.com',
  phone: '2106157438',
  mobile: '6992252277',
  phoneDisplay: '210 615 7438',
  mobileDisplay: '699 225 2277',
  address: {
    street: '58 Kifisias Ave., 1st floor',
    locality: 'Marousi',
    postalCode: '151 25',
    region: 'Attica',
    country: 'GR',
  },
  addressOneLine: '58 Kifisias Ave., 1st floor, Marousi 151 25',
  mapsUrl: 'https://maps.app.goo.gl/PtTngBoeXt2KMfd69',
  mapQuery: '58 Kifisias Ave, Marousi 151 25, Greece',
  linkedin: 'https://www.linkedin.com/in/athanasios-desalermos-md-fesbgh-0a9aa7b6',
  pubmed: 'https://pubmed.ncbi.nlm.nih.gov/?term=desalermos',
  umass: 'https://profiles.umassmed.edu/display/19900773',
  bookNote: 'By appointment',
  hours: 'By appointment',
} as const;

export const credentialsEn = [
  {
    title: 'Director',
    detail: 'Gastroenterology – Hepatology Clinic, Athens Medical Center',
  },
  {
    title: 'Assistant Professor',
    detail: 'UMass Chan Medical School, USA',
  },
  {
    title: 'Fellow (FESBGH)',
    detail: 'European Section and Board of Gastroenterology & Hepatology',
  },
  {
    title: 'Board Certified',
    detail: 'Gastroenterology & Hepatology, United States',
  },
  {
    title: 'Member',
    detail: 'American College of Gastroenterology',
  },
  {
    title: 'US clinic',
    detail: 'UMass Chan Medical School, Massachusetts',
  },
  {
    title: 'International collaborations',
    detail: 'Hospitals across the United States',
  },
] as const;

export const journeyEn = [
  {
    stage: '01',
    place: 'Athens',
    title: 'National and Kapodistrian University of Athens, School of Medicine',
    detail:
      'Graduated in 2007, completed military service and moved to the United States.',
    image: null,
  },
  {
    stage: '02',
    place: 'Boston',
    title: 'Harvard Medical School — Massachusetts General Hospital',
    detail:
      'Postdoctoral research fellow in Pathology, contributing to basic and clinical research and receiving an award from the US National Institutes of Health (NIH).',
    image: 'boston',
  },
  {
    stage: '03',
    place: 'Boston',
    title: 'Boston University — Internal Medicine',
    detail:
      'Internal medicine residency at a leading US teaching hospital, working alongside Dr. Francis Farraye, then Director of the IBD Unit at Mayo Clinic.',
    image: null,
  },
  {
    stage: '04',
    place: 'San Diego',
    title: 'UC San Diego — Gastroenterology & Hepatology',
    detail:
      'Three-year fellowship at a leading gastroenterology program, with a focus on inflammatory bowel disease under Dr. William Sandborn.',
    image: 'san-diego',
  },
  {
    stage: '05',
    place: 'Massachusetts',
    title: 'UMass Chan Medical School — Assistant Professor',
    detail:
      'Developed an innovative gastroenterology and hepatology clinic, taught medical students and residents, and remained active in research.',
    image: null,
  },
  {
    stage: '06',
    place: 'Athens',
    title: 'Athens Medical Center — Director',
    detail:
      'Returned to Greece to lead the Gastroenterology – Hepatology Clinic, with a focus on modern, individualized care.',
    image: null,
  },
] as const;

export const principlesEn = [
  {
    num: '01',
    title: 'International experience',
    body: 'Training and clinical practice at Harvard, UC San Diego and UMass Chan, with ongoing academic activity.',
  },
  {
    num: '02',
    title: 'Modern technology',
    body: 'High-definition endoscopy, EndoFLIP, FibroScan and capsule endoscopy, with safety at the center.',
  },
  {
    num: '03',
    title: 'Personal care',
    body: 'Time for every patient, clear information and continuity from diagnosis to follow-up.',
  },
] as const;

export const authorityEn = {
  eyebrow: 'US-trained & board-certified',
  title: 'One of the very few in Athens.',
  text: 'Dr. Desalermos is one of the very few gastroenterologists–hepatologists in Athens with US training and board certification. At Athens Medical Center, he is among the very few with this profile.',
  points: [
    {
      num: '01',
      title: 'US training',
      detail: 'Harvard Medical School · UC San Diego',
    },
    {
      num: '02',
      title: 'Board certified',
      detail: 'Gastroenterology & Hepatology, USA',
    },
    {
      num: '03',
      title: 'US clinic',
      detail: 'UMass Chan Medical School, Massachusetts',
    },
    {
      num: '04',
      title: 'Collaborations',
      detail: 'Hospitals across the United States',
    },
  ],
} as const;

export const institutions = [
  'Harvard Medical School',
  'UC San Diego',
  'UMass Chan Medical School',
  'FESBGH',
  'American College of Gastroenterology',
] as const;