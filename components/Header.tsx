"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Linkedin, Github, ExternalLink, Menu, X } from "lucide-react";
import { links } from "@/lib/links";
import ThemeToggle from "./ThemeToggle";
import NavLinks, { navLinks } from "./NavLinks";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function trapFocus(e: KeyboardEvent) {
      if (!open || !menuRef.current) return;
      const focusable = menuRef.current.querySelectorAll<HTMLElement>("a, button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      } else if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [open]);

  useEffect(() => {
    if (open) {
      const first = menuRef.current?.querySelector<HTMLElement>("a, button");
      first?.focus();
    }
  }, [open]);

  return (
    <div className="relative sticky top-0 w-full z-50 backdrop-blur bg-background border-b border-border">
      <nav className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between text-foreground">
        <a href="/" className="font-semibold tracking-tight text-foreground">
          Meerav Shah
        </a>
        <NavLinks />
        <div className="flex items-center gap-3">
          <button
            ref={buttonRef}
            className="p-2 rounded-xl hover:bg-card md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="hidden md:flex items-center gap-3">
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
          </div>
          <a
            href={links.resume}
            className="inline-flex items-center gap-2 text-sm rounded-xl border border-accent px-3 py-1.5 bg-accent text-background hover:bg-link-hover"
          >
            Resume <ExternalLink size={14} />
          </a>
        </div>
      </nav>
      {open && (
        <div
          ref={menuRef}
          id="mobile-nav"
          className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border"
        >
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-4">
            {navLinks.map(({ label, href }) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="py-2">
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <ThemeToggle />
              <a href={links.linkedin} aria-label="LinkedIn" className="p-2 rounded-xl hover:bg-card">
                <Linkedin size={18} />
              </a>
              <a href={links.github} aria-label="GitHub" className="p-2 rounded-xl hover:bg-card">
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
