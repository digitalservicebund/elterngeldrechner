import { Temporal } from "@js-temporal/polyfill";

import type { Ausklammerung } from "./Ausklammerung";
import type { Zeitraum } from "./Zeitraum";

import { findeJahrOhneAusklammerung } from "./vergleicheAusklammerung";

/**
 * Diese Funktion berechnet den Betrachtungszeitraum anhand des Geburtsdatums und aller
 * Ausklammerungen. Die Funktion erstellt ein Zeitraum-Objekt, welches mit dem Start
 * des ersten Jahres, in dem keine Ausklammerung zutrifft, beginnt und mit dem
 * Geburtsmonat abschließt.
 */
export function berechneBetrachtungszeitraum(
  geburtsdatum: Temporal.PlainDate,
  ausklammerungen: Ausklammerung[],
): Zeitraum<Temporal.PlainDate> {
  const startJahr = findeJahrOhneAusklammerung(
    geburtsdatum.subtract({ years: 1 }).toPlainYearMonth(),
    ausklammerungen,
  );

  return {
    von: Temporal.PlainDate.from({ year: startJahr.year, month: 1, day: 1 }),
    bis: geburtsdatum,
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechneBetrachtungszeitraum", () => {
    it("finds the previous calendar year as Betrachtungszeitraum if given no Ausklammerungen", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const ausklammerungen: Ausklammerung[] = [];

      const betrachtungszeitraum = berechneBetrachtungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(
        betrachtungszeitraum.von.equals(
          Temporal.PlainDate.from({ year: 2024, month: 1, day: 1 }),
        ),
      ).toBe(true);
      expect(
        betrachtungszeitraum.bis.equals(
          Temporal.PlainDate.from({ year: 2025, month: 10, day: 15 }),
        ),
      ).toBe(true);
    });

    it("finds the first calendar year that no Ausklammerungen can be applied to", () => {
      const geburtsdatum = Temporal.PlainDate.from("2025-10-15");
      const ausklammerungen: Ausklammerung[] = [
        {
          von: Temporal.PlainDate.from({ year: 2024, month: 5, day: 1 }),
          bis: Temporal.PlainDate.from({ year: 2024, month: 5, day: 12 }),
          grund: "Test",
        },
        {
          von: Temporal.PlainDate.from({ year: 2022, month: 3, day: 3 }),
          bis: Temporal.PlainDate.from({ year: 2022, month: 3, day: 9 }),
          grund: "Test",
        },
      ];

      const betrachtungszeitraum = berechneBetrachtungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(
        betrachtungszeitraum.von.equals(
          Temporal.PlainDate.from({ year: 2023, month: 1, day: 1 }),
        ),
      ).toBe(true);
      expect(
        betrachtungszeitraum.bis.equals(
          Temporal.PlainDate.from({ year: 2025, month: 10, day: 15 }),
        ),
      ).toBe(true);
    });
  });
}
