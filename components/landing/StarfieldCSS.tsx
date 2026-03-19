"use client";

import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  layer: number; // 0 = far (slow parallax), 1 = mid, 2 = near (fast)
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.1,
      layer: i % 3,
    });
  }
  return stars;
}

export default function StarfieldCSS({
  scrollProgress,
  count = 150,
}: {
  scrollProgress: MotionValue<number>;
  count?: number;
}) {
  const stars = useMemo(() => generateStars(count), [count]);

  // 3 parallax layers — far stars move slowly, near stars move faster
  const layer0Y = useTransform(scrollProgress, [0, 1], [0, -40]);
  const layer1Y = useTransform(scrollProgress, [0, 1], [0, -80]);
  const layer2Y = useTransform(scrollProgress, [0, 1], [0, -140]);

  const layers = [layer0Y, layer1Y, layer2Y];

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {[0, 1, 2].map((layerIndex) => (
        <motion.div
          key={layerIndex}
          className="absolute inset-0"
          style={{ y: layers[layerIndex] }}
        >
          {stars
            .filter((s) => s.layer === layerIndex)
            .map((star, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}
              />
            ))}
        </motion.div>
      ))}
    </div>
  );
}
