import type { Sidequest } from "./sidequests";

export const SUBSTACK_URL = "https://meeravshah.substack.com";
const DEFAULT_THUMBNAIL = "/images/sidequests/space.png";

function unwrap(raw: string) {
  const cdata = raw.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return cdata ? cdata[1] : raw;
}

function decodeEntities(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function text(s: string) {
  return decodeEntities(unwrap(s).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function tagValues(item: string, tag: string) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "g");
  return Array.from(item.matchAll(re), (m) => text(m[1])).filter(Boolean);
}

/** Canonical form used to de-duplicate posts by URL. */
export function normalizeUrl(url: string) {
  try {
    const u = new URL(url);
    return `${u.hostname.toLowerCase()}${u.pathname.replace(/\/+$/, "")}`;
  } catch {
    return url;
  }
}

function parseFeed(xml: string): Sidequest[] {
  const posts: Sidequest[] = [];
  for (const [, item] of Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g))) {
    const title = tagValues(item, "title")[0];
    const link = tagValues(item, "link")[0];
    const pub = new Date(tagValues(item, "pubDate")[0] ?? "");
    if (!title || !link || Number.isNaN(pub.getTime())) continue;

    const enclosure = item.match(/<enclosure[^>]*\surl="([^"]+)"/)?.[1];
    const categories = tagValues(item, "category");
    const slug = new URL(link).pathname.split("/").filter(Boolean).pop() ?? link;

    posts.push({
      title,
      slug,
      publishedAt: pub.toISOString().slice(0, 10),
      excerpt: tagValues(item, "description")[0] ?? "",
      tags: categories.length ? categories : ["Substack"],
      thumbnail: enclosure ? decodeEntities(enclosure) : DEFAULT_THUMBNAIL,
      status: "published",
      externalUrl: link,
    });
  }
  return posts;
}

/** Posts from the Substack RSS feed. Never throws: returns [] if the feed is unavailable. */
export async function getSubstackSidequests(): Promise<Sidequest[]> {
  try {
    const res = await fetch(`${SUBSTACK_URL}/feed`, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio-feed-reader)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return parseFeed(await res.text());
  } catch (err) {
    console.warn("[substack] feed unavailable, showing local posts only:", err);
    return [];
  }
}
