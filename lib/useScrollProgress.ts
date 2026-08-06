"use client";

import { useEffect, useState } from "react";

// distancePx: scroll distance over which progress goes from 0 to 1.
// Defaults to one viewport height when omitted.
export function useScrollProgress(distancePx?: number): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const distance = distancePx || window.innerHeight || 1;
      const raw = window.scrollY / distance;
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
  }, [distancePx]);

  return progress;
}
