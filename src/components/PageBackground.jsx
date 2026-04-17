"use client";

/**
 * PageBackground — fixed, full-viewport ambient gradient mesh.
 *
 * Because it's fixed (not absolute within a section), the gradient flows
 * continuously through every section — no hard cutoffs at section edges.
 *
 * - Multiple very-large, softly blurred blobs.
 * - A subtle radial dot grid with a radial mask fade.
 * - Respects the theme (strength adjusted for light vs dark via globals.css).
 * - Pointer-events: none so it never intercepts input.
 */
export default function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Dot grid with radial fade */}
      <div className="absolute inset-0 bg-dot-grid-fade opacity-70" />

      {/* Large drifting blobs — sized in vmax so they stay huge on any aspect. */}
      <div
        className="blob blob-violet blob-float-slow"
        style={{
          width: "75vmax",
          height: "75vmax",
          top: "-25vmax",
          left: "-20vmax",
          opacity: 0.55,
        }}
      />
      <div
        className="blob blob-pink blob-float"
        style={{
          width: "65vmax",
          height: "65vmax",
          top: "20vmax",
          right: "-25vmax",
          opacity: 0.45,
        }}
      />
      <div
        className="blob blob-blue blob-float-slow"
        style={{
          width: "70vmax",
          height: "70vmax",
          top: "55vmax",
          left: "-15vmax",
          opacity: 0.4,
        }}
      />
      <div
        className="blob blob-cyan blob-float"
        style={{
          width: "60vmax",
          height: "60vmax",
          top: "85vmax",
          right: "-10vmax",
          opacity: 0.35,
        }}
      />

      {/* Top and bottom vignettes so the bg feels integrated with the page
          (softly darker at the edges, making text pop). */}
      <div
        className="absolute inset-x-0 top-0 h-[30vh]"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-bg) 0%, transparent 100%)",
          opacity: 0.6,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[30vh]"
        style={{
          background:
            "linear-gradient(to top, var(--color-bg) 0%, transparent 100%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
