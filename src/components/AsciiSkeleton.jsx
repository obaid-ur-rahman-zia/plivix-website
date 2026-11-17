/**
 * Text-mode skeletons drawn with box characters. Used while a route or a
 * 3D scene is loading. Pure markup, no JS, so it paints instantly.
 */

const PAGE = `┌──────────────────────────────────────────┐
│ ░░░░░░░░                                 │
│                                          │
│ ████████████████████████                 │
│ ██████████████████                       │
│                                          │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░             │
│                                          │
│ [ ░░░░░░░░░░ ]  [ ░░░░░░░░ ]             │
├──────────────────────────────────────────┤
│ ░░  ░░░░░░░░░░░░░░░░░░░░       ░░░░  ░░  │
│ ░░  ░░░░░░░░░░░░░░░░           ░░░░  ░░  │
│ ░░  ░░░░░░░░░░░░░░░░░░░░░░     ░░░░  ░░  │
└──────────────────────────────────────────┘`;

const STACK = `      ╱‾‾‾‾‾‾‾‾‾‾╲
     ╱  ░░░░░░░░  ╲
     ╲____________╱
      ╱‾‾‾‾‾‾‾‾‾‾╲
     ╱  ░░░░░░░░  ╲
     ╲____________╱
      ╱‾‾‾‾‾‾‾‾‾‾╲
     ╱  ░░░░░░░░  ╲
     ╲____________╱`;

export function AsciiPageSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="container-edge pt-32 md:pt-40 pb-24 min-h-[70svh]">
      <pre className="ascii-skel text-[9px] sm:text-xs md:text-sm">
        <span className="ascii-shimmer">{PAGE}</span>
      </pre>
    </div>
  );
}

export function AsciiStackSkeleton({ className = "" }) {
  return (
    <div aria-hidden className={`flex items-center justify-center w-full h-full ${className}`}>
      <pre className="ascii-skel text-[10px] sm:text-xs">
        <span className="ascii-shimmer">{STACK}</span>
      </pre>
    </div>
  );
}
