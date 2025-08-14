import Image from "next/image";
import { Linkedin, Github, ExternalLink } from "lucide-react";
import { links } from "@/lib/links";

export default function Header() {
  return (
    <div className="sticky top-0 w-full z-50 backdrop-blur bg-slate-950/60 border-b border-white/10">
      <nav className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between text-slate-100">
        <a href="/" className="font-semibold tracking-tight text-slate-100">
          Meerav Shah
        </a>
        <div className="hidden md:flex gap-6 text-sm">
          {[
            ["About", "/#about"],
            ["Projects", "/#projects"],
            ["Experience", "/#experience"],
            ["Skills", "/#skills"],
            ["Contact", "/#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="hover:text-blue-400 transition-colors">
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href={links.linkedin} aria-label="LinkedIn" className="p-2 rounded-xl hover:bg-slate-800">
            <Linkedin size={18} />
          </a>
          <a href={links.github} aria-label="GitHub" className="p-2 rounded-xl hover:bg-slate-800">
            <Github size={18} />
          </a>
          <a href={links.notion} aria-label="Notion" className="p-2 rounded-xl hover:bg-slate-800">
            <Image src="/notion-w.png" alt="Notion logo" width={18} height={18} />
          </a>
          <a
            href={links.resume}
            className="inline-flex items-center gap-2 text-sm rounded-xl border border-white/10 px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-200"
          >
            Resume <ExternalLink size={14} />
          </a>
        </div>
      </nav>
    </div>
  );
}
