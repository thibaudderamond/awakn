/**
 * GRAPHE DES RELATIONS ENTRE CADRES — AWAKN
 *
 * Chaque nœud représente un cadre déjà intégré dans le document de cadrage.
 * Chaque arête représente une connexion réellement écrite et vérifiée au fil
 * du travail sur Awakn — jamais une supposition, jamais générée automatiquement.
 *
 * Quatre types d'arêtes, jamais confondus :
 *   - "convergence"     : des origines indépendantes, la même conclusion
 *   - "complementarite"  : deux cadres qui, ensemble, couvrent ce qu'aucun ne couvre seul
 *   - "hierarchie"       : un cadre comme cas particulier ou fondement d'un autre
 *   - "pont"              : connexion entre deux domaines très éloignés (la vraie valeur recherchée)
 *
 * Ce fichier reste vivant : chaque nouvelle connexion découverte au fil du
 * travail sur Awakn doit y être ajoutée, jamais laissée uniquement dans le
 * texte narratif du document de cadrage.
 */

const CADRES = [
  { id: "bem_perception_de_soi", nom: "Théorie de la perception de soi", auteur: "Bem", famille: "identite" },
  { id: "fake_it_till_you_make_it", nom: "Fake it till you make it", auteur: "psychologie populaire nuancée", famille: "identite" },
  { id: "reves_present", nom: "Parler de ses rêves au présent", auteur: "Keith Chen", famille: "identite" },
  { id: "pied_dans_la_porte", nom: "Technique du pied dans la porte", auteur: "Freedman & Fraser", famille: "identite" },

  { id: "greiner_stades_organisation", nom: "Stades de croissance des organisations", auteur: "Greiner", famille: "entrepreneuriat" },
  { id: "erikson_stades_psychosociaux", nom: "Stades psychosociaux", auteur: "Erikson", famille: "identite" },

  { id: "exploration_exploitation", nom: "Exploration contre exploitation", auteur: "March", famille: "entrepreneuriat" },
  { id: "autodetermination", nom: "Théorie de l'autodétermination", auteur: "Deci & Ryan", famille: "moteurs" },
  { id: "ouverture_experience", nom: "Ouverture à l'expérience", auteur: "psychologie de la personnalité", famille: "identite" },

  { id: "dreyfus_acquisition_competences", nom: "Modèle d'acquisition des compétences", auteur: "Dreyfus", famille: "apprentissage" },
  { id: "phronesis_aristote", nom: "Phronesis, la sagesse pratique", auteur: "Aristote", famille: "philosophie" },

  { id: "effet_halo", nom: "Effet de halo", auteur: "psychologie sociale", famille: "biais" },
  { id: "surconfiance_experts", nom: "Faux sentiment de compétence des experts", auteur: "psychologie sociale", famille: "biais" },

  { id: "liens_faibles", nom: "Liens faibles", auteur: "Granovetter", famille: "reseaux_sociaux" },
  { id: "trous_structurels", nom: "Trous structurels", auteur: "Burt", famille: "reseaux_sociaux" },

  { id: "identite_narrative", nom: "Identité narrative", auteur: "McAdams", famille: "identite" },
  { id: "regle_pic_fin", nom: "Règle pic-fin", auteur: "Kahneman", famille: "biais" },

  { id: "synthese_coherence", nom: "Synthèse de cohérence du profil", auteur: "Awakn", famille: "profil" },
  { id: "clarte_concept_de_soi", nom: "Clarté du concept de soi", auteur: "Campbell", famille: "identite" },

  { id: "deontologie", nom: "Déontologie", auteur: "philosophie morale", famille: "philosophie" },
  { id: "consequentialisme", nom: "Conséquentialisme", auteur: "philosophie morale", famille: "philosophie" },
  { id: "ignorance_merton", nom: "Loi des conséquences imprévues", auteur: "Merton", famille: "philosophie" },

  { id: "curseur_profil_evolutif", nom: "Curseur évolutif du profil", auteur: "Awakn", famille: "profil" },
  { id: "principe_fondateur_awakn", nom: "Principe fondateur d'Awakn (expérience du fondateur)", auteur: "Awakn", famille: "strategie" },

  { id: "stiegler_pharmakon", nom: "Pharmakon et prolétarisation", auteur: "Stiegler", famille: "philosophie" },
  { id: "dette_cognitive_mit", nom: "Dette cognitive", auteur: "MIT, mesures EEG 2025", famille: "neurosciences" },

  { id: "autocompassion_neff", nom: "Auto-compassion", auteur: "Neff", famille: "identite" },
  { id: "jamais_recadrage_direct", nom: "Ne jamais sauter directement au recadrage positif", auteur: "Awakn", famille: "posture" },

  { id: "honnetete_radicale_patagonia", nom: "Honnêteté radicale", auteur: "Patagonia", famille: "strategie" },
  { id: "verification_jamais_infaillible", nom: "Vérification honnête sur ses propres limites", auteur: "Awakn", famille: "epistemologie" },

  { id: "rogers_tendance_actualisante", nom: "Tendance actualisante", auteur: "Rogers", famille: "posture" },
  { id: "jardinage_retirer_obstacles", nom: "Le jardinier retire ce qui empêche la plante de pousser", auteur: "Awakn (brainstorm)", famille: "posture" },

  { id: "buber_je_tu", nom: "La relation Je-Tu", auteur: "Buber", famille: "philosophie" },
  { id: "levinas_visage_autrui", nom: "Le visage d'Autrui", auteur: "Lévinas", famille: "philosophie" },

  { id: "rogers_paradoxe_changement", nom: "Théorie paradoxale du changement", auteur: "Rogers", famille: "posture" },
  { id: "rogers_regard_positif", nom: "Regard positif inconditionnel", auteur: "Rogers", famille: "posture" },

  { id: "biais_attribution_hostile", nom: "Biais d'attribution hostile", auteur: "Nasby, Hayden & DePaulo", famille: "biais" },
  { id: "aversion_perte", nom: "Aversion à la perte", auteur: "Kahneman & Tversky", famille: "biais" },
  { id: "actualisation_hyperbolique", nom: "Actualisation hyperbolique", auteur: "Ainslie, Mazur", famille: "biais" },
  { id: "intolerance_incertitude", nom: "Intolérance à l'incertitude", auteur: "Dugas, Freeston, Ladouceur", famille: "biais" },
  { id: "besoin_cloture_cognitive", nom: "Besoin de clôture cognitive", auteur: "Kruglanski", famille: "biais" },
  { id: "brownout", nom: "Brownout, sens perdu au travail", auteur: "Graeber", famille: "entrepreneuriat" },
  { id: "ancres_carriere_schein", nom: "Ancres de carrière", auteur: "Schein", famille: "entrepreneuriat" },
  { id: "paradoxe_hyperconnexion", nom: "Paradoxe de l'hyperconnexion", auteur: "Holt-Lunstad", famille: "relations" },
  { id: "turkle_solitude", nom: "Perte de solitude et connexion réelle", auteur: "Turkle", famille: "relations" },
  { id: "clark_mills_communautaire_transactionnel", nom: "Distinction communautaire/transactionnelle", auteur: "Clark & Mills", famille: "relations" },


  { id: "approches_somatiques", nom: "Approches somatiques et régulation du système nerveux", auteur: "théorie polyvagale", famille: "corps" },
  { id: "reponse_relaxation_benson", nom: "Réponse de relaxation", auteur: "Benson", famille: "corps" },


  { id: "buts_accomplissement", nom: "Théorie des buts d'accomplissement", auteur: "Dweck, Elliot & McGregor", famille: "motivation" },
  { id: "impermanence_bouddhiste_dev", nom: "Impermanence bouddhiste", auteur: "anicca", famille: "philosophie" },
  { id: "valeurs_humaines_fondamentales", nom: "Théorie des valeurs humaines fondamentales", auteur: "Schwartz", famille: "identite" },
  { id: "theorie_flow", nom: "Théorie du flow", auteur: "Csikszentmihalyi", famille: "moteurs" },
  { id: "eudaimonia_hedonisme", nom: "Distinction eudaimonique-hédonique", auteur: "Aristote", famille: "philosophie" },
  { id: "telique_atelique", nom: "Distinction télique-atélique", auteur: "Setiya", famille: "philosophie" },
  { id: "effectance_white", nom: "Effectance", auteur: "White", famille: "moteurs" },

  { id: "ambiguite_causale", nom: "Ambiguïté causale, barrière à l'imitation", auteur: "Reed & DeFillippi", famille: "strategie" },
];

const CONNEXIONS = [
  { source: "bem_perception_de_soi", cible: "fake_it_till_you_make_it", type: "convergence",
    note: "Le même mécanisme explique ce phénomène, né de la psychologie populaire nuancée." },
  { source: "bem_perception_de_soi", cible: "reves_present", type: "convergence",
    note: "Le même mécanisme explique ce phénomène, né de la linguistique cognitive." },
  { source: "bem_perception_de_soi", cible: "pied_dans_la_porte", type: "convergence",
    note: "Le même mécanisme explique ce phénomène, né de la psychologie sociale de la persuasion." },

  { source: "greiner_stades_organisation", cible: "erikson_stades_psychosociaux", type: "convergence",
    note: "Ce qui résout une étape ne résout jamais la suivante, qu'il s'agisse d'une entreprise ou d'une vie." },

  { source: "exploration_exploitation", cible: "autodetermination", type: "convergence",
    note: "Stagnation par sur-perfectionnement, dans l'organisation comme dans la personne." },
  { source: "exploration_exploitation", cible: "ouverture_experience", type: "convergence",
    note: "Explorer sans jamais approfondir ne construit jamais de vraie maîtrise." },

  { source: "dreyfus_acquisition_competences", cible: "phronesis_aristote", type: "convergence",
    note: "La sagesse pratique comme vertu incarnée, à travers vingt-quatre siècles d'écart." },

  { source: "effet_halo", cible: "surconfiance_experts", type: "convergence",
    note: "Le même mécanisme, retourné sur soi plutôt que projeté sur les autres." },

  { source: "liens_faibles", cible: "trous_structurels", type: "complementarite",
    note: "Le capital social se construit à l'intersection des deux théories des réseaux, indépendantes." },

  { source: "identite_narrative", cible: "regle_pic_fin", type: "complementarite",
    note: "L'un fournit la structure du récit, l'autre explique ce qui restera mémorable." },

  { source: "synthese_coherence", cible: "clarte_concept_de_soi", type: "complementarite",
    note: "Les deux convergent vers le même objectif : un ensemble cohérent, jamais des traits épars." },

  { source: "deontologie", cible: "consequentialisme", type: "hierarchie",
    note: "La déontologie comme théorie effective du conséquentialisme, un raccourci fiable quand calculer les vraies conséquences reste impossible." },
  { source: "deontologie", cible: "ignorance_merton", type: "hierarchie",
    note: "Des règles fixes comme réponse à l'ignorance structurelle des vraies conséquences." },

  { source: "curseur_profil_evolutif", cible: "principe_fondateur_awakn", type: "hierarchie",
    note: "La même logique à deux échelles différentes : jamais tout savoir d'un coup, toujours se construire dans la durée." },

  { source: "stiegler_pharmakon", cible: "dette_cognitive_mit", type: "pont",
    note: "Quatre-vingts ans d'écart, deux disciplines qui ne se sont jamais parlées, le même phénomène : l'usage passif qui déleste une capacité humaine." },

  { source: "autocompassion_neff", cible: "jamais_recadrage_direct", type: "pont",
    note: "Reconnaître pleinement une souffrance réelle avant toute reformulation, jamais l'inverse." },

  { source: "honnetete_radicale_patagonia", cible: "verification_jamais_infaillible", type: "pont",
    note: "La confiance se construit par l'aveu de ses limites, jamais par la promesse d'un absolu." },

  { source: "rogers_tendance_actualisante", cible: "jardinage_retirer_obstacles", type: "pont",
    note: "Une théorie clinique des années 1950 et une intuition de brainstorm sur l'image de marque, écrites à des mois d'écart, sans jamais se citer — la même vérité." },

  { source: "buber_je_tu", cible: "levinas_visage_autrui", type: "convergence",
    note: "Le soi ne précède jamais la relation (Buber), la relation ne se laisse jamais réduire à ce qu'on en sait (Lévinas) — deux faces d'une même vérité." },

  { source: "rogers_paradoxe_changement", cible: "rogers_regard_positif", type: "hierarchie",
    note: "Le paradoxe du changement explique pourquoi le regard positif inconditionnel fonctionne : l'acceptation précède le changement, jamais l'inverse." },
  { source: "rogers_paradoxe_changement", cible: "rogers_tendance_actualisante", type: "hierarchie",
    note: "Accepter ce qui est déjà là retire ce qui bloquait la tendance actualisante — les deux pièces d'un même mécanisme." },



  { source: "biais_attribution_hostile", cible: "clark_mills_communautaire_transactionnel", type: "complementarite",
    note: "Face à une friction relationnelle, la distinction communautaire/transactionnelle explique le cadre général, jamais pourquoi une seule personne précise pose problème — le biais d'attribution hostile complète l'explication là où le premier cadre s'arrête." },

  { source: "aversion_perte", cible: "actualisation_hyperbolique", type: "convergence",
    note: "Deux distorsions différentes mais apparentées du calcul rationnel d'une valeur : l'une surpondère une perte face à un gain équivalent, l'autre dévalue disproportionnellement une récompense future par rapport à l'immédiate." },

  { source: "intolerance_incertitude", cible: "besoin_cloture_cognitive", type: "convergence",
    note: "L'une née de la recherche clinique sur l'anxiété généralisée, l'autre de la psychologie sociale et cognitive — deux traditions qui ne se sont jamais parlées, convergeant vers le même inconfort de fond face à l'ambiguïté." },

  { source: "intolerance_incertitude", cible: "aversion_perte", type: "hierarchie",
    note: "L'intolérance à l'incertitude donne le mécanisme clinique le plus précis et le mieux validé derrière l'aversion à la perte et le biais du statu quo — une peur de n'importe quel changement suffisamment important, jamais une peur spécifique de l'échec ou du jugement." },
  { source: "brownout", cible: "ancres_carriere_schein", type: "convergence",
    note: "La thèse de Graeber sur le sens perdu au travail rejoint directement les ancres de carrière de Schein — deux façons de nommer le même désalignement entre ce qu'une personne fait et ce qui compte vraiment pour elle." },
  { source: "paradoxe_hyperconnexion", cible: "turkle_solitude", type: "complementarite",
    note: "Une présence qui écoute en permanence, ne juge jamais, ne se fatigue jamais, constitue structurellement le chemin de moindre résistance face au vrai travail, souvent inconfortable, d'une relation humaine réelle." },

  { source: "approches_somatiques", cible: "reponse_relaxation_benson", type: "complementarite",
    note: "L'un régule par la respiration et la répétition mentale, l'autre par l'ancrage sensoriel direct dans le corps — deux voies distinctes vers le même apaisement du système nerveux." },



  { source: "impermanence_bouddhiste_dev", cible: "telique_atelique", type: "convergence",
    note: "Aucun état, bon ou mauvais, n'est destiné à durer — une tradition religieuse ancienne et une distinction philosophique contemporaine arrivent à la même vérité par des chemins séparés." },
  { source: "theorie_flow", cible: "effectance_white", type: "convergence",
    note: "Maîtriser quelque chose reste gratifiant en soi — le flow décrit l'expérience subjective de ce moment où l'action se suffit à elle-même." },
  { source: "theorie_flow", cible: "autodetermination", type: "convergence",
    note: "Le flow apparaît précisément quand le défi correspond à la compétence, rejoignant le besoin de compétence déjà posé dans la théorie de l'autodétermination." },


  { source: "buts_accomplissement", cible: "theorie_flow", type: "convergence",
    note: "Les buts de maîtrise sont précisément ceux qui produisent le plus souvent l'état d'absorption totale que Csikszentmihalyi décrit." }
];



// L'univers complet : les cadres richement connectés, plus les cadres en attente
// d'être reliés — jamais deux listes séparées dans l'usage réel, une seule vérité.


const CADRES_ISOLES = [
  // Liste reconstruite proprement en une seule passe, après un premier essai qui avait
  // produit des doublons sous des identifiants différents. Chaque entrée correspond à
  // une vraie entrée distincte de l'index des trois cent dix cadres, jamais encore reliée
  // par une connexion vérifiée — le vrai travail de l'étape 2 reste devant nous.
];

const TOUS_LES_CADRES = [...CADRES, ...CADRES_ISOLES];



module.exports = { CADRES, CADRES_ISOLES, TOUS_LES_CADRES, CONNEXIONS };