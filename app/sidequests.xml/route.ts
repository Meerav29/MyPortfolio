import { NextResponse } from "next/server";
import { getAllSidequests } from "@/lib/sidequests";
import { generateSidequestsRss } from "@/lib/rss";

export async function GET() {
  const posts = getAllSidequests();
  const xml = generateSidequestsRss(posts);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
