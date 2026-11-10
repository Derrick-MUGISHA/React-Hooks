# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Countries API on Vercel

Production country requests use `/api/countries`, implemented by the Vercel
function in `api/countries.js`. This function calls REST Countries server to
server, so the browser hostname does not need to be added to the upstream key's
CORS settings. Search and pagination parameters are forwarded to the fixed
upstream endpoint; the browser receives the country data without the API key.

Set `COUNTRIES_API_KEY` in the Vercel project's **Settings → Environment Variables**
to your REST Countries key, then redeploy the whole repository (including `api/`).
The function also accepts the existing `VITE_API_KEY` environment variable for
compatibility. Prefer `COUNTRIES_API_KEY` for production; it is a server-only
variable. A static upload of `dist/` alone does not include the function.

For local `npm run dev`, keep `VITE_API_KEY` in the ignored `.env` file. Vite uses
its existing `/api-countries` proxy. The optional `VITE_COUNTRIES_API_URL` (or older
`VITE_WEATHER_API_URL`) only overrides the local development endpoint. Test the
complete production function locally with Vercel's development environment.
