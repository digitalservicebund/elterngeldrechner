import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { MonatHatOptionGewaehlt } from "@/features/planer/domain/monat";
import { Variante } from "@/features/planer/domain/Variante";
import { Specification } from "@/features/planer/domain/common/specification";
import type { LebensmonatMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonat/Lebensmonat";

export const AlleElternteileHabenBasisGewaehlt =
  AlleElternteileHabenOptionGewaehlt(Variante.Basis);

export const AlleElternteileHabenBonusGewaehlt =
  AlleElternteileHabenOptionGewaehlt(Variante.Bonus);

function AlleElternteileHabenOptionGewaehlt(
  option: Auswahloption,
): Specification<LebensmonatMitBeliebigenElternteilen> {
  return Specification.fromPredicate(
    `Nicht alle Elternteile haben ${Variante.Basis} in diesem Lebensmonat bezogen.`,
    (lebensmonat) => {
      const anzahlElternteile = Object.keys(lebensmonat).length;
      const monateMitOption = Object.values(lebensmonat).filter(
        MonatHatOptionGewaehlt(option).asPredicate,
      ).length;

      return monateMitOption === anzahlElternteile;
    },
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Alle Elternteile haben Option gewählt", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Auswahloptionen, KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat"
    );

    it.each(Auswahloptionen)(
      "is satisfied if %s is expected and all Elternteile have it chosen",
      (option) => {
        const specification = AlleElternteileHabenOptionGewaehlt(option);
        const lebensmonat = {
          [Elternteil.Eins]: monat(option),
          [Elternteil.Zwei]: monat(option),
        };

        expect(specification.asPredicate(lebensmonat)).toBe(true);
      },
    );

    it.each(Auswahloptionen)(
      "is unsatisfied if %s is expected, but no Elternteil took a choice yet",
      (option) => {
        const specification = AlleElternteileHabenOptionGewaehlt(option);
        const lebensmonat = {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        };

        expect(specification.asPredicate(lebensmonat)).toBe(false);
      },
    );

    it.each([
      { expected: Variante.Basis, eins: Variante.Basis, zwei: Variante.Plus },
      { expected: Variante.Basis, eins: Variante.Bonus, zwei: Variante.Basis },
      { expected: Variante.Basis, eins: KeinElterngeld, zwei: Variante.Plus },
      { expected: Variante.Plus, eins: KeinElterngeld, zwei: Variante.Plus },
      { expected: KeinElterngeld, eins: KeinElterngeld, zwei: Variante.Bonus },
    ])(
      "is unsatisfied if $expected is expected, but Elternteil 1 chose $eins and Elternteil 2 chose $zwei",
      ({ expected, eins, zwei }) => {
        const specification = AlleElternteileHabenOptionGewaehlt(expected);
        const lebensmonat = {
          [Elternteil.Eins]: monat(eins),
          [Elternteil.Zwei]: monat(zwei),
        };

        expect(specification.asPredicate(lebensmonat)).toBe(false);
      },
    );

    it("is satisfied if one Elternteil is im Mutterschutz and the other chose Basiselterngeld", () => {
      const specification = AlleElternteileHabenOptionGewaehlt(Variante.Basis);
      const lebensmonat = {
        [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ,
        [Elternteil.Zwei]: monat(Variante.Basis),
      };

      expect(specification.asPredicate(lebensmonat)).toBe(true);
    });

    function monat(gewaehlteOption: Auswahloption | undefined) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }
  });
}
