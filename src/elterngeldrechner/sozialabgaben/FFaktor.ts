import {
  HistorieEinesParameters,
  findeAnzuwendendenWertZumZeitpunkt,
} from "@/elterngeldrechner/common/HistorieEinesParameters";

/**
 * Der sogenannte "F-Faktor" zur Berechnung der beitragspflichtigen Einnahmen im
 * Übergangsbereich (Midi-Jobs).
 *
 * Die eigentliche Definition nach § 20 Absatz 2a des Vierten Buches
 * Sozialgesetzbuch (SGB IV) wird durch § 2f Absatz 2 Satz 3 des Gesetz zum
 * Elterngeld und zur Elternzeit (Bundeselterngeld- und Elternzeitgesetz - BEEG)
 * abgeändert. Siehe auch Richtlinien zum BEEG 2f.2.3.2 für Details.
 *
 * @return Dezimalfaktor
 */
export function ermittelFFaktor(zeitpunkt: Date): number {
  return findeAnzuwendendenWertZumZeitpunkt(HISTORIE_DES_F_FAKTOR, zeitpunkt);
}

const HISTORIE_DES_F_FAKTOR = HistorieEinesParameters.erstelleHistorieVonWerten(
  [
    { anzuwendenAbDem: new Date("2022-10-01"), wert: 0.6667 },
    { anzuwendenAbDem: new Date("2019-01-01"), wert: 0.7143 },
    // vollständig - Einführung des Übergangsbereichs
  ],
);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ermittel Obergrenze des Übergangsbereichs", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("is 0.6667 since the 01.10.2022 on", () =>
      assert(
        property(
          arbitraryDate({ min: new Date("2022-10-01") }),
          (zeitpunkt) => {
            expect(ermittelFFaktor(zeitpunkt)).toBe(0.6667);
          },
        ),
      ));

    it("is 0.1743 till the 30.09.2022 on", () =>
      assert(
        property(
          arbitraryDate({ max: new Date("2022-09-30") }),
          (zeitpunkt) => {
            expect(ermittelFFaktor(zeitpunkt)).toBe(0.7143);
          },
        ),
      ));

    // Vergleiche: "[...] wird das Ergebnis auf die vierte Nachkommastelle gerundet."
    it("has never more than 4 decimal fraction digits", () =>
      assert(
        property(arbitraryDate(), (zeitpunkt) => {
          const fFaktor = ermittelFFaktor(zeitpunkt);
          const numberOfDigitalFractionDigits =
            fFaktor
              .toLocaleString("nu", {
                useGrouping: false,
                roundingPriority: "morePrecision",
              })
              .split(".")[1]
              ?.replace(/0+$/, "").length ?? 0;

          expect(numberOfDigitalFractionDigits).toBeLessThanOrEqual(4);
        }),
      ));

    // Relevant for arithmetic ops as the return type doesn't guarantee it.
    it("is always a positive number", () =>
      assert(
        property(arbitraryDate(), (zeitpunkt) => {
          expect(ermittelFFaktor(zeitpunkt)).toBeGreaterThan(0);
        }),
      ));
  });
}
