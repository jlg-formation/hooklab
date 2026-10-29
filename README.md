# Hooklab — L’atelier des hooks React

Support pédagogique en français pour présenter les hooks React, en projection et en autonomie. Application **Vite + React 19 + TypeScript strict**, gérée avec **Bun**. Frontend statique : aucun backend, compte ou secret.

## Démarrer

Prérequis : Bun 1.4.4 (version utilisée et verrouillée dans le workflow), et Node.js 22.12+ pour les outils Vite.

```sh
bun install --frozen-lockfile
bun run dev
```

Ouvrir l’adresse affichée par Vite, normalement http://127.0.0.1:5173/.

```sh
bun run typecheck
bun run build
bun run preview
```

Le build produit `dist/`. Servir ce dossier via HTTP ou HTTPS ; l’ouverture directe de `index.html` en `file://` n’est pas prise en charge.

## Le parcours

Une remise à niveau et 20 chapitres : 18 hooks React Core et deux chapitres transversaux. Aucun hook de bibliothèque tierce ou de `react-dom` n’est enseigné.

1. Règles des hooks
2. useState
3. useRef
4. useId
5. useReducer
6. useContext
7. Créer ses propres hooks
8. useEffect
9. useEffectEvent
10. useLayoutEffect
11. useImperativeHandle
12. useMemo
13. useCallback
14. useTransition
15. useDeferredValue
16. useActionState
17. useOptimistic
18. useSyncExternalStore
19. useDebugValue
20. useInsertionEffect

Chaque fiche comprend un problème, un modèle mental, une démo réellement exécutée avec le hook concerné, un exemple TypeScript autonome, des recommandations, des pièges, un approfondissement et deux exercices corrigés (QCM et mini-défi). Les 20 exemples de `src/examples.ts` incluent les imports, un composant principal `App` exporté par défaut, le JSX et toutes les fonctions nécessaires. Ils peuvent être copiés tels quels dans le fichier `App.tsx` d’un projet React 19.2 + TypeScript. Les actions asynchrones utilisent des simulations locales sans serveur. Les démos interactives du site sont dans `src/demos.tsx`.

La mémorisation automatique par React Compiler est désactivée pour pouvoir observer les différences. Strict Mode reste actif en développement ; les vérifications supplémentaires sont expliquées dans le cours. Les démos de performance ajoutent un coût artificiel borné. Les compteurs de commits de useCallback sont instrumentés après le rendu ; il faut comparer leurs variations.

## Navigation et usage

- Sidebar filtrable (Ctrl/Cmd + K), navigation précédente/suivante et liens directs par hash, par exemple `/#useEffect`.
- Trois onglets : cours, exercices, aide-mémoire.
- Réinitialisation de chaque démo et copie des extraits TypeScript.
- Mode projection : typographie agrandie et suppression du sommaire latéral droit.
- Menu mobile, navigation au clavier, états de focus et styles d’impression.
- Progression enregistrée dans le localStorage de ce navigateur ; aucun suivi distant. Cliquer à nouveau sur « Terminé » retire le chapitre de la progression.
- L’éditeur de code intégré est réservé à une phase ultérieure. Les mini-défis se font dans l’éditeur du stagiaire.

## Simulations réseau

**MSW est activé dans tous les builds**, y compris la production : c’est une fonctionnalité pédagogique. Les appels `fetch` vers `api/search` et `api/save` sont interceptés dans le navigateur. Aucun serveur ne reçoit les saisies des démos. Les contrôles règlent une latence de 250 ms, 1,5 s ou 3 s et une erreur HTTP 503. `AbortController` annule les recherches précédentes.

Les Service Workers nécessitent localhost ou HTTPS (fourni par GitHub Pages). Le worker est servi depuis `public/mockServiceWorker.js`, dans le même sous-chemin que l’application. S’il est bloqué, un écran explicatif apparaît. Les polices sont embarquées ; aucune ressource Google Fonts n’est chargée. Le lien vers la documentation React est externe et s’ouvre sur demande.

Après une mise à jour de MSW, régénérer et versionner son worker :

```sh
bun run node_modules/msw/cli/index.js init public --save
```

## Déployer sur GitHub Pages après validation

Le dépôt public est [jlg-formation/hooklab](https://github.com/jlg-formation/hooklab). Le site est publié sur [GitHub Pages](https://jlg-formation.github.io/hooklab/).

Le workflow `.github/workflows/deploy.yml` publie chaque push sur `main`. Il peut également être déclenché manuellement.

1. Créer ou choisir un dépôt GitHub, puis y pousser les sources, `bun.lock`, le worker et le workflow. Ne pas pousser `node_modules/`, `dist/` ou les caches.
2. Dans **Settings → Pages → Build and deployment**, sélectionner **GitHub Actions**.
3. Dans **Actions → Déployer sur GitHub Pages**, choisir **Run workflow**.
4. Le workflow installe avec Bun et le lockfile, vérifie TypeScript, compile et publie `dist/`.

La configuration Vite utilise `base: './'` et la navigation utilise des hashes. Le site fonctionne à la racine d’un domaine ou sous `/nom-du-depot/` sans règle de réécriture et sans modification de `base`. Conserver le slash final de l’URL du dépôt pour la résolution des assets et du worker.

GitHub Pages utilise GitHub Actions comme source de publication. Pour les changements suivants, pousser sur `main` puis vérifier la réussite du workflow avant de partager la nouvelle version.

## Structure

```text
src/course.ts      Contenu des 20 chapitres et exercices
src/demos.tsx      Démonstrations interactives
src/App.tsx        Navigation, fiches, quiz et progression
src/network.ts    Client fetch commun avec annulation
src/mocks.ts      Endpoints MSW simulés
src/styles.css    Design responsive, projection et impression
public/           Favicon et Service Worker MSW
```

## Références

- [Hooks React](https://react.dev/reference/react/hooks)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [Règles des hooks](https://react.dev/reference/rules/rules-of-hooks)
- [MSW](https://mswjs.io/docs/)
- [Vite et GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)

Le parcours distingue volontairement fréquence d’usage et exhaustivité : les hooks spécialisés sont identifiés « Avancé » et leurs limites sont expliquées.
