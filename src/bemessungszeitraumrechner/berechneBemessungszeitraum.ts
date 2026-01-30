import { Temporal } from "@js-temporal/polyfill";

import {
  Ausklammerung,
  findeJahrOhneAusklammerung,
  istAusklammerungInMonat,
} from "./ausklammerung";

import { Zeitraum, istMonatFolgend, vorherigerMonat } from "./zeitraum";

type BerechneBemessungszeitraumOptions = {
  geburtsdatum: Date;
  erwerbstaetigkeit: "Selbstaendig" | "Nicht-Selbstaendig";
  ausklammerungen: [] | Ausklammerung[];
};

type BerechneBemessungszeitraumResult<
  T extends BerechneBemessungszeitraumOptions,
> = T["ausklammerungen"] extends [] ? [Zeitraum] : Zeitraum[];

/**
 * Die Funktion berechnet den Bemessungszeitraum (BMZ) auf Basis des Geburtsdatums, der
 * Art der Erwerbstätigkeit und aller vorliegenden Ausklammerungen.
 * Der Algorithmus bildet die gesetzlichen Vorgaben gemäß § 2b BEEG
 * (Bundeselterngeld- und Elternzeitgesetz) ab.
 *
 * Der Algorithmus unterscheidet sich darin, dass je nach Art der Erwerbstätigkeit
 * unterschiedliche Zeiträume maßgeblich sind. Bei Selbständige ist es immer das
 * letzte abgeschlossene Kalenderjahr, in welchem keine Ausklammerung liegt.
 * Bei Nicht-Selbständige beinhaltet der BMZ die letzten 12 vollen Kalendermonate
 * vor der Geburt, exklusive solcher, in denen eine Ausklammerung vorliegt.
 *
 * Sofern keine Ausklammerungen vorliegen, ist der Rückgabewert sicher genau ein
 * Zeitraum-Objekt. Sobald mindestens eine Ausklammerung gegeben ist, wird  eine
 * Menge an Zeitraum-Objekten zurückgegeben.
 */
export function berechneBemessungszeitraum<
  T extends BerechneBemessungszeitraumOptions,
>(options: T): BerechneBemessungszeitraumResult<T> {
  const { geburtsdatum, erwerbstaetigkeit, ausklammerungen } = options;

  switch (erwerbstaetigkeit) {
    case "Selbstaendig": {
      const startJahr = Temporal.PlainYearMonth.from({
        year: geburtsdatum.getUTCFullYear() - 1,
        month: 1,
      });

      const bemessungsjahr = findeJahrOhneAusklammerung(
        startJahr,
        ausklammerungen,
      );

      return [
        {
          von: bemessungsjahr,
          bis: Temporal.PlainYearMonth.from({
            year: bemessungsjahr.year,
            month: 12,
          }),
        },
      ] as BerechneBemessungszeitraumResult<T>;
    }
    case "Nicht-Selbstaendig": {
      const geburtsmonat = Temporal.PlainYearMonth.from({
        year: geburtsdatum.getUTCFullYear(),
        month: geburtsdatum.getUTCMonth() + 1,
      });

      const monate = sammleBemessungsmonate(
        vorherigerMonat(geburtsmonat),
        ausklammerungen,
      );

      const zeitraeume = gruppiereMonateInZeitraeume(monate);

      return zeitraeume as BerechneBemessungszeitraumResult<T>;
    }
  }
}

function sammleBemessungsmonate(
  monat: Temporal.PlainYearMonth,
  ausklammerungen: readonly Ausklammerung[],
  monatSammlung: Temporal.PlainYearMonth[] = [],
): Temporal.PlainYearMonth[] {
  if (monatSammlung.length === 12) {
    return monatSammlung;
  }

  const istAusklammerung = istAusklammerungInMonat(monat, ausklammerungen);

  return sammleBemessungsmonate(
    vorherigerMonat(monat),
    ausklammerungen,
    istAusklammerung ? monatSammlung : [monat, ...monatSammlung],
  );
}

function gruppiereMonateInZeitraeume(
  monate: Temporal.PlainYearMonth[],
): Zeitraum[] {
  if (monate.length === 0) {
    return [];
  }

  const monatsGruppen = monate.reduce(
    (gruppen: Temporal.PlainYearMonth[][], monat: Temporal.PlainYearMonth) => {
      const vorherigeGruppe = gruppen.at(-1);

      if (vorherigeGruppe) {
        const letzterMonat = vorherigeGruppe.at(-1);

        if (letzterMonat && istMonatFolgend(letzterMonat, monat)) {
          vorherigeGruppe.push(monat);

          return gruppen;
        }
      }

      gruppen.push([monat]);

      return gruppen;
    },
    [],
  );

  return monatsGruppen.flatMap((gruppe) => {
    const von = gruppe[0];
    const bis = gruppe.at(-1);

    return von && bis ? [{ von, bis }] : [];
  });
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechneBemessungszeitraum", () => {
    describe("nicht-selbstaendig", () => {
      const testCases = [
        {
          name: "should exclude Mutterschutz period from the 12 months",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 10, day: 2 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 1, day: 8 }),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 10 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
            },
          ],
        },
        {
          name: "should correctly calculate a shifted Bemessungszeitraum due to Mutterschutz",
          geburtsdatum: new Date("2026-11-11T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2026, month: 9, day: 30 }),
              bis: Temporal.PlainDate.from({ year: 2027, month: 1, day: 6 }),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
              bis: Temporal.PlainYearMonth.from({ year: 2026, month: 8 }),
            },
          ],
        },
        {
          name: "should handle multiple Ausklammerungen (Mutterschutz, Krankheit) and create multiple periods",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 10, day: 2 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 1, day: 8 }),
              beschreibung: "Mutterschutz",
            },
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 6, day: 15 }),
              bis: Temporal.PlainDate.from({ year: 2025, month: 8, day: 2 }),
              beschreibung: "Krankheit",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 7 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 5 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
            },
          ],
        },
        {
          name: "should handle complex multi-year Ausklammerungen (Mutterschutz, Krankheit, Elterngeld)",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 10, day: 2 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 1, day: 8 }),
              beschreibung: "Mutterschutz",
            },
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 6, day: 15 }),
              bis: Temporal.PlainDate.from({ year: 2025, month: 8, day: 2 }),
              beschreibung: "Krankheit",
            },
            {
              von: Temporal.PlainDate.from({ year: 2023, month: 10, day: 3 }),
              bis: Temporal.PlainDate.from({ year: 2024, month: 10, day: 3 }),
              beschreibung: "Elterngeld anderes Kind",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2023, month: 6 }),
              bis: Temporal.PlainYearMonth.from({ year: 2023, month: 9 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 11 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 5 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
            },
          ],
        },
        {
          name: "should handle overlapping Ausklammerungen from different children",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 10, day: 2 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 1, day: 8 }),
              beschreibung: "Mutterschutz",
            },
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 6, day: 15 }),
              bis: Temporal.PlainDate.from({ year: 2025, month: 8, day: 2 }),
              beschreibung: "Krankheit",
            },
            {
              von: Temporal.PlainDate.from({ year: 2023, month: 10, day: 3 }),
              bis: Temporal.PlainDate.from({ year: 2024, month: 10, day: 3 }),
              beschreibung: "Elterngeld anderes Kind",
            },
            {
              von: Temporal.PlainDate.from({ year: 2023, month: 8, day: 22 }),
              bis: Temporal.PlainDate.from({ year: 2023, month: 12, day: 14 }),
              beschreibung: "Mutterschutz anderes Kind",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2023, month: 4 }),
              bis: Temporal.PlainYearMonth.from({ year: 2023, month: 7 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 11 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 5 }),
            },
            {
              von: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 9 }),
            },
          ],
        },
        {
          name: "should handle new years eve timezone edge case correctly (local vs utc year)",
          geburtsdatum: new Date("2023-12-31T23:00:00.000Z"),
          ausklammerungen: [],
          expected: [
            {
              // 12 Monate vor dem Geburtsmonat (Dez 23) -> Dez 22 bis Nov 23
              von: Temporal.PlainYearMonth.from({ year: 2022, month: 12 }),
              bis: Temporal.PlainYearMonth.from({ year: 2023, month: 11 }),
            },
          ],
        },
      ];

      it.each(testCases)("$name", (options) => {
        const { geburtsdatum, ausklammerungen, expected } = options;

        const bemessungszeitraum = berechneBemessungszeitraum({
          geburtsdatum,
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: ausklammerungen as Ausklammerung[],
        });

        expect(bemessungszeitraum).toHaveLength(expected.length);
        bemessungszeitraum.forEach((zeitraum, index) => {
          expect(zeitraum.von.equals(expected[index]!.von)).toBe(true);
          expect(zeitraum.bis.equals(expected[index]!.bis)).toBe(true);
        });
      });
    });

    describe("selbstaendig", () => {
      const testCases = [
        {
          name: "should return the previous year if Mutterschutz does not affect it",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 10, day: 2 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 1, day: 8 }),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
            },
          ],
        },
        {
          name: "should skip a year with Mutterschutz and return the year before",
          geburtsdatum: new Date("2026-01-01T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 11, day: 20 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 2, day: 26 }),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
            },
          ],
        },
        {
          name: "should return the previous year if Mutterschutz starts in the year of birth",
          geburtsdatum: new Date("2026-02-12T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2026, month: 1, day: 1 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 4, day: 9 }),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2025, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2025, month: 12 }),
            },
          ],
        },
        {
          name: "should skip a year with Krankheit and return the year before",
          geburtsdatum: new Date("2026-02-12T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: Temporal.PlainDate.from({ year: 2025, month: 8, day: 1 }),
              bis: Temporal.PlainDate.from({ year: 2025, month: 8, day: 31 }),
              beschreibung: "Krankheit",
            },
            {
              von: Temporal.PlainDate.from({ year: 2026, month: 1, day: 1 }),
              bis: Temporal.PlainDate.from({ year: 2026, month: 4, day: 9 }),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2024, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2024, month: 12 }),
            },
          ],
        },
        {
          name: "should determine the correct assessment year on new years eve (local vs utc year)",
          geburtsdatum: new Date("2023-12-31T23:00:00.000Z"),
          ausklammerungen: [],
          expected: [
            {
              von: Temporal.PlainYearMonth.from({ year: 2022, month: 1 }),
              bis: Temporal.PlainYearMonth.from({ year: 2022, month: 12 }),
            },
          ],
        },
      ];

      it.each(testCases)("$name", (options) => {
        const { geburtsdatum, ausklammerungen, expected } = options;

        const bemessungszeitraum = berechneBemessungszeitraum({
          geburtsdatum,
          erwerbstaetigkeit: "Selbstaendig",
          ausklammerungen: ausklammerungen as Ausklammerung[],
        });

        expect(bemessungszeitraum).toHaveLength(expected.length);
        bemessungszeitraum.forEach((zeitraum, index) => {
          expect(zeitraum.von.equals(expected[index]!.von)).toBe(true);
          expect(zeitraum.bis.equals(expected[index]!.bis)).toBe(true);
        });
      });
    });
  });
}
