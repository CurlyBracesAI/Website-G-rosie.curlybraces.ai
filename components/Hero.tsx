export default function Hero() {
  const compPills = [
    "Enterprise pricing",
    "Generic CRMs",
    "Steep learning curves",
    "No therapy workflows",
    "Minimum user counts",
    "No free entry point",
  ];

  return (
    <section style={{ textAlign: "center", padding: "6rem 2rem 5rem", maxWidth: 1350, margin: "0 auto" }}>
      {/* Badges */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        <span className="badge badge-amber">
          <span className="badge-dot badge-dot-amber" />
          Beta — Pro plan free while it lasts
        </span>
        <span className="badge badge-teal">
          <span className="badge-dot badge-dot-teal" />
          HIPAA-compliant
        </span>
      </div>

      <h1 style={{ marginBottom: "1.25rem" }}>
        The intake CRM built for<br />therapy &amp; wellness practices
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.65, color: "var(--text-secondary)", maxWidth: 580, margin: "0 auto 2rem" }}>
        From first contact to first session — Rosie captures every lead, drafts every follow-up, and hands off seamlessly to your EHR. Built for solo and group practices of all sizes.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
        <a href="#cta" className="btn-primary">Start free trial</a>
        <a href="#how-it-works" className="btn-secondary">See how it works</a>
      </div>

      {/* Competitor pills with strikethrough */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {compPills.map((label) => (
          <span
            key={label}
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              background: "var(--bg-secondary)",
              padding: "5px 13px",
              borderRadius: "var(--radius-pill)",
              border: "0.5px solid var(--border-subtle)",
            }}
          >
            <s style={{ textDecorationColor: "var(--coral-400)" }}>{label}</s>
          </span>
        ))}
      </div>
    </section>
  );
}
