export const site = {
  name: 'Αθανάσιος Δεσαλέρμος',
  firstName: 'Αθανάσιος',
  lastName: 'Δεσαλέρμος',
  credentials: 'MD, FESBGH',
  role: 'Γαστρεντερολόγος – Ηπατολόγος',
  roleEn: 'Gastroenterologist – Hepatologist',
  city: 'Αθήνα',
  url: 'https://drdesalermos.gr',
  title: 'Γαστρεντερολόγος – Ηπατολόγος στην Αθήνα | Αθανάσιος Δεσαλέρμος',
  description:
    'Ο Αθανάσιος Δεσαλέρμος, MD, FESBGH είναι γαστρεντερολόγος – ηπατολόγος στην Αθήνα, με εκπαίδευση στο Harvard, το UC San Diego και το UMass Chan. Σύγχρονη διάγνωση και θεραπεία στο Μαρούσι.',
  email: 'desalermosclinic@gmail.com',
  phone: '2106157438',
  mobile: '6992252277',
  phoneDisplay: '210 615 7438',
  mobileDisplay: '699 225 2277',
  address: {
    street: 'Κηφισίας 58, 1ος όροφος',
    locality: 'Μαρούσι',
    postalCode: '151 25',
    region: 'Αττική',
    country: 'GR',
  },
  addressOneLine: 'Κηφισίας 58, 1ος όροφος, Μαρούσι 151 25',
  mapsUrl: 'https://maps.app.goo.gl/PtTngBoeXt2KMfd69',
  mapQuery: 'Κηφισίας 58, Μαρούσι 151 25, Ελλάδα',
  linkedin: 'https://www.linkedin.com/in/athanasios-desalermos-md-fesbgh-0a9aa7b6',
  pubmed: 'https://pubmed.ncbi.nlm.nih.gov/?term=desalermos',
  umass: 'https://profiles.umassmed.edu/display/19900773',
  bookNote: 'Κατόπιν ραντεβού',
  hours: 'Δευτέρα – Παρασκευή, κατόπιν ραντεβού',
} as const;

export const nav = [
  { label: 'Αρχική', href: '/' },
  { label: 'Ο Ιατρός', href: '/o-iatros' },
  { label: 'Το Ιατρείο', href: '/iatreio' },
  { label: 'Παθήσεις', href: '/pathiseis' },
  { label: 'Επεμβάσεις', href: '/epemvaseis' },
  { label: 'Νέα', href: '/nea' },
  { label: 'Επικοινωνία', href: '/epikoinonia' },
] as const;

export const credentials = [
  {
    title: 'Διευθυντής',
    detail: 'Γαστρεντερολογική – Ηπατολογική Κλινική, Ιατρικό Κέντρο Αθηνών',
  },
  {
    title: 'Επίκουρος Καθηγητής',
    detail: 'UMass Chan Medical School, ΗΠΑ',
  },
  {
    title: 'Fellow (FESBGH)',
    detail: 'European Section and Board of Gastroenterology & Hepatology',
  },
  {
    title: 'Board Certified',
    detail: 'Gastroenterology & Hepatology, Ηνωμένες Πολιτείες Αμερικής',
  },
  {
    title: 'Μέλος',
    detail: 'American College of Gastroenterology',
  },
] as const;

export const institutions = [
  'Harvard Medical School',
  'UC San Diego',
  'UMass Chan Medical School',
  'FESBGH',
  'American College of Gastroenterology',
] as const;

export const journey = [
  {
    stage: '01',
    place: 'Αθήνα',
    title: 'Ιατρική Σχολή Αθηνών',
    detail:
      'Αποφοίτηση το 2007. Ακολούθησε η εκπλήρωση των στρατιωτικών υποχρεώσεων και η αναχώρηση για τις Ηνωμένες Πολιτείες.',
    image: null,
  },
  {
    stage: '02',
    place: 'Βοστώνη',
    title: 'Harvard Medical School — Massachusetts General Hospital',
    detail:
      'Μεταδιδακτορικός ερευνητής στην Παθολογία, με συμμετοχή σε βασική και κλινική έρευνα και βράβευση από το Εθνικό Ινστιτούτο Υγείας των ΗΠΑ (NIH).',
    image: 'boston',
  },
  {
    stage: '03',
    place: 'Βοστώνη',
    title: 'Boston University — Εσωτερική Παθολογία',
    detail:
      'Ειδίκευση στην εσωτερική παθολογία σε ένα από τα κορυφαία εκπαιδευτικά νοσοκομεία των ΗΠΑ, δίπλα στον τότε διευθυντή του τμήματος ΙΦΝΕ της Mayo Clinic, Dr. Francis Farraye.',
    image: null,
  },
  {
    stage: '04',
    place: 'Σαν Ντιέγκο',
    title: 'UC San Diego — Γαστρεντερολογία & Ηπατολογία',
    detail:
      'Τριετής ειδίκευση στο κορυφαίο πρόγραμμα γαστρεντερολογίας, με εξειδίκευση στις ιδιοπαθείς φλεγμονώδεις παθήσεις του εντέρου δίπλα στον Dr. William Sandborn.',
    image: 'san-diego',
  },
  {
    stage: '05',
    place: 'Μασαχουσέτη',
    title: 'UMass Chan Medical School — Επίκουρος Καθηγητής',
    detail:
      'Ανάπτυξη πρωτοποριακής γαστρεντερολογικής και ηπατολογικής κλινικής, εκπαίδευση φοιτητών και ειδικευομένων, και συνεχής ερευνητική δραστηριότητα.',
    image: null,
  },
  {
    stage: '06',
    place: 'Αθήνα',
    title: 'Ιατρικό Κέντρο Αθηνών — Διευθυντής',
    detail:
      'Επιστροφή στην Ελλάδα και ανάληψη της διεύθυνσης της Γαστρεντερολογικής – Ηπατολογικής Κλινικής, με έμφαση στη σύγχρονη, εξατομικευμένη φροντίδα.',
    image: null,
  },
] as const;

export const principles = [
  {
    num: '01',
    title: 'Διεθνής εμπειρία',
    body: 'Εκπαίδευση και κλινική πρακτική στο Harvard, το UC San Diego και το UMass Chan, με συνεχή επιστημονική δραστηριότητα.',
  },
  {
    num: '02',
    title: 'Σύγχρονη τεχνολογία',
    body: 'Ενδοσκοπήσεις υψηλής ακρίβειας, EndoFLIP, FibroScan και κάψουλα ενδοσκόπησης, με έμφαση στην ασφάλεια.',
  },
  {
    num: '03',
    title: 'Προσωπική φροντίδα',
    body: 'Χρόνος για κάθε ασθενή, σαφής ενημέρωση και συνέχεια στη θεραπεία — από τη διάγνωση έως την παρακολούθηση.',
  },
] as const;
