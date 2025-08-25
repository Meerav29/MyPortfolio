"use client";

import { useMemo, useState } from "react";
import ResearchCard from "@/components/ResearchCard";

type Props = {
  items: any[];
};

export default function ResearchPageClient({ items }: Props) {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("newest");

  const allTags = useMemo(
    () => Array.from(new Set(items.flatMap((r: any) => r.tags))).sort(),
    [items]
  );

  const years = useMemo(() => {
    return Array.from(
      new Set(
        items.map((r: any) => new Date(r.date).getFullYear().toString())
      )
    ).sort((a, b) => parseInt(b) - parseInt(a));
  }, [items]);

  const filtered = useMemo(() => {
    return items
      .filter((item: any) => {
        const q = query.toLowerCase();
        const matchesQuery = [item.title, item.venue, ...(item.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(q);

        const matchesTags = selectedTags.every((t) =>
          (item.tags ?? []).includes(t)
        );

        const itemYear = new Date(item.date).getFullYear().toString();
        const matchesYear = year ? itemYear === year : true;

        return matchesQuery && matchesTags && matchesYear;
      })
      .sort((a: any, b: any) => {
        if (sort === "newest")
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sort === "oldest")
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sort === "az") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [items, query, selectedTags, year, sort]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-3xl font-semibold">Research</h1>
      <p className="mt-4 text-muted">Selected research outputs and publications.</p>

      <section className="mt-8 space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 ring-accent"
              />
            </div>
            <div>
              <label htmlFor="year" className="sr-only">
                Filter by year
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 ring-accent"
              >
                <option value="">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="sr-only">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 ring-accent"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 ring-accent ${
                      selected
                        ? "bg-accent text-white border-accent"
                        : "text-foreground border-border hover:bg-foreground/5"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}

          <p aria-live="polite" className="text-sm text-muted">
            Showing {filtered.length} results
          </p>
        </div>

        {filtered.length === 0 ? (
          <p className="pt-4 text-muted">No matching research items.</p>
        ) : (
          <div className="grid gap-8">
            {filtered.map((item: any) => (
              <ResearchCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
