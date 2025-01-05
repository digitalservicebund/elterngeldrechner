import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Specification } from "@/features/planer/domain/common/specification";
import { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate";
import {
  MonatHatBonusGewaehlt,
  MonatHatBruttoeinkommen,
} from "@/features/planer/domain/monat";

export const MonateMitBonusHabenBruttoeinkommen =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Bitte beachten Sie: Die Planung ist derzeit noch nicht vollständig. Während Sie den Partnerschaftsbonus bekommen, müssen Sie 24 bis 32 Stunden pro Woche arbeiten. Tragen Sie bitte das voraussichtliche Einkommen für diese Monate ein.",
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
      "@/features/planer/domain"
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
