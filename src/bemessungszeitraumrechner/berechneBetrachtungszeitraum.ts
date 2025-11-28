import { Ausklammerung, findeJahrOhneAusklammerung } from "./ausklammerung";
import { Zeitraum, vorherigesJahr } from "./zeitraum";

/**
 * Diese Funktion berechnet den Betrachtungszeitraum anhand des Geburtsdatum und aller
 * Ausklammerungen. Die Funktion erstellt ein Zeitraum Objekt, welches von dem Start
 * des ersten Jahres reicht in dem keine Ausklammerung zutrifft und mit dem
 * tatsächlichen Geburtsdatum abschließt.
 */
export function berechneBetrachtungszeitraum(
  geburtsdatum: Date,
  ausklammerungen: Ausklammerung[],
): Zeitraum {
  const startJahr = findeJahrOhneAusklammerung(
    vorherigesJahr(geburtsdatum),
    ausklammerungen,
  );

  return {
    von: new Date(Date.UTC(startJahr.getUTCFullYear(), 0, 1)),
    bis: geburtsdatum,
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

      expect(betrachtungszeitraum).toEqual({
        von: new Date("2024-01-01T00:00:00.000Z"),
        bis: new Date("2025-10-15T00:00:00.000Z"),
      });
    });

    it("finds the first calendar year that no Ausklammerungen can be applied to", () => {
      const geburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const ausklammerungen: Ausklammerung[] = [
        {
          von: new Date("2024-05-01T00:00:00.000Z"),
          bis: new Date("2024-05-12T00:00:00.000Z"),
          beschreibung: "Test",
        },
        {
          von: new Date("2022-03-03T00:00:00.000Z"),
          bis: new Date("2022-03-09T00:00:00.000Z"),
          beschreibung: "Test",
        },
      ];

      const betrachtungszeitraum = berechneBetrachtungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(betrachtungszeitraum).toEqual({
        von: new Date("2023-01-01T00:00:00.000Z"),
        bis: new Date("2025-10-15T00:00:00.000Z"),
      });
    });
  });
}
