export function establishDataLayer(): void {
  const timeNow = Date.now();
  window._mtm = window._mtm || [];
  window._mtm[0] = { event: "mtm.Start", "mtm.startTime": timeNow };
}

/**
 * Set a new or updates the value of a tracking variable. The variable will be made
 * available for triggered events by tags of the tag manager.
 */
export function setTrackingVariable(name: string, value?: unknown): void {
  if (window._mtm) {
    window._mtm.push({ [name]: value });
  }
}

export function getTrackingVariable<T>(name: string): T | null {
  if (window._mtm) {
    return getTrackingVariableFrom(window._mtm, name);
  } else {
    return null;
  }
}

export function getTrackingVariableFrom<T>(
  dataLayer: Record<string, unknown>[],
  name: string,
): T | null {
  const lastElement = dataLayer.findLast((it) => it[name] !== undefined);
  const lastElementsProperty = lastElement?.[name];

  return lastElementsProperty ? (lastElementsProperty as T) : null;
}

declare global {
  interface Window {
    _mtm?: Record<string, unknown>[];
  }
}

if (import.meta.vitest) {
  const { describe, beforeAll, it, expect } = import.meta.vitest;

  describe("getTrackingVariable", () => {
    beforeAll(() => establishDataLayer());

    it("returns the last variable even if it is null", () => {
      setTrackingVariable("my-var", 0);
      setTrackingVariable("my-var", 5);
      setTrackingVariable("my-var", 6);
      setTrackingVariable("my-var", null);

      expect(getTrackingVariable("my-var")).toBeNull();
    });

    it("returns the last variable ", () => {
      setTrackingVariable("my-var", 5);
      setTrackingVariable("my-var", 6);

      expect(getTrackingVariable("my-var")).toEqual(6);
    });
  });
}
