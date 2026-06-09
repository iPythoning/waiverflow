import { useMemo, useState } from 'react'
import type { StateCode, WaiverData, WaiverType } from './waivers/types'
import { getTemplate, templatesForState } from './waivers/templates'
import { downloadWaiver } from './waivers/download'
import { Waitlist } from './components/Waitlist'
import { Compare } from './components/Compare'

const STATES: { code: StateCode; name: string }[] = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'FL', name: 'Florida' },
]

export default function App() {
  const [state, setState] = useState<StateCode | null>(null)
  const [type, setType] = useState<WaiverType | null>(null)
  const [data, setData] = useState<WaiverData>({})
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)

  const template = state && type ? getTemplate(state, type) : undefined

  const missingRequired = useMemo(() => {
    if (!template) return true
    return template.formFields.some((f) => f.required && !data[f.key]?.trim())
  }, [template, data])

  const pickState = (code: StateCode) => {
    setState(code)
    setType(null)
  }

  const update = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }))

  const onGenerate = async () => {
    if (!template) return
    setBusy(true)
    try {
      await downloadWaiver(template, data)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="shell">
      <header>
        <div className="brand">
          <span className="mark" aria-hidden />
          <h1>WaiverFlow</h1>
        </div>
        <p className="tagline">
          Lien waivers in 60 seconds — the statutory form for your state, filled in and ready to
          sign. Built for subcontractors who run on QuickBooks, not a $400/month platform like
          Procore.
        </p>
      </header>

      <Compare />

      {/* Step 1 — 选州 */}
      <section className="card">
        <div className="step-label">Step 1 · Your state</div>
        <div className="seg">
          {STATES.map((s) => (
            <button key={s.code} aria-pressed={state === s.code} onClick={() => pickState(s.code)}>
              {s.name}
            </button>
          ))}
        </div>
      </section>

      {/* Step 2 — 选类型 */}
      {state && (
        <section className="card">
          <div className="step-label">Step 2 · Waiver type</div>
          <div className="type-list">
            {templatesForState(state).map((t) => (
              <button key={t.type} aria-pressed={type === t.type} onClick={() => setType(t.type)}>
                <div className="t-name">{t.label}</div>
                <div className="t-ref">{t.statutoryRef}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Step 3 — 表单 + 生成 */}
      {template && (
        <section className="card">
          <div className="step-label">
            Step 3 · Fill in the blanks
            <span className="draft-badge">DRAFT · pending attorney review</span>
          </div>
          <div className="fields">
            {template.formFields.map((f) => {
              const multiline = f.type === 'multiline'
              return (
                <div key={f.key} className={`field${multiline ? ' full' : ''}`}>
                  <label htmlFor={f.key}>
                    {f.label} {f.required && <span className="req">*</span>}
                  </label>
                  {multiline ? (
                    <textarea
                      id={f.key}
                      value={data[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) => update(f.key, e.target.value)}
                    />
                  ) : (
                    <input
                      id={f.key}
                      type={f.type === 'date' ? 'date' : 'text'}
                      value={data[f.key] ?? ''}
                      placeholder={f.placeholder}
                      onChange={(e) => update(f.key, e.target.value)}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <label className="disclaimer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              I understand WaiverFlow renders a document format only — it does not provide legal
              advice, verify my legal rights, or guarantee compliance. I am responsible for choosing
              the correct waiver and confirming it against current {template.statutoryRef}.
            </span>
          </label>

          <button className="generate" disabled={missingRequired || !agreed || busy} onClick={onGenerate}>
            {busy ? 'Generating…' : 'Generate & download PDF'}
          </button>
          <p className="hint">
            Generated entirely in your browser. Nothing is uploaded. {template.statutoryRef} reproduced verbatim.
          </p>
        </section>
      )}

      <Waitlist />

      <footer className="site-foot">
        <span className="step-label">Learn</span>
        <a href="/waiverflow/guide/how-to-fill-out-california-lien-waiver/">
          How to fill out a California lien waiver — step by step →
        </a>
        <a href="/waiverflow/guide/conditional-vs-unconditional-lien-waiver/">
          Conditional vs. unconditional lien waiver — which to sign, and when →
        </a>
        <a href="/waiverflow/guide/texas-lien-waiver-form-53-284/">
          Texas lien waiver form (Property Code §53.284) — how to fill it out →
        </a>
        <a href="/waiverflow/guide/do-i-need-a-lien-waiver-to-get-paid/">
          Do I need a lien waiver to get paid? — why payment is tied to waivers →
        </a>
      </footer>
    </main>
  )
}
