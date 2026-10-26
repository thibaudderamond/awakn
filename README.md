# Awakn

Application de croissance personnelle construite autour du companion IA Ori.

## Contenu

| Dossier | Rôle |
|---|---|
| `awakn-poc/index.html` | POC fonctionnel (interface + prompt système d'Ori + logique). Source de vérité du prompt. |
| `docs/document-cadrage-app.md` | Document de cadrage — source de vérité du projet. |
| `docs/constitution-v3.md` | Constitution d'Awakn (v3), dérivée du document de cadrage. |
| `docs/prompt-ori-integral.md` | Export généré du prompt — ne jamais modifier à la main, relancer `npm run regenerer`. |
| `scripts/` | Scripts déterministes : régénération du prompt, vérification de restructuration, graphe des cadres, signaux de profil. |
| `tests/` | Jeu d'évaluation du déclenchement des modules. |

## Commandes

```bash
npm test            # vérification de structure + évaluation du déclenchement des modules
npm run regenerer   # régénère docs/prompt-ori-integral.md depuis le POC
npm run graphe      # statistiques du graphe des cadres
```

## Exécution du POC

Le POC appelle l'API Anthropic sans clé et persiste via `window.storage` : il ne fonctionne qu'à l'intérieur d'un artifact claude.ai. Ouvert directement dans un navigateur, les appels échouent.
