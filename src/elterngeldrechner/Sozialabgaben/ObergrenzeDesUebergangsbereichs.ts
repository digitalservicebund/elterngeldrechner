import {
  HistorieEinesParameters,
  findeAnzuwendendenWertZumZeitpunkt,
} from "@/elterngeldrechner/common/HistorieEinesParameters";

/**
 * Der obere Grenzbetrag für Beschäftigungen im Übergangsbereich (Midi-Jobs)
 * nach § 20 Absatz 2 des Vierten Buches Sozialgesetzbuch (SGB IV), ursprünglich
 * § 163 des Sechsten Buches Sozialgesetzbuch (SGB VI).
 *
 * @return Betrag in Euro
 */
export function ermittelObergrenzeDesUebergangsbereichs(
  zeitpunkt: Date,
): number {
  return findeAnzuwendendenWertZumZeitpunkt(
    HISTORIE_DER_OBERGRENZE_DES_UEBERGANGSBEREICHS,
    zeitpunkt,
  );
}

const HISTORIE_DER_OBERGRENZE_DES_UEBERGANGSBEREICHS =
  HistorieEinesParameters.erstelleHistorieVonWerten([
    { anzuwendenAbDem: new Date("2023-01-01"), wert: 2000 },
    { anzuwendenAbDem: new Date("2022-10-01"), wert: 1600 },
    { anzuwendenAbDem: new Date("2019-07-01"), wert: 1300 },
    { anzuwendenAbDem: new Date("2003-06-30"), wert: 800 },
    // vollständig - Einführung der (zuvor genannten) Gleitzone
  ]);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ermittel Obergrenze des Übergangsbereichs", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("is 2.000€ from the 01.01.2023 on", () =>
      assertObergrenzeDesUebergangsbereichs(
        { from: new Date("2023-01-01") },
        2000,
      ));

    it("is 1.600€ between the 01.10.2022 and 31.12.2022", () =>
      assertObergrenzeDesUebergangsbereichs(
        { from: new Date("2022-10-01"), to: new Date("2022-12-31") },
        1600,
      ));

    it("is 1.300€ between the 01.07.2019 and 30.09.2022", () =>
      assertObergrenzeDesUebergangsbereichs(
        { from: new Date("2019-07-01"), to: new Date("2022-09-30") },
        1300,
      ));

    it("is 800€ between the 01.04.2003 and 30.06.2019", () =>
      assertObergrenzeDesUebergangsbereichs(
        { from: new Date("2003-04-01"), to: new Date("2019-06-30") },
        800,
      ));

    // Relevant for arithmetic ops as the return type doesn't guarantee it.
    it("is always a posistive number", () =>
      assert(
        property(arbitraryDate(), (zeitpunkt) => {
          expect(
            ermittelObergrenzeDesUebergangsbereichs(zeitpunkt),
          ).toBeGreaterThan(0);
        }),
      ));

    function assertObergrenzeDesUebergangsbereichs(
      timespan: { from?: Date; to?: Date },
      toBe: number,
    ): void {
      assert(
        property(
          arbitraryDate({ min: timespan.from, max: timespan.to }),
          (zeitpunkt) => {
            expect(ermittelObergrenzeDesUebergangsbereichs(zeitpunkt)).toBe(
              toBe,
            );
          },
        ),
      );
    }
  });
}
