const freeFeatures = [
  { included: true,  text: "Unlimited lead profiles" },
  { included: true,  text: "Manual intake entry" },
  { included: true,  text: "All leads in one dashboard" },
  { included: true,  text: "HIPAA-compliant storage" },
  { included: true,  text: "EHR handoff notes" },
  { included: false, text: "AI automation & Rosie AI" },
  { included: false, text: "Automated follow-up sequences" },
  { included: false, text: "Calendar sync" },
  { included: false, text: "Bolt-on modules" },
];

const proFeatures = [
  { included: true, text: "Everything in Free" },
  { included: true, text: "Automated lead capture from all sources" },
  { included: true, text: "Full AI follow-up sequences" },
  { included: true, text: "Rosie AI assistant & chatbot" },
  { included: true, text: "Autonomous intake planning" },
  { included: true, text: "Inbound email intake" },
  { included: true, text: "Calendar sync — Google & Outlook" },
  { included: true, text: "Bolt-on modules available" },
];

function FeatureLine({ included, text }: { included: boolean; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: 9 }}>
      {included ? (
        <span className="check-icon">✓</span>
      ) : (
        <span className="dash-icon">—</span>
      )}
      {text}
    </div>
  );
}

export default function Pricing() {
  return (
    <section className="site-section" id="pricing">
      <span className="section-label">Pricing</span>
      <h2>Start free. Upgrade when you&apos;re ready.</h2>
      <p>A free tier, always. Pro is free for all beta practices — for as long as you&apos;re with us.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 16,
        marginTop: "2rem",
      }}>
        {/* Free */}
        <div style={{
          background: "var(--bg-primary)",
          border: "0.5px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          padding: "1.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Free — forever</span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", margin: "0.5rem 0 0.25rem" }}>$0</div>
          <p style={{ fontSize: 13, paddingBottom: "1.25rem", borderBottom: "0.5px solid var(--border-subtle)", marginBottom: "1.25rem" }}>
            Everything in one place. You run it manually — Rosie holds the data.
          </p>
          {freeFeatures.map((f) => <FeatureLine key={f.text} {...f} />)}
          <a href="#cta" className="btn-secondary" style={{ width: "100%", marginTop: "1.5rem", padding: 12, fontSize: 14, justifyContent: "center", textDecoration: "none" }}>
            Get started free
          </a>
        </div>

        {/* Pro — featured */}
        <div style={{
          background: "var(--bg-primary)",
          border: "2px solid var(--green-400)",
          borderRadius: "var(--radius-xl)",
          padding: "1.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <span className="section-label" style={{ marginBottom: 0 }}>Pro</span>
            <span className="badge badge-amber" style={{ fontSize: 11 }}>
              <span className="badge-dot badge-dot-amber" />
              Free in beta
            </span>
          </div>
          <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.02em", margin: "0.5rem 0 0.25rem" }}>
            $19–29{" "}
            <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-secondary)" }}>/ seat / month</span>
          </div>
          <p style={{ fontSize: 13, paddingBottom: "1.25rem", borderBottom: "0.5px solid var(--border-subtle)", marginBottom: "1.25rem" }}>
            Rosie does the work. You review and move on.
          </p>
          {proFeatures.map((f) => <FeatureLine key={f.text} {...f} />)}
          <a href="#cta" className="btn-primary" style={{ width: "100%", marginTop: "1.5rem", padding: 12, fontSize: 14, justifyContent: "center", textDecoration: "none" }}>
            Start Pro free — beta access
          </a>
        </div>
      </div>
    </section>
  );
}
