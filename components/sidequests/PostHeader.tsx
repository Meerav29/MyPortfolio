import { Sidequest } from "@/lib/sidequests";
import { formatDate } from "@/lib/utils";
import { TagPill } from "./TagPill";

export function PostHeader({ post }: { post: Sidequest }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-muted flex flex-wrap gap-2 items-center">
        <span>{formatDate(post.publishedAt)}</span>
        {post.updatedAt && <span>(Updated {formatDate(post.updatedAt)})</span>}
        {post.readingTime && <span>{post.readingTime} min read</span>}
        {post.tags.map((t) => (
          <TagPill key={t} tag={t} />
        ))}
      </div>
    </header>
  );
}
