/**
 * Wireframe drawings of each product's main screen. Lines in the
 * foreground colour, one accent area, a little motion on hover.
 */

const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinejoin: "round", strokeLinecap: "round" };
const F = { fill: "currentColor", opacity: 0.14 };
const A = { fill: "var(--color-accent)" };

function Window({ children, title }) {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden>
      <rect {...L} x="1" y="1" width="318" height="198" rx="6" />
      <path {...L} d="M1 22h318" />
      <circle cx="13" cy="11.5" r="3" {...F} />
      <circle cx="24" cy="11.5" r="3" {...F} />
      <circle cx="35" cy="11.5" r="3" {...F} />
      <text x="160" y="15" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.5" fontFamily="var(--font-jetbrains), monospace">
        {title}
      </text>
      {children}
    </svg>
  );
}

function ErpScreen() {
  const bars = [38, 56, 44, 72, 60, 88, 70];
  return (
    <Window title="plivix-erp / dashboard">
      <rect {...F} x="1" y="22" width="56" height="177" />
      {[40, 56, 72, 88, 104].map((y, i) => (
        <rect key={y} x="10" y={y} width={i === 0 ? 38 : 30} height="5" rx="1" {...(i === 0 ? A : F)} />
      ))}
      {[70, 152, 234].map((x) => (
        <g key={x}>
          <rect {...L} x={x} y="34" width="74" height="34" rx="3" />
          <rect x={x + 8} y="42" width="26" height="4" rx="1" {...F} />
          <rect x={x + 8} y="52" width="40" height="8" rx="1" fill="currentColor" opacity="0.6" />
        </g>
      ))}
      <rect {...L} x="70" y="78" width="238" height="108" rx="3" />
      {bars.map((h, i) => (
        <rect
          key={i}
          className="wf-bar"
          x={88 + i * 30}
          y={176 - h}
          width="16"
          height={h}
          {...(i === 5 ? A : F)}
          style={{ transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </Window>
  );
}

function PosScreen() {
  return (
    <Window title="plivix-pos / counter 01">
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect key={`${r}${c}`} {...L} x={14 + c * 46} y={34 + r * 46} width="38" height="38" rx="3" />
        ))
      )}
      <rect x="20" y="40" width="26" height="26" rx="2" {...A} className="wf-pop" />
      <path {...L} d="M204 22v177" />
      {[38, 52, 66, 80].map((y) => (
        <g key={y}>
          <rect x="214" y={y} width="50" height="5" rx="1" {...F} />
          <rect x="282" y={y} width="24" height="5" rx="1" {...F} />
        </g>
      ))}
      <path {...L} d="M214 98h92" strokeDasharray="2 3" />
      <rect x="214" y="106" width="30" height="7" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="268" y="106" width="38" height="7" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="214" y="160" width="92" height="26" rx="4" {...A} />
    </Window>
  );
}

function HrScreen() {
  const absent = new Set([3, 11, 17, 24]);
  return (
    <Window title="plivix-hr / attendance · nov">
      {Array.from({ length: 28 }).map((_, i) => {
        const x = 14 + (i % 7) * 26;
        const y = 34 + Math.floor(i / 7) * 26;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="20"
            height="20"
            rx="2"
            {...(absent.has(i) ? { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeDasharray: "2 2" } : i === 16 ? A : F)}
          />
        );
      })}
      <rect {...L} x="206" y="34" width="100" height="152" rx="3" />
      <rect x="216" y="44" width="44" height="5" rx="1" fill="currentColor" opacity="0.6" />
      {[60, 72, 84, 96, 108].map((y) => (
        <g key={y}>
          <rect x="216" y={y} width="40" height="4" rx="1" {...F} />
          <rect x="274" y={y} width="22" height="4" rx="1" {...F} />
        </g>
      ))}
      <path {...L} d="M216 124h80" />
      <rect x="216" y="132" width="34" height="7" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="256" y="132" width="40" height="7" rx="1" {...A} />
      <path {...L} d="M14 150h176" />
      <path {...L} className="wf-line" d="M14 180c20-14 34-4 52-10s30-20 50-14 34 10 74-2" />
    </Window>
  );
}

function StoreScreen() {
  return (
    <Window title="yourshop.com.bd">
      <rect x="14" y="32" width="60" height="7" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="230" y="32" width="76" height="7" rx="3" {...F} />
      {[0, 1, 2].map((c) => (
        <g key={c} className={c === 1 ? "wf-pop" : undefined}>
          <rect {...L} x={14 + c * 100} y="52" width="92" height="96" rx="3" />
          <rect x={20 + c * 100} y="58" width="80" height="56" rx="2" {...(c === 1 ? A : F)} />
          <rect x={20 + c * 100} y="122" width="50" height="5" rx="1" {...F} />
          <rect x={20 + c * 100} y="132" width="28" height="6" rx="1" fill="currentColor" opacity="0.6" />
        </g>
      ))}
      <rect {...L} x="14" y="160" width="292" height="26" rx="3" />
      <rect x="22" y="170" width="120" height="6" rx="1" {...F} />
      <text x="296" y="177" textAnchor="end" fontSize="8" fill="currentColor" opacity="0.6" fontFamily="var(--font-jetbrains), monospace">
        stock synced ✓
      </text>
    </Window>
  );
}

const SCREENS = { erp: ErpScreen, pos: PosScreen, hr: HrScreen, store: StoreScreen };

export default function ProductScreen({ id }) {
  const C = SCREENS[id] || ErpScreen;
  return <C />;
}
