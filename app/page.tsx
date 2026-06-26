// app/page.tsx
import Link from "next/link";
import StatementHero from "@/components/StatementHero";
import { WorkRow } from "@/components/WorkRow";
import { workItems } from "@/data/work";
import { links } from "@/lib/links";

const featured = workItems.filter((w) => w.featured);

export default function Page() {
  return (
    <div>
      <StatementHero />
      <main className="mx-auto max-w-3xl px-6 pb-24" id="work">
        <section>
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-xs uppercase tracking-widest text-muted/60">Selected Work</h2>
            <Link href="/work" className="text-xs text-muted hover:text-foreground transition-colors">
              All work →
            </Link>
          </div>
          {featured.map((item) => (
            <WorkRow key={item.id} item={item} />
          ))}
        </section>
        <section className="mt-16">
          <h2 className="text-xs uppercase tracking-widest text-muted/60 mb-4">Get in touch</h2>
          <div className="flex items-center gap-3 text-sm text-muted flex-wrap">
            <a href={`mailto:${links.email}`} className="hover:text-foreground transition-colors">Email</a>
            <span className="text-muted/30">·</span>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            <span className="text-muted/30">·</span>
            <a href={links.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <span className="text-muted/30">·</span>
            <a href={links.resume} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Resume</a>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-6 text-xs text-muted/50">
          <span>© {new Date().getFullYear()} Meerav Shah</span>
        </div>
      </footer>
    </div>
  );
}
