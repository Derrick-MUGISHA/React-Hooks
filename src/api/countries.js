export function countryEndpoint(baseUrl, isDev = false) {
  // Vercel calls the upstream service with the server's key.
  if (!isDev) return "/api/countries";
  const base = baseUrl?.trim().replace(/\/+$/, "");
  // Vite's server.proxy exists only during local development.
  if (!base || /^\/api-countries(?:\/|$)/.test(base)) {
    return "/api-countries/countries/v5";
  }
  if (/\/v5$/.test(base)) return base;
  if (/\/countries$/.test(base)) return `${base}/v5`;
  if (/^https?:\/\/[^/]+$/.test(base)) return `${base}/countries/v5`;
  return `${base}/v5`;
}

export async function fetchCountries({ baseUrl, isDev, apiKey, query = "", page = 0, pageSize = 6, signal, fetchImpl = fetch }) {
  const endpoint = countryEndpoint(baseUrl, isDev);
  const serverRequest = endpoint === "/api/countries";
  if (!serverRequest && !apiKey?.trim()) {
    throw new Error("Country search is not configured. Set VITE_API_KEY in the deployment environment and redeploy.");
  }
  const params = new URLSearchParams({ limit: String(pageSize), offset: String(page * pageSize) });
  if (query.trim()) params.set("q", query.trim());
  const response = await fetchImpl(`${endpoint}?${params}`, {
    signal,
    headers: serverRequest ? { Accept: "application/json" } : { Authorization: `Bearer ${apiKey.trim()}`, Accept: "application/json" },
  });
  const body = await response.text();
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error(`The country service returned a page instead of JSON (HTTP ${response.status}). Check the API URL in your deployment settings.`);
  }
  if (!response.ok) {
    const message = payload?.errors?.[0]?.message;
    if (response.status === 403 && /origin/i.test(message || "")) {
      throw new Error("This website is not allowed by the country API key. Add your deployed hostname to the key’s allowed origins in REST Countries, then try again.");
    }
    throw new Error(message || `Could not load countries (HTTP ${response.status}).`);
  }
  if (!Array.isArray(payload?.data?.objects)) {
    throw new Error("The country service returned an unexpected response.");
  }
  return payload.data;
}
