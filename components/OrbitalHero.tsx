"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

// --- Planet
function Planet() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // base ocean gradient with a subtle terminator
    const ocean = ctx.createLinearGradient(0, 0, 512, 0);
    ocean.addColorStop(0, "#0a2a6b");
    ocean.addColorStop(1, "#0d47a1");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // rough "continents"
    ctx.fillStyle = "#2e7d32";
    ctx.beginPath();
    ctx.moveTo(180, 110);
    ctx.bezierCurveTo(150, 90, 210, 60, 200, 110);
    ctx.bezierCurveTo(210, 140, 160, 140, 180, 110);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(340, 80);
    ctx.bezierCurveTo(360, 60, 360, 100, 340, 80);
    ctx.bezierCurveTo(320, 90, 320, 70, 340, 80);
    ctx.fill();

    // faint clouds
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 256;
      const r = Math.random() * 15 + 5;
      ctx.beginPath();
      ctx.ellipse(x, y, r * 2, r, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    return new THREE.CanvasTexture(canvas);
  }, []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: texture, metalness: 0.1, roughness: 0.6 }),
    [texture]
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
      <Trail width={0.015} length={6} color="#e0f2fe" decay={4}>
        <mesh position={[2.2, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#93c5fd" emissiveIntensity={0.4} />
        </mesh>
      </Trail>
    </group>
  );
}

// export default Satellite;

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
