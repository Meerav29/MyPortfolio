import Image from "next/image";
import { Linkedin, Github, ExternalLink } from "lucide-react";
import { links } from "@/lib/links";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";

export default function Header() {
  return (
    <div className="sticky top-0 w-full z-50 backdrop-blur bg-background border-b border-border">
      <nav className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between text-foreground">
        <a href="/" className="font-semibold tracking-tight text-foreground">
          Meerav Shah
        </a>
        <NavLinks />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href={links.linkedin} aria-label="LinkedIn" className="p-2 rounded-xl hover:bg-card">
            <Linkedin size={18} />
          </a>
          <a href={links.github} aria-label="GitHub" className="p-2 rounded-xl hover:bg-card">
            <Github size={18} />
          </a>
          <a href={links.notion} aria-label="Notion" className="p-2 rounded-xl hover:bg-card">
            <Image src="/notion-w.png" alt="Notion logo" width={18} height={18} className="dark:block hidden" />
            <Image src="/notion-b.png" alt="Notion logo" width={18} height={18} className="dark:hidden block" />
          </a>
          <a
            href={links.resume}
            className="inline-flex items-center gap-2 text-sm rounded-xl border border-accent px-3 py-1.5 bg-accent text-background hover:bg-link-hover"
          >
            Resume <ExternalLink size={14} />
          </a>
        </div>
      </nav>
    </div>
  );
}
