import { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { LebensmonatMitBeliebigenElternteilen } from "@/monatsplaner/Lebensmonat";
import { MonatHatOptionGewaehlt } from "@/monatsplaner/Monat";
import { Variante } from "@/monatsplaner/Variante";
import { Specification } from "@/monatsplaner/common/specification";

export const IrgendeinElternteilHatBasisGewaehlt =
  IrgendeinElternteilHatOptionGewaehlt(Variante.Basis);

export const IrgendeinElternteilHatBonusGewaehlt =
  IrgendeinElternteilHatOptionGewaehlt(Variante.Bonus);

function IrgendeinElternteilHatOptionGewaehlt(option: Auswahloption) {
  return Specification.fromPredicate<LebensmonatMitBeliebigenElternteilen>(
    `Kein Elternteil hat ${option} gewählt`,
    (lebensmonat) =>
      Object.values(lebensmonat).some(
        MonatHatOptionGewaehlt(option).asPredicate,
      ),
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("irgendein Elternteil hat Option gewählt", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { Auswahloptionen, KeinElterngeld } = await import(
      "@/monatsplaner/Auswahloption"
    );

    it.each(Auswahloptionen)(
      "is satisfied if %s is demanded and an Elternteil has chosen it",
      (option) => {
        const lebensmonat = {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(option),
        };
        const specification = IrgendeinElternteilHatOptionGewaehlt(option);

        expect(specification.asPredicate(lebensmonat)).toBe(true);
      },
    );

    it.each(Auswahloptionen)(
      "is not satisfied if %s is demanded but no Elternteil made a choice yet",
      (option) => {
        const lebensmonat = {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        };
        const specification = IrgendeinElternteilHatOptionGewaehlt(option);

        expect(specification.asPredicate(lebensmonat)).toBe(false);
      },
    );

    it("is not satisfied if no Elternteil chose the demanded Option", () => {
      const lebensmonat = {
        [Elternteil.Eins]: monat(Variante.Plus),
        [Elternteil.Zwei]: monat(Variante.Basis),
      };
      const specification = IrgendeinElternteilHatOptionGewaehlt(
        Variante.Bonus,
      );

      expect(specification.asPredicate(lebensmonat)).toBe(false);
    });

    function monat(gewaehlteOption?: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
