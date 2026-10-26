// Jeu d'évaluation du déclenchement des modules d'Ori.
//
// Jamais un test isolé construit au coup par coup pendant une session de travail — un vrai jeu
// de test répétable, pensé pour grandir à chaque nouvelle section ajoutée, et pour être rejoué
// systématiquement avant chaque republication plutôt que de se fier à un seul message de test
// improvisé.
//
// Chaque scénario porte un message réaliste, jamais une simple suite de mots-clés collés
// ensemble, et le ou les modules qu'on attend vraiment de voir se déclencher pour ce message —
// jamais un seul module "approximatif", le vrai identifiant attendu.

const SCENARIOS = [
  { message: "je n'ai aucune légitimité pour porter ce projet, pas de diplôme dans ce domaine", attendu: [25] },
  { message: "je n'arrive pas à me pardonner d'avoir blessé quelqu'un il y a des années", attendu: [26] },
  { message: "je veux juste copier ce que fait mon concurrent, ça a l'air de bien marcher pour lui", attendu: [27] },
  { message: "je suis quelqu'un de très introverti, je ne sais pas si je suis fait pour entreprendre", attendu: [28] },
  { message: "je me compare sans arrêt aux autres et je me sens toujours en dessous", attendu: [29] },
  { message: "je procrastine sur ce projet depuis des semaines, je repousse toujours à demain", attendu: [30] },
  // Les modules 5 (cadrer un projet flou) et 31 (méga levier) se chevauchent légitimement ici —
  // jamais un bug, un vrai recoupement thématique entre "je ne sais pas par où commencer" et
  // "plusieurs domaines à la fois", les deux mots-clés restant par ailleurs justes séparément.
  { message: "je voudrais améliorer plusieurs domaines de ma vie à la fois mais je ne sais pas par où commencer", attendu: [5, 31] },
  // Les modules 32 (persona de Jung) et 33 (qui suis-je / métamotivation) se chevauchent
  // légitimement ici — jamais un bug, les deux traitent authentiquement de l'identité derrière
  // un rôle social.
  { message: "je ne sais plus qui je suis vraiment en dehors de mon travail", attendu: [32, 33] },
  { message: "j'ai à la fois envie de changement et peur de sortir de ma zone de confort", attendu: [34] },
  { message: "je n'arrive pas à décrocher de mon téléphone, je scrolle sans m'en rendre compte", attendu: [35] },
  { message: "je ne sais pas si ce que je ressens là est une émotion ou un sentiment", attendu: [36] },
  { message: "j'ai une vraie angoisse face à la mort ces derniers temps", attendu: [37] },
  { message: "j'aimerais explorer mon inconscient, avoir un dialogue intérieur avec une partie de moi-même", attendu: [38] },
  { message: "je me sens incapable de supporter la moindre incertitude, j'ai besoin de tout contrôler", attendu: [41] },
  { message: "est-ce que la testostérone rend vraiment les gens plus agressifs ?", attendu: [42] },
  { message: "je réagis souvent avant même d'avoir eu le temps de réfléchir", attendu: [43] },
  { message: "comment je peux rendre mon idée difficile à copier par un concurrent ?", attendu: [46] },
  { message: "quel temps fait-il aujourd'hui à Paris ?", attendu: [] }, // vrai négatif : rien ne doit se déclencher
  { message: "peux-tu m'aider à choisir un prénom pour mon chat ?", attendu: [] }, // vrai négatif
];

async function executerEvaluation(getActiveModulesFn, extraireIdsFn){
  let reussis = 0;
  const echecs = [];

  for(const scenario of SCENARIOS){
    const history = [{ role: 'user', content: scenario.message }];
    const resultat = await getActiveModulesFn(history);
    const idsDeclenches = extraireIdsFn(resultat);

    const attenduSet = new Set(scenario.attendu);
    const obtenuSet = new Set(idsDeclenches);
    const manquants = scenario.attendu.filter(id => !obtenuSet.has(id));
    const enTrop = idsDeclenches.filter(id => !attenduSet.has(id));

    const reussi = manquants.length === 0 && enTrop.length === 0;
    if(reussi){
      reussis++;
    } else {
      echecs.push({ message: scenario.message, attendu: scenario.attendu, obtenu: idsDeclenches, manquants, enTrop });
    }
  }

  console.log(`\n=== Résultat : ${reussis} / ${SCENARIOS.length} scénarios réussis ===\n`);
  if(echecs.length){
    console.log("Échecs détaillés :\n");
    echecs.forEach(e => {
      console.log(`- "${e.message}"`);
      console.log(`  attendu: [${e.attendu.join(', ')}]  obtenu: [${e.obtenu.join(', ')}]`);
      if(e.manquants.length) console.log(`  MANQUANT : ${e.manquants.join(', ')}`);
      if(e.enTrop.length) console.log(`  EN TROP (bruit) : ${e.enTrop.join(', ')}`);
      console.log('');
    });
  }
  return { reussis, total: SCENARIOS.length, echecs };
}

module.exports = { SCENARIOS, executerEvaluation };