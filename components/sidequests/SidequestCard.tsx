import Image from "next/image";
import Link from "next/link";
import { Sidequest } from "@/lib/sidequests";
import { TagPill } from "./TagPill";
import { formatDate } from "@/lib/utils";

export function SidequestCard({ post }: { post: Sidequest }) {
  return (
    <Link
      href={`/sidequests/${post.slug}`}
      className="block rounded-lg border p-4 hover:ring"
    >
      <div className="flex items-center gap-4">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt="thumbnail"
            width={64}
            height={64}
            className="rounded object-cover"
          />
        ) : null}
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-2">{post.title}</h3>
          <p className="text-sm text-muted line-clamp-2 mt-1">
            {post.excerpt}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 items-center text-xs text-muted">
            <span>{formatDate(post.publishedAt)}</span>
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
