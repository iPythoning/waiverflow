const ROWS: { label: string; us: string; them: string; usWin: boolean }[] = [
  { label: 'Price', us: 'Free — every form, every time', them: 'Paid plans to manage waivers', usWin: true },
  { label: 'Sign-up', us: 'None — start typing now', them: 'Account & company profile required', usWin: true },
  { label: 'Your data', us: 'Stays in your browser, never uploaded', them: 'Stored on their servers', usWin: true },
  { label: 'Turnaround', us: '~60 seconds to a signed-ready PDF', them: 'Onboarding, then per-document flow', usWin: true },
  { label: 'The form', us: 'Statutory text reproduced verbatim', them: 'Platform template', usWin: true },
]

export function Compare() {
  return (
    <section className="card compare" aria-labelledby="compare-h">
      <div className="step-label" id="compare-h">
        Why WaiverFlow
      </div>
      <p className="cmp-lead">
        Lien-waiver tools are usually bolted onto a paid construction-payment platform — an account,
        a company profile, your documents on their servers. WaiverFlow does one thing, free, in your
        browser.
      </p>

      <div className="cmp-grid" role="table">
        <div className="cmp-head" role="row">
          <span role="columnheader" />
          <span role="columnheader" className="cmp-us">
            WaiverFlow
          </span>
          <span role="columnheader" className="cmp-them">
            Typical paid platform
          </span>
        </div>
        {ROWS.map((r) => (
          <div className="cmp-row" role="row" key={r.label}>
            <span className="cmp-key" role="rowheader">
              {r.label}
            </span>
            <span className="cmp-cell cmp-us" role="cell">
              <span className="cmp-tick" aria-hidden>
                ✓
              </span>
              {r.us}
            </span>
            <span className="cmp-cell cmp-them" role="cell">
              <span className="cmp-cross" aria-hidden>
                ·
              </span>
              {r.them}
            </span>
          </div>
        ))}
      </div>

      <p className="cmp-foot">
        Comparison describes the typical paid platform model (e.g. Levelset, Procore); confirm current
        features with each vendor. WaiverFlow renders a document format only — not legal advice.
      </p>
    </section>
  )
}
