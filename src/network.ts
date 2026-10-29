export type NetworkOptions = {
  delay: number;
  fail: boolean;
};
export async function request<T>(
  path: string,
  options: NetworkOptions,
  signal?: AbortSignal,
  body?: unknown,
): Promise<T> {
  const url = new URL(
    `${import.meta.env.BASE_URL}api/${path}`,
    window.location.href,
  );
  url.searchParams.set("delay", String(options.delay));
  url.searchParams.set("fail", String(options.fail));
  const response = await fetch(url, {
    signal,
    ...(body === undefined
      ? {}
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  if (!response.ok)
    throw new Error(
      "Le serveur simulé a refusé la demande. Réessayez en désactivant l’erreur.",
    );
  return response.json() as Promise<T>;
}
