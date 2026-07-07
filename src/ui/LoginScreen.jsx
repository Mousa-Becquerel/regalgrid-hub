import { useState } from 'react'
import { login, AuthError } from '../lib/auth.js'

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
        <span className="brand-mark">
          <span className="dot" style={{ background: '#0a7a3e' }} />
          <span className="dot" style={{ background: '#f7a01d' }} />
          <span className="dot" style={{ background: '#c8384f' }} />
        </span>
        <span className="brand-name">Regalgrid</span>
      </header>

      <main className="page-main">
        <div className="login-stack">
          <div className="login-heading">
            <h1>Accedi<span className="login-heading-dot">.</span></h1>
            <p>Un solo accesso per tutti gli strumenti Regalgrid.</p>
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
              {submitting ? 'Accesso in corso…' : 'Entra'}
            </button>
          </form>

          <div className="login-foot">Accesso su invito.</div>
        </div>
      </main>

      <footer className="page-footer">
        <span>© Regalgrid · Portale strumenti</span>
      </footer>
    </div>
  )
}
