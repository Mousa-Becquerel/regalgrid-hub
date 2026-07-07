/**
 * Auth for the Regalgrid hub.
 *
 * The hub itself doesn't need the full refresh-on-401 dance every app has —
 * once we log in, we hand off tokens to the target app and let its own SPA
 * take over. So this file is intentionally small:
 *
 *   - login(email, password)   →  { access, refresh, user }
 *   - getMe()                  →  { id, email, display_name, is_admin, ... }
 *   - logout()                 →  clears every localStorage key we've written
 *   - handOffToApp(app)        →  copies our tokens into that app's storage
 *                                 keys, then window.location's to its path.
 */
import { API_BASE, APPS, HUB_STORAGE } from './config.js'

export class AuthError extends Error {
  constructor(message) { super(message); this.name = 'AuthError' }
}

/* ── token storage ───────────────────────────────────────────────── */

export function getAccessToken() {
  try { return localStorage.getItem(HUB_STORAGE.access) } catch { return null }
}
export function getRefreshToken() {
  try { return localStorage.getItem(HUB_STORAGE.refresh) } catch { return null }
}
function setTokens(access, refresh) {
  try {
    if (access)  localStorage.setItem(HUB_STORAGE.access, access)
    if (refresh) localStorage.setItem(HUB_STORAGE.refresh, refresh)
  } catch {}
}
function clearAllTokens() {
  try {
    localStorage.removeItem(HUB_STORAGE.access)
    localStorage.removeItem(HUB_STORAGE.refresh)
    for (const app of APPS) {
      localStorage.removeItem(app.storageKeys.access)
      localStorage.removeItem(app.storageKeys.refresh)
    }
  } catch {}
}

/* ── API calls ───────────────────────────────────────────────────── */

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  })
  if (res.status === 401) throw new AuthError('Email o password non validi.')
  if (res.status === 429) throw new AuthError('Troppi tentativi. Riprova tra qualche minuto.')
  if (!res.ok)            throw new AuthError(`Errore accesso (HTTP ${res.status}).`)
  const { access_token, refresh_token } = await res.json()
  setTokens(access_token, refresh_token)
  return await getMe()
}

export async function getMe() {
  const token = getAccessToken()
  if (!token) throw new AuthError('not authenticated')
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  })
  if (res.status === 401) throw new AuthError('not authenticated')
  if (!res.ok) throw new AuthError(`Errore profilo (HTTP ${res.status}).`)
  return res.json()
}

export function logout() {
  clearAllTokens()
}

/**
 * Copy the hub's tokens into the target app's localStorage keys, then
 * navigate. Works because the hub and every app are on the same origin —
 * localStorage is a single flat namespace. The target app boots, reads its
 * own key, hits `/auth/me` via its own API base, and finds a valid user
 * without prompting for a password.
 */
export function handOffToApp(app) {
  const access = getAccessToken()
  const refresh = getRefreshToken()
  if (!access) throw new AuthError('not authenticated')
  try {
    localStorage.setItem(app.storageKeys.access, access)
    if (refresh) localStorage.setItem(app.storageKeys.refresh, refresh)
  } catch {}
  window.location.href = app.path
}
