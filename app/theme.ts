export const themeKey = "nextaiism-theme";
export const themeMaxAge = 60 * 60 * 24 * 365;

export function isTheme(value: string | undefined): value is "light" | "dark" {
  return value === "light" || value === "dark";
}
