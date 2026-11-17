/**
 * Small hand-built line drawings that stand in for paragraphs of copy.
 * One stroke weight, the foreground colour, and at most one accent shape
 * per drawing, so they read as part of the type system, not stock art.
 */

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
const A = { fill: "var(--color-accent)" };

function Frame({ children, className = "", label, viewBox = "0 0 64 64" }) {
  return (
    <svg viewBox={viewBox} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {children}
    </svg>
  );
}

/* ---------- Industries ---------- */

const INDUSTRY = {
  garments: (
    <>
      <path {...S} d="M32 14a5 5 0 1 1 5 5c-2 0-5 1-5 4" />
      <path {...S} d="M32 23 8 42h48L32 23Z" />
      <rect {...A} x="14" y="42" width="36" height="5" rx="1" />
    </>
  ),
  retail: (
    <>
      <path {...S} d="M10 24h44l-4-10H14l-4 10Z" />
      <path {...S} d="M10 24c0 4 6 4 7 0 1 4 7 4 8 0 1 4 7 4 8 0 1 4 7 4 8 0 1 4 7 4 8 0 1 4 5 4 5 0" />
      <path {...S} d="M13 30v22h38V30" />
      <rect {...A} x="27" y="38" width="10" height="14" />
    </>
  ),
  manufacturing: (
    <>
      <path {...S} d="M8 52V30l12 8v-8l12 8v-8l12 8V14h8v38H8Z" />
      <rect {...A} x="14" y="44" width="6" height="8" />
      <path {...S} d="M26 46h4M34 46h4" />
    </>
  ),
  distribution: (
    <>
      <rect {...S} x="6" y="20" width="32" height="22" />
      <path {...S} d="M38 28h10l8 8v6H38V28Z" />
      <circle {...S} cx="16" cy="46" r="4" />
      <circle {...S} cx="46" cy="46" r="4" />
      <rect {...A} x="12" y="26" width="10" height="8" />
    </>
  ),
  clinic: (
    <>
      <rect {...S} x="12" y="12" width="40" height="40" rx="3" />
      <path {...A} d="M28 20h8v8h8v8h-8v8h-8v-8h-8v-8h8v-8Z" />
    </>
  ),
  school: (
    <>
      <path {...S} d="M32 16 6 28l26 12 26-12-26-12Z" />
      <path {...S} d="M16 33v10c0 4 7 7 16 7s16-3 16-7V33" />
      <path {...S} d="M58 28v14" />
      <circle {...A} cx="58" cy="44" r="2.5" />
    </>
  ),
};
const INDUSTRY_KEYS = Object.keys(INDUSTRY);

export function IndustryGlyph({ index = 0, className = "w-10 h-10" }) {
  return <Frame className={className}>{INDUSTRY[INDUSTRY_KEYS[index % INDUSTRY_KEYS.length]]}</Frame>;
}

/* ---------- Process steps ---------- */

const STEP = [
  // Discovery: two speech bubbles
  <>
    <path {...S} d="M8 12h30v18H20l-7 6v-6H8V12Z" />
    <path {...S} d="M26 34h30v16h-4v6l-7-6H26V34Z" />
    <path {...S} d="M14 20h18M14 25h10" />
    <rect {...A} x="32" y="40" width="18" height="3" />
  </>,
  // Scope: document with a price tag
  <>
    <path {...S} d="M14 8h26l10 10v38H14V8Z" />
    <path {...S} d="M40 8v10h10" />
    <path {...S} d="M20 26h22M20 32h22M20 38h14" />
    <path {...A} d="M34 44h14l4 5-4 5H34V44Z" />
  </>,
  // Sprints: board with three columns
  <>
    <rect {...S} x="6" y="10" width="52" height="44" rx="2" />
    <path {...S} d="M23 10v44M41 10v44" />
    <rect {...S} x="10" y="16" width="9" height="7" />
    <rect {...S} x="10" y="27" width="9" height="7" />
    <rect {...A} x="27" y="16" width="10" height="7" />
    <rect {...S} x="45" y="16" width="9" height="7" />
    <rect {...S} x="45" y="27" width="9" height="7" />
    <rect {...S} x="45" y="38" width="9" height="7" />
  </>,
  // Launch & support: server with a tick
  <>
    <rect {...S} x="10" y="10" width="44" height="14" rx="2" />
    <rect {...S} x="10" y="28" width="44" height="14" rx="2" />
    <circle {...S} cx="18" cy="17" r="1.5" />
    <circle {...S} cx="18" cy="35" r="1.5" />
    <path {...S} d="M32 42v8M22 54h20" />
    <circle {...A} cx="46" cy="17" r="3" />
  </>,
];

export function StepGlyph({ index = 0, className = "w-12 h-12" }) {
  return <Frame className={className}>{STEP[index % STEP.length]}</Frame>;
}

/* ---------- "Built for here" feature glyphs ---------- */

const LOCAL = [
  // Bangla + English
  <>
    <rect {...S} x="6" y="12" width="30" height="24" rx="2" />
    <rect {...S} x="28" y="28" width="30" height="24" rx="2" fill="var(--color-bg)" />
    <text x="21" y="29" textAnchor="middle" fontSize="13" fill="currentColor" fontFamily="var(--font-bengali), sans-serif">অ</text>
    <text x="43" y="45" textAnchor="middle" fontSize="13" fill="var(--color-accent)" fontFamily="var(--font-inter), sans-serif">A</text>
  </>,
  // Currencies
  <>
    <circle {...S} cx="24" cy="30" r="16" />
    <circle {...A} cx="42" cy="36" r="14" opacity="0.9" />
    <text x="24" y="35" textAnchor="middle" fontSize="14" fill="currentColor">৳</text>
    <text x="42" y="41" textAnchor="middle" fontSize="14" fill="var(--color-on-accent)">$</text>
  </>,
  // VAT / reconciliation: receipt
  <>
    <path {...S} d="M16 6h32v52l-5-4-5 4-6-4-6 4-5-4-5 4V6Z" />
    <path {...S} d="M22 16h20M22 22h20M22 28h12" />
    <rect {...A} x="22" y="38" width="20" height="5" />
  </>,
  // Cloud or own server
  <>
    <path {...S} d="M18 30a9 9 0 0 1 2-18 12 12 0 0 1 23 3 8 8 0 0 1 1 15H18Z" />
    <rect {...S} x="18" y="40" width="28" height="16" rx="2" />
    <path {...S} d="M32 30v10" strokeDasharray="2 3" />
    <circle {...A} cx="24" cy="48" r="2.5" />
  </>,
];

export function LocalGlyph({ index = 0, className = "w-10 h-10" }) {
  return <Frame className={className}>{LOCAL[index % LOCAL.length]}</Frame>;
}
