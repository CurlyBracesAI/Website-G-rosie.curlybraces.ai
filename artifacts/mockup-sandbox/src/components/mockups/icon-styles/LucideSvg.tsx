import { Brain, Calendar, ShieldCheck, Mail, Users, ArrowRightCircle, Zap, MessageSquare } from "lucide-react";

const tiles = [
  { Icon: Brain,            label: "AI automation",       sub: "Rosie plans every lead",         bg: "bg-violet-100",  fg: "text-violet-600"  },
  { Icon: Calendar,         label: "Calendar sync",        sub: "Google & Outlook",               bg: "bg-amber-100",   fg: "text-amber-600"   },
  { Icon: ShieldCheck,      label: "HIPAA-compliant",      sub: "Built for healthcare",           bg: "bg-emerald-100", fg: "text-emerald-600" },
  { Icon: Mail,             label: "Inbound email intake", sub: "Every source captured",          bg: "bg-sky-100",     fg: "text-sky-600"     },
  { Icon: Users,            label: "Lead management",      sub: "Solo to group, one view",        bg: "bg-rose-100",    fg: "text-rose-600"    },
  { Icon: Zap,              label: "Follow-up sequences",  sub: "24 / 48 / 72 hr automations",   bg: "bg-orange-100",  fg: "text-orange-600"  },
  { Icon: MessageSquare,    label: "Correspondence AI",    sub: "Drafted in clinical tone",       bg: "bg-indigo-100",  fg: "text-indigo-600"  },
  { Icon: ArrowRightCircle, label: "EHR handoff",          sub: "Pass cleanly to your system",   bg: "bg-teal-100",    fg: "text-teal-600"    },
];

export function LucideSvg() {
  return (
    <div className="min-h-screen bg-[#f9f9f7] p-8 flex flex-col gap-6">
      <div className="mb-2">
        <p className="text-xs font-semibold tracking-widest text-[#E55535] uppercase mb-1">Style A</p>
        <h2 className="text-xl font-bold text-[#1E293B]">Lucide SVG line icons</h2>
        <p className="text-sm text-slate-500 mt-0.5">Clean, recognisable — the SaaS standard</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {tiles.map(({ Icon, label, sub, bg, fg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 flex flex-col gap-3 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon className={`w-5 h-5 ${fg}`} strokeWidth={1.75} />
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
