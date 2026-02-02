import { Temporal } from "@js-temporal/polyfill";

import type { Ausklammerung } from "./Ausklammerung";
import type { Zeitraum } from "./Zeitraum";

type GruppiereBemessungszeitraumOptions = {
  bemessungszeitraum: Zeitraum[];
  ausklammerungen: Ausklammerung[];
};

type GruppiereBemessungszeitraumResult = Array<
  Temporal.PlainYearMonth[] | Ausklammerung
>;

/**
 * Diese Funktion transformiert den Bemessungszeitraum (BMZ) in eine
 * kombinierte chronologische Darstellung, bei der zusätzlich zu den relevanten
 * Zeiträumen für den BMZ ebenso die betrachteten Ausklammerungen inkludiert sind.
 *
 * Der Algorithmus fächert den BMZ in die einzelnen Monate auf und sortiert sie
 * gemeinsam mit den Ausklammerungen in ein Array ein.
 *
 * Beispiel Eingabe
 * Bemessungszeitraum: [{Jan bis Mar}, {May bis Jun}]
 * Ausklammerungen: [{5. Apr bis 7. Apr mit Grund X}]
 *
 * Beispiel Ausgabe
 * [[Jan, Feb, Mar], {5. Apr bis 7. Apr mit Grund X}, [May, Jun]]
 */
export function gruppiereBemessungszeitraum(
  options: GruppiereBemessungszeitraumOptions,
): GruppiereBemessungszeitraumResult {
  const { bemessungszeitraum, ausklammerungen } = options;

  const monatsgruppen: Temporal.PlainYearMonth[][] =
    bemessungszeitraum.map(generiereMonate);

  const elementeMitSchluessel = [
    ...monatsgruppen
      .filter((gruppe) => gruppe.length > 0)
      .map((gruppe) => ({
        wert: gruppe,
        typ: "monate" as const,
        sortierMonat: gruppe[0]!,
      })),
    ...ausklammerungen.map((ausklammerung) => ({
      wert: ausklammerung,
      typ: "ausklammerung" as const,
      sortierMonat: Temporal.PlainYearMonth.from({
        year: ausklammerung.von.year,
        month: ausklammerung.von.month,
      }),
    })),
  ];

  const sortierteElemente = elementeMitSchluessel.sort((a, b) =>
    Temporal.PlainYearMonth.compare(a.sortierMonat, b.sortierMonat),
  );

  return sortierteElemente.map((element) => element.wert);
}

function generiereMonate(zeitraum: Zeitraum): Temporal.PlainYearMonth[] {
  return generiereMonateRekursiv(zeitraum.von, zeitraum.bis);
}

function generiereMonateRekursiv(
  startMonat: Temporal.PlainYearMonth,
  endMonat: Temporal.PlainYearMonth,
): Temporal.PlainYearMonth[] {
  if (Temporal.PlainYearMonth.compare(startMonat, endMonat) > 0) {
    return [];
  }

  const weitereMonate = generiereMonateRekursiv(
    startMonat.add({ months: 1 }),
    endMonat,
  );

  return [startMonat, ...weitereMonate];
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("gruppiereBemessungszeitraum", () => {
    it("fans out the Monate of a Bemessungszeitraum", () => {
      const bemessungszeitraum = [
        {
          von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
          bis: Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
        },
      ];

      const result = gruppiereBemessungszeitraum({
        bemessungszeitraum,
        ausklammerungen: [],
      });

      expect(result).toEqual([
        [
          Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 2 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 3 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 4 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 5 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 6 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 7 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 8 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 9 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 10 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 11 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
        ],
      ]);
    });

    it("inserts the dividing Ausklammerung in between the groups of Monate", () => {
      const bemessungszeitraum = [
        {
          von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
          bis: Temporal.PlainYearMonth.from({ year: 2024, month: 6 }),
        },
        {
          von: Temporal.PlainYearMonth.from({ year: 2024, month: 8 }),
          bis: Temporal.PlainYearMonth.from({ year: 2025, month: 1 }),
        },
      ];

      const ausklammerungen: Ausklammerung[] = [
        {
          von: Temporal.PlainDate.from({ year: 2024, month: 7, day: 5 }),
          bis: Temporal.PlainDate.from({ year: 2024, month: 7, day: 7 }),
          beschreibung: "Krankheit",
        },
      ];

      const result = gruppiereBemessungszeitraum({
        bemessungszeitraum,
        ausklammerungen,
      });

      expect(result).toEqual([
        [
          Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 2 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 3 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 4 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 5 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 6 }),
        ],
        {
          von: Temporal.PlainDate.from({ year: 2024, month: 7, day: 5 }),
          bis: Temporal.PlainDate.from({ year: 2024, month: 7, day: 7 }),
          beschreibung: "Krankheit",
        },
        [
          Temporal.PlainYearMonth.from({ year: 2024, month: 8 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 9 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 10 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 11 }),
          Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
          Temporal.PlainYearMonth.from({ year: 2025, month: 1 }),
        ],
      ]);
    });
  });
}
