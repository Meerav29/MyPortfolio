"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, Mail, Linkedin, Github, FileText } from "lucide-react";
import GalaxyBackground from "@/components/GalaxyBackground";
import ScrollIndicator from "@/components/ScrollIndicator";
import { links } from "@/lib/links";
import { projects } from "@/lib/projects";

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

export default function DemoPage() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className="relative min-h-screen">
      {/* Fixed galaxy background that persists through the entire page */}
      <GalaxyBackground offsetX={isMobile ? 0.5 : 2} scale={isMobile ? 0.8 : 1} />

      {/* All page content scrolls over the galaxy */}
      <div className="relative z-10">
        {/* Hero section */}
        <section id="top" className="relative h-screen w-full overflow-hidden">
          {/* Bottom fade for cohesion into content below */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[var(--background)]" />

          <div className="relative z-20 flex h-full items-start md:items-center">
            <div className="pl-10 md:pl-20 lg:pl-28 pr-6 max-w-xl pt-24 md:pt-0">
              <h1 className="text-xl md:text-3xl font-normal leading-tight text-muted tracking-tight">
                Hi, I&apos;m Meerav Shah! An{" "}
                <span className="text-foreground font-semibold">
                  undergraduate senior in Computer Science
                </span>{" "}
                at Penn State, minoring in{" "}
                <span className="text-foreground font-semibold">Astrophysics</span>.
                <br className="hidden md:block" />
                <span className="block mt-4">
                  I build{" "}
                  <span className="text-foreground font-semibold">practical, minimal tools</span>:
                  from{" "}
                  <span className="text-foreground font-semibold">advising assistants</span> that
                  free up faculty time to{" "}
                  <span className="text-foreground font-semibold">UAV analytics</span> that make
                  flight safer.
                </span>
                <span className="block mt-4">
                  I care about{" "}
                  <span className="text-foreground font-semibold">clean design</span>,{" "}
                  <span className="text-foreground font-semibold">clear impact</span>, and{" "}
                  <span className="text-foreground font-semibold">shipping real things</span>.
                </span>
              </h1>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/research"
                  className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-card/80 transition-colors"
                >
                  Research Outputs
                </Link>
                <Link
                  href="/experience"
                  className="rounded-xl border border-border bg-card px-4 py-2 text-sm hover:bg-card/80 transition-colors"
                >
                  Work Experience
                </Link>
              </div>
            </div>
          </div>

          <ScrollIndicator />
        </section>

        {/* Main content — sits over the galaxy background with a semi-transparent backdrop */}
        <main className="mx-auto max-w-6xl px-6 relative">
          {/* Translucent backdrop so content is readable over stars */}
          <div className="absolute inset-0 -mx-6 bg-background/80 backdrop-blur-sm" />

          <div className="relative">
            {/* Projects */}
            <section id="projects" className="py-14 md:py-20 border-t border-border">
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Featured Projects
                </h2>
                <a href="#top" className="text-sm text-muted hover:text-link-hover">
                  Back to top
                </a>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group rounded-2xl border border-border p-6 bg-card/70 backdrop-blur-sm hover:bg-card transition-colors"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <h3 className="text-lg font-medium leading-snug text-black dark:text-white">
                        {p.title}
                      </h3>
                      <ExternalLink
                        size={16}
                        className="shrink-0 opacity-70 group-hover:opacity-100"
                      />
                    </div>
                    <p className="mt-3 text-muted text-sm leading-relaxed">{p.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags?.map((t: string) => (
                        <span
                          key={t}
                          className="text-xs text-black dark:text-white rounded-full border border-black dark:border-white px-2 py-1 bg-transparent"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-14 md:py-20 border-t border-border">
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Get in touch</h2>
                <a href="#top" className="text-sm text-muted hover:text-link-hover">
                  Back to top
                </a>
              </div>
              <p className="text-muted max-w-2xl mb-8">
                Graduating May 2026 and actively looking for full-time roles. Open to opportunities
                in AI, aerospace, and ed-tech — research, product, or engineering.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
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
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 rounded-2xl border border-border p-5 bg-card/70 backdrop-blur-sm hover:border-accent transition-colors"
                  >
                    <div className="text-accent">{link.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{link.label}</div>
                      <div className="text-xs text-muted mt-0.5">{link.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative mt-16 border-t border-border bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted flex flex-col md:flex-row items-center justify-between gap-3">
            <span>&copy; {new Date().getFullYear()} Meerav Shah</span>
            <span className="opacity-80">
              Built with Next.js + Tailwind &middot; Minimal, blue/black/white.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
