import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import ApiDetails from "./ApiDetails";
import { fetchCountries } from "./api/countries";

const PAGE_SIZE = 6;

export function CountrySearch() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [result, setResult] = useState({ countries: [], total: null, hasMore: false });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const { countries, total, hasMore } = result;

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const data = await fetchCountries({
          baseUrl: import.meta.env.VITE_COUNTRIES_API_URL || import.meta.env.VITE_WEATHER_API_URL,
          isDev: import.meta.env.DEV,
          apiKey: import.meta.env.DEV ? import.meta.env.VITE_API_KEY : undefined,
          query,
          page,
          pageSize: PAGE_SIZE,
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const meta = data.meta;
        setResult({
          countries: data.objects,
          total: typeof meta?.total === "number" ? meta.total : null,
          hasMore: meta?.more ?? (data.objects.length === PAGE_SIZE),
        });
        setStatus("success");
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
          setStatus("error");
        }
      }
    }
    const timer = setTimeout(load, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, page, retry]);

  function changePage(nextPage) {
    setPage(nextPage);
    setStatus("loading");
  }

  return (
    <section className="panel explore-panel" id="explore" aria-labelledby="explore-title">
      <p className="section-kicker">NEAR, FAR & EVERYWHERE IN BETWEEN</p>
      <h2 id="explore-title">Where will curiosity take you?</h2>
      <p className="section-description">Browse the world, or search for somewhere you’ve always wanted to go.</p>
      <div className="search-field">
        <label className="search-label" htmlFor="q">Search a country</label>
        <span aria-hidden="true">⌕</span>
        <input id="q" type="search" placeholder="Search a country…" autoComplete="off" value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); setStatus("loading"); }} />
      </div>
      <div className="search-meta"><span>{query.trim() ? `Results for “${query.trim()}”` : "All countries · A world to discover"}</span><span>{status === "success" && total != null ? `${total} countries` : ""}</span></div>
      {status === "loading" && <p className="feedback" role="status">Finding your next discovery…</p>}
      {status === "error" && <div className="feedback error" role="alert"><p>{error}</p><button className="retry-button" onClick={() => { setStatus("loading"); setRetry((value) => value + 1); }}>Try again</button></div>}
      {status === "success" && (
        <>
          {countries.length === 0 && <p className="feedback" role="status">No countries match. Try another name.</p>}
          <ul className="country-grid" aria-label="Country results">
            {countries.map((c) => (
              <li key={c.uuid || c.codes?.alpha_3 || c.names?.common} className="country-card">
                <div className="country-summary">
                  <div className="flag-frame"><img loading="lazy" src={c.flag?.url_png || c.flag?.url_svg} alt={c.flag?.description || `Flag of ${c.names?.common}`} /></div>
                  <div><h3>{c.names?.common}</h3><p>Capital: {c.capitals?.map((capital) => capital.name).join(", ") || "—"}</p></div>
                  {c.codes?.alpha_3 && <span className="country-code">{c.codes.alpha_3}</span>}
                </div>
                <dl className="country-facts">
                  <div><dt>Region</dt><dd>{c.region || "—"}</dd></div>
                  <div><dt>Population</dt><dd>{c.population?.toLocaleString() ?? "—"}</dd></div>
                  <div><dt>Languages</dt><dd>{c.languages?.map((language) => language.name).join(", ") || "—"}</dd></div>
                  <div><dt>Currencies</dt><dd>{Array.isArray(c.currencies) ? c.currencies.map((currency) => currency.code).join(", ") || "—" : "—"}</dd></div>
                </dl>
                <ApiDetails data={c} label={`View all ${c.names?.common || "country"} details`} />
              </li>
            ))}
          </ul>
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} count={countries.length} hasMore={hasMore} onPageChange={changePage} label="Country pages" />
        </>
      )}
    </section>
  );
}
