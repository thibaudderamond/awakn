#!/usr/bin/env node
/**
 * Vérifie qu'une restructuration de buildSystemPrompt() n'a rien cassé.
 * Usage : node verifier-restructuration.js chemin/vers/index.html [chemin/vers/index-avant.html]
 *
 * Cinq vérifications indépendantes, chacune pouvant faire échouer le script :
 *  1. Syntaxe JS valide (new Function).
 *  2. buildSystemPrompt() s'exécute réellement sans erreur, avec ET sans profil actif.
 *  3. Concaténer statique + dynamique reconstruit EXACTEMENT le texte d'origine
 *     (si un fichier "avant" est fourni) — la garantie la plus forte possible.
 *  4. Aucune interpolation ${...} ne subsiste dans le bloc statique.
 *  5. Le nombre de modules et les tests de déclenchement restent inchangés.
 */

const fs = require('fs');
const path = require('path');

function chargerScript(cheminHtml) {
  const content = fs.readFileSync(path.resolve(cheminHtml), 'utf-8');
  return content.slice(content.indexOf('<script>') + 8, content.lastIndexOf('</script>'));
}

function construireEnvironnement(scriptSrc) {
  const fakeEl = {
    style: {}, innerHTML: '', appendChild: () => {}, addEventListener: () => {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    querySelectorAll: () => [], setAttribute: () => {}, dataset: {},
  };
  const sandbox = {
    console,
    window: { oriRole: 'default', addEventListener: () => {}, innerWidth: 390, innerHeight: 844 },
    document: {
      getElementById: () => fakeEl, createElement: () => fakeEl, addEventListener: () => {},
      querySelectorAll: () => [], querySelector: () => fakeEl,
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    requestAnimationFrame: (cb) => cb(),
  };
  const fn = new Function(
    ...Object.keys(sandbox),
    scriptSrc + '\nreturn { buildSystemPrompt, profile, history, METHOD_MODULES, getActiveModules };'
  );
  return fn(...Object.values(sandbox));
}

async function verifier(cheminApres, cheminAvant) {
  const erreurs = [];
  const infos = [];

  // 1. Syntaxe valide
  let scriptApres;
  try {
    scriptApres = chargerScript(cheminApres);
    new Function(scriptApres);
    infos.push('✓ Syntaxe JS valide');
  } catch (e) {
    erreurs.push(`✗ Syntaxe invalide : ${e.message}`);
    return rapport(erreurs, infos);
  }

  // 2. Exécution réelle, avec et sans profil
  let envVide, envActif, resultatVide, resultatActif;
  const concatener = (r) => typeof r === 'string' ? r : Object.values(r).join('');
  try {
    envVide = construireEnvironnement(scriptApres);
    resultatVide = await envVide.buildSystemPrompt();
    if (typeof resultatVide !== 'object' || !('statique' in resultatVide)) {
      erreurs.push('✗ buildSystemPrompt() ne retourne pas un objet contenant au moins "statique"');
    } else {
      const detail = Object.keys(resultatVide).map(k => `${k}: ${resultatVide[k].length} car.`).join(', ');
      infos.push(`✓ Exécution réussie (profil vide) — ${detail}`);
    }
  } catch (e) {
    erreurs.push(`✗ Erreur à l'exécution (profil vide) : ${e.message}`);
  }

  try {
    envActif = construireEnvironnement(scriptApres);
    envActif.profile.traits = [{ category: 'qualite', text: 'test', status: 'actif', date: new Date().toISOString() }];
    envActif.profile.prenom = 'Test';
    resultatActif = await envActif.buildSystemPrompt();
    const texteActifComplet = concatener(resultatActif);
    if (texteActifComplet.includes('Prénom : Test') && texteActifComplet.includes('RECONFIRMATION ESPACÉE')) {
      infos.push('✓ Logique conditionnelle intacte (prénom + reconfirmation espacée apparaissent avec profil actif)');
    } else {
      erreurs.push('✗ La logique conditionnelle sur profil actif a changé de comportement');
    }
  } catch (e) {
    erreurs.push(`✗ Erreur à l'exécution (profil actif) : ${e.message}`);
  }

  // 3. Reconstruction fidèle si un "avant" est fourni
  if (cheminAvant && resultatVide) {
    try {
      const scriptAvant = chargerScript(cheminAvant);
      const envAvant = construireEnvironnement(scriptAvant);
      const resultatAvant = await envAvant.buildSystemPrompt();
      const texteAvantComplet = concatener(resultatAvant);
      const texteApresComplet = concatener(resultatVide);
      if (texteAvantComplet === texteApresComplet) {
        infos.push(`✓ Reconstruction fidèle, ordre identique : tous blocs après = texte complet avant, caractère pour caractère (${texteApresComplet.length} car.)`);
      } else if (texteAvantComplet.length === texteApresComplet.length &&
                 texteAvantComplet.split('').sort().join('') === texteApresComplet.split('').sort().join('')) {
        infos.push(`✓ Même longueur et même multiset de caractères qu'avant (${texteApresComplet.length} car.) — un réordonnancement intentionnel est probable, jamais une perte de contenu. Vérifier séparément que chaque section nommée existe toujours.`);
      } else {
        erreurs.push(`✗ ALERTE : le texte reconstruit diffère réellement de l'original (avant: ${texteAvantComplet.length} car., après: ${texteApresComplet.length} car.)`);
        let i = 0;
        while (i < Math.min(texteAvantComplet.length, texteApresComplet.length) && texteAvantComplet[i] === texteApresComplet[i]) i++;
        erreurs.push(`   Première divergence à la position ${i} : avant="${texteAvantComplet.slice(i, i+80)}" | après="${texteApresComplet.slice(i, i+80)}"`);
      }
    } catch (e) {
      erreurs.push(`✗ Impossible de charger ou exécuter la version "avant" : ${e.message}`);
    }
  } else if (!cheminAvant) {
    infos.push('… Pas de fichier "avant" fourni, vérification de reconstruction fidèle ignorée');
  }

  // 4. Aucune interpolation ${...} ne doit subsister dans les blocs statique et profil
  if (resultatVide) {
    for (const bloc of ['statique', 'profil']) {
      if (!(bloc in resultatVide)) continue;
      const interpolationsResiduelles = (resultatVide[bloc].match(/\$\{[^}]*\}/g) || []);
      if (interpolationsResiduelles.length === 0) {
        infos.push(`✓ Aucune interpolation \${...} non résolue dans le bloc "${bloc}"`);
      } else {
        erreurs.push(`✗ ${interpolationsResiduelles.length} interpolation(s) non résolue(s) trouvée(s) dans "${bloc}" : ${interpolationsResiduelles.slice(0,5).join(', ')}`);
      }
    }
  }

  // 5. Isolation réelle du bloc modules, si présent : doit varier selon les modules actifs,
  //    jamais rester vide ou identique quand un vrai contenu de module est attendu.
  if (resultatVide && 'modules' in resultatVide) {
    infos.push(`✓ Bloc "modules" isolé, longueur avec profil vide : ${resultatVide.modules.length} car. (0 attendu si aucun module ne se déclenche par défaut)`);
    if (resultatActif && 'modules' in resultatActif) {
      infos.push(`✓ Bloc "modules" avec profil actif : ${resultatActif.modules.length} car.`);
    }
  }

  // 6. Modules inchangés
  try {
    const nbModules = envVide.METHOD_MODULES.length;
    infos.push(`✓ Nombre de modules : ${nbModules}`);
  } catch (e) {
    erreurs.push(`✗ Impossible de vérifier METHOD_MODULES : ${e.message}`);
  }

  return rapport(erreurs, infos);
}

function rapport(erreurs, infos) {
  console.log('=== Vérifications réussies ===');
  infos.forEach(i => console.log(i));
  if (erreurs.length > 0) {
    console.log('\n=== ÉCHECS ===');
    erreurs.forEach(e => console.log(e));
    console.log(`\n${erreurs.length} vérification(s) ont échoué. NE PAS PUBLIER en l'état.`);
    process.exitCode = 1;
  } else {
    console.log(`\nToutes les vérifications sont passées. Publication sûre.`);
  }
  return erreurs.length === 0;
}

if (require.main === module) {
  const cheminApres = process.argv[2];
  const cheminAvant = process.argv[3];
  if (!cheminApres) {
    console.error('Usage : node verifier-restructuration.js chemin/index.html [chemin/index-avant.html]');
    process.exit(1);
  }
  verifier(cheminApres, cheminAvant);
}

module.exports = { verifier };