import { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const stages = [
  { title: 'Demander', phase: 'ÉVÉNEMENT', text: 'Le clic appelle setCount(c => c + 1). React met la fonction de mise à jour en file. Dans ce gestionnaire, count conserve la valeur du rendu qui a créé la fonction.', code: 'setCount(c => c + 1); // prochain état : 1', note: 'Le setter demande un rendu. Il ne modifie ni la variable locale ni immédiatement les pixels.' },
  { title: 'Exécuter', phase: 'RENDER · REACT', text: 'React traite les mises à jour et rappelle le composant avec count = 1. Le composant produit une nouvelle description JSX. Les corps des effets ne sont pas exécutés pendant ce calcul.', code: 'Counter() → <button>1</button>', note: 'Le rendu doit rester pur. En mode concurrent, un travail de rendu peut être interrompu, repris ou abandonné.' },
  { title: 'Réconcilier', phase: 'RENDER · REACT', text: 'React compare la nouvelle description à la précédente : mêmes type, position et clé ? Il peut conserver le composant et son état. Ici, seul le texte du bouton doit changer.', code: '<button>0</button> → <button>1</button>', note: 'La réconciliation fait partie du rendu. Un nouveau JSX ne signifie pas un nouveau nœud DOM.' },
  { title: 'Appliquer', phase: 'COMMIT · REACT', text: 'React applique les mutations nécessaires au DOM. Au premier montage, il insère les nœuds ; ici, il met à jour un texte. Le navigateur n’a pas encore nécessairement affiché ce changement.', code: 'DOM : texte « 0 » → texte « 1 »', note: 'useInsertionEffect intervient dans le commit, avant les effets de layout. Son ordre par rapport aux mutations du DOM n’est pas garanti : ne pas y lire le DOM ou les refs.' },
  { title: 'Mesurer', phase: 'COMMIT · LAYOUT', text: 'Le DOM mis à jour est accessible aux effets de layout. Si [count] a changé, React nettoie l’ancien useLayoutEffect puis exécute le nouveau. On peut mesurer et ajuster une position avant le paint.', code: 'cleanup layout(0) → setup layout(1)', note: 'useLayoutEffect et les mises à jour qu’il programme bloquent l’affichage. Une mise à jour ici provoque aussi l’exécution immédiate des effets restants, dont useEffect.' },
  { title: 'Afficher', phase: 'PAINT · NAVIGATEUR', text: 'Le navigateur calcule les styles et la disposition nécessaires, puis peint les pixels. L’utilisateur voit maintenant le compteur à 1.', code: 'Écran : 0 → 1', note: 'DOM et écran sont distincts. React gère le commit ; le navigateur gère l’affichage.' },
  { title: 'Synchroniser', phase: 'EFFETS PASSIFS', text: 'Si [count] a changé, React nettoie l’ancien useEffect puis exécute le nouveau : abonnement, connexion ou synchronisation avec un système externe.', code: 'cleanup effect(0) → setup effect(1)', note: 'Position habituelle, pas garantie : après une interaction, useEffect peut passer avant le paint. Il faut useLayoutEffect si le travail doit bloquer l’affichage.' },
];

const questions = [
  ['Pourquoi count reste à 0 juste après setCount ?', 'Un rendu est un instantané. Le gestionnaire courant lit toujours cet instantané ; le prochain rendu recevra la nouvelle valeur. Même principe avec const [name, setName] = useState("Ada") et setName("Grace").'],
  ['Trois appels au setter produisent-ils trois rendus ?', 'React regroupe les mises à jour (batching). Trois setCount(count + 1) demandent la même valeur à partir du même instantané ; trois setCount(c => c + 1) composent les mises à jour et ajoutent 3. Deux clics distincts restent deux interactions distinctes.'],
  ['Un composant se rend-il seulement quand son état change ?', 'Il peut aussi être rendu quand son parent se rend ou qu’un contexte qu’il lit change. Les optimisations peuvent éviter certains rendus. Un rendu peut produire exactement le même DOM.'],
  ['Et si je donne la même valeur au setter ?', 'React peut ignorer la mise à jour si Object.is compare la nouvelle valeur égale à la précédente. Il peut parfois appeler le composant avant de renoncer au travail : compter les appels de fonction ne mesure pas les changements visibles.'],
  ['Que se passe-t-il au montage et au démontage ?', 'Au montage, React calcule puis insère le DOM et lance les setups des effets côté client. Au démontage, il retire le DOM et nettoie les effets : le nettoyage de layout intervient avant le retrait du DOM ; celui des effets passifs intervient ensuite. Un changement de clé ou de type peut provoquer un démontage puis un nouveau montage et réinitialiser l’état.'],
  ['Pourquoi les logs apparaissent-ils deux fois en développement ?', 'Strict Mode rappelle les fonctions de rendu et vérifie les effets avec un cycle setup → cleanup → setup supplémentaire en développement, selon son emplacement dans l’arbre. useEffect et useLayoutEffect sont concernés ; useInsertionEffect n’a pas ce rejeu supplémentaire. Ce n’est pas le déroulement de production.'],
  ['Pourquoi mon effet tourne-t-il en boucle ?', 'Un effet qui modifie un état dont dépendent ses propres dépendances peut se redéclencher. Les objets et fonctions recréés à chaque rendu peuvent aussi changer les dépendances. Une valeur dérivable des props ou de l’état se calcule généralement pendant le rendu, sans effet.'],
  ['Et sur le serveur ?', 'Le serveur peut calculer du HTML, mais aucun de ces trois effets ne s’y exécute. Ils s’exécutent côté client. L’hydratation rattache React au HTML existant ; elle n’est pas une reconstruction systématique de toute la page.'],
];

export default function Lifecycle() {
  const [step, setStep] = useState(0);
  const current = stages[step];
  return <div className="lifecycle">
    <div className="lc-heading"><div><span className="eyebrow">DU CLIC AUX PIXELS</span><h3>Un compteur. Sept repères.</h3></div><span className="lc-chip">count : 0 <ArrowRight size={14} /> 1</span></div>
    <p>Explorez les étapes dans l’ordre ou cliquez sur une étape. Le composant est déjà monté ; les trois effets de cet exemple dépendent de <code>[count]</code>.</p>
    <p className="lc-map-caption">Une seule chronologie : chaque phase regroupe ses étapes numérotées.</p>
    <nav className="lc-timeline" aria-label="Étapes du changement d’état">
      {[
        { label: 'Déclenchement', range: 'Étape 1', indices: [0], tone: 'event' },
        { label: 'Render', range: 'Étapes 2–3', indices: [1, 2], tone: 'render' },
        { label: 'Commit', range: 'Étapes 4–5', indices: [3, 4], tone: 'commit' },
        { label: 'Paint', range: 'Étape 6', indices: [5], tone: 'paint' },
        { label: 'Effet passif', range: 'Étape 7*', indices: [6], tone: 'effect' },
      ].map(group => <div key={group.tone} className={'lc-phase lc-phase-' + group.tone}>
        <div className="lc-phase-label"><strong>{group.label}</strong><small>{group.range}</small></div>
        <div className="lc-phase-steps">{group.indices.map(i => <button key={i} className={step === i ? 'active' : ''} onClick={() => setStep(i)} aria-current={step === i ? 'step' : undefined}><b>{String(i + 1).padStart(2, '0')}</b><span>{stages[i].title}</span></button>)}</div>
      </div>)}
    </nav>
    <p className="lc-timing-note">* L’effet passif est placé ici après le paint pour illustrer le cas habituel. Après une interaction, il peut s’exécuter avant le paint.</p>
    <div className="lc-detail" aria-live="polite"><span className="eyebrow">{current.phase}</span><h3>{step + 1}. {current.title}</h3><p>{current.text}</p><pre><code>{current.code}</code></pre><div className="lc-note">{current.note}</div></div>
    <div className="lc-snapshots">
      <div><small>ÉTAT DU RENDU</small><strong>count = {step >= 1 ? 1 : 0}</strong><span>{step === 0 ? 'Mise à jour en attente' : 'Nouvel instantané'}</span></div>
      <div><small>DOM</small><strong><code>&lt;button&gt;{step >= 3 ? 1 : 0}&lt;/button&gt;</code></strong><span>{step >= 3 ? 'Mutation appliquée' : 'Ancien texte'}</span></div>
      <div><small>ÉCRAN</small><strong className="lc-screen">{step >= 5 ? 1 : 0}</strong><span>{step >= 5 ? 'Nouveaux pixels' : 'Dernier affichage'}</span></div>
    </div>
    <div className="lc-controls"><button onClick={() => setStep(0)} aria-label="Recommencer le schéma"><RotateCcw size={15}/></button><button disabled={step === 0} onClick={() => setStep(s => s - 1)}><ChevronLeft size={15}/> Précédent</button><span>{step + 1} / {stages.length}</span><button disabled={step === stages.length - 1} onClick={() => setStep(s => s + 1)}>Étape suivante <ChevronRight size={15}/></button></div>
    <p className="lc-disclaimer">Simulation pédagogique : ces étapes sont étalées pour les comprendre. Ce schéma ne ralentit pas React et ne mesure pas le timing réel du navigateur. Le placement de l’effet passif après le paint illustre le cas habituel.</p>
    <h3>Les trois effets, au bon endroit</h3>
    <div className="table-wrap"><table><thead><tr><th>Hook</th><th>Repère garanti</th><th>Pourquoi ?</th></tr></thead><tbody>
      <tr><td><code>useInsertionEffect</code></td><td>Commit, avant les effets de layout ; DOM pas nécessairement prêt.</td><td>Injection de styles par les bibliothèques CSS-in-JS. Pas de mise à jour d’état.</td></tr>
      <tr><td><code>useLayoutEffect</code></td><td>Setup après les mutations du DOM, avant le paint.</td><td>Mesurer et positionner sans scintillement. Bloque l’affichage.</td></tr>
      <tr><td><code>useEffect</code></td><td>Après le commit, généralement après le paint.</td><td>Synchroniser avec l’extérieur. Peut précéder le paint après un clic.</td></tr>
    </tbody></table></div>
    <h3>Quand un effet recommence-t-il ?</h3>
    <div className="lc-deps"><div><code>Sans tableau</code><p>Après chaque commit du composant.</p></div><div><code>[]</code><p>Au montage, puis nettoyage au démontage.*</p></div><div><code>[count]</code><p>Au montage, puis si count change selon Object.is.</p></div></div>
    <div className="lc-cleanup"><span>Ancien setup · count = 0</span><ArrowRight size={16}/><span>Cleanup · count = 0</span><ArrowRight size={16}/><span>Nouveau setup · count = 1</span></div>
    <p className="small muted">Les dépendances ne déclenchent pas un rendu : elles décident si l’effet doit être resynchronisé après un commit. Si seul name change, un effet dépendant de [count] ne recommence pas. Le cleanup capture les anciennes valeurs. * Voir Strict Mode ci-dessous. Pour useInsertionEffect, cleanup et setup sont entrelacés composant par composant.</p>
    <h3>Les questions qui débloquent le modèle mental</h3>
    <div className="lc-faq">{questions.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    <div className="lc-sources">Pour approfondir : <a href="https://react.dev/learn/render-and-commit" target="_blank" rel="noreferrer">Render et commit</a> · <a href="https://react.dev/reference/react/useEffect" target="_blank" rel="noreferrer">useEffect</a> · <a href="https://react.dev/reference/react/useLayoutEffect" target="_blank" rel="noreferrer">useLayoutEffect</a> · <a href="https://react.dev/reference/react/useInsertionEffect" target="_blank" rel="noreferrer">useInsertionEffect</a></div>
  </div>;
}
