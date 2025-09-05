import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getSidequestBySlug,
  getAllSidequests,
} from "@/lib/sidequests";
import { PostHeader } from "@/components/sidequests/PostHeader";
import { Prose } from "@/components/sidequests/Prose";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getSidequestBySlug(params.slug);
  return {
    title: post ? `${post.title} — Meerav Shah` : "Sidequests",
    description: post?.excerpt,
  };
}

export default async function SidequestPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getSidequestBySlug(params.slug);
  if (!post) notFound();

  const all = getAllSidequests({ includeDrafts: true });
  const index = all.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index < all.length - 1 ? all[index + 1] : undefined;

  return (
    <main className="mx-auto max-w-prose px-4 py-14">
      <PostHeader post={post} />
      <Prose>{post.body}</Prose>
      <div className="mt-8 flex justify-between text-sm">
        {prev ? <Link href={`/sidequests/${prev.slug}`}>← {prev.title}</Link> : <span />}
        {next ? <Link href={`/sidequests/${next.slug}`}>{next.title} →</Link> : <span />}
      </div>
    </main>
  );
}
