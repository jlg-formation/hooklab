import memoExample from "./MemoExample.tsx?raw";

// Each snippet is a complete App.tsx for a React 19.2 + TypeScript project.
export const examples: Record<string, string> = {
  regles: `import { useState } from 'react';

export default function App() {
  // Toujours appeler les hooks avant un éventuel retour conditionnel.
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>Les règles des hooks</h1>
      <button onClick={() => setVisible(v => !v)} aria-expanded={visible}>
        {visible ? 'Masquer' : 'Afficher'} le compteur
      </button>
      {visible && (
        <section>
          <p>Compteur : {count}</p>
          <button onClick={() => setCount(c => c + 1)}>Ajouter 1</button>
        </section>
      )}
      <p>Masquer le compteur conserve son état : App reste monté.</p>
    </main>
  );
}`,
  useState: `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [profile, setProfile] = useState({ name: 'Ada', active: true });

  function addThreeDirectly() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1); // Trois fois la même valeur : seulement +1.
  }

  function addThree() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1); // Les mises à jour se composent : +3.
  }

  return (
    <main>
      <h1>Bonjour {profile.name}</h1>
      <label>Prénom : <input value={profile.name} onChange={event => {
        const name = event.target.value;
        setProfile(previous => ({ ...previous, name }));
      }} /></label>
      <p>Compteur : {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={addThreeDirectly}>Trois setters directs</button>
      <button onClick={addThree}>Trois mises à jour fonctionnelles</button>
      <button onClick={() => setCount(0)}>Réinitialiser</button>
    </main>
  );
}`,
  useRef: `import { useRef, useState } from 'react';

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const clicks = useRef(0);
  const [snapshot, setSnapshot] = useState(0);

  return (
    <main>
      <h1>Une référence sans nouveau rendu</h1>
      <label>Votre prénom : <input ref={inputRef} /></label>
      <button onClick={() => inputRef.current?.focus()}>Donner le focus</button>
      <button onClick={() => { clicks.current += 1; }}>
        Incrémenter la ref (sans rendu)
      </button>
      <button onClick={() => setSnapshot(clicks.current)}>
        Lire la ref et actualiser l’écran
      </button>
      <p>Dernière valeur relevée : {snapshot}</p>
      <p>Cliquez plusieurs fois sur « Incrémenter », puis lisez la ref.</p>
    </main>
  );
}`,
  useId: `import { useId } from 'react';

function EmailField({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" aria-describedby={id + '-help'} />
      <p id={id + '-help'}>Utilisez une adresse professionnelle.</p>
      <small>Identifiant de cette instance : {id}</small>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <h1>Deux champs, deux identifiants</h1>
      <EmailField label="Adresse du contact principal" />
      <EmailField label="Adresse du second contact" />
      <p>Cliquez sur chaque label : il active uniquement son propre champ.</p>
    </main>
  );
}`,
  useReducer: `import { useReducer } from 'react';

type Action = { type: 'add' } | { type: 'remove' };

function reducer(quantity: number, action: Action): number {
  switch (action.type) {
    case 'add': return quantity + 1;
    case 'remove': return Math.max(0, quantity - 1);
  }
}

export default function App() {
  const [quantity, dispatch] = useReducer(reducer, 0);
  const total = quantity * 12; // Valeur dérivée, sans deuxième état.

  return (
    <main>
      <h1>Mon panier</h1>
      <p>Carnet : 12 € l’unité</p>
      <p>Quantité : {quantity} · Total : {total} €</p>
      <button onClick={() => dispatch({ type: 'add' })}>Ajouter</button>
      <button disabled={quantity === 0}
        onClick={() => dispatch({ type: 'remove' })}>Retirer</button>
    </main>
  );
}`,
  useContext: `import { createContext, useContext, useState } from 'react';

type Theme = 'clair' | 'sombre';
const ThemeContext = createContext<Theme>('clair');

function Preview() {
  const theme = useContext(ThemeContext);
  return (
    <section style={{ padding: 24,
      background: theme === 'clair' ? '#f1f5f9' : '#172033',
      color: theme === 'clair' ? '#172033' : '#f1f5f9' }}>
      Thème lu dans le contexte : {theme}
    </section>
  );
}

function Panel() {
  return <Preview />; // Aucune prop theme à transmettre.
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('clair');
  return (
    <ThemeContext value={theme}>
      <h1>Un thème partagé</h1>
      <button onClick={() => setTheme(t => t === 'clair' ? 'sombre' : 'clair')}>
        Changer de thème
      </button>
      <Panel />
    </ThemeContext>
  );
}`,
  custom: `import { useState } from 'react';

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return {
    count,
    increment: () => setCount(c => c + 1),
    reset: () => setCount(initial),
  };
}

export default function App() {
  const first = useCounter();
  const second = useCounter(10); // Même logique, état indépendant.
  return (
    <main>
      <h1>Deux compteurs indépendants</h1>
      <section>
        <h2>Premier : {first.count}</h2>
        <button onClick={first.increment}>+1</button>
        <button onClick={first.reset}>Revenir à 0</button>
      </section>
      <section>
        <h2>Second : {second.count}</h2>
        <button onClick={second.increment}>+1</button>
        <button onClick={second.reset}>Revenir à 10</button>
      </section>
    </main>
  );
}`,
  useEffect: `import { useEffect, useState } from 'react';

export default function App() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setSeconds(s => s + 1), 1000);
    // Nettoyage à l’arrêt et au démontage, y compris en Strict Mode.
    return () => clearInterval(timer);
  }, [active]);

  return (
    <main>
      <h1>Un minuteur avec nettoyage</h1>
      <p role="status">Temps écoulé : {seconds} s</p>
      <button onClick={() => setActive(a => !a)}>
        {active ? 'Mettre en pause' : 'Démarrer'}
      </button>
      <button onClick={() => { setActive(false); setSeconds(0); }}>
        Réinitialiser
      </button>
    </main>
  );
}`,
  useEffectEvent: `import { useEffect, useEffectEvent, useState } from 'react';

// Nécessite React 19.2 ou une version ultérieure.
export default function App() {
  const [room, setRoom] = useState('Général');
  const [theme, setTheme] = useState('clair');
  const [messages, setMessages] = useState<string[]>([]);

  const onMessage = useEffectEvent((connectedRoom: string) => {
    // Lit le thème actuel sans redémarrer l’abonnement.
    setMessages(items => [...items.slice(-9),
      'Notification de ' + connectedRoom + ' · thème ' + theme]);
  });

  useEffect(() => {
    setMessages(items => [...items.slice(-9), 'Connexion à ' + room]);
    const timer = setInterval(() => onMessage(room), 2500);
    return () => clearInterval(timer);
  }, [room]);

  return (
    <main>
      <h1>Notifications de la salle</h1>
      <label>Salle : <select value={room} onChange={e => setRoom(e.target.value)}>
        <option>Général</option><option>React</option>
      </select></label>
      <button onClick={() => setTheme(t => t === 'clair' ? 'sombre' : 'clair')}>
        Thème : {theme}
      </button>
      <p>Un message toutes les 2,5 secondes. Changez le thème entre deux messages.</p>
      <ul aria-live="polite">{messages.map((message, i) => <li key={i}>{message}</li>)}</ul>
    </main>
  );
}`,
  useLayoutEffect: `import { useLayoutEffect, useRef, useState } from 'react';

export default function App() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(240);
  const [measured, setMeasured] = useState(0);

  useLayoutEffect(() => {
    setMeasured(box.current?.getBoundingClientRect().width ?? 0);
  }, [width]);

  return (
    <main>
      <h1>Mesurer avant l’affichage</h1>
      <label>Largeur : <input type="range" min="160" max="400"
        value={width} onChange={e => setWidth(Number(e.target.value))} /></label>
      <div ref={box} style={{ width, padding: 16, boxSizing: 'border-box',
        background: '#e0e7ff', color: '#172033' }}>
        Cette carte est mesurée après sa mise à jour dans le DOM.
      </div>
      <p>Largeur mesurée : {measured} px</p>
    </main>
  );
}`,
  useImperativeHandle: `import { useImperativeHandle, useRef } from 'react';
import type { Ref } from 'react';

type Handle = { focus(): void; select(): void };

function Field({ ref }: { ref: Ref<Handle> }) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => input.current?.focus(),
    select: () => input.current?.select(),
  }), []);
  return <label>Message : <input ref={input} defaultValue="Bonjour React" /></label>;
}

export default function App() {
  const field = useRef<Handle>(null);
  return (
    <main>
      <h1>Commander un champ enfant</h1>
      <Field ref={field} />
      <button onClick={() => field.current?.focus()}>Donner le focus</button>
      <button onClick={() => field.current?.select()}>Sélectionner le texte</button>
      <p>Le parent accède uniquement aux deux méthodes exposées.</p>
    </main>
  );
}`,
  useMemo: memoExample,
  useCallback: `import { memo, useCallback, useState } from 'react';

const Child = memo(function Child({ onAdd }: { onAdd: () => void }) {
  return <button onClick={onAdd}>Ajouter au compteur enfant</button>;
});

export default function App() {
  const [parent, setParent] = useState(0);
  const [count, setCount] = useState(0);
  const add = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Setter stable ; aucun état du rendu lu dans le callback.

  return (
    <main>
      <h1>Une fonction stable pour un enfant mémorisé</h1>
      <button onClick={() => setParent(p => p + 1)}>Rendre le parent : {parent}</button>
      <p>Compteur enfant : {count}</p>
      <Child onAdd={add} />
      <p>Dans le Profiler React, comparez les mises à jour du parent et de Child.</p>
      <p>La prop onAdd garde son identité entre les rendus du parent.</p>
    </main>
  );
}`,
  useTransition: `import { memo, useState, useTransition } from 'react';

const items = Array.from({ length: 300 }, (_, i) => 'Carte ' + (i + 1));

function SlowCard({ label }: { label: string }) {
  // Coût artificiel réservé à cette démonstration, par composant.
  const start = performance.now();
  while (performance.now() - start < 1) { /* simulation du rendu */ }
  return <li>{label}</li>;
}

const Results = memo(function Results({ query }: { query: string }) {
  return <ul>{items.filter(item => item.toLowerCase().includes(query.toLowerCase()))
    .map(item => <SlowCard key={item} label={item} />)}</ul>;
});

export default function App() {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [pending, startTransition] = useTransition();
  return (
    <main>
      <h1>Une saisie prioritaire</h1>
      <label>Filtrer : <input value={text} onChange={e => {
        const value = e.target.value;
        setText(value); // Le champ est mis à jour en priorité.
        startTransition(() => setQuery(value));
      }} /></label>
      <p role="status">{pending ? 'Mise à jour des résultats…' : 'Résultats à jour'}</p>
      <section aria-busy={pending}><Results query={query} /></section>
    </main>
  );
}`,
  useDeferredValue: `import { memo, useDeferredValue, useState } from 'react';

const items = Array.from({ length: 300 }, (_, i) => 'Produit ' + (i + 1));

function SlowItem({ label }: { label: string }) {
  // Coût artificiel pour rendre le décalage perceptible.
  const start = performance.now();
  while (performance.now() - start < 1) { /* simulation du rendu */ }
  return <li>{label}</li>;
}

const Results = memo(function Results({ query }: { query: string }) {
  return <ul>{items.filter(item => item.toLowerCase().includes(query.toLowerCase()))
    .map(item => <SlowItem key={item} label={item} />)}</ul>;
});

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const stale = query !== deferredQuery;
  return (
    <main>
      <h1>Différer les résultats</h1>
      <label>Recherche : <input value={query}
        onChange={e => setQuery(e.target.value)} /></label>
      <p>Saisie : {query} · Filtre affiché : {deferredQuery}</p>
      <p role="status">{stale ? 'Actualisation… anciens résultats affichés' : 'À jour'}</p>
      <section aria-busy={stale} style={{ opacity: stale ? 0.5 : 1 }}>
        <Results query={deferredQuery} />
      </section>
    </main>
  );
}`,
  useActionState: `import { useActionState } from 'react';

type Result = { message: string; ok: boolean };

// Simulation locale : aucune API ni configuration serveur nécessaire.
async function saveName(name: string, fail: boolean) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (fail) throw new Error('La sauvegarde a échoué. Réessayez.');
  return 'Bonjour ' + name + ' !';
}

async function submitName(_previous: Result, data: FormData): Promise<Result> {
  const name = String(data.get('name') ?? '').trim();
  if (name.length < 2) return { message: 'Deux caractères minimum.', ok: false };
  try {
    const message = await saveName(name, data.get('fail') === 'on');
    return { message, ok: true };
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Erreur inconnue.', ok: false };
  }
}

export default function App() {
  const [result, submit, pending] = useActionState(submitName, { message: '', ok: false });
  return (
    <main>
      <h1>Enregistrer un prénom</h1>
      <form action={submit}>
        <fieldset disabled={pending}>
          <label>Prénom : <input name="name" defaultValue="Ada" /></label>
          <label><input name="fail" type="checkbox" /> Simuler une erreur</label>
          <button type="submit">{pending ? 'Enregistrement…' : 'Enregistrer'}</button>
        </fieldset>
      </form>
      <p role="status" style={{ color: result.ok ? 'green' : 'crimson' }}>{result.message}</p>
    </main>
  );
}`,
  useOptimistic: `import { useOptimistic, useState, useTransition } from 'react';

type Message = { id: string; text: string; pending?: boolean };

async function saveMessage(fail: boolean) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (fail) throw new Error('Envoi impossible : le message n’a pas été enregistré.');
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();
  const [optimistic, addOptimistic] = useOptimistic(messages,
    (current, message: Message) => current.some(item => item.id === message.id)
      ? current : [...current, { ...message, pending: true }]);

  function send(data: FormData) {
    const text = String(data.get('text') ?? '').trim();
    if (!text) { setError('Saisissez un message.'); return; }
    const message = { id: crypto.randomUUID(), text };
    const fail = data.get('fail') === 'on';
    setError('');
    startTransition(async () => {
      addOptimistic(message);
      try {
        await saveMessage(fail);
        startTransition(() => setMessages(current => [...current, message]));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue.');
      }
    });
  }

  return (
    <main>
      <h1>Une messagerie optimiste</h1>
      <form action={send}>
        <fieldset disabled={pending}>
          <label>Message : <input name="text" required /></label>
          <label><input name="fail" type="checkbox" /> Simuler un échec</label>
          <button type="submit">{pending ? 'Envoi…' : 'Envoyer'}</button>
        </fieldset>
      </form>
      <p role="alert">{error}</p>
      <ul aria-live="polite">{optimistic.map(message => (
        <li key={message.id}>{message.text}{message.pending ? ' (Envoi…)' : ' ✓'}</li>
      ))}</ul>
    </main>
  );
}`,
  useSyncExternalStore: `import { useSyncExternalStore } from 'react';

// Source de vérité extérieure à React, partagée entre les lecteurs.
let value = 0;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
const getSnapshot = () => value;
const getServerSnapshot = () => 0;

function increment() {
  value += 1;
  listeners.forEach(listener => listener());
}

function Reader({ label }: { label: string }) {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <p>{label} : {count}</p>;
}

export default function App() {
  return (
    <main>
      <h1>Deux lecteurs du même store</h1>
      <Reader label="Premier lecteur" />
      <Reader label="Second lecteur" />
      <button onClick={increment}>Modifier le store externe</button>
    </main>
  );
}`,
  useDebugValue: `import { useDebugValue, useState } from 'react';

function useConnectionDebug() {
  const [online, setOnline] = useState(true);
  useDebugValue(online, value => value ? 'Connecté' : 'Hors ligne');
  return [online, setOnline] as const;
}

export default function App() {
  const [online, setOnline] = useConnectionDebug();
  return (
    <main>
      <h1>Inspecter un hook personnalisé</h1>
      <p role="status">Statut simulé : {online ? 'Connecté' : 'Hors ligne'}</p>
      <button onClick={() => setOnline(value => !value)}>Changer le statut</button>
      <p>Dans React DevTools, sélectionnez App et inspectez ConnectionDebug.</p>
      <p>Son étiquette vient de useDebugValue ; le texte de cette page vient de l’état.</p>
    </main>
  );
}`,
  useInsertionEffect: `import { useId, useInsertionEffect, useState } from 'react';

export default function App() {
  const [color, setColor] = useState('#6958db');
  const id = useId();

  useInsertionEffect(() => {
    const style = document.createElement('style');
    // Identifiant propre à cette instance ; aucune ref DOM à lire ici.
    style.textContent = '[data-insertion-id="' + CSS.escape(id) + '"] { color: ' + color + '; }';
    document.head.append(style);
    return () => style.remove();
  }, [id, color]);

  return (
    <main>
      <h1>Insérer une règle de style</h1>
      <label>Couleur : <input type="color" value={color}
        onChange={e => setColor(e.target.value)} /></label>
      <p data-insertion-id={id}>Ce texte reçoit la règle CSS injectée.</p>
      <p>Outil spécialisé pour les bibliothèques de styles.</p>
      <p>Dans une application, préférez simplement <code>{'style={{ color }}'}</code>.</p>
    </main>
  );
}`,
};
