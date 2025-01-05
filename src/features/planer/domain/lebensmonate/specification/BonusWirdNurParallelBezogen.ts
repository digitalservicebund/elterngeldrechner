import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Specification } from "@/features/planer/domain/common/specification";
import { WennBonusDannAlle } from "@/features/planer/domain/lebensmonat";
import type { LebensmonateMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonate";

export const BonusWirdNurParallelBezogen =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Partnerschaftsbonus kannn nicht einzeln, sondern immer nur von allen Elternteilen gleichzeitig bezogen werden.",
    (lebensmonate) =>
      Object.values(lebensmonate).every(WennBonusDannAlle.asPredicate),
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Partnerschaftsbonus wird nur parallel bezogen", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Auswahloptionen, KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is satisfied if no Bonus is chosen at all", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      expect(BonusWirdNurParallelBezogen.asPredicate(lebensmonate)).toBe(true);
    });

    it("is satisfied if Bonus is taken by all Elternteile or none ", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      expect(BonusWirdNurParallelBezogen.asPredicate(lebensmonate)).toBe(true);
    });

    it("is always satisfied for single Elternteil", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Bonus),
        },
        2: {
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
      };

      expect(BonusWirdNurParallelBezogen.asPredicate(lebensmonate)).toBe(true);
    });

    it.each(Auswahloptionen.filter((option) => option !== Variante.Bonus))(
      "is unsatisfied if one Lebensmonat has Bonus mixed with %s",
      (option) => {
        const lebensmonate = {
          1: {
            [Elternteil.Eins]: monat(Variante.Bonus),
            [Elternteil.Zwei]: monat(Variante.Bonus),
          },
          2: {
            [Elternteil.Eins]: monat(Variante.Bonus),
            [Elternteil.Zwei]: monat(option),
          },
        };

        expect(BonusWirdNurParallelBezogen.asPredicate(lebensmonate)).toBe(
          false,
        );
      },
    );

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
