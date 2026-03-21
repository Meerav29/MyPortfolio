"use client";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Trail } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors, lighten, darken } from "../lib/theme";
import { useTheme } from "./ThemeProvider";

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

const PLANET_RADIUS = 1.2;
const SEGMENTS = 64;
// How close (in world units) the cursor must be to the planet center to trigger morphing
const INTERACTION_RADIUS = 3.5;
// Maximum vertex displacement
const MAX_BULGE = 0.25;
// How tight the bulge cone is (higher = tighter). Controls the angular falloff.
const BULGE_FOCUS = 3.0;

function MorphPlanet({ groupPosition }: { groupPosition: THREE.Vector3 }) {
  const { background } = useThemeColors();
  const { theme } = useTheme();
  const base = theme === "dark" ? "#8EC5FC" : "#000000";
  const texture = useCosmicTexture(base);

  const planetGroupRef = useRef<THREE.Group>(null!);
  const mainMeshRef = useRef<THREE.Mesh>(null!);
  const outlineMeshRef = useRef<THREE.Mesh>(null!);
  const atmoMeshRef = useRef<THREE.Mesh>(null!);

  // Store original vertex positions for each geometry
  const originals = useRef<{
    main: Float32Array | null;
    outline: Float32Array | null;
    atmo: Float32Array | null;
  }>({ main: null, outline: null, atmo: null });

  const { camera, pointer } = useThree();

  // Smoothed bulge strength for organic feel
  const smoothBulge = useRef(0);
  // Smoothed cursor direction
  const smoothDir = useRef(new THREE.Vector3(0, 0, 1));

  // Raycaster + plane for projecting cursor into 3D at planet depth
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const planeNormal = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  // Clone original positions on first frame
  useEffect(() => {
    const storeOriginals = () => {
      if (mainMeshRef.current?.geometry) {
        const pos = mainMeshRef.current.geometry.attributes.position;
        originals.current.main = new Float32Array(pos.array as Float32Array);
      }
      if (outlineMeshRef.current?.geometry) {
        const pos = outlineMeshRef.current.geometry.attributes.position;
        originals.current.outline = new Float32Array(pos.array as Float32Array);
      }
      if (atmoMeshRef.current?.geometry) {
        const pos = atmoMeshRef.current.geometry.attributes.position;
        originals.current.atmo = new Float32Array(pos.array as Float32Array);
      }
    };
    // Small delay to ensure geometries are ready
    const id = requestAnimationFrame(storeOriginals);
    return () => cancelAnimationFrame(id);
  }, []);

  useFrame((_, dt) => {
    if (!planetGroupRef.current) return;

    // Slow rotation (same as original)
    planetGroupRef.current.rotation.y += dt * 0.1;

    // Project cursor onto a plane at the planet's z-depth
    raycaster.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(planeNormal, -groupPosition.z);
    const cursorWorld = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, cursorWorld);

    if (!cursorWorld) return;

    // Distance from cursor to planet center (in world XY)
    const planetCenter2D = new THREE.Vector2(groupPosition.x, groupPosition.y);
    const cursor2D = new THREE.Vector2(cursorWorld.x, cursorWorld.y);
    const dist = planetCenter2D.distanceTo(cursor2D);

    // Target bulge strength: 1 at planet surface, 0 at INTERACTION_RADIUS
    let targetStrength = 0;
    if (dist < INTERACTION_RADIUS) {
      // Smooth falloff: strong near surface, fades to zero at edge
      const t = 1 - dist / INTERACTION_RADIUS;
      targetStrength = t * t; // quadratic ease
    }

    // Smooth the strength over time
    smoothBulge.current += (targetStrength - smoothBulge.current) * Math.min(dt * 4, 1);

    // Direction from planet center toward cursor (in local space)
    const targetDir = new THREE.Vector3(
      cursorWorld.x - groupPosition.x,
      cursorWorld.y - groupPosition.y,
      0
    );
    if (targetDir.length() > 0.001) targetDir.normalize();

    // Smooth the direction
    smoothDir.current.lerp(targetDir, Math.min(dt * 5, 1));
    smoothDir.current.normalize();

    const strength = smoothBulge.current * MAX_BULGE;

    // Apply deformation to each mesh
    const meshes = [
      { ref: mainMeshRef, orig: originals.current.main, baseRadius: PLANET_RADIUS },
      { ref: outlineMeshRef, orig: originals.current.outline, baseRadius: PLANET_RADIUS * 1.03 },
      { ref: atmoMeshRef, orig: originals.current.atmo, baseRadius: PLANET_RADIUS * 1.1 },
    ];

    for (const { ref, orig, baseRadius } of meshes) {
      if (!ref.current?.geometry || !orig) continue;

      const posAttr = ref.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      const vertDir = new THREE.Vector3();

      for (let i = 0; i < posAttr.count; i++) {
        const ox = orig[i * 3];
        const oy = orig[i * 3 + 1];
        const oz = orig[i * 3 + 2];

        // Vertex normal (direction from center, since it's a sphere)
        vertDir.set(ox, oy, oz).normalize();

        // How much this vertex faces the cursor direction
        // dot = 1 when vertex points directly at cursor, -1 when away
        const dot = vertDir.dot(smoothDir.current);

        // Only displace vertices that face toward the cursor
        if (dot > 0) {
          // Focused falloff: pow raises it to narrow the cone
          const influence = Math.pow(dot, BULGE_FOCUS);
          const scale = baseRadius / PLANET_RADIUS; // scale displacement for outline/atmo
          const displacement = strength * influence * scale;

          arr[i * 3] = ox + vertDir.x * displacement;
          arr[i * 3 + 1] = oy + vertDir.y * displacement;
          arr[i * 3 + 2] = oz + vertDir.z * displacement;
        } else {
          // Reset to original
          arr[i * 3] = ox;
          arr[i * 3 + 1] = oy;
          arr[i * 3 + 2] = oz;
        }
      }

      posAttr.needsUpdate = true;
      ref.current.geometry.computeVertexNormals();
    }
  });

  return (
    <group ref={planetGroupRef}>
      {/* thin outline */}
      <mesh ref={outlineMeshRef} scale={1.03} castShadow receiveShadow>
        <sphereGeometry args={[PLANET_RADIUS, SEGMENTS, SEGMENTS]} />
        <meshBasicMaterial
          color={theme === "dark" ? "#000000" : darken(background, 0.6)}
          side={THREE.BackSide}
        />
      </mesh>
      {/* textured body */}
      <mesh ref={mainMeshRef} castShadow receiveShadow>
        <sphereGeometry args={[PLANET_RADIUS, SEGMENTS, SEGMENTS]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>
      {/* soft atmosphere */}
      <mesh ref={atmoMeshRef} scale={1.1}>
        <sphereGeometry args={[PLANET_RADIUS, SEGMENTS, SEGMENTS]} />
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

function Scene({ offsetX = 0, scale = 1 }: { offsetX?: number; scale?: number }) {
  const groupPos = useMemo(() => new THREE.Vector3(offsetX, 0, 0), [offsetX]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <group position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <MorphPlanet groupPosition={groupPos} />
        <Satellite />
      </group>
      <Stars radius={50} depth={30} count={1200} factor={2} fade />
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
    <div className="relative w-full h-full" aria-hidden="true">
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
