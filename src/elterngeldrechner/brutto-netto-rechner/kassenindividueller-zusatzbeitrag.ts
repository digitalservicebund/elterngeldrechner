import {
  HistorieEinesParameters,
  findeAnzuwendendenWertZumZeitpunkt,
} from "@/elterngeldrechner/common/HistorieEinesParameters";
import { Geburtstag } from "@/elterngeldrechner/model";

/**
 * Bestimem welcher kassenindivuelle Zusatzbeitrag für die gesetzliche
 * Krankenversicherung zu verwenden ist. Dieser ist für die Berechnung der
 * Lohnsteuer relevant. Der Zusatzbeitrag ist ein Prozentwert, welcher hier als
 * Dezimalfaktor dargestellt wird.
 *
 * Im § 39b Absatz 2 Satz 5 Nummer 3 Buchstabe b) des Einkommensteuergesetz
 * (EStG) wird auf Zusatzbeitrag nach § 242 des Sozialgesetzbuch (SGB) Fünftes
 * Buch (V) verwiesen. Dort heißt es dass das Bundesministerium für Gesundheit
 * für jedes Jahr einen durchschnittlichen Schätzwert im Bundesanzeiger bekannt
 * gibt.
 *
 * @return Zusatzbeitrag als Dezimalfaktor zwischen 0 und 1
 */
export function bestimmeKassenindividuellenZusatzbeitrag(
  geburtstagDesKindes: Geburtstag,
): number {
  return findeAnzuwendendenWertZumZeitpunkt(
    HISTORIE_DES_DURCHSCHNITTLICHEN_ZUSATZBEITRAGS,
    geburtstagDesKindes,
  );
}

/**
 * Der `wert` entspricht dem kassenindividuellen Zusatzbeitrag als Prozentwert
 * in Dezimalform (Beispiel: 0.9% -> 0.09, 83.5% -> 0.835).
 */
const HISTORIE_DES_DURCHSCHNITTLICHEN_ZUSATZBEITRAGS =
  HistorieEinesParameters.erstelleHistorieVonWerten([
    { anzuwendenAbDem: new Geburtstag("2025-01-01"), wert: 0.025 },
    { anzuwendenAbDem: new Geburtstag("2024-01-01"), wert: 0.017 },
    { anzuwendenAbDem: new Geburtstag("2023-01-01"), wert: 0.016 },
    { anzuwendenAbDem: new Geburtstag("2022-01-01"), wert: 0.013 }, // for completeness in relation to the announcements
    { anzuwendenAbDem: new Geburtstag("2021-01-01"), wert: 0.013 },
  ]);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimme Kassenindividuellen Zusatzbeitrag", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("gibt immer einen Zusatzbeitrag zwischen 0% und 100% zurück", () =>
      assert(
        property(arbitraryGeburtstag(), (geburtstag) => {
          const zusatzbeitrag =
            bestimmeKassenindividuellenZusatzbeitrag(geburtstag);

          expect(zusatzbeitrag).toBeGreaterThanOrEqual(0);
          expect(zusatzbeitrag).toBeLessThanOrEqual(1);
        }),
      ));

    it("für Geburten ab dem 01.01.2025 ist der Zusatzbeitrag 2.5%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2025-01-01") },
        0.025,
      ));

    it("für Geburten ab dem 01.01.2024 bis zum 31.12.2024 ist der Zusatzbeitrag 1.7%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2024-01-01"), to: new Date("2024-12-31") },
        0.017,
      ));

    it("für Geburten ab dem 01.01.2023 bis zum 31.12.2023 ist der Zusatzbeitrag 1.6%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2023-01-01"), to: new Date("2023-12-31") },
        0.016,
      ));

    it("für Geburten ab dem 01.01.2021 bis zum 31.12.2022 ist der Zusatzbeitrag 1.3%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2021-01-01"), to: new Date("2022-12-31") },
        0.013,
      ));

    it("für Geburten vor dem 01.01.2021 bleibt der Zusatzbeitrag bei 1.3%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { to: new Date("2020-12-31") },
        0.013,
      ));

    function assertKassenindividuellenZusatzbeitrag(
      timespan: { from?: Date; to?: Date },
      toBe: number,
    ): void {
      assert(
        property(
          arbitraryGeburtstag({ min: timespan.from, max: timespan.to }),
          (zeitpunkt) => {
            expect(bestimmeKassenindividuellenZusatzbeitrag(zeitpunkt)).toBe(
              toBe,
            );
          },
        ),
      );
    }

    function arbitraryGeburtstag(constraints?: { min?: Date; max?: Date }) {
      return arbitraryDate(constraints).map((date) => new Geburtstag(date));
    }
  });
}
