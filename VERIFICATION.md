# Vérifications — 29 octobre 2026

## Construction

- `bun install --frozen-lockfile` : installation reproductible, aucun changement du lockfile.
- `bun run typecheck` : TypeScript strict sans erreur.
- `bun run build` : build Vite réussi, assets et polices embarqués dans `dist/`.
- Contenu : 20 identifiants uniques, 18 hooks natifs, un extrait et des exercices corrigés pour chaque chapitre.

## Vérifications dans le navigateur

Tests réalisés avec les outils de navigateur, sans suite automatisée persistante :

- Ouverture successive des 20 chapitres en développement : les 20 démonstrations se montent, aucune Error Boundary déclenchée.
- useState : trois mises à jour avec la valeur capturée ajoutent 1 ; trois fonctions de mise à jour ajoutent 3.
- QCM : sélection, vérification et correction expliquée.
- Progression : marquage d’un chapitre terminé et mise à jour du compteur latéral.
- useCallback : un rendu du parent ajoute un commit à l’enfant avec callback ordinaire, sans ajouter de commit à celui avec callback stable.
- useEffect : recherche « Type » donnant « TypeScript » via fetch/MSW ; simulation d’erreur affichée.
- useActionState en production : validation d’un prénom trop court, puis confirmation d’un prénom valide.
- useOptimistic : message provisoire, confirmation et retrait après erreur ; confirmation sans doublon après correction du reducer optimiste.
- Mode projection : agrandissement du contenu et retrait du sommaire droit.
- Mobile : contrôle à 390 × 844, ouverture du menu, filtrage et accès à useId ; pas de débordement horizontal global constaté.
- Production sous `/react-hooks/` : ouverture directe d’un chapitre, chargement des assets, Service Worker et soumission simulée fonctionnels.

## Portée et revue restante

Le déploiement GitHub Pages est configuré dans le dépôt public `jlg-formation/hooklab`, après confirmation de la publication des sources. Le workflow se déclenche sur les pushes vers `main`, ou manuellement. Les essais ne constituent pas un audit d’accessibilité exhaustif ni une validation sur tous les navigateurs. Les mini-défis se font dans un éditeur externe ; l’éditeur intégré est prévu pour une éventuelle phase 2.
