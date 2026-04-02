export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-left">
          <div className="nav-logo">
            <div className="nav-logo-dot" />
            Rosie
          </div>
          <span className="nav-by">by <a href="https://curlybraces.ai" target="_blank" rel="noopener noreferrer">{'{'}curlybraces.ai{'}'}</a></span>
        </div>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button className="btn-primary">Start free — no card needed</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero-wrap">
        <section className="hero">
          <div className="hero-icon-badges">
            <span className="icon-badge">
              <span className="icon-badge-tile tile-amber">⭐</span>
              Beta — Pro plan free while it lasts
            </span>
            <span className="icon-badge">
              <span className="icon-badge-tile tile-indigo">🔒</span>
              HIPAA-compliant
            </span>
            <span className="icon-badge">
              <span className="icon-badge-tile tile-emerald">✓</span>
              No credit card needed
            </span>
          </div>

          <h1>The Intake CRM Built for<br />Therapy &amp; Wellness Practices</h1>
          <p className="hero-sub">
            From first contact to first session — Rosie captures every lead, drafts every follow-up,
            and hands off seamlessly to your EHR. Built for solo and group practices.
          </p>

          <div className="hero-btns">
            <button className="btn-primary btn-lg">Start free trial →</button>
            <button className="btn-secondary btn-lg">See how it works</button>
          </div>

          <div className="comp-pills">
            <span className="comp-pill">✓ No enterprise pricing</span>
            <span className="comp-pill">✓ No generic CRMs</span>
            <span className="comp-pill">✓ No steep learning curves</span>
            <span className="comp-pill">✓ No missing therapy workflows</span>
            <span className="comp-pill">✓ No minimum user counts</span>
            <span className="comp-pill">✓ No paywalled entry point</span>
          </div>
        </section>
      </div>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-inner">
          {[
            { num: '85%', label: 'Less admin time per inquiry' },
            { num: '< 2 min', label: 'Avg. response time' },
            { num: '0 leads', label: 'Fall through the cracks' },
            { num: '100%', label: 'HIPAA-compliant from day one' },
          ].map(({ num, label }) => (
            <div className="stat-item" key={label}>
              <div className="stat-num">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* THE PROBLEM */}
      <section className="section" id="problem">
        <div className="section-head">
          <span className="label">The problem</span>
          <h2>Your EHR starts at session one.<br />What about before?</h2>
          <p>
            HIPAA-compliant CRMs are built for hospitals, priced for enterprises, or designed for
            patients you already have. Rosie is built for the clients you haven&apos;t met yet —
            purpose-built for small and medium therapy and wellness practices.
          </p>
        </div>

        <div className="problem-grid">
          {[
            { icon: '🧊', title: 'Leads go cold', body: "You're busy! Clinicians miss follow-ups. Prospective clients move on. No one tracks the gap." },
            { icon: '📋', title: 'Spreadsheets & paper', body: 'Intake tracking lives in notebooks and shared docs. Nothing is automated or consistent.' },
            { icon: '🔧', title: 'No pre-patient tooling', body: "Practice management systems don't manage outreach. General CRMs don't understand therapy intake." },
            { icon: '💸', title: 'Expensive alternatives', body: 'Enterprise tools charge per-seat minimums with no free entry point for small practices.' },
          ].map(({ icon, title, body }) => (
            <div className="prob-card" key={title}>
              <span className="prob-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <div className="section-tinted">
        <section className="section" id="how-it-works">
          <div className="section-head">
            <span className="label">How it works</span>
            <h2>First contact to first session — on autopilot</h2>
          </div>

          <div className="steps-grid">
            {[
              { n: '1', title: 'Lead arrives', body: 'Via email, phone, or web form. Rosie captures and creates the intake automatically.' },
              { n: '2', title: 'Rosie gets to work', body: 'Reads emails and intake details, immediately building context around each new lead.' },
              { n: '3', title: 'AI drafts outreach', body: 'Stage-appropriate email and SMS — reviewed and sent in one click. No writing from scratch.' },
              { n: '4', title: 'Automated follow-up', body: '24hr, 48hr, 72hr sequences run automatically. Rosie flags anything that needs attention.' },
              { n: '5', title: 'Hand off', body: 'First session booked — pass cleanly to your EHR or practice management system and move on.' },
            ].map(({ n, title, body }) => (
              <div className="step-card" key={n}>
                <div className="step-num">{n}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <hr className="divider" />

      {/* MEET ROSIE */}
      <section className="section" id="features">
        <div className="section-head">
          <span className="label">Meet Rosie — your AI</span>
          <h2>Not just automation.<br />An AI trained on your intake process.</h2>
          <p>
            Rosie isn&apos;t a generic chatbot. She&apos;s trained specifically on therapy intake
            workflows — the stages, the scripts, the clinical sensitivity required. She plans, guides,
            drafts, and flags.
          </p>
        </div>

        <div className="chat-preview">
          <div className="chat-header">
            <div className="chat-header-dot" />
            <div className="chat-header-dot" />
            <div className="chat-header-dot" />
            <span style={{ marginLeft: 6 }} className="chat-header-name">Rosie</span>
            <span style={{ marginLeft: 6 }} className="chat-header-status">· Active now</span>
          </div>
          <div className="chat-body">
            <div className="chat-label">Rosie</div>
            <div className="chat-bubble chat-rosie">
              You have 3 intakes that need attention today. Sarah K. hasn&apos;t responded in 48hrs —
              I&apos;ve drafted a follow-up for your review. Want me to walk you through the others?
            </div>
            <div className="chat-label-user">You</div>
            <div className="chat-bubble chat-user">
              Yes — and can you pull up Marcus&apos;s intake notes?
            </div>
            <div className="chat-label">Rosie</div>
            <div className="chat-bubble chat-rosie" style={{ marginBottom: 0 }}>
              Marcus noted anxiety and availability on Tuesday afternoons. I&apos;ve drafted an intro
              email referencing those details and suggested two Tuesday slots. Ready to send?
            </div>
          </div>
        </div>

        <div className="rosie-feats">
          {[
            { icon: '🧠', title: 'Autonomous planning', body: 'Rosie reviews your intake pipeline and proactively recommends next steps for each lead.' },
            { icon: '✍️', title: 'Correspondence drafting', body: 'Every email and SMS drafted with clinical tone, correct stage language, and personal context.' },
            { icon: '🧭', title: 'Guided onboarding', body: 'New staff ask Rosie — she walks them through the intake protocol step by step.' },
            { icon: '📆', title: 'Calendar sync', body: 'Confirmed appointments pushed automatically to Google Calendar or Outlook. Pro feature.' },
          ].map(({ icon, title, body }) => (
            <div className="rosie-feat" key={title}>
              <div className="feat-icon">{icon}</div>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* PRICING */}
      <div className="section-tinted">
        <section className="section" id="pricing">
          <div className="section-head">
            <span className="label">Pricing</span>
            <h2>Start free. Upgrade when you&apos;re ready.</h2>
            <p>A free tier, always. Pro is free for all beta practices — for as long as you&apos;re with us.</p>
          </div>

          <div className="pricing-grid">
            {/* FREE */}
            <div className="price-card">
              <div className="card-header">
                <span className="label" style={{ margin: 0 }}>Free — forever</span>
              </div>
              <div className="price-amount">$0</div>
              <p className="price-desc">Everything in one place. You run it manually — Rosie holds the data.</p>
              {['Unlimited lead profiles', 'Manual intake entry', 'All leads in one dashboard', 'HIPAA-compliant storage', 'EHR handoff notes'].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
              {['AI automation & Rosie AI', 'Automated follow-up sequences', 'Calendar sync', 'Bolt-on modules'].map(f => (
                <div className="price-line" key={f}><div className="dash-icon">—</div>{f}</div>
              ))}
              <button className="btn-secondary price-btn">Get started free</button>
            </div>

            {/* PRO */}
            <div className="price-card featured">
              <div className="featured-accent">⭐ Most Popular — Free during beta</div>
              <div className="card-header">
                <span className="label" style={{ margin: 0 }}>Pro</span>
                <span className="icon-badge" style={{ padding: '5px 10px 5px 5px', fontSize: 11, borderRadius: 8 }}>
                  <span className="icon-badge-tile tile-amber" style={{ width: 20, height: 20, borderRadius: 5, fontSize: 10 }}>⭐</span>
                  Free in beta
                </span>
              </div>
              <div className="price-amount">$19–29 <span>/ seat / month</span></div>
              <p className="price-desc">Rosie does the work. You review and move on.</p>
              {[
                'Everything in Free',
                'Automated lead capture from all sources',
                'Full AI follow-up sequences',
                'Rosie AI assistant & chatbot',
                'Autonomous intake planning',
                'Inbound email intake',
                'Calendar sync — Google & Outlook',
                'Bolt-on modules available',
              ].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
              <button className="btn-primary price-btn">Start Pro free — beta access →</button>
            </div>
          </div>
        </section>
      </div>

      <hr className="divider" />

      {/* BOLT-ON MODULES */}
      <section className="section" id="modules">
        <div className="section-head">
          <span className="label">Bolt-on modules</span>
          <h2>Grow with Rosie</h2>
          <p>
            Start with intake. Add what you need, when you need it. Each module plugs into your
            existing Rosie workflow — available on Pro.
          </p>
        </div>
        <span className="modules-intro">⚡ All modules require Pro · Pricing on request</span>

        <div className="modules-grid">
          {[
            { icon: '📅', title: 'Scheduling', desc: 'Client-facing scheduling page' },
            { icon: '🏥', title: 'Insurance & claims', desc: 'Verification & filing' },
            { icon: '📹', title: 'Telehealth', desc: 'In-app video sessions' },
            { icon: '📋', title: 'Session notes', desc: 'Structured clinical notes' },
            { icon: '📖', title: 'Wiley treatment', desc: 'Treatment plan library' },
            { icon: '💬', title: 'Between-session', desc: 'Client engagement tools' },
            { icon: '🔒', title: 'Patient portal', desc: 'Secure client self-service' },
            { icon: '📊', title: 'Outcomes tracking', desc: 'Standardised measures' },
            { icon: '🏅', title: 'Credentialing', desc: 'Get credentialed for free' },
            { icon: '📞', title: 'In-app calling', desc: 'Make & receive calls in Rosie' },
            { icon: '🎙️', title: 'Call transcription', desc: 'Requires in-app calling' },
          ].map(({ icon, title, desc }) => (
            <div className="module-card" key={title}>
              <span className="module-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="module-tag module-tag-calling">Coming soon</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* TRUST */}
      <div className="section-tinted">
        <section className="section" id="trust">
          <div className="section-head">
            <span className="label">Trust &amp; compliance</span>
            <h2>Built for healthcare from the ground up</h2>
          </div>

          <div className="trust-stats">
            {[
              { num: 'HIPAA', label: 'Compliant infrastructure' },
              { num: 'AES-256', label: 'Encryption at rest & in transit' },
              { num: '100%', label: 'Human-in-the-loop by default' },
              { num: 'AWS', label: 'Enterprise-grade infrastructure' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="trust-stat-num">{num}</div>
                <div className="trust-stat-label">{label}</div>
              </div>
            ))}
          </div>

          <div className="trust-pills">
            {[
              '🔒 HIPAA-compliant infrastructure',
              '🧠 Built for psychotherapy & wellness',
              '👤 Solo to group practices',
              '🔗 Works with any EHR',
              '0️⃣ No minimum user count',
              '🆓 Free tier always available',
            ].map(t => (
              <div className="trust-pill" key={t}>{t}</div>
            ))}
          </div>

          <div className="quote-card">
            <blockquote>
              &ldquo;Before Rosie, we were tracking everything in a spreadsheet. Leads would go cold
              and we wouldn&apos;t even know. Now every intake has a clear next step.&rdquo;
            </blockquote>
            <cite>— Sean, The Flatiron Center for Psychotherapy · Beta customer</cite>
          </div>
        </section>
      </div>

      <hr className="divider" />

      {/* FINAL CTA */}
      <section className="section">
        <div className="cta-box">
          <span className="icon-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 10, padding: '7px 16px 7px 7px' }}>
            <span className="icon-badge-tile tile-amber" style={{ width: 26, height: 26, borderRadius: 7, fontSize: 13 }}>⭐</span>
            Beta — limited spots available
          </span>
          <h2>Start with intake.<br />Stay for everything else.</h2>
          <p>
            Free forever on the basic plan. Pro is free for all beta practices. No credit card.
            No minimum users. HIPAA-compliant from day one.
          </p>
          <div className="cta-form">
            <input type="email" placeholder="your@practice.com" />
            <button className="btn-primary">Get started free →</button>
          </div>
          <p className="fine">By signing up you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <div className="footer-brand-dot" />
              Rosie
            </div>
            <div className="footer-sub">
              Part of <a href="https://curlybraces.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green-500)', fontWeight: 600 }}>{'{'}curlybraces.ai{'}'}</a> · © 2026 CurlyBraces AI
            </div>
          </div>
          <div className="footer-links">
            <a href="https://curlybraces.ai" target="_blank" rel="noopener noreferrer">curlybraces.ai</a>
            <a href="#">HIPAA-compliant</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="mailto:support@curlybraces.ai">support@curlybraces.ai</a>
          </div>
        </div>
      </footer>
    </>
  );
}
