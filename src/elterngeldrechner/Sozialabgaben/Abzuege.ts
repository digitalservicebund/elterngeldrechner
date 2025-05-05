/**
 * Nach § 2f Absatz 1 Nummer 1 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG)
 *
 * @return Betrag in Euro
 */
export function berechneAbzuegeFuerDieKrankenUndPflegeversicherung(
  bemessungsgrundlage: number,
): number {
  return Math.max(bemessungsgrundlage * 0.09, 0);
}

/**
 * Nach § 2f Absatz 1 Nummer 2 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG)
 *
 * @return Betrag in Euro
 */
export function berechneAbzuegeFuerDieRentenversicherung(
  bemessungsgrundlage: number,
): number {
  return Math.max(bemessungsgrundlage * 0.1, 0);
}

/**
 * Nach § 2f Absatz 1 Nummer 3 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG)
 *
 * @return Betrag in Euro
 */
export function berechneAbzuegeFuerDieArbeitsfoerderung(
  bemessungsgrundlage: number,
): number {
  return Math.max(bemessungsgrundlage * 0.02, 0);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Sozialabgaben", async () => {
    const {
      assert,
      property,
      integer: arbitraryInteger,
    } = await import("fast-check");

    describe("berechne Abgaben für die Kranken- und Pflegeversicherung", () => {
      it("is never negative", () =>
        assert(
          property(arbitraryInteger(), (bemessungsgrundlage) => {
            const abgaben =
              berechneAbzuegeFuerDieKrankenUndPflegeversicherung(
                bemessungsgrundlage,
              );

            expect(abgaben).toBeGreaterThanOrEqual(0);
          }),
        ));

      it("is always 9% of the Bemessungsgrundlage", () =>
        property(arbitraryInteger({ min: 0 }), (bemessungsgrundlage) => {
          const abgaben =
            berechneAbzuegeFuerDieKrankenUndPflegeversicherung(
              bemessungsgrundlage,
            );
          expect(abgaben).toEqual(bemessungsgrundlage * 0.09);
        }));
    });

    describe("berechne Abgaben für die Rentenversicherung", () => {
      it("is never negative", () =>
        assert(
          property(arbitraryInteger(), (bemessungsgrundlage) => {
            const abgaben =
              berechneAbzuegeFuerDieRentenversicherung(bemessungsgrundlage);

            expect(abgaben).toBeGreaterThanOrEqual(0);
          }),
        ));

      it("is always 10% of the Bemessungsgrundlage", () =>
        property(arbitraryInteger({ min: 0 }), (bemessungsgrundlage) => {
          const abgaben =
            berechneAbzuegeFuerDieRentenversicherung(bemessungsgrundlage);

          expect(abgaben).toEqual(bemessungsgrundlage * 0.1);
        }));
    });

    describe("berechne Abgaben für die Arbeitsförderung", () => {
      it("is never negative", () =>
        assert(
          property(arbitraryInteger(), (bemessungsgrundlage) => {
            const abgaben =
              berechneAbzuegeFuerDieArbeitsfoerderung(bemessungsgrundlage);

            expect(abgaben).toBeGreaterThanOrEqual(0);
          }),
        ));

      it("is always 2% of the Bemessungsgrundlage", () =>
        property(arbitraryInteger({ min: 0 }), (bemessungsgrundlage) => {
          const abgaben =
            berechneAbzuegeFuerDieArbeitsfoerderung(bemessungsgrundlage);

          expect(abgaben).toEqual(bemessungsgrundlage * 0.2);
        }));
    });
  });
}
