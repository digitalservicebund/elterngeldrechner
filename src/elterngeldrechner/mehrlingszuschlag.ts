/**
 * Die Höhe des Mehrlingszuschlags nach § 2a Absatz 4 des Gesetz zum Elterngeld
 * und zur Elternzeit (Bundeselterngeld- und Elternzeitgesetz BEEG).
 *
 * @return Betrag in Euro
 */
export function berechneDenMehrlingszuschlagFuerBasiselterngeld(
  anzahlGeborenerKinder: number,
): number {
  const anzahlMehrlinge = Math.max(anzahlGeborenerKinder - 1, 0);
  return anzahlMehrlinge * 300;
}

/**
 * Special case of {@link berechneDenMehrlingszuschlagFuerBasiselterngeld} that
 * takes into account § 2a Absatz 2 des Gesetz zum Elterngeld und zur Elternzeit
 * (Bundeselterngeld- und Elternzeitgesetz - BEEG).
 *
 * @return Betrag in Euro
 */
export function berechneDenMehrlingszuschlagFuerElterngeldPlus(
  anzahlGeborenerKinder: number,
): number {
  return (
    berechneDenMehrlingszuschlagFuerBasiselterngeld(anzahlGeborenerKinder) / 2
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Mehrlingszuschlag", async () => {
    const {
      assert,
      property,
      integer: arbitraryInteger,
    } = await import("fast-check");

    describe("berechne den Mehrlingszuschlag für Basiselterngeld", () => {
      it("is 300€ for Zwillinge", () => {
        expect(berechneDenMehrlingszuschlagFuerBasiselterngeld(2)).toBe(300);
      });

      it("is 600€ for Drillinge", () => {
        expect(berechneDenMehrlingszuschlagFuerBasiselterngeld(3)).toBe(600);
      });

      it("is 900€ for Vierlinge", () => {
        expect(berechneDenMehrlingszuschlagFuerBasiselterngeld(4)).toBe(900);
      });

      it("is never negative", () => {
        assert(
          property(arbitraryInteger(), (anzahlGeborenerKinder) => {
            expect(
              berechneDenMehrlingszuschlagFuerBasiselterngeld(
                anzahlGeborenerKinder,
              ),
            ).toBeGreaterThanOrEqual(0);
          }),
        );
      });
    });

    describe("berechne den Mehrlingszuschlag für ElterngeldPlus", () => {
      it("is 150€ for Zwillinge", () => {
        expect(berechneDenMehrlingszuschlagFuerElterngeldPlus(2)).toBe(150);
      });

      it("is 300€ for Drillinge", () => {
        expect(berechneDenMehrlingszuschlagFuerElterngeldPlus(3)).toBe(300);
      });

      it("is 450€ for Vierlinge", () => {
        expect(berechneDenMehrlingszuschlagFuerElterngeldPlus(4)).toBe(450);
      });

      it("is always half of the Mehrlingszuschlag for Basiselterngeld", () => {
        assert(
          property(arbitraryInteger(), (anzahlGeborenerKinder) => {
            const zuschlagFuerBasiselterngeld =
              berechneDenMehrlingszuschlagFuerBasiselterngeld(
                anzahlGeborenerKinder,
              );

            const zuschlagFuerElterngeldPlus =
              berechneDenMehrlingszuschlagFuerElterngeldPlus(
                anzahlGeborenerKinder,
              );

            expect(zuschlagFuerElterngeldPlus).toBe(
              zuschlagFuerBasiselterngeld / 2,
            );
          }),
        );
      });

      it("is never negative", () => {
        assert(
          property(arbitraryInteger(), (anzahlGeborenerKinder) => {
            expect(
              berechneDenMehrlingszuschlagFuerElterngeldPlus(
                anzahlGeborenerKinder,
              ),
            ).toBeGreaterThanOrEqual(0);
          }),
        );
      });
    });
  });
}
