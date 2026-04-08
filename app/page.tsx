import {
  IcBuilding, IcBrain, IcGrad, IcZap, IcUsers, IcLock, IcSnowflake,
  IcClipboard, IcWrench, IcMoney, IcCompass, IcCalendar, IcBook,
  IcChat, IcBarChart, IcAward, IcPhone, IcMic, IcShield, IcHeart,
  IcPerson, IcLink, IcTag, IcGift, IcEdit, IcArrowRight,
  IcStar, IcCheck, IcInfinity, IcClock,
  IcVideo, IcCross, IcFileText,
} from './components/RosieIcons';

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
          <button className="btn-primary">Start free, no card needed</button>
        </div>
      </nav>

      {/* HERO — split layout with dashboard bleed */}
      <div className="hero-wrap">
        <section className="hero hero-split">

          {/* LEFT: copy */}
          <div className="hero-copy">
            <div className="hero-icon-badges">
              <span className="icon-badge">
                <span className="icon-badge-tile tile-coral"><IcStar /></span>
                <span><strong>Beta</strong>: Pro plan free while it lasts</span>
              </span>
              <span className="icon-badge">
                <span className="icon-badge-tile tile-navy"><IcLock /></span>
                <span><strong>HIPAA</strong>-compliant from day one</span>
              </span>
              <span className="icon-badge">
                <span className="icon-badge-tile tile-emerald"><IcCheck /></span>
                <span><strong>No</strong> credit card needed</span>
              </span>
            </div>

            <h1>Rosie AI: Patient Onboarding CRM Assistant, Built for<br />Psychotherapy &amp; Wellness Practices</h1>
            <p className="hero-sub">
              From first contact to first session, Rosie AI captures every lead, drafts every follow-up,
              manages the workflow and hands off seamlessly to your EHR.
              <br />
              Tailored AI for solo and group practices.
            </p>

            <div className="hero-btns">
              <button className="btn-primary btn-lg">Start free trial →</button>
              <button className="btn-secondary btn-lg">See how it works</button>
            </div>
          </div>

          {/* RIGHT: dashboard screenshot — bleeds to right viewport edge */}
          <div className="hero-bleed-col">
            <div className="browser-frame hero-bleed-browser">
              <div className="browser-bar">
                <span className="browser-dot browser-dot-red" />
                <span className="browser-dot browser-dot-yellow" />
                <span className="browser-dot browser-dot-green" />
                <span className="browser-url-bar">app.rosie.curlybraces.ai · Dashboard</span>
              </div>
              <img src="/screenshots/screen-01.png" alt="Rosie dashboard — full intake pipeline view" loading="eager" />
            </div>
          </div>

        </section>
      </div>

      {/* DIFFERENTIATOR TILES — white strip below hero */}
      <div className="hero-tiles-strip">
        <div className="tile-grid-3">
          {[
            { tile: 'tile-coral',   icon: <IcBuilding />, title: 'No enterprise pricing',    desc: 'Priced for real practices, not hospitals' },
            { tile: 'tile-violet',  icon: <IcBrain />,    title: 'No generic CRMs',          desc: 'Built for therapy intake, not sales' },
            { tile: 'tile-sky',     icon: <IcGrad />,     title: 'No steep learning curves', desc: 'Up and running in under an hour' },
            { tile: 'tile-amber',   icon: <IcZap />,      title: 'No missing workflows',     desc: 'Every intake stage is covered' },
            { tile: 'tile-emerald', icon: <IcUsers />,    title: 'No minimum user counts',   desc: 'Solo to group, same price logic' },
            { tile: 'tile-navy',    icon: <IcLock />,     title: 'No paywalled entry point', desc: 'Free tier, always. No bait and switch' },
          ].map(({ tile, icon, title, desc }) => (
            <div className="tile-card" key={title}>
              <span className={`tile-icon ${tile}`}>{icon}</span>
              <span className="tile-card-text">
                <span className="tile-card-title">{title}</span>
                <span className="tile-card-desc">{desc}</span>
              </span>
            </div>
          ))}
        </div>
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

        {/* Two-column layout: left = copy + 2×2 cards, right = tall timeline screenshot */}
        <div className="problem-layout">
          <div className="problem-left">
            <div className="problem-section-head">
              <span className="label">The problem</span>
              <h2>Your EHR starts at session one.<br />What about before?</h2>
              <p>
                Most HIPAA-compliant CRMs are built and priced for larger healthcare enterprises.
                Rosie is purpose-built for small and medium psychotherapy and wellness practices.
                Designed for onboarding, to be used before you even meet your patients, to the point of handing over to EHR.
              </p>
            </div>
            <div className="problem-cards-2x2">
              {[
                { tile: 'tile-sky',    icon: <IcSnowflake />, title: 'Leads go cold',          body: "You're busy! Clinicians miss follow-ups. Prospective clients move on. No one tracks the gap." },
                { tile: 'tile-amber',  icon: <IcClipboard />, title: 'Spreadsheets & paper',   body: 'Intake tracking lives in notebooks and shared docs. Nothing is automated or consistent.' },
                { tile: 'tile-coral',  icon: <IcWrench />,    title: 'No pre-patient tooling', body: "Practice management systems don't manage outreach. General CRMs don't understand therapy intake." },
                { tile: 'tile-violet', icon: <IcMoney />,     title: 'Expensive alternatives', body: 'Enterprise tools charge per-seat minimums with no free entry point for small practices.' },
              ].map(({ tile, icon, title, body }) => (
                <div className="tile-card tile-card-tall" key={title}>
                  <span className={`tile-icon ${tile}`}>{icon}</span>
                  <span className="tile-card-text">
                    <span className="tile-card-title">{title}</span>
                    <span className="tile-card-desc">{body}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="timeline-right-panel">
            <img src="/screenshots/screen-08.png" alt="Rosie activity timeline — chronological intake log showing all outreach events" loading="lazy" />
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* HOW IT WORKS */}
      <div className="section-bg section-bg-violet">
        <section className="section" id="how-it-works">
          <div className="section-head">
            <span className="label">How it works</span>
            <h2>First contact to first session, on autopilot</h2>
            <p>
            Based on a simple linear workflow, Rosie captures the lead's information, drafts outreach emails, reminds when calls should take place, logs notes, and keeps the process on schedule.
          </p>
          </div>

          <div className="steps-grid">
            {[
              { n: '1', title: 'Lead arrives', body: 'Via email, phone, or web form. Rosie captures and creates the intake automatically.' },
              { n: '2', title: 'Rosie gets to work', body: 'Reads emails and intake details, immediately building context around each new lead.' },
              { n: '3', title: 'AI drafts outreach', body: 'Stage-appropriate email and SMS, reviewed and sent in one click. No writing from scratch.' },
              { n: '4', title: 'Automated follow-up', body: '24hr, 48hr, 72hr sequences run automatically. Rosie flags anything that needs attention.' },
              { n: '5', title: 'Hand off', body: 'First session booked. Pass cleanly to your EHR or practice management system and move on.' },
            ].map(({ n, title, body }) => (
              <div className="step-card" key={n}>
                <div className="step-num">{n}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>

          {/* Stages timeline screenshot */}
          <div className="screenshot-panel">
            <div className="browser-frame">
              <div className="browser-bar">
                <span className="browser-dot browser-dot-red" />
                <span className="browser-dot browser-dot-yellow" />
                <span className="browser-dot browser-dot-green" />
                <span className="browser-url-bar">app.rosie.curlybraces.ai · Intake · Andy Collectot · Stages</span>
              </div>
              <img src="/screenshots/screen-05.png" alt="Rosie 7-step intake stages — Welcome through Consultation" loading="lazy" />
            </div>
            <p className="screenshot-caption">Rosie tracks each lead through 7 structured stages — and tells you exactly where every intake stands</p>
          </div>

        </section>
      </div>

      <hr className="divider" />

      {/* MEET ROSIE */}
      <div className="section-bg section-bg-sky">
      <section className="section" id="features">
        <div className="section-head">
          <span className="label">Meet Rosie, your AI</span>
          <h2>Not just automation.<br />An AI trained on your intake process.</h2>
          <p>
            Rosie isn&apos;t a generic chatbot. She&apos;s trained specifically on therapy intake
            workflows: the stages, the scripts, the clinical sensitivity required. She plans, guides,
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
              You have 3 intakes that need attention today. Sarah K. hasn&apos;t responded in 48hrs.
              I&apos;ve drafted a follow-up for your review. Want me to walk you through the others?
            </div>
            <div className="chat-label-user">You</div>
            <div className="chat-bubble chat-user">
              Yes, and can you pull up Marcus&apos;s intake notes?
            </div>
            <div className="chat-label">Rosie</div>
            <div className="chat-bubble chat-rosie" style={{ marginBottom: 0 }}>
              Marcus noted anxiety and availability on Tuesday afternoons. I&apos;ve drafted an intro
              email referencing those details and suggested two Tuesday slots. Ready to{'\u00a0'}send?
            </div>
          </div>
        </div>

        {/* AI recommendation panel screenshot */}
        <div className="screenshot-panel" style={{ marginTop: '2.5rem' }}>
          <div className="browser-frame">
            <div className="browser-bar">
              <span className="browser-dot browser-dot-red" />
              <span className="browser-dot browser-dot-yellow" />
              <span className="browser-dot browser-dot-green" />
              <span className="browser-url-bar">app.rosie.curlybraces.ai · Rosie AI Assistant · Analyze</span>
            </div>
            <img src="/screenshots/screen-06.png" alt="Rosie AI recommendation — Pause Follow-ups with 85% confidence and full reasoning" loading="lazy" />
          </div>
          <p className="screenshot-caption">Rosie surfaces the right action at the right time — with her reasoning visible, so you stay in control</p>
        </div>

        {/* Feature tiles - replacing rosie-feats */}
        <div className="tile-grid-2" style={{ marginTop: '2.5rem' }}>
          {[
            { tile: 'tile-violet', icon: <IcBrain />,    title: 'Autonomous planning',     desc: 'Rosie reviews your intake pipeline and proactively recommends next steps for each lead.' },
            { tile: 'tile-coral',  icon: <IcEdit />,     title: 'Correspondence drafting', desc: 'Every email and SMS drafted with clinical tone, correct stage language, and personal context.' },
            { tile: 'tile-sky',    icon: <IcCompass />,  title: 'Guided onboarding',       desc: 'New staff ask Rosie; she walks them through the intake protocol step by step.' },
            { tile: 'tile-amber',  icon: <IcCalendar />, title: 'Calendar sync',           desc: 'Confirmed appointments pushed automatically to Google Calendar or Outlook. Pro+ feature.' },
          ].map(({ tile, icon, title, desc }) => (
            <div className="tile-card tile-card-tall" key={title}>
              <span className={`tile-icon ${tile}`}>{icon}</span>
              <span className="tile-card-text">
                <span className="tile-card-title">{title}</span>
                <span className="tile-card-desc">{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
      </div>

      <hr className="divider" />

      {/* PRICING */}
      <div className="section-bg section-bg-coral">
        <section className="section" id="pricing">
          <div className="section-head">
            <span className="label">Pricing</span>
            <h2>Start free. Upgrade when you&apos;re ready.</h2>
            <p>
              A free tier, always. Pro is free for all beta practices.
              <br />
              For as long as you&apos;re with us.
            </p>
          </div>

          <div className="pricing-grid pricing-grid-3">
            {/* FREE */}
            <div className="price-card">
              <div className="featured-accent free-accent">Always free, no card needed</div>
              <div className="card-header">
                <span className="label" style={{ margin: 0 }}>Free</span>
                <span className="icon-badge" style={{ padding: '5px 10px 5px 5px', fontSize: 12, borderRadius: 8 }}>
                  <span className="icon-badge-tile tile-sky" style={{ width: 20, height: 20, borderRadius: 5, fontSize: 11 }}><IcInfinity /></span>
                  Forever
                </span>
              </div>
              <div className="price-amount">$0</div>
              <p className="price-desc">Everything in one place. You run it manually. Rosie holds the data.</p>
              {['Unlimited lead profiles', 'Manual intake entry', 'All leads in one dashboard', 'HIPAA-compliant storage', 'EHR handoff notes'].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
              {['AI automation & Rosie AI', 'Automated follow-up sequences', 'Calendar sync', 'In-app calling', 'Bolt-on modules'].map(f => (
                <div className="price-line" key={f}><div className="dash-icon">-</div>{f}</div>
              ))}
              <button className="btn-secondary price-btn">Get started free</button>
            </div>

            {/* PRO */}
            <div className="price-card featured">
              <div className="featured-accent">Available now. Free during beta</div>
              <div className="card-header">
                <span className="label" style={{ margin: 0 }}>Pro</span>
                <span className="icon-badge" style={{ padding: '5px 10px 5px 5px', fontSize: 12, borderRadius: 8 }}>
                  <span className="icon-badge-tile tile-emerald" style={{ width: 20, height: 20, borderRadius: 5, fontSize: 11 }}><IcCheck /></span>
                  Live in beta
                </span>
              </div>
              <div className="price-amount">$19 <span>/ seat / month</span></div>
              <p className="price-desc">Rosie does the work. You review and move on.</p>
              {[
                'Everything in Free',
                'Automated lead capture from all sources',
                'Full AI follow-up sequences',
                'Rosie AI assistant & chatbot',
                'Autonomous intake planning',
                'Inbound email intake',
              ].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
              {['Calendar sync (Google & Outlook)', 'In-app calling', 'Bolt-on modules'].map(f => (
                <div className="price-line" key={f}><div className="dash-icon">-</div>{f}</div>
              ))}
              <button className="btn-primary price-btn">Start Pro free: beta access →</button>
            </div>

            {/* PRO+ */}
            <div className="price-card pro-plus">
              <div className="featured-accent pro-plus-accent">Coming soon</div>
              <div className="card-header">
                <span className="label" style={{ margin: 0 }}>Pro+</span>
                <span className="icon-badge" style={{ padding: '5px 10px 5px 5px', fontSize: 12, borderRadius: 8 }}>
                  <span className="icon-badge-tile tile-amber" style={{ width: 20, height: 20, borderRadius: 5, fontSize: 11 }}><IcClock /></span>
                  Coming soon
                </span>
              </div>
              <div className="price-amount">$29 <span>/ seat / month</span></div>
              <p className="price-desc">Everything in Pro, plus deep integrations and calling.</p>
              {[
                'Everything in Pro',
                'Calendar sync (Google & Outlook)',
                'In-app calling (call transcription)',
                'Bolt-on modules available',
              ].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
              <button className="btn-primary price-btn pro-plus-btn">Start Pro+ free: beta access →</button>
            </div>
          </div>
        </section>
      </div>

      <hr className="divider" />

      {/* BOLT-ON MODULES */}
      <section className="section" id="modules">
        <div className="section-head">
          <span className="label">Bolt-on modules</span>
          <h2>Grow with Rosie, at your own pace</h2>
          <p>
            Start with onboarding your patients, then let Rosie grow alongside your practice. Every module below is on our roadmap. Activate what you need, when you need it. No forced upgrades, no bloated all-in-one you&apos;ll never fully use.
          </p>
        </div>

        <div className="tile-grid-3" style={{ marginTop: '2rem' }}>
          {[
            {
              tile: 'tile-emerald',
              icon: <IcGrad />,
              title: 'No EHR yet?',
              desc: 'Start with intake. Add scheduling, notes, and billing as you need them. Rosie becomes your all-in-one practice platform, built from the ground up for therapy and wellness.',
            },
            {
              tile: 'tile-sky',
              icon: <IcLink />,
              title: 'Already have an EHR?',
              desc: 'No disruption. Rosie handles everything before session one, then hands off cleanly to your existing system. Use as much or as little as you need.',
            },
            {
              tile: 'tile-navy',
              icon: <IcBuilding />,
              title: 'Ready to consolidate?',
              desc: 'As you activate modules, Rosie gradually replaces the need for separate tools. One platform, one price, built for the way your practice actually works.',
            },
          ].map(({ tile, icon, title, desc }) => (
            <div className="tile-card tile-card-tall" key={title}>
              <span className={`tile-icon ${tile}`}>{icon}</span>
              <span className="tile-card-text">
                <span className="tile-card-title">{title}</span>
                <span className="tile-card-desc">{desc}</span>
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
          <span className="badge badge-amber" style={{ fontSize: 16, padding: '12px 22px', fontWeight: 600 }}>
            All modules coming soon. Available to beta practices first.
          </span>
        </div>

        <div className="tile-grid-3">
          {[
            { tile: 'tile-sky',     icon: <IcCalendar />,  title: 'Scheduling',         desc: 'Client-facing scheduling page' },
            { tile: 'tile-emerald', icon: <IcCross />,     title: 'Insurance & claims', desc: 'Verification & filing' },
            { tile: 'tile-violet',  icon: <IcVideo />,     title: 'Telehealth',         desc: 'In-app video sessions' },
            { tile: 'tile-navy',    icon: <IcFileText />,  title: 'Session notes',      desc: 'Structured clinical notes' },
            { tile: 'tile-amber',   icon: <IcBook />,      title: 'Wiley treatment',    desc: 'Treatment plan library' },
            { tile: 'tile-rose',    icon: <IcChat />,      title: 'Between-session',    desc: 'Client engagement tools' },
            { tile: 'tile-coral',   icon: <IcLock />,      title: 'Patient portal',     desc: 'Secure client self-service' },
            { tile: 'tile-sky',     icon: <IcBarChart />,  title: 'Outcomes tracking',  desc: 'Standardised measures' },
            { tile: 'tile-amber',   icon: <IcAward />,     title: 'Credentialing',      desc: 'Get credentialed for free' },

          ].map(({ tile, icon, title, desc }) => (
            <div className="tile-card" key={title}>
              <span className={`tile-icon ${tile}`}>{icon}</span>
              <span className="tile-card-text">
                <span className="tile-card-title">{title}</span>
                <span className="tile-card-desc">{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* TRUST */}
      <div className="section-bg section-bg-emerald">
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

          {/* Replacing trust pills with tile cards */}
          <div className="tile-grid-3">
            {[
              { tile: 'tile-navy',    icon: <IcShield />,  title: 'HIPAA-compliant',    desc: 'Secure infrastructure, certified' },
              { tile: 'tile-violet',  icon: <IcHeart />,   title: 'Built for therapy',  desc: 'Psychotherapy & wellness practices' },
              { tile: 'tile-emerald', icon: <IcPerson />,  title: 'Any practice size',  desc: 'Solo to group, no minimums' },
              { tile: 'tile-sky',     icon: <IcLink />,    title: 'Works with any EHR', desc: 'Seamless handoff at session one' },
              { tile: 'tile-amber',   icon: <IcTag />,     title: 'No user minimums',   desc: 'Pay only for what you use' },
              { tile: 'tile-coral',   icon: <IcGift />,    title: 'Free tier, always',  desc: 'No bait and switch, ever' },
            ].map(({ tile, icon, title, desc }) => (
              <div className="tile-card" key={title}>
                <span className={`tile-icon ${tile}`}>{icon}</span>
                <span className="tile-card-text">
                  <span className="tile-card-title">{title}</span>
                  <span className="tile-card-desc">{desc}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="quote-card">
            <blockquote>
              &ldquo;Before Rosie, we were tracking everything in a spreadsheet. Leads would go cold
              and we wouldn&apos;t even know. Now every intake has a clear next step.&rdquo;
            </blockquote>
            <cite>Sean, The Flatiron Center for Psychotherapy · Beta customer</cite>
          </div>
        </section>
      </div>

      <hr className="divider" />

      {/* FINAL CTA */}
      <section className="section">
        <div className="cta-box">
          <span className="icon-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 10, padding: '7px 16px 7px 7px' }}>
            <span className="icon-badge-tile tile-coral" style={{ width: 26, height: 26, borderRadius: 7, fontSize: 14 }}><IcStar /></span>
            Beta: limited spots available
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
              Part of <a href="https://curlybraces.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral-500)', fontWeight: 600 }}>{'{'}curlybraces.ai{'}'}</a> · © 2026 CurlyBraces AI
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

