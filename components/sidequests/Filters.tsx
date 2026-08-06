"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Filters({
  tags,
}: {
  tags: { tag: string; count: number }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const selected = new Set(params.getAll("tag"));
  const topTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 2);

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

  if (!topTags.length) return null;

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {topTags.map((t) => (
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
    </div>
  );
}
