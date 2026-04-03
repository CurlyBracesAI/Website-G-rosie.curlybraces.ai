const s = { stroke: "white", fill: "none", strokeWidth: 1.85, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IcBuilding    = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="2" y="7" width="20" height="15" rx="1.5" {...s}/><path d="M16 7V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" {...s}/><rect x="7" y="12" width="3" height="3" rx=".5" {...s}/><rect x="14" y="12" width="3" height="3" rx=".5" {...s}/><rect x="9.5" y="18" width="5" height="4" rx=".5" {...s}/></svg>;

export const IcBrain       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M9.5 2A2.5 2.5 0 0 0 7 4.5c0 .4.1.8.24 1.16A3 3 0 0 0 4 8.5a3 3 0 0 0 1.55 2.62A3.5 3.5 0 0 0 7 17h10a3.5 3.5 0 0 0 1.45-6.88A3 3 0 0 0 20 8.5a3 3 0 0 0-3.24-2.84A2.5 2.5 0 0 0 14.5 2" {...s}/><path d="M12 2v15M9 7h6M9 11h6" {...s}/></svg>;

export const IcGrad        = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M22 9L12 5 2 9l10 4 10-4z" {...s}/><path d="M6 11v5a6 6 0 0 0 12 0v-5" {...s}/><path d="M22 9v6" {...s}/></svg>;

export const IcZap         = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M13 2L4.09 12.11A1 1 0 0 0 5 14h6l-2 8 8.91-10.11A1 1 0 0 0 17 10h-6l2-8z" {...s}/></svg>;

export const IcUsers       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="9" cy="7" r="3" {...s}/><circle cx="17" cy="8" r="2.5" {...s}/><path d="M3 20c0-3.31 2.69-6 6-6s6 2.69 6 6" {...s}/><path d="M16 14c2.21 0 4 1.79 4 4" {...s}/></svg>;

export const IcLock        = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" {...s}/><path d="M8 11V7a4 4 0 0 1 8 0v4" {...s}/><circle cx="12" cy="16" r="1.2" fill="white"/></svg>;

export const IcSnowflake   = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" {...s}/><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2M6 12l-2-2M6 12l-2 2M18 12l2-2M18 12l2 2" {...s} strokeWidth={1.4}/></svg>;

export const IcClipboard   = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="8" y="2" width="8" height="4" rx="1" {...s}/><path d="M16 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" {...s}/><path d="M9 12h6M9 16h4" {...s}/></svg>;

export const IcWrench      = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" {...s}/></svg>;

export const IcMoney       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" {...s}/><path d="M12 6v12M9.5 8.5c0-1.1.9-2 2.5-2s2.5.9 2.5 2-1.12 2-2.5 2-2.5.9-2.5 2 .9 2 2.5 2 2.5-.9 2.5-2" {...s}/></svg>;

export const IcCompass     = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="10" {...s}/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" {...s}/></svg>;

export const IcCalendar    = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" {...s}/><path d="M3 10h18M8 2v4M16 2v4" {...s}/><rect x="8" y="14" width="2" height="2" rx=".3" fill="white"/><rect x="13" y="14" width="2" height="2" rx=".3" fill="white"/></svg>;

export const IcBook        = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" {...s}/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" {...s}/></svg>;

export const IcChat        = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" {...s}/><path d="M8 10h8M8 13h5" {...s}/></svg>;

export const IcBarChart    = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 20V10M6 20v-6M18 20V4" {...s} strokeWidth={2.2}/><path d="M3 20h18" {...s}/></svg>;

export const IcAward       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="9" r="6" {...s}/><path d="M12 3l1.55 3.14L17 6.82l-2.5 2.44.59 3.44L12 11.27l-3.09 1.43.59-3.44L7 6.82l3.45-.68L12 3z" {...s}/><path d="M8.21 13.89L7 22l5-3 5 3-1.21-8.11" {...s}/></svg>;

export const IcPhone       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.29h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" {...s}/></svg>;

export const IcMic         = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" {...s}/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6" {...s}/></svg>;

export const IcShield      = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...s}/><path d="M9 12l2 2 4-4" {...s}/></svg>;

export const IcHeart       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" {...s}/></svg>;

export const IcPerson      = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="7" r="4" {...s}/><path d="M4 21a8 8 0 0 1 16 0" {...s}/></svg>;

export const IcLink        = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" {...s}/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" {...s}/></svg>;

export const IcTag         = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" {...s}/><circle cx="7" cy="7" r="1.5" fill="white"/></svg>;

export const IcGift        = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="3" y="8" width="18" height="14" rx="1.5" {...s}/><path d="M3 12h18M12 8v14" {...s}/><path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8z" {...s}/><path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z" {...s}/></svg>;

export const IcEdit        = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" {...s}/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" {...s}/></svg>;

export const IcArrowRight  = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M5 12h14M12 5l7 7-7 7" {...s} strokeWidth={2}/></svg>;

export const IcStar        = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

export const IcCheck       = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>;

export const IcInfinity    = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" stroke="white" strokeWidth={1.8} strokeLinecap="round"/></svg>;

export const IcClock       = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth={1.8}/><path d="M12 6v6l4 2" stroke="white" strokeWidth={1.8} strokeLinecap="round"/></svg>;

export const IcVideo       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="2" y="6" width="14" height="12" rx="2" {...s}/><path d="M22 8l-6 4 6 4V8z" {...s}/></svg>;

export const IcCross       = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><rect x="8" y="2" width="8" height="20" rx="2" {...s}/><rect x="2" y="8" width="20" height="8" rx="2" {...s}/></svg>;

export const IcFileText    = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" {...s}/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" {...s}/></svg>;
