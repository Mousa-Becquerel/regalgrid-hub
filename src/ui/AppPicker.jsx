import { APPS } from '../lib/config.js'
import { handOffToApp } from '../lib/auth.js'

export default function AppPicker({ user, onLogout }) {
  return (
    <div className="page-shell">
      <div className="dot-bg" aria-hidden />
      <div className="brand-strip" aria-hidden />

      <header className="page-header">
        <span className="brand-mark">
          <span className="dot" style={{ background: '#0a7a3e' }} />
          <span className="dot" style={{ background: '#f7a01d' }} />
          <span className="dot" style={{ background: '#c8384f' }} />
        </span>
        <span className="brand-name">Regalgrid</span>
        {user && (
          <div className="user-chip">
            <span className="user-chip-name">{user.display_name || user.email}</span>
            <button className="user-chip-logout" onClick={onLogout} type="button">Esci</button>
          </div>
        )}
      </header>

      <main className="page-main">
        <div className="picker-stack">
          <div className="picker-heading">
            <h1>Benvenuto{user?.display_name ? `, ${user.display_name.split(' ')[0]}` : ''}<span className="login-heading-dot">.</span></h1>
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
                <span className="picker-tile-name">{app.name}</span>
                <span className="picker-tile-tag">{app.tagline}</span>
                <span className="picker-tile-cta">Apri →</span>
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
