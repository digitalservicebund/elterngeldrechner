import { Ausklammerung, istAusklammerungInJahr } from "./ausklammerung";
import { Zeitraum } from "./zeitraum";

export function berechneBetrachtungszeitraum(
  geburtsdatum: Date,
  ausklammerungen: Ausklammerung[],
): Zeitraum {
  const startJahr = findeJahrOhneAusklammerung(
    geburtsdatum.getFullYear() - 1,
    ausklammerungen,
  );

  return {
    von: new Date(Date.UTC(startJahr, 0, 1)),
    bis: geburtsdatum,
  };
}

function findeJahrOhneAusklammerung(
  jahr: number,
  ausklammerungen: Ausklammerung[],
): number {
  const suchlimit = 2000;

  if (jahr < suchlimit) {
    return suchlimit;
  }

  if (istAusklammerungInJahr(jahr, ausklammerungen)) {
    return findeJahrOhneAusklammerung(jahr - 1, ausklammerungen);
  }

  return jahr;
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

    it("hard stop in backward search is defined at year 2000", () => {
      const geburtsdatum = new Date("2001-10-15T00:00:00.000Z");
      const ausklammerungen: Ausklammerung[] = [
        {
          von: new Date("2000-05-01T00:00:00.000Z"),
          bis: new Date("2000-05-12T00:00:00.000Z"),
          beschreibung: "Test",
        },
        {
          von: new Date("1999-03-03T00:00:00.000Z"),
          bis: new Date("1999-03-09T00:00:00.000Z"),
          beschreibung: "Test",
        },
      ];

      const betrachtungszeitraum = berechneBetrachtungszeitraum(
        geburtsdatum,
        ausklammerungen,
      );

      expect(betrachtungszeitraum).toEqual({
        von: new Date("2000-01-01T00:00:00.000Z"),
        bis: new Date("2001-10-15T00:00:00.000Z"),
      });
    });
  });
}
