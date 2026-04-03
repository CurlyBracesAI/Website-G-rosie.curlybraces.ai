const problems = [
  {
    title: "Leads go cold",
    body: "Clinicians miss follow-ups. Prospective clients move on. No one tracks the gap.",
  },
  {
    title: "Spreadsheets & paper",
    body: "Intake tracking lives in notebooks and shared docs. Nothing is automated or consistent.",
  },
  {
    title: "No pre-patient tooling",
    body: "Practice management systems don't manage outreach. General CRMs don't understand therapy intake workflows.",
  },
  {
    title: "Expensive alternatives",
    body: "Enterprise tools charge per-seat minimums with no free entry point for small practices.",
  },
];

export default function Problem() {
  return (
    <section className="site-section" id="problem">
      <span className="section-label">The problem</span>
      <h2>Your EHR starts at session one.<br />What about before?</h2>
      <p style={{ maxWidth: 580, marginTop: "0.5rem" }}>
        Every HIPAA-compliant CRM is built for hospitals, priced for enterprises, or designed for patients you already have. Rosie is built for the clients you haven&apos;t met yet: purpose-built for small and medium therapy and wellness practices.
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
        gap: 12,
        marginTop: "2rem",
      }}>
        {problems.map((p) => (
          <div
            key={p.title}
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
            }}
          >
            <h3 style={{ marginBottom: "0.4rem" }}>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
