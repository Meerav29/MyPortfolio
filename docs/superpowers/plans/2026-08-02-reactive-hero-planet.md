# Reactive Hero Planet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the hero planet drift/fade left as the user scrolls, and pool light at the cursor's position on the sphere with a slow decay, on branch `hero-reactive-planet`.

**Architecture:** Two independent hooks (`useReducedMotion`, `useScrollProgress`) feed a `scrollProgress` value into `PlanetCanvas`, which lerps `offsetX`/`scale`/`opacity` toward scroll-derived targets every frame. Separately, desktop-only pointer raycasting hits the planet mesh, stamping soft dots into a decaying offscreen heat-map render target (via drei's `useFBO`), which a custom `shaderMaterial` samples to additively brighten the existing cosmic texture. Both new behaviors are no-ops when `prefers-reduced-motion` is set; the glow is additionally skipped entirely on mobile viewports.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5.5, Three.js 0.179, @react-three/fiber 8.15, @react-three/drei 9.105 (`shaderMaterial`, `useFBO`), Tailwind CSS. No test suite — verification is `npm run build` + manual dev-server checks.

## Global Constraints

- No test suite exists — verify every task with `npm run build` (must pass with no new type/build errors) and manual dev-server inspection at `localhost:3000`. Do not add a testing framework.
- Server Components by default; new files that use hooks/browser APIs/R3F must start with `"use client"`.
- Path alias `@/` resolves to project root.
- Never break existing mobile optimizations in `PlanetCanvas.tsx`/`Hero.tsx` (reduced geometry, disabled-on-small-screens behavior).
- Auto-rotation (`rotation.y += dt * 0.1`) and the orbiting `Satellite` must keep running unmodified — do not pause or alter them.
- Glow effect (raycasting + heat-map + shader) is desktop-only; mobile gets scroll movement only.
- Both scroll-driven movement and cursor glow must no-op when `prefers-reduced-motion: reduce` is set.
- Only touch files relevant to this feature — no opportunistic refactors of unrelated code.
- Never commit without explicit request from the user at the end — for this plan, commit after each task's verification passes (per-task commits are the explicit request already given by "implement this plan").

---

## File Structure

- `lib/useReducedMotion.ts` — new hook, returns `boolean`, mirrors `matchMedia` listener pattern already used in `Hero.tsx`'s local `useMediaQuery`.
- `lib/useScrollProgress.ts` — new hook, returns `number` in `[0, 1]`, rAF-throttled scroll listener.
- `components/PlanetCanvas.tsx` — modified: accept `scrollProgress` and `glowEnabled` props; add lerp-toward-target logic in `Planet`/`Scene`; add heat-map FBO + pointer raycasting + custom shader material.
- `components/Hero.tsx` — modified: wire up the two new hooks, pass `scrollProgress` and `glowEnabled` (derived from `!isMobile && !reducedMotion`) into `PlanetCanvas`.

---

### Task 1: `useReducedMotion` hook

**Files:**
- Create: `lib/useReducedMotion.ts`

**Interfaces:**
- Produces: `useReducedMotion(): boolean` — `true` when the user has `prefers-reduced-motion: reduce` set, reactive to live changes.

- [ ] **Step 1: Write the hook**

```typescript
// lib/useReducedMotion.ts
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return reduced;
}
```

- [ ] **Step 2: Verify with build**

Run: `npm run build`
Expected: build succeeds, no type errors referencing `lib/useReducedMotion.ts`.

- [ ] **Step 3: Manual check**

Temporarily add `console.log(useReducedMotion())` in `app/page.tsx` (or check via a scratch component), run `npm run dev`, open devtools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → toggle "reduce". Confirm the logged value flips `true`/`false` live without a page reload. Remove the temporary log before committing.

- [ ] **Step 4: Commit**

```bash
git add lib/useReducedMotion.ts
git commit -m "Add useReducedMotion hook for hero scroll/glow gating"
```

---

### Task 2: `useScrollProgress` hook

**Files:**
- Create: `lib/useScrollProgress.ts`

**Interfaces:**
- Produces: `useScrollProgress(): number` — `clamp(window.scrollY / window.innerHeight, 0, 1)`, updated on scroll via `requestAnimationFrame` throttling.

- [ ] **Step 1: Write the hook**

```typescript
// lib/useScrollProgress.ts
"use client";

import { useEffect, useState } from "react";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const viewportHeight = window.innerHeight || 1;
      const raw = window.scrollY / viewportHeight;
      setProgress(Math.min(1, Math.max(0, raw)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}
```

- [ ] **Step 2: Verify with build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 3: Manual check**

Temporarily log `useScrollProgress()` from `app/page.tsx`, run `npm run dev`, scroll the page and confirm the value moves smoothly from `0` toward `1` over roughly one viewport height of scrolling, then stays clamped at `1` beyond that. Remove the temporary log.

- [ ] **Step 4: Commit**

```bash
git add lib/useScrollProgress.ts
git commit -m "Add useScrollProgress hook for hero scroll-driven animation"
```

---

### Task 3: Wire scroll progress into planet position/scale/opacity

**Files:**
- Modify: `components/PlanetCanvas.tsx`
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `useScrollProgress()` from Task 2 (`lib/useScrollProgress.ts`), `useReducedMotion()` from Task 1 (`lib/useReducedMotion.ts`).
- Produces: `PlanetCanvas` accepts new prop `scrollProgress?: number` (default `0`). `Scene`/`Planet`-holding `group` in `PlanetCanvas.tsx` lerps its rendered `position.x`, `scale`, and material opacity toward scroll-derived targets each frame.

- [ ] **Step 1: Extend `PlanetProps` and thread `scrollProgress` through to `Scene`**

In `components/PlanetCanvas.tsx`, update the shared type and prop plumbing:

```typescript
type PlanetProps = {
  offsetX?: number;
  scale?: number;
  radius?: number;
  darkColor?: string;
  scrollProgress?: number;
};
```

Update `Scene`, the `R3FCanvas` inline component, and the default-exported `PlanetCanvas` function signatures to accept and pass through `scrollProgress = 0`, exactly mirroring how `offsetX`/`scale`/`radius`/`darkColor` are already threaded (see existing lines defining `Scene({ offsetX = 0, scale = 1, radius = 0.9, darkColor = "#3D4A5C" })` and the `R3FCanvas` dynamic component).

- [ ] **Step 2: Add scroll-driven lerp group inside `Scene`**

Replace the static `<group position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>` in `Scene` with a ref-driven group that eases toward scroll-derived targets. Add this logic inside `Scene` (which is already a function component, so hooks are valid):

```typescript
function Scene({ offsetX = 0, scale = 1, radius = 0.9, darkColor = "#3D4A5C", scrollProgress = 0 }: PlanetProps) {
  const driftRef = useRef<THREE.Group>(null!);
  const opacityRef = useRef(1);

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
        if (mat) {
          mat.transparent = true;
          mat.opacity = opacityRef.current * (mat.userData.baseOpacity ?? 1);
        }
      }
    });
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <group ref={driftRef} position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <Planet radius={radius} darkColor={darkColor} />
        <Satellite />
      </group>
      <Stars radius={50} depth={30} count={1200} factor={2} fade />
    </>
  );
}
```

Note: store each mesh's original opacity in `mat.userData.baseOpacity` where materials are constructed in `Planet` (the outline mesh, textured body, and atmosphere mesh already have different base opacities — outline/body are `1`, atmosphere is `0.08`). Add `userData.baseOpacity = <existing opacity value>` to each of the three `meshBasicMaterial`/`meshStandardMaterial` JSX elements in `Planet` so the traverse step in `Scene` scales relative to each mesh's own baseline rather than flattening the atmosphere to full opacity. Concretely, add a `userData={{ baseOpacity: 1 }}` (or `0.08` for the atmosphere mesh) prop to each of the three `<meshBasicMaterial>`/`<meshStandardMaterial>` elements inside `Planet`.

- [ ] **Step 3: Pass `scrollProgress` from `Hero.tsx`**

In `components/Hero.tsx`, import and call the new hooks, and pass `scrollProgress` down. Use `0` when reduced motion is active:

```typescript
import { useScrollProgress } from "../lib/useScrollProgress";
import { useReducedMotion } from "../lib/useReducedMotion";

// inside Hero component, alongside the existing isMobile line:
const scrollProgress = useScrollProgress();
const reducedMotion = useReducedMotion();
const effectiveScrollProgress = reducedMotion ? 0 : scrollProgress;

// ...
<PlanetCanvas
  offsetX={isMobile ? 0.5 : 2}
  scale={isMobile ? 0.8 : 1}
  scrollProgress={effectiveScrollProgress}
/>
```

- [ ] **Step 4: Verify with build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 5: Manual check**

Run `npm run dev`, open `localhost:3000`, scroll down slowly over the hero. Confirm: planet eases smoothly (not jumpy) from right toward left, shrinks slightly, and fades out by roughly the time you've scrolled one viewport height. Scroll back up and confirm it eases back in. Then enable "prefers-reduced-motion: reduce" in devtools and confirm the planet stays fixed at its default position/scale/opacity regardless of scroll.

- [ ] **Step 6: Commit**

```bash
git add components/PlanetCanvas.tsx components/Hero.tsx
git commit -m "Drive hero planet position/scale/opacity from scroll progress"
```

---

### Task 4: Heat-map accumulation render target

**Files:**
- Modify: `components/PlanetCanvas.tsx`

**Interfaces:**
- Produces: a `useHeatmap()` internal hook/helper (colocated in `PlanetCanvas.tsx`, not exported) that returns `{ texture: THREE.Texture, stamp: (uv: THREE.Vector2 | null) => void }`. `texture` is sampled by the shader material built in Task 5. `stamp` is called from the pointer-raycast handler built in Task 6 with the current hit UV, or `null` when the cursor isn't over the planet.

- [ ] **Step 1: Add the heat-map FBO setup and per-frame decay/stamp pass**

Add this above the `Planet` function in `components/PlanetCanvas.tsx`. It uses drei's `useFBO` for the render target and a minimal orthographic scene to stamp/decay into it every frame:

```typescript
import { useFBO } from "@react-three/drei";

const HEATMAP_SIZE = 256;

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
    };
  }, [scene, quad]);

  useFrame(() => {
    if (!enabled) return;
    const { read, write } = swapRef.current;

    material.uniforms.uPrev.value = read.texture;
    material.uniforms.uStamp.value = stampUv.current ?? new THREE.Vector2(-1, -1);

    gl.setRenderTarget(write);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    swapRef.current = { read: write, write: read };
  });

  const stamp = (uv: THREE.Vector2 | null) => {
    stampUv.current = uv;
  };

  return { texture: swapRef.current.read.texture, stamp, getTexture: () => swapRef.current.read.texture };
}
```

Add `useThree` and `useEffect` to the existing `@react-three/fiber`/`react` imports at the top of the file (the file already imports `useFrame` from `@react-three/fiber` and `useMemo, useRef` from `react` — extend those import lines rather than adding new ones).

- [ ] **Step 2: Verify with build**

Run: `npm run build`
Expected: build succeeds. `useHeatmap` is unused at this point (no caller yet) — if the linter/TS complains about an unused symbol, that's expected and will resolve once Task 5/6 consume it; do not suppress with eslint-disable, just proceed (this task's deliverable is the helper existing and compiling, not being wired up yet).

- [ ] **Step 3: Commit**

```bash
git add components/PlanetCanvas.tsx
git commit -m "Add heat-map accumulation render target for cursor glow"
```

---

### Task 5: Custom glow shader material on the planet body

**Files:**
- Modify: `components/PlanetCanvas.tsx`

**Interfaces:**
- Consumes: `texture: THREE.Texture` heat-map output from `useHeatmap()` (Task 4).
- Produces: a drei `shaderMaterial`-based `<glowMaterial>` JSX element replacing the planet body's `<meshStandardMaterial map={texture} .../>`, accepting `map` (base cosmic texture) and `heatmap` (glow texture) uniforms.

- [ ] **Step 1: Define the shader material**

Add near the top of `components/PlanetCanvas.tsx`, after the imports:

```typescript
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const GlowMaterial = shaderMaterial(
  { map: null, heatmap: null, glowColor: new THREE.Color("#ffffff"), glowStrength: 0.9 },
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
    varying vec2 vUv;
    void main() {
      vec3 base = texture2D(map, vUv).rgb;
      float heat = texture2D(heatmap, vUv).r;
      vec3 result = base + glowColor * heat * glowStrength;
      gl_FragColor = vec4(clamp(result, 0.0, 1.0), 1.0);
    }
  `
);

extend({ GlowMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    glowMaterial: Object3DNode<InstanceType<typeof GlowMaterial>, typeof GlowMaterial>;
  }
}
```

Add `Object3DNode` to the `@react-three/fiber` import at the top of the file.

- [ ] **Step 2: Swap the planet body's material**

In `Planet`, change the "textured body" mesh from:

```tsx
<mesh castShadow receiveShadow>
  <sphereGeometry args={[radius, 64, 64]} />
  <meshStandardMaterial map={texture} roughness={1} metalness={0} />
</mesh>
```

to accept a `heatmapTexture` prop and use the new material:

```tsx
<mesh castShadow receiveShadow>
  <sphereGeometry args={[radius, 64, 64]} />
  <glowMaterial map={texture} heatmap={heatmapTexture} glowColor={"#ffffff"} glowStrength={0.9} />
</mesh>
```

Update `Planet`'s props to accept `heatmapTexture: THREE.Texture | null`:

```typescript
function Planet({
  radius = 0.9,
  darkColor = "#3D4A5C",
  heatmapTexture = null,
}: {
  radius?: number;
  darkColor?: string;
  heatmapTexture?: THREE.Texture | null;
}) {
```

When `heatmapTexture` is `null` (mobile/reduced-motion, before Task 6 wires it up), pass a 1x1 black `THREE.DataTexture` as a safe default so the shader doesn't sample an unset uniform. Add this helper above `Planet`:

```typescript
function useBlackTexture() {
  return useMemo(() => {
    const data = new Uint8Array([0, 0, 0, 255]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);
}
```

And in `Planet`, fall back to it: `const blackTex = useBlackTexture(); const heatmap = heatmapTexture ?? blackTex;` then pass `heatmap={heatmap}` to `<glowMaterial>`.

- [ ] **Step 3: Thread `heatmapTexture` from `Scene` down to `Planet`**

`Scene` doesn't yet have a heat-map texture to pass (that's wired up in Task 6) — for this task, have `Scene` accept an optional `heatmapTexture?: THREE.Texture | null` prop (default `null`) and forward it to `<Planet radius={radius} darkColor={darkColor} heatmapTexture={heatmapTexture} />`.

- [ ] **Step 4: Verify with build**

Run: `npm run build`
Expected: build succeeds, no type errors on the new `glowMaterial` JSX intrinsic or shader material.

- [ ] **Step 5: Manual check**

Run `npm run dev`, open `localhost:3000`. Confirm the planet still renders identically to before (base texture visible, no visual glow yet since no heat is being stamped) — this task only wires the material, not the cursor input. No console errors about missing uniforms or unrecognized JSX elements.

- [ ] **Step 6: Commit**

```bash
git add components/PlanetCanvas.tsx
git commit -m "Add glow shader material sampling heat-map texture on planet body"
```

---

### Task 6: Pointer raycasting + full wiring + mobile/reduced-motion gating

**Files:**
- Modify: `components/PlanetCanvas.tsx`
- Modify: `components/Hero.tsx`

**Interfaces:**
- Consumes: `useHeatmap` (Task 4), `glowMaterial`/`Planet` heatmap prop (Task 5), `useReducedMotion` (Task 1).
- Produces: `PlanetCanvas` accepts new prop `glowEnabled?: boolean` (default `false`). When `true`, pointer movement over the `Canvas` raycasts against the planet sphere and feeds hit UVs into the heat-map stamp; when `false`, no raycasting occurs and the planet renders with the black fallback texture (no glow, no extra per-frame cost from the heat-map pass).

- [ ] **Step 1: Add raycasting inside `Scene` and connect to `useHeatmap`**

Modify `Scene` to accept `glowEnabled?: boolean` (default `false`) and, when enabled, run the heat-map hook and forward its texture to `Planet`. Raycasting is done via R3F's built-in pointer events on the mesh rather than manual `Raycaster` setup — add an `onPointerMove`/`onPointerOut` handler directly on the planet body mesh inside `Planet`, and lift the stamp call up via a callback prop:

```typescript
function Scene({
  offsetX = 0,
  scale = 1,
  radius = 0.9,
  darkColor = "#3D4A5C",
  scrollProgress = 0,
  glowEnabled = false,
}: PlanetProps) {
  const heatmap = useHeatmap(glowEnabled);
  // ...existing driftRef/useFrame logic from Task 3 unchanged...

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
      <group ref={driftRef} position={[offsetX, 0, 0]} scale={[scale, scale, scale]}>
        <Planet
          radius={radius}
          darkColor={darkColor}
          heatmapTexture={glowEnabled ? heatmap.getTexture() : null}
          onSurfacePointerMove={glowEnabled ? (uv) => heatmap.stamp(uv) : undefined}
          onSurfacePointerOut={glowEnabled ? () => heatmap.stamp(null) : undefined}
        />
        <Satellite />
      </group>
      <Stars radius={50} depth={30} count={1200} factor={2} fade />
    </>
  );
}
```

Note: `heatmap.getTexture()` returns the current-frame read texture; since `useFrame` order in R3F runs in registration order and `useHeatmap`'s internal `useFrame` is registered before `Planet` reads it each render, the texture reference updates correctly frame-to-frame (the `swapRef` swap happens inside `useHeatmap`'s own `useFrame`, and `Scene`'s render call re-reads `heatmap.getTexture()` each React render — since the texture object identity changes on swap, pass it via a ref-read pattern instead: change `getTexture` to return `swapRef.current.read.texture` freshly each call, which it already does since `swapRef.current` is read live, not captured at mount).

Update `Planet` to accept and wire the new pointer callbacks onto its textured-body mesh:

```typescript
function Planet({
  radius = 0.9,
  darkColor = "#3D4A5C",
  heatmapTexture = null,
  onSurfacePointerMove,
  onSurfacePointerOut,
}: {
  radius?: number;
  darkColor?: string;
  heatmapTexture?: THREE.Texture | null;
  onSurfacePointerMove?: (uv: THREE.Vector2) => void;
  onSurfacePointerOut?: () => void;
}) {
  // ...existing body...

  return (
    <group ref={planetRef}>
      {/* thin outline mesh unchanged */}

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
        <sphereGeometry args={[radius, 64, 64]} />
        <glowMaterial map={texture} heatmap={heatmap} glowColor={"#ffffff"} glowStrength={0.9} />
      </mesh>

      {/* atmosphere mesh unchanged */}
    </group>
  );
}
```

- [ ] **Step 2: Enable pointer events on the R3F Canvas**

Confirm (no change needed if already true from the existing `pointer-events-auto` className on `R3FCanvas` in the outer `PlanetCanvas` component) that the canvas accepts pointer events. R3F's `onPointerMove` on a mesh requires the `Canvas` to receive raw pointer events, which it does by default — no additional `raycaster` config needed since we're using mesh-level R3F event props, not a manual `Raycaster`.

- [ ] **Step 3: Thread `glowEnabled` from `PlanetCanvas` props down to `Scene`**

Update the `PlanetProps` type (from Task 3) to add `glowEnabled?: boolean`, and thread it through `R3FCanvas` and the exported `PlanetCanvas` function exactly like `scrollProgress` was threaded in Task 3, ending with:

```typescript
<Scene offsetX={offsetX} scale={scale} radius={radius} darkColor={darkColor} scrollProgress={scrollProgress} glowEnabled={glowEnabled} />
```

- [ ] **Step 4: Wire `glowEnabled` from `Hero.tsx`**

In `components/Hero.tsx`, compute and pass the flag:

```typescript
const glowEnabled = !isMobile && !reducedMotion;

// ...
<PlanetCanvas
  offsetX={isMobile ? 0.5 : 2}
  scale={isMobile ? 0.8 : 1}
  scrollProgress={effectiveScrollProgress}
  glowEnabled={glowEnabled}
/>
```

- [ ] **Step 5: Verify with build**

Run: `npm run build`
Expected: build succeeds, no type errors.

- [ ] **Step 6: Manual check — desktop glow**

Run `npm run dev` on a desktop-width viewport. Move the cursor over the planet: confirm a soft bright patch appears under the cursor and grows brighter the longer the cursor lingers/moves within the planet. Move the cursor off the planet (but still on screen) and confirm the bright patch fades out over roughly 1-2 seconds rather than vanishing instantly. Confirm no glow appears when the cursor is outside the planet's bounds even while over the canvas.

- [ ] **Step 7: Manual check — mobile gating**

Resize devtools to a mobile viewport (< 768px width) or use device emulation. Confirm the planet still shows scroll-driven drift (from Task 3) but never shows any cursor glow (there's no cursor on touch, and `glowEnabled` is `false`), and check the console for no errors related to raycasting or the heat-map pass being skipped.

- [ ] **Step 8: Manual check — reduced motion gating**

Enable "prefers-reduced-motion: reduce" in devtools on a desktop viewport. Confirm cursor movement over the planet produces no glow (since `glowEnabled` is `false` when `reducedMotion` is `true`), and scroll position no longer moves the planet (from Task 3's gating).

- [ ] **Step 9: Full regression check**

With no reduced-motion emulation and desktop viewport: confirm auto-rotation is still spinning the planet, the orbiting satellite with its trail is still visible and moving, and dark/light theme toggling still recolors the planet correctly (toggle via the site's theme control). This confirms none of the new scroll/glow logic broke existing behavior.

- [ ] **Step 10: Commit**

```bash
git add components/PlanetCanvas.tsx components/Hero.tsx
git commit -m "Wire cursor raycasting to heat-map glow with mobile/reduced-motion gating"
```

---

## Self-Review Notes

- **Spec coverage:** Scroll drift/fade/scale → Task 3. Cursor light pooling with trailing decay via accumulation texture → Tasks 4–6. Desktop-only glow gating → Task 6. Reduced-motion gating for both effects → Tasks 3 and 6. Auto-rotation/satellite untouched → explicitly verified in Task 6 Step 9 and never modified in any task. `app/planet-compare/` untouched → no task references it.
- **Type consistency:** `PlanetProps` gains `scrollProgress` (Task 3) and `glowEnabled` (Task 6) incrementally, threaded consistently through `Scene`, `R3FCanvas`, and the exported `PlanetCanvas` the same way existing props (`offsetX`, `scale`, `radius`, `darkColor`) already are. `Planet`'s new props (`heatmapTexture`, `onSurfacePointerMove`, `onSurfacePointerOut`) are defined in Task 5/6 and used consistently. `useHeatmap(enabled: boolean)` return shape `{ texture, stamp, getTexture }` defined once in Task 4 and consumed as-is in Task 6.
- **No placeholders:** all steps contain complete, concrete code — no TBDs.
