// app/hero-mockup-v2/page.tsx
// Mockup only — not linked from nav. Compare against the live homepage before deciding.
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SphereCanvas from "@/components/SphereCanvas";

type Card = {
  label: string;
  description: string;
  href: string;
};

const CARDS: Card[] = [
  { label: "Work", description: "Selected projects and case studies.", href: "/work" },
  { label: "Research", description: "Published and ongoing research.", href: "/research" },
  { label: "Writing", description: "Sidequests — notes and essays.", href: "/sidequests" },
  { label: "Get in touch", description: "Email, LinkedIn, resume.", href: "/#contact" },
];

export default function HeroMockupV2() {
  const prefersReduced = useReducedMotion();

  return (
    <div>
      {/* Mobile: small centered planet up top, text/cards flow below in normal layout */}
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
              href="#explore"
              className="inline-block text-xs text-muted/50 hover:text-muted transition-colors tracking-widest uppercase"
              aria-label="Scroll to explore"
            >
              ↓ Scroll
            </a>
          </motion.div>
        </div>
      </section>

      <section id="explore" className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-xs uppercase tracking-widest text-muted/60 mb-6">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
            >
              <Link
                href={card.href}
                className="group block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-foreground/20"
              >
                <h3 className="text-sm font-medium text-foreground">{card.label}</h3>
                <p className="mt-1 text-xs text-muted">{card.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
