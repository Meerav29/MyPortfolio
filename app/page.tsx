"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Hero from "@/components/Hero";
import { links } from "@/lib/links";
import { projects } from "@/lib/projects";

export default function Page() {
  return (
    <div>
      <Hero id="top" />
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
    <section id={id} className="py-14 md:py-20 border-t border-border">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        <a href="#top" className="text-sm text-muted hover:text-link-hover">
          Back to top
        </a>
      </div>
      {children}
    </section>
  );
}

function Projects({ projects }: { projects: any[] }) {
  return (
    <Section id="projects" title="Featured Projects">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group rounded-2xl border border-border p-6 bg-card hover:bg-card transition-colors"
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="text-lg font-medium leading-snug text-black dark:text-white">{p.title}</h3>
              <ExternalLink size={16} className="shrink-0 opacity-70 group-hover:opacity-100" />
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
    </Section>
  );
}

function Contact({ links }: { links: any }) {
  return (
    <Section id="contact" title="Get in touch">
      <div className="rounded-2xl border border-border p-6 bg-gradient-to-br from-accent to-link-hover text-background">
        <h3 className="text-xl font-semibold">Let’s build something.</h3>
        <p className="mt-2 text-background opacity-80 max-w-2xl">
          I’m open to research collaborations, product work, and internships in AI, aerospace, and ed-tech.
        </p>

        {/* Contact Form */}
        <form
          action="https://formspree.io/f/mrblrpnp"
          method="POST"
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            className="flex-1 rounded-xl px-4 py-2 bg-background text-foreground placeholder-muted"
          />
          <input
            type="text"
            name="message"
            placeholder="Say hello..."
            required
            className="flex-1 rounded-xl px-4 py-2 bg-background text-foreground placeholder-muted"
          />
          <button
            type="submit"
            className="rounded-xl bg-background text-foreground px-4 py-2 text-sm hover:bg-card transition-colors"
          >
            Send
          </button>
        </form>

        {/* Optional quick links */}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            href={`mailto:${links.email}`}
            className="rounded-xl border border-background px-4 py-2 hover:bg-background text-background"
          >
            Email Me
          </a>
          <a
            href={links.linkedin}
            className="rounded-xl border border-background px-4 py-2 hover:bg-background text-background"
          >
            LinkedIn
          </a>
          <a
            href={links.site}
            className="rounded-xl border border-background px-4 py-2 hover:bg-background text-background"
          >
            Current Site
          </a>
        </div>
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
