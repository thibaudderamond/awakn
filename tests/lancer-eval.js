// Lance eval-declenchement.js contre le vrai code d'awakn-poc.html — jamais un simulacre du
// mécanisme de récupération, le vrai getActiveModules() tel qu'il existe dans le fichier publié.

const fs = require('fs');
const path = require('path');
const { executerEvaluation } = require('./eval-declenchement.js');

const htmlPath = process.argv[2] || path.join(__dirname, 'awakn-poc.html');
const content = fs.readFileSync(htmlPath, 'utf-8');
const script = content.slice(content.indexOf('<script>') + 8, content.lastIndexOf('</script>'));

// Un simulateur DOM minimal mais complet — jamais un simulateur qui plante sur une pièce
// annexe du fichier, comme ça a été le cas plusieurs fois aujourd'hui en cours de route.
global.window = { oriRole: 'default', addEventListener: () => {}, innerWidth: 390, innerHeight: 844 };
const elements = {};
function makeEl(id) {
  return {
    style: {}, innerHTML: '', appendChild: () => {}, addEventListener: () => {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
    querySelectorAll: () => [], setAttribute: () => {}, dataset: {},
    offsetHeight: 60, offsetWidth: 100, offsetLeft: 0, focus: () => {}, value: ''
  };
}
global.document = {
  getElementById: (id) => { if (!elements[id]) elements[id] = makeEl(id); return elements[id]; },
  createElement: () => makeEl('tmp'), addEventListener: () => {},
  querySelectorAll: () => [], querySelector: () => makeEl('tmp')
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.requestAnimationFrame = () => {};
global.fetch = async () => ({ ok: false }); // jamais de vrai appel réseau pendant un test local

// Exécute le script du fichier dans ce contexte global simulé. Les déclarations `const` de haut
// niveau ne s'attachent jamais automatiquement à l'objet global avec vm — on les expose donc
// explicitement à la fin, jamais une supposition silencieuse que ça fonctionnerait tout seul.
const scriptExpose = script + '\nglobal.METHOD_MODULES = METHOD_MODULES; global.getActiveModules = getActiveModules;';
require('vm').runInThisContext(scriptExpose, { filename: 'awakn-poc-script.js' });

// Associe chaque identifiant de METHOD_MODULES au texte qui le distingue, pour retrouver après
// coup quels modules sont réellement présents dans le texte renvoyé par getActiveModules.
function extraireIds(resultatTexte) {
  const ids = [];
  for (const mod of global.METHOD_MODULES) {
    // Les 80 premiers caractères du texte du module suffisent à l'identifier sans ambiguïté,
    // jamais besoin de comparer le module entier.
    const signature = mod.texte.slice(0, 80);
    if (resultatTexte.includes(signature)) ids.push(mod.id);
  }
  return ids;
}

(async () => {
  console.log(`Fichier testé : ${htmlPath}`);
  console.log(`Modules chargés : ${global.METHOD_MODULES.length}`);
  const { reussis, total, echecs } = await executerEvaluation(global.getActiveModules, extraireIds);
  process.exit(echecs.length > 0 ? 1 : 0);
})();
