import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NextAIism — Living AI Laboratory", template: "%s · NextAIism" },
  description: "A living laboratory for exploring what humans and AI can create together.",
};

const restoreTheme = `try {
  const theme = localStorage.getItem("nextaiism-theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: restoreTheme }} /></head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <footer className="shell site-footer">
          <span className="brand">NextAIism</span>
          <span>Living AI Laboratory</span>
        </footer>
      </body>
    </html>
  );
}
