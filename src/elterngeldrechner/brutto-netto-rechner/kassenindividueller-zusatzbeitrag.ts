import {
  HistorieEinesParameters,
  findeFuerGeburtsdatumAnzuwendendenWertEinesParameters,
} from "@/elterngeldrechner/common/HistorieEinesParameters";

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
  geburtsdatumDesKindes: Date,
): number {
  return findeFuerGeburtsdatumAnzuwendendenWertEinesParameters(
    geburtsdatumDesKindes,
    HISTORIE_DES_DURCHSCHNITTLICHEN_ZUSATZBEITRAGS,
  );
}

/**
 * Der `wert` entspricht dem kassenindividuellen Zusatzbeitrag als Prozentwert
 * in Dezimalform (Beispiel: 0.9% -> 0.09, 83.5% -> 0.835).
 */
const HISTORIE_DES_DURCHSCHNITTLICHEN_ZUSATZBEITRAGS =
  HistorieEinesParameters.erstelleHistorieVonWerten([
    { fuerGeburtenAbDem: new Date("2022-12-31"), wert: 0.009 },
  ]);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimme Kassenindividuellen Zusatzbeitrag", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
    } = await import("fast-check");

    it("gibt immer einen Zusatzbeitrag zwischen 0% und 100% zurück", () => {
      assert(
        property(arbitraryDate(), (geburtsdatumDesKindes) => {
          const zusatzbeitrag = bestimmeKassenindividuellenZusatzbeitrag(
            geburtsdatumDesKindes,
          );

          expect(zusatzbeitrag).toBeGreaterThanOrEqual(0);
          expect(zusatzbeitrag).toBeLessThanOrEqual(1);
        }),
      );
    });

    it("für Geburten ab dem 31.12.2022 ist der Zusatzbeitrag 0.9%", () => {
      assert(
        property(
          arbitraryDate({ min: new Date("2022-12-31") }),
          (geburtsdatumDesKindes) => {
            expect(
              bestimmeKassenindividuellenZusatzbeitrag(geburtsdatumDesKindes),
            ).toBe(0.009);
          },
        ),
      );
    });
  });
}
