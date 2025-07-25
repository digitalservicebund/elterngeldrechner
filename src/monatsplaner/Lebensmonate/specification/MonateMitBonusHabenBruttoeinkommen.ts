import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { LebensmonateMitBeliebigenElternteilen } from "@/monatsplaner/Lebensmonate";
import {
  MonatHatBonusGewaehlt,
  MonatHatBruttoeinkommen,
} from "@/monatsplaner/Monat";
import { Specification } from "@/monatsplaner/common/specification";

export const MonateMitBonusHabenBruttoeinkommen =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Beim Partnerschaftsbonus ist Arbeiten in Teilzeit Pflicht. Bitte geben Sie ein Einkommen ein.",
    (lebensmonate) =>
      Object.values(lebensmonate)
        .flatMap((lebensmonat) => Object.values(lebensmonat))
        .filter(MonatHatBonusGewaehlt.asPredicate)
        .every(MonatHatBruttoeinkommen.asPredicate),
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Monate mit Bonus haben bruttoeinkommen", async () => {
    const { Elternteil, Variante, KeinElterngeld } = await import(
      "@/monatsplaner"
    );

    it("is satisfied for an empty set of Lebensmonate", () => {
      const lebensmonate = {};

      expect(MonateMitBonusHabenBruttoeinkommen.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    it("is satisfied if no Bonus was chosen for any Monat", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis, 0),
          [Elternteil.Zwei]: monat(Variante.Plus, undefined),
        },
        5: {
          [Elternteil.Eins]: monat(KeinElterngeld, null),
          [Elternteil.Zwei]: monat(undefined, 1000),
        },
      };

      expect(MonateMitBonusHabenBruttoeinkommen.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    it("is unsatisfied if Bonus was chosen for any Monat and has no Bruttoeinkommen", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus, 0),
          [Elternteil.Zwei]: monat(Variante.Bonus, undefined),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Bonus, null),
          [Elternteil.Zwei]: monat(Variante.Bonus, 1000),
        },
      };

      expect(MonateMitBonusHabenBruttoeinkommen.asPredicate(lebensmonate)).toBe(
        false,
      );
    });

    function monat(
      gewaehlteOption?: Auswahloption,
      bruttoeinkommen?: number | null,
    ) {
      return {
        gewaehlteOption,
        bruttoeinkommen,
        imMutterschutz: false as const,
      };
    }
  });
}
