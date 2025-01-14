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

/**
 * Parses the encoded document cookie string as a map to read from. This is
 * a work-around till the CookieManager API is well supported by all major
 * web-browsers.
 *
 * @returns map of cookie names to their value
 */
function getCookies(): Record<string, string | undefined> {
  return document.cookie
    .split(";")
    .map((rawKeyValuePair) => rawKeyValuePair.split("="))
    .filter((pair) => isTuple(pair, isString))
    .reduce(
      (cookieMap, [name, value]) => ({ ...cookieMap, [name.trim()]: value }),
      {},
    );
}

type Tuple<T> = [T, T];

function isTuple<T>(
  value: unknown,
  genericTypeGuard: (value: unknown) => value is T,
): value is Tuple<T> {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    genericTypeGuard(value[0]) &&
    genericTypeGuard(value[1])
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
