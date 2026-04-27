import {
  IcBrain, IcSnowflake,
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
            RosieAI
          </div>
          <span className="nav-by">by <a href="https://curlybraces.ai" target="_blank" rel="noopener noreferrer">{'{'}curlybraces.ai{'}'}</a></span>
        </div>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="https://intake.rosie.curlybraces.ai/" className="btn-split-pill" style={{ textDecoration: "none" }}>
            <span className="btn-split-badge"><IcStar /> Beta</span>
            <span className="btn-split-label">Get Started Free →</span>
          </a>
        </div>
      </nav>

      {/* HERO — split layout with dashboard bleed */}
      <div className="hero-wrap">
        <section className="hero hero-split">

          {/* LEFT: copy */}
          <div className="hero-copy">
            <h1>
              Build Your Practice with RosieAI:
              <span className="hero-heading-sub">The Intake & Growth Platform  Engineered for Psychotherapy and Wellness Practices</span>
            </h1>
            <p className="hero-pain">
              Are new patient inquiries falling through the cracks, leads dissappearing, therapist missing targets, slow growth?<br />
              <span className="hero-pain-bold">RosieAI takes care of it all, with competive intelligence.</span><br />
            </p>
            <p className="hero-sub">
              RosieAI captures every lead, drafts every follow-up, manages the intake workflow, and hands off seamlessly to your EHR. HIPAA-compliant from day one, built for solo and group practices.
            </p>

            <div className="hero-btns">
              <div>
                <a href="https://intake.rosie.curlybraces.ai/" className="btn-primary btn-lg" style={{ textDecoration: "none" }}>Get Started Free →</a>
                <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: "1rem", textAlign: "center" }}>Pro features available — apply for beta access inside your account</p>
              </div>
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

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="stats-inner">
          {[
            { num: '85%', label: 'Less admin time per inquiry' },
            { num: '< 24 hrs', label: 'Avg. response time' },
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
              <span className="label">The Problem</span>
              <h2>EHRs manage your patients. PMS manage your practice. Rosie is engineered to grow them both.</h2>
              <p>
                Electronic Health Records and Practice Management Systems handle your clinical documentation, scheduling and billing. Neither was built to find new patients, convert inquiries into sessions, or tell you which marketing channels are worth your money. This is where Rosie lives.
              </p>
            </div>
            <span className="label">Does this sound like your practice?</span>
            <div className="problem-cards-2x2">
              {[
                { tile: 'tile-sky',    icon: <IcSnowflake />, title: 'Are your leads going cold before anyone follows up?',          body: "You're busy! Clinicians miss follow-ups. Prospective clients move on. No one tracks the gap." },
                { tile: 'tile-amber',  icon: <IcClipboard />, title: 'Still tracking intake in spreadsheets and paper notes?',   body: 'Intake tracking lives in notebooks and shared docs. Nothing is automated or consistent.' },
                { tile: 'tile-coral',  icon: <IcWrench />,    title: 'No system built for pre-patient outreach?', body: "Practice management systems don't manage outreach. General CRMs don't understand therapy intake." },
                { tile: 'tile-emerald', icon: <IcBarChart />, title: 'Flying blind on which referral channels actually work?', body: "You know your own numbers. But which referral channels bring patients who actually stay? And how visible is your practice to someone searching for a therapist right now? That blind spot costs you." },
                { tile: 'tile-sky', icon: <IcCompass />, title: 'How easy is it for a new patient to find and choose your practice?', body: "Your online presence across Psychology Today, Zocdoc, and Google may be working against you — and you'd never know it." },
                { tile: 'tile-coral', icon: <IcLink />, title: 'Losing patients between inquiry and first session?', body: 'Most practices have no system for the pre-patient phase. Leads arrive, nothing happens fast enough, and they move on.' },
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
            Based on simple linear workflows, Rosie captures the lead's information, drafts outreach emails, reminds when calls should take place, logs notes, and keeps the process on schedule.
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
            <p className="screenshot-caption">Rosie tracks each lead through multiple structured stages — and tells you exactly where every intake stands</p>
          </div>

        </section>
      </div>

      {/* FEATURE SPOTLIGHT */}
      <div className="section-bg section-bg-warm">
      <section className="section" id="detail-view">
        <div className="section-head">
          <span className="label">In detail</span>
          <h2>Nothing falls through the cracks. Ever.</h2>
          <p>Every inquiry tracked, every follow-up timed, every patient detail logged — so your team always knows exactly what to do next.</p>
        </div>

        {/* Row 1: copy + timeline screenshot with inlay */}
        <div className="spotlight-row">
          <div className="spotlight-copy">
            <span className="label">Timeline &amp; follow-up</span>
            <h3>The right action, at the right moment</h3>
            <p>Rosie keeps every intake on track — automatically. When human input is needed, she stops and flags it. When it's not, she moves things forward without being asked.</p>
            <ul className="spotlight-check-list">
              <li>Each stage unlocks only when the previous one is complete — no skipped steps</li>
              <li>Urgent cases surface automatically, before they go cold</li>
              <li>Every email, call, note, and status change logged in a single timeline</li>
              <li>AI drafts the next message — you approve in one click and move on</li>
            </ul>
          </div>
          <div className="spotlight-inlay-wrap">
            <img src="/screenshots/screen-07.png" alt="Rosie activity timeline with stage alert" loading="lazy" />
            <div className="spotlight-inlay">
              <img src="/screenshots/screen-14.png" alt="Intake details form — urgency, insurance, session type" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Row 2: patient detail screenshot + copy */}
        <div className="spotlight-row">
          <div className="spotlight-frame">
            <img src="/screenshots/screen-04.png" alt="Patient detail — info, intake context, and AI-logged notes" loading="lazy" />
          </div>
          <div className="spotlight-copy">
            <span className="label">Patient records</span>
            <h3>Everything you need, before the first session</h3>
            <p>By the time a patient reaches your clinician, Rosie has already built their profile — referral source, urgency, insurance, availability, and session history, all in one place.</p>
            <ul className="spotlight-check-list">
              <li>Referral source tracked from first inquiry — so you know which channels work</li>
              <li>AI logs call notes automatically — no manual write-up after every interaction</li>
              <li>Availability captured upfront — schedule with confidence, not guesswork</li>
              <li>One click to Book Consultation or Promote to Patient when the time is right</li>
            </ul>
          </div>
        </div>

        {/* Row 3: copy right, image left */}
        <div className="spotlight-row">
          <div className="spotlight-frame">
            <img src="/screenshots/screen-01.png" alt="Practice growth intelligence — referral source and channel performance" loading="lazy" />
          </div>
          <div className="spotlight-copy">
            <span className="label">Practice growth</span>
            <span className="icon-badge" style={{ display: 'inline-flex', padding: '3px 10px 3px 4px', fontSize: 11, borderRadius: 6, marginBottom: '0.75rem' }}>
              <span className="icon-badge-tile tile-sky" style={{ width: 16, height: 16, borderRadius: 4, fontSize: 10 }}><IcBarChart /></span>
              Grow tier — coming soon
            </span>
            <h3>Which type of patients are most compatible with your practice, where to focus your budget?</h3>
            <p>Rosie tracks every inquiry back to its source — Zocdoc, Psychology Today, word of mouth, GP referral. Over time, you&apos;ll see exactly which channels bring patients who book, show up, and stay. Stop guessing where to spend your marketing budget.</p>
            <ul className="spotlight-check-list">
              <li>Referral source captured at first inquiry — automatically</li>
              <li>Full funnel visibility: inquiry → consultation → first session</li>
              <li>Competitive profile monitoring — see how you rank locally</li>
              <li>Re-engage lapsed patients with one-click outreach campaigns</li>
            </ul>
          </div>
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
              <span className="browser-url-bar">app.rosie.curlybraces.ai · RosieAI Assistant · Analyze</span>
            </div>
            <img src="/screenshots/screen-06.png" alt="RosieAI recommendation — Pause Follow-ups with 85% confidence and full reasoning" loading="lazy" />
          </div>
          <p className="screenshot-caption">Rosie surfaces the right action at the right time — with her reasoning visible, so you stay in control</p>
        </div>

      </section>
      </div>

      <hr className="divider" />

      {/* PRICING */}
      <div className="section-bg section-bg-coral">
        <section className="section" id="pricing">
          <div className="section-head">
            <span className="label">Pricing</span>
            <h2>Grow with Rosie, at your own pace.</h2>
            <p>
              Start with onboarding your patients, then let Rosie grow alongside your practice.
              Activate what you need, when you need it. No forced upgrades, no bloated all-in-one you&apos;ll never use.
            </p>
            <p style={{ marginTop: "0.5rem", color: "var(--text-tertiary)", fontSize: 14 }}>
              A free tier, always. Pro is free for all beta practices — for as long as you&apos;re with us.
            </p>
          </div>

          <div className="pricing-grid pricing-grid-4col">
            {/* FREE */}
            <div className="price-card free">
              <div className="featured-accent free-accent">Always free, no card needed</div>
              <div className="card-header">
                <span className="label" style={{ margin: 0 }}>Free</span>
                <span className="icon-badge" style={{ padding: '5px 10px 5px 5px', fontSize: 12, borderRadius: 8 }}>
                  <span className="icon-badge-tile tile-sky" style={{ width: 20, height: 20, borderRadius: 5, fontSize: 11 }}><IcInfinity /></span>
                  Forever
                </span>
              </div>
              <div className="price-amount">$0</div>
              <p className="price-desc"><strong className="price-title">Your whole practice, in one place.</strong>You run it manually. Rosie holds the data.</p>
              {['Unlimited lead profiles', 'Manual intake entry', 'All leads in one dashboard', 'HIPAA-compliant storage', 'EHR handoff notes'].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
              {['AI automation & RosieAI', 'Automated follow-up sequences', 'Calendar sync', 'In-app calling', 'Bolt-on modules'].map(f => (
                <div className="price-line" key={f}><div className="dash-icon">-</div>{f}</div>
              ))}
              <a href="https://intake.rosie.curlybraces.ai/" className="btn-secondary price-btn" style={{ textDecoration: "none", marginTop: "1.25rem", display: "block", background: "var(--text-tertiary, #94a3b8)", color: "#fff", borderColor: "transparent" }}>Get Started Free</a>
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
              <p className="price-desc"><strong className="price-title">RosieAI works, you review and move on.</strong>Automate intake from first contact to booked session.</p>
              {[
                'Everything in Free',
                'Automated lead capture from all sources',
                'Full AI follow-up sequences',
                'RosieAI assistant & chatbot',
                'Autonomous intake planning',
                'Inbound email intake',
              ].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
              {['Calendar sync (Google & Outlook)', 'In-app calling', 'Bolt-on modules'].map(f => (
                <div className="price-line" key={f}><div className="dash-icon">-</div>{f}</div>
              ))}
              <a href="https://intake.rosie.curlybraces.ai/" className="btn-primary price-btn" style={{ textDecoration: "none", marginTop: "1.25rem", display: "block", background: "var(--coral-500)", borderColor: "transparent" }}>Get Started Free →</a>
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
              <p className="price-desc"><strong className="price-title">Every integration, fully connected.</strong>Everything in Pro, plus deep integrations and calling.</p>
              {[
                'Everything in Pro',
                'Calendar sync (Google & Outlook)',
                'In-app calling (call transcription)',
                'Bolt-on modules available',
              ].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
            </div>

            {/* GROW */}
            <div className="price-card grow">
              <div className="featured-accent grow-accent">In the pipeline</div>
              <div className="card-header">
                <span className="label" style={{ margin: 0 }}>Grow</span>
                <span className="icon-badge" style={{ padding: '5px 10px 5px 5px', fontSize: 12, borderRadius: 8 }}>
                  <span className="icon-badge-tile tile-sky" style={{ width: 20, height: 20, borderRadius: 5, fontSize: 11 }}><IcBarChart /></span>
                  Coming soon
                </span>
              </div>
              <div className="price-amount">$49 <span>/ seat / month</span></div>
              <p className="price-desc"><strong className="price-title">Know your market, own your growth.</strong>Full funnel visibility from first inquiry to patient revenue.</p>
              {[
                'Everything in Pro+',
                'EHR data pull & analysis',
                'Full funnel attribution — inquiry to revenue',
                'Competitive intelligence (Psychology Today, Zocdoc, Google)',
                'Profile performance vs. similar practices',
                'Re-engagement campaigns for lapsed patients',
                'Marketing spend recommendations',
                'Practice growth dashboard',
              ].map(f => (
                <div className="price-line" key={f}><div className="check-icon">✓</div>{f}</div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 15, color: "var(--text-tertiary)", marginTop: "1.5rem", textAlign: "center", fontWeight: 500 }}>Pro features available — apply for beta access inside your account after signing up</p>
        </section>
      </div>

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

      {/* CONTACT */}
      <div className="section-bg section-bg-navy">
        <section className="section" id="contact">
          <div className="section-head">
            <span className="label">Get in touch</span>
            <h2>We&apos;d love to hear from you</h2>
            <p>Questions about Rosie, beta access, or your practice? Reach out — we respond fast.</p>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <span className="tile-icon tile-coral" style={{ width: 48, height: 48, borderRadius: 13, fontSize: 22 }}><IcPhone /></span>
              <div className="contact-card-body">
                <div className="contact-card-label">Talk to the team</div>
                <div className="contact-card-value">Got questions? We pick up. Speak directly to someone who knows Rosie inside out.</div>
              </div>
              <a href="tel:9173422080" className="contact-card-btn">Call 917-342-2080 →</a>
            </div>

            <div className="contact-card">
              <span className="tile-icon tile-sky" style={{ width: 48, height: 48, borderRadius: 13, fontSize: 22 }}><IcChat /></span>
              <div className="contact-card-body">
                <div className="contact-card-label">Email us directly</div>
                <div className="contact-card-value">Send us anything — pricing questions, HIPAA concerns, onboarding help. We reply same day.</div>
              </div>
              <a href="mailto:support@curlybraces.ai" className="contact-card-btn">support@curlybraces.ai →</a>
            </div>

            <div className="contact-card">
              <span className="tile-icon tile-violet" style={{ width: 48, height: 48, borderRadius: 13, fontSize: 22 }}><IcEdit /></span>
              <div className="contact-card-body">
                <div className="contact-card-label">Send an enquiry</div>
                <div className="contact-card-value">Prefer to write it out? Tell us about your practice and we&apos;ll get back to you quickly.</div>
              </div>
              <a href="mailto:support@curlybraces.ai?subject=Rosie%20Enquiry&body=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Rosie." className="contact-card-btn contact-card-btn-ghost">Open enquiry form →</a>
            </div>
          </div>
        </section>
      </div>

      {/* FINAL CTA */}
      <section className="section section-slim">
        <div className="cta-box">
          <span className="icon-badge" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 10, padding: '7px 16px 7px 7px' }}>
            <span className="icon-badge-tile tile-coral" style={{ width: 26, height: 26, borderRadius: 7, fontSize: 14 }}><IcStar /></span>
            Beta: limited spots available
          </span>
          <h2>Start with intake.<br />Grow with intelligence.</h2>
          <p>
            Free forever on the basic plan. Pro is free for all beta practices. No credit card.
            No minimum users. HIPAA-compliant from day one.
          </p>
          <div style={{ textAlign: "center" }}>
            <a href="https://intake.rosie.curlybraces.ai/" className="btn-primary btn-lg" style={{ textDecoration: "none" }}>Get Started Free →</a>
            <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: "1.25rem" }}>Pro features available — apply for beta access inside your account</p>
            <p className="fine" style={{ marginTop: "0.75rem" }}>By signing up you agree to our Terms of Service and Privacy Policy.</p>
          </div>
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

