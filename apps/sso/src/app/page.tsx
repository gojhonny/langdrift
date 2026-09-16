import { Brand } from '@repo/react/ui/brand'
import { DriftCurve } from '@repo/react/ui/drift-curve'
import { StatusPill } from '@repo/react/ui/status-pill'

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <section className="auth-form-side">
        <div className="auth-brand">
          <Brand />
        </div>
        <div className="auth-form-wrap">
          <div className="auth-copy">
            <span className="auth-kicker">Welcome back</span>
            <h1>Continue to Lang Drift.</h1>
            <p>Sign in to view Product Vision, Drift, decisions, and evidence.</p>
          </div>
          <form className="auth-form">
            <label htmlFor="email">Work email</label>
            <input id="email" name="email" placeholder="you@company.com" type="email" />
            <button className="primary-auth" type="button">
              Continue with email
            </button>
            <div className="divider"><span>or</span></div>
            <button className="secondary-auth" type="button">
              <span className="sso-mark">S</span>
              Continue with SSO
            </button>
          </form>
          <p className="auth-footnote">
            Access is managed by your organization. Authentication wiring is added
            separately from this interface scaffold.
          </p>
        </div>
        <footer className="auth-footer">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <span>© 2026 Lang Drift</span>
        </footer>
      </section>

      <section className="auth-visual" aria-label="Lang Drift product preview">
        <div className="visual-header">
          <span>From vision to reality</span>
          <span className="visual-line" />
        </div>
        <div className="visual-copy">
          <span>Product intelligence</span>
          <h2>Know what changed before the story gets rewritten.</h2>
        </div>
        <div className="auth-product-card">
          <div className="auth-product-head">
            <div>
              <span>Atlas Home Hub</span>
              <strong>Product Vision</strong>
            </div>
            <StatusPill tone="review">Under review</StatusPill>
          </div>
          <div className="auth-product-score">
            <strong>73</strong>
            <span>−18 since Q2</span>
          </div>
          <div className="auth-curve">
            <DriftCurve height={210} />
          </div>
          <div className="auth-event">
            <span className="auth-event-dot" />
            <div>
              <strong>Authentication behavior changed</strong>
              <span>No linked decision · Aug 29</span>
            </div>
          </div>
        </div>
        <div className="visual-tagline">We still in charge.</div>
      </section>
    </main>
  )
}
