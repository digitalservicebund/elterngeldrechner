import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { LebensmonatMitBeliebigenElternteilen } from "@/monatsplaner/Lebensmonat";
import { HatIrgendeineVarianteGewaehlt } from "@/monatsplaner/Monat";
import { Specification } from "@/monatsplaner/common/specification";

export const MindestensEinElternteilHatEineOptionGewaehlt =
  Specification.fromPredicate<LebensmonatMitBeliebigenElternteilen>(
    "Kein Elternteil bezieht Elterngeld in diesem Lebensmonat",
    (lebensmonat) =>
      Object.values(lebensmonat).some(
        HatIrgendeineVarianteGewaehlt.asPredicate,
      ),
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("mindestens ein Elternteil hat eine Option gewählt", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it.each([
      { elternteil: Elternteil.Eins, variante: Variante.Basis },
      { elternteil: Elternteil.Eins, variante: Variante.Plus },
      { elternteil: Elternteil.Zwei, variante: Variante.Basis },
    ])(
      "is satisfied when $elternteil chose $variante",
      ({ elternteil, variante }) => {
        const lebensmonat = {
          ...LEBENSMONAT_OHNE_AUSWAHL,
          [elternteil]: monat(variante),
        };

        expect(
          MindestensEinElternteilHatEineOptionGewaehlt.asPredicate(lebensmonat),
        ).toBe(true);
      },
    );

    it("is satisfied if both Elternteile chose a Variante", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Plus),
      };

      expect(
        MindestensEinElternteilHatEineOptionGewaehlt.asPredicate(lebensmonat),
      ).toBe(true);
    });

    it("is unsatisfied if both Elternteile have no Option chosen or chose kein Elterngeld", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(KeinElterngeld),
        [Elternteil.Zwei]: monat(undefined),
      };

      expect(
        MindestensEinElternteilHatEineOptionGewaehlt.asPredicate(lebensmonat),
      ).toBe(false);
    });

    function monat(gewaehlteOption: Auswahloption | undefined) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }

    const LEBENSMONAT_OHNE_AUSWAHL = {
      [Elternteil.Eins]: monat(undefined),
      [Elternteil.Zwei]: monat(undefined),
    };
  });
}
