import {
  HistorieEinesParameters,
  findeAnzuwendendenWertZumZeitpunkt,
} from "@/elterngeldrechner/common/HistorieEinesParameters";

/**
 * Geringfügigkeitsgrenze für geringfügige Beschäftigungen (Mini-Jobs) wie vom
 * Bundesministerium für Arbeit und Soziales im Bundesanzeiger bekannt gegeben
 * nach § 8 Absatz 1a des Vierten Buches Sozialgesetzbuch (SGB IV).
 *
 * @return Betrag in Euro
 */
export function ermittelGeringfuegigkeitsgrenze(zeitpunkt: Date): number {
  return findeAnzuwendendenWertZumZeitpunkt(
    HISTORIE_DER_GERINGFUEGIGKEITSGRENZE,
    zeitpunkt,
  );
}

const HISTORIE_DER_GERINGFUEGIGKEITSGRENZE =
  HistorieEinesParameters.erstelleHistorieVonWerten([
    { anzuwendenAbDem: new Date("2025-01-01"), wert: 556 },
    { anzuwendenAbDem: new Date("2024-01-01"), wert: 538 },
    { anzuwendenAbDem: new Date("2022-10-01"), wert: 520 },
    { anzuwendenAbDem: new Date("2013-01-01"), wert: 450 },
    { anzuwendenAbDem: new Date("2003-04-01"), wert: 400 },
    // vollständig - Einführung der "Mini-Jobs"
  ]);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ermittel Geringfuegigkeitsgrenze", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("is 556€ from the 01.01.2025 on", () =>
      assertGeringfuegigkeitsgrenze({ from: new Date("2025-01-01") }, 556));

    it("is 538€ between the 01.01.2024 and 31.12.2024", () =>
      assertGeringfuegigkeitsgrenze(
        { from: new Date("2024-01-01"), to: new Date("2024-12-31") },
        538,
      ));

    it("is 520€ between the 01.10.2022 and 31.12.2023", () =>
      assertGeringfuegigkeitsgrenze(
        { from: new Date("2022-10-01"), to: new Date("2023-12-31") },
        520,
      ));

    it("is 450€ between the 01.01.2013 and 30.09.2022", () =>
      assertGeringfuegigkeitsgrenze(
        { from: new Date("2013-01-01"), to: new Date("2022-09-30") },
        450,
      ));

    it("is 400€ between the 01.04.2003 and 31.12.2012", () =>
      assertGeringfuegigkeitsgrenze(
        { from: new Date("2003-04-01"), to: new Date("2012-12-31") },
        400,
      ));

    // Vergleiche: "[...] und auf volle Euro aufgerundet wird."
    it("never has any digital fraction digit", () =>
      assert(
        property(arbitraryDate(), (zeitpunkt) => {
          const grenze = ermittelGeringfuegigkeitsgrenze(zeitpunkt);
          const numberOfDigitalFractionDigits =
            grenze
              .toLocaleString("nu", {
                useGrouping: false,
                roundingPriority: "morePrecision",
              })
              .split(".")[1]
              ?.replace(/0+$/, "").length ?? 0;

          expect(numberOfDigitalFractionDigits).toBe(0);
        }),
      ));

    // Relevant for arithmetic ops as the return type doesn't guarantee it.
    it("is always a positive number", () =>
      assert(
        property(arbitraryDate(), (zeitpunkt) => {
          expect(ermittelGeringfuegigkeitsgrenze(zeitpunkt)).toBeGreaterThan(0);
        }),
      ));

    function assertGeringfuegigkeitsgrenze(
      timespan: { from?: Date; to?: Date },
      toBe: number,
    ): void {
      assert(
        property(
          arbitraryDate({ min: timespan.from, max: timespan.to }),
          (zeitpunkt) => {
            expect(ermittelGeringfuegigkeitsgrenze(zeitpunkt)).toBe(toBe);
          },
        ),
      );
    }
  });
}
