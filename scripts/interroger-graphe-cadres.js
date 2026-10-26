/**
 * INTERROGER LE GRAPHE DES RELATIONS ENTRE CADRES
 *
 * Usage en ligne de commande :
 *   node interroger-graphe-cadres.js <id_du_cadre>
 *   node interroger-graphe-cadres.js --liste
 *
 * Usage programmatique (ce que fera un jour un outil qu'Ori pourrait appeler) :
 *   const { cadresConnectesA } = require('./interroger-graphe-cadres.js');
 *   const resultats = cadresConnectesA('rogers_tendance_actualisante');
 */

const { CADRES, CADRES_ISOLES, TOUS_LES_CADRES, CONNEXIONS } = require('./graphe-cadres.js');

function trouverCadre(id) {
  return TOUS_LES_CADRES.find(c => c.id === id);
}

/**
 * Retourne tous les cadres connectés à un cadre donné, avec le type de
 * connexion et la note explicative — jamais juste une liste d'identifiants,
 * toujours le pourquoi de chaque lien, pour qu'Ori puisse s'en servir
 * directement dans une réponse.
 */
function cadresConnectesA(id) {
  const cadre = trouverCadre(id);
  if (!cadre) {
    return { erreur: `Aucun cadre trouvé pour l'identifiant "${id}"` };
  }

  const connexions = CONNEXIONS.filter(c => c.source === id || c.cible === id);

  const resultats = connexions.map(c => {
    const autreId = c.source === id ? c.cible : c.source;
    const autreCadre = trouverCadre(autreId);
    return {
      cadre: autreCadre ? autreCadre.nom : autreId,
      auteur: autreCadre ? autreCadre.auteur : null,
      type: c.type,
      note: c.note
    };
  });

  return {
    cadre: cadre.nom,
    auteur: cadre.auteur,
    nombreDeConnexions: resultats.length,
    connexions: resultats
  };
}

/** Statistiques globales du graphe, pour voir d'un coup d'œil son état actuel — jamais
 * caché, la vraie proportion de ce qui reste isolé plutôt qu'un chiffre flatteur seul. */
function statistiques() {
  const parType = {};
  CONNEXIONS.forEach(c => { parType[c.type] = (parType[c.type] || 0) + 1; });
  return {
    nombreDeCadresRichementConnectes: CADRES.length,
    nombreDeCadresIsolesEnAttente: CADRES_ISOLES.length,
    nombreTotalDeCadres: TOUS_LES_CADRES.length,
    noteHonnete: "Deux cent onze cadres, initialement comptés comme isolés, se sont révélés déjà développés ailleurs dans le document — retirés du compte en deux passes successives plutôt que dupliqués. Ils existent réellement dans le texte, mais n'ont pas encore de vraie place dans le graphe (ni connexion, ni nœud correctement formé) : une vraie étape suivante, distincte du développement de contenu.",
    nombreDeConnexions: CONNEXIONS.length,
    parType,
    proportionEncoreIsolee: `${Math.round((CADRES_ISOLES.length / TOUS_LES_CADRES.length) * 100)}%`
  };
}

// Exécution en ligne de commande
if (require.main === module) {
  const arg = process.argv[2];

  if (!arg || arg === '--stats') {
    console.log('=== Statistiques du graphe ===');
    console.log(JSON.stringify(statistiques(), null, 2));
  } else if (arg === '--liste') {
    console.log('=== Tous les cadres du graphe ===');
    TOUS_LES_CADRES.forEach(c => console.log(`  ${c.id}  —  ${c.nom}${c.auteur ? ' (' + c.auteur + ')' : ' [en attente de connexion]'}`));
  } else {
    console.log(`=== Cadres connectés à "${arg}" ===`);
    console.log(JSON.stringify(cadresConnectesA(arg), null, 2));
  }
}

module.exports = { cadresConnectesA, statistiques, trouverCadre };
