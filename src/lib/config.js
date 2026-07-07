/**
 * Runtime config for the Regalgrid hub.
 *
 * `API_BASE` derives from Vite's `import.meta.env.BASE_URL` (whatever we
 * passed as `base:` at build time). In production the hub is served at
 * `/regalgrid/`, so `BASE_URL === '/regalgrid/'` and the hub POSTs to
 * `/regalgrid/api/auth/login` — Caddy proxies that to one of the app
 * APIs (which share auth via `AUTH_DATABASE_URL`).
 *
 * `APPS` lists the tiles the picker shows. Order = display order.
 */

const _base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
export const API_BASE = `${_base}/api`

/**
 * Each app must expose:
 *  - `id`           short slug used for the URL segment (e.g. 'sinergia')
 *  - `name`         customer-facing label ("Sinergia")
 *  - `tagline`      one-sentence description in Italian
 *  - `path`         where to redirect to (absolute; same origin)
 *  - `storageKeys`  the app's localStorage keys for {access, refresh} tokens.
 *                   The hub writes the shared token into these on tile-click
 *                   so the target app opens already-authenticated.
 *  - `color`        accent used on the tile
 */
export const APPS = [
  {
    id: 'sinergia',
    name: 'Digital Twin Builder',
    tagline: 'Estrai schemi unifilari (PDF) e costruisci il digital twin geografico dell’impianto.',
    path: '/sinergia/',
    storageKeys: {
      access: 'ed-extract.auth.access.v1',
      refresh: 'ed-extract.auth.refresh.v1',
    },
    // Regalgrid brand green (the wordmark's leaf color).
    color: '#6da819',
  },
  {
    id: 'conv-agent',
    name: 'Norma Agent',
    tagline: 'Assistente normativo sui regolamenti elettrici italiani ed europei.',
    path: '/conv-agent/',
    storageKeys: {
      access: 'conv-agent.auth.access.v1',
      refresh: 'conv-agent.auth.refresh.v1',
    },
    // Regalgrid brand blue (from the wordmark dots).
    color: '#0077c2',
  },
]

// Where the hub itself stores its own token copy (so `/regalgrid/` remembers
// you're logged in). Kept independent from the app-specific keys so a
// user logging out of one app doesn't clobber the hub's state.
export const HUB_STORAGE = {
  access: 'regalgrid.auth.access.v1',
  refresh: 'regalgrid.auth.refresh.v1',
}
