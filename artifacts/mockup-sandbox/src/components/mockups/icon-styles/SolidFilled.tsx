const tiles = [
  {
    label: "AI automation", sub: "Rosie plans every lead", color: "#7C3AED", bg: "#7C3AED",
    svg: <path d="M12 2a5 5 0 0 1 5 5c0 1.8-.95 3.38-2.37 4.26L16 20H8l1.37-8.74A5 5 0 0 1 12 2zm-2 13l-.5 3h5l-.5-3H10z" fill="white"/>,
  },
  {
    label: "Calendar sync", sub: "Google & Outlook", color: "#D97706", bg: "#D97706",
    svg: <><rect x="3" y="4" width="18" height="17" rx="2" fill="none" stroke="white" strokeWidth="1.8"/><path d="M3 9h18M8 2v4M16 2v4M7 13h2v2H7z" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></>,
  },
  {
    label: "HIPAA-compliant", sub: "Built for healthcare", color: "#059669", bg: "#059669",
    svg: <><path d="M12 3L4 7v5c0 4.42 3.42 8.56 8 9.56C16.58 20.56 20 16.42 20 12V7L12 3z" fill="none" stroke="white" strokeWidth="1.8"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  },
  {
    label: "Inbound email", sub: "Every source captured", color: "#0284C7", bg: "#0284C7",
    svg: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="white" strokeWidth="1.8"/><path d="M3 8l9 6 9-6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></>,
  },
  {
    label: "Lead management", sub: "Solo to group, one view", color: "#E55535", bg: "#E55535",
    svg: <><circle cx="9" cy="7" r="3" fill="none" stroke="white" strokeWidth="1.8"/><circle cx="16" cy="8" r="2.5" fill="none" stroke="white" strokeWidth="1.8"/><path d="M3 19c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 13c2.21 0 4 1.79 4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></>,
  },
  {
    label: "Follow-up AI", sub: "24 / 48 / 72 hr automations", color: "#EA580C", bg: "#EA580C",
    svg: <><path d="M13 2L4.09 12.11A1 1 0 0 0 5 14h6l-2 8 8.91-10.11A1 1 0 0 0 17 10h-6l2-8z" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/></>,
  },
  {
    label: "Correspondence", sub: "Drafted in clinical tone", color: "#4F46E5", bg: "#4F46E5",
    svg: <><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
  },
  {
    label: "EHR handoff", sub: "Pass cleanly to your system", color: "#0D9488", bg: "#0D9488",
    svg: <><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>,
  },
];

export function SolidFilled() {
  return (
    <div className="min-h-screen bg-[#f9f9f7] p-8 flex flex-col gap-6">
      <div className="mb-2">
        <p className="text-xs font-semibold tracking-widest text-[#E55535] uppercase mb-1">Style C</p>
        <h2 className="text-xl font-bold text-[#1E293B]">Solid filled SVG icons</h2>
        <p className="text-sm text-slate-500 mt-0.5">Colour-blocked, bold — maximum impact at small size</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {tiles.map(({ label, sub, bg, svg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-100">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: bg }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                {svg}
              </svg>
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
