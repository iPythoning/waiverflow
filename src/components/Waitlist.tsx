import { useState } from 'react'

// Day-0 collection goes to a real inbox via mailto (zero backend, zero account).
// Upgrade path: set FORMSPREE_ENDPOINT to a https://formspree.io/f/xxxx form to collect
// inline (no mail-client hop). Only this one constant changes — see docs/operations/cycle8-distribution.md.
const CONTACT_EMAIL = 'fankaiwei3+waiverflow@gmail.com'
const FORMSPREE_ENDPOINT = ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'done' | 'error'

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const valid = EMAIL_RE.test(email)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!valid) return

    if (FORMSPREE_ENDPOINT) {
      setStatus('sending')
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email, source: 'waiverflow-waitlist' }),
        })
        setStatus(res.ok ? 'done' : 'error')
      } catch {
        setStatus('error')
      }
      return
    }

    const subject = encodeURIComponent('WaiverFlow waitlist')
    const body = encodeURIComponent(`Add me to the waitlist: ${email}\n\nState I work in:\nWhat's slowing me down on lien waivers today:`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <section className="card waitlist">
        <div className="step-label">You&rsquo;re on the list</div>
        <p className="wl-copy">
          Thanks. We&rsquo;ll email you the day your state goes live. If a mail window didn&rsquo;t open,
          reach us directly at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    )
  }

  return (
    <section className="card waitlist">
      <div className="step-label">Need another state?</div>
      <p className="wl-copy">
        California &amp; Texas are live. Tell us where you work and we&rsquo;ll notify you the day your
        state&rsquo;s statutory waivers ship — and what&rsquo;s slowing you down on waivers today.
      </p>
      <form className="wl-form" onSubmit={submit}>
        <input
          type="email"
          inputMode="email"
          placeholder="you@yourcompany.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Your email"
        />
        <button type="submit" disabled={!valid || status === 'sending'}>
          {status === 'sending' ? 'Adding…' : 'Notify me'}
        </button>
      </form>
      {status === 'error' && (
        <p className="wl-err">
          Couldn&rsquo;t reach the server — email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      )}
    </section>
  )
}
