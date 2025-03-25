import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import {
  IrgendeinElternteilHatBasisGewaehlt,
  type LebensmonatMitBeliebigenElternteilen,
} from "@/monatsplaner/Lebensmonat";
import { LebensmonateMitBeliebigenElternteilen } from "@/monatsplaner/Lebensmonate";
import { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import { Specification } from "@/monatsplaner/common/specification";

export const KeinBasisNachDemVierzehntenLebensmonat =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Nach dem 14. Lebensmonat kann kein Basiselterngeld mehr ausgewählt werden.",
    (lebensmonate) =>
      listeLebensmonateAuf(lebensmonate)
        .filter(([lebensmonatszahl]) => lebensmonatszahl > 14)
        .every(
          ([, lebensmonat]) =>
            !IrgendeinElternteilHatBasisGewaehlt.asPredicate(lebensmonat),
        ),
  );

// FIXME: use "original" operation and solve type issues.
function listeLebensmonateAuf(
  lebensmonate: LebensmonateMitBeliebigenElternteilen,
): [Lebensmonatszahl, LebensmonatMitBeliebigenElternteilen][] {
  return Object.entries(lebensmonate).map(([lebensmonatszahl, lebensmonat]) => [
    Number.parseInt(lebensmonatszahl) as Lebensmonatszahl,
    lebensmonat,
  ]);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("kein Basiselterngeld nach dem 14. Lebensmonat", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("is satisfied for empty Lebensmonate", () => {
      expect(KeinBasisNachDemVierzehntenLebensmonat.asPredicate({})).toBe(true);
    });

    it("is satisfied if Basiselterngeld is taken till the 14. Lebensmonat and other Options after", () => {
      const lebensmonate = {
        13: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        14: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        15: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        16: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(
        KeinBasisNachDemVierzehntenLebensmonat.asPredicate(lebensmonate),
      ).toBe(true);
    });

    it("is unsatisfied if Basiselterngeld is taken after the 14. Lebensmonat", () => {
      const lebensmonate = {
        15: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      expect(
        KeinBasisNachDemVierzehntenLebensmonat.asPredicate(lebensmonate),
      ).toBe(false);
    });

    function monat(gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
