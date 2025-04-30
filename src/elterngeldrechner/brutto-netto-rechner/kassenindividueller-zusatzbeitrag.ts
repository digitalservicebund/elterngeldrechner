import { utc } from "@date-fns/utc";
import { set, subYears } from "date-fns";
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
  // Vergleiche: "auf Grundlage [...] des am 1. Januar des Kalenderjahres vor
  // der Geburt des Kindes für dieses Jahr geltenden [...]"
  const bezugsdatum = set(
    subYears(geburtstagDesKindes, 1, { in: utc }),
    { date: 1, month: 1 },
    { in: utc },
  );

  return findeAnzuwendendenWertZumZeitpunkt(
    HISTORIE_DES_DURCHSCHNITTLICHEN_ZUSATZBEITRAGS,
    bezugsdatum,
  );
}

/**
 * Der Datum ab dem der Wert anzuwenden ist entspricht dem Steuerjahr für
 * welches es vom Bundesministerium für Gesundheit verkündet wird. Beachte das
 * nach Elterngeldrecht immer der Steuerjahr **vor** der Geburt des Kindes
 * relevant ist!
 *
 * Der Wert entspricht dem kassenindividuellen Zusatzbeitrag als Prozentwert
 * in Dezimalform (Beispiel: 0.9% -> 0.09, 83.5% -> 0.835).
 */
const HISTORIE_DES_DURCHSCHNITTLICHEN_ZUSATZBEITRAGS =
  HistorieEinesParameters.erstelleHistorieVonWerten([
    { anzuwendenAbDem: new Date("2025-01-01"), wert: 0.025 },
    { anzuwendenAbDem: new Date("2024-01-01"), wert: 0.017 },
    { anzuwendenAbDem: new Date("2023-01-01"), wert: 0.016 },
    { anzuwendenAbDem: new Date("2022-01-01"), wert: 0.013 }, // for completeness in relation to the announcements
    { anzuwendenAbDem: new Date("2021-01-01"), wert: 0.013 },
    // unvollständig - der Rest wird nicht (mehr) benötigt
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

    it("für Geburten ab dem 01.01.2026 ist der Zusatzbeitrag 2.5%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2026-01-01") },
        0.025,
      ));

    it("für Geburten ab dem 01.01.2025 bis zum 31.12.2025 ist der Zusatzbeitrag 1.7%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2025-01-01"), to: new Date("2025-12-31") },
        0.017,
      ));

    it("für Geburten ab dem 01.01.2024 bis zum 31.12.2024 ist der Zusatzbeitrag 1.6%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2024-01-01"), to: new Date("2024-12-31") },
        0.016,
      ));

    it("für Geburten ab dem 01.01.2022 bis zum 31.12.2023 ist der Zusatzbeitrag 1.3%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { from: new Date("2022-01-01"), to: new Date("2023-12-31") },
        0.013,
      ));

    it("für Geburten vor dem 01.01.2022 bleibt der Zusatzbeitrag bei 1.3%", () =>
      assertKassenindividuellenZusatzbeitrag(
        { to: new Date("2021-12-31") },
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
