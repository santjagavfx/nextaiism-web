"use client";

import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { languageCookie, languages, localeCookieMaxAge } from "../i18n/locales.mjs";
import { isTheme, themeKey, themeMaxAge } from "./theme";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  document.cookie = `${themeKey}=${theme}; Path=/; Max-Age=${themeMaxAge}; SameSite=Lax`;
}

type Labels = { locale: string; home: string; navigation: string; theme: string; language: string; titles: Record<string, string> };

export function SiteHeader({ locale, home, navigation, theme, language, titles }: Labels) {
  const pathname = usePathname();
  const router = useRouter();
  useLayoutEffect(() => {
    if (document.documentElement.dataset.theme) return;
    try {
      const savedTheme = localStorage.getItem(themeKey) ?? undefined;
      if (isTheme(savedTheme)) applyTheme(savedTheme);
    } catch {
      // The system theme remains active when browser storage is unavailable.
    }
  }, []);
  const links = [
    { href: `/${locale}`, title: home },
    ...Object.entries(titles).map(([slug, title]) => ({ href: `/${locale}/${slug}`, title })),
  ];

  function switchLanguage(nextLocale: string) {
    const path = pathname.slice(locale.length + 1);
    const destination = path.startsWith("/publications/") &&
      !document.head.querySelector(`link[rel="alternate"][hreflang="${nextLocale}"]`)
      ? "/publications" : path;
    document.cookie = `${languageCookie}=${nextLocale}; Path=/; Max-Age=${localeCookieMaxAge}; SameSite=Lax`;
    router.push(`/${nextLocale}${destination}${window.location.search}${window.location.hash}`);
  }

  function toggleTheme() {
    const root = document.documentElement;
    const dark = getComputedStyle(root).colorScheme === "dark";
    const theme = dark ? "light" : "dark";
    applyTheme(theme);
    try {
      localStorage.setItem(themeKey, theme);
    } catch {
      // The current page still reflects the selection without storage.
    }
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href={`/${locale}`} className="brand">
          <Image className="brand-mark" src="/logos/nextaiism.svg" alt="" width={28} height={28} loading="eager" unoptimized />
          NextAIism
        </Link>
        <nav aria-label={navigation}>
          {links.map(({ href, title }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{title}</Link>
          ))}
        </nav>
        <div className="header-actions">
        <select className="language-select" aria-label={language} value={locale} onChange={(event) => switchLanguage(event.target.value)}>
          {Object.entries(languages).map(([code, label]) => <option key={code} value={code} lang={code}>{label}</option>)}
        </select>
        <button className="theme-button" onClick={toggleTheme} type="button" aria-label={theme} title={theme}>
          <span className="sun" aria-hidden="true">☼</span><span className="moon" aria-hidden="true">☾</span>
        </button>
        </div>
      </div>
    </header>
  );
}
