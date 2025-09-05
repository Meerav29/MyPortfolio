import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";
import { mdxToContent } from "./mdx";

export type Sidequest = {
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  excerpt: string;
  tags: string[];
  thumbnail?: string;
  status: "draft" | "published" | "archived";
  readingTime?: number;
  body?: any;
};

const frontmatterSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  thumbnail: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  readingTime: z.number().optional(),
});

const CONTENT_DIR = path.join(process.cwd(), "content", "sidequests");

function normalizeTag(tag: string) {
  return tag
    .trim()
    .split(/\s+/)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase())
    .join(" ");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveSlug(filename: string) {
  const base = path.basename(filename, path.extname(filename));
  const parts = base.split("-");
  if (parts.length > 3) {
    return parts.slice(3).join("-");
  }
  return base;
}

export function getAllSidequests(opts: { includeDrafts?: boolean } = {}) {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: Sidequest[] = files.map((file) => {
    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const parsed = frontmatterSchema.parse({
      ...data,
      slug: data.slug ?? deriveSlug(file),
    });
    const tags = Array.from(new Set(parsed.tags.map(normalizeTag)));
    const rt = parsed.readingTime ?? Math.ceil(readingTime(content).minutes);
    return {
      ...parsed,
      tags,
      slug: parsed.slug || deriveSlug(file),
      readingTime: rt,
    };
  });

  const filtered = opts.includeDrafts
    ? posts
    : posts.filter((p) => p.status === "published");

  return filtered.sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      return a.slug.localeCompare(b.slug);
    }
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });
}

export async function getSidequestBySlug(slug: string) {
  const posts = getAllSidequests({ includeDrafts: true });
  const post = posts.find((p) => p.slug === slug);
  if (!post) return undefined;

  // Find the actual file by matching the computed slug for each file
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  let matchedFile: string | undefined;
  for (const file of files) {
    const full = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data } = matter(raw);
    const computedSlug = (data as any)?.slug ?? deriveSlug(file);
    if (computedSlug === slug) {
      matchedFile = full;
      break;
    }
  }

  if (!matchedFile) return undefined;

  const raw = fs.readFileSync(matchedFile, "utf8");
  const { content } = matter(raw);
  const body = await mdxToContent(content);
  return { ...post, body };
}

export function getAllTags() {
  const posts = getAllSidequests();
  const counts: Record<string, number> = {};
  posts.forEach((p) => {
    p.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  return Object.entries(counts).map(([tag, count]) => ({ tag, count }));
}

export function searchSidequests(posts: Sidequest[], q: string) {
  if (!q) return posts;
  const term = q.toLowerCase();
  return posts
    .map((p) => {
      const titleMatch = p.title.toLowerCase().includes(term) ? 3 : 0;
      const excerptMatch = p.excerpt.toLowerCase().includes(term) ? 2 : 0;
      const tagMatch = p.tags.some((t) => t.toLowerCase().includes(term)) ? 1 : 0;
      return { post: p, score: titleMatch + excerptMatch + tagMatch };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.post);
}

export function filterByTags(
  posts: Sidequest[],
  tags: string[],
  mode: "AND" | "OR" = "AND"
) {
  if (!tags.length) return posts;
  const t = tags.map((x) => x.toLowerCase());
  return posts.filter((p) => {
    const postTags = p.tags.map((tag) => tag.toLowerCase());
    if (mode === "AND") return t.every((tag) => postTags.includes(tag));
    return t.some((tag) => postTags.includes(tag));
  });
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page,
    pages,
    total,
  };
}
