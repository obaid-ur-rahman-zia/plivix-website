"use client";

import { useState } from "react";

/**
 * Project image for gallery tiles. When a project has no image (or it fails
 * to load), draws a quiet browser-frame wireframe instead of a colour blob.
 */
export default function ProjectCover({ project, sizes = "", priority = false }) {
  const src = project.thumbnail_url || project.cover_url;
  const [broken, setBroken] = useState(false);
  if (src && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={project.title}
        sizes={sizes || undefined}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        onError={() => setBroken(true)}
      />
    );
  }
  return <Wireframe seed={project.slug || project.title || ""} />;
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const L = { fill: "none", stroke: "currentColor", strokeWidth: 1, vectorEffect: "non-scaling-stroke" };
const F = { fill: "currentColor", opacity: 0.12 };

function Wireframe({ seed }) {
  const v = hash(seed) % 3;
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-soft)] text-[var(--color-fg-muted)] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="w-full h-full" aria-hidden>
        <rect {...L} x="40" y="34" width="320" height="200" rx="6" />
        <path {...L} d="M40 54h320" />
        <circle cx="52" cy="44" r="3" {...F} />
        <circle cx="62" cy="44" r="3" {...F} />
        <circle cx="72" cy="44" r="3" {...F} />
        {v === 0 && (
          <>
            <rect x="60" y="72" width="140" height="12" rx="2" fill="currentColor" opacity="0.4" />
            <rect x="60" y="92" width="100" height="6" rx="1" {...F} />
            <rect x="60" y="110" width="60" height="16" rx="8" fill="var(--color-accent)" />
            <rect x="220" y="72" width="120" height="140" rx="3" {...F} />
            <path {...L} d="M60 150h140M60 170h120M60 190h130" />
          </>
        )}
        {v === 1 && (
          <>
            <rect x="40" y="54" width="70" height="180" {...F} />
            {[0, 1, 2].map((i) => (
              <rect key={i} {...L} x={126 + i * 76} y="72" width="66" height="44" rx="3" />
            ))}
            <path {...L} d="M126 210 C170 170 200 190 236 150 S300 130 340 100" />
            <circle cx="236" cy="150" r="4" fill="var(--color-accent)" />
          </>
        )}
        {v === 2 && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={60 + i * 74} y="72" width="62" height="74" rx="3" {...(i === 1 ? { fill: "var(--color-accent)" } : F)} />
            ))}
            <path {...L} d="M60 168h280M60 188h200M60 208h240" />
          </>
        )}
      </svg>
    </div>
  );
}
