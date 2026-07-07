import { useState } from 'react'
import { login, AuthError } from '../lib/auth.js'
import Logo from './Logo.jsx'

export default function LoginScreen({ onAuthenticated }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setError(null); setSubmitting(true)
    try {
      const me = await login(email, password)
      onAuthenticated?.(me)
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Errore di rete. Riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="dot-bg" aria-hidden />
      <div className="brand-strip" aria-hidden />

      <header className="page-header">
        <Logo className="hub-logo" />
      </header>

      <main className="page-main">
        <div className="login-stack">
          <div className="login-heading">
            <span className="login-eyebrow">Sinergia · Portale Regalgrid</span>
            <h1>Accedi<span className="login-heading-dot">.</span></h1>
            <p>Un solo accesso per tutti gli strumenti Sinergia.</p>
          </div>

          <form className="login-card" onSubmit={onSubmit} noValidate>
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                placeholder="nome@regalgrid.com"
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </label>

            {error && <div className="login-error" role="alert">{error}</div>}

            <button
              type="submit"
              className="login-btn"
              disabled={submitting || !email || !password}
            >
              {submitting ? (
                <>
                  <span className="login-spinner" aria-hidden />
                  <span>Accesso in corso…</span>
                </>
              ) : (
                <>
                  <LoginArrow />
                  <span>Entra</span>
                </>
              )}
            </button>
          </form>

          <div className="login-foot">
            Accesso su invito. Contatta l'amministratore per un account.
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <span>© Regalgrid · Portale strumenti</span>
      </footer>
    </div>
  )
}

function LoginArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  )
}
