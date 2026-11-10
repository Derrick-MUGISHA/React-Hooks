import assert from 'node:assert/strict';
import test from 'node:test';
import { countryEndpoint, fetchCountries } from './countries.js';

const response = (body, status = 200) => new Response(body, { status });
const record = { names: { common: 'Rwanda' } };
const payload = { data: { objects: [record], meta: { total: 1, more: false } } };

test('production never uses the Vite development proxy', () => {
  for (const base of [undefined, '', '/api-countries/countries/', '/api-countries/countries/v5']) {
    assert.equal(countryEndpoint(base, false), 'https://api.restcountries.com/countries/v5');
  }
  assert.equal(countryEndpoint(undefined, true), '/api-countries/countries/v5');
});

test('normalizes host, countries base and full endpoint without duplicate versions', () => {
  for (const base of ['https://api.restcountries.com', 'https://api.restcountries.com/countries/', 'https://api.restcountries.com/countries/v5/']) {
    assert.equal(countryEndpoint(base), 'https://api.restcountries.com/countries/v5');
  }
});

test('requests the search and correct page and returns all country fields', async () => {
  const data = await fetchCountries({ apiKey: 'test-key', query: ' Rwanda ', page: 2, pageSize: 6,
    fetchImpl: async (url, options) => {
      const request = new URL(url);
      assert.equal(request.searchParams.get('offset'), '12');
      assert.equal(request.searchParams.get('limit'), '6');
      assert.equal(request.searchParams.get('q'), 'Rwanda');
      assert.equal(options.headers.Authorization, 'Bearer test-key');
      return response(JSON.stringify(payload));
    },
  });
  assert.deepEqual(data, payload.data);
});

test('empty searches list all countries without an empty q parameter', async () => {
  await fetchCountries({ apiKey: 'test-key', fetchImpl: async (url) => {
    assert.equal(new URL(url).searchParams.has('q'), false);
    return response(JSON.stringify(payload));
  } });
});

test('plain text and HTML deployment pages produce helpful errors', async () => {
  for (const body of ['The page could not be found', '<!doctype html><html>App</html>']) {
    await assert.rejects(fetchCountries({ apiKey: 'test-key', fetchImpl: async () => response(body, 404) }), /page instead of JSON \(HTTP 404\)/);
  }
});

test('reports missing keys before making a request', async () => {
  await assert.rejects(fetchCountries({ fetchImpl: () => assert.fail('must not fetch') }), /Set VITE_API_KEY/);
});

test('handles origin restrictions, API errors and invalid response shapes', async () => {
  await assert.rejects(fetchCountries({ apiKey: 'test-key', fetchImpl: async () => response(JSON.stringify({ errors: [{ message: 'Origin is not allowed for this API key' }] }), 403) }), /allowed origins/);
  await assert.rejects(fetchCountries({ apiKey: 'test-key', fetchImpl: async () => response(JSON.stringify({ errors: [{ message: 'Rate limit exceeded' }] }), 429) }), /Rate limit exceeded/);
  for (const body of ['null', '{}', '{"data":{"objects":{}}}']) {
    await assert.rejects(fetchCountries({ apiKey: 'test-key', fetchImpl: async () => response(body) }), /unexpected response/);
  }
});
