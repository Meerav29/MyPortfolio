import type { MetadataRoute } from "next";
import { getAllSidequestsWithSubstack } from "@/lib/sidequests";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://meeravshah.vercel.app";
  const posts = await getAllSidequestsWithSubstack();
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/research`, lastModified: new Date() },
    { url: `${base}/sidequests`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: p.externalUrl ?? `${base}/sidequests/${p.slug}`,
      lastModified: new Date(p.updatedAt || p.publishedAt),
    })),
  ];
}
