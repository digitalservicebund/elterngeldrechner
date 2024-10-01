import { MonatHatOptionGewaehlt } from "@/features/planer/domain/monat";
import { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Specification } from "@/features/planer/domain/common/specification";
import type { LebensmonatMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { Variante } from "@/features/planer/domain/Variante";

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
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Auswahloptionen, KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
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
