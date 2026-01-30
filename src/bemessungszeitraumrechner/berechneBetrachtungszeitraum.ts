import { Temporal } from "@js-temporal/polyfill";

import { Ausklammerung, findeJahrOhneAusklammerung } from "./ausklammerung";
import { Zeitraum, vorherigesJahr } from "./zeitraum";

/**
 * Diese Funktion berechnet den Betrachtungszeitraum anhand des Geburtsdatums und aller
 * Ausklammerungen. Die Funktion erstellt ein Zeitraum-Objekt, welches mit dem Start
 * des ersten Jahres, in dem keine Ausklammerung zutrifft, beginnt und mit dem
 * Geburtsmonat abschließt.
 */
export function berechneBetrachtungszeitraum(
  geburtsdatum: Date,
  ausklammerungen: Ausklammerung[],
): Zeitraum {
  const geburtsmonat = Temporal.PlainYearMonth.from({
    year: geburtsdatum.getUTCFullYear(),
    month: geburtsdatum.getUTCMonth() + 1,
  });

  const startJahr = findeJahrOhneAusklammerung(
    vorherigesJahr(geburtsmonat),
    ausklammerungen,
  );

  return {
    von: Temporal.PlainYearMonth.from({ year: startJahr.year, month: 1 }),
    bis: geburtsmonat,
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechneBetrachtungszeitraum", () => {
    it("finds the previous calendar year as Betrachtungszeitraum if given no Ausklammerungen", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const ausklammerungen: Ausklammerung[] = [];

      const betrachtungszeitraum = berechneBetrachtungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(
        betrachtungszeitraum.von.equals(
          Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
        ),
      ).toBe(true);
      expect(
        betrachtungszeitraum.bis.equals(
          Temporal.PlainYearMonth.from({ year: 2025, month: 10 }),
        ),
      ).toBe(true);
    });

    it("finds the first calendar year that no Ausklammerungen can be applied to", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const ausklammerungen: Ausklammerung[] = [
        {
          von: Temporal.PlainDate.from({ year: 2024, month: 5, day: 1 }),
          bis: Temporal.PlainDate.from({ year: 2024, month: 5, day: 12 }),
          beschreibung: "Test",
        },
        {
          von: Temporal.PlainDate.from({ year: 2022, month: 3, day: 3 }),
          bis: Temporal.PlainDate.from({ year: 2022, month: 3, day: 9 }),
          beschreibung: "Test",
        },
      ];

      const betrachtungszeitraum = berechneBetrachtungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(
        betrachtungszeitraum.von.equals(
          Temporal.PlainYearMonth.from({ year: 2023, month: 1 }),
        ),
      ).toBe(true);
      expect(
        betrachtungszeitraum.bis.equals(
          Temporal.PlainYearMonth.from({ year: 2025, month: 10 }),
        ),
      ).toBe(true);
    });
  });
}
