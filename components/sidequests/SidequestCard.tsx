import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Sidequest } from "@/lib/sidequests";
import { TagPill } from "./TagPill";
import { formatDate } from "@/lib/utils";

const cardClass = "flex flex-col rounded-lg border hover:ring overflow-hidden h-full";

export function SidequestCard({ post }: { post: Sidequest }) {
  const external = post.externalUrl;
  const content = (
    <>
      {post.thumbnail ? (
        <div
          className="relative w-full"
          style={{ aspectRatio: "3 / 2" }}
        >
          <Image
            src={post.thumbnail}
            alt="thumbnail"
            fill
            className="object-cover"
            unoptimized={post.thumbnail.startsWith("http")}
          />
        </div>
      ) : null}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-semibold line-clamp-2">{post.title}</h3>
        <p className="text-sm text-muted line-clamp-3 mt-2 flex-grow">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 items-center text-xs text-muted">
          <span>{formatDate(post.publishedAt)}</span>
          {external && (
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-foreground">
              on Substack <ArrowUpRight className="h-3 w-3" aria-hidden />
            </span>
          )}
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </>
  );
  return external ? (
    <a href={external} target="_blank" rel="noopener noreferrer" className={cardClass}>
      {content}
    </a>
  ) : (
    <Link href={`/sidequests/${post.slug}`} className={cardClass}>
      {content}
    </Link>
  );
}
