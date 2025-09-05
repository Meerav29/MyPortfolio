"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function Filters({
  tags,
}: {
  tags: { tag: string; count: number }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const selected = new Set(params.getAll("tag"));
  const mode = params.get("mode") === "OR" ? "OR" : "AND";

  function updateParam(key: string, value?: string) {
    const query = new URLSearchParams(params.toString());
    if (!value) query.delete(key);
    else query.set(key, value);
    router.push(`/sidequests?${query.toString()}`);
  }

  function toggleTag(tag: string) {
    const query = new URLSearchParams(params.toString());
    const current = query.getAll("tag");
    if (current.includes(tag)) {
      const next = current.filter((t) => t !== tag);
      query.delete("tag");
      next.forEach((t) => query.append("tag", t));
    } else {
      query.append("tag", tag);
    }
    router.push(`/sidequests?${query.toString()}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", search || undefined);
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 space-y-2">
      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="flex-1 rounded border px-2 py-1"
        />
        <button type="submit" className="rounded border px-3 py-1">
          Go
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => router.push("/sidequests")}
        >
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t.tag}
            type="button"
            onClick={() => toggleTag(t.tag)}
            className={
              selected.has(t.tag)
                ? "px-2 py-0.5 rounded-full border bg-accent text-sm"
                : "px-2 py-0.5 rounded-full border text-sm"
            }
          >
            {t.tag}
          </button>
        ))}
        <button
          type="button"
          onClick={() => updateParam("mode", mode === "AND" ? "OR" : "AND")}
          className="px-2 py-0.5 rounded-full border text-sm"
        >
          Mode: {mode}
        </button>
      </div>
    </form>
  );
}
