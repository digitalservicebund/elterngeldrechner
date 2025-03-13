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
  window._mtm?.push({ [name]: value });
}

export function getTrackingVariable<T>(name: string): T | null {
  return window._mtm ? getTrackingVariableFrom(window._mtm, name) : null;
}

export function getTrackingVariableFrom<T>(
  dataLayer: Record<string, unknown>[],
  name: string,
): T | null {
  const lastElement = dataLayer.findLast((it) => it[name] !== undefined);
  const lastElementsProperty = lastElement?.[name];

  return lastElementsProperty ? (lastElementsProperty as T) : null;
}

export function pushCustomEvent(name: string): void {
  window._mtm?.push({ event: name });
}

declare global {
  interface Window {
    _mtm?: Record<string, unknown>[];
  }
}

if (import.meta.vitest) {
  const { describe, beforeAll, it, expect } = import.meta.vitest;

  describe("data layer", () => {
    beforeAll(() => establishDataLayer());

    describe("setTrackingVariable", () => {
      it("appends an entry to the data layer with the variable name as key and the value", () => {
        window._mtm = [{ "variable-a": 1 }];

        setTrackingVariable("variable-b", 2);

        expect(window._mtm).toStrictEqual([
          { "variable-a": 1 },
          { "variable-b": 2 },
        ]);
      });
    });

    describe("getTrackingVariable", () => {
      it("gets the right variable from the data layer", () => {
        window._mtm = [
          { "variable-a": 1 },
          { "variable-b": 2 },
          { "variable-c": 3 },
        ];

        const value = getTrackingVariable("variable-b");

        expect(value).toBe(2);
      });

      it("gets the last entry of the variable", () => {
        window._mtm = [
          { "variable-a": 1 },
          { "variable-b": 2 },
          { "variable-a": 3 },
        ];

        const value = getTrackingVariable("variable-a");

        expect(value).toBe(3);
      });

      it("returns the last variable even if it is null", () => {
        window._mtm = [
          { "variable-a": 1 },
          { "variable-b": 2 },
          { "variable-a": null },
        ];

        const value = getTrackingVariable("variable-a");

        expect(value).toBe(null);
      });
    });

    describe("pushCustomEvent", () => {
      it("appends an entry to the data layer with the event keyword and the event name as value", () => {
        window._mtm = [{ "variable-a": 1 }];

        pushCustomEvent("test-event");

        expect(window._mtm).toStrictEqual([
          { "variable-a": 1 },
          { event: "test-event" },
        ]);
      });
    });
  });
}
