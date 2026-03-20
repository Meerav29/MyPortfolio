"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

const FIRST = "MEERAV";
const LAST = "SHAH";
const ALL_LETTERS = [...FIRST.split(""), " ", ...LAST.split("")];
const TOTAL = ALL_LETTERS.length; // 11 chars incl. space

// ─── Global scroll ranges for Screen 2 ───────────────────────────────────────
// Page layout (300vh name section): 100vh + 300vh + ~100vh + ~120vh = ~620vh
// Scrollable height ≈ 520vh  →  Screen 2 active window ≈ [0.19, 0.57]
// Letters stagger within [NAME_START, NAME_END] of total page scroll.
const NAME_START = 0.20;
const NAME_END   = 0.54;
const SPAN       = NAME_END - NAME_START; // 0.34
const STEP       = SPAN / TOTAL;          // per-letter stride

function LetterSpan({
  char,
  index,
  scrollYProgress,
}: {
  char: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Each letter's window in global scroll space, with 3× overlap for cascade
  const start = NAME_START + index * STEP;
  const end   = Math.min(start + STEP * 3, NAME_END + STEP * 2);

  const rotateX = useTransform(scrollYProgress, [start, end], [-90, 0]);
  const opacity = useTransform(scrollYProgress, [start, start + STEP * 1.5], [0, 1]);
  const y       = useTransform(scrollYProgress, [start, end], [24, 0]);

  if (char === " ") return <span className="inline-block w-[0.3em]" />;

  return (
    <motion.span
      className="inline-block origin-top"
      style={{ rotateX, opacity, y, transformStyle: "preserve-3d" }}
    >
      {char}
    </motion.span>
  );
}

export default function NameReveal({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  // Glow builds as letters appear
  const glowOpacity = useTransform(scrollYProgress, [NAME_START, NAME_END], [0, 0.35]);
  const glowScale   = useTransform(scrollYProgress, [NAME_START, NAME_END], [0.3, 1.2]);

  return (
    // Tall section = lots of scroll room for the animation to breathe
    <div className="relative h-[300vh]">
      {/* Sticky frame — stays in view while outer div scrolls */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Accent glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "60vw",
            height: "30vh",
            background: "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
            opacity: glowOpacity,
            scale: glowScale,
            filter: "blur(60px)",
          }}
        />

        {/* Orbital dots */}
        <div className="absolute h-[300px] w-[300px] md:h-[400px] md:w-[400px] animate-[spin_20s_linear_infinite]">
          <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent/50" />
          <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent/30" />
        </div>
        <div className="absolute h-[400px] w-[400px] md:h-[550px] md:w-[550px] animate-[spin_30s_linear_infinite_reverse]">
          <div className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-foreground/20" />
        </div>

        {/* The name */}
        <h1
          className="relative z-10 text-center font-bold tracking-tighter text-foreground
                     text-5xl sm:text-6xl md:text-8xl lg:text-9xl"
          style={{ perspective: "800px" }}
        >
          {ALL_LETTERS.map((char, i) => (
            <LetterSpan
              key={i}
              char={char}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </h1>
      </div>
    </div>
  );
}
