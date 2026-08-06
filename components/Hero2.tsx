// components/Hero2.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import SphereCanvas from "@/components/SphereCanvas";

export default function Hero2() {
  const prefersReduced = useReducedMotion();

  return (
    <div>
      {/* Mobile: small centered planet up top, text flows below in normal layout */}
      <section className="relative md:hidden">
        <div className="relative mx-auto mt-8 h-56 w-full max-w-xs">
          <SphereCanvas compact />
        </div>
        <div className="relative z-10 mx-auto w-full px-6 pt-4 pb-4 text-center">
          <motion.h1
            className="text-4xl font-light leading-tight tracking-tight text-foreground"
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            Hi, I&apos;m Meerav.
          </motion.h1>

          <motion.p
            className="mt-4 text-sm text-muted leading-relaxed"
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          >
            Applied AI Engineer at Rolai.
          </motion.p>
        </div>
      </section>

      {/* Desktop: full-bleed sphere background, vertically centered content */}
      <section className="relative hidden min-h-[calc(100vh-57px)] md:flex md:flex-col md:justify-center overflow-hidden">
        <SphereCanvas />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-20">
          <motion.h1
            className="text-5xl md:text-7xl font-light leading-tight tracking-tight text-foreground"
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            Hi, I&apos;m Meerav.
          </motion.h1>

          <motion.p
            className="mt-4 text-sm text-muted leading-relaxed"
            initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
          >
            Applied AI Engineer at Rolai.
          </motion.p>

          <motion.div
            className="mt-8"
            initial={prefersReduced ? {} : { opacity: 0 }}
            animate={prefersReduced ? {} : { opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <a
              href="#work"
              className="inline-block text-xs text-muted/50 hover:text-muted transition-colors tracking-widest uppercase"
              aria-label="Scroll to selected work"
            >
              ↓ Scroll
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
