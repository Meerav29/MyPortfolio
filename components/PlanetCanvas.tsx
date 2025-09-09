"use client";
import dynamic from "next/dynamic";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors, lighten, darken } from "../lib/theme";
import { useTheme } from "./ThemeProvider";

// Generate a starry canvas texture using the provided base color.
function useCosmicTexture(base: string, size = 1024) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.15,
      size / 2,
      size / 2,
      size / 2
    );
    g.addColorStop(0, lighten(base, 0.1));
    g.addColorStop(1, base);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 800; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 2 + 0.2;
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, [base, size]);
}

// --- Planet: cosmic sphere with subtle glow
function Planet() {
  const { background } = useThemeColors();
  const { theme } = useTheme();
  const base = theme === "dark" ? "#8EC5FC" : "#000000";
  const texture = useCosmicTexture(base);
  const planetRef = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.1;
  });

  return (
    <group ref={planetRef}>
      {/* thin outline */}
      <mesh scale={1.03} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          color={theme === "dark" ? "#000000" : darken(background, 0.6)}
          side={THREE.BackSide}
        />
      </mesh>

      {/* textured body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>

      {/* soft atmosphere */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          color={lighten(base, 0.1)}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// --- Tiny satellite orbiting
function Satellite() {
  const base = "#000000";
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }
  });

  const trail = lighten(base, 0.3);
  const body = lighten(base, 0.6);
  const emissive = lighten(base, 0.4);

  return (
    <group ref={groupRef}>
      <Trail width={0.015} length={6} color={trail} decay={4}>
        <mesh position={[2.2, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={body} emissive={emissive} emissiveIntensity={0.4} />
        </mesh>
      </Trail>
    </group>
  );
}

function Scene({ offsetX = 0, scale = 1 }: { offsetX?: number; scale?: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <group position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <Planet />
        <Satellite />
      </group>
      <Stars radius={50} depth={30} count={1200} factor={2} fade />
      {/** Fixed camera; no manual or auto rotation */}
    </>
  );
}

// dynamic to avoid SSR issues
const R3FCanvas = dynamic(
  () =>
    Promise.resolve(
      ({ className, offsetX = 0, scale = 1 }: { className?: string; offsetX?: number; scale?: number }) => (
      <Canvas
        className={className}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene offsetX={offsetX} scale={scale} />
        </Suspense>
      </Canvas>
      )
    ),
  { ssr: false }
);

export default function PlanetCanvas({ offsetX = 0, scale = 1 }: { offsetX?: number; scale?: number }) {
  return (
    <div className="relative w-full h-full" aria-hidden="true">
      {/* prefers-reduced-motion: pause auto-rotate */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          canvas { animation: none !important; }
        }
      `}</style>
      {/* override global canvas pointer-events to allow interaction */}
      <R3FCanvas className="absolute inset-0 pointer-events-auto" offsetX={offsetX} scale={scale} />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
