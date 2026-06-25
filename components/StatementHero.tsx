// components/StatementHero.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import SphereCanvas from "@/components/SphereCanvas";

type Word = { text: string; dim?: boolean };

const STATEMENT: Word[][] = [
  [{ text: "Research-trained." }],
  [{ text: "Product-minded." }],
  [{ text: "I" }, { text: "build", dim: true }, { text: "AI." }],
];

const SUBLINES = [
  "Applied AI · CS + Astrophysics · Penn State.",
];

// Pre-compute word delays to avoid mutation during render
const WORD_DELAYS: number[][] = (() => {
  let idx = 0;
  return STATEMENT.map((line) => line.map(() => idx++ * 0.07));
})();

const TOTAL_WORD_DELAY = STATEMENT.flatMap((l) => l).length * 0.07;

export default function StatementHero() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[calc(100vh-57px)] flex-col justify-center overflow-hidden">
      <SphereCanvas />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-20">
      <div className="space-y-2">
        {STATEMENT.map((line, lineIdx) => (
          <div key={lineIdx} className="flex flex-wrap gap-x-3 gap-y-1">
            {line.map((word, wordIdx) => (
              <motion.span
                key={`${lineIdx}-${wordIdx}`}
                className={`text-5xl md:text-7xl font-light leading-tight tracking-tight ${
                  word.dim ? "text-muted" : "text-foreground"
                }`}
                initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
                animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: prefersReduced ? 0 : WORD_DELAYS[lineIdx][wordIdx],
                }}
              >
                {word.text}
              </motion.span>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-1">
        {SUBLINES.map((line, i) => (
          <motion.p
            key={i}
            className="text-sm text-muted leading-relaxed"
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              delay: prefersReduced ? 0 : TOTAL_WORD_DELAY + 0.1 + i * 0.08,
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="mt-2"
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={prefersReduced ? {} : { opacity: 1 }}
        transition={{ delay: prefersReduced ? 0 : TOTAL_WORD_DELAY + 0.3, duration: 0.5 }}
      >
        <a
          href="#work"
          className="mt-8 inline-block text-xs text-muted/50 hover:text-muted transition-colors tracking-widest uppercase"
          aria-label="Scroll to selected work"
        >
          ↓
        </a>
      </motion.div>
      </div>
    </section>
  );
}
