import { useEffect } from 'react'
import { handleAuthCallback } from '@netlify/identity'

const AUTH_HASH_PATTERN =
  /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/

// Invite and password-recovery links land with a token in the URL hash.
// Those flows need a password form, so they are forwarded to /admin.
export function CallbackHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const hash = window.location.hash
    if (!AUTH_HASH_PATTERN.test(hash)) return
    if (/^#(invite_token|recovery_token)=/.test(hash) && window.location.pathname !== '/admin') {
      window.location.replace('/admin' + hash)
      return
    }
    if (window.location.pathname !== '/admin') handleAuthCallback().catch(() => {})
  }, [])

  return <>{children}</>
}
