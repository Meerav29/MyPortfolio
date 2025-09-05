"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Pagination({ page, pages }: { page: number; pages: number }) {
  const router = useRouter();
  const params = useSearchParams();

  function go(p: number) {
    const q = new URLSearchParams(params.toString());
    if (p <= 1) q.delete("page");
    else q.set("page", String(p));
    router.push(`/sidequests?${q.toString()}`);
  }

  if (pages <= 1) return null;

  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav className="flex gap-2 items-center mt-6" aria-label="Pagination">
      <button
        className="px-2 py-1 border rounded"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        Prev
      </button>
      {nums.map((n) => (
        <button
          key={n}
          onClick={() => go(n)}
          className={
            n === page ? "px-2 py-1 border rounded bg-accent" : "px-2 py-1 border rounded"
          }
        >
          {n}
        </button>
      ))}
      <button
        className="px-2 py-1 border rounded"
        disabled={page >= pages}
        onClick={() => go(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
