import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Specification } from "@/features/planer/domain/common/specification";
import { LebensmonatMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { MonatHatBonusGewaehlt } from "@/features/planer/domain/monat";

export const WennBonusDannAlle =
  Specification.fromPredicate<LebensmonatMitBeliebigenElternteilen>(
    "Partnerschaftsbonus kannn nicht einzeln, sondern immer nur von allen Elternteilen gleichzeitig bezogen werden.",
    (lebensmonat) => {
      const anzahlElternteile = Object.keys(lebensmonat).length;
      const anzahlBonus = Object.values(lebensmonat).filter(
        MonatHatBonusGewaehlt.asPredicate,
      ).length;

      return anzahlBonus === 0 || anzahlBonus === anzahlElternteile;
    },
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wenn Partnerschaftsbonus dann alle", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Auswahloptionen } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is satisfied if a single Elternteil takes Partnerschaftsbonus", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus),
      };

      expect(WennBonusDannAlle.asPredicate(lebensmonat)).toBe(true);
    });

    it("is satisfied if both Elternteile take Partnerschaftsbonus", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Bonus),
        [Elternteil.Zwei]: monat(Variante.Bonus),
      };

      expect(WennBonusDannAlle.asPredicate(lebensmonat)).toBe(true);
    });

    it.each(Auswahloptionen.filter((option) => option !== Variante.Bonus))(
      "is unsatisfied if one Elternteil takes Partnerschaftsbonus, but the other one takes %s",
      (option) => {
        const lebensmonat = {
          [Elternteil.Eins]: monat(option),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        };

        expect(WennBonusDannAlle.asPredicate(lebensmonat)).toBe(false);
      },
    );

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
