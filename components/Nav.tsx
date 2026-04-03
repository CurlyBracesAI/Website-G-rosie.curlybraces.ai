"use client";

import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "0.5px solid var(--border-subtle)",
        padding: "0.875rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", textDecoration: "none", color: "var(--text-primary)" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--green-400)", display: "inline-block", flexShrink: 0 }} />
        Rosie
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }} className="nav-desktop">
        {[
          { label: "How it works", href: "#how-it-works" },
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
        ].map((l) => (
          <a key={l.href} href={l.href} style={{ fontSize: 14, color: "var(--text-secondary)", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            {l.label}
          </a>
        ))}
        <a href="#cta" className="btn-primary" style={{ textDecoration: "none" }}>
          Start free — no card needed
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        style={{ background: "none", border: "none", padding: 4, color: "var(--text-secondary)" }}
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          {open
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      <style>{`
        .nav-hamburger { display: none; }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#fff", borderBottom: "0.5px solid var(--border-subtle)",
          padding: "1rem 2rem", display: "flex", flexDirection: "column", gap: "1rem",
        }}>
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              {l.label}
            </a>
          ))}
          <a href="#cta" onClick={() => setOpen(false)} className="btn-primary" style={{ textDecoration: "none", justifyContent: "center" }}>
            Start free — no card needed
          </a>
        </div>
      )}
    </nav>
  );
}
