import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, languageCookie, localeCookieMaxAge, locales } from "./i18n/locales.mjs";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];
  const saved = request.cookies.get(languageCookie)?.value;
  if (locales.includes(segment)) {
    const response = NextResponse.next();
    if (saved !== segment && request.headers.get("sec-fetch-mode") === "navigate") {
      response.cookies.set(languageCookie, segment, { path: "/", sameSite: "lax", maxAge: localeCookieMaxAge });
    }
    return response;
  }
  const locale = saved && locales.includes(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, { headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } });
}

export const config = { matcher: "/((?!_next|.*\\..*).*)" };
