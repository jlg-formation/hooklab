import {
  createContext,
  memo,
  useActionState,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import type { Ref } from "react";
import {
  ArrowUpRight,
  Check,
  Minus,
  Plus,
  Send,
  Wifi,
  WifiOff,
} from "lucide-react";
import { request } from "./network";
import type { NetworkOptions } from "./network";
function Metric({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
function CounterDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState({ first: "Ada", last: "Lovelace" });
  return (
    <>
      <div className="counter">
        <button aria-label="Retirer un" onClick={() => setCount((c) => c - 1)}>
          <Minus size={20} />
        </button>
        <Metric value={count} label="Valeur de l’état" />
        <button aria-label="Ajouter un" onClick={() => setCount((c) => c + 1)}>
          <Plus size={20} />
        </button>
      </div>
      <div className="button-row">
        <button
          onClick={() => {
            setCount(count + 1);
            setCount(count + 1);
            setCount(count + 1);
          }}
        >
          +3 avec la valeur
        </button>
        <button
          className="primary"
          onClick={() => {
            setCount((c) => c + 1);
            setCount((c) => c + 1);
            setCount((c) => c + 1);
          }}
        >
          +3 avec des fonctions
        </button>
      </div>
      <details className="demo-details">
        <summary>Autre exemple : mettre à jour un objet</summary>
        <label>
          Prénom
          <input
            value={name.first}
            onChange={(e) => setName((n) => ({ ...n, first: e.target.value }))}
          />
        </label>
        <p>
          Bonjour {name.first} {name.last}. Le nom est conservé grâce à la copie
          de l’objet.
        </p>
      </details>
    </>
  );
}
function RulesDemo() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="flow">
        <span>① useState(visible)</span>
        <span>② useState(count)</span>
        <span>③ JSX conditionnel</span>
      </div>
      <button className="primary" onClick={() => setVisible((v) => !v)}>
        {visible ? "Masquer" : "Afficher"} le détail
      </button>
      {visible && (
        <button onClick={() => setCount((c) => c + 1)}>
          Compteur : {count}
        </button>
      )}
      <p className="demo-note">
        L’ordre des appels reste identique. L’état est conservé lorsque le
        détail est masqué.
      </p>
    </>
  );
}
function RefDemo() {
  const input = useRef<HTMLInputElement>(null);
  const clicks = useRef(0);
  const [render, setRender] = useState(0);
  const [snapshot, setSnapshot] = useState(0);
  return (
    <>
      <label>
        Un champ à retrouver
        <input ref={input} placeholder="Le focus arrive ici…" />
      </label>
      <div className="button-row">
        <button className="primary" onClick={() => input.current?.focus()}>
          Donner le focus <ArrowUpRight size={15} />
        </button>
        <button
          onClick={() => {
            clicks.current++;
          }}
        >
          Incrémenter la ref
        </button>
        <button
          onClick={() => {
            setSnapshot(clicks.current);
            setRender((r) => r + 1);
          }}
        >
          Relever la ref et rendre
        </button>
      </div>
      <div className="metrics">
        <Metric value={snapshot} label="Ref au dernier relevé" />
        <Metric value={render} label="Rendus demandés" />
      </div>
      <p className="demo-note">
        Le bouton de relevé lit la ref dans l’événement et copie sa valeur dans
        un état affiché. Incrémenter la ref seule ne demande aucun rendu.
      </p>
    </>
  );
}
function IdField({ n }: { n: number }) {
  const id = useId();
  return (
    <div className="mini-card">
      <label htmlFor={id}>E-mail · formulaire {n}</label>
      <input
        id={id}
        type="email"
        aria-describedby={id + "-help"}
        placeholder="ada@exemple.fr"
      />
      <small id={id + "-help"}>Votre adresse professionnelle.</small>
      <code>id="{id}"</code>
    </div>
  );
}
type CartAction =
  | {
      type: "add";
    }
  | {
      type: "remove";
    };
function cartReducer(quantity: number, action: CartAction) {
  return action.type === "add" ? quantity + 1 : Math.max(0, quantity - 1);
}
function ReducerDemo() {
  const [quantity, dispatch] = useReducer(cartReducer, 0);
  const [last, setLast] = useState("Aucune action");
  function act(type: CartAction["type"]) {
    dispatch({ type });
    setLast(`{ type: '${type}' }`);
  }
  return (
    <>
      <div className="product">
        <div className="product-icon">📓</div>
        <div>
          <strong>Le carnet React</strong>
          <p>12 € / exemplaire</p>
        </div>
        <span className="quantity">× {quantity}</span>
      </div>
      <div className="button-row">
        <button onClick={() => act("remove")} disabled={!quantity}>
          <Minus size={16} /> Retirer
        </button>
        <button className="primary" onClick={() => act("add")}>
          <Plus size={16} /> Ajouter
        </button>
      </div>
      <div className="metrics">
        <Metric value={`${quantity * 12} €`} label="Total calculé" />
        <Metric value={<code>{last}</code>} label="Dernière action" />
      </div>
    </>
  );
}
type Theme = "clair" | "sombre";
const ThemeContext = createContext<Theme>("clair");
function ThemePreview() {
  const theme = useContext(ThemeContext);
  return (
    <div className={"theme-preview " + theme}>
      <span>Composant enfant</span>
      <strong>Bonjour, {theme === "clair" ? "le jour ☀" : "la nuit ☾"}</strong>
      <small>Je lis le contexte, sans prop theme.</small>
    </div>
  );
}
function ContextDemo() {
  const [theme, setTheme] = useState<Theme>("clair");
  return (
    <>
      <div className="button-row">
        <button
          onClick={() => setTheme("clair")}
          aria-pressed={theme === "clair"}
        >
          Clair
        </button>
        <button
          onClick={() => setTheme("sombre")}
          aria-pressed={theme === "sombre"}
        >
          Sombre
        </button>
      </div>
      <div className="tree-label">
        ThemeContext → Layout → Section → Preview
      </div>
      <ThemeContext value={theme}>
        <ThemePreview />
      </ThemeContext>
    </>
  );
}
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return {
    count,
    increment: () => setCount((c) => c + 1),
    reset: () => setCount(initial),
  };
}
function CustomCounter({ initial, label }: { initial: number; label: string }) {
  const c = useCounter(initial);
  return (
    <div className="mini-card">
      <Metric value={c.count} label={label} />
      <div className="button-row">
        <button className="primary" onClick={c.increment}>
          +1
        </button>
        <button onClick={c.reset}>Remettre à {initial}</button>
      </div>
    </div>
  );
}
function NetworkControls({
  value,
  onChange,
}: {
  value: NetworkOptions;
  onChange: (n: NetworkOptions) => void;
}) {
  return (
    <div className="network-controls">
      <span>
        <Wifi size={15} /> Réseau simulé · MSW
      </span>
      <label>
        Délai
        <select
          value={value.delay}
          onChange={(e) =>
            onChange({ ...value, delay: Number(e.target.value) })
          }
        >
          <option value={250}>Rapide · 250 ms</option>
          <option value={1500}>Lent · 1,5 s</option>
          <option value={3000}>Très lent · 3 s</option>
        </select>
      </label>
      <label className="check-label">
        <input
          type="checkbox"
          checked={value.fail}
          onChange={(e) => onChange({ ...value, fail: e.target.checked })}
        />{" "}
        Simuler une erreur
      </label>
    </div>
  );
}
function TimerDemo() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  useEffect(() => {
    if (!active) return;
    setLogs((l) => [...l.slice(-5), "Installation : setInterval"]);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      clearInterval(id);
      setLogs((l) => [...l.slice(-5), "Nettoyage : clearInterval"]);
    };
  }, [active]);
  return (
    <>
      <Metric
        value={`${seconds} s`}
        label={active ? "Abonnement actif" : "Minuteur arrêté"}
      />
      <button className="primary" onClick={() => setActive((a) => !a)}>
        {active ? "Arrêter et nettoyer" : "Démarrer le minuteur"}
      </button>
      <div className="event-log" aria-live="polite">
        {logs.length
          ? logs.map((l, i) => (
              <div key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {l}
              </div>
            ))
          : "Le journal des effets apparaîtra ici."}
      </div>
    </>
  );
}
function SearchDemo() {
  const [query, setQuery] = useState("");
  const [network, setNetwork] = useState<NetworkOptions>({
    delay: 1500,
    fail: false,
  });
  const [result, setResult] = useState<string[]>([]);
  const [status, setStatus] = useState("idle");
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    request<string[]>(
      "search?q=" + encodeURIComponent(query),
      network,
      controller.signal,
    )
      .then((data) => {
        setResult(data);
        setStatus("success");
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      });
    return () => controller.abort();
  }, [query, network]);
  return (
    <>
      <NetworkControls value={network} onChange={setNetwork} />
      <label>
        Rechercher un langage
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="React, TypeScript…"
        />
      </label>
      <div
        className="result-area"
        aria-live="polite"
        aria-busy={status === "loading"}
      >
        {status === "loading" ? (
          <p>Requête en cours… La précédente a été annulée.</p>
        ) : status === "error" ? (
          <p className="error-text">
            Erreur simulée. Décochez l’erreur pour réessayer.
          </p>
        ) : result.length ? (
          result.map((r) => (
            <span className="result-chip" key={r}>
              {r}
            </span>
          ))
        ) : (
          <p>Aucun résultat.</p>
        )}
      </div>
    </>
  );
}
function EffectDemo() {
  const [tab, setTab] = useState(0);
  return (
    <>
      <div className="segmented">
        <button aria-pressed={tab === 0} onClick={() => setTab(0)}>
          01 · Abonnement
        </button>
        <button aria-pressed={tab === 1} onClick={() => setTab(1)}>
          02 · Requête annulable
        </button>
      </div>
      {tab === 0 ? <TimerDemo /> : <SearchDemo />}
    </>
  );
}
function EffectEventDemo() {
  const [room, setRoom] = useState("Général");
  const [theme, setTheme] = useState("clair");
  const [logs, setLogs] = useState<string[]>([]);
  const onMessage = useEffectEvent(() =>
    setLogs((l) => [...l.slice(-5), `Notification · ${room} · thème ${theme}`]),
  );
  useEffect(() => {
    setLogs((l) => [...l.slice(-5), "Connexion à " + room]);
    const timer = setInterval(() => onMessage(), 2500);
    return () => clearInterval(timer);
  }, [room]);
  return (
    <>
      <div className="two-cols">
        <label>
          Salle
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            <option>Général</option>
            <option>Formation</option>
          </select>
        </label>
        <label>
          Thème
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option>clair</option>
            <option>sombre</option>
          </select>
        </label>
      </div>
      <p className="demo-note">
        Une notification arrive toutes les 2,5 secondes. Changez le thème sans
        changer de salle.
      </p>
      <div className="event-log" aria-live="polite">
        {logs.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </>
  );
}
function LayoutDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(240);
  const [measured, setMeasured] = useState(0);
  useLayoutEffect(() => {
    setMeasured(box.current?.getBoundingClientRect().width ?? 0);
  }, [width]);
  return (
    <>
      <label>
        Largeur demandée : {width} px
        <input
          type="range"
          min="140"
          max="300"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </label>
      <div ref={box} className="measured-box" style={{ width }}>
        Une carte mesurée<span>↔ {Math.round(measured)} px</span>
      </div>
      <p className="demo-note">
        La mesure est faite après le commit DOM, avant le paint. Ici CSS
        suffirait à dimensionner la carte.
      </p>
    </>
  );
}
type FieldHandle = {
  focus(): void;
  select(): void;
};
function ImperativeField({ ref }: { ref: Ref<FieldHandle> }) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(
    ref,
    () => ({
      focus: () => input.current?.focus(),
      select: () => input.current?.select(),
    }),
    [],
  );
  return (
    <input ref={input} aria-label="Champ enfant" defaultValue="Bonjour React" />
  );
}
function ImperativeDemo() {
  const child = useRef<FieldHandle>(null);
  return (
    <>
      <div className="mini-card">
        <small>Composant enfant</small>
        <ImperativeField ref={child} />
      </div>
      <p className="tree-label">Commandes du parent ↓</p>
      <div className="button-row">
        <button className="primary" onClick={() => child.current?.focus()}>
          focus()
        </button>
        <button onClick={() => child.current?.select()}>select()</button>
      </div>
    </>
  );
}
function expensiveFilter(query: string) {
  const start = performance.now();
  let checksum = 0;
  for (let i = 0; i < 1200000; i++) checksum += Math.sqrt(i);
  const matches = ["React", "TypeScript", "JavaScript", "HTML", "CSS"].filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()),
  );
  return { matches, ms: performance.now() - start, checksum };
}
function MemoDemo() {
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);
  const direct = expensiveFilter(query);
  const cached = useMemo(() => expensiveFilter(query), [query]);
  return (
    <>
      <label>
        Filtrer
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex. Type"
        />
      </label>
      <button className="primary" onClick={() => setCount((c) => c + 1)}>
        État indépendant : {count}
      </button>
      <div className="two-cols">
        <div className="mini-card">
          <strong>Calcul direct</strong>
          <p>{direct.ms.toFixed(2)} ms · recalculé</p>
        </div>
        <div className="mini-card">
          <strong>Avec useMemo</strong>
          <p>{cached.ms.toFixed(2)} ms · durée du dernier calcul</p>
        </div>
      </div>
      <p>{cached.matches.join(" · ") || "Aucun résultat"}</p>
      <p className="demo-note">
        Le temps mémorisé reste celui du dernier calcul, pas le temps du rendu
        actuel. Mesures indicatives ; coût artificiel et Strict Mode actifs.
      </p>
    </>
  );
}
const CallbackChild = memo(function CallbackChild({
  onAdd,
}: {
  onAdd: () => void;
}) {
  const commits = useRef(0);
  const label = useRef<HTMLSpanElement>(null);
  // Diagnostic only: update an isolated text node after each committed render.
  // No React state update, otherwise the measurement would trigger more renders.
  useLayoutEffect(() => {
    commits.current++;
    if (label.current) label.current.textContent = String(commits.current);
  });
  return (
    <>
      <button onClick={onAdd}>
        Ajouter au total <Plus size={14} />
      </button>
      <p>
        Commits : <span ref={label}>0</span>
      </p>
    </>
  );
});
function CallbackDemo() {
  const [parent, setParent] = useState(0);
  const [count, setCount] = useState(0);
  const stable = useCallback(() => setCount((c) => c + 1), []);
  return (
    <>
      <button className="primary" onClick={() => setParent((p) => p + 1)}>
        Rendu du parent : {parent}
      </button>
      <div className="two-cols">
        <div className="mini-card">
          <strong>Callback ordinaire</strong>
          <CallbackChild onAdd={() => setCount((c) => c + 1)} />
        </div>
        <div className="mini-card">
          <strong>Callback stable</strong>
          <CallbackChild onAdd={stable} />
        </div>
      </div>
      <p>Total : {count}</p>
      <p className="demo-note">
        Compteurs de commits mesurés après le rendu. Strict Mode effectue une
        vérification supplémentaire au montage en développement ; comparez les
        variations.
      </p>
    </>
  );
}
const SlowCard = memo(function SlowCard({
  index,
  query,
}: {
  index: number;
  query: string;
}) {
  const start = performance.now();
  while (performance.now() - start < 1) {
    /* artificial bounded render cost */
  }
  return (
    <span className="slow-card">
      {query || "React"} <small>#{index + 1}</small>
    </span>
  );
});
const SlowResults = memo(function SlowResults({ query }: { query: string }) {
  return (
    <div className="slow-grid">
      {Array.from({ length: 70 }, (_, i) => (
        <SlowCard key={i} index={i} query={query} />
      ))}
    </div>
  );
});
function TransitionDemo({ deferred = false }: { deferred?: boolean }) {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [pending, startTransition] = useTransition();
  const deferredText = useDeferredValue(text);
  const value = deferred ? (enabled ? deferredText : text) : query;
  const stale = deferred ? text !== value : pending;
  return (
    <>
      <label className="check-label">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />{" "}
        Activer {deferred ? "useDeferredValue" : "useTransition"}
      </label>
      <label>
        Texte urgent
        <input
          value={text}
          placeholder="Tapez rapidement…"
          onChange={(e) => {
            const next = e.target.value;
            setText(next);
            if (!deferred) {
              if (enabled) startTransition(() => setQuery(next));
              else setQuery(next);
            }
          }}
        />
      </label>
      <div className="render-status" role="status">
        <span className={stale ? "dot amber" : "dot"} />
        {stale ? "Résultats en cours de mise à jour…" : "Résultats à jour"}
        <code>valeur : "{value}"</code>
      </div>
      <div
        className="slow-viewport"
        style={{ opacity: stale ? 0.5 : 1 }}
        aria-busy={stale}
      >
        <SlowResults query={value} />
      </div>
      <p className="demo-note">
        70 composants × environ 1 ms de coût artificiel. La fluidité dépend de
        la machine et du mode de build.
      </p>
    </>
  );
}
function ActionDemo() {
  const [network, setNetwork] = useState<NetworkOptions>({
    delay: 1500,
    fail: false,
  });
  const [state, action, pending] = useActionState(
    async (
      _previous: {
        message: string;
        ok: boolean;
      },
      data: FormData,
    ) => {
      const name = String(data.get("name") ?? "").trim();
      if (name.length < 2)
        return { message: "Saisissez au moins deux caractères.", ok: false };
      try {
        await request("save", network, undefined, { name });
        return {
          message: `Bonjour ${name}, votre inscription est confirmée.`,
          ok: true,
        };
      } catch (e) {
        return {
          message: e instanceof Error ? e.message : "Erreur inattendue.",
          ok: false,
        };
      }
    },
    { message: "", ok: false },
  );
  return (
    <>
      <NetworkControls value={network} onChange={setNetwork} />
      <form action={action}>
        <label>
          Votre prénom
          <input name="name" placeholder="Ada" required />
        </label>
        <button className="primary" disabled={pending} type="submit">
          <Send size={15} />
          {pending ? "Enregistrement…" : "S’inscrire"}
        </button>
      </form>
      <p role="status" className={state.ok ? "success-text" : "error-text"}>
        {state.message || "Le résultat de l’action apparaîtra ici."}
      </p>
    </>
  );
}
type Message = {
  id: string;
  text: string;
  pending?: boolean;
};
function OptimisticDemo() {
  const [network, setNetwork] = useState<NetworkOptions>({
    delay: 1500,
    fail: false,
  });
  const [messages, setMessages] = useState<Message[]>([
    { id: "hello", text: "Bienvenue dans l’atelier !" },
  ]);
  const [optimistic, addOptimistic] = useOptimistic(
    messages,
    (current, message: Message) =>
      current.some((item) => item.id === message.id)
        ? current
        : [...current, { ...message, pending: true }],
  );
  const [error, setError] = useState("");
  const [, submit, pending] = useActionState(
    async (_: null, data: FormData) => {
      const text = String(data.get("message") ?? "").trim();
      if (!text) return null;
      const message = { id: crypto.randomUUID(), text };
      setError("");
      addOptimistic(message);
      try {
        await request("save", network, undefined, message);
        setMessages((m) => [...m, message]);
      } catch {
        setError(
          "Échec de l’envoi. Le message provisoire est retiré ; vous pouvez réessayer.",
        );
      }
      return null;
    },
    null,
  );
  return (
    <>
      <NetworkControls value={network} onChange={setNetwork} />
      <div className="messages" aria-live="polite">
        {optimistic.map((m) => (
          <div className={m.pending ? "message pending" : "message"} key={m.id}>
            <span>{m.text}</span>
            <small>
              {m.pending ? (
                "Envoi…"
              ) : (
                <>
                  <Check size={12} /> Confirmé
                </>
              )}
            </small>
          </div>
        ))}
      </div>
      <form action={submit} className="inline-form">
        <input
          name="message"
          aria-label="Votre message"
          required
          placeholder="Un message pour le groupe…"
          maxLength={180}
        />
        <button
          className="primary"
          disabled={pending}
          aria-label="Envoyer le message"
        >
          <Send size={16} />
          {pending ? "Envoi…" : "Envoyer"}
        </button>
      </form>
      <p className="error-text" role="status">
        {error}
      </p>
    </>
  );
}
let storeValue = 0;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getSnapshot = () => storeValue;
function setStore(value: number) {
  storeValue = value;
  listeners.forEach((l) => l());
}
function StoreReader({ label }: { label: string }) {
  const value = useSyncExternalStore(subscribe, getSnapshot);
  return (
    <div className="mini-card">
      <Metric value={value} label={label} />
    </div>
  );
}
function StoreDemo() {
  useEffect(() => {
    setStore(0);
    return () => setStore(0);
  }, []);
  return (
    <>
      <div className="tree-label">
        Store externe → abonnement → composants React
      </div>
      <div className="two-cols">
        <StoreReader label="Lecteur A" />
        <StoreReader label="Lecteur B" />
      </div>
      <button className="primary" onClick={() => setStore(storeValue + 1)}>
        Modifier le store externe <Plus size={15} />
      </button>
    </>
  );
}
function useConnectionDebug() {
  const [online, setOnline] = useState(true);
  useDebugValue(online, (value) => (value ? "Connecté" : "Hors ligne"));
  return [online, setOnline] as const;
}
function DebugDemo() {
  const [online, setOnline] = useConnectionDebug();
  return (
    <>
      <button className="primary" onClick={() => setOnline((v) => !v)}>
        {online ? <Wifi size={16} /> : <WifiOff size={16} />}
        {online ? "Passer hors ligne" : "Se connecter"}
      </button>
      <div className="devtools">
        <small>ILLUSTRATION · REACT DEVTOOLS</small>
        <p>▾ DebugDemo</p>
        <p>
          　▾ ConnectionDebug :{" "}
          <strong>{online ? "Connecté" : "Hors ligne"}</strong>
        </p>
        <p>　　 State : {String(online)}</p>
      </div>
      <p className="demo-note">
        Simulation de statut, sans lien avec votre connexion réelle. L’étiquette
        réelle se consulte dans l’extension React DevTools.
      </p>
    </>
  );
}
function InsertionDemo() {
  const [color, setColor] = useState("#6958db");
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const className = "insertion-" + id;
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.textContent = `.${className} { color: ${color}; }`;
    document.head.append(style);
    return () => style.remove();
  }, [color, className]);
  return (
    <>
      <div className="button-row">
        {["#6958db", "#16836a", "#c44a5c"].map((c) => (
          <button
            key={c}
            aria-label={"Couleur " + c}
            aria-pressed={color === c}
            onClick={() => setColor(c)}
          >
            <span className="swatch" style={{ background: c }} />
            {c}
          </button>
        ))}
      </div>
      <div className="insertion-preview">
        <strong className={className}>Les styles sont en place.</strong>
        <p>Une règle CSS injectée, puis nettoyée à chaque changement.</p>
      </div>
      <p className="demo-note">
        Exemple spécialisé. Une simple prop style serait préférable ici dans une
        application.
      </p>
    </>
  );
}
export function Demo({ id }: { id: string }) {
  switch (id) {
    case "regles":
      return <RulesDemo />;
    case "useState":
      return <CounterDemo />;
    case "useRef":
      return <RefDemo />;
    case "useId":
      return (
        <div className="two-cols">
          <IdField n={1} />
          <IdField n={2} />
        </div>
      );
    case "useReducer":
      return <ReducerDemo />;
    case "useContext":
      return <ContextDemo />;
    case "custom":
      return (
        <div className="two-cols">
          <CustomCounter initial={0} label="Compteur A" />
          <CustomCounter initial={10} label="Compteur B" />
        </div>
      );
    case "useEffect":
      return <EffectDemo />;
    case "useEffectEvent":
      return <EffectEventDemo />;
    case "useLayoutEffect":
      return <LayoutDemo />;
    case "useImperativeHandle":
      return <ImperativeDemo />;
    case "useMemo":
      return <MemoDemo />;
    case "useCallback":
      return <CallbackDemo />;
    case "useTransition":
      return <TransitionDemo />;
    case "useDeferredValue":
      return <TransitionDemo deferred />;
    case "useActionState":
      return <ActionDemo />;
    case "useOptimistic":
      return <OptimisticDemo />;
    case "useSyncExternalStore":
      return <StoreDemo />;
    case "useDebugValue":
      return <DebugDemo />;
    case "useInsertionEffect":
      return <InsertionDemo />;
    default:
      return null;
  }
}
