# Reactive Hero Planet — Design

**Branch:** `hero-reactive-planet` (off `main`)
**Status:** Approved, pending implementation plan

## Summary

Rework the home page hero's planet/satellite scene so it reacts to two forms of user input:

1. **Scroll** — as the user scrolls down past the hero, the planet drifts from its current right-side position toward the left, easing out in opacity and scale as it goes.
2. **Cursor** — while the cursor hovers over the planet's surface, light "collects" at that point on the sphere and slowly fades after the cursor moves away, like heat pooling and dissipating.

Both are purely additive to the existing scene (auto-rotation, orbiting satellite with trail, theme-aware coloring) — nothing about the current rendering is removed, only extended.

## Non-goals

- No change to the satellite's orbit/trail behavior.
- No change to auto-rotation speed or direction.
- Not reworking `app/planet-compare/` (that tool lives on `hero-update`, untouched by this branch).
- Not fixing the pre-existing gap where `prefers-reduced-motion` CSS only disables a no-op `animation` property (unrelated to this feature, out of scope).

## 1. Scroll-driven movement

**Trigger:** overall page scroll position, not a pinned/scroll-jacked hero. Progress is computed as `clamp(scrollY / viewportHeight, 0, 1)` — i.e., the drift completes over one viewport height of scrolling.

**Mechanics:**
- A `useScrollProgress()` hook in `Hero.tsx` listens to `scroll` (rAF-throttled) and returns a `0–1` value.
- Passed to `PlanetCanvas` as a `scrollProgress` prop.
- Inside the R3F `Scene`, the target `offsetX`, `scale`, and `opacity` are computed from `scrollProgress` (right → further left; full → reduced scale; full → faded opacity), and the actual rendered values ease toward those targets in `useFrame` (simple lerp) rather than snapping directly to scroll position, so motion reads as smooth rather than scroll-ticked.
- Applies on both desktop and mobile — this is a cheap position/opacity tween, not gated by device.

**Reduced motion:** if `prefers-reduced-motion` is set, `scrollProgress` is forced to `0` — planet stays at its default position/opacity/scale regardless of scroll. Existing auto-rotation and satellite motion are unaffected (status quo today).

## 2. Cursor-driven light pooling

**Scope:** desktop only (gated on the existing `useMediaQuery("(max-width: 767px)")` check already in `Hero.tsx`). Mobile/touch gets scroll movement only — no glow, no extra render pass, consistent with CLAUDE.md's mobile-performance guidance for this component.

**Mechanics:**
- `onPointerMove` on the `Canvas` raycasts against the planet mesh. On a hit, we read the UV coordinate of the intersection point.
- A small offscreen `WebGLRenderTarget` (256×256) holds a heat-map texture in the planet's UV space, updated every frame via a fullscreen-quad pass:
  - If the cursor currently hits the planet, stamp a soft radial dot at the hit UV onto the target.
  - Multiply the whole target by a decay factor (~0.95/frame) so previously-stamped light fades out over roughly 1–2 seconds.
- The planet's body material becomes a custom shader (via drei's `shaderMaterial`) that samples the existing cosmic canvas texture as the base color and adds an additive brightness boost sampled from the heat-map texture at the fragment's UV.
- No raycast hit (cursor off-planet or off-canvas) simply stops new stamps from being added; existing heat in the map continues to decay naturally — this is what gives the "collects, then dissipates" feel rather than an instant on/off.
- Rotation and the heat-map both operate in UV space independently: as the planet auto-rotates, previously-lit UV regions will appear to drift with the surface. This is an accepted, intentional side effect (planet keeps rotating as it does today; nothing pauses to "hold" the glow in world space).

**Reduced motion:** if `prefers-reduced-motion` is set, pointer-move tracking for the glow is skipped entirely (no raycasting, no heat-map updates) — planet renders with its current static material behavior.

## Component / file changes

- `components/PlanetCanvas.tsx`
  - Add `scrollProgress` prop, consumed inside `Scene`/`Planet` to drive position/scale/opacity via lerp in `useFrame`.
  - Add pointer-move raycasting (desktop only) feeding a new heat-map render target.
  - Replace the planet body's `meshStandardMaterial` with a custom shader material that adds the heat-map glow on top of the existing cosmic texture.
  - Reduced-motion checks gate both new behaviors as described above.
- `components/Hero.tsx`
  - Add `useScrollProgress()` hook usage, pass `scrollProgress` down to `PlanetCanvas`.
  - Reuse existing `useMediaQuery` for the desktop-only glow gate (passed down or re-derived inside `PlanetCanvas`).
- New hook file (exact location decided at planning time, likely colocated under `lib/` per existing convention, e.g. `lib/useScrollProgress.ts` and `lib/useReducedMotion.ts`), following the pattern of existing hooks like `useThemeColors` in `lib/theme.ts`.

## Testing / verification

No test suite exists for this project. Verification is manual:
- `npm run build` to confirm no type/build errors from the new shader/render-target code.
- Dev server manual check: scroll behavior (position/fade eases smoothly, no jank), cursor glow (light pools under cursor, fades out after ~1-2s of no movement, doesn't apply when cursor is off the planet), mobile viewport (scroll movement works, no glow, no console errors from skipped raycasting), and `prefers-reduced-motion` emulation in devtools (planet static, no glow).
