# EC2 deployment — Regalgrid hub

The hub is a small React SPA served under `https://dev.solarintelligence.ai/regalgrid/`.
No backend of its own — auth POSTs go to `/regalgrid/api/*` which the outer
Caddy proxies to one of the existing app APIs (ed-extract or conv-agent).
Both apps share the same `users` table + `JWT_SECRET`, so the token issued
via the hub is accepted by every Regalgrid-family app.

## First-time setup on the EC2

1. Clone:
   ```bash
   cd ~
   git clone git@github.com:Mousa-Becquerel/regalgrid-hub.git ~/regalgrid_hub
   cd ~/regalgrid_hub
   ```

2. Build + start:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

3. Wire the outer Caddy: edit `~/solar-intelligence/Caddyfile` and add
   inside the `dev.solarintelligence.ai { route { … } }` block, BEFORE the
   catchall `reverse_proxy react-frontend:80`:

   ```caddy
   redir /regalgrid /regalgrid/ permanent
   handle_path /regalgrid/api/* {
       reverse_proxy ed-extract-api:8000
   }
   handle_path /regalgrid/* {
       reverse_proxy regalgrid-hub:80
   }
   ```

4. Restart Caddy so the bind-mount inode re-binds:
   ```bash
   docker restart solar-intelligence-caddy-1
   ```

## Regular deploys

```bash
cd ~/regalgrid_hub
git pull --ff-only
docker compose -f docker-compose.prod.yml up -d --build
```

## Adding a new app tile

Edit `src/lib/config.js` — append to `APPS`:
```js
{
  id: 'foo',
  name: 'Foo',
  tagline: 'Descrizione breve.',
  path: '/foo/',
  storageKeys: {
    access: 'foo.auth.access.v1',
    refresh: 'foo.auth.refresh.v1',
  },
  color: '#…',
}
```

The tile appears in the picker on next build. Make sure the target app
shares the same `AUTH_DATABASE_URL` + `JWT_SECRET` and uses the exact
storage keys listed here — otherwise the hub's hand-off won't authenticate.
