// Add exact, separately hosted HTTPS origins after administrator review.
export const approvedFrameOrigins = [];
export const approvedExternalLaunchOrigins = [];

export function approvedHttpsUrl(value, origins) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password && origins.includes(url.origin)) {
      return url.href;
    }
  } catch {
    return undefined;
  }
}
