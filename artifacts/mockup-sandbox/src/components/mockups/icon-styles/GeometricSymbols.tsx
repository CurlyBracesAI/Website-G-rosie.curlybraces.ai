const tiles = [
  { sym: "◆", label: "AI automation",       sub: "Rosie plans every lead",        color: "#7C3AED", bg: "#f5f3ff" },
  { sym: "▲", label: "Calendar sync",        sub: "Google & Outlook",              color: "#D97706", bg: "#fffbeb" },
  { sym: "⬟", label: "HIPAA-compliant",      sub: "Built for healthcare",          color: "#059669", bg: "#ecfdf5" },
  { sym: "→", label: "Inbound email intake", sub: "Every source captured",         color: "#0284C7", bg: "#f0f9ff" },
  { sym: "●", label: "Lead management",      sub: "Solo to group, one view",       color: "#E55535", bg: "#fff6f4" },
  { sym: "✦", label: "Follow-up sequences",  sub: "24 / 48 / 72 hr automations",  color: "#EA580C", bg: "#fff7ed" },
  { sym: "▬", label: "Correspondence AI",    sub: "Drafted in clinical tone",      color: "#4F46E5", bg: "#eef2ff" },
  { sym: "⬡", label: "EHR handoff",          sub: "Pass cleanly to your system",  color: "#0D9488", bg: "#f0fdfa" },
];

export function GeometricSymbols() {
  return (
    <div className="min-h-screen bg-[#f9f9f7] p-8 flex flex-col gap-6">
      <div className="mb-2">
        <p className="text-xs font-semibold tracking-widest text-[#E55535] uppercase mb-1">Style B</p>
        <h2 className="text-xl font-bold text-[#1E293B]">Bold geometric symbols</h2>
        <p className="text-sm text-slate-500 mt-0.5">Graphic, abstract — strong visual identity</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {tiles.map(({ sym, label, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-100">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: bg }}
            >
              <span
                className="font-black leading-none"
                style={{ color, fontSize: sym === "→" ? 22 : sym === "✦" ? 18 : 16, lineHeight: 1 }}
              >
                {sym}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-800 leading-tight">{label}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
