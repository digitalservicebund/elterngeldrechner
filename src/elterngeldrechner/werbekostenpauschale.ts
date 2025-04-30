import {
  HistorieEinesParameters,
  findeAnzuwendendenWertZumZeitpunkt,
} from "./common/HistorieEinesParameters";
import { aufDenCentRunden } from "./common/math-util";
import { Geburtstag } from "./model";

/**
 * Bestimmt welche Werbekostenpauschale (Arbeitnehmer-Pauschbetrag) anzuwenden
 * ist. Betrag bezieht sich auf einen Kalendarmonat.
 *
 * Siehe § 2c und Foldende im Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG). Die Werte richten sich
 * theoretisch nach dem Programmablaufplan für die Einkommenssteuer, werden
 * jedoch abweichend in den Richtilinien zum BEEG 2c.1.4 spezifiziert.
 *
 * @return Betrag in Euro als Zwölftel der Jahrespauschale auf den Cent gerundet
 */
export function bestimmeWerbekostenpauschale(
  geburtstagDesKindes: Geburtstag,
): number {
  const jahresbetrag = findeAnzuwendendenWertZumZeitpunkt(
    HISTORIE_DER_WERBEKOSTENPAUSCHALE,
    geburtstagDesKindes,
  );

  return aufDenCentRunden(jahresbetrag / 12);
}

/**
 * Der `wert` entspricht der Werbekostenpauschale als Jahresbetrag, so wie er
 * offiziell spezifiziert wird.
 */
const HISTORIE_DER_WERBEKOSTENPAUSCHALE =
  HistorieEinesParameters.erstelleHistorieVonWerten([
    { anzuwendenAbDem: new Geburtstag("2025-01-01"), wert: 1230 },
    { anzuwendenAbDem: new Geburtstag("2024-01-01"), wert: 1200 }, // for completeness in relation to the referenced document
    { anzuwendenAbDem: new Geburtstag("2023-01-01"), wert: 1200 },
    { anzuwendenAbDem: new Geburtstag("2022-12-31"), wert: 1000 }, // TODO: Correct date unknown, but satisfies old tests for now.
  ]);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimme Werbekostenpauschale", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("für Geburten ab dem 01.01.2025 ist der Betrag 102.50€", () =>
      assertWerbekostenpauschale({ from: new Date("2025-01-01") }, 102.5));

    it("für Geburten ab dem 01.01.2023 bis zum 31.12.2024 ist der Betrag 100.00€", () =>
      assertWerbekostenpauschale(
        { from: new Date("2023-01-01"), to: new Date("2024-12-31") },
        100,
      ));

    it("für Geburten vor dem 01.01.2023 bleibt der Betrag bei 83.33€", () =>
      assertWerbekostenpauschale({ to: new Date("2022-12-31") }, 83.33));

    // Relevant for arithmetic ops as the return type doesn't guarantee it.
    it("is always a posistive number", () =>
      assert(
        property(arbitraryGeburtstag(), (geburtstag) => {
          expect(bestimmeWerbekostenpauschale(geburtstag)).toBeGreaterThan(0);
        }),
      ));

    function assertWerbekostenpauschale(
      timespan: { from?: Date; to?: Date },
      toBe: number,
    ): void {
      assert(
        property(
          arbitraryGeburtstag({ min: timespan.from, max: timespan.to }),
          (zeitpunkt) => {
            expect(bestimmeWerbekostenpauschale(zeitpunkt)).toBe(toBe);
          },
        ),
      );
    }

    function arbitraryGeburtstag(constraints?: { min?: Date; max?: Date }) {
      return arbitraryDate(constraints).map((date) => new Geburtstag(date));
    }
  });
}
