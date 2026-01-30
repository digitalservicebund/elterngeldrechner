import { Temporal } from "@js-temporal/polyfill";

export function vorherigesJahr(
  monat: Temporal.PlainYearMonth,
): Temporal.PlainYearMonth {
  return monat.subtract({ years: 1 });
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("vorherigesJahr", () => {
    it("soll das vorherige Jahr zurückgeben", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2024, month: 3 });
      const vorherigesJahrResult = vorherigesJahr(monat);
      expect(vorherigesJahrResult.year).toBe(2023);
      expect(vorherigesJahrResult.month).toBe(3);
    });
  });
}
