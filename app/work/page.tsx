// app/work/page.tsx
import { WorkRow } from "@/components/WorkRow";
import { workItems } from "@/data/work";

export const metadata = { title: "Work — Meerav Shah" };

const sections: { label: string; category: "industry" | "research" | "early" }[] = [
  { label: "Industry", category: "industry" },
  { label: "Research & Leadership", category: "research" },
  { label: "Early Projects", category: "early" },
];

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 pb-24">
      {sections.map(({ label, category }) => {
        const items = workItems.filter((w) => w.category === category);
        return (
          <section key={category} className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted/60 mb-4">{label}</p>
            <div>
              {items.map((item) => (
                <WorkRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
