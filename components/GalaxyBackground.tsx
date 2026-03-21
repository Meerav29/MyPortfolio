"use client";
import dynamic from "next/dynamic";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors, lighten, darken } from "../lib/theme";
import { useTheme } from "./ThemeProvider";

// Reuse the same cosmic texture generator from PlanetCanvas
function useCosmicTexture(base: string, size = 1024) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const g = ctx.createRadialGradient(
      size / 2, size / 2, size * 0.15,
      size / 2, size / 2, size / 2
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
      <mesh scale={1.03} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          color={theme === "dark" ? "#000000" : darken(background, 0.6)}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>
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

function Satellite() {
  const base = "#000000";
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.25;
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

// Stars layer that subtly reacts to cursor movement
function ReactiveStars() {
  const starsRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  // Smoothed mouse position for gentle parallax
  const smoothed = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Lerp toward current pointer for smooth follow
    smoothed.current.x += (pointer.x * 0.15 - smoothed.current.x) * 0.02;
    smoothed.current.y += (pointer.y * 0.1 - smoothed.current.y) * 0.02;

    if (starsRef.current) {
      starsRef.current.rotation.y = smoothed.current.x;
      starsRef.current.rotation.x = -smoothed.current.y;
    }
  });

  return (
    <group ref={starsRef}>
      <Stars radius={50} depth={40} count={2000} factor={2.5} fade saturation={0.2} />
    </group>
  );
}

// Additional scattered nebula-like dust particles that also react to cursor
function ReactiveDust() {
  const dustRef = useRef<THREE.Points>(null!);
  const { pointer } = useThree();
  const smoothed = useRef({ x: 0, y: 0 });

  const [positions, sizes] = useMemo(() => {
    const count = 300;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread in a wide sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 8 + Math.random() * 35;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() * 1.5 + 0.3;
    }
    return [pos, sz];
  }, []);

  useFrame(() => {
    smoothed.current.x += (pointer.x * 0.08 - smoothed.current.x) * 0.015;
    smoothed.current.y += (pointer.y * 0.05 - smoothed.current.y) * 0.015;

    if (dustRef.current) {
      dustRef.current.rotation.y = smoothed.current.x * 0.5;
      dustRef.current.rotation.x = -smoothed.current.y * 0.5;
    }
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8EC5FC"
        size={0.08}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
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
      <ReactiveStars />
      <ReactiveDust />
    </>
  );
}

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

export default function GalaxyBackground({ offsetX = 0, scale = 1 }: { offsetX?: number; scale?: number }) {
  return (
    <div className="fixed inset-0 w-full h-full" aria-hidden="true">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          canvas { animation: none !important; }
        }
      `}</style>
      <R3FCanvas className="absolute inset-0 pointer-events-auto" offsetX={offsetX} scale={scale} />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
