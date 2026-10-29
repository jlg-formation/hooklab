import OptimisticLesson from "./OptimisticLesson";
import { Component, useEffect, useRef, useState } from "react";
import CallbackLesson, { CallbackQuestions } from "./CallbackLesson";
import type { ErrorInfo, ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Clock3,
  Code2,
  Copy,
  ExternalLink,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Menu,
  Monitor,
  PanelLeftClose,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { groups, lessons } from "./course";
import type { Lesson } from "./course";
import { Demo } from "./demos";
function readProgress(): string[] {
  try {
    const v: unknown = JSON.parse(
      localStorage.getItem("hooklab-progress") || "[]",
    );
    return Array.isArray(v)
      ? v.filter(
          (id): id is string =>
            typeof id === "string" && lessons.some((l) => l.id === id),
        )
      : [];
  } catch {
    return [];
  }
}
function route() {
  try {
    const id = decodeURIComponent(window.location.hash.slice(1));
    return id === "introduction" || lessons.some((l) => l.id === id)
      ? id
      : "useState";
  } catch {
    return "useState";
  }
}
class DemoBoundary extends Component<
  {
    children: ReactNode;
  },
  {
    error: boolean;
  }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Démonstration", error, info.componentStack);
  }
  render() {
    return this.state.error ? (
      <div className="error-panel">
        Cette démonstration a rencontré un problème. Utilisez « Réinitialiser »
        pour la relancer.
      </div>
    ) : (
      this.props.children
    );
  }
}
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  const pattern =
    /(\/\/[^\n]*|'[^'\n]*'|"[^"\n]*"|`[^`]*`|\b(?:const|let|return|function|async|await|type|if|throw|new|switch|case|import|from|export)\b|\buse[A-Z]\w*\b|\b\d+\b)/g;
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          <Code2 size={14} /> App.tsx{" "}
          <span className="code-caption">· composant autonome</span>
        </span>
        <button onClick={copy} aria-label="Copier le code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
      <pre tabIndex={0} aria-label="Exemple TypeScript">
        <code>
          {code.split("\n").map((line, i) => (
            <span className="code-line" key={i}>
              <span className="line-no" aria-hidden="true">
                {i + 1}
              </span>
              <span>
                {line.split(pattern).map((token, j) => (
                  <span
                    key={j}
                    className={
                      token.startsWith("//")
                        ? "syntax-comment"
                        : /^['"`]/.test(token)
                          ? "syntax-string"
                          : /^use[A-Z]/.test(token)
                            ? "syntax-hook"
                            : /^(const|let|return|function|async|await|type|if|throw|new|switch|case|import|from|export)$/.test(
                                  token,
                                )
                              ? "syntax-keyword"
                              : /^\d+$/.test(token)
                                ? "syntax-number"
                                : ""
                    }
                  >
                    {token}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
      <div className="code-footer">
        Copiez ce fichier dans App.tsx d’un projet React 19.2 + TypeScript.
        Les imports, le JSX et les fonctions nécessaires sont inclus ; aucun serveur requis.
      </div>
    </div>
  );
}
function Quiz({ lesson }: { lesson: Lesson }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return (
    <div className="quiz">
      <span className="eyebrow">VÉRIFIER SA COMPRÉHENSION</span>
      <h3>{lesson.question}</h3>
      <fieldset>
        <legend className="sr-only">Choisissez une réponse</legend>
        {lesson.options.map((o, i) => (
          <label
            className={
              "quiz-option " +
              (checked && i === lesson.answer
                ? "correct"
                : checked && i === choice
                  ? "incorrect"
                  : choice === i
                    ? "selected"
                    : "")
            }
            key={o}
          >
            <input
              type="radio"
              name={"quiz-" + lesson.id}
              checked={choice === i}
              onChange={() => {
                setChoice(i);
                setChecked(false);
              }}
            />
            {o}
            {checked && i === lesson.answer && <CheckCircle2 size={17} />}
          </label>
        ))}
      </fieldset>
      <button
        className="primary"
        disabled={choice === null}
        onClick={() => setChecked(true)}
      >
        Vérifier ma réponse <ArrowRight size={15} />
      </button>
      {checked && (
        <div
          className={"feedback " + (choice === lesson.answer ? "positive" : "")}
          role="status"
        >
          <strong>
            {choice === lesson.answer
              ? "Bien vu !"
              : "Reprenons le raisonnement."}
          </strong>
          <p>{lesson.explanation}</p>
        </div>
      )}
    </div>
  );
}
function Intro({ start }: { start: () => void }) {
  const [name, setName] = useState("Ada");
  const [details, setDetails] = useState(true);
  return (
    <>
      <div className="lesson-heading">
        <span className="eyebrow">LE POINT DE DÉPART</span>
        <h1>
          Avant les hooks<span className="heading-dot">.</span>
        </h1>
        <p>Un quart d’heure pour retrouver les bons repères.</p>
        <div className="meta-row">
          <span>
            <Clock3 size={14} /> 15 min
          </span>
          <span className="level-badge">Remise à niveau</span>
          <span>React + TypeScript</span>
        </div>
      </div>
      <div className="intro-banner">
        <GraduationCap size={24} />
        <div>
          <strong>Vous connaissez déjà les composants ?</strong>
          <p>
            Parcourez ces repères, testez l’exemple, puis entrez dans le
            parcours.
          </p>
        </div>
        <button onClick={start}>
          Commencer <ArrowRight size={15} />
        </button>
      </div>
      <section id="comprendre" className="section-block">
        <h2>
          <span className="section-number">01</span> Un composant décrit une
          interface
        </h2>
        <p>
          Une fonction reçoit des props et retourne du JSX. Le parent transmet
          des données ; l’enfant les lit sans les modifier. Les événements
          relient une interaction à une fonction.
        </p>
        <div className="playground">
          <div className="playground-toolbar">
            <span>
              <span className="dot" /> DÉMONSTRATION INTERACTIVE
            </span>
          </div>
          <div className="demo-body">
            <label>
              Prop transmise au composant
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={details}
                onChange={(e) => setDetails(e.target.checked)}
              />{" "}
              Afficher la description
            </label>
            <div className="theme-preview clair">
              <strong>Bonjour {name || "…"} !</strong>
              {details && <p>Cette ligne dépend d’une condition.</p>}
            </div>
          </div>
        </div>
        <CodeBlock
          code={`type GreetingProps = { name: string; details: boolean };
function Greeting({ name, details }: GreetingProps) {
  return <article>
    <h2>Bonjour {name} !</h2>
    {details && <p>Cette ligne dépend d’une condition.</p>}
  </article>;
}`}
        />
      </section>
      <section id="experimenter" className="section-block">
        <h2>
          <span className="section-number">02</span> Un rendu est une nouvelle
          exécution
        </h2>
        <p>
          Lorsqu’un état change, React rappelle le composant, calcule le
          prochain JSX et applique les modifications nécessaires au DOM. Rendre
          le composant ne signifie pas reconstruire tout le DOM.
        </p>
        <div className="flow">
          <span>Événement</span>
          <ArrowRight size={16} />
          <span>Mise à jour d’état</span>
          <ArrowRight size={16} />
          <span>Rendu → commit</span>
        </div>
        <div className="callout">
          <Lightbulb size={20} />
          <p>
            Chaque rendu possède ses valeurs et ses fonctions. Une fonction
            créée pendant un rendu conserve l’accès aux valeurs de ce rendu :
            c’est une <strong>closure</strong>.
          </p>
        </div>
      </section>
      <section id="choisir" className="section-block">
        <h2>
          <span className="section-number">03</span> Trois façons de conserver
          une information
        </h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Outil</th>
                <th>Entre les rendus</th>
                <th>Déclenche un rendu</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Variable locale</td>
                <td>Recréée</td>
                <td>Non</td>
                <td>Calcul du rendu</td>
              </tr>
              <tr>
                <td>État</td>
                <td>Conservé</td>
                <td>Oui, via le setter*</td>
                <td>Information affichée</td>
              </tr>
              <tr>
                <td>Ref</td>
                <td>Conservée</td>
                <td>Non</td>
                <td>DOM, timer, valeur technique</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="small muted">
          * React peut ignorer une valeur identique. Les mises à jour peuvent
          être regroupées.
        </p>
      </section>
      <section className="section-block">
        <h2>
          <span className="section-number">04</span> Les réflexes à conserver
        </h2>
        <ul className="check-list">
          <li>
            <Check size={17} />
            Le rendu reste pur : pas de mutation des props ni d’opération
            externe.
          </li>
          <li>
            <Check size={17} />
            Une liste utilise des clés stables issues des données.
          </li>
          <li>
            <Check size={17} />
            Les hooks sont appelés au sommet des composants ou des hooks
            personnalisés.
          </li>
          <li>
            <Check size={17} />
            Strict Mode révèle des problèmes en développement ; ses
            vérifications ne sont pas des bugs.
          </li>
        </ul>
        <details className="reading-details">
          <summary>Trois questions pour démarrer</summary>
          <p>
            <strong>Une prop est-elle modifiable par l’enfant ?</strong> Non.
            L’enfant peut demander une modification via un callback du parent.
          </p>
          <p>
            <strong>Une variable locale mémorise-t-elle un clic ?</strong> Non.
            Il faut un état pour conserver la valeur et demander un rendu.
          </p>
          <p>
            <strong>Un rendu modifie-t-il forcément le DOM ?</strong> Non. React
            applique seulement les changements nécessaires pendant le commit.
          </p>
        </details>
      </section>
      <button className="primary large" onClick={start}>
        Entrer dans le parcours <ArrowRight size={18} />
      </button>
    </>
  );
}
function LessonPage({
  lesson,
  completed,
  onComplete,
  tab,
  setTab,
}: {
  lesson: Lesson;
  completed: boolean;
  onComplete: () => void;
  tab: string;
  setTab: (tab: string) => void;
}) {
  const [demoKey, setDemoKey] = useState(0);
  const [showCode, setShowCode] = useState(true);
  const index = lessons.indexOf(lesson);
  return (
    <>
      <div className="lesson-heading">
        <div className="eyebrow">
          CHAPITRE {String(index + 1).padStart(2, "0")} <span>/</span>{" "}
          {groups[lesson.group].toUpperCase()}
        </div>
        <div className="title-row">
          <h1>
            {lesson.title}
            <span className="heading-dot">.</span>
          </h1>
          <span className="core-badge">
            {lesson.id === "custom" || lesson.id === "regles"
              ? "Fondamentaux"
              : "React Core"}
          </span>
        </div>
        <p>{lesson.subtitle}</p>
        <div className="meta-row">
          <span>
            <Clock3 size={14} /> {lesson.minutes} min
          </span>
          <span className={"level-badge " + lesson.level.toLowerCase()}>
            {lesson.level}
          </span>
          <span>
            <Code2 size={14} /> TypeScript
          </span>
        </div>
      </div>
      <div
        className="lesson-tabs"
        role="tablist"
        aria-label="Contenu du chapitre"
        onKeyDown={(event) => {
          const tabs = ["cours", "exercices", "memo"];
          const current = tabs.indexOf(tab);
          const next =
            event.key === "ArrowRight"
              ? (current + 1) % 3
              : event.key === "ArrowLeft"
                ? (current + 2) % 3
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 2
                    : -1;
          if (next < 0) return;
          event.preventDefault();
          setTab(tabs[next]);
          document.getElementById("tab-" + tabs[next])?.focus();
        }}
      >
        {[
          { id: "cours", label: "Le cours", icon: BookOpen },
          { id: "exercices", label: "À vous de jouer", icon: FlaskConical },
          { id: "memo", label: "L’essentiel", icon: ListChecks },
        ].map((t) => (
          <button
            id={"tab-" + t.id}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={"panel-" + t.id}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            key={t.id}
          >
            <t.icon size={16} />
            {t.label}
            {t.id === "exercices" && <span className="tiny-badge">2</span>}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={"panel-" + tab}
        aria-labelledby={"tab-" + tab}
        tabIndex={0}
      >
        {tab === "cours" && (
          <>
            <section id="comprendre" className="section-block">
              <h2>
                <span className="section-number">01</span> Pourquoi{" "}
                {lesson.title.startsWith("use") ? "ce hook" : "cette notion"} ?
              </h2>
              <p>{lesson.problem}</p>
              {lesson.id === "useCallback" && <CallbackLesson />}
              {lesson.id === "useOptimistic" && <OptimisticLesson />}
              <div className="callout">
                <Lightbulb size={21} />
                <div>
                  <strong>Le modèle mental</strong>
                  <p>{lesson.mental}</p>
                </div>
              </div>
            </section>
            <section id="experimenter" className="section-block">
              <div className="section-heading-row">
                <h2>
                  <span className="section-number">02</span> Comprendre en
                  pratiquant
                </h2>
                <span className="live-badge">
                  <span className="dot" /> Interactif
                </span>
              </div>
              <p>{lesson.task}</p>
              <div className="playground">
                <div className="playground-toolbar">
                  <span>
                    <Play size={13} fill="currentColor" /> LE LABORATOIRE
                  </span>
                  <button onClick={() => setDemoKey((k) => k + 1)}>
                    <RotateCcw size={13} /> Réinitialiser
                  </button>
                </div>
                <div className="demo-body">
                  <DemoBoundary key={demoKey}>
                    <Demo id={lesson.id} />
                  </DemoBoundary>
                </div>
                <div className="observation">
                  <Target size={17} />
                  <p>
                    <strong>À observer.</strong> {lesson.observe}
                  </p>
                </div>
              </div>
              <button
                className="code-toggle"
                onClick={() => setShowCode((v) => !v)}
                aria-expanded={showCode}
              >
                <Code2 size={15} />
                {showCode ? "Masquer" : "Voir"} le code TypeScript{" "}
                <ChevronDown size={14} className={showCode ? "rotate" : ""} />
              </button>
              {showCode && <CodeBlock code={lesson.code} />}
            </section>
            <section id="choisir" className="section-block">
              <h2>
                <span className="section-number">03</span> Faire les bons choix
              </h2>
              <div className="practice-grid">
                <div className="practice-card good">
                  <h3>
                    <CheckCircle2 size={18} /> À privilégier
                  </h3>
                  <ul>
                    {lesson.good.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="practice-card bad">
                  <h3>
                    <Circle size={18} /> À éviter
                  </h3>
                  <ul>
                    {lesson.avoid.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <details className="reading-details">
                <summary>
                  Aller un peu plus loin{" "}
                  <span>Nuances et cas particuliers</span>
                </summary>
                <p>{lesson.details}</p>
              </details>
            </section>
            <div className="exercise-invite">
              <div>
                <FlaskConical size={22} />
                <div>
                  <strong>Vous avez compris le mécanisme ?</strong>
                  <p>Vérifiez-le avec une question et un mini-défi.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTab("exercices");
                  document
                    .querySelector(".lesson-tabs")
                    ?.scrollIntoView({ block: "start" });
                }}
              >
                À vous de jouer <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
        {tab === "exercices" && (
          <section className="section-block">
            <Quiz lesson={lesson} />
            {lesson.id === "useCallback" && <CallbackQuestions />}
            <div className="exercise-card">
              <span className="eyebrow">LE MINI-DÉFI</span>
              <h3>À essayer dans votre éditeur</h3>
              <p>{lesson.exercise}</p>
              <details className="reading-details">
                <summary>Voir la piste de correction</summary>
                <p>{lesson.solution}</p>
              </details>
            </div>
            <p className="small muted">
              Les exercices se font dans votre éditeur. Les démonstrations du
              cours s’exécutent directement dans le navigateur.
            </p>
          </section>
        )}
        {tab === "memo" && (
          <section className="section-block">
            <div className="callout">
              <Lightbulb size={22} />
              <div>
                <strong>À retenir en une phrase</strong>
                <p>{lesson.mental}</p>
              </div>
            </div>
            <h2>Votre aide-mémoire</h2>
            <ul className="check-list">
              {lesson.good.map((g) => (
                <li key={g}>
                  <Check size={17} />
                  {g}
                </li>
              ))}
            </ul>
            <h3>Le piège à reconnaître</h3>
            <p>{lesson.avoid[0]}</p>
            <CodeBlock code={lesson.code} />
            <p>{lesson.details}</p>
          </section>
        )}
      </div>
      <div className="completion">
        <div>
          <CheckCircle2 size={23} />
          <div>
            <strong>
              {completed
                ? "Chapitre ajouté à votre progression"
                : "Un pas de plus dans votre parcours"}
            </strong>
            <p>Votre progression est conservée sur ce navigateur.</p>
          </div>
        </div>
        <button
          className={completed ? "completed-button" : "primary"}
          onClick={onComplete}
        >
          {completed ? (
            <>
              <Check size={16} /> Terminé
            </>
          ) : (
            "Marquer comme terminé"
          )}
        </button>
      </div>
    </>
  );
}
export default function App() {
  const [lessonTab, setLessonTab] = useState("cours");
  const [active, setActive] = useState(route);
  const [search, setSearch] = useState("");
  const [progress, setProgress] = useState(readProgress);
  const [mobile, setMobile] = useState(false);
  const [projection, setProjection] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const lesson = lessons.find((l) => l.id === active);
  const index = lesson ? lessons.indexOf(lesson) : -1;
  useEffect(() => {
    const change = () => {
      setActive(route());
      setLessonTab("cours");
      setMobile(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.title = `${lesson?.title ?? "Avant les hooks"} — Hooklab`;
  }, [lesson]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCollapsed(false);
        setMobile(true);
        setTimeout(() => searchRef.current?.focus(), 0);
      }
      if (e.key === "Escape") setMobile(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  function navigate(id: string) {
    window.location.hash = id;
    setActive(id);
    setLessonTab("cours");
    setMobile(false);
    window.scrollTo({ top: 0 });
  }
  function showSection(id: string) {
    setLessonTab("cours");
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
    );
  }
  function complete() {
    if (!lesson) return;
    setProgress((current) => {
      const next = current.includes(lesson.id)
        ? current.filter((id) => id !== lesson.id)
        : [...current, lesson.id];
      try {
        localStorage.setItem("hooklab-progress", JSON.stringify(next));
      } catch {
        /* Storage can be unavailable in private mode. */
      }
      return next;
    });
  }
  const filtered = lessons.filter((l) =>
    (l.title + " " + l.subtitle).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div
      className={`app ${projection ? "projection" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Aller au contenu
      </a>
      <header className="topbar">
        <div className="brand">
          <button
            className="mobile-menu icon-button"
            onClick={() => setMobile((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            <Menu size={21} />
          </button>
          <a
            href="#introduction"
            onClick={(e) => {
              e.preventDefault();
              navigate("introduction");
            }}
          >
            <span className="brand-icon">
              <Atom size={24} />
            </span>
            <span>
              hook<span className="brand-light">lab</span>
              <span className="brand-period">.</span>
            </span>
          </a>
          <span className="brand-divider" />
          <span className="brand-description">L’atelier des hooks React</span>
        </div>
        <div className="top-actions">
          <span className="version-pill">
            <span className="dot" /> React 19
          </span>
          <button
            className={
              projection ? "projection-toggle active" : "projection-toggle"
            }
            onClick={() => setProjection((v) => !v)}
            aria-pressed={projection}
            aria-label="Mode projection"
          >
            <Monitor size={16} />
            <span>Mode projection</span>
          </button>
          <a
            className="docs-link"
            href="https://react.dev/reference/react/hooks"
            target="_blank"
            rel="noreferrer"
          >
            Docs React <ExternalLink size={13} />
          </a>
        </div>
      </header>
      {mobile && (
        <button
          className="sidebar-backdrop"
          onClick={() => setMobile(false)}
          aria-label="Fermer le menu"
        />
      )}
      <aside className={"sidebar " + (mobile ? "mobile-open" : "")}>
        <div className="sidebar-top">
          <span>LE PARCOURS</span>
          <button
            className="icon-button desktop-collapse"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={
              collapsed ? "Afficher la navigation" : "Réduire la navigation"
            }
          >
            <PanelLeftClose size={16} />
          </button>
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobile(false)}
            aria-label="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="sidebar-content">
          <label className="search-box">
            <Search size={16} />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un hook…"
              aria-label="Rechercher un chapitre"
            />
            <kbd>Ctrl K</kbd>
          </label>
          <a
            className={
              "intro-link " + (active === "introduction" ? "active" : "")
            }
            href="#introduction"
            onClick={(e) => {
              e.preventDefault();
              navigate("introduction");
            }}
          >
            <BookOpen size={17} />
            <span>
              Avant les hooks<small>Les repères essentiels</small>
            </span>
            <ArrowUpRightIcon />
          </a>
          <nav aria-label="Chapitres du parcours">
            {groups.map((g, gi) => {
              const members = filtered.filter((l) => l.group === gi);
              return (
                members.length > 0 && (
                  <div className="nav-group" key={g}>
                    <div className="nav-group-title">
                      <span>{String(gi + 1).padStart(2, "0")}</span>
                      {g}
                    </div>
                    {members.map((l) => (
                      <a
                        key={l.id}
                        aria-current={active === l.id ? "page" : undefined}
                        className={
                          "nav-item " + (active === l.id ? "active" : "")
                        }
                        href={"#" + l.id}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(l.id);
                        }}
                      >
                        <span className="nav-item-icon">
                          {progress.includes(l.id) ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <span />
                          )}
                        </span>
                        <span>{l.title}</span>
                        {active === l.id && <ChevronRight size={14} />}
                        {l.id === "useEffectEvent" && active !== l.id && (
                          <span className="new-tag">19.2</span>
                        )}
                      </a>
                    ))}
                  </div>
                )
              );
            })}
            {!filtered.length && (
              <div className="empty-search">
                Aucun chapitre trouvé.
                <button onClick={() => setSearch("")}>
                  Effacer la recherche
                </button>
              </div>
            )}
          </nav>
        </div>
        <div className="sidebar-progress">
          <div>
            <span>Votre progression</span>
            <strong>
              {progress.length}
              <span> / 20</span>
            </strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress.length * 5}%` }} />
          </div>
          <small>À votre rythme, un hook à la fois.</small>
        </div>
      </aside>
      <div className="workspace">
        <div className="breadcrumb">
          <span>Le parcours</span>
          <ChevronRight size={13} />
          <span>{lesson ? groups[lesson.group] : "Pour bien commencer"}</span>
          <ChevronRight size={13} />
          <strong>{lesson?.title ?? "Introduction"}</strong>
          <span className="breadcrumb-end">
            <GraduationCap size={15} /> Apprendre par la pratique
          </span>
        </div>
        <div className="content-layout">
          <main id="main" tabIndex={-1} className="main-content">
            {lesson ? (
              <LessonPage
                key={active}
                lesson={lesson}
                completed={progress.includes(active)}
                onComplete={complete}
                tab={lessonTab}
                setTab={setLessonTab}
              />
            ) : (
              <Intro start={() => navigate("regles")} />
            )}
            <div className="lesson-navigation">
              <button
                onClick={() =>
                  navigate(index <= 0 ? "introduction" : lessons[index - 1].id)
                }
                disabled={active === "introduction"}
              >
                <ArrowLeft size={17} />
                <span>
                  <small>PRÉCÉDENT</small>
                  {index <= 0 ? "Avant les hooks" : lessons[index - 1].title}
                </span>
              </button>
              {index < lessons.length - 1 ? (
                <button onClick={() => navigate(lessons[index + 1].id)}>
                  <span>
                    <small>CHAPITRE SUIVANT</small>
                    {lessons[index + 1].title}
                  </span>
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button onClick={() => navigate("introduction")}>
                  <span>
                    <small>PARCOURS TERMINÉ</small>Revenir aux fondamentaux
                  </span>
                  <RotateCcw size={17} />
                </button>
              )}
            </div>
            <footer className="page-footer">
              <span>
                <Atom size={14} /> hooklab · Comprendre. Manipuler. Retenir.
              </span>
              <span>React & TypeScript · 100 % navigateur</span>
            </footer>
          </main>
          <aside className="chapter-aside">
            <span className="eyebrow">DANS CE CHAPITRE</span>
            <a
              href="#comprendre"
              onClick={(e) => {
                e.preventDefault();
                showSection("comprendre");
              }}
            >
              Pourquoi{" "}
              {lesson?.title.startsWith("use") ? "ce hook" : "cette notion"} ?
            </a>
            <a
              href="#experimenter"
              onClick={(e) => {
                e.preventDefault();
                showSection("experimenter");
              }}
            >
              Comprendre en pratiquant
            </a>
            <a
              href="#choisir"
              onClick={(e) => {
                e.preventDefault();
                showSection("choisir");
              }}
            >
              Faire les bons choix
            </a>
            <div className="aside-tip">
              <Sparkles size={19} />
              <strong>Le déclic vient en testant.</strong>
              <p>
                Prédisez le résultat avant de cliquer. Puis comparez avec ce qui
                se passe.
              </p>
            </div>
            <div className="course-stats">
              <span>18 hooks natifs</span>
              <span>2 chapitres transversaux</span>
              <span>Aucune bibliothèque métier</span>
            </div>
            <button
              className="back-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Retour en haut{" "}
              <ArrowDown size={13} style={{ transform: "rotate(180deg)" }} />
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
function ArrowUpRightIcon() {
  return <ExternalLink size={13} />;
}
