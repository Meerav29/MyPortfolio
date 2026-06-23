import Link from "next/link";
import { Sidequest } from "@/lib/sidequests";
import { formatDate } from "@/lib/utils";

export function SidequestCard({ post }: { post: Sidequest }) {
  return (
    <Link
      href={`/sidequests/${post.slug}`}
      className="group flex items-start gap-4 py-5 border-t border-border hover:bg-card/40 transition-colors rounded-sm -mx-2 px-2"
    >
      <div className="w-0.5 min-h-[2.5rem] bg-border rounded-full shrink-0 mt-1" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-sm font-medium text-foreground leading-snug group-hover:text-foreground/80 transition-colors line-clamp-1">
            {post.title}
          </h3>
          <span className="text-xs text-muted/60 tabular-nums whitespace-nowrap shrink-0">
            {formatDate(post.publishedAt)}
          </span>
        </div>
        {post.excerpt && (
          <p className="mt-1 text-sm text-muted leading-relaxed line-clamp-2">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
