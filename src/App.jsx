import { useEffect, useState } from 'react'
import LoginScreen from './ui/LoginScreen.jsx'
import AppPicker from './ui/AppPicker.jsx'
import { getAccessToken, getMe, logout } from './lib/auth.js'

/**
 * Three states:
 *  - loading:    checking whether an existing token is still valid
 *  - anonymous:  no token / expired → show LoginScreen
 *  - authed:     valid session → show AppPicker
 */
export default function App() {
  const [state, setState] = useState('loading')
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function boot() {
      if (!getAccessToken()) {
        if (!cancelled) setState('anonymous')
        return
      }
      try {
        const me = await getMe()
        if (cancelled) return
        setUser(me); setState('authed')
      } catch {
        if (cancelled) return
        setState('anonymous')
      }
    }
    boot()
    return () => { cancelled = true }
  }, [])

  if (state === 'loading') {
    return (
      <div className="page-shell">
        <div className="dot-bg" aria-hidden />
        <div className="brand-strip" aria-hidden />
        <div className="center-status">Caricamento…</div>
      </div>
    )
  }

  if (state === 'anonymous') {
    return (
      <LoginScreen
        onAuthenticated={(me) => { setUser(me); setState('authed') }}
      />
    )
  }

  return (
    <AppPicker
      user={user}
      onLogout={() => { logout(); setUser(null); setState('anonymous') }}
    />
  )
}
