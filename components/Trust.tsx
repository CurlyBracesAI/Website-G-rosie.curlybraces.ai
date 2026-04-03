const trustPills = [
  "HIPAA-compliant infrastructure",
  "Built for psychotherapy & wellness",
  "Solo to group practices",
  "Works with any EHR or practice management system",
  "No minimum user count",
  "Free tier always available",
];

export default function Trust() {
  return (
    <section className="site-section" id="trust">
      <span className="section-label">Trust &amp; compliance</span>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "1.5rem" }}>
        {trustPills.map((pill) => (
          <div
            key={pill}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px",
              border: "0.5px solid var(--border-medium)",
              borderRadius: "var(--radius-pill)",
              fontSize: 12, color: "var(--text-secondary)",
            }}
          >
            <span className="check-icon">✓</span>
            {pill}
          </div>
        ))}
      </div>

      <div style={{
        background: "var(--bg-secondary)",
        borderLeft: "3px solid var(--green-400)",
        borderRadius: "0 var(--radius-lg) var(--radius-lg) 0",
        padding: "1.25rem 1.5rem",
        marginTop: "2rem",
      }}>
        <blockquote style={{ fontStyle: "italic", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
          &ldquo;Before Rosie, we were tracking everything in a spreadsheet. Leads would go cold and we wouldn&apos;t even know. Now every intake has a clear next step.&rdquo;
        </blockquote>
        <cite style={{ fontSize: 13, color: "var(--text-secondary)", fontStyle: "normal" }}>
          Sean, The Flatiron Center for Psychotherapy · Beta customer
        </cite>
      </div>
    </section>
  );
}
