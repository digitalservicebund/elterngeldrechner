import { getTrackingVariable, setTrackingVariable } from "./data-layer";

export function countUpAnzahlGeoeffneterLebensmonateImPlaner(): void {
  const currentCount = getTrackingVariable<number>(TRACKING_VARIABLE_NAME) ?? 0;
  setTrackingVariable(TRACKING_VARIABLE_NAME, currentCount + 1);
}

const TRACKING_VARIABLE_NAME = "anzahlGeoeffneterLebensmonateImPlaner";

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  vi.mock(import("./data-layer"));

  describe("count up Anzahl geöffneter Lebensmonate im Planer", () => {
    it("starts with count 1 on the first call", () => {
      vi.mocked(getTrackingVariable).mockImplementation((name) =>
        name === "anzahlGeoeffneterLebensmonateImPlaner" ? null : "nope",
      );

      countUpAnzahlGeoeffneterLebensmonateImPlaner();

      expect(setTrackingVariable).toHaveBeenCalledOnce();
      expect(setTrackingVariable).toHaveBeenCalledWith(
        "anzahlGeoeffneterLebensmonateImPlaner",
        1,
      );
    });

    it("increases the count by one for each call", () => {
      vi.mocked(getTrackingVariable).mockImplementation((name) =>
        name === "anzahlGeoeffneterLebensmonateImPlaner" ? 2 : "nope",
      );

      countUpAnzahlGeoeffneterLebensmonateImPlaner();

      expect(setTrackingVariable).toHaveBeenCalledOnce();
      expect(setTrackingVariable).toHaveBeenCalledWith(
        "anzahlGeoeffneterLebensmonateImPlaner",
        3,
      );
    });
  });
}
