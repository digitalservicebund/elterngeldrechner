import { Temporal } from "@js-temporal/polyfill";

export function naechsterMonat(
  monat: Temporal.PlainYearMonth,
): Temporal.PlainYearMonth {
  return monat.add({ months: 1 });
}

export function vorherigerMonat(
  monat: Temporal.PlainYearMonth,
): Temporal.PlainYearMonth {
  return monat.subtract({ months: 1 });
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("naechsterMonat", () => {
    it("soll den nächsten Monat zurückgeben (Normalfall)", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2024, month: 3 });
      const naechsterMonatResult = naechsterMonat(monat);

      expect(naechsterMonatResult.year).toBe(2024);
      expect(naechsterMonatResult.month).toBe(4);
    });

    it("soll den nächsten Monat zurückgeben (Jahreswechsel)", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2023, month: 12 });
      const naechsterMonatResult = naechsterMonat(monat);

      expect(naechsterMonatResult.year).toBe(2024);
      expect(naechsterMonatResult.month).toBe(1);
    });
  });

  describe("vorherigerMonat", () => {
    it("soll den vorherigen Monat zurückgeben (Normalfall)", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2024, month: 3 });
      const vorherigerMonatResult = vorherigerMonat(monat);

      expect(vorherigerMonatResult.year).toBe(2024);
      expect(vorherigerMonatResult.month).toBe(2);
    });

    it("soll den vorherigen Monat zurückgeben (Jahreswechsel)", () => {
      const monat = Temporal.PlainYearMonth.from({ year: 2024, month: 1 });
      const vorherigerMonatResult = vorherigerMonat(monat);

      expect(vorherigerMonatResult.year).toBe(2023);
      expect(vorherigerMonatResult.month).toBe(12);
    });
  });
}
