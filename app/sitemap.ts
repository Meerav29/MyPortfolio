import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://meeravshah.vercel.app/", lastModified: new Date() },
  ];
}
