"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

/** Flat planet as a plane (keeps your illustrated style) */
function PlanetPlane() {
  const tex = useTexture("/planet.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  // A simple plane (NOT billboarded), so rotating the camera gives parallax
  return (
    <mesh position={[0, 0, 0]} rotation={[-0.12, 0.25, 0]}>
      <planeGeometry args={[3.2, 3.2]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.5} depthWrite={false} />
    </mesh>
  );
}

/** Satellite orbiting in 3D around the origin with a slight inclination */
function SatelliteOrbit() {
  const tex = useTexture("/satellite.png");
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const satelliteRef = useRef<THREE.Mesh>(null!);
  // Group that we rotate to tilt the orbital plane
  const orbitPlaneRef = useRef<THREE.Group>(null!);

  // Tilt the orbit plane (so it’s not perfectly flat to camera)
  const inclination = THREE.MathUtils.degToRad(25); // 25° tilt
  const r = 4;                                      // orbit radius
  const speed = 0.4;                                // radians/sec

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    if (!satelliteRef.current || !orbitPlaneRef.current) return;

    // position on orbit in its local plane
    const x = Math.cos(t * speed) * r;
    const z = Math.sin(t * speed) * r;
    const y = Math.sin(t * speed * 2) * 0.25; // gentle bob

    // apply inclination by rotating the local vector
    const p = new THREE.Vector3(x, y, z);
    p.applyEuler(new THREE.Euler(inclination, 0, 0, "XYZ"));

    satelliteRef.current.position.copy(p);

    // Make the satellite face the camera so the icon stays crisp
    satelliteRef.current.lookAt(camera.position);
  });

  return (
    <group ref={orbitPlaneRef}>
      {/* optional faint orbit ring for depth cue */}
      <mesh rotation={[inclination, 0, 0]}>
        <torusGeometry args={[r, 0.005, 8, 128]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.25} />
      </mesh>

      <mesh ref={satelliteRef}>
        <planeGeometry args={[1.0, 1.0]} />
        <meshBasicMaterial map={tex} transparent alphaTest={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Scene() {
  const { gl } = useThree();
  // Better texture filtering for crisp icons
  useMemo(() => {
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={0.6} />

      <PlanetPlane />
      <SatelliteOrbit />
      <Stars radius={50} depth={20} count={1100} factor={2} fade />

      <OrbitControls enablePan={false} enableZoom={true} />
    </>
  );
}

const R3FCanvas = dynamic(
  () =>
    Promise.resolve(({ className }: { className?: string }) => (
      <Canvas
        className={className}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
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
      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
