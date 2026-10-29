import { useLayoutEffect, useMemo, useRef, useState } from 'react';

export default function App() {
  const [products] = useState(() => Array.from({ length: 1_000_000 }, (_, i) =>
    ['Carnet', 'Stylo', 'Agenda'][i % 3] + ' ' + (i + 1)));
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const status = useRef<HTMLElement>(null);
  const duration = useRef<HTMLSpanElement>(null);
  const start = performance.now();
  function calculate() {
    const started = performance.now();
    const items = products.filter(product =>
      product.toLowerCase().includes(query.toLowerCase()));
    return { items, ms: performance.now() - started };
  }
  const cached = useMemo(() => enabled ? calculate() : null, [products, query, enabled]);
  const result = cached ?? calculate();
  const elapsed = performance.now() - start;
  const previous = useRef<{ result: typeof result; count: number } | null>(null);

  useLayoutEffect(() => {
    const last = previous.current;
    if (last?.result === result && last.count === count) return;
    const reused = last?.result === result;
    if (duration.current) duration.current.textContent =
      (reused ? elapsed : result.ms).toFixed(3) + ' ms';
    if (status.current) status.current.textContent = !enabled
      ? 'Mémoïsation désactivée — calcul exécuté'
      : reused
      ? 'Mémoïsation utilisée : oui'
      : 'Mémoïsation utilisée : non — calcul exécuté';
    previous.current = { result, count };
  }, [result, count, elapsed, enabled]);

  return (
    <section>
      <label><input type="checkbox" checked={enabled}
        onChange={event => setEnabled(event.target.checked)} /> Utiliser useMemo</label>
      <label>Recherche : <input value={query} placeholder="Carnet"
        onChange={event => setQuery(event.target.value)} /></label>
      <button onClick={() => setCount(c => c + 1)}>Compteur : {count}</button>
      <p role="status" style={{ padding: 16, background: '#eeeaff', color: '#302066' }}>
        <strong ref={status}>Mémoïsation utilisée : non — calcul exécuté</strong>
        {' · '}<span ref={duration}>— ms</span>
      </p>
      <p>{result.items.length.toLocaleString('fr-FR')} résultats sur 1 million (5 premiers affichés)</p>
      <ul>{result.items.slice(0, 5).map(product => <li key={product}>{product}</li>)}</ul>
    </section>
  );
}
