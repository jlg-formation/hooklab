import { delay, http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
const technologies = [
  "React",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Web APIs",
  "JSX",
  "Bun",
];
async function simulate(request: Request) {
  const url = new URL(request.url);
  const ms = Math.min(
    3000,
    Math.max(0, Number(url.searchParams.get("delay")) || 250),
  );
  await delay(ms);
  return url.searchParams.get("fail") === "true";
}
export const worker = setupWorker(
  http.get("*/api/search", async ({ request }) => {
    if (await simulate(request))
      return HttpResponse.json({ error: "Erreur simulée" }, { status: 503 });
    const query =
      new URL(request.url).searchParams.get("q")?.toLowerCase() ?? "";
    return HttpResponse.json(
      technologies.filter((t) => t.toLowerCase().includes(query)),
    );
  }),
  http.post("*/api/save", async ({ request }) => {
    if (await simulate(request))
      return HttpResponse.json({ error: "Erreur simulée" }, { status: 503 });
    return HttpResponse.json({ ok: true });
  }),
);
