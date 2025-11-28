import {
  Ausklammerung,
  istAusklammerungInJahr,
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

export function berechneBemessungszeitraum<
  T extends BerechneBemessungszeitraumOptions,
>(options: T): BerechneBemessungszeitraumResult<T> {
  const { geburtsdatum, erwerbstaetigkeit, ausklammerungen } = options;

  switch (erwerbstaetigkeit) {
    case "Selbstaendig": {
      const startJahr = new Date(
        Date.UTC(geburtsdatum.getFullYear() - 1, 0, 1),
      );

      const bemessungsjahr = findBemessungsjahr(startJahr, ausklammerungen);

      return [
        {
          von: bemessungsjahr,
          bis: new Date(Date.UTC(bemessungsjahr.getUTCFullYear(), 11, 1)),
        },
      ] as BerechneBemessungszeitraumResult<T>;
    }
    case "Nicht-Selbstaendig": {
      const geburtsmonat = new Date(
        Date.UTC(geburtsdatum.getFullYear(), geburtsdatum.getUTCMonth(), 1),
      );

      const monate = findBemessungsmonate(
        vorherigerMonat(geburtsmonat),
        ausklammerungen,
      );

      const zeitraeume = gruppiereMonateInZeitraeume(monate);

      return zeitraeume as BerechneBemessungszeitraumResult<T>;
    }
  }
}

function findBemessungsjahr(
  jahr: Date,
  ausklammerungen: readonly Ausklammerung[],
): Date {
  const hasAusklammerung = istAusklammerungInJahr(
    jahr.getUTCFullYear(),
    ausklammerungen,
  );

  if (hasAusklammerung) {
    const vorherigesJahr = new Date(Date.UTC(jahr.getUTCFullYear() - 1, 0, 1));

    return findBemessungsjahr(vorherigesJahr, ausklammerungen);
  }

  return jahr;
}

function findBemessungsmonate(
  monat: Date,
  ausklammerungen: readonly Ausklammerung[],
  monatSammlung: Date[] = [],
): Date[] {
  if (monatSammlung.length >= 12) {
    return monatSammlung;
  }

  const istAusklammerung = istAusklammerungInMonat(monat, ausklammerungen);

  return findBemessungsmonate(
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
    const vorherigeGruppe = gruppen[gruppen.length - 1];

    if (vorherigeGruppe) {
      const letzterMonat = vorherigeGruppe[vorherigeGruppe.length - 1];

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
      it("returns the 12 months before the Geburtsmonat as Bemessungszeitraum without Ausklamerungen", () => {
        const bemessungszeitraum = berechneBemessungszeitraum({
          geburtsdatum: new Date("2025-10-15T00:00:00.000Z"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [],
        });

        expect(bemessungszeitraum).toEqual([
          {
            von: new Date("2024-10-01T00:00:00.000Z"),
            bis: new Date("2025-09-01T00:00:00.000Z"),
          },
        ]);
      });

      it("returns the 12 months before the Geburtsmonat but the Ausklammerung as Bemessungszeitraum", () => {
        const bemessungszeitraum = berechneBemessungszeitraum({
          geburtsdatum: new Date("2025-10-15T00:00:00.000Z"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [
            {
              von: new Date("2025-05-01T00:00:00.000Z"),
              bis: new Date("2025-05-12T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
          ],
        });

        expect(bemessungszeitraum).toEqual([
          {
            von: new Date("2024-09-01T00:00:00.000Z"),
            bis: new Date("2025-04-01T00:00:00.000Z"),
          },
          {
            von: new Date("2025-06-01T00:00:00.000Z"),
            bis: new Date("2025-09-01T00:00:00.000Z"),
          },
        ]);
      });

      it("returns the correct 12 months even if Ausklammerung spans multiple months", () => {
        const bemessungszeitraum = berechneBemessungszeitraum({
          geburtsdatum: new Date("2025-10-15T00:00:00.000Z"),
          erwerbstaetigkeit: "Nicht-Selbstaendig",
          ausklammerungen: [
            {
              von: new Date("2025-05-01T00:00:00.000Z"),
              bis: new Date("2025-06-12T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
          ],
        });

        expect(bemessungszeitraum).toEqual([
          {
            von: new Date("2024-08-01T00:00:00.000Z"),
            bis: new Date("2025-04-01T00:00:00.000Z"),
          },
          {
            von: new Date("2025-07-01T00:00:00.000Z"),
            bis: new Date("2025-09-01T00:00:00.000Z"),
          },
        ]);
      });
    });

    describe("selbstaendig", () => {
      it("returns the full previous year as Bemessungszeitraum without Ausklamerungen", () => {
        const bemessungszeitraum = berechneBemessungszeitraum({
          geburtsdatum: new Date("2025-10-15T00:00:00.000Z"),
          erwerbstaetigkeit: "Selbstaendig",
          ausklammerungen: [],
        });

        expect(bemessungszeitraum).toEqual([
          {
            von: new Date("2024-01-01T00:00:00.000Z"),
            bis: new Date("2024-12-01T00:00:00.000Z"),
          },
        ]);
      });

      it("returns the year t-3 as the Bemessungszeitraum when Ausklammerungen apply in both the previous year and the year before that", () => {
        const bemessungszeitraum = berechneBemessungszeitraum({
          geburtsdatum: new Date("2025-10-15T00:00:00.000Z"),
          erwerbstaetigkeit: "Selbstaendig",
          ausklammerungen: [
            {
              von: new Date("2024-05-02T00:00:00.000Z"),
              bis: new Date("2024-05-03T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
            {
              von: new Date("2023-05-02T00:00:00.000Z"),
              bis: new Date("2023-05-03T00:00:00.000Z"),
              beschreibung: "Krankheit",
            },
          ],
        });

        expect(bemessungszeitraum).toEqual([
          {
            von: new Date("2022-01-01T00:00:00.000Z"),
            bis: new Date("2022-12-01T00:00:00.000Z"),
          },
        ]);
      });
    });
  });
}
