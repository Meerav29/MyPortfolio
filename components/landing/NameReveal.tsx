"use client";

import { RefObject, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const FIRST = "MEERAV";
const LAST = "SHAH";
const ALL_LETTERS = [...FIRST.split(""), " ", ...LAST.split("")];
const TOTAL = ALL_LETTERS.length; // 11 characters including space

function LetterSpan({
  char,
  index,
  scrollProgress,
}: {
  char: string;
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const step = 0.7 / TOTAL; // spread letters across 0–0.7 of scroll range
  const start = index * step;
  const end = start + step * 3; // overlap for smooth cascade

  const letterProgress = useTransform(scrollProgress, [start, end], [0, 1]);
  const rotateX = useTransform(letterProgress, [0, 1], [-90, 0]);
  const opacity = useTransform(letterProgress, [0, 0.5], [0, 1]);
  const y = useTransform(letterProgress, [0, 1], [20, 0]);

  if (char === " ") {
    return <span className="inline-block w-[0.3em]" />;
  }

  return (
    <motion.span
      className="inline-block origin-top"
      style={{
        rotateX,
        opacity,
        y,
        transformStyle: "preserve-3d",
      }}
    >
      {char}
    </motion.span>
  );
}

export default function NameReveal({
  scrollContainer,
}: {
  scrollContainer: RefObject<HTMLDivElement>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position within the sticky section relative to the
  // fixed overlay container (the window never scrolls on this page).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainer,
    offset: ["start start", "end end"],
  });

  // Glow expands as more letters are revealed
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.6], [0, 0.35]);
  const glowScale = useTransform(scrollYProgress, [0.1, 0.7], [0.3, 1.2]);

  return (
    <div ref={containerRef} className="relative h-[150vh]">
      {/* Sticky frame keeps the name centered while scrolling drives animation */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Accent glow behind the text */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "60vw",
            height: "30vh",
            background:
              "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
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
              scrollProgress={scrollYProgress}
            />
          ))}
        </h1>
      </div>
    </div>
  );
}
