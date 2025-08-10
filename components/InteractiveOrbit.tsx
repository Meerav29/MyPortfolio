"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";

/* --- Utilities --- */
function useToonGradient(steps = 4) {
  return useMemo(() => {
    const size = steps;
    const data = new Uint8Array(size * 3);
    for (let i = 0; i < size; i++) {
      const v = Math.floor((i / (size - 1)) * 255);
      data[i * 3 + 0] = v; data[i * 3 + 1] = v; data[i * 3 + 2] = v;
    }
    const tex = new THREE.DataTexture(data, size, 1, THREE.RGBFormat);
    tex.needsUpdate = true;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    return tex;
  }, [steps]);
}

/* --- Planet: toon sphere + thin outline + soft atmosphere --- */
function Planet() {
  const gradient = useToonGradient(4);
  const planetRef = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.05; // slow idle spin
  });

  return (
    <group ref={planetRef} position={[0, -0.1, 0]}>
      {/* Outline (very thin) */}
      <mesh scale={1.015}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#080b12" side={THREE.BackSide} />
      </mesh>

      {/* Toon body */}
      <mesh>
        <sphereGeometry args={[1.48, 64, 64]} />
        <meshToonMaterial
          color={"#0f1f4b"}                 // deep blue
          gradientMap={gradient}
          emissive={"#1f3b8a"}              // subtle inner glow
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Atmosphere glow (additive, very subtle) */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1.48, 64, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* --- Satellite: small capsule + slim panels + elegant white trail --- */
function Satellite({
  radius = 3.1,
  speed = 0.35,
  tiltDeg = 18
}: { radius?: number; speed?: number; tiltDeg?: number }) {
  const sat = useRef<THREE.Group>(null!);
  const tilt = THREE.MathUtils.degToRad(tiltDeg);

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();
    const x = Math.cos(t * speed) * radius;
    const z = Math.sin(t * speed) * radius;
    const y = Math.sin(t * speed * 2) * 0.18;
    const p = new THREE.Vector3(x, y, z).applyEuler(new THREE.Euler(tilt, 0, 0, "XYZ"));
    if (sat.current) {
      sat.current.position.copy(p);
      sat.current.lookAt(camera.position);
    }
  });

  return (
    <group>
      {/* trail follows satellite */}
      <Trail width={0.5} color="#e0f2fe" length={10} decay={0.9} attenuation={(t) => t}>
        <group ref={sat}>
          {/* capsule body */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.28, 24]} />
            <meshStandardMaterial color="#f5f7fb" roughness={0.25} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color="#f5f7fb" roughness={0.25} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color="#f5f7fb" roughness={0.25} metalness={0.05} />
          </mesh>
          {/* slim panels */}
          <mesh position={[0.24, 0, 0]}>
            <boxGeometry args={[0.014, 0.26, 0.56]} />
            <meshStandardMaterial color="#9fc5ff" roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[-0.24, 0, 0]}>
            <boxGeometry args={[0.014, 0.26, 0.56]} />
            <meshStandardMaterial color="#9fc5ff" roughness={0.3} metalness={0.1} />
          </mesh>
        </group>
      </Trail>
    </group>
  );
}

/* --- Scene --- */
function Scene() {
  return (
    <>
      {/* flattering, minimal lighting */}
      <hemisphereLight color={"#e6eefc"} groundColor={"#0b1020"} intensity={0.35} />
      <directionalLight position={[3, 4, 2]} intensity={0.9} color={"#ffffff"} />

      <Planet />
      <Satellite />

      {/* fewer, dimmer stars for cleanliness */}
      <Stars radius={55} depth={25} count={650} factor={2} fade saturation={0} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.25}
        minPolarAngle={Math.PI * 0.38}
        maxPolarAngle={Math.PI * 0.62}
      />
    </>
  );
}

/* --- Canvas wrapper (SSR-safe) --- */
const R3FCanvas = dynamic(
  () =>
    Promise.resolve(({ className }: { className?: string }) => (
      <Canvas
        className={className}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    )),
  { ssr: false }
);

/* --- Exported component --- */
export default function InteractiveOrbit() {
  return (
    <div
      className="relative w-full h-[420px] md:h-[520px] rounded-2xl border shadow-sm overflow-hidden
                 bg-gradient-to-br from-[#0a0f1d] via-[#0b1120] to-[#0b1530]"
      aria-hidden="true"
    >
      <R3FCanvas className="absolute inset-0" />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
