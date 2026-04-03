const feats = [
  {
    title: "Autonomous planning",
    body: "Rosie reviews your intake pipeline and proactively recommends next steps for each lead.",
  },
  {
    title: "Correspondence drafting",
    body: "Every email and SMS drafted with clinical tone, correct stage language, and personal context.",
  },
  {
    title: "Guided onboarding",
    body: "New staff ask Rosie: she walks them through the intake protocol step by step.",
  },
  {
    title: "Calendar sync",
    body: "Confirmed appointments pushed automatically to Google Calendar or Outlook. Pro feature.",
  },
];

export default function MeetRosie() {
  return (
    <section className="site-section" id="features">
      <span className="section-label">Meet Rosie, your AI</span>
      <h2>Not just automation.<br />An AI trained on your intake process.</h2>
      <p style={{ maxWidth: 560, marginTop: "0.5rem" }}>
        Rosie isn&apos;t a generic chatbot. She&apos;s trained specifically on therapy intake workflows: the stages, the scripts, the clinical sensitivity required. She plans, guides, drafts, and flags.
      </p>

      {/* Chat preview */}
      <div style={{
        background: "var(--bg-primary)",
        border: "0.5px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        marginTop: "1.75rem",
        maxWidth: 500,
      }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--green-600)", marginBottom: 5, lineHeight: 1 }}>Rosie</p>
        <div style={{
          background: "var(--green-50)", color: "var(--green-800)",
          padding: "10px 14px", borderRadius: "12px 12px 12px 3px",
          fontSize: 13, lineHeight: 1.6, marginBottom: 10, maxWidth: "88%",
        }}>
          You have 3 intakes that need attention today. Sarah K. hasn&apos;t responded in 48hrs. I&apos;ve drafted a follow-up for your review. Want me to walk you through the others?
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)", marginBottom: 5, textAlign: "right", lineHeight: 1 }}>You</p>
        <div style={{
          background: "var(--bg-secondary)", color: "var(--text-primary)",
          padding: "10px 14px", borderRadius: "12px 12px 3px 12px",
          fontSize: 13, lineHeight: 1.6, marginBottom: 10,
          maxWidth: "88%", marginLeft: "auto",
        }}>
          Yes, and can you pull up Marcus&apos;s intake notes?
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--green-600)", marginBottom: 5, lineHeight: 1 }}>Rosie</p>
        <div style={{
          background: "var(--green-50)", color: "var(--green-800)",
          padding: "10px 14px", borderRadius: "12px 12px 12px 3px",
          fontSize: 13, lineHeight: 1.6, maxWidth: "88%",
        }}>
          Marcus noted anxiety and availability on Tuesday afternoons. I&apos;ve drafted an intro email referencing those details and suggested two Tuesday slots. Ready to send?
        </div>
      </div>

      {/* Feature bullets */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 14,
        marginTop: "2rem",
      }}>
        {feats.map((f) => (
          <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--green-400)", marginTop: 5, flexShrink: 0,
            }} />
            <div>
              <h3 style={{ marginBottom: 2 }}>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
