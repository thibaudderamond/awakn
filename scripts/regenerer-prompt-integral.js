#!/usr/bin/env node
/**
 * Régénère prompt-ori-integral.md directement depuis awakn-poc/index.html.
 * Usage : node regenerer-prompt-integral.js [chemin-vers-index.html] [chemin-sortie.md]
 *
 * Aucun jugement, aucune mémoire, aucune supposition — une pure fonction
 * : le même index.html produira toujours exactement le même fichier de sortie.
 * Conçu pour être appelé à la main, ou câblé plus tard dans un hook git
 * pre-commit / une étape de CI, une fois le projet sorti de ce bac à sable.
 */

const fs = require('fs');
const path = require('path');

const cheminEntree = process.argv[2] || 'awakn-poc/index.html';
const cheminSortie = process.argv[3] || 'prompt-ori-integral.md';

function extraireSocleToujoursActif(content) {
  const start = content.indexOf('async function buildSystemPrompt');
  if (start === -1) throw new Error("Impossible de trouver buildSystemPrompt dans le fichier fourni.");
  const rappelIdx = content.lastIndexOf('RAPPEL FINAL');
  if (rappelIdx === -1) throw new Error("Impossible de trouver le marqueur RAPPEL FINAL.");
  const end = content.indexOf('\n}', rappelIdx);
  const promptBody = content.slice(start, end);

  // Recherche directe du gabarit lui-même, jamais d'un mot-clé "return" fragile —
  // ce dernier peut apparaître ailleurs dans la fonction (des instructions de découpe
  // pour la mise en cache, par exemple) sans rapport avec le début réel du texte.
  const marqueurGabarit = "= `Tu es Ori";
  const idxGabarit = promptBody.indexOf(marqueurGabarit);
  if (idxGabarit === -1) throw new Error("Le marqueur de début du gabarit ('= `Tu es Ori') est introuvable — la structure de buildSystemPrompt a changé, ce script doit être mis à jour.");
  const posBacktick = promptBody.indexOf('`', idxGabarit);
  let texte = promptBody.slice(posBacktick + 1);
  texte = texte.slice(0, texte.lastIndexOf('`'));
  return texte.trim();
}

function extraireModules(content) {
  const startMarker = content.indexOf('{ id:1, mots');
  const start = content.lastIndexOf('[', startMarker);
  const end = content.indexOf('];', start) + 2;
  const bloc = content.slice(start, end);

  const pattern = /\{ id:(\d+), mots:\[([^\]]+)\], resume:`([^`]+)`, texte:`([\s\S]*?)`\s*\}/g;
  const modules = [];
  let m;
  while ((m = pattern.exec(bloc)) !== null) {
    modules.push({ id: parseInt(m[1], 10), motsCles: m[2], resume: m[3], texte: m[4] });
  }
  modules.sort((a, b) => a.id - b.id);
  return modules;
}

function formaterModules(modules) {
  return modules.map(mod => {
    const mots = mod.motsCles.split(',').map(x => x.trim().replace(/^['"]|['"]$/g, ''));
    const apercu = mots.slice(0, 6).join(', ') + (mots.length > 6 ? '...' : '');
    return `### Module ${mod.id} — déclenché par les mots-clés : ${apercu}\n\n*Résumé : ${mod.resume}*\n\n${mod.texte.trim()}\n\n---\n`;
  }).join('\n');
}

function construireDocument(socle, modulesTexte, dateGeneration) {
  return `# Le prompt système d'Ori — version intégrale

*Extrait automatiquement et déterministement du POC fonctionnel (awakn-poc/index.html) par regenerer-prompt-integral.js, sans aucune intervention manuelle — généré le ${dateGeneration}. Ce script produit toujours exactement le même résultat pour un même fichier source : aucune mémoire, aucun jugement, aucune omission possible.*

**Comment le lire** : deux couches, exactement comme le vrai prompt envoyé à chaque message.

**Couche 1, toujours active** : chargée intégralement à chaque message.

**Couche 2, conditionnelle** : les modules de méthode, chacun déclenché uniquement par ses mots-clés propres.

Les blocs entre crochets \`[...]\` marquent les données propres à chaque utilisateur, insérées automatiquement à l'exécution réelle — jamais présentes telles quelles dans le code source.

**Rappel** : ce fichier est un export à usage de lecture. La seule vraie source de vérité reste \`awakn-poc/index.html\`. Relancer ce script à chaque doute plutôt que de se fier à la date de génération ci-dessus.

---

## Couche 1 — le socle toujours actif

${socle}

---

## Couche 2 — les modules de méthode, conditionnels

${modulesTexte}
`;
}

function main() {
  const contentPath = path.resolve(cheminEntree);
  if (!fs.existsSync(contentPath)) {
    console.error(`Fichier introuvable : ${contentPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(contentPath, 'utf-8');

  const socle = extraireSocleToujoursActif(content);
  const modules = extraireModules(content);
  const modulesTexte = formaterModules(modules);

  const dateGeneration = new Date().toISOString().split('T')[0];
  const doc = construireDocument(socle, modulesTexte, dateGeneration);

  fs.writeFileSync(path.resolve(cheminSortie), doc, 'utf-8');
  console.log(`Régénéré : ${cheminSortie}`);
  console.log(`Socle toujours actif : ${socle.split(/\s+/).length} mots`);
  console.log(`Modules extraits : ${modules.length}`);
}

main();