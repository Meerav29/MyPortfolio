// app/work/page.tsx
import { WorkRow } from "@/components/WorkRow";
import { workItems } from "@/data/work";

export const metadata = { title: "Work — Meerav Shah" };

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 pb-24">
      <h1 className="text-xs uppercase tracking-widest text-muted/60 mb-12">Work</h1>
      <div>
        {workItems.map((item) => (
          <WorkRow key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
