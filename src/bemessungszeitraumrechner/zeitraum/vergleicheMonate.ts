import { Temporal } from "@js-temporal/polyfill";

import { naechsterMonat } from "./manipuliereMonat";

export function istMonatFolgend(
  vormonat: Temporal.PlainYearMonth,
  folgemonat: Temporal.PlainYearMonth,
): boolean {
  return naechsterMonat(vormonat).equals(folgemonat);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("istMonatFolgend", () => {
    it("soll true zurückgeben, wenn der zweite Monat direkt auf den ersten folgt", () => {
      const ersterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 1,
      });

      const zweiterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 2,
      });

      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(true);
    });

    it("soll true zurückgeben, wenn der zweite Monat direkt auf den ersten folgt und über die Jahresgrenze geht", () => {
      const ersterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 12,
      });

      const zweiterMonat = Temporal.PlainYearMonth.from({
        year: 2025,
        month: 1,
      });

      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(true);
    });

    it("soll false zurückgeben, wenn der zweite Monat nicht direkt auf den ersten folgt (gleicher Monat)", () => {
      const ersterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 1,
      });

      const zweiterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 1,
      });

      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(false);
    });

    it("soll false zurückgeben, wenn der zweite Monat nicht direkt auf den ersten folgt (Monat davor)", () => {
      const ersterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 2,
      });

      const zweiterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 1,
      });

      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(false);
    });

    it("soll false zurückgeben, wenn der zweite Monat nicht direkt auf den ersten folgt (zwei Monate später)", () => {
      const ersterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 1,
      });

      const zweiterMonat = Temporal.PlainYearMonth.from({
        year: 2024,
        month: 3,
      });

      expect(istMonatFolgend(ersterMonat, zweiterMonat)).toBe(false);
    });
  });
}
