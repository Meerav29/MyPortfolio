"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Billboard, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Planet as a billboarded plane with your PNG (stays facing the camera slightly)
function PlanetBillboard() {
  const tex = useTexture("/planet.png");
  // Ensure transparency looks crisp
  tex.anisotropy = 8;

  return (
    <Billboard position={[0, 0, 0]}>
      <mesh>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
    </Billboard>
  );
}

// Satellite that actually orbits around the origin in 3D
function SatelliteOrbit() {
  const tex = useTexture("/satellite.png");
  tex.anisotropy = 8;

  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // orbit radius + vertical bob
    const r = 4.0;
    const x = Math.cos(t * 0.4) * r;
    const z = Math.sin(t * 0.4) * r;
    const y = Math.sin(t * 0.8) * 0.25; // subtle bob
    if (groupRef.current) groupRef.current.position.set(x, y, z);
  });

  // Have the satellite always face the camera for a clean 2D look in 3D space
  return (
    <group ref={groupRef}>
      <Billboard>
        <mesh>
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial map={tex} transparent />
        </mesh>
      </Billboard>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* subtle lights (BasicMaterial doesn't need them, but helps if you add 3D meshes later) */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={0.6} />

      <PlanetBillboard />
      <SatelliteOrbit />

      {/* stars add depth without weight */}
      <Stars radius={50} depth={20} count={1200} factor={2} fade />

      <OrbitControls enablePan={false} enableZoom={true} />
    </>
  );
}

// Avoid SSR issues
const R3FCanvas = dynamic(
  () =>
    Promise.resolve(({ className }: { className?: string }) => (
      <Canvas
        className={className}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    )),
  { ssr: false }
);

export default function InteractiveOrbit() {
  return (
    <div
      className="relative w-full h-[420px] md:h-[520px] rounded-2xl border shadow-sm overflow-hidden
                 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950"
      aria-hidden="true"
    >
      <R3FCanvas className="absolute inset-0" />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
