"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navLinks: Array<{ label: string; href: string }> = [
  { label: "Research", href: "/research" },
  { label: "Experience", href: "/experience" },
  { label: "Sidequests", href: "/sidequests" },
  { label: "Contact", href: "/#contact" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex gap-6 text-sm">
      {navLinks.map(({ label, href }) => {
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={label}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "text-link-hover font-semibold transition-colors"
                : "hover:text-link-hover transition-colors"
            }
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
