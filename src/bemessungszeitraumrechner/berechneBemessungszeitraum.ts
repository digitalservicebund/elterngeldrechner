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
      const startJahr = new Date(
        Date.UTC(geburtsdatum.getUTCFullYear() - 1, 0, 1),
      );

      const bemessungsjahr = findeJahrOhneAusklammerung(
        startJahr,
        ausklammerungen,
      );

      return [
        {
          von: bemessungsjahr,
          bis: new Date(Date.UTC(bemessungsjahr.getUTCFullYear(), 11, 1)),
        },
      ] as BerechneBemessungszeitraumResult<T>;
    }
    case "Nicht-Selbstaendig": {
      const geburtsmonat = new Date(
        Date.UTC(geburtsdatum.getUTCFullYear(), geburtsdatum.getUTCMonth(), 1),
      );

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
  monat: Date,
  ausklammerungen: readonly Ausklammerung[],
  monatSammlung: Date[] = [],
): Date[] {
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

function gruppiereMonateInZeitraeume(monate: Date[]): Zeitraum[] {
  if (monate.length === 0) {
    return [];
  }

  const monatsGruppen = monate.reduce((gruppen: Date[][], monat: Date) => {
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
  }, []);

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
              von: new Date("2025-10-02T00:00:00.000Z"),
              bis: new Date("2026-01-08T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: new Date("2024-10-01T00:00:00.000Z"),
              bis: new Date("2025-09-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should correctly calculate a shifted Bemessungszeitraum due to Mutterschutz",
          geburtsdatum: new Date("2026-11-11T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2026-09-30T00:00:00.000Z"),
              bis: new Date("2027-01-06T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: new Date("2025-09-01T00:00:00.000Z"),
              bis: new Date("2026-08-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should handle multiple Ausklammerungen (Mutterschutz, Krankheit) and create multiple periods",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2025-10-02T00:00:00.000Z"),
              bis: new Date("2026-01-08T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
            {
              von: new Date("2025-06-15T00:00:00.000Z"),
              bis: new Date("2025-08-02T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
          ],
          expected: [
            {
              von: new Date("2024-07-01T00:00:00.000Z"),
              bis: new Date("2025-05-01T00:00:00.000Z"),
            },
            {
              von: new Date("2025-09-01T00:00:00.000Z"),
              bis: new Date("2025-09-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should handle complex multi-year Ausklammerungen (Mutterschutz, Krankheit, Elterngeld)",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2025-10-02T00:00:00.000Z"),
              bis: new Date("2026-01-08T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
            {
              von: new Date("2025-06-15T00:00:00.000Z"),
              bis: new Date("2025-08-02T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
            {
              von: new Date("2023-10-03T00:00:00.000Z"),
              bis: new Date("2024-10-03T00:00:00.000Z"),
              beschreibung: "Elterngeld anderes Kind",
            },
          ],
          expected: [
            {
              von: new Date("2023-06-01T00:00:00.000Z"),
              bis: new Date("2023-09-01T00:00:00.000Z"),
            },
            {
              von: new Date("2024-11-01T00:00:00.000Z"),
              bis: new Date("2025-05-01T00:00:00.000Z"),
            },
            {
              von: new Date("2025-09-01T00:00:00.000Z"),
              bis: new Date("2025-09-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should handle overlapping Ausklammerungen from different children",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2025-10-02T00:00:00.000Z"),
              bis: new Date("2026-01-08T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
            {
              von: new Date("2025-06-15T00:00:00.000Z"),
              bis: new Date("2025-08-02T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
            {
              von: new Date("2023-10-03T00:00:00.000Z"),
              bis: new Date("2024-10-03T00:00:00.000Z"),
              beschreibung: "Elterngeld anderes Kind",
            },
            {
              von: new Date("2023-08-22T00:00:00.000Z"),
              bis: new Date("2023-12-14T00:00:00.000Z"),
              beschreibung: "Mutterschutz anderes Kind",
            },
          ],
          expected: [
            {
              von: new Date("2023-04-01T00:00:00.000Z"),
              bis: new Date("2023-07-01T00:00:00.000Z"),
            },
            {
              von: new Date("2024-11-01T00:00:00.000Z"),
              bis: new Date("2025-05-01T00:00:00.000Z"),
            },
            {
              von: new Date("2025-09-01T00:00:00.000Z"),
              bis: new Date("2025-09-01T00:00:00.000Z"),
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
              von: new Date("2022-12-01T00:00:00.000Z"),
              bis: new Date("2023-11-01T00:00:00.000Z"),
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

        expect(bemessungszeitraum).toEqual(expected);
      });
    });

    describe("selbstaendig", () => {
      const testCases = [
        {
          name: "should return the previous year if Mutterschutz does not affect it",
          geburtsdatum: new Date("2025-11-13T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2025-10-02T00:00:00.000Z"),
              bis: new Date("2026-01-08T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: new Date("2024-01-01T00:00:00.000Z"),
              bis: new Date("2024-12-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should skip a year with Mutterschutz and return the year before",
          geburtsdatum: new Date("2026-01-01T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2025-11-20T00:00:00.000Z"),
              bis: new Date("2026-02-26T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: new Date("2024-01-01T00:00:00.000Z"),
              bis: new Date("2024-12-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should return the previous year if Mutterschutz starts in the year of birth",
          geburtsdatum: new Date("2026-02-12T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2026-01-01T00:00:00.000Z"),
              bis: new Date("2026-04-09T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: new Date("2025-01-01T00:00:00.000Z"),
              bis: new Date("2025-12-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should skip a year with Krankheit and return the year before",
          geburtsdatum: new Date("2026-02-12T00:00:00.000Z"),
          ausklammerungen: [
            {
              von: new Date("2025-08-01T00:00:00.000Z"),
              bis: new Date("2025-08-31T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
            {
              von: new Date("2026-01-01T00:00:00.000Z"),
              bis: new Date("2026-04-09T00:00:00.000Z"),
              beschreibung: "Mutterschutz",
            },
          ],
          expected: [
            {
              von: new Date("2024-01-01T00:00:00.000Z"),
              bis: new Date("2024-12-01T00:00:00.000Z"),
            },
          ],
        },
        {
          name: "should determine the correct assessment year on new years eve (local vs utc year)",
          geburtsdatum: new Date("2023-12-31T23:00:00.000Z"),
          ausklammerungen: [],
          expected: [
            {
              von: new Date("2022-01-01T00:00:00.000Z"),
              bis: new Date("2022-12-01T00:00:00.000Z"),
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

        expect(bemessungszeitraum).toEqual(expected);
      });
    });
  });
}
