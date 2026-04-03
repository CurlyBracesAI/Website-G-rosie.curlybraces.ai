const steps = [
  {
    num: "1",
    title: "Lead arrives",
    body: "Via email, phone, or web form. Rosie captures and creates the intake automatically.",
  },
  {
    num: "2",
    title: "Rosie gets to work",
    body: "Reads emails and intake details, immediately building context around each new lead.",
  },
  {
    num: "3",
    title: "AI drafts outreach",
    body: "Stage-appropriate email and SMS — reviewed and sent in one click. No writing from scratch.",
  },
  {
    num: "4",
    title: "Automated follow-up",
    body: "24hr, 48hr, 72hr sequences run automatically. Rosie flags anything that needs attention.",
  },
  {
    num: "5",
    title: "Hand off",
    body: "First session booked — pass cleanly to your EHR or practice management system and move on.",
  },
];

export default function HowItWorks() {
  return (
    <section className="site-section" id="how-it-works">
      <span className="section-label">How it works</span>
      <h2>First contact to first session — on autopilot</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
        marginTop: "2rem",
      }}>
        {steps.map((s) => (
          <div
            key={s.num}
            style={{
              background: "var(--bg-primary)",
              border: "0.5px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "var(--green-50)", color: "var(--green-800)",
              fontSize: 11, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "0.85rem",
            }}>
              {s.num}
            </div>
            <h3 style={{ marginBottom: "0.4rem" }}>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
