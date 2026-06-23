"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/sidequests" },
];

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
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-medium tracking-tight text-foreground">
          Meerav Shah
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          ref={buttonRef}
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setOpen((p) => !p)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div
          ref={menuRef}
          id="mobile-nav"
          className="md:hidden border-t border-border bg-background"
        >
          <div className="mx-auto max-w-3xl px-6 py-4 flex flex-col gap-4">
            {NAV.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted hover:text-foreground py-1 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
