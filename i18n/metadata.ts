import { defaultLocale, locales } from "./locales.mjs";

export function alternateUrls(locale: string, path = "", available = locales) {
  const languages = Object.fromEntries(available.map((language) => [language, `/${language}${path}`]));
  return {
    canonical: languages[locale],
    languages: { ...languages, "x-default": languages[defaultLocale] ?? languages[available[0]] },
  };
}
