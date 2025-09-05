import { Metadata } from "next";
import {
  getAllSidequests,
  getAllTags,
  searchSidequests,
  filterByTags,
  paginate,
} from "@/lib/sidequests";
import { Filters } from "@/components/sidequests/Filters";
import { SidequestCard } from "@/components/sidequests/SidequestCard";
import { EmptyState } from "@/components/sidequests/EmptyState";
import { Pagination } from "@/components/sidequests/Pagination";

export const metadata: Metadata = {
  title: "Sidequests — Meerav Shah",
  description: "Explorations off the main path.",
};

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const all = getAllSidequests();
  const tags = getAllTags();
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const selectedTags = Array.isArray(searchParams.tag)
    ? (searchParams.tag as string[])
    : searchParams.tag
    ? [searchParams.tag as string]
    : [];
  const mode = searchParams.mode === "OR" ? "OR" : "AND";

  let posts = filterByTags(all, selectedTags, mode);
  posts = searchSidequests(posts, q);

  const page = parseInt((searchParams.page as string) || "1", 10);
  const { items, pages } = paginate(posts, page, 9);

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-3xl font-semibold">Sidequests</h1>
      <p className="text-muted mb-6">Explorations off the main path.</p>
      <Filters tags={tags} />
      {items.length ? (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <SidequestCard key={p.slug} post={p} />
            ))}
          </div>
          <Pagination page={page} pages={pages} />
        </>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}
