import {
  type Ausgangslage,
  PartnermonateSindVerfuegbar,
} from "@/monatsplaner/Ausgangslage";
import { Elternteil } from "@/monatsplaner/Elternteil";
import { Variante } from "@/monatsplaner/Variante";
import type { VerfuegbaresKontingent } from "@/monatsplaner/VerfuegbaresKontingent";

export function bestimmeVerfuegbaresKontingent(
  ausgangslage: Ausgangslage,
): VerfuegbaresKontingent {
  const sindPartnermonateVerfuegbar =
    PartnermonateSindVerfuegbar.asPredicate(ausgangslage);

  const anzahlBasisMonate = sindPartnermonateVerfuegbar
    ? ANZAHL_BASIS_MIT_PARTNER_MONATEN
    : MINIMALE_ANZAHL_BASIS_MONATE;

  const anzahlPlusMonate =
    anzahlBasisMonate * ANZAHL_PLUS_MONATE_PRO_BASIS_MONAT;

  const { anzahlElternteile, istAlleinerziehend } = ausgangslage;
  const sindMehrereElternteile = anzahlElternteile > 1;

  const anzahlBonusMonate = () => {
    if (sindMehrereElternteile) {
      return ANZAHL_BONUS_LEBENSMONATE * 2;
    } else if (istAlleinerziehend) {
      return ANZAHL_BONUS_LEBENSMONATE;
    } else {
      return 0;
    }
  };

  return {
    [Variante.Basis]: anzahlBasisMonate,
    [Variante.Plus]: anzahlPlusMonate,
    [Variante.Bonus]: anzahlBonusMonate(),
  };
}

const MINIMALE_ANZAHL_BASIS_MONATE = 12;
const ANZAHL_BASIS_MIT_PARTNER_MONATEN = 14;
const ANZAHL_BONUS_LEBENSMONATE = 4;
const ANZAHL_PLUS_MONATE_PRO_BASIS_MONAT = 2;

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("bestimme verfügbares Kontingent", async () => {
    const {
      assert,
      property,
      date: arbitraryDate,
      string: arbitraryString,
      record: arbitraryRecord,
    } = await import("fast-check");

    // TODO: Property test case for plus always double basis
    // TODO: Property test for basis/plus ranging from 12/24 to 14/28.

    describe("for one Elternteil", () => {
      it("has always zero Lebensmonate with Partnerschaftbonus", () => {
        assert(
          property(arbitraryDate(), (geburtsdatumDesKindes) => {
            const ausgangslage: Ausgangslage = {
              anzahlElternteile: 1 as const,
              geburtsdatumDesKindes,
            };

            const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

            expect(kontingent[Variante.Bonus]).toBe(0);
          }),
        );
      });

      it("has 12 Monate Basiselterngeld and 24 ElterngeldPlus if no Partnermonate are available", () => {
        assert(
          property(arbitraryDate(), (geburtsdatumDesKindes) => {
            vi.spyOn(
              PartnermonateSindVerfuegbar,
              "asPredicate",
            ).mockReturnValue(false);

            const ausgangslage: Ausgangslage = {
              anzahlElternteile: 1 as const,
              geburtsdatumDesKindes,
            };

            const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

            expect(kontingent[Variante.Basis]).toBe(12);
            expect(kontingent[Variante.Plus]).toBe(24);
          }),
        );
      });

      it("has 14 Monate Basiselterngeld and 28 ElterngeldPlus if Partnermonate are available", () => {
        assert(
          property(arbitraryDate(), (geburtsdatumDesKindes) => {
            vi.spyOn(
              PartnermonateSindVerfuegbar,
              "asPredicate",
            ).mockReturnValue(true);

            const ausgangslage: Ausgangslage = {
              anzahlElternteile: 1 as const,
              geburtsdatumDesKindes,
            };

            const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

            expect(kontingent[Variante.Basis]).toBe(14);
            expect(kontingent[Variante.Plus]).toBe(28);
          }),
        );
      });
    });

    describe("for two Elternteile", () => {
      it("has always 4 lebensmonate Partnerschaftsbonus each", () => {
        assert(
          property(
            arbitraryPseudonymeDerElternteile(),
            arbitraryDate(),
            (pseudonymeDerElternteile, geburtsdatumDesKindes) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 2 as const,
                pseudonymeDerElternteile,
                geburtsdatumDesKindes,
              };

              const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

              expect(kontingent[Variante.Bonus]).toBe(8);
            },
          ),
        );
      });

      it("has 12 Monate Basiselterngeld and 24 Monate ElterngeldPlus if no Partnermonate are available", () => {
        assert(
          property(
            arbitraryPseudonymeDerElternteile(),
            arbitraryDate(),
            (pseudonymeDerElternteile, geburtsdatumDesKindes) => {
              vi.spyOn(
                PartnermonateSindVerfuegbar,
                "asPredicate",
              ).mockReturnValue(false);

              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 2 as const,
                pseudonymeDerElternteile,
                geburtsdatumDesKindes,
              };

              const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

              expect(kontingent[Variante.Basis]).toBe(12);
              expect(kontingent[Variante.Plus]).toBe(24);
            },
          ),
        );
      });

      it("has 14 Monate Basiselterngeld and 28 Monate ElterngeldPlus if Partnermonate are available", () => {
        assert(
          property(
            arbitraryPseudonymeDerElternteile(),
            arbitraryDate(),
            (pseudonymeDerElternteile, geburtsdatumDesKindes) => {
              vi.spyOn(
                PartnermonateSindVerfuegbar,
                "asPredicate",
              ).mockReturnValue(true);

              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 2 as const,
                pseudonymeDerElternteile,
                geburtsdatumDesKindes,
              };

              const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

              expect(kontingent[Variante.Basis]).toBe(14);
              expect(kontingent[Variante.Plus]).toBe(28);
            },
          ),
        );
      });
    });

    function arbitraryPseudonymeDerElternteile() {
      return arbitraryRecord({
        [Elternteil.Eins]: arbitraryString(),
        [Elternteil.Zwei]: arbitraryString(),
      });
    }
  });
}
