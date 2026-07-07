# regalgrid-hub

Single-sign-on landing page for the Regalgrid family of apps. Small React
SPA that shows a login form and, once authenticated, an app picker that
drops the user into whichever tool they clicked.

Deployed at `https://dev.solarintelligence.ai/regalgrid/`. See [deploy/README.md](deploy/README.md).

## Local dev

```bash
npm install
npm run dev
```

Requires the shared users DB and one of the app APIs to be reachable at
`http://localhost:5175/api/*` — typically via a Vite dev proxy or by
running behind the same Caddy locally.

## Files worth knowing

- `src/lib/config.js` — the list of apps that show up as tiles.
- `src/lib/auth.js` — login + hand-off logic.
- `src/ui/LoginScreen.jsx`, `src/ui/AppPicker.jsx` — the two screens.
- `src/styles.css` — brand tokens + all component CSS.
