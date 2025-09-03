"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links: Array<{ label: string; href: string }> = [
  // { label: "About", href: "/#about" },
  // { label: "Projects", href: "/#projects" },
  { label: "Research", href: "/research" },
  { label: "Experience", href: "/experience" },
  // { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex gap-6 text-sm">
      {links.map(({ label, href }) => {
        const isActive = pathname === "/experience" && href === "/experience";
        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "text-link-hover font-semibold transition-colors" : "hover:text-link-hover transition-colors"}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

