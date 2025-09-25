import { Ausgangslage } from "@/monatsplaner/Ausgangslage";
import { Specification } from "@/monatsplaner/common/specification";

export const PartnermonateSindVerfuegbar =
  Specification.fromPredicate<Ausgangslage>(
    "Partnermonate sind nicht verfügbar",
    (ausgangslage) => {
      const {
        anzahlElternteile,
        istAlleinerziehend,
        mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
      } = ausgangslage;

      const sindMehrereElternteile = anzahlElternteile > 1;

      return (
        !!mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum &&
        (istAlleinerziehend || sindMehrereElternteile)
      );
    },
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Partnermonate sind nicht verfügbar", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");

    const {
      assert,
      property,
      boolean: arbitraryBoolean,
      date: arbitraryDate,
      string: arbitraryString,
      record: arbitraryRecord,
    } = await import("fast-check");

    describe("for one Elternteil", () => {
      it("is satisfied if is alleinerziehend and was erwerbstäig", () => {
        assert(
          property(
            arbitraryDate({ noInvalidDate: true }),
            (geburtsdatumDesKindes) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 1 as const,
                istAlleinerziehend: true,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: true,
                geburtsdatumDesKindes,
              };

              expect(
                PartnermonateSindVerfuegbar.asPredicate(ausgangslage),
              ).toBe(true);
            },
          ),
        );
      });

      it("is unsatisfied if not alleinerziehend", () => {
        assert(
          property(
            arbitraryBoolean(),
            arbitraryDate({ noInvalidDate: true }),
            (
              mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
              geburtsdatumDesKindes,
            ) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 1 as const,
                istAlleinerziehend: false,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
                geburtsdatumDesKindes,
              };

              expect(
                PartnermonateSindVerfuegbar.asPredicate(ausgangslage),
              ).toBe(false);
            },
          ),
        );
      });

      it("is unsatisfied if wasn't erwerbstätig", () => {
        assert(
          property(
            arbitraryBoolean(),
            arbitraryDate({ noInvalidDate: true }),
            (istAlleinerziehend, geburtsdatumDesKindes) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 1 as const,
                istAlleinerziehend,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: false,
                geburtsdatumDesKindes,
              };

              expect(
                PartnermonateSindVerfuegbar.asPredicate(ausgangslage),
              ).toBe(false);
            },
          ),
        );
      });
    });

    describe("for two Elternteile", () => {
      it("is satisfied if at least one Elternteil was erwerbstätig", () => {
        assert(
          property(
            arbitraryPseudonymeDerElternteile(),
            arbitraryDate({ noInvalidDate: true }),
            (pseudonymeDerElternteile, geburtsdatumDesKindes) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 2 as const,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: true,
                geburtsdatumDesKindes,
                pseudonymeDerElternteile,
              };

              expect(
                PartnermonateSindVerfuegbar.asPredicate(ausgangslage),
              ).toBe(true);
            },
          ),
        );
      });

      it("is unsatisfied if no Elternteil was erwerbstätig", () => {
        assert(
          property(
            arbitraryPseudonymeDerElternteile(),
            arbitraryDate({ noInvalidDate: true }),
            (pseudonymeDerElternteile, geburtsdatumDesKindes) => {
              const ausgangslage: Ausgangslage = {
                anzahlElternteile: 2 as const,
                mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum: false,
                geburtsdatumDesKindes,
                pseudonymeDerElternteile,
              };

              expect(
                PartnermonateSindVerfuegbar.asPredicate(ausgangslage),
              ).toBe(false);
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
