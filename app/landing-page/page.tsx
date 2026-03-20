"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  Linkedin,
  Github,
  FileText,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import StarfieldCSS from "@/components/landing/StarfieldCSS";
import NameReveal from "@/components/landing/NameReveal";
import { links } from "@/lib/links";

/* ------------------------------------------------------------------ */
/*  useMediaQuery — same pattern as Hero.tsx                           */
/* ------------------------------------------------------------------ */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}

/* ------------------------------------------------------------------ */
/*  Stats data                                                         */
/* ------------------------------------------------------------------ */
const stats = [
  { label: "Research Areas", value: "3", detail: "AI, Aerospace, Ed-Tech" },
  { label: "Projects Built", value: "8+", detail: "From advising tools to UAV analytics" },
  { label: "Publications", value: "2", detail: "HCI & intelligent tutoring systems" },
  { label: "Graduating", value: "May '26", detail: "Penn State, BS Computer Science" },
];

const contactLinks = [
  { icon: <Mail size={18} />, label: "Email", href: `mailto:${links.email}` },
  {
    icon: <Linkedin size={18} />,
    label: "LinkedIn",
    href: links.linkedin,
  },
  { icon: <Github size={18} />, label: "GitHub", href: links.github },
  { icon: <FileText size={18} />, label: "Resume", href: links.resume },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const overlayRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: overlayRef,
  });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-background text-foreground"
    >
      {/* ── Screen 1: Dark Void ── */}
      <section className="relative h-screen flex flex-col items-center justify-center">
        <StarfieldCSS
          scrollProgress={scrollYProgress}
          count={isMobile ? 80 : 150}
        />

        <motion.p
          className="text-muted text-sm tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Scroll to begin
        </motion.p>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <ChevronDown
            size={24}
            className="text-muted animate-bounce"
          />
        </motion.div>
      </section>

      {/* ── Screen 2: Name Reveal ── */}
      <NameReveal scrollYProgress={scrollYProgress} />

      {/* ── Screen 3: Identity / Tagline ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        <StarfieldCSS
          scrollProgress={scrollYProgress}
          count={isMobile ? 40 : 80}
        />

        <motion.p
          className="text-lg md:text-2xl text-muted tracking-tight text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          CS + Astrophysics @ Penn State
        </motion.p>

        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 md:gap-x-10">
          {["Builder", "Researcher", "Designer"].map((word, i) => (
            <motion.span
              key={word}
              className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
            >
              {word}.
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── Screen 4: Stats + CTA ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-accent">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-muted">{stat.detail}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            Explore my work
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { label: "Research", href: "/research" },
              { label: "Experience", href: "/experience" },
              { label: "Sidequests", href: "/sidequests" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm
                           hover:border-accent transition-colors"
              >
                {link.label}
                <ArrowRight
                  size={14}
                  className="opacity-50 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>

          {/* Social row */}
          <div className="flex justify-center gap-4">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="rounded-full border border-border p-3 text-muted
                           hover:text-accent hover:border-accent transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <p className="mt-16 text-xs text-muted/60">
          &copy; {new Date().getFullYear()} Meerav Shah
        </p>
      </section>
    </div>
  );
}
