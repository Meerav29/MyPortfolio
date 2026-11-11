import Link from "next/link";

export function TagPill({ tag, active }: { tag: string; active?: boolean }) {
  const className = active
    ? "relative z-10 px-2 py-0.5 rounded-full border bg-accent text-sm"
    : "relative z-10 px-2 py-0.5 rounded-full border text-sm hover:bg-accent";
  return (
    <Link href={`/sidequests?tag=${encodeURIComponent(tag)}`} className={className}>
      {tag}
    </Link>
  );
}
