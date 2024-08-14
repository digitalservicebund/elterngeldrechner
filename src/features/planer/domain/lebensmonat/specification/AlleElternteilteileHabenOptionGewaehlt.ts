import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { MonatHatOptionGewaehlt } from "@/features/planer/domain/monat";
import { Variante } from "@/features/planer/domain/Variante";
import { Specification } from "@/features/planer/domain/common/specification";
import type { LebensmonatMitBeliebigenElternteilen } from "@/features/planer/domain/lebensmonat/Lebensmonat";

export const AlleElternteileHabenBasisGewaehlt =
  AlleElternteileHabenOptionGewaehlt(Variante.Basis);

export const AlleElternteileHabenBonusGewaehlt =
  AlleElternteileHabenOptionGewaehlt(Variante.Bonus);

export function AlleElternteileHabenOptionGewaehlt(
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

    it.each(Auswahloptionen)(
      "is satisfied if %s is expected and all Elternteile have it chosen",
      (option) => {
        const specification = AlleElternteileHabenOptionGewaehlt(option);
        const lebensmonat = {
          [Elternteil.Eins]: {
            gewaehlteOption: option,
            imMutterschutz: false as const,
          },
          [Elternteil.Zwei]: {
            gewaehlteOption: option,
            imMutterschutz: false as const,
          },
        };

        expect(specification.asPredicate(lebensmonat)).toBe(true);
      },
    );

    it.each(Auswahloptionen)(
      "is unsatisfied if %s is expected, but no Elternteil took a choice yet",
      (option) => {
        const specification = AlleElternteileHabenOptionGewaehlt(option);
        const lebensmonat = {
          [Elternteil.Eins]: {
            gewaehlteOption: undefined,
            imMutterschutz: false as const,
          },
          [Elternteil.Zwei]: {
            gewaehlteOption: undefined,
            imMutterschutz: false as const,
          },
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
          [Elternteil.Eins]: {
            gewaehlteOption: eins,
            imMutterschutz: false as const,
          },
          [Elternteil.Zwei]: {
            gewaehlteOption: zwei,
            imMutterschutz: false as const,
          },
        };

        expect(specification.asPredicate(lebensmonat)).toBe(false);
      },
    );
  });
}
