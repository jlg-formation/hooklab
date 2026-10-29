import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
async function start() {
  // MSW is intentionally enabled in production: these are educational simulations.
  const { worker } = await import("./mocks");
  await worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledFrame: "bypass",
    quiet: true,
  });
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
start().catch((error) => {
  console.error(error);
  createRoot(document.getElementById("root")!).render(
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Le laboratoire n’a pas pu démarrer</h1>
      <p>
        Les simulations utilisent un Service Worker. Ouvrez le site via
        localhost ou HTTPS, puis rechargez la page. Vérifiez que les Service
        Workers sont autorisés dans votre navigateur.
      </p>
      <button onClick={() => window.location.reload()}>Réessayer</button>
    </div>,
  );
});
