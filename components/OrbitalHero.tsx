"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

// --- Planet
function Planet() {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1d4ed8", metalness: 0.2, roughness: 0.4 }),
    []
  );
  return (
    <mesh castShadow receiveShadow material={mat}>
      <sphereGeometry args={[1.2, 64, 64]} />
    </mesh>
  );
}

// --- Tiny satellite orbiting
function Satellite() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      <group>
        <mesh position={[2.1, 0.4, 0]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.4]} />
          <meshStandardMaterial color="#93c5fd" />
        </mesh>

        {/* solar panels */}
        <mesh position={[2.1, 0.4, -0.35]}>
          <boxGeometry args={[0.02, 0.5, 0.7]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
        <mesh position={[2.1, 0.4, 0.35]}>
          <boxGeometry args={[0.02, 0.5, 0.7]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
      </group>
    </group>
  );
}

// export default Satellite;

// --- Glow ring
function Halo() {
  return (
    <mesh rotation={[1.2, 0, 0]}>
      <ringGeometry args={[1.6, 1.9, 96]} />
      <meshBasicMaterial color="#2563eb" transparent opacity={0.25} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <Planet />
      <Halo />
      <Satellite />
      <Stars radius={50} depth={30} count={1200} factor={2} fade />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </>
  );
}

// dynamic to avoid SSR issues
const R3FCanvas = dynamic(
  () => Promise.resolve(({ className }: { className?: string }) => (
    <Canvas
      className={className}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )),
  { ssr: false }
);

export default function OrbitalHero() {
  return (
    <div
      className="relative w-full h-[420px] md:h-[520px] rounded-2xl border shadow-sm
                 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 overflow-hidden"
      aria-hidden="true"
    >
      {/* prefers-reduced-motion: pause auto-rotate */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          canvas { animation: none !important; }
        }
      `}</style>
      <R3FCanvas className="absolute inset-0" />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
