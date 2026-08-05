"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function SphereCanvas({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";
    // Start with satellite at front of orbit (sin≈1, fully visible) so it appears immediately
    let t = (Math.PI / 2) / 0.55;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── Main sphere ──────────────────────────────────────
      // Compact mode: centered sphere, radius fit to the smaller dimension so
      // the sphere + satellite orbit (which extends to R*1.38 either side)
      // stays inside a roughly square box instead of a wide letterboxed one.
      const R  = compact ? Math.min(W, H) * 0.34 : H * 0.58;
      const cx = compact ? W * 0.5 : W - R * 0.22;
      const cy = H * 0.50;

      // 1. Body gradient
      const body = ctx.createRadialGradient(
        cx - R * 0.32, cy - R * 0.28, R * 0.02,
        cx + R * 0.12, cy + R * 0.18, R
      );
      if (isDark) {
        body.addColorStop(0,    "rgba(115,115,135,1)");
        body.addColorStop(0.35, "rgba(55,55,68,1)");
        body.addColorStop(0.75, "rgba(18,18,24,1)");
        body.addColorStop(1,    "rgba(6,6,9,1)");
      } else {
        body.addColorStop(0,    "rgba(245,245,250,1)");
        body.addColorStop(0.35, "rgba(195,195,208,1)");
        body.addColorStop(0.75, "rgba(140,140,155,1)");
        body.addColorStop(1,    "rgba(90,90,105,1)");
      }
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // Clip for layers 2–4
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // 2. Rotating surface band
      const bx = cx + R * 0.55 * Math.cos(t * 0.4);
      const by = cy + R * 0.25 * Math.sin(t * 0.28);
      const band = ctx.createRadialGradient(bx, by, 0, bx, by, R * 0.95);
      band.addColorStop(0, isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.15)");
      band.addColorStop(1, isDark ? "rgba(0,0,0,0.22)"      : "rgba(0,0,0,0.08)");
      ctx.fillStyle = band;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 3. Specular highlight
      const spec = ctx.createRadialGradient(
        cx - R * 0.36, cy - R * 0.36, 0,
        cx - R * 0.14, cy - R * 0.14, R * 0.5
      );
      spec.addColorStop(0,   isDark ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.85)");
      spec.addColorStop(0.5, isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.20)");
      spec.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.fillStyle = spec;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 4. Shadow
      const shadow = ctx.createRadialGradient(
        cx + R * 0.38, cy + R * 0.38, 0,
        cx + R * 0.15, cy + R * 0.15, R * 0.9
      );
      shadow.addColorStop(0, isDark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.20)");
      shadow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shadow;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      ctx.restore();

      // Atmosphere rim
      const rim = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.10);
      rim.addColorStop(0,    "rgba(160,170,220,0)");
      rim.addColorStop(0.75, isDark ? "rgba(160,170,220,0.05)" : "rgba(160,170,220,0.08)");
      rim.addColorStop(1,    isDark ? "rgba(160,170,220,0.12)" : "rgba(160,170,220,0.18)");
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.10, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();

      // ── Satellite orbit ───────────────────────────────────
      const orbitRx    = R * 1.38;
      const orbitRy    = R * 0.40;
      const orbitTilt  = -0.48;
      const orbitAngle = t * 0.55;

      const rawX = orbitRx * Math.cos(orbitAngle);
      const rawY = orbitRy * Math.sin(orbitAngle);
      const satX = cx + rawX * Math.cos(orbitTilt) - rawY * Math.sin(orbitTilt);
      const satY = cy + rawX * Math.sin(orbitTilt) + rawY * Math.cos(orbitTilt);
      // sin: -1 = fully behind, +1 = fully in front → map to [0.15, 1.0]
      const sinVal   = Math.sin(orbitAngle);
      const satAlpha = 0.15 + 0.85 * ((sinVal + 1) / 2);
      const isBehind = sinVal < 0;

      // Orbit ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(orbitTilt);
      ctx.scale(1, orbitRy / orbitRx);
      ctx.setLineDash([3, 9]);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
      ctx.lineWidth = 0.9 * (orbitRx / orbitRy);
      ctx.beginPath();
      ctx.arc(0, 0, orbitRx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Satellite — flat, cool grey, continuous alpha
      const sr = R * 0.072;
      const satFill = isDark
        ? `rgba(175,178,188,${satAlpha})`
        : `rgba(108,110,118,${satAlpha})`;

      ctx.beginPath();
      ctx.arc(satX, satY, sr, 0, Math.PI * 2);
      ctx.fillStyle = satFill;
      ctx.fill();

      // Redraw main sphere on top when satellite is behind for occlusion
      if (isBehind) {
        const bodyAgain = ctx.createRadialGradient(
          cx - R * 0.32, cy - R * 0.28, R * 0.02,
          cx + R * 0.12, cy + R * 0.18, R
        );
        if (isDark) {
          bodyAgain.addColorStop(0,    "rgba(115,115,135,1)");
          bodyAgain.addColorStop(0.35, "rgba(55,55,68,1)");
          bodyAgain.addColorStop(0.75, "rgba(18,18,24,1)");
          bodyAgain.addColorStop(1,    "rgba(6,6,9,1)");
        } else {
          bodyAgain.addColorStop(0,    "rgba(245,245,250,1)");
          bodyAgain.addColorStop(0.35, "rgba(195,195,208,1)");
          bodyAgain.addColorStop(0.75, "rgba(140,140,155,1)");
          bodyAgain.addColorStop(1,    "rgba(90,90,105,1)");
        }
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = bodyAgain;
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = spec;
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        ctx.fillStyle = shadow;
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
        ctx.restore();
      }
    }

    function tick() {
      t += 0.005;
      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(canvas);
    resize();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  );
}
