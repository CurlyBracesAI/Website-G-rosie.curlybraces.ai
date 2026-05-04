"use client";

import { useState } from "react";

export default function CtaSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong.");
      }
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section className="site-section" id="cta">
      <div style={{
        background: "var(--bg-secondary)",
        borderRadius: "var(--radius-xl)",
        padding: "3.5rem 2rem",
        textAlign: "center",
      }}>
        <span className="badge badge-amber">
          <span className="badge-dot badge-dot-amber" />
          Beta: limited spots available
        </span>

        <h2 style={{ margin: "0.75rem 0 0.5rem" }}>
          Start with onboarding.<br />Stay for everything else.
        </h2>
        <p style={{ maxWidth: 480, margin: "0 auto 1.5rem" }}>
          Free forever on the basic plan. Pro is free for all beta practices. No credit card. No minimum users. HIPAA-compliant from day one.
        </p>

        {status === "success" ? (
          <div style={{ fontSize: 15, color: "var(--green-600)", fontWeight: 500 }}>
            ✓ You&apos;re on the list. We&apos;ll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@practice.com"
              style={{
                flex: 1, minWidth: 180,
                padding: "11px 16px",
                borderRadius: "var(--radius-md)",
                border: "0.5px solid var(--border-medium)",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "var(--green-400)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(29,158,117,0.12)"; }}
              onBlur={e  => { e.currentTarget.style.borderColor = "var(--border-medium)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <button type="submit" className="btn-primary" disabled={status === "loading"} style={{ opacity: status === "loading" ? 0.6 : 1 }}>
              {status === "loading" ? "Submitting…" : "Get started free"}
            </button>
          </form>
        )}

        {errorMsg && (
          <p style={{ fontSize: 13, color: "var(--coral-400)", marginTop: "0.5rem" }}>{errorMsg}</p>
        )}

        <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: "0.85rem" }}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </section>
  );
}
