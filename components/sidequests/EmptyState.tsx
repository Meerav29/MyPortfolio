import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded border p-8 text-center">
      <p className="mb-4">No sidequests found.</p>
      <Link href="/sidequests" className="underline">
        Clear filters
      </Link>
    </div>
  );
}
