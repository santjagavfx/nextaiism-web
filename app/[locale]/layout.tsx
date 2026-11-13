import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "../site-header";
import { sectionSlugs } from "../sections";
import { locales } from "../../i18n/locales.mjs";
import "../globals.css";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = await getTranslations({ locale });
  return {
    metadataBase: new URL(process.env.NEXTAIISM_SITE_URL ?? "http://localhost:3000"),
    title: { default: `NextAIism — ${t("ui.labName")}`, template: "%s · NextAIism" },
    description: t("ui.lede"),
    icons: { icon: { url: "/logos/nextaiism.svg#favicon", type: "image/svg+xml", sizes: "any" } },
  };
}

const restoreTheme = `try {
  const theme = localStorage.getItem("nextaiism-theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {}`;

export default async function RootLayout({ children, params }: Props & { children: ReactNode }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = await getTranslations({ locale });
  return (
    <html lang={locale} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: restoreTheme }} /></head>
      <body>
        <a className="skip-link" href="#main">{t("ui.skip")}</a>
        <SiteHeader locale={locale} home={t("ui.home")} navigation={t("ui.nav")} theme={t("ui.theme")}
          language={t("ui.language")} titles={Object.fromEntries(sectionSlugs.map((slug) => [slug, t(`sections.${slug}.title`)]))} />
        <main id="main">{children}</main>
        <footer className="shell site-footer">
          <span className="brand">NextAIism</span>
          <span>{t("ui.labName")}</span>
        </footer>
      </body>
    </html>
  );
}
