import {
  HistorieEinesParameters,
  findeFuerGeburtstagAnzuwendendenWertEinesParameters,
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
export function bestimmeWerbekostenpauschale(geburtstag: Geburtstag): number {
  const jahresbetrag = findeFuerGeburtstagAnzuwendendenWertEinesParameters(
    geburtstag,
    HISTORIE_DER_WERBEKOSTENPAUSCHALE,
  );

  return aufDenCentRunden(jahresbetrag / 12);
}

/**
 * Der `wert` entspricht der Werbekostenpauschale als Jahresbetrag, so wie er
 * offiziell spezifiziert wird.
 */
const HISTORIE_DER_WERBEKOSTENPAUSCHALE =
  HistorieEinesParameters.erstelleHistorieVonWerten([
    { fuerGeburtenAb: new Geburtstag("2025-01-01"), wert: 1230 },
    { fuerGeburtenAb: new Geburtstag("2024-01-01"), wert: 1200 }, // for completeness in relation to the referenced document
    { fuerGeburtenAb: new Geburtstag("2023-01-01"), wert: 1200 },
    { fuerGeburtenAb: new Geburtstag("2022-12-31"), wert: 1000 }, // TODO: Correct date unknown, but satisfies old tests for now.
  ]);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimme Werbekostenpauschale", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("gibt immer einen positiven Betrag zurück", () => {
      assert(
        property(arbitraryGeburtstag(), (geburtstag) => {
          expect(bestimmeWerbekostenpauschale(geburtstag)).toBeGreaterThan(0);
        }),
      );
    });

    it("für Geburten ab dem 01.01.2025 ist der Betrag 102.50€", () => {
      assert(
        property(
          arbitraryGeburtstag({ min: new Date("2025-01-01") }),
          (geburtstag) => {
            expect(bestimmeWerbekostenpauschale(geburtstag)).toBe(102.5);
          },
        ),
      );
    });

    it("für Geburten ab dem 01.01.2023 bis zum 31.12.2024 ist der Betrag 100.00€", () => {
      assert(
        property(
          arbitraryGeburtstag({
            min: new Date("2023-01-01"),
            max: new Date("2024-12-31"),
          }),
          (geburtstag) => {
            expect(bestimmeWerbekostenpauschale(geburtstag)).toBe(100);
          },
        ),
      );
    });

    it("für Geburten vor dem 01.01.2023 bleibt der Betrag bei 83.33€", () => {
      assert(
        property(
          arbitraryGeburtstag({
            max: new Date("2022-12-31"),
          }),
          (geburtstag) => {
            expect(bestimmeWerbekostenpauschale(geburtstag)).toEqual(83.33);
          },
        ),
      );
    });

    function arbitraryGeburtstag(constraints?: { min?: Date; max?: Date }) {
      return arbitraryDate(constraints).map((date) => new Geburtstag(date));
    }
  });
}
