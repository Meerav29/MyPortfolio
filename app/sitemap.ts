import type { MetadataRoute } from "next";
import { getAllSidequests } from "@/lib/sidequests";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://meeravshah.vercel.app";
  // External (e.g. Substack) posts have no page on this site.
  const posts = getAllSidequests().filter((p) => !p.externalUrl);
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/research`, lastModified: new Date() },
    { url: `${base}/sidequests`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${base}/sidequests/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.publishedAt),
    })),
  ];
}
