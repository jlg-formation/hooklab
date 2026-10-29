import { examples } from "./examples";

export type Lesson = {
  id: string;
  title: string;
  group: number;
  minutes: number;
  level: "Essentiel" | "Intermédiaire" | "Avancé";
  subtitle: string;
  problem: string;
  mental: string;
  task: string;
  observe: string;
  good: string[];
  avoid: string[];
  details: string;
  code: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  exercise: string;
  solution: string;
};
export const groups = [
  "Les fondamentaux",
  "Organiser la logique",
  "Synchroniser",
  "Rester réactif",
  "Les actions",
  "Aller plus loin",
];
export const lessons: Lesson[] = [
  {
    id: "regles",
    title: "Règles des hooks",
    group: 0,
    minutes: 10,
    level: "Essentiel",
    subtitle: "Les bons réflexes, dès le premier composant.",
    problem:
      "React doit retrouver le même état au même endroit à chaque rendu. Un hook appelé seulement dans certaines branches casse cette correspondance.",
    mental:
      "Les hooks forment une suite stable d’appels, au sommet d’un composant ou d’un hook personnalisé.",
    task: "Activez et désactivez le détail. Observez que les hooks restent appelés, même lorsque le contenu est masqué.",
    observe:
      "Le rendu conditionnel est autorisé. C’est l’appel conditionnel d’un hook qui pose problème.",
    good: [
      "Appelez les hooks avant les retours conditionnels.",
      "Extrayez un composant si une branche a besoin de ses propres hooks.",
      "Gardez le rendu pur : aucun abonnement ni mutation extérieure pendant le rendu.",
    ],
    avoid: [
      "Un hook dans une condition, une boucle ou un gestionnaire de clic.",
      "Appeler un composant comme une fonction ordinaire.",
      "Modifier une prop ou une variable partagée pendant le rendu.",
    ],
    details:
      "Les hooks personnalisés commencent par use. Ils respectent les mêmes règles. L’API use a des règles particulières et ne fait pas partie des 18 hooks de ce parcours. En développement, Strict Mode réexécute certains traitements pour révéler les impuretés : ne cherchez pas à masquer ces vérifications.",
    code: examples.regles,
    question: "Où peut-on appeler useState ?",
    options: [
      "Dans un gestionnaire de clic",
      "Au sommet d’un composant",
      "Dans un if",
    ],
    answer: 1,
    explanation:
      "L’ordre des hooks doit être stable entre les rendus. Le gestionnaire utilise le setter, mais ne crée pas le hook.",
    exercise:
      "Un composant fait return null avant son useState quand visible est faux. Comment le corriger ?",
    solution:
      "Placez useState avant le retour conditionnel, ou montez un composant enfant uniquement lorsque visible vaut true. Dans ce dernier cas, son état sera recréé à chaque montage.",
  },
  {
    id: "useState",
    title: "useState",
    group: 0,
    minutes: 25,
    level: "Essentiel",
    subtitle: "Une mémoire pour vos composants.",
    problem:
      "Une variable locale disparaît à chaque exécution du composant. Sa modification ne demande pas non plus à React de mettre l’écran à jour.",
    mental:
      "Chaque rendu reçoit une photographie de l’état. Le setter demande un prochain rendu avec une nouvelle valeur.",
    task: "Incrémentez le compteur. Comparez ensuite les deux boutons « +3 » : l’un utilise la valeur du rendu, l’autre des fonctions de mise à jour.",
    observe:
      "Trois appels setCount(count + 1) proposent la même valeur. Trois fonctions c => c + 1 se composent et ajoutent bien 3.",
    good: [
      "Utilisez la forme fonctionnelle quand le prochain état dépend du précédent.",
      "Remplacez les objets et tableaux au lieu de les modifier.",
      "Calculez les valeurs dérivées pendant le rendu plutôt que de dupliquer l’état.",
    ],
    avoid: [
      "Lire une nouvelle valeur immédiatement après le setter : la variable du rendu n’a pas changé.",
      "Faire push sur un tableau d’état ou modifier directement une propriété.",
      "Mettre en état une information qui ne sert jamais à l’affichage.",
    ],
    details:
      "React regroupe les mises à jour. Une initialisation coûteuse peut être passée sous forme de fonction : useState(() => calcul()). L’initialiseur et les fonctions de mise à jour doivent être purs. Strict Mode peut les appeler deux fois en développement. React peut ignorer une mise à jour si Object.is juge les valeurs identiques.",
    code: examples.useState,
    question:
      "count vaut 0. Trois setCount(count + 1) dans le même clic donnent…",
    options: ["1", "3", "0"],
    answer: 0,
    explanation:
      "Les trois appels lisent count = 0 dans la même closure et demandent chacun la valeur 1.",
    exercise:
      "Ajoutez un bouton −3 qui reste correct si plusieurs mises à jour sont regroupées.",
    solution:
      "Utilisez setCount(c => c - 3). Pour un tableau, par exemple une suppression : setItems(items => items.filter(item => item.id !== id)).",
  },
  {
    id: "useRef",
    title: "useRef",
    group: 0,
    minutes: 15,
    level: "Essentiel",
    subtitle: "Conserver une valeur sans provoquer de rendu.",
    problem:
      "Il faut parfois retrouver un élément DOM ou mémoriser une information technique sans recalculer l’interface.",
    mental:
      "Une ref est une boîte stable avec une propriété current modifiable. React ne surveille pas ses modifications.",
    task: "Donnez le focus au champ. Incrémentez ensuite la ref : l’affichage ne change qu’au prochain rendu provoqué par le bouton dédié.",
    observe:
      "La valeur current change immédiatement ; l’écran, lui, attend un rendu.",
    good: [
      "Utilisez une ref pour un nœud DOM, un identifiant de timer ou une valeur technique.",
      "Lisez et modifiez current dans les événements ou les effets.",
      "Utilisez un état si la valeur doit actualiser l’interface.",
    ],
    avoid: [
      "Remplacer useState par une ref pour une valeur affichée.",
      "Lire ou écrire arbitrairement une ref pendant le rendu.",
      "Supposer que inputRef.current est déjà disponible au premier rendu.",
    ],
    details:
      "React renseigne la ref DOM après le commit et la remet à null quand le nœud disparaît. Le type HTMLInputElement | null rappelle de traiter cette absence. Une ref peut conserver un timer à nettoyer lors du démontage.",
    code: examples.useRef,
    question: "Modifier ref.current provoque-t-il un rendu ?",
    options: ["Toujours", "Jamais à lui seul", "Seulement avec une ref DOM"],
    answer: 1,
    explanation:
      "La ref conserve une valeur entre les rendus sans notifier React.",
    exercise:
      "Où stocker l’identifiant d’un setInterval démarré par un bouton ?",
    solution:
      "Dans une ref typée ReturnType<typeof setInterval> | null. Arrêtez le timer avant de le remplacer et nettoyez-le au démontage.",
  },
  {
    id: "useId",
    title: "useId",
    group: 0,
    minutes: 10,
    level: "Essentiel",
    subtitle: "Relier les éléments, sans collision.",
    problem:
      "Deux exemplaires d’un formulaire avec le même id HTML rendent les associations des labels et descriptions ambiguës.",
    mental:
      "Chaque instance obtient une identité stable pour relier ses éléments accessibles.",
    task: "Cliquez sur chacun des labels. Vérifiez que le bon champ reçoit le focus et comparez les identifiants affichés.",
    observe:
      "Le même composant crée des identifiants distincts selon son instance.",
    good: [
      "Reliez label et input avec htmlFor et id.",
      'Dérivez plusieurs identifiants depuis un préfixe : id + "-help".',
      "Utilisez aria-describedby pour les indications complémentaires.",
    ],
    avoid: [
      "Utiliser useId pour les clés des listes : elles viennent des données.",
      "Créer un id avec Math.random() pendant le rendu.",
      "Appeler useId dans une boucle au lieu d’extraire un composant.",
    ],
    details:
      "useId est conçu pour rester cohérent entre serveur et client si les arbres correspondent. Il ne s’agit ni d’un identifiant métier ni d’une valeur destinée à être analysée. Le format exact de l’identifiant est un détail de React.",
    code: examples.useId,
    question: "Quelle est la bonne clé pour une liste de produits ?",
    options: ["useId()", "Math.random()", "product.id"],
    answer: 2,
    explanation:
      "La clé doit représenter l’identité stable de la donnée, même après un tri ou une insertion.",
    exercise:
      "Associez un message d’erreur au champ sans créer un deuxième useId.",
    solution:
      'Dérivez id + "-error" et référencez-le dans aria-describedby. Ajoutez aria-invalid lorsque le champ est invalide.',
  },
  {
    id: "useReducer",
    title: "useReducer",
    group: 1,
    minutes: 20,
    level: "Essentiel",
    subtitle: "Décrire les intentions, centraliser les transitions.",
    problem:
      "Quand plusieurs événements modifient un même ensemble de données, la logique d’état devient difficile à suivre.",
    mental:
      "Une action décrit ce qui s’est passé ; un reducer pur calcule le prochain état.",
    task: "Ajoutez et retirez des articles. Observez la dernière action et le total dérivé du panier.",
    observe:
      "L’interface envoie une intention. Le reducer est le seul endroit qui décide comment le panier évolue.",
    good: [
      "Décrivez les actions avec une union discriminée TypeScript.",
      "Gardez le reducer pur, sans fetch, timer ou mutation.",
      "Conservez useState pour une valeur simple et indépendante.",
    ],
    avoid: [
      "Modifier state avant de le retourner.",
      "Mettre les effets de bord dans le reducer.",
      "Stocker un total calculable à partir du panier.",
    ],
    details:
      "dispatch est stable. Comme un setter, il demande le prochain rendu sans modifier la variable state du rendu courant. Un reducer peut être testé indépendamment du composant. useReducer n’est pas un store global : sa portée reste celle du composant qui l’appelle.",
    code: examples.useReducer,
    question: "Un reducer devrait…",
    options: [
      "Appeler le serveur",
      "Calculer un nouvel état sans effet de bord",
      "Modifier directement son argument",
    ],
    answer: 1,
    explanation:
      "La pureté permet à React de réexécuter le calcul sans déclencher d’opération externe.",
    exercise: "Ajoutez une action reset au panier.",
    solution:
      'Étendez Action avec { type: "reset" }, puis retournez 0 dans le case correspondant. Le bouton appelle dispatch({ type: "reset" }).',
  },
  {
    id: "useContext",
    title: "useContext",
    group: 1,
    minutes: 20,
    level: "Essentiel",
    subtitle: "Partager une valeur à travers l’arbre.",
    problem:
      "Passer la même prop à travers plusieurs composants intermédiaires peut encombrer leurs interfaces.",
    mental:
      "Le consommateur lit la valeur du provider correspondant le plus proche au-dessus de lui.",
    task: "Changez le thème du provider. Le composant enfant le lit sans recevoir de prop theme.",
    observe:
      "La valeur traverse l’arbre, pas une chaîne explicite de props. Les consommateurs se mettent à jour lorsque cette valeur change.",
    good: [
      "Créez le contexte hors des composants.",
      "Préférez les props lorsque le partage reste local et clair.",
      "Séparez les contextes dont les valeurs changent à des rythmes différents.",
    ],
    avoid: [
      "Croire que Context est automatiquement une optimisation.",
      "Recréer sans raison un gros objet value à chaque rendu.",
      "Confondre la valeur par défaut avec un état automatiquement modifié.",
    ],
    details:
      "Le provider doit être au-dessus du composant qui appelle useContext. La valeur par défaut ne sert qu’en l’absence de provider. Un enfant mémorisé avec memo reçoit quand même les nouvelles valeurs des contextes qu’il lit. React 19 permet <ThemeContext value={theme}>.",
    code: examples.useContext,
    question: "Quel provider useContext choisit-il ?",
    options: [
      "Le premier dans l’application",
      "Le plus proche au-dessus du consommateur",
      "Celui qui est rendu juste après",
    ],
    answer: 1,
    explanation:
      "La recherche remonte dans l’arbre React à partir du consommateur.",
    exercise: "Comment donner un thème différent à une seule sous-section ?",
    solution:
      "Placez un autre provider du même contexte autour de cette sous-section. Ses consommateurs liront ce provider plus proche.",
  },
  {
    id: "custom",
    title: "Créer ses propres hooks",
    group: 1,
    minutes: 15,
    level: "Essentiel",
    subtitle: "Réutiliser une logique, pas partager un état.",
    problem:
      "Plusieurs composants reproduisent la même logique avec les mêmes hooks.",
    mental:
      "Un hook personnalisé est une fonction composant de la logique React. Chaque appel possède ses propres états.",
    task: "Manipulez les deux compteurs indépendants. Ils utilisent exactement le même hook personnalisé.",
    observe:
      "La logique est partagée, mais cliquer sur un compteur ne modifie pas l’autre.",
    good: [
      "Nommez la fonction use suivi d’une majuscule.",
      "Exposez une interface liée à un besoin concret.",
      "Après le chapitre useEffect, appliquez cette extraction à un abonnement avec nettoyage.",
    ],
    avoid: [
      "Supposer que deux appels partagent le même état.",
      "Créer un hook pour chaque fonction utilitaire sans hook interne.",
      "Masquer des dépendances d’effets derrière une abstraction ambiguë.",
    ],
    details:
      "Une fonction de calcul sans hook peut rester une fonction ordinaire. Pour partager un état entre composants, remontez-le dans leur parent ou utilisez un contexte. Un hook personnalisé respecte toutes les règles d’appel et doit documenter ses paramètres réactifs.",
    code: examples.custom,
    question: "Deux appels à useCounter() partagent…",
    options: [
      "Le même état",
      "La logique, avec deux états distincts",
      "La même ref automatiquement",
    ],
    answer: 1,
    explanation:
      "Les états sont associés à chaque appel dans son composant, pas à la définition de la fonction.",
    exercise: "Ajoutez une méthode decrement au hook.",
    solution:
      "Retournez decrement: () => setCount(c => c - 1). Aucun état supplémentaire n’est nécessaire.",
  },
  {
    id: "useEffect",
    title: "useEffect",
    group: 2,
    minutes: 30,
    level: "Essentiel",
    subtitle: "Synchroniser React avec le monde extérieur.",
    problem:
      "Un abonnement, un timer ou une requête doivent suivre la vie du composant et ses paramètres sans être déclenchés pendant le rendu.",
    mental:
      "Installer une synchronisation, puis la nettoyer avant de la remplacer ou lorsque le composant disparaît.",
    task: "Démarrez le minuteur, puis arrêtez-le. Passez à la recherche et saisissez rapidement plusieurs lettres avec un délai réseau long.",
    observe:
      "Le timer se nettoie à l’arrêt. La recherche annule la requête précédente pour empêcher une ancienne réponse de remplacer les nouveaux résultats.",
    good: [
      "Déclarez toutes les valeurs réactives lues par l’effet dans ses dépendances.",
      "Retournez le nettoyage symétrique : unsubscribe, clearInterval ou abort.",
      "Pour une valeur dérivée, calculez-la pendant le rendu ; pour une action utilisateur, commencez par un événement.",
    ],
    avoid: [
      "Un effet pour calculer fullName à partir de firstName et lastName.",
      "Une fonction de callback async directement passée à useEffect.",
      "Supprimer une dépendance pour faire taire le linter.",
    ],
    details:
      "Sans tableau, l’effet s’exécute après chaque commit. Avec [], il ne dépend d’aucune valeur réactive du composant ; cela ne signifie pas « une seule fois pour toujours ». En Strict Mode, un cycle installation → nettoyage → installation supplémentaire vérifie la robustesse en développement. Une requête annulée ne doit pas être présentée comme une erreur métier.",
    code: examples.useEffect,
    question: "Quand le nettoyage est-il exécuté ?",
    options: [
      "Uniquement à la fermeture de l’onglet",
      "Avant une nouvelle installation et au démontage",
      "Avant chaque événement",
    ],
    answer: 1,
    explanation:
      "Chaque installation doit pouvoir être annulée. React nettoie l’ancienne synchronisation avant d’appliquer les nouvelles dépendances.",
    exercise:
      "Un abonnement change avec roomId. Quelles dépendances et quel nettoyage prévoir ?",
    solution:
      "Incluez roomId et toutes les autres valeurs réactives utilisées. Créez la connexion dans l’effet et retournez une fonction qui déconnecte exactement cette connexion.",
  },
  {
    id: "useEffectEvent",
    title: "useEffectEvent",
    group: 2,
    minutes: 15,
    level: "Intermédiaire",
    subtitle: "Lire la dernière valeur, sans relancer l’abonnement.",
    problem:
      "Un événement issu d’un effet doit lire une valeur actuelle sans que cette valeur fasse redémarrer toute la synchronisation.",
    mental:
      "La connexion reste réactive à ses paramètres ; la réaction à son événement lit les dernières valeurs validées.",
    task: "Connectez la salle puis changez le thème entre deux notifications. Observez le thème des notifications et le journal des connexions.",
    observe:
      "Le thème est récent, mais ne provoque pas de reconnexion. Changer de salle, oui.",
    good: [
      "Appelez l’Effect Event depuis la logique d’un effet.",
      "Conservez les vraies dépendances de synchronisation.",
      "Utilisez un gestionnaire ordinaire pour les clics utilisateur.",
    ],
    avoid: [
      "Utiliser ce hook pour cacher arbitrairement des dépendances.",
      "Passer l’Effect Event comme prop à un autre composant.",
      "L’appeler pendant le rendu ou dans un onClick.",
    ],
    details:
      "useEffectEvent est disponible à partir de React 19.2. Il lit les dernières valeurs du rendu validé. Son retour ne doit pas être ajouté aux dépendances de l’effet. Ce mécanisme est destiné à la logique non réactive appelée depuis des effets, pas à une mémorisation générale de callbacks.",
    code: examples.useEffectEvent,
    question: "Changer theme doit-il reconnecter la salle ?",
    options: [
      "Oui, toujours",
      "Non, si le thème ne sert qu’à afficher la notification",
      "Il faut retirer toutes les dépendances",
    ],
    answer: 1,
    explanation:
      "room reste une dépendance de synchronisation. theme est lu dans la réaction non réactive à l’événement.",
    exercise: "Peut-on appeler onMessage depuis un bouton pour tester ?",
    solution:
      "Non : créez un gestionnaire de bouton ordinaire. L’Effect Event reste réservé aux appels issus de la logique des effets.",
  },
  {
    id: "useLayoutEffect",
    title: "useLayoutEffect",
    group: 2,
    minutes: 15,
    level: "Intermédiaire",
    subtitle: "Mesurer avant que le navigateur peigne.",
    problem:
      "Un élément doit parfois être mesuré pour calculer sa présentation sans afficher une position intermédiaire.",
    mental:
      "Après la mise à jour du DOM, mesurer puis corriger avant le prochain affichage du navigateur.",
    task: "Changez la largeur de la carte. La mesure du DOM affichée se met à jour avec elle.",
    observe:
      "getBoundingClientRect lit une mesure réelle du navigateur. Cette lecture a lieu dans un layout effect.",
    good: [
      "Réservez ce hook aux mesures visuelles qui doivent précéder le paint.",
      "Préférez CSS lorsqu’il suffit à résoudre la mise en page.",
      "Gardez le traitement très court.",
    ],
    avoid: [
      "Remplacer tous les useEffect par useLayoutEffect.",
      "Effectuer des calculs coûteux qui bloquent l’affichage.",
      "L’utiliser pour une requête réseau.",
    ],
    details:
      "useLayoutEffect bloque le paint et ses mises à jour d’état sont traitées avant l’affichage. Les effets ne s’exécutent pas pendant le rendu serveur. Pour observer un redimensionnement externe continu, on peut connecter un ResizeObserver avec un nettoyage adapté.",
    code: examples.useLayoutEffect,
    question: "Quel coût faut-il surveiller ?",
    options: [
      "Le blocage du paint",
      "Une requête HTTP obligatoire",
      "La suppression du DOM",
    ],
    answer: 0,
    explanation:
      "Le navigateur attend la fin du layout effect et de ses mises à jour avant d’afficher.",
    exercise: "Un calcul de total doit-il aller dans useLayoutEffect ?",
    solution:
      "Non, calculez le total pendant le rendu. Ce hook sert à une synchronisation visuelle impérative qui doit précéder le paint.",
  },
  {
    id: "useImperativeHandle",
    title: "useImperativeHandle",
    group: 2,
    minutes: 15,
    level: "Avancé",
    subtitle: "Exposer une petite interface impérative.",
    problem:
      "Un parent doit parfois déclencher un focus dans un enfant sans accéder à tous ses détails DOM.",
    mental:
      "L’enfant expose des méthodes choisies, comme une petite télécommande.",
    task: "Utilisez les commandes du parent pour donner le focus au champ enfant et sélectionner son texte.",
    observe:
      "Le parent ne reçoit pas le nœud DOM : seulement les deux méthodes exposées.",
    good: [
      "Exposez le minimum : focus, select ou une action impérative précise.",
      "Déclarez les dépendances utilisées pour créer le handle.",
      "En React 19, recevez ref comme prop typée.",
    ],
    avoid: [
      "Exposer tout l’état interne du composant.",
      "Remplacer une prop isOpen par une méthode open sans nécessité.",
      "Oublier que la ref peut être null.",
    ],
    details:
      "React 19 permet de recevoir ref directement comme prop. Dans React 18, forwardRef était nécessaire pour les composants fonctionnels. Préférez une API déclarative pour les données et le rendu ; le focus et la sélection sont des cas impératifs légitimes.",
    code: examples.useImperativeHandle,
    question: "Pour ouvrir une modale, préférez en général…",
    options: [
      "Une prop open",
      "Une ref exposant tous ses états",
      "Une mutation DOM du parent",
    ],
    answer: 0,
    explanation:
      "Une prop décrit directement l’interface souhaitée et reste synchronisée avec l’état React.",
    exercise: "Ajoutez une méthode clear au handle.",
    solution:
      "Exposez clear avec une implémentation cohérente avec le champ : pour un champ contrôlé, mettez son état à jour. Ne modifiez pas seulement le DOM d’un input contrôlé.",
  },
  {
    id: "useMemo",
    title: "useMemo",
    group: 3,
    minutes: 20,
    level: "Intermédiaire",
    subtitle: "Réutiliser le résultat d’un calcul.",
    problem:
      "Un calcul coûteux est refait alors que ses entrées n’ont pas changé.",
    mental:
      "React peut réutiliser le résultat précédent tant que les dépendances restent identiques.",
    task: "Recherchez « Carnet », puis cliquez sur le compteur sans modifier la recherche.",
    observe:
      "Changer la recherche affiche « Mémoïsation utilisée : non » : le million de produits est filtré à nouveau. Cliquer sur le compteur affiche « oui » : la recherche est inchangée, le dernier résultat est réutilisé. useMemo conserve seulement le dernier résultat, pas l’historique des recherches. Le temps affiché mesure le filtrage ou la récupération du cache sur le rendu courant, hors affichage de la liste. Cinq résultats sont affichés pour garder la démo compacte. Le volume rend le coût du filtrage plus visible ; la durée dépend de la machine. Strict Mode peut exécuter le calcul deux fois en développement.",
    good: [
      "Mesurez avant d’optimiser.",
      "Incluez toutes les entrées réactives du calcul.",
      "Gardez le calcul pur et le code correct sans le cache.",
    ],
    avoid: [
      "Mémoriser chaque addition ou concaténation.",
      "Oublier une dépendance et afficher un résultat obsolète.",
      "Créer à chaque rendu un objet utilisé comme dépendance.",
    ],
    details:
      "Les dépendances sont comparées avec Object.is. useMemo est une optimisation, pas une garantie sémantique de stockage. En développement Strict Mode peut exécuter le calcul deux fois. React Compiler peut automatiser une partie de ces optimisations ; ce projet le laisse désactivé pour rendre les mécanismes observables.",
    code: examples.useMemo,
    question: "Le code doit-il rester correct sans useMemo ?",
    options: ["Oui", "Non", "Seulement en production"],
    answer: 0,
    explanation:
      "Le cache optimise un calcul. Il ne doit pas être nécessaire au fonctionnement logique.",
    exercise:
      "Pourquoi [options] invalide-t-il toujours le cache si options = { query } dans le composant ?",
    solution:
      "Un nouvel objet est créé à chaque rendu. Déplacez sa création dans le calcul mémorisé et dépendez de query, ou stabilisez l’objet lorsque cela a un intérêt réel.",
  },
  {
    id: "useCallback",
    title: "useCallback",
    group: 3,
    minutes: 20,
    level: "Intermédiaire",
    subtitle: "Comprendre memo, stabiliser les callbacks et mesurer le gain.",
    problem:
      "À chaque rendu du composant, les fonctions déclarées dans son corps sont recréées. Même code ne veut pas dire même référence ! Pour comprendre useCallback, commençons par le rôle de memo et sa comparaison des props.",
    mental:
      "memo peut éviter de réexécuter un enfant dont toutes les props sont identiques. useCallback conserve une référence de fonction pour que cette comparaison puisse réussir.",
    task: "Changez le compteur du parent. Comparez les trois cas : sans memo, avec memo et une nouvelle fonction, puis avec memo et useCallback. Essayez aussi les trois boutons Ajouter : ils restent tous fonctionnels.",
    observe:
      "Les deux premiers compteurs augmentent. Le troisième reste stable lors des mises à jour du parent : memo retrouve la même prop onAdd grâce à useCallback. Ces compteurs mesurent les commits validés, pas tous les appels du composant ni les changements du DOM.",
    good: [
      "Utilisez-le lorsqu’une identité stable a une utilité mesurée.",
      "memo peut servir même sans callback : vérifiez si les props restent identiques lors des rendus du parent.",
      "Comparez la même interaction avec et sans memo dans le Profiler de React DevTools ; répétez les mesures.",
      "Utilisez les setters fonctionnels pour éviter de lire un état inutilement.",
    ],
    avoid: [
      "Mettre memo partout sans vérifier le bénéfice, ou confondre moins de rendus avec une interaction plus rapide.",
      "Croire que useCallback seul empêche les rendus de l’enfant.",
      "Passer d’autres props toujours nouvelles à l’enfant puis attendre un bénéfice.",
      "Omettre une dépendance et garder une closure obsolète.",
    ],
    details:
      "memo n’empêche pas les mises à jour de l’état propre ou du contexte lu par l’enfant. Une fonction mémorisée peut être inutile si son destinataire n’utilise pas son identité. La démo instrumente les commits après le rendu avec un layout effect et une ref, sans déclencher de rendu supplémentaire. Strict Mode ajoute une vérification au montage : comparez les variations.",
    code: examples.useCallback,
    question: "useCallback exécute-t-il la fonction passée ?",
    options: [
      "Oui, à chaque rendu",
      "Non, il renvoie une fonction",
      "Oui, une seule fois",
    ],
    answer: 1,
    explanation:
      "Le callback est appelé ensuite par votre code, par exemple lors d’un clic.",
    exercise:
      "Un enfant reçoit name et onSelect, qui lit productId. Le parent change souvent un compteur indépendant. Expliquez d’abord ce que memo peut éviter, puis stabilisez onSelect avec les bonnes dépendances. Décrivez comment vérifier un gain de performance et où lire les résultats.",
    solution:
      "memo peut sauter le rendu venant du parent si name et onSelect sont identiques. useCallback doit inclure productId et toutes les autres valeurs réactives lues ; [] capturerait le productId initial. Si name ou productId change, le rendu reste nécessaire. Enregistrez plusieurs fois la même interaction avec et sans optimisation dans l’onglet Profiler de React DevTools et comparez les durées, pas seulement le nombre de rendus. Avec le composant Profiler, lisez les mesures dans onRender, par exemple via console.log dans la console du navigateur.",
  },
  {
    id: "useTransition",
    title: "useTransition",
    group: 3,
    minutes: 20,
    level: "Intermédiaire",
    subtitle: "Laisser les interactions urgentes passer en premier.",
    problem:
      "Un affichage coûteux peut retarder la réponse à une saisie utilisateur.",
    mental:
      "La saisie est urgente ; le rendu des résultats peut être préparé en arrière-plan et interrompu.",
    task: "Saisissez un filtre et comparez le mode direct au mode transition. Les cartes ont un coût de rendu artificiel.",
    observe:
      "La valeur de l’input est mise à jour immédiatement. L’état des résultats est mis à jour dans startTransition.",
    good: [
      "Gardez l’état d’un input contrôlé hors de la transition.",
      "Affichez isPending pour expliquer le travail en cours.",
      "Découpez les gros rendus en composants afin que React puisse céder la main.",
    ],
    avoid: [
      "Croire que startTransition envoie un calcul JavaScript dans un worker.",
      "Mettre une boucle synchrone énorme dans le callback.",
      "Utiliser une transition comme debounce de requêtes.",
    ],
    details:
      "La transition planifie le rendu, elle ne rend pas un calcul arbitraire interruptible. React ne peut céder la main qu’entre unités de travail. Après un await, une mise à jour peut nécessiter un nouveau startTransition selon l’usage ; les actions asynchrones demandent aussi une gestion explicite des erreurs et de l’ordre des réponses.",
    code: examples.useTransition,
    question: "Une transition déplace-t-elle le calcul dans un autre thread ?",
    options: ["Oui", "Non", "Seulement avec fetch"],
    answer: 1,
    explanation:
      "React peut interrompre le travail de rendu entre composants, mais un calcul JavaScript synchrone reste sur le thread principal.",
    exercise: "Pourquoi conserver deux états text et query ?",
    solution:
      "text contrôle immédiatement le champ. query pilote la partie coûteuse qui peut être rendue avec une priorité moins urgente.",
  },
  {
    id: "useDeferredValue",
    title: "useDeferredValue",
    group: 3,
    minutes: 15,
    level: "Intermédiaire",
    subtitle: "Laisser une partie de l’écran prendre du retard.",
    problem:
      "Une valeur arrive d’un parent ou d’un autre hook et pilote un rendu coûteux sans que l’on contrôle son setter.",
    mental:
      "Conservez l’interface urgente à jour et autorisez un consommateur à utiliser temporairement une ancienne valeur.",
    task: "Saisissez un filtre. Comparez le texte saisi et la valeur utilisée par les résultats.",
    observe:
      "Lorsque les deux valeurs diffèrent, les résultats sont anciens et leur présentation l’indique.",
    good: [
      "Indiquez visuellement que les résultats ne sont pas encore à jour.",
      "Mémorisez le sous-arbre coûteux pour lui permettre de sauter le rendu urgent.",
      "Utilisez une valeur primitive ou un objet stable.",
    ],
    avoid: [
      "Attendre un délai fixe de 300 ms : ce n’est pas un debounce.",
      "Supposer que ce hook réduit à lui seul les appels réseau.",
      "Différer une valeur triviale sans bénéfice visible.",
    ],
    details:
      "useTransition sert quand vous contrôlez la mise à jour ; useDeferredValue quand vous souhaitez différer l’utilisation d’une valeur. Le délai dépend du travail et de la machine. Une saisie lente peut ne produire aucun retard perceptible : la démo ajoute un coût artificiel au rendu.",
    code: examples.useDeferredValue,
    question: "useDeferredValue impose-t-il un délai fixe ?",
    options: [
      "Oui, 300 ms",
      "Non, React adapte la planification",
      "Oui, une seconde",
    ],
    answer: 1,
    explanation:
      "Le rendu différé commence lorsque React peut le préparer, sans durée fixe configurée.",
    exercise: "Comment signaler que les résultats sont anciens ?",
    solution:
      "Comparez query et deferredQuery. Affichez un statut et appliquez une indication visuelle sans retirer brutalement les résultats déjà présents.",
  },
  {
    id: "useActionState",
    title: "useActionState",
    group: 4,
    minutes: 20,
    level: "Intermédiaire",
    subtitle: "Suivre le résultat d’une action.",
    problem:
      "Une soumission asynchrone nécessite un résultat, une attente et des retours de validation cohérents.",
    mental:
      "Une action reçoit l’état précédent et une entrée, puis renvoie le nouvel état affiché.",
    task: "Envoyez un prénom, puis essayez une valeur trop courte ou une erreur simulée.",
    observe:
      "Le bouton reflète isPending. Le résultat retourné par l’action devient le nouvel état.",
    good: [
      "Retournez un état explicite, typé et utile à l’interface.",
      "Utilisez form action ou un contexte de transition pour déclencher l’action.",
      "Traitez les erreurs attendues et rendez le statut accessible.",
    ],
    avoid: [
      "Oublier que le premier argument est previousState, pas FormData.",
      "Appeler une action async hors de son contexte et attendre isPending.",
      "Supposer qu’une action nécessite forcément un serveur.",
    ],
    details:
      "Disponible dans React 19. Ici l’action est une fonction asynchrone exécutée côté navigateur. Les actions d’un même hook sont mises en file ; évitez les soumissions involontaires en désactivant le bouton pendant l’attente. Un échec réseau attendu peut être converti en état ; une erreur inattendue relève aussi d’une Error Boundary.",
    code: examples.useActionState,
    question: "Que reçoit l’action en premier argument ?",
    options: ["FormData", "L’état précédent", "L’événement submit"],
    answer: 1,
    explanation:
      "useActionState ajoute l’état précédent avant le payload transmis à l’action.",
    exercise:
      "Comment afficher une erreur métier sans faire planter le composant ?",
    solution:
      'Retournez un état discriminé, par exemple { status: "error", message: "Nom déjà utilisé" }, et affichez ce message dans une zone de statut.',
  },
  {
    id: "useOptimistic",
    title: "useOptimistic",
    group: 4,
    minutes: 20,
    level: "Intermédiaire",
    subtitle: "Montrer le résultat avant la confirmation.",
    problem:
      "Attendre la fin d’une sauvegarde pour afficher toute réaction rend parfois l’interface inutilement lente.",
    mental:
      "Une couche temporaire anticipe le résultat pendant l’action. Les données confirmées restent la référence.",
    task: "Cliquez sur J’aime avec un délai long : le compteur augmente tout de suite. Simulez ensuite une erreur et cliquez à nouveau : le compteur revient à sa valeur précédente.",
    observe:
      "Le compteur passe de 12 à 13 immédiatement. Si le serveur confirme, il reste à 13. Si le serveur échoue, il revient à 12. Chaque nouveau clic ajoute un like.",
    good: [
      "Déclenchez la mise à jour optimiste dans une Action ou une transition.",
      "Marquez les données non confirmées.",
      "Prévoyez les erreurs et le retour aux données confirmées.",
    ],
    avoid: [
      "Confondre état optimiste et sauvegarde réelle.",
      "Promettre un succès avant confirmation.",
      "Optimiser ainsi une opération irréversible sans retour clair.",
    ],
    details:
      "Dans cet exemple, useOptimistic(likes) suffit : on lui transmet directement le nombre temporaire à afficher. La mise à jour dure pendant l’action ; à sa fin, la valeur confirmée redevient la base. await garde l’Action en cours pendant la requête. Le hook ne détecte pas les erreurs réseau : notre code les intercepte et ne modifie la base qu’en cas de succès. Cette démo autorise une seule requête à la fois ; une application réelle doit aussi gérer les réponses concurrentes.",
    code: examples.useOptimistic,
    question: "Après un échec, quelle donnée fait autorité ?",
    options: [
      "La valeur optimiste",
      "La valeur confirmée",
      "Le texte du bouton",
    ],
    answer: 1,
    explanation:
      "L’optimisme est une présentation provisoire. Sans confirmation, on revient à la base fiable.",
    exercise: "Le compteur passe à 13, puis le serveur refuse le like. Pourquoi revient-il à 12 sans appeler setOptimisticLikes(12) ?",
    solution:
      "La base likes est restée à 12 car setLikes n’est appelé qu’après une sauvegarde réussie. Quand l’Action se termine, React retire la valeur optimiste ; l’affichage repart de likes, donc de 12 likes. Le catch affiche l’erreur, mais ne réalise pas lui-même ce retour.",
  },
  {
    id: "useSyncExternalStore",
    title: "useSyncExternalStore",
    group: 5,
    minutes: 15,
    level: "Avancé",
    subtitle: "Lire une source de vérité extérieure à React.",
    problem:
      "Des données existent hors de l’état React. Les composants doivent s’y abonner et obtenir un snapshot cohérent.",
    mental:
      "Un abonnement annonce un changement ; getSnapshot fournit la valeur courante stable.",
    task: "Modifiez le store externe. Les deux lecteurs abonnés reçoivent la même valeur.",
    observe:
      "L’état est dans un module, en dehors de l’arbre React. Le hook relie ce store aux composants.",
    good: [
      "Retournez un snapshot identique tant que les données n’ont pas changé.",
      "Fournissez une fonction de désabonnement.",
      "Préférez useState ou useReducer pour l’état détenu naturellement par React.",
    ],
    avoid: [
      "Retourner un nouvel objet à chaque getSnapshot.",
      "Recréer subscribe sans nécessité à chaque rendu.",
      "Introduire un store externe pour un simple compteur local.",
    ],
    details:
      "subscribe et getSnapshot sont définis hors du composant dans cette démo. Un troisième argument getServerSnapshot sert au rendu serveur et à l’hydratation ; ce site statique côté client n’en a pas besoin. Pour un store objet, cachez un snapshot immuable jusqu’à la prochaine vraie modification.",
    code: examples.useSyncExternalStore,
    question: "getSnapshot peut-il retourner {} à chaque appel ?",
    options: [
      "Oui, sans conséquence",
      "Non, il faut une valeur stable sans changement",
      "Seulement dans useEffect",
    ],
    answer: 1,
    explanation:
      "Un nouvel objet permanent fait croire à React que le store change sans arrêt et peut causer une boucle.",
    exercise: "Adaptez le store pour un objet { count: number }.",
    solution:
      "Conservez un snapshot dans le module. Remplacez-le seulement pendant increment, puis notifiez les abonnés. getSnapshot retourne ce même objet entre deux modifications.",
  },
  {
    id: "useDebugValue",
    title: "useDebugValue",
    group: 5,
    minutes: 10,
    level: "Avancé",
    subtitle: "Rendre ses hooks plus lisibles dans les DevTools.",
    problem:
      "Inspecter un hook personnalisé ne révèle pas toujours immédiatement le sens de son état interne.",
    mental:
      "Une étiquette de diagnostic destinée à React DevTools, sans effet sur l’interface de l’application.",
    task: "Changez le statut simulé. Comparez l’interface avec l’illustration de l’étiquette visible dans les DevTools.",
    observe:
      "La représentation des DevTools est une illustration. Pour inspecter le vrai hook, ouvrez React DevTools et sélectionnez le composant de démonstration.",
    good: [
      "Placez useDebugValue dans les hooks personnalisés utiles à inspecter.",
      "Donnez une information courte et parlante.",
      "Utilisez le formateur optionnel pour un formatage coûteux à la demande.",
    ],
    avoid: [
      "L’utiliser pour afficher du texte dans la page.",
      "Le parsemer dans tous les composants.",
      "Confondre une étiquette de diagnostic et une journalisation métier.",
    ],
    details:
      "Ce hook a surtout de la valeur pour des abstractions réutilisées. Son deuxième argument est un formateur exécuté lorsque le hook est inspecté. Aucun DevTools n’est nécessaire pour suivre la leçon : la carte d’illustration montre l’intention sans prétendre être une inspection réelle.",
    code: examples.useDebugValue,
    question: "Où apparaît l’étiquette de useDebugValue ?",
    options: [
      "Dans le DOM",
      "Dans React DevTools",
      "Dans la console automatiquement",
    ],
    answer: 1,
    explanation:
      "L’étiquette enrichit l’inspection du hook personnalisé dans les outils de développement.",
    exercise:
      "Étiquetez un hook de chargement avec son statut et le nombre de résultats.",
    solution:
      "Appelez useDebugValue({ status, count: items.length }, value => `${value.status} · ${value.count} résultats`).",
  },
  {
    id: "useInsertionEffect",
    title: "useInsertionEffect",
    group: 5,
    minutes: 10,
    level: "Avancé",
    subtitle: "Connaître un outil destiné aux auteurs de bibliothèques.",
    problem:
      "Une bibliothèque de styles dynamiques peut devoir insérer ses règles avant les effets qui mesurent la mise en page.",
    mental:
      "Une phase spécialisée d’insertion de styles, avant les layout effects.",
    task: "Changez la couleur. La démo installe une règle CSS ciblée puis retire l’ancienne.",
    observe:
      "Une balise style est insérée et nettoyée par le hook. Pour ce simple besoin, une variable CSS ou style serait préférable.",
    good: [
      "Réservez-le aux infrastructures de styles qui ont réellement ce besoin.",
      "Nettoyez les règles que vous avez installées.",
      "Préférez les feuilles CSS, les classes ou les styles ordinaires dans une application.",
    ],
    avoid: [
      "Mettre à jour un état dans ce hook.",
      "Mesurer le DOM ou supposer que les refs sont disponibles.",
      "Le présenter comme une meilleure version de useEffect.",
    ],
    details:
      "Les refs ne sont pas encore attachées et il ne faut pas dépendre d’un moment précis des mutations DOM. Le hook garantit surtout son exécution avant les layout effects. La démo est volontairement spécialisée : savoir pourquoi on ne l’utilise pas est l’objectif principal.",
    code: examples.useInsertionEffect,
    question: "À qui ce hook est-il principalement destiné ?",
    options: [
      "À tous les formulaires",
      "Aux auteurs d’infrastructures de styles",
      "Aux requêtes réseau",
    ],
    answer: 1,
    explanation:
      "Il répond à un besoin spécialisé d’insertion de CSS avant les mesures des layout effects.",
    exercise: "Comment réécrire cette démonstration sans useInsertionEffect ?",
    solution:
      "Appliquez style={{ color }} au texte, ou changez une classe CSS. La solution déclarative est plus simple pour ce besoin applicatif.",
  },
];
export const intro = {
  title: "Avant les hooks",
  subtitle: "Un quart d’heure pour retrouver les bons repères.",
};
