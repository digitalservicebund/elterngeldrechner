/**
 * Reads the value of a cookie with given name. If there is not such cookie
 * set yet, this function will wait and poll the cookies till it was set.
 *
 * @param name of the cookie
 * @param pollingInterval milliseconds between polls
 */
export function waitForCookieValue(
  name: string,
  pollingInterval: number,
): Promise<string> {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const value = getCookies()[name];

      if (value !== undefined) {
        clearInterval(intervalId);
        resolve(value);
      }
    }, pollingInterval);
  });
}

// Parses the document cookie string into a lookup map. This is a workaround
// for browsers that predate the CookieStore API (Baseline 2025).
function getCookies(): Record<string, string | undefined> {
  return document.cookie
    .split(cookieDelimiter)
    .flatMap(splitCookiePair)
    .reduce((acc, [name, value]) => ({ ...acc, [name.trim()]: value }), {});
}

// RFC 6265 §4.2.1 uses "; " as delimiter, but browsers may omit the space.
const cookieDelimiter = ";";

// RFC 6265 §5.2 splits a cookie pair on the first "=" only; any further "="
// belongs to the value.
function splitCookiePair(pair: string): [] | [[string, string]] {
  const index = pair.indexOf("=");

  return index === -1 ? [] : [[pair.slice(0, index), pair.slice(index + 1)]];
}

if (import.meta.vitest) {
  const { describe, afterEach, it, expect, vi } = import.meta.vitest;

  describe("waitForCookieValue", () => {
    afterEach(() => vi.restoreAllMocks());

    it("reads a per-tool consent value stored unencoded with raw '='", async () => {
      vi.spyOn(document, "cookie", "get").mockReturnValue(
        "cookie-allow-tracking=matomo=1,posthog=1",
      );

      const value = await waitForCookieValue("cookie-allow-tracking", 1);

      expect(value).toEqual("matomo=1,posthog=1");
    });

    it("reads a cookie among others regardless of its position", async () => {
      vi.spyOn(document, "cookie", "get").mockReturnValue(
        "first=a; cookie-allow-tracking=matomo=1,posthog=1; last=z",
      );

      const value = await waitForCookieValue("cookie-allow-tracking", 1);

      expect(value).toEqual("matomo=1,posthog=1");
    });
  });
}
