"use client";

import Link from "next/link";
import { ExternalLink, Mail, Linkedin, Github, FileText } from "lucide-react";
import PlanetCanvas from "../../components/PlanetCanvas";
import ScrollReveal from "../../components/ScrollReveal";
import { links } from "../../lib/links";
import { projects } from "../../lib/projects";

// Standalone preview of an alternate hero concept: centered planet, single
// short intro line, followed by the same Projects/Contact/Footer sections
// as the live homepage. Not linked in nav, does not touch app/page.tsx or
// components/Hero.tsx. Visit directly at /hero-mockup. Delete once no
// longer needed.

export default function HeroMockupPage() {
  return (
    <div>
      <section className="relative h-screen w-full overflow-hidden bg-[var(--background)]">
        <div className="absolute inset-0 -translate-y-16">
          <PlanetCanvas offsetX={0} scale={0.85} />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[var(--background)]" />

        <div className="relative z-20 flex h-full flex-col items-center justify-end pb-24 text-center px-6">
          <h1 className="text-3xl md:text-5xl font-normal tracking-tight text-foreground drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)]">
            Hi, I&apos;m Meerav
          </h1>
          <p className="mt-3 text-lg md:text-xl text-muted drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            Applied AI Engineer @ Rolai
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6">
        <Projects projects={projects} />
        <Contact links={links} />
      </main>
      <Footer />
    </div>
  );
}

function Section({ id, title, children }: any) {
  return (
    <ScrollReveal className="scroll-reveal-section">
      <section id={id} className="py-14 md:py-20 border-t border-border">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
          <a href="#top" className="text-sm text-muted hover:text-link-hover">
            Back to top
          </a>
        </div>
        {children}
      </section>
    </ScrollReveal>
  );
}

function Projects({ projects }: { projects: any[] }) {
  return (
    <Section id="projects" title="Featured Projects">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, idx) => (
          <ScrollReveal key={p.slug} className="h-full" delay={90 * idx} distance={18}>
            <Link
              href={`/projects/${p.slug}`}
              className="scroll-reveal-card group flex h-full min-h-[17rem] flex-col rounded-[28px] border border-border bg-card p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_22px_50px_-34px_rgba(15,23,42,0.5)]"
            >
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="text-lg font-medium leading-snug text-black dark:text-white">{p.title}</h3>
                  <ExternalLink size={16} className="mt-1 shrink-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted">{p.summary}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags?.map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/80 bg-transparent px-3 py-1 text-xs text-black dark:border-white/80 dark:text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

function Contact({ links }: { links: any }) {
  const contactLinks = [
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: links.email,
      href: `mailto:${links.email}`,
    },
    {
      icon: <Linkedin size={20} />,
      label: "LinkedIn",
      value: "@meeravshah",
      href: links.linkedin,
    },
    {
      icon: <Github size={20} />,
      label: "GitHub",
      value: "@Meerav29",
      href: links.github,
    },
    {
      icon: <FileText size={20} />,
      label: "Resume",
      value: "View PDF",
      href: links.resume,
    },
  ];

  return (
    <Section id="contact" title="Get in touch">
      <p className="text-muted max-w-2xl mb-8">
        Graduating May 2026 and actively looking for full-time roles. Open to opportunities in AI, aerospace, and ed-tech — research, product, or engineering.
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {contactLinks.map((link, idx) => (
          <ScrollReveal key={link.label} delay={80 * idx} distance={16}>
            <a
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 rounded-2xl border border-border p-5 bg-card hover:border-accent transition-colors"
            >
              <div className="text-accent">{link.icon}</div>
              <div>
                <div className="text-sm font-medium">{link.label}</div>
                <div className="text-xs text-muted mt-0.5">{link.value}</div>
              </div>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} Meerav Shah</span>
        <span className="opacity-80">Built with Next.js + Tailwind · Minimal, blue/black/white.</span>
      </div>
    </footer>
  );
}
