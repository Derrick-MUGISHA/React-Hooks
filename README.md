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

Set `VITE_API_KEY` in the Vercel project's **Settings → Environment Variables**,
using your REST Countries API key. Optionally set `VITE_COUNTRIES_API_URL` to
`https://api.restcountries.com/countries/v5`. The older `VITE_WEATHER_API_URL`
setting is still supported; a local `/api-countries/...` URL is automatically
replaced with the public API URL in production because Vite's development proxy
is not part of the static build.

In [REST Countries API Keys](https://restcountries.com/api-keys), allow the deployed
hostname `react-hooks-alpha-sand.vercel.app` for this key. Add any custom domain or
preview hostname you use as well. Browser calls require an allowed hostname.

Redeploy after updating Vercel environment variables: Vite embeds them at build
time. These `VITE_*` values are browser-visible; use a browser-scoped API key with
the appropriate allowed origins. The app preserves pagination and displays clear
errors for missing keys, API errors, and responses that contain a page instead of
JSON.
