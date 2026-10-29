export function CallbackQuestions() {
  const questions = [
    ["memo sert-il si l’enfant reçoit seulement name=\"Alice\", sans callback ?", "Oui. Il compare toutes les props, pas uniquement les fonctions. Si name reste identique lors d’un rendu du parent, React peut sauter la réexécution de l’enfant."],
    ["Deux fonctions ont le même code. Sont-elles la même prop pour memo ?", "Non. Deux fonctions créées séparément ont des références différentes. memo compare leur référence, pas leur code."],
    ["useCallback suffit-il à empêcher le rendu d’un enfant sans memo ?", "Non. Il stabilise une référence de fonction. Dans le cas habituel du laboratoire, l’enfant sans memo se réexécute avec le parent."],
    ["Avec memo, faut-il comparer les 10 000 éléments d’un tableau passé en prop ?", "Non, pas avec la comparaison par défaut : React compare la référence du tableau avec Object.is. Un nouveau tableau contenant les mêmes éléments reste une prop différente."],
    ["Un enfant avec memo change son propre état. Est-il réexécuté ?", "Oui. memo peut éviter des rendus venant du parent quand les props sont identiques. Il ne bloque pas les mises à jour de l’état propre ni d’un contexte lu."],
    ["Le compteur de rendus baisse. A-t-on prouvé que l’application est plus rapide ?", "Non. Il faut comparer les durées de la même interaction avec et sans optimisation, plusieurs fois. Un écart inférieur aux variations des mesures ne démontre aucun gain."],
    ["Où apparaissent les mesures du Profiler ?", "Dans l’onglet Profiler des outils du navigateur pour React DevTools. Le composant Profiler transmet, lui, les mesures à onRender : elles apparaissent dans la console seulement si votre code les y affiche."],
  ];
  return <div className="exercise-card">
    <h3>Vérifiez votre raisonnement</h3>
    <p>Répondez à chaque question avant d’ouvrir sa correction.</p>
    {questions.map(([question, answer]) => <details className="reading-details" key={question}>
      <summary>{question}</summary><p>{answer}</p>
    </details>)}
  </div>;
}

export default function CallbackLesson() {
  return (
    <div>
      <h3>1. Un rendu réexécute la fonction du composant</h3>
      <p>Quand son état change, React appelle à nouveau le composant pour calculer son JSX. Les déclarations dans son corps sont exécutées à nouveau. Une fonction déclarée à l’intérieur est donc une nouvelle fonction à chaque rendu : même code, mais référence différente.</p>
      <pre><code>{`const a = () => console.log('Bonjour');
const b = () => console.log('Bonjour');
Object.is(a, b); // false : deux fonctions distinctes

function Parent() {
  const onAdd = () => console.log('Ajouter');
  return <Enfant onAdd={onAdd} />;
  // À chaque rendu de Parent, onAdd est une nouvelle fonction.
}`}</code></pre>
      <p>La création de la fonction n’exécute pas son contenu. Ici, le message sera affiché lorsque onAdd sera appelée.</p>
      <h3>2. Sans memo, l’enfant se réexécute aussi</h3>
      <p>Dans ce cas habituel, quand le parent se réexécute, React réexécute aussi son enfant, même si les props transmises ont les mêmes valeurs. Réexécuter un composant ne signifie pas forcément modifier le DOM : React peut retrouver le même résultat à afficher.</p>
      <h3>3. memo compare les props avant de réexécuter l’enfant</h3>
      <pre><code>{`import { memo } from 'react';

const Enfant = memo(function Enfant({ onAdd }) {
  return <button onClick={onAdd}>Ajouter</button>;
}); // À déclarer hors de Parent.`}</code></pre>
      <p>memo enveloppe un composant. Lors d’une mise à jour du parent, React compare chaque prop avec sa valeur précédente grâce à Object.is. Si toutes sont identiques, il peut réutiliser le résultat précédent et sauter l’appel de la fonction Enfant. Si une seule change, il réexécute l’enfant.</p>
      <p>« Mêmes props » signifie mêmes valeurs pour les primitives, et mêmes références pour les objets, tableaux et fonctions. Deux fonctions qui contiennent exactement le même code ne sont pas la même prop ! Un objet écrit directement dans le JSX est lui aussi nouveau à chaque rendu.</p>
      <h3>4. useCallback permet à memo de retrouver la même fonction</h3>
      <pre><code>{`const onAdd = useCallback(() => {
  setCount(c => c + 1);
}, []);
return <Enfant onAdd={onAdd} />;`}</code></pre>
      <p>À chaque rendu, JavaScript évalue encore l’expression de fonction donnée à useCallback. Mais si les dépendances sont inchangées, React renvoie la référence conservée au rendu précédent. C’est cette référence stable que reçoit l’enfant. useCallback n’appelle pas la fonction et n’empêche pas le parent de se réexécuter.</p>
      <p>Le tableau vide convient ici car le callback utilise seulement un setter stable et une mise à jour fonctionnelle. S’il lit une prop comme productId, il faut l’inclure dans les dépendances : [productId]. Quand elle change, useCallback renvoie une nouvelle fonction et memo laisse l’enfant se réexécuter.</p>
      <h3>5. Les trois cas à comparer dans le laboratoire</h3>
      <ol>
        <li><strong>Sans memo, fonction stable :</strong> l’enfant se réexécute avec le parent. useCallback seul ne saute pas les rendus.</li>
        <li><strong>Avec memo, fonction recréée :</strong> onAdd change de référence. Les props sont différentes, donc l’enfant se réexécute.</li>
        <li><strong>Avec memo et useCallback :</strong> toutes les props sont identiques. React peut sauter la réexécution de l’enfant.</li>
      </ol>
      <p>memo n’empêche ni les mises à jour de l’état propre de l’enfant ni celles d’un contexte qu’il lit. C’est une optimisation, pas une garantie absolue. React Compiler peut automatiser ces optimisations ; il est désactivé dans cet atelier pour les rendre observables.</p>
      <h3>6. memo sert-il sans callback dans les props ? Oui !</h3>
      <pre><code>{`const Bonjour = memo(function Bonjour({ name }) {
  return <p>Bonjour {name}</p>;
});

// Dans le JSX du parent :
<Bonjour name="Alice" />`}</code></pre>
      <p>Si le parent se réexécute pour une autre raison, name vaut toujours « Alice ». Avec memo, React peut sauter le rendu de Bonjour. Sans memo, cet enfant se réexécute généralement avec le parent. Aucun callback n’est nécessaire pour que memo fonctionne ; même un composant sans props peut en bénéficier.</p>
      <p>Ce petit exemple illustre le mécanisme, mais ne démontre pas un gain de performance significatif. Éviter un rendu et accélérer une application sont deux observations différentes.</p>
      <h3>7. Pourquoi ne pas mettre memo partout ?</h3>
      <p>memo ajoute une comparaison lors des mises à jour venant du parent. Si une prop est toujours nouvelle, cette comparaison ne permet jamais de sauter le rendu. Si le parent se réexécute rarement, il y a peu de travail à éviter. Et si l’enfant est très rapide, le gain peut être négligeable.</p>
      <p>La comparaison par défaut reste légère : Object.is compare chaque prop. Pour un tableau de 10 000 éléments, React compare sa référence, sans parcourir ses 10 000 éléments. Une comparaison personnalisée qui parcourt les données aurait un coût différent.</p>
      <p>Un composant qui se réexécute souvent avec les mêmes props et dont le rendu coûte cher est un candidat à examiner. Ce sont des indices, pas une preuve. memo ne bloque toujours pas ses mises à jour d’état ou de contexte.</p>
      <h3>8. Comment vérifier le gain sans décider au hasard ?</h3>
      <p>Mesurez une interaction complète avec et sans memo, dans les mêmes conditions. Il n’est pas nécessaire d’isoler le coût de chaque comparaison : le résultat utile est le travail total économisé sur cette interaction, y compris dans les descendants.</p>
      <ol>
        <li>Choisissez une interaction reproductible : saisir le même texte, ouvrir une liste ou modifier un filtre.</li>
        <li>Enregistrez-la sans memo et repérez les composants rendus ainsi que leur durée de rendu.</li>
        <li>Ajoutez memo. Stabilisez les props qui le nécessitent, avec useCallback pour une fonction, puis rejouez la même interaction.</li>
        <li>Répétez plusieurs fois et comparez les durées. Moins de rendus ne prouve pas à lui seul que l’interaction est plus rapide.</li>
      </ol>
      <p>Le bilan est approximativement : coût des rendus évités moins coût des comparaisons ajoutées. Si l’écart reste dans les variations entre les mesures, le bénéfice n’est pas démontré. Il n’existe pas de seuil universel en nombre de props ou en lignes de JSX.</p>
      <h3>9. Où voit-on les résultats du Profiler ?</h3>
      <p><strong>Dans React DevTools :</strong> installez l’extension React Developer Tools dans votre navigateur, ouvrez votre application, puis les outils de développement avec F12. Sélectionnez l’onglet Profiler, démarrez l’enregistrement, effectuez l’interaction puis arrêtez l’enregistrement. Cet onglet affiche les mises à jour enregistrées, les composants rendus et leurs durées.</p>
      <p><strong>Avec le composant React Profiler :</strong> les mesures sont envoyées à la fonction onRender de votre code. Il n’affiche aucun panneau automatiquement. Voici un exemple à placer autour de la partie à mesurer :</p>
      <pre><code>{`import { Profiler } from 'react';

<Profiler
  id="Liste"
  onRender={(id, phase, actualDuration) => {
    console.log({ id, phase, dureeMs: actualDuration });
  }}
>
  <Liste />
</Profiler>`}</code></pre>
      <p>Avec ce code, les résultats apparaissent dans la console du navigateur. actualDuration mesure le temps de rendu de cette partie de l’arbre pour la mise à jour ; ce n’est pas la durée complète entre le clic et l’affichage à l’écran.</p>
      <p>Le mode développement et Strict Mode peuvent fausser les comparaisons avec l’usage réel. Pour une mesure représentative, utilisez une compilation de production avec le profilage activé : le Profiler est désactivé dans une compilation de production ordinaire. Les compteurs du laboratoire montrent le mécanisme de memo ; ils ne mesurent pas un gain de vitesse.</p>
      <p>Références : <a href="https://react.dev/reference/react/memo">memo</a>, <a href="https://react.dev/reference/react/useCallback">useCallback</a> et <a href="https://react.dev/reference/react/Profiler">Profiler</a>, documentation React.</p>
    </div>
  );
}
