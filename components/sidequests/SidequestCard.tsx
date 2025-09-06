import Image from "next/image";
import Link from "next/link";
import { Sidequest } from "@/lib/sidequests";
import { TagPill } from "./TagPill";
import { formatDate } from "@/lib/utils";

export function SidequestCard({ post }: { post: Sidequest }) {
  return (
    <Link
      href={`/sidequests/${post.slug}`}
      className="flex rounded-lg border hover:ring overflow-hidden"
    >
      {post.thumbnail ? (
        <div className="relative w-1/2 h-48">
          <Image
            src={post.thumbnail}
            alt="thumbnail"
            fill
            className="object-cover"
          />
        </div>
      ) : null}
      <div className={post.thumbnail ? "w-1/2 p-6 flex flex-col" : "w-full p-6 flex flex-col"}>
        <h3 className="font-semibold line-clamp-2">{post.title}</h3>
        <p className="text-sm text-muted line-clamp-3 mt-2 flex-grow">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 items-center text-xs text-muted">
          <span>{formatDate(post.publishedAt)}</span>
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </Link>
  );
}
