"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const PAL = {
  dark: { slab: "#17171d", edge: "#cfc6ff", active: "#d4cbff", light: 1.1 },
  light: { slab: "#ffffff", edge: "#2c2167", active: "#2c2167", light: 1.4 },
};

/** One ERP module = one slab. Slabs stack up as the section scrolls in. */
function Slabs({ count, activeIdx, progressRef, pal, isMobile }) {
  const group = useRef();
  const slabs = useRef([]);
  const pointer = useRef({ x: 0, y: 0 });

  useFrame((state, dt) => {
    const k = Math.min(dt * 5, 1);
    const p = progressRef.current;
    const assemble = THREE.MathUtils.clamp(p * 2.2, 0, 1);
    const mid = (count - 1) / 2;
    const gap = THREE.MathUtils.lerp(1.05, 0.36, assemble);

    pointer.current.x += (state.pointer.x - pointer.current.x) * k * 0.6;
    pointer.current.y += (state.pointer.y - pointer.current.y) * k * 0.6;
    if (group.current) {
      group.current.rotation.y = -0.65 + pointer.current.x * 0.45 + p * 0.5;
      group.current.rotation.x = 0.18 - pointer.current.y * 0.12;
    }
    slabs.current.forEach((m, i) => {
      if (!m) return;
      const lift = i === activeIdx ? 0.28 : 0;
      const slide = i === activeIdx ? 0.35 : 0;
      m.position.y += ((i - mid) * gap + lift - m.position.y) * k;
      m.position.x += (slide - m.position.x) * k;
      m.material.color.set(i === activeIdx ? pal.active : pal.slab);
    });
  });

  return (
    <group ref={group} scale={isMobile ? 0.8 : 1}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} ref={(el) => (slabs.current[i] = el)} position={[0, (i - (count - 1) / 2) * 1.05, 0]}>
          <boxGeometry args={[2.6, 0.18, 1.7]} />
          <meshStandardMaterial color={pal.slab} roughness={0.55} metalness={0.15} />
          <Edges color={pal.edge} threshold={15} />
        </mesh>
      ))}
    </group>
  );
}

export default function ErpCanvas({ count = 8, activeIdx = -1, progressRef, theme = "dark", isMobile = false }) {
  const pal = theme === "light" ? PAL.light : PAL.dark;
  return (
    <Canvas
      dpr={isMobile ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.6, 7.2], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", touchAction: "pan-y" }}
    >
      <ambientLight intensity={pal.light * 0.55} />
      <directionalLight position={[4, 6, 5]} intensity={pal.light * 1.4} />
      <directionalLight position={[-5, -2, -3]} intensity={0.4} color="#8b5cff" />
      <Slabs count={count} activeIdx={activeIdx} progressRef={progressRef} pal={pal} isMobile={isMobile} />
    </Canvas>
  );
}
