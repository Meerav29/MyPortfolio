import { research } from "@/data/research";
import ResearchPageClient from "./ResearchPageClient";

export const metadata = {
  title: "Research — Meerav Shah",
  description: "Selected research outputs and publications by Meerav Shah.",
};

export default function Page() {
  return <ResearchPageClient items={research} />;
}
