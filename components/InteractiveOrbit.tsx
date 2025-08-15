"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors, lighten, darken } from "../lib/theme";
import { useTheme } from "./ThemeProvider";

/* --- Utilities --- */
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

/* --- Planet: toon sphere + thin outline + soft atmosphere --- */
function Planet() {
  const gradient = useToonGradient(4);
  const { accent, background } = useThemeColors();
  const { theme } = useTheme();
  const base = theme === "light" ? "#1f2937" : accent;
  const planetRef = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.05;
  });

  return (
    <group ref={planetRef} position={[0, -0.1, 0]}>
      {/* Outline (very thin) */}
      <mesh scale={1.015}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color={darken(background, 0.6)} side={THREE.BackSide} />
      </mesh>

      {/* Toon body */}
      <mesh>
        <sphereGeometry args={[1.48, 64, 64]} />
        <meshToonMaterial
          color={base}
          gradientMap={gradient}
          emissive={lighten(base, 0.2)}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Atmosphere glow (additive, very subtle) */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1.48, 64, 64]} />
        <meshBasicMaterial
          color={lighten(base, 0.25)}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* --- Satellite: small capsule + slim panels + elegant trail --- */
function Satellite({
  radius = 3.1,
  speed = 0.35,
  tiltDeg = 18,
}: { radius?: number; speed?: number; tiltDeg?: number }) {
  const { accent } = useThemeColors();
  const { theme } = useTheme();
  const base = theme === "light" ? "#1f2937" : accent;
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

  const trail = lighten(base, 0.3);
  const body = lighten(base, 0.6);
  const panel = lighten(base, 0.4);

  return (
    <group>
      {/* trail follows satellite */}
      <Trail width={0.5} color={trail} length={10} decay={0.9} attenuation={(t) => t}>
        <group ref={sat}>
          {/* capsule body */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.28, 24]} />
            <meshStandardMaterial color={body} roughness={0.25} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={body} roughness={0.25} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.14, 0]}>
            <sphereGeometry args={[0.08, 24, 24]} />
            <meshStandardMaterial color={body} roughness={0.25} metalness={0.05} />
          </mesh>
          {/* slim panels */}
          <mesh position={[0.24, 0, 0]}>
            <boxGeometry args={[0.014, 0.26, 0.56]} />
            <meshStandardMaterial color={panel} roughness={0.3} metalness={0.1} />
          </mesh>
          <mesh position={[-0.24, 0, 0]}>
            <boxGeometry args={[0.014, 0.26, 0.56]} />
            <meshStandardMaterial color={panel} roughness={0.3} metalness={0.1} />
          </mesh>
        </group>
      </Trail>
    </group>
  );
}

/* --- Scene --- */
function Scene() {
  const { accent, background } = useThemeColors();
  const { theme } = useTheme();
  const base = theme === "light" ? "#1f2937" : accent;
  return (
    <>
      {/* flattering, minimal lighting */}
      <hemisphereLight
        color={lighten(base, 0.6)}
        groundColor={darken(background, 0.6)}
        intensity={0.35}
      />
      <directionalLight position={[3, 4, 2]} intensity={0.9} color={lighten(base, 0.2)} />

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
  const { accent, background } = useThemeColors();
  const bg = `linear-gradient(to bottom right, ${darken(background, 0.05)}, ${darken(accent, 0.6)})`;
  return (
    <div
      className="relative w-full h-[80vh] rounded-2xl border shadow-sm overflow-hidden"
      aria-hidden="true"
      style={{ background: bg }}
    >
      <R3FCanvas className="absolute inset-0" />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
