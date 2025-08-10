"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

// --- Planet
function Planet() {
  const texture = useLoader(THREE.TextureLoader, "/planet.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial map={texture} metalness={0.2} roughness={0.8} />
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
      <Trail width={0.01} length={6} color="#f0f9ff" decay={8}>
        <mesh position={[2.2, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#93c5fd" emissiveIntensity={0.4} />
        </mesh>
      </Trail>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <Planet />
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
