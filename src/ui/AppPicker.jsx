import { APPS } from '../lib/config.js'
import { handOffToApp } from '../lib/auth.js'
import Logo from './Logo.jsx'

/* Per-app inline icons — keep them tiny, one weight, one style so the
   tiles read as a set. Colored via `currentColor` = the tile's accent. */
const ICONS = {
  sinergia: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Stylised single-line diagram: node → node → node */}
      <circle cx="4.5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19.5" cy="12" r="2" />
      <line x1="6.5" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="17.5" y2="12" />
      <path d="M12 10V5" />
      <path d="M9.5 5h5" />
    </svg>
  ),
  'conv-agent': (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Speech bubble with a book spine inside — chat about documents */}
      <path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.6A8 8 0 1 1 21 12z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="13" x2="13" y2="13" />
    </svg>
  ),
}

function firstName(user) {
  if (!user) return ''
  if (user.display_name) return user.display_name.split(' ')[0]
  return (user.email || '').split('@')[0]
}

export default function AppPicker({ user, onLogout }) {
  return (
    <div className="page-shell">
      <div className="dot-bg" aria-hidden />
      <div className="brand-strip" aria-hidden />

      <header className="page-header">
        <Logo className="hub-logo" />
        {user && (
          <div className="user-chip">
            <div className="user-chip-avatar" aria-hidden>
              {(user.display_name || user.email || '?').trim().charAt(0).toUpperCase()}
            </div>
            <span className="user-chip-name">{user.display_name || user.email}</span>
            <button className="user-chip-logout" onClick={onLogout} type="button">Esci</button>
          </div>
        )}
      </header>

      <main className="page-main">
        <div className="picker-stack">
          <div className="picker-heading">
            <span className="login-eyebrow">Sinergia · Portale Regalgrid</span>
            <h1>Ciao{firstName(user) ? `, ${firstName(user)}` : ''}<span className="login-heading-dot">.</span></h1>
            <p>Scegli lo strumento che vuoi aprire.</p>
          </div>

          <div className="picker-grid">
            {APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                className="picker-tile"
                style={{ '--accent': app.color }}
                onClick={() => handOffToApp(app)}
              >
                <span className="picker-tile-accent" aria-hidden />
                <span className="picker-tile-icon" aria-hidden>{ICONS[app.id]}</span>
                <span className="picker-tile-body">
                  <span className="picker-tile-name">{app.name}</span>
                  <span className="picker-tile-tag">{app.tagline}</span>
                </span>
                <span className="picker-tile-cta" aria-hidden>
                  <span>Apri</span>
                  <ArrowRight />
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <span>© Regalgrid · Portale strumenti</span>
      </footer>
    </div>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
