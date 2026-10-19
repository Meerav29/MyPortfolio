import { Sidequest } from "./sidequests";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Generate RSS XML for sidequests */
export function generateSidequestsRss(posts: Sidequest[]) {
  const items = posts
    .slice(0, 30)
    .map((p) => `\n    <item>\n      <title>${esc(p.title)}</title>\n      <link>${esc(p.externalUrl ?? `https://meeravshah.vercel.app/sidequests/${p.slug}`)}</link>\n      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>\n      <description>${esc(p.excerpt)}</description>\n    </item>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Sidequests — Meerav Shah</title>\n    <link>https://meeravshah.vercel.app/sidequests</link>\n    <description>Explorations off the main path.</description>${items}\n  </channel>\n</rss>`;
}
