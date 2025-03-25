import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import { LebensmonatMitBeliebigenElternteilen } from "@/monatsplaner/Lebensmonat";
import { MonatHatBonusGewaehlt } from "@/monatsplaner/Monat";
import { Specification } from "@/monatsplaner/common/specification";

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
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { Auswahloptionen } = await import("@/monatsplaner/Auswahloption");

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
