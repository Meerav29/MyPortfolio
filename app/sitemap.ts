import type { MetadataRoute } from "next";
import { getAllSidequests } from "@/lib/sidequests";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://meeravshah.vercel.app";
  const posts = getAllSidequests();
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
