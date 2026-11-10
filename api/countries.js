export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ errors: [{ message: 'Only GET requests are supported.' }] });
  }

  const apiKey = process.env.COUNTRIES_API_KEY || process.env.VITE_API_KEY;
  if (!apiKey?.trim()) {
    return res.status(503).json({ errors: [{ message: 'Set COUNTRIES_API_KEY in the Vercel environment settings and redeploy.' }] });
  }

  const incoming = new URL(req.url, 'https://localhost');
  const limit = incoming.searchParams.get('limit') || '6';
  const offset = incoming.searchParams.get('offset') || '0';
  if (!/^\d+$/.test(limit) || Number(limit) < 1 || Number(limit) > 100 || !/^\d+$/.test(offset) || !Number.isSafeInteger(Number(offset))) {
    return res.status(400).json({ errors: [{ message: 'Invalid pagination parameters.' }] });
  }
  const upstream = new URL('https://api.restcountries.com/countries/v5');
  upstream.searchParams.set('limit', limit);
  upstream.searchParams.set('offset', offset);
  const query = incoming.searchParams.get('q')?.trim();
  if (query) upstream.searchParams.set('q', query);

  try {
    const response = await fetch(upstream, {
      headers: { Authorization: `Bearer ${apiKey.trim()}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(10000),
    });
    let payload;
    try { payload = await response.json(); }
    catch { return res.status(502).json({ errors: [{ message: 'The country service returned an invalid response. Please try again.' }] }); }
    return res.status(response.status).json(payload);
  } catch {
    return res.status(502).json({ errors: [{ message: 'The country service is temporarily unavailable. Please try again.' }] });
  }
}
