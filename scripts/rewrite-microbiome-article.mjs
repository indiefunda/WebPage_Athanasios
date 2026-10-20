/**
 * Rewrites the microbiome article so it supports the clinic's microbiome
 * assessment service without overclaiming. Each key claim carries a numbered
 * citation matching the reference list.
 *
 * Run: node scripts/rewrite-microbiome-article.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const greek = {
  title:
    'Το μικροβίωμα του εντέρου: τι μπορεί να μας πει — και πώς αξιοποιείται στην πράξη',
  excerpt:
    'Το μικροβίωμα επηρεάζει την πέψη, την άμυνα και την ανταπόκριση σε θεραπείες. Η ανάλυσή του, μέσα σε ένα ολοκληρωμένο κλινικό πλαίσιο, μπορεί να δώσει χρήσιμες κατευθύνσεις για τη φροντίδα σας.',
  keyPoints: [
    'Το μικροβίωμα είναι ένα ενεργό «όργανο» που συμμετέχει στην πέψη, στην ανοσία και στον μεταβολισμό.',
    'Η ανάλυση μικροβιώματος μπορεί να αναδείξει μοτίβα και να καθοδηγήσει εξατομικευμένες επιλογές — όταν ερμηνεύεται από γιατρό.',
    'Από τη διατροφή και τα προβιοτικά έως τη μεταμόσχευση μικροβιώματος, οι θεραπευτικές επιλογές αυξάνονται.',
  ],
  inlineImage: {
    name: 'condition-evexia-toy-enteroy',
    caption:
      'Η ποικιλία στη διατροφή είναι πιο σημαντική από ένα «τέλειο» μικροβίωμα.',
  },
  paragraphs: [
    'Το έντερο φιλοξενεί εκατοντάδες είδη μικροοργανισμών — βακτήρια, ιούς, μύκητες — που μαζί ονομάζονται μικροβίωμα. Δεν είναι απλοί «ένοικοι»: συμμετέχουν στην πέψη, παράγουν ουσίες που επηρεάζουν το ανοσοποιητικό και τον μεταβολισμό, και αλλάζουν διαρκώς ανάλογα με τη διατροφή, τα φάρμακα και το περιβάλλον.',
    '## Ένα όργανο που μόλις αρχίζουμε να κατανοούμε',
    'Το μικροβίωμα λειτουργεί σαν ένα επιπλέον όργανο. Βοηθά στην πέψη των ινών, παράγει βιταμίνες και λιπαρά οξέα βραχείας αλύσου, εκπαιδεύει το ανοσοποιητικό και επηρεάζει τον τρόπο που απορροφούμε θρεπτικά συστατικά και φάρμακα. Κάθε άνθρωπος έχει διαφορετικό προφίλ — δεν υπάρχει ένα «ιδανικό» μικροβίωμα που ταιριάζει σε όλους.',
    '## Γιατί μπορεί να έχει σημασία για εσάς',
    'Η σύνθεση του μικροβιώματος έχει συνδεθεί με ένα ευρύ φάσμα καταστάσεων: από το ευερέθιστο έντερο και τις ιδιοπαθείς φλεγμονώδεις νόσους του εντέρου (ΙΦΝΕ) έως μεταβολικές διαταραχές και την ανταπόκριση σε ορισμένες θεραπείες.<sup>2</sup> Η σχέση δεν είναι πάντα αιτιακή — γι’ αυτό η έρευνα συνεχίζεται — αλλά το μικροβίωμα αναδεικνύεται σε σημαντικό κομμάτι της εξατομικευμένης ιατρικής.',
    '## Τι μπορεί — και τι δεν μπορεί — να δείξει μια ανάλυση',
    'Μια ανάλυση μικροβιώματος δίνει μια εικόνα της σύνθεσης και της ποικιλότητας των μικροοργανισμών. Δεν είναι μια αυτόνομη διάγνωση και δεν αντικαθιστά το ιστορικό, την κλινική εξέταση ή τις υπόλοιπες εξετάσεις.<sup>1</sup> Η αξία της βρίσκεται στην ερμηνεία: ποια μοτίβα μπορεί να εξηγούν τα συμπτώματά σας, ποιες τροφές ή θεραπείες μπορεί να βοηθήσουν και τι αξίζει να παρακολουθήσουμε.',
    'Γι’ αυτό, μια εξέταση που γίνεται χωρίς ιατρική καθοδήγηση μπορεί να δημιουργήσει περισσότερες ερωτήσεις από απαντήσεις. Στο ιατρείο, η ανάλυση εντάσσεται σε ένα πλήρες κλινικό πλαίσιο — και αυτό είναι που της δίνει αξία.',
    '## Από την πληροφορία στη θεραπεία',
    'Η διατροφή είναι ο πιο άμεσος μοχλός: η αύξηση φυτικών ινών, η ποικιλία φρούτων, λαχανικών, οσπρίων και δημητριακών ολικής άλεσης, καθώς και τα ζυμωμένα τρόφιμα, μπορούν να αλλάξουν το μικροβίωμα μέσα σε λίγες εβδομάδες.<sup>3,4</sup> Σε τυχαιοποιημένη μελέτη, οι φυτικές ίνες και τα ζυμωμένα τρόφιμα επηρέασαν το μικροβίωμα και δείκτες φλεγμονής, με διαφορετικά αποτελέσματα για κάθε παρέμβαση.',
    'Τα προβιοτικά και τα πρεβιοτικά μπορεί να βοηθήσουν σε συγκεκριμένες καταστάσεις — για παράδειγμα στη διάρροια από αντιβιοτικά — αλλά δεν είναι όλα ίδια και δεν αντικαθιστούν τη θεραπεία μιας υποκείμενης νόσου.<sup>5</sup> Η μεταμόσχευση μικροβιώματος κοπράνων (FMT) έχει καθιερωθεί για την υποτροπιάζουσα λοίμωξη από Clostridioides difficile, ενώ σε άλλες ενδείξεις βρίσκεται ακόμη υπό μελέτη.<sup>6</sup> Παράλληλα, η έρευνα εξετάζει πώς το μικροβίωμα επηρεάζει την ανταπόκριση στην ανοσοθεραπεία του καρκίνου — μια από τις πιο συναρπαστικές κατευθύνσεις.<sup>7</sup>',
    '## Η προσέγγιση στο ιατρείο',
    'Στο ιατρείο, η εκτίμηση ξεκινά από το ιστορικό, τα συμπτώματα, τη διατροφή και τις προηγούμενες εξετάσεις. Αν η ανάλυση μικροβιώματος είναι κατάλληλη για την περίπτωσή σας, την εντάσσουμε σε ένα σχέδιο που μπορεί να περιλαμβάνει διατροφικές αλλαγές, στοχευμένα προβιοτικά, θεραπεία της υποκείμενης νόσου και τακτική παρακολούθηση. Δεν πρόκειται για μια εξέταση που «τα λύνει όλα» — αλλά για ένα ακόμη εργαλείο που μας βοηθά να προσωποποιήσουμε τη φροντίδα.',
    'Αν έχετε επίμονα πεπτικά συμπτώματα, υποτροπιάζουσες λοιμώξεις, διάρροια, φούσκωμα, δυσκοιλιότητα ή μια διάγνωση όπως ΙΦΝΕ ή ευερέθιστο έντερο, αξίζει να συζητήσουμε αν η ανάλυση μικροβιώματος έχει νόημα για εσάς. Το ίδιο ισχύει αν αναρωτιέστε πώς η διατροφή και τα προβιοτικά επηρεάζουν την υγεία σας.',
    '## Το μέλλον είναι εξατομικευμένο',
    'Η έρευνα για το μικροβίωμα εξελίσσεται γρήγορα: νέες διαγνωστικές προσεγγίσεις, στοχευμένες θεραπείες και εξατομικευμένα διατροφικά σχέδια βρίσκονται σε διαφορετικά στάδια ανάπτυξης. Αυτό που έχει ήδη αξία είναι η συζήτηση με έναν ειδικό που μπορεί να ξεχωρίσει τι είναι τεκμηριωμένο, τι είναι υποσχόμενο και τι δεν ταιριάζει στην περίπτωσή σας.',
    '## Κλείστε μια εκτίμηση',
    'Αν θέλετε να καταλάβετε τι συμβαίνει στο έντερό σας και αν η ανάλυση μικροβιώματος μπορεί να σας βοηθήσει, <a href="/epikoinonia#rantevou">κλείστε ραντεβού</a>. Θα συζητήσουμε το ιστορικό σας, θα αξιολογήσουμε τις εξετάσεις που έχουν νόημα και θα σχεδιάσουμε μαζί τα επόμενα βήματα.',
  ],
  references: [
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
  ],
};

const english = {
  title: 'The gut microbiome: what it can tell us — and how it is used in practice',
  excerpt:
    'The microbiome influences digestion, immunity and response to treatment. Analyzed within a full clinical assessment, it can offer useful direction for your care.',
  keyPoints: [
    'The microbiome is an active “organ” involved in digestion, immunity and metabolism.',
    'Microbiome analysis can reveal patterns and guide personalized choices — when it is interpreted by a doctor.',
    'From diet and probiotics to fecal microbiota transplantation, the therapeutic options are growing.',
  ],
  inlineImage: {
    name: 'condition-evexia-toy-enteroy',
    caption: 'Dietary variety matters more than a “perfect” microbiome.',
  },
  paragraphs: [
    'The gut is home to hundreds of species of microorganisms — bacteria, viruses and fungi — collectively called the microbiome. They are not passive residents: they help digest food, produce substances that influence immunity and metabolism, and change continuously with diet, medicines and environment.',
    '## An organ we are only beginning to understand',
    'The microbiome works like an additional organ. It helps digest fiber, produces vitamins and short-chain fatty acids, trains the immune system and influences how we absorb nutrients and medicines. Every person has a different profile — there is no single “ideal” microbiome that suits everyone.',
    '## Why it may matter for you',
    'The composition of the microbiome has been linked to a wide range of conditions: from IBS and inflammatory bowel disease (IBD) to metabolic disorders and response to some treatments.<sup>2</sup> The relationship is not always causal — which is why research continues — but the microbiome is emerging as an important part of personalized medicine.',
    '## What an analysis can — and cannot — show',
    'Microbiome analysis provides a picture of the composition and diversity of microorganisms. It is not a stand-alone diagnosis and does not replace the history, clinical examination or other tests.<sup>1</sup> Its value lies in interpretation: which patterns may explain your symptoms, which foods or treatments may help, and what is worth monitoring.',
    'That is why a test performed without medical guidance can create more questions than answers. In the clinic, analysis is placed within a full clinical context — and that is what gives it value.',
    '## From information to treatment',
    'Diet is the most direct lever: increasing fiber, eating a variety of fruits, vegetables, legumes and whole grains, and including fermented foods can change the microbiome within weeks.<sup>3,4</sup> In a randomized trial, fiber and fermented foods changed the microbiome and markers of inflammation, with different results for each intervention.',
    'Probiotics and prebiotics may help in specific situations — for example, antibiotic-associated diarrhea — but they are not all the same and do not replace treatment for an underlying disease.<sup>5</sup> Fecal microbiota transplantation (FMT) is established for recurrent Clostridioides difficile infection, while other indications are still under study.<sup>6</sup> Research is also examining how the microbiome influences response to cancer immunotherapy — one of the most exciting directions.<sup>7</sup>',
    '## The approach in our clinic',
    'In the clinic, assessment starts with the history, symptoms, diet and previous tests. If microbiome analysis is appropriate for your case, we incorporate it into a plan that may include dietary changes, targeted probiotics, treatment of the underlying condition and regular follow-up. It is not a test that “solves everything” — but another tool that helps us personalize care.',
    'If you have persistent digestive symptoms, recurrent infections, diarrhea, bloating, constipation or a diagnosis such as IBD or IBS, it is worth discussing whether microbiome analysis makes sense for you. The same applies if you are wondering how diet and probiotics affect your health.',
    '## The future is personalized',
    'Microbiome research is moving quickly: new diagnostic approaches, targeted therapies and personalized nutrition plans are at different stages of development. What already has value is a conversation with a specialist who can distinguish what is evidence-based, what is promising, and what does not fit your case.',
    '## Book an assessment',
    'If you want to understand what is happening in your gut and whether microbiome analysis can help, <a href="/en/contact#rantevou">book an appointment</a>. We will discuss your history, assess which tests make sense and plan the next steps together.',
  ],
  references: [
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
  ],
};

const parseArray = (source) => {
  const array = source.slice(source.indexOf('= [') + 2, source.lastIndexOf(']') + 1);
  return new Function(`return (${array});`)();
};

const load = async (file) => {
  const source = await readFile(file, 'utf8');
  return {
    prefix: source.slice(0, source.indexOf('= [') + 2),
    suffix: source.slice(source.lastIndexOf(']') + 1),
    items: parseArray(source),
  };
};

const save = async (file, data) => {
  await writeFile(file, `${data.prefix}${JSON.stringify(data.items, null, 2)}${data.suffix}`);
};

const patch = async (file, update) => {
  const data = await load(file);
  const item = data.items.find((entry) => entry.slug === 'mikrobiwma-enteroy-ti-kseroume');
  if (!item) throw new Error(`microbiome article not found in ${file}`);
  Object.assign(item, update);
  await save(file, data);
  console.log(`updated ${file}`);
};

await patch(path.join(ROOT, 'src', 'data', 'news.ts'), greek);
await patch(path.join(ROOT, 'src', 'data', 'en', 'news.ts'), english);
