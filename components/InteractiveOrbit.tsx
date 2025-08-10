"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";

/** Tiny helper: build a 1×N grayscale gradient texture for toon steps */
function useToonGradient(steps = 4) {
  return useMemo(() => {
    const size = steps;
    const data = new Uint8Array(size * 3);
    for (let i = 0; i < size; i++) {
      const v = Math.floor((i / (size - 1)) * 255);
      data[i * 3 + 0] = v;
      data[i * 3 + 1] = v;
      data[i * 3 + 2] = v;
    }
    const tex = new THREE.DataTexture(data, size, 1, THREE.RGBFormat);
    tex.needsUpdate = true;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    return tex;
  }, [steps]);
}

/** Planet: toon sphere + outline shell */
function PlanetSphere() {
  const gradient = useToonGradient(5);

  // colors tuned for your blue/black aesthetic
  const base = new THREE.Color("#1e3a8a"); // indigo-800
  const highlight = new THREE.Color("#3b82f6"); // blue-500

  // slow idle spin
  const planetRef = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.08;
  });

  return (
    <group ref={planetRef} position={[0, 0, 0]}>
      {/* Outline: slightly bigger, rendered on the back side */}
      <mesh scale={1.03}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial color="#0b1020" side={THREE.BackSide} />
      </mesh>

      {/* Toon body */}
      <mesh>
        <sphereGeometry args={[1.75, 64, 64]} />
        <meshToonMaterial
          color={base}
          gradientMap={gradient}
          emissive={highlight.clone().multiplyScalar(0.05)}
        />
      </mesh>

      {/* A soft rim light to sell the form */}
      <pointLight position={[2.8, 1.6, 2.2]} intensity={0.6} color={"#60a5fa"} />
    </group>
  );
}

/** Satellite: simple capsule + thin panels, with a white trail */
function Satellite({ radius = 4, speed = 0.45, tiltDeg = 22 }: { radius?: number; speed?: number; tiltDeg?: number }) {
  const group = useRef<THREE.Group>(null!);
  const sat = useRef<THREE.Group>(null!);
  const tilt = THREE.MathUtils.degToRad(tiltDeg);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    const x = Math.cos(t * speed) * radius;
    const z = Math.sin(t * speed) * radius;
    const y = Math.sin(t * speed * 2) * 0.25;

    // rotate vector by tilt around X
    const p = new THREE.Vector3(x, y, z).applyEuler(new THREE.Euler(tilt, 0, 0, "XYZ"));

    if (sat.current) {
      sat.current.position.copy(p);
      // face camera gently for readability
      sat.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={group}>
      {/* faint orbit ring for depth */}
      <mesh rotation={[tilt, 0, 0]}>
        <torusGeometry args={[radius, 0.01, 8, 160]} />
        <meshBasicMaterial color="#dbeafe" transparent opacity={0.22} />
      </mesh>

      {/* trail follows the satellite group */}
      <Trail
        width={1.6}
        color={"#ffffff"}
        length={12}
        decay={0.9}
        attenuation={(t) => t}
      >
        <group ref={sat}>
          {/* body (capsule-ish using cylinder + hemispherical caps) */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.38, 24]} />
            <meshStandardMaterial color="#f5f5f6" roughness={0.25} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.19, 0]}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshStandardMaterial color="#f5f5f6" roughness={0.25} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.19, 0]}>
            <sphereGeometry args={[0.11, 24, 24]} />
            <meshStandardMaterial color="#f5f5f6" roughness={0.25} metalness={0.05} />
          </mesh>

          {/* solar panels */}
          <mesh position={[0.32, 0, 0]}>
            <boxGeometry args={[0.02, 0.32, 0.72]} />
            <meshStandardMaterial color="#93c5fd" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[-0.32, 0, 0]}>
            <boxGeometry args={[0.02, 0.32, 0.72]} />
            <meshStandardMaterial color="#93c5fd" roughness={0.3} metalness={0.1} />
          </mesh>
        </group>
      </Trail>
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* lighting that flatters toon + metal a bit */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} color={"#e2e8f0"} />

      <PlanetSphere />
      <Satellite />

      <Stars radius={55} depth={25} count={900} factor={2} fade />
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
