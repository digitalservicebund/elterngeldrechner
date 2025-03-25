import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { WennBonusDannAlle } from "@/monatsplaner/Lebensmonat";
import type { LebensmonateMitBeliebigenElternteilen } from "@/monatsplaner/Lebensmonate";
import { Specification } from "@/monatsplaner/common/specification";

export const BonusWirdNurParallelBezogen =
  Specification.fromPredicate<LebensmonateMitBeliebigenElternteilen>(
    "Partnerschaftsbonus kannn nicht einzeln, sondern immer nur von allen Elternteilen gleichzeitig bezogen werden.",
    (lebensmonate) =>
      Object.values(lebensmonate).every(WennBonusDannAlle.asPredicate),
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Partnerschaftsbonus wird nur parallel bezogen", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { Auswahloptionen, KeinElterngeld } = await import(
      "@/monatsplaner/Auswahloption"
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
