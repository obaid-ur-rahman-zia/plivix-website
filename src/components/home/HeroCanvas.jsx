"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const COL = {
  dark: {
    color: "#eae3ff",
    bloom: 1.05,
    bloomThreshold: 0.3,
    vignette: 0.55,
    ambient: 0.4,
  },
  light: {
    color: "#2c2167",
    bloom: 0.35,
    bloomThreshold: 0.6,
    vignette: 0.18,
    ambient: 0.7,
  },
};

/**
 * HeroCanvas — renders a dense particle cloud shaped like the Plivix logo
 * mark (the 3-parallelogram icon, not the wordmark).
 *
 * Pipeline:
 *   1. Load /images/logo/logo-light-theme.png (the icon-only mark).
 *   2. Draw it to an offscreen 2D canvas at a known size.
 *   3. Walk the alpha channel and emit one particle per opaque pixel.
 *   4. Upload positions + per-particle seeds/scales into a BufferGeometry.
 *   5. Render as <points> with a custom ShaderMaterial — soft radial discs,
 *      sin(time+seed) drift, theme-aware tint uniform.
 *
 * Interaction:
 *   - No auto-rotation.
 *   - A window pointermove listener smoothly tilts the whole cloud toward
 *     the cursor (Y rotation on X-axis mouse, X rotation on Y-axis mouse).
 *   - Camera rig still dollies/sways subtly with scroll progress.
 */
export default function HeroCanvas({ progressRef, theme = "dark", isMobile = false }) {
  const [ready, setReady] = useState(false);
  const orbitingRef = useRef(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  const mode = theme === "light" ? "light" : "dark";
  const pal = COL[mode];
  const exposure = isMobile
    ? mode === "light"
      ? 0.88
      : 0.82
    : mode === "light"
      ? 1.02
      : 1.15;

  return (
    <Canvas
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: exposure,
      }}
      camera={{ position: [0, 0, 5.2], fov: isMobile ? 40 : 38 }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={isMobile ? pal.ambient * 0.85 : pal.ambient} />

      <Suspense fallback={null}>
        <CameraRig progressRef={progressRef} orbitingRef={orbitingRef} />
        <PlivixLogoParticles palette={pal} mode={mode} isMobile={isMobile} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={isMobile ? 0.5 : 0.7}
          minPolarAngle={Math.PI * 0.33}
          maxPolarAngle={Math.PI * 0.67}
          onStart={() => {
            orbitingRef.current = true;
          }}
          onEnd={() => {
            orbitingRef.current = false;
          }}
        />
      </Suspense>

      {!isMobile && (
        <EffectComposer multisampling={0} disableNormalPass>
          <Vignette eskil={false} offset={0.16} darkness={pal.vignette} />
        </EffectComposer>
      )}
    </Canvas>
  );
}

function CameraRig({ progressRef, orbitingRef }) {
  const { camera } = useThree();
  useFrame(() => {
    if (orbitingRef?.current) return;
    const s = progressRef?.current ?? 0;
    // Minimal dolly — no continuous orbit. Gives the cloud a subtle push as
    // the user starts scrolling, nothing more.
    const z = THREE.MathUtils.lerp(5.2, 4.6, s);
    const y = THREE.MathUtils.lerp(0, 0.15, s);
    camera.position.set(0, y, z);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ----------------------- Particle logo mark ------------------------------- */

const VERT = /* glsl */ `
  attribute float aSeed;
  attribute float aScale;

  uniform float uTime;
  uniform float uPixel;
  uniform float uPointMul;
  uniform float uAlphaGlobal;

  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Per-particle drift so the cloud breathes without obscuring the shape.
    float t = uTime + aSeed * 6.2831;
    pos.x += sin(t * 0.8) * 0.02;
    pos.y += cos(t * 0.7 + aSeed) * 0.018;
    pos.z += sin(t * 1.0 + aSeed * 2.0) * 0.05;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = aScale * uPixel * (22.0 / max(dist, 0.1)) * uPointMul;

    vAlpha = (0.7 + 0.3 * aScale) * uAlphaGlobal;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float mask = smoothstep(0.5, 0.1, d);
    if (mask <= 0.01) discard;

    gl_FragColor = vec4(uColor, mask * vAlpha);
  }
`;

function PlivixLogoParticles({ palette, mode, isMobile }) {
  const groupRef = useRef(null);
  const matRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [geom, setGeom] = useState(null);

  /* Load the logo PNG → offscreen canvas → sample particles. Runs once on
     mount; the resulting positions are theme-agnostic (color is a uniform). */
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    // The icon-only mark. Alpha channel is what we care about, not color —
    // the shader tints the particles from the theme palette.
    img.src = "/images/logo/logo-light-theme.png";

    img.onload = () => {
      if (cancelled) return;

      const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
      // Desktop: 2px stride. Mobile: 5px — far fewer points so the mark
      // stays readable and doesn’t “solid blob” from overlap.
      const stride = isSmall ? 5 : 2;

      // Work in a fixed-size canvas preserving the logo's aspect ratio.
      const naturalAR = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
      const W = 360;
      const H = Math.max(16, Math.round(W / naturalAR));

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(img, 0, 0, W, H);

      let data;
      try {
        data = ctx.getImageData(0, 0, W, H).data;
      } catch {
        return; // cross-origin taint — skip gracefully
      }

      // Scale so the mark fills most of the camera's viewport height.
      // Camera at z=5.2, fov=38° → visible height ≈ 2 * 5.2 * tan(19°) ≈ 3.58.
      const worldH = isSmall ? 1.95 : 2.8;
      const s = worldH / H;
      const alphaCut = isSmall ? 168 : 140;

      const pts = [];
      for (let y = 0; y < H; y += stride) {
        for (let x = 0; x < W; x += stride) {
          const i = (y * W + x) * 4;
          if (data[i + 3] > alphaCut) {
            const wx = (x - W / 2) * s;
            const wy = -(y - H / 2) * s;
            const jx = (Math.random() - 0.5) * 0.02;
            const jy = (Math.random() - 0.5) * 0.02;
            const jz = (Math.random() - 0.5) * (isSmall ? 0.16 : 0.32);
            pts.push(wx + jx, wy + jy, jz);
          }
        }
      }

      const count = pts.length / 3;
      const positions = new Float32Array(pts);
      const seeds = new Float32Array(count);
      const scales = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        seeds[i] = Math.random();
        if (isSmall) {
          scales[i] = 0.72 + Math.random() * Math.random() * 1.1;
        } else {
          scales[i] = 0.95 + Math.random() * Math.random() * 1.9;
        }
      }
      setGeom({ positions, seeds, scales, count });
    };

    return () => {
      cancelled = true;
    };
  }, []);

  /* Mouse-driven tilt. Pointer is captured in NDC [-1,1]; smoothed each frame. */
  useEffect(() => {
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(palette.color) },
      uPixel: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio || 1, 2)
            : 1,
      },
      uPointMul: { value: isMobile ? 0.36 : 1 },
      uAlphaGlobal: { value: isMobile ? 0.48 : 1 },
    }),
    [isMobile]
  );

  useFrame((_, delta) => {
    const ease = Math.min(delta * 4, 1);
    pointer.current.x += (target.current.x - pointer.current.x) * ease;
    pointer.current.y += (target.current.y - pointer.current.y) * ease;

    if (groupRef.current) {
      const ry = isMobile ? 0.38 : 0.55;
      const rx = isMobile ? 0.22 : 0.32;
      groupRef.current.rotation.y = pointer.current.x * ry;
      groupRef.current.rotation.x = pointer.current.y * rx;
    }
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uColor.value.set(palette.color);
    }
  });

  const material = useMemo(() => {
    const useAdditive = !isMobile && mode !== "light";
    return new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: useAdditive ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms,
    });
  }, [isMobile, mode, uniforms]);

  if (!geom) return null;

  const groupScale = isMobile ? 1.58 : 1.15;

  return (
    <group ref={groupRef} scale={groupScale}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={geom.positions}
            count={geom.count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aSeed"
            array={geom.seeds}
            count={geom.count}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-aScale"
            array={geom.scales}
            count={geom.count}
            itemSize={1}
          />
        </bufferGeometry>
        <primitive ref={matRef} object={material} attach="material" />
      </points>
    </group>
  );
}
