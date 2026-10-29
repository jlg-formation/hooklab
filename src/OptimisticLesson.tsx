export default function OptimisticLesson() {
  return (
    <div>
      <h3>1. Un clic doit se voir tout de suite</h3>
      <p>Imaginez une publication sur Facebook avec 12 mentions J’aime. Vous cliquez sur J’aime : le compteur passe immédiatement à 13. Pourtant, enregistrer ce like sur le serveur prend du temps.</p>
      <p>Si on attend la réponse avant de changer le bouton, l’écran semble ne pas réagir. Cliquer plusieurs fois devient tentant. useOptimistic permet de montrer le résultat attendu pendant cette attente.</p>
      <h3>2. Deux valeurs, deux rôles</h3>
      <p><code>likes</code> est le nombre confirmé par le serveur, initialement 12. <code>optimisticLikes</code> est le nombre affiché. Au repos, ils sont identiques. Pendant la requête, on affiche temporairement 13, même si likes vaut encore 12.</p>
      <h3>3. Une Action délimite cette anticipation</h3>
      <p>Dans <code>startTransition(async () =&gt; …)</code>, on appelle d’abord <code>setOptimisticLikes(likes + 1)</code>, puis on attend la sauvegarde avec <code>await</code>. Cette fonction asynchrone est une Action. React suit sa promesse : tant qu’elle est en cours, la valeur optimiste peut être affichée. Le hook n’accélère pas le réseau ; il rend l’interface réactive.</p>
      <h3>4. Si le serveur confirme</h3>
      <p>Après la réussite de la requête, notre code appelle <code>setLikes(13)</code>. Le nombre confirmé devient 13. Quand l’Action se termine, React retire la valeur temporaire et affiche cette base mise à jour : le compteur reste à 13.</p>
      <h3>5. Si le serveur refuse</h3>
      <p>La requête signale une erreur, que notre code intercepte dans <code>catch</code> pour afficher une explication. On ne modifie pas likes : il vaut toujours 12. Lorsque l’Action se termine, React retire automatiquement la valeur optimiste. Le compteur revient à 12, sans écrire un second setter pour annuler l’optimisme.</p>
      <p>React ne devine donc pas l’erreur du serveur : c’est notre appel réseau qui la signale. React sait quand l’Action se termine et revient alors à la valeur de base actuelle. Ici, comme elle n’a pas changé, on retrouve l’état d’avant. Si d’autres données confirmées avaient changé entre-temps, ce serait cette base plus récente qui ferait référence.</p>
      <h3>6. Pourquoi ne pas utiliser seulement useState ?</h3>
      <p>Avec useState seul, modifier immédiatement likes obligerait à gérer soi-même le retour en arrière en cas d’échec. useOptimistic garde cette anticipation temporaire séparée de l’état confirmé. Il ne sauvegarde rien lui-même et ne gère pas le message d’erreur à notre place.</p>
      <p>Dans cet exemple pédagogique, chaque clic ajoute un like. Le bouton est désactivé pendant la requête pour suivre une opération à la fois. Après une confirmation, le clic suivant fait passer le compteur de 13 à 14, et ainsi de suite.</p>
      <h3>7. Lire le code ci-dessous</h3>
      <p><code>useOptimistic(likes)</code> renvoie deux éléments : <code>optimisticLikes</code>, le nombre à afficher dans le compteur, et <code>setOptimisticLikes</code>, la fonction qui propose un nombre temporaire pendant l’Action. Ici, aucune fonction de calcul supplémentaire n’est nécessaire : on lui donne simplement le prochain nombre.</p>
      <p><code>useTransition</code> fournit <code>startTransition</code> pour lancer l’Action, et <code>pending</code> pour désactiver le bouton pendant son exécution. Le second startTransition, après await, garde la confirmation dans une transition : avec cette version de React, il faut à nouveau entourer la mise à jour après une attente asynchrone.</p>
      <p>Le composant est autonome : copiez tout l’extrait dans un fichier TSX d’une application React 19. La fonction <code>saveLike</code> simule seulement l’attente du serveur et son éventuel échec. La case à cocher permet de tester ce dernier cas ; dans une application réelle, cette fonction serait remplacée par un appel à votre API. Le compteur suit exactement les trois étapes de la démo : augmenter tout de suite, attendre, puis conserver le nombre ou revenir au précédent.</p>
      <p><a href="https://react.dev/reference/react/useOptimistic" target="_blank" rel="noreferrer">Documentation officielle React : useOptimistic</a></p>
    </div>
  );
}
