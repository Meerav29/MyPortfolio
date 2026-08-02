"use client";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, extend, Object3DNode } from "@react-three/fiber";
import { Stars, Trail, useFBO, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors, lighten, darken } from "../lib/theme";
import { useTheme } from "./ThemeProvider";

const GlowMaterial = shaderMaterial(
  { map: null, heatmap: null, glowColor: new THREE.Color("#ffffff"), glowStrength: 0.9, opacity: 1.0 },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform sampler2D map;
    uniform sampler2D heatmap;
    uniform vec3 glowColor;
    uniform float glowStrength;
    uniform float opacity;
    varying vec2 vUv;
    void main() {
      vec3 base = texture2D(map, vUv).rgb;
      float heat = texture2D(heatmap, vUv).r;
      vec3 result = base + glowColor * heat * glowStrength;
      gl_FragColor = vec4(clamp(result, 0.0, 1.0), opacity);
    }
  `
);

extend({ GlowMaterial });

type GlowMaterialUniforms = {
  map?: THREE.Texture | null;
  heatmap?: THREE.Texture | null;
  glowColor?: THREE.Color | string;
  glowStrength?: number;
};

declare module "@react-three/fiber" {
  interface ThreeElements {
    glowMaterial: Object3DNode<InstanceType<typeof GlowMaterial>, typeof GlowMaterial> &
      GlowMaterialUniforms;
  }
}

// Generate a starry canvas texture using the provided base color.
function useCosmicTexture(base: string, size = 1024) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    const g = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.15,
      size / 2,
      size / 2,
      size / 2
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

const HEATMAP_SIZE = 256;
const OFF_SCREEN_UV = new THREE.Vector2(-1, -1);

// Offscreen heat-map render target: accumulates a decaying glow at a stamped
// UV position every frame. Consumers call `getTexture()` each frame to read
// the latest render target (never hold a stale reference to it) and call
// `stamp` from a pointer-raycast handler to set the glow position.
function useHeatmap(enabled: boolean) {
  const { gl } = useThree();
  const fboA = useFBO(HEATMAP_SIZE, HEATMAP_SIZE);
  const fboB = useFBO(HEATMAP_SIZE, HEATMAP_SIZE);
  const swapRef = useRef({ read: fboA, write: fboB });

  const stampUv = useRef<THREE.Vector2 | null>(null);

  const scene = useMemo(() => new THREE.Scene(), []);
  const camera = useMemo(() => new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uPrev: { value: null },
          uStamp: { value: new THREE.Vector2(-1, -1) },
          uDecay: { value: 0.95 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy * 2.0 - 1.0, 0.0, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uPrev;
          uniform vec2 uStamp;
          uniform float uDecay;
          varying vec2 vUv;
          void main() {
            vec3 prev = texture2D(uPrev, vUv).rgb * uDecay;
            float glow = 0.0;
            if (uStamp.x >= 0.0) {
              float d = distance(vUv, uStamp);
              glow = smoothstep(0.12, 0.0, d);
            }
            vec3 result = clamp(prev + glow, 0.0, 1.0);
            gl_FragColor = vec4(result, 1.0);
          }
        `,
      }),
    []
  );
  const quad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(1, 1).translate(0.5, 0.5, 0), material), [material]);

  useEffect(() => {
    scene.add(quad);
    return () => {
      scene.remove(quad);
      material.dispose();
      quad.geometry.dispose();
    };
  }, [scene, quad, material]);

  useFrame(() => {
    if (!enabled) return;
    const { read, write } = swapRef.current;

    material.uniforms.uPrev.value = read.texture;
    material.uniforms.uStamp.value = stampUv.current ?? OFF_SCREEN_UV;

    gl.setRenderTarget(write);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    swapRef.current = { read: write, write: read };
  });

  const stamp = (uv: THREE.Vector2 | null) => {
    stampUv.current = uv;
  };

  return { stamp, getTexture: () => swapRef.current.read.texture };
}

function useBlackTexture() {
  return useMemo(() => {
    const data = new Uint8Array([0, 0, 0, 255]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// --- Planet: cosmic sphere with subtle glow
function Planet({
  radius = 0.9,
  darkColor = "#3D4A5C",
  getHeatmapTexture,
  onSurfacePointerMove,
  onSurfacePointerOut,
}: {
  radius?: number;
  darkColor?: string;
  getHeatmapTexture?: () => THREE.Texture | null;
  onSurfacePointerMove?: (uv: THREE.Vector2) => void;
  onSurfacePointerOut?: () => void;
}) {
  const { background } = useThemeColors();
  const { theme } = useTheme();
  const base = theme === "dark" ? "#8EC5FC" : "#000000";
  const texture = useCosmicTexture(base);
  const blackTex = useBlackTexture();
  const planetRef = useRef<THREE.Group>(null!);
  const glowMatRef = useRef<InstanceType<typeof GlowMaterial> & GlowMaterialUniforms>(null!);

  useFrame((_, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.1;

    // Read the heat-map texture fresh every frame (never hold a stale
    // React-render-time reference — see useHeatmap's swapRef gotcha) and
    // assign it directly to the material's uniform via the material ref,
    // bypassing React prop diffing/JSX entirely so it can never lag behind
    // Scene's (infrequent) React re-render cadence.
    if (glowMatRef.current) {
      const live = getHeatmapTexture ? getHeatmapTexture() : null;
      glowMatRef.current.heatmap = live ?? blackTex;
    }
  });

  return (
    <group ref={planetRef}>
      {/* thin outline */}
      <mesh scale={1.03} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          color={theme === "dark" ? "#000000" : darken(background, 0.6)}
          side={THREE.BackSide}
          userData={{ baseOpacity: 1 }}
        />
      </mesh>

      {/* textured body */}
      <mesh
        castShadow
        receiveShadow
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.uv && onSurfacePointerMove) onSurfacePointerMove(e.uv);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onSurfacePointerOut?.();
        }}
      >
        <sphereGeometry args={[1.2, 64, 64]} />
        <glowMaterial
          ref={glowMatRef}
          map={texture}
          heatmap={blackTex}
          glowColor={"#ffffff"}
          glowStrength={0.9}
          userData={{ baseOpacity: 1 }}
        />
      </mesh>

      {/* soft atmosphere */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial
          color={lighten(base, 0.1)}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          userData={{ baseOpacity: 0.08 }}
        />
      </mesh>
    </group>
  );
}

// --- Tiny satellite orbiting
function Satellite() {
  const base = "#000000";
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }
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

type PlanetProps = {
  offsetX?: number;
  scale?: number;
  radius?: number;
  darkColor?: string;
  scrollProgress?: number;
  glowEnabled?: boolean;
};

function Scene({
  offsetX = 0,
  scale = 1,
  radius = 0.9,
  darkColor = "#3D4A5C",
  scrollProgress = 0,
  glowEnabled = false,
}: PlanetProps) {
  const driftRef = useRef<THREE.Group>(null!);
  const opacityRef = useRef(1);
  const heatmap = useHeatmap(glowEnabled);

  useFrame((_, dt) => {
    if (!driftRef.current) return;
    const lerpSpeed = 1 - Math.pow(0.001, dt); // frame-rate independent ease

    const targetX = offsetX - scrollProgress * 3; // drift further left
    const targetScale = scale * (1 - scrollProgress * 0.35); // ease down to 65%
    opacityRef.current += (Math.max(0, 1 - scrollProgress * 1.4) - opacityRef.current) * lerpSpeed;

    driftRef.current.position.x += (targetX - driftRef.current.position.x) * lerpSpeed;
    const s = driftRef.current.scale.x + (targetScale - driftRef.current.scale.x) * lerpSpeed;
    driftRef.current.scale.set(s, s, s);

    driftRef.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material as THREE.Material & { opacity?: number; transparent?: boolean };
        // Only meshes deliberately opted into the fade (Planet's three meshes, via
        // userData.baseOpacity set at creation) are touched here. This excludes
        // Satellite's meshes, which must remain fully opaque and unaffected by scroll.
        if (mat && mat.userData.baseOpacity !== undefined) {
          mat.transparent = true;
          mat.opacity = opacityRef.current * mat.userData.baseOpacity;
        }
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <group ref={driftRef} position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <Planet
          radius={radius}
          darkColor={darkColor}
          getHeatmapTexture={glowEnabled ? heatmap.getTexture : undefined}
          onSurfacePointerMove={glowEnabled ? (uv) => heatmap.stamp(uv) : undefined}
          onSurfacePointerOut={glowEnabled ? () => heatmap.stamp(null) : undefined}
        />
        <Satellite />
      </group>
      <Stars radius={50} depth={30} count={1200} factor={2} fade />
      {/** Fixed camera; no manual or auto rotation */}
    </>
  );
}

// dynamic to avoid SSR issues
const R3FCanvas = dynamic(
  () =>
    Promise.resolve(
      ({ className, offsetX = 0, scale = 1, radius = 0.9, darkColor = "#3D4A5C", scrollProgress = 0, glowEnabled = false }: { className?: string } & PlanetProps) => (
      <Canvas
        className={className}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene offsetX={offsetX} scale={scale} radius={radius} darkColor={darkColor} scrollProgress={scrollProgress} glowEnabled={glowEnabled} />
        </Suspense>
      </Canvas>
      )
    ),
  { ssr: false }
);

export default function PlanetCanvas({ offsetX = 0, scale = 1, radius = 0.9, darkColor = "#3D4A5C", scrollProgress = 0, glowEnabled = false }: PlanetProps) {
  return (
    <div className="relative w-full h-full" data-glow-enabled={glowEnabled} aria-hidden="true">
      {/* prefers-reduced-motion: pause auto-rotate */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          canvas { animation: none !important; }
        }
      `}</style>
      {/*
        globals.css applies `canvas { pointer-events: none }` site-wide as a
        decorative-layer safeguard. R3F's <Canvas> forwards className/style
        props to its own outer wrapper div, not to the underlying <canvas>
        DOM node itself, so a pointer-events-auto utility class or inline
        style on <Canvas> cannot win against that global rule (which targets
        the canvas element directly). This scoped selector re-enables pointer
        events on the canvas within any glow-enabled wrapper (i.e. any
        element carrying data-glow-enabled="true"), and only when glow is
        active -- canvases rendered with glowEnabled=false (mobile /
        reduced-motion) keep the original non-interactive behavior.
      */}
      <style>{`
        [data-glow-enabled=true] canvas { pointer-events: auto; }
      `}</style>
      <R3FCanvas
        className="absolute inset-0 pointer-events-auto"
        offsetX={offsetX}
        scale={scale}
        radius={radius}
        darkColor={darkColor}
        scrollProgress={scrollProgress}
        glowEnabled={glowEnabled}
      />
      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
    </div>
  );
}
