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
const INTERACTION_RADIUS = 4.0;
// Maximum vertex displacement
const MAX_BULGE = 0.35;
// How tight the bulge cone is (higher = tighter). Controls the angular falloff.
const BULGE_FOCUS = 2.5;

function MorphPlanet({ parentGroupRef }: { parentGroupRef: React.RefObject<THREE.Group> }) {
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

  // Track whether originals have been captured
  const originalsReady = useRef(false);

  const { camera, pointer } = useThree();

  // Smoothed bulge strength for organic feel
  const smoothBulge = useRef(0);
  // Smoothed cursor direction (in local space of the rotating group)
  const smoothDir = useRef(new THREE.Vector3(0, 0, 1));

  // Reusable temp objects to avoid GC
  const _raycaster = useMemo(() => new THREE.Raycaster(), []);
  const _plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const _cursorWorld = useMemo(() => new THREE.Vector3(), []);
  const _planetWorldPos = useMemo(() => new THREE.Vector3(), []);
  const _localDir = useMemo(() => new THREE.Vector3(), []);
  const _invQuat = useMemo(() => new THREE.Quaternion(), []);
  const _vertDir = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    if (!planetGroupRef.current || !parentGroupRef.current) return;

    // Capture originals on first valid frame
    if (!originalsReady.current) {
      if (mainMeshRef.current?.geometry?.attributes?.position) {
        originals.current.main = new Float32Array(
          mainMeshRef.current.geometry.attributes.position.array as Float32Array
        );
        originals.current.outline = new Float32Array(
          outlineMeshRef.current.geometry.attributes.position.array as Float32Array
        );
        originals.current.atmo = new Float32Array(
          atmoMeshRef.current.geometry.attributes.position.array as Float32Array
        );
        originalsReady.current = true;
      }
      return;
    }

    // Slow rotation (same as original)
    planetGroupRef.current.rotation.y += dt * 0.1;

    // Get planet world position (accounts for parent group offset + scale)
    parentGroupRef.current.getWorldPosition(_planetWorldPos);

    // Project cursor onto a plane at the planet's z-depth
    _raycaster.setFromCamera(pointer, camera);
    _plane.normal.set(0, 0, 1);
    _plane.constant = -_planetWorldPos.z;
    const hit = _raycaster.ray.intersectPlane(_plane, _cursorWorld);

    if (!hit) return;

    // Distance from cursor to planet center (in world XY)
    const dx = _cursorWorld.x - _planetWorldPos.x;
    const dy = _cursorWorld.y - _planetWorldPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Target bulge strength: 1 at planet surface, 0 at INTERACTION_RADIUS
    let targetStrength = 0;
    if (dist < INTERACTION_RADIUS) {
      const t = 1 - dist / INTERACTION_RADIUS;
      targetStrength = t * t; // quadratic ease
    }

    // Smooth the strength over time
    smoothBulge.current += (targetStrength - smoothBulge.current) * Math.min(dt * 4, 1);

    // Direction from planet center toward cursor — in WORLD space
    _localDir.set(dx, dy, 0);
    if (_localDir.length() > 0.001) {
      _localDir.normalize();

      // Transform direction into the planet's LOCAL space (undo rotation)
      // Get the world quaternion of the rotating group, invert it
      planetGroupRef.current.getWorldQuaternion(_invQuat);
      _invQuat.invert();
      _localDir.applyQuaternion(_invQuat);
      _localDir.normalize();
    }

    // Smooth the direction in local space
    smoothDir.current.lerp(_localDir, Math.min(dt * 5, 1));
    if (smoothDir.current.length() > 0.001) smoothDir.current.normalize();

    const strength = smoothBulge.current * MAX_BULGE;

    // Apply deformation to each mesh
    const meshes = [
      { ref: mainMeshRef, orig: originals.current.main!, scl: 1 },
      { ref: outlineMeshRef, orig: originals.current.outline!, scl: 1.03 },
      { ref: atmoMeshRef, orig: originals.current.atmo!, scl: 1.1 },
    ];

    for (const { ref, orig, scl } of meshes) {
      if (!ref.current?.geometry) continue;

      const posAttr = ref.current.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < posAttr.count; i++) {
        const i3 = i * 3;
        const ox = orig[i3];
        const oy = orig[i3 + 1];
        const oz = orig[i3 + 2];

        // Vertex normal (direction from center, since it's a sphere)
        _vertDir.set(ox, oy, oz).normalize();

        // How much this vertex faces the cursor direction (in local space)
        const dot = _vertDir.dot(smoothDir.current);

        if (dot > 0 && strength > 0.001) {
          // Focused falloff: pow narrows the cone
          const influence = Math.pow(dot, BULGE_FOCUS);
          const displacement = strength * influence * scl;

          arr[i3] = ox + _vertDir.x * displacement;
          arr[i3 + 1] = oy + _vertDir.y * displacement;
          arr[i3 + 2] = oz + _vertDir.z * displacement;
        } else {
          arr[i3] = ox;
          arr[i3 + 1] = oy;
          arr[i3 + 2] = oz;
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
  const parentRef = useRef<THREE.Group>(null!);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <group ref={parentRef} position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <MorphPlanet parentGroupRef={parentRef} />
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
