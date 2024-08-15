import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { AlleElternteileHabenBonusGewaehlt } from "@/features/planer/domain/lebensmonat";
import type { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate";
import { Specification } from "@/features/planer/domain/common/specification";

export const KeineOderMindestensZweiLebensmonateBonus =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Partnerschaftsbonus muss immer für mindestens zwei Lebensmonate bezogen werden.",
    (lebensmonate) =>
      Object.values(lebensmonate).filter(
        AlleElternteileHabenBonusGewaehlt.asPredicate,
      ).length !== 1,
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("keine oder mindestens zwei Lebensmonate Partnerschaftsbonus", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("is satisfied if no Partnerschaftsbonus is chosen at all", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      expect(
        KeineOderMindestensZweiLebensmonateBonus.asPredicate(lebensmonate),
      ).toBe(true);
    });

    it("is satisfied if two Lebensmonate Partnerschaftsbonus are chosen", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(
        KeineOderMindestensZweiLebensmonateBonus.asPredicate(lebensmonate),
      ).toBe(true);
    });

    it("is satisfied if three Lebensmonate Partnerschaftsbonus are chosen", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(
        KeineOderMindestensZweiLebensmonateBonus.asPredicate(lebensmonate),
      ).toBe(true);
    });

    it("is unsatisfied if only a single Lebensmonat Partnerschaftsbonus is chosen", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      expect(
        KeineOderMindestensZweiLebensmonateBonus.asPredicate(lebensmonate),
      ).toBe(false);
    });

    const monat = function (gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
