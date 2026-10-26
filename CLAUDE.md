# Awakn — instructions pour Claude Code

Awakn est une application de croissance personnelle construite autour d'un companion IA, Ori. Le fondateur est Thibaud. Toute la communication se fait en français, sur un ton cordial et professionnel.

## Règle permanente du projet

À chaque tâche, vérifier si le sujet ou la notion traités sont intégrés **à la fois** aux documents (`docs/`) et au POC (`awakn-poc/index.html`). Signaler tout écart dans le compte rendu, même s'il sort du périmètre de la tâche.

## Sources de vérité

- `docs/document-cadrage-app.md` est la source de vérité du projet. Les autres documents y renvoient par concept, jamais en le copiant.
- `awakn-poc/index.html` est la source de vérité du prompt d'Ori (fonction `buildSystemPrompt`, tableau `METHOD_MODULES`).
- `docs/prompt-ori-integral.md` est un export généré : ne jamais le modifier à la main, lancer `npm run regenerer`.
- Règle de propagation : tout cadre ajouté ou approfondi dans le document de cadrage ou le POC impose de vérifier les documents dérivés (Constitution, onboarding, synthèse méthodologique, dossier de subvention, recherche d'associé) qui en parlent.

## Manière de travailler

- Préférer les scripts déterministes aux modifications manuelles répétables.
- Toute nouvelle connexion entre cadres va dans `scripts/graphe-cadres.js`, pas seulement dans le texte du document de cadrage.
- Tout nouveau module ou mot-clé de déclenchement s'accompagne d'un scénario dans `tests/eval-declenchement.js`.
- La Constitution (`docs/constitution-v3.md`) ne se modifie jamais dans le même geste qu'une autre modification : confirmation explicite et séparée de Thibaud obligatoire.
- Les frameworks se formalisent avec leur source, leurs nuances et leurs limites.

## Vérifications avant chaque commit

```bash
npm test            # structure du prompt + déclenchement des modules
npm run regenerer   # si le prompt a changé
```

Ne jamais pousser si `npm test` échoue.

## Contraintes techniques

- Le POC appelle l'API Anthropic sans clé et persiste via `window.storage` : il ne fonctionne qu'à l'intérieur d'un artifact claude.ai. Ne pas ajouter de clé API dans le code.
- Le prompt est envoyé en trois blocs pour le cache (`statique`, `profil`, `modules`). Toute modification de `buildSystemPrompt` doit garder `npm run verifier` au vert.

## Plan d'action issu de l'audit du 26 octobre 2026

### Maintenant
- [ ] Détecteur de crise (`CRISIS_SIGNALS`, `detectCrisisSignal`) et d'autodiagnostic : normaliser le texte avant comparaison (apostrophe typographique ’ des claviers iPhone et Mac, accents, espaces), corriger la coquille « envie de en finir », élargir aux formulations indirectes (« j'ai plus envie de vivre », « je veux disparaître »…), ajouter un fichier de tests dédié.
- [ ] `buildSystemPrompt` : le texte qui suit les modules actifs (« Ces règles restent vraies indépendamment… ») est perdu dès qu'un module se déclenche. Le rattacher au bloc `modules` et ajouter à `verifier-restructuration.js` un test avec un module actif.
- [ ] Le prompt et l'écran des modules annoncent « vingt-deux modules » alors qu'il y en a 46 : calculer le nombre depuis `METHOD_MODULES`.
- [ ] Régénérer `docs/prompt-ori-integral.md` (dernier export : 7 octobre).

### Ensuite
- [ ] Déplacer les règles fixes situées après le marqueur « PROFIL DE LA PERSONNE » vers le bloc statique (≈ 58 000 caractères réécrits à chaque changement de profil), puis mesurer le gain de cache.
- [ ] Limiter l'historique envoyé dans `callOri` et afficher un message clair en cas d'erreur d'API (aujourd'hui muette).
- [ ] Échapper tout texte issu du modèle avant `innerHTML` (phrase d'accueil, concepts partagés, prises de conscience).
- [ ] Centraliser le nom du modèle (répété 9 fois).
- [ ] Ajouter des scénarios pour les 27 modules sans test (1 à 24, 39, 40, 44, 45).
- [ ] Mettre à jour les comptes de modules dans le document de cadrage (16 et 18 → 46).
- [ ] Graphe des cadres : corriger la statistique « 0 % isolé » et relier Schwartz, eudaimonie/hédonisme et ambiguïté causale.

### Avant de sortir du POC
- [ ] Serveur intermédiaire pour la clé API, authentification, base de données.
- [ ] Extraire le prompt en fichiers texte assemblés par un build, tests en intégration continue.
