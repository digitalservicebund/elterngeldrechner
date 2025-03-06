import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { Specification } from "@/monatsplaner/common/specification";
import { AlleElternteileHabenBonusGewaehlt } from "@/monatsplaner/lebensmonat";
import type { LebensmonateMitBeliebigenElternteilen } from "@/monatsplaner/lebensmonate";

export const BonusLebensmonateSindFortlaufend =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Die Monate mit Partnerschaftsbonus müssen fortlaufend und ohne Unterbrechnung bezogen werden.",
    (lebensmonate) => {
      const lebensmonatszahlenMitBonus = Object.entries(lebensmonate)
        .filter(([, lebensmonat]) =>
          AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat),
        )
        .map(([lebensmonatszahl]) => Number.parseInt(lebensmonatszahl)) // TODO: use safe record in first place
        .sort((first, second) => first - second);

      return isSequenceIncreasingByOne(lebensmonatszahlenMitBonus);
    },
  );

function isSequenceIncreasingByOne(numbers: number[]): boolean {
  return numbers.every((entry, index) => {
    const predecessor = numbers[index - 1];
    return predecessor === undefined || entry === predecessor + 1;
  });
}

if (import.meta.vitest) {
  const { describe, it, expect, test } = import.meta.vitest;

  describe("Partnerschaftbonus Lebensmonate sind fortlaufend", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

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

    it("is satisfied cross the 9. and 10. Lebensmonat with Partnerschaftsbonus (correct sorting)", () => {
      const lebensmonate = {
        9: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        10: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(BonusLebensmonateSindFortlaufend.asPredicate(lebensmonate)).toBe(
        true,
      );
    });

    test.each([
      { numbers: [], satisfied: true },
      { numbers: [1, 2], satisfied: true },
      { numbers: [1, 3], satisfied: false },
      { numbers: [3, 4, 5, 6], satisfied: true },
      { numbers: [3, 5, 6], satisfied: false },
    ])(
      "the list of $numbers is a sequence increasing by one: $satisfied",
      ({ numbers, satisfied }) => {
        expect(isSequenceIncreasingByOne(numbers)).toBe(satisfied);
      },
    );

    const monat = function (gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
