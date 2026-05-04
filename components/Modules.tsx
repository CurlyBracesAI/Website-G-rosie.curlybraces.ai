const modules = [
  { icon: "📅", title: "Self-booking widget", desc: "Client-facing scheduling page", tag: "Add-on", tagType: "addon" },
  { icon: "🏥", title: "Insurance & claims",  desc: "Verification & filing",           tag: "Add-on", tagType: "addon" },
  { icon: "📹", title: "Telehealth",          desc: "In-app video sessions",            tag: "Add-on", tagType: "addon" },
  { icon: "📋", title: "Session notes",       desc: "Structured clinical notes",        tag: "Add-on", tagType: "addon" },
  { icon: "📖", title: "Wiley treatment",     desc: "Treatment plan library",           tag: "Add-on", tagType: "addon" },
  { icon: "💬", title: "Between-session",     desc: "Client engagement tools",          tag: "Add-on", tagType: "addon" },
  { icon: "🔒", title: "Patient portal",      desc: "Secure client self-service",       tag: "Add-on", tagType: "addon" },
  { icon: "📊", title: "Outcomes tracking",   desc: "Standardised measures",            tag: "Add-on", tagType: "addon" },
  { icon: "🎙️", title: "Call transcription",  desc: "Requires in-app calling",          tag: "Coming soon", tagType: "soon" },
];

const tagStyles: Record<string, React.CSSProperties> = {
  addon: { background: "var(--green-50)",  color: "var(--green-600)" },
  soon:  { background: "var(--amber-50)",  color: "var(--amber-600)" },
};

export default function Modules() {
  return (
    <section className="site-section" id="modules">
      <span className="section-label">Bolt-on modules</span>
      <h2>Grow with Rosie</h2>
      <p>
        Start with onboarding. Add what you need, when you need it. Each module is an optional paid add-on that plugs into your existing Rosie workflow, available on Pro.
      </p>
      <span style={{
        fontSize: 14, fontWeight: 500,
        background: "var(--amber-50)", color: "var(--amber-600)",
        borderRadius: "var(--radius-md)", padding: "0.75rem 1rem",
        marginTop: "1rem", display: "inline-block",
      }}>
        All modules require Pro. Pricing per module available on request.
      </span>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
        gap: 10,
        marginTop: "1.5rem",
      }}>
        {modules.map((m) => (
          <div
            key={m.title}
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              padding: "1.1rem",
              textAlign: "center",
              border: "0.5px solid var(--border-subtle)",
            }}
          >
            <span style={{ fontSize: 22, marginBottom: "0.5rem", display: "block" }}>{m.icon}</span>
            <h3 style={{ fontSize: 13, color: "var(--text-primary)", marginBottom: 6 }}>{m.title}</h3>
            <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6 }}>{m.desc}</p>
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "var(--radius-pill)",
              display: "inline-block",
              ...tagStyles[m.tagType],
            }}>
              {m.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
