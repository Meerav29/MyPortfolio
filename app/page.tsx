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
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-6 flex items-center justify-between text-xs text-muted/50">
          <span>© {new Date().getFullYear()} Meerav Shah</span>
          <a href={`mailto:${links.email}`} className="hover:text-muted/80 transition-colors">{links.email}</a>
        </div>
      </footer>
    </div>
  );
}
