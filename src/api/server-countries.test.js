import assert from 'node:assert/strict';
import test from 'node:test';
import handler from '../../api/countries.js';

function result() {
  return { code: 200, headers: {}, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('server requests use the key without forwarding browser origin or arbitrary URLs', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url.origin, 'https://api.restcountries.com');
    assert.equal(url.searchParams.get('offset'), '6');
    assert.equal(url.searchParams.get('q'), 'Rwanda');
    assert.equal(url.searchParams.has('url'), false);
    assert.equal(options.headers.Origin, undefined);
    assert.equal(options.headers.Authorization, 'Bearer test-server-key');
    return new Response(JSON.stringify({ data: { objects: [{ names: { common: 'Rwanda' } }], meta: { total: 1 } } }));
  });
  const previous = process.env.COUNTRIES_API_KEY;
  process.env.COUNTRIES_API_KEY = 'test-server-key';
  try {
    const res = result();
    await handler({ method: 'GET', url: '/api/countries?limit=6&offset=6&q=Rwanda&url=https://example.com', headers: { origin: 'https://react-hooks-alpha-sand.vercel.app' } }, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.data.objects[0].names.common, 'Rwanda');
    assert.equal(JSON.stringify(res.body).includes('test-server-key'), false);
  } finally {
    if (previous === undefined) delete process.env.COUNTRIES_API_KEY;
    else process.env.COUNTRIES_API_KEY = previous;
  }
});

test('server rejects unsupported methods and invalid pagination', async (t) => {
  const oldKey = process.env.COUNTRIES_API_KEY;
  process.env.COUNTRIES_API_KEY = 'test-server-key';
  t.mock.method(globalThis, 'fetch', () => assert.fail('must not fetch'));
  try {
    const methodRes = result();
    await handler({ method: 'POST', url: '/api/countries' }, methodRes);
    assert.equal(methodRes.code, 405);
    for (const query of ['limit=0', 'limit=101', 'offset=-1', 'offset=Infinity']) {
      const res = result();
      await handler({ method: 'GET', url: `/api/countries?${query}` }, res);
      assert.equal(res.code, 400);
    }
  } finally {
    if (oldKey === undefined) delete process.env.COUNTRIES_API_KEY;
    else process.env.COUNTRIES_API_KEY = oldKey;
  }
});

test('production browser requests do not need a browser key', async () => {
  const { fetchCountries } = await import('./countries.js');
  await fetchCountries({ fetchImpl: async (url, options) => {
    assert.match(url, /^\/api\/countries\?/);
    assert.equal(options.headers.Authorization, undefined);
    return new Response('{"data":{"objects":[],"meta":{"total":0}}}');
  } });
});
