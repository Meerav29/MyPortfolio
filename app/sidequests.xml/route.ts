import { NextResponse } from "next/server";
import { getAllSidequestsWithSubstack } from "@/lib/sidequests";
import { generateSidequestsRss } from "@/lib/rss";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllSidequestsWithSubstack();
  const xml = generateSidequestsRss(posts);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
