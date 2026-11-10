import { useEffect, useState } from "react";

export function CountrySearch() {
  const [query, setQuery] = useState("rwanda");
  const [countries, setCountries] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    // 1. Declare the controller inside the effect so a new one is made per query
    const controller = new AbortController();
    async function load() {
      try {
        // 2. We use a relative path `/api-countries` to hit Vite's local dev proxy
        // 3. We use template literals to pass the actual template query `${query}` instead of hardcoded 'rwanda'
        const res = await fetch(
          `${import.meta.env.VITE_WEATHER_API_URL}v5?q=${encodeURIComponent(query.trim())}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
            },
          },
        );

        if (controller.signal.aborted) return;

        if (res.status === 404 || res.status === 403) {
          setCountries([]);
          setStatus(res.status === 403 ? "error" : "success");
          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        // v5 wraps country records in data.objects.
        if (!Array.isArray(data.data?.objects)) {
          throw new Error("Unexpected country response");
        }
        if (controller.signal.aborted) return;
        setCountries(data.data.objects);
        setStatus("success");
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          console.error(err);
          setCountries([]);
          setStatus("error");
        }
      }
    }

    load();

    // Cleanup: Aborts the pending request if the user types a new letter before the old fetch completes
    return () => controller.abort();
  }, [query]);

  return (
    <section>
      <label htmlFor="q">Search a country</label>
      <input
        id="q"
        value={query}
        onChange={(e) => {
          const nextQuery = e.target.value;
          setQuery(nextQuery);
          setStatus(nextQuery.trim() ? "loading" : "idle");
          setCountries([]);
        }}
      />

      {status === "loading" && <p role="status">Searching…</p>}
      {status === "error" && <p role="alert">Something went wrong.</p>}
      {status === "success" && countries.length === 0 && (
        <p>No countries match.</p>
      )}

      <ul className="grid">
        {countries.map((c) => (
          <li key={c.uuid || c.codes?.alpha_3 || c.names?.common} className="card">
            <img
              src={c.flag?.url_png || c.flag?.url_svg}
              alt={c.flag?.description || `Flag of ${c.names?.common}`}
            />
            <h3>{c.names?.common}</h3>
            <p>Capital: {c.capitals?.map((capital) => capital.name).join(", ") || "—"}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
