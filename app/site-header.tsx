"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sections } from "./sections";

const links = [
  { href: "/", title: "Home" },
  ...sections.map(({ slug, title }) => ({ href: `/${slug}`, title })),
];

export function SiteHeader() {
  const pathname = usePathname();

  function toggleTheme() {
    const root = document.documentElement;
    const dark = getComputedStyle(root).colorScheme === "dark";
    const theme = dark ? "light" : "dark";
    root.dataset.theme = theme;
    try {
      localStorage.setItem("nextaiism-theme", theme);
    } catch {
      // The current page still reflects the selection without storage.
    }
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <Image className="brand-mark" src="/logos/nextaiism.svg" alt="" width={28} height={28} unoptimized />
          NextAIism
        </Link>
        <nav aria-label="Main navigation">
          {links.map(({ href, title }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{title}</Link>
          ))}
        </nav>
        <button className="theme-button" onClick={toggleTheme} type="button" aria-label="Switch color theme" title="Switch color theme">
          <span className="sun" aria-hidden="true">☼</span><span className="moon" aria-hidden="true">☾</span>
        </button>
      </div>
    </header>
  );
}
