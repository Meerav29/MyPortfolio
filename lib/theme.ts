import { useEffect, useState } from "react";
import * as THREE from "three";

export interface ThemeColors {
  accent: string;
  background: string;
}

// Read current CSS variables so Three.js materials or CSS can follow theme.
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>({
    accent: "#0969DA",
    background: "#F6F8FA",
  });

  const updateColors = () => {
    const styles = getComputedStyle(document.documentElement);
    setColors({
      accent: styles.getPropertyValue("--accent").trim(),
      background: styles.getPropertyValue("--background").trim(),
    });
  };

  useEffect(() => {
    updateColors();
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", updateColors);
    return () => {
      observer.disconnect();
      mql.removeEventListener("change", updateColors);
    };
  }, []);

  return colors;
}

export function lighten(color: string, amount: number) {
  const c = new THREE.Color(color);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.min(1, hsl.l + amount));
  return `#${c.getHexString()}`;
}

export function darken(color: string, amount: number) {
  const c = new THREE.Color(color);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, hsl.l - amount));
  return `#${c.getHexString()}`;
}
