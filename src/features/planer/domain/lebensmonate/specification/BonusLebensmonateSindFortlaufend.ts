import type { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Specification } from "@/features/planer/domain/common/specification";
import { AlleElternteileHabenBonusGewaehlt } from "@/features/planer/domain/lebensmonat";

export const BonusLebensmonateSindFortlaufend =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Die Monate mit Partnerschaftsbonus müssen fortlaufend und ohne Unterbrechnung bezogen werden.",
    (lebensmonate) => {
      const lebensmonatszahlenMitBonus = Object.entries(lebensmonate)
        .filter(([, lebensmonat]) =>
          AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat),
        )
        .map(([lebensmonatszahl]) => Number.parseInt(lebensmonatszahl)) // TODO: use safe record in first place
        .sort();

      return isSequenceIncreasingByOne(lebensmonatszahlenMitBonus);
    },
  );

function isSequenceIncreasingByOne(numbers: number[]): boolean {
  return numbers.every(
    (entry, index) => index === 0 || entry === numbers[index - 1] + 1,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Partnerschaftbonus Lebensmonate sind fortlaufend", async () => {
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

      expect(BonusLebensmonateSindFortlaufend.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    it("is satisfied if only a single Lebensmonat has Partnerschaftbonus", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(BonusLebensmonateSindFortlaufend.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    it("is satisfied if multiple consecutive Lebensmonate have Partnerschaftbonus", () => {
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

      expect(BonusLebensmonateSindFortlaufend.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    it("is unsatisfied if a Lebensmonat in-between has on Partnerschaftbonus", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(BonusLebensmonateSindFortlaufend.asPredicate(lebensmonate)).toBe(
        false,
      );
    });

    const monat = function (gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
