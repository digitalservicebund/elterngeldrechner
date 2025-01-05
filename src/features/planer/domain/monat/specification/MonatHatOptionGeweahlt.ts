import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Variante } from "@/features/planer/domain/Variante";
import { Specification } from "@/features/planer/domain/common/specification";
import type { Monat } from "@/features/planer/domain/monat/Monat";

export const MonatHatBonusGewaehlt = MonatHatOptionGewaehlt(Variante.Bonus);

export function MonatHatOptionGewaehlt(
  option: Auswahloption,
): Specification<Monat> {
  return Specification.fromPredicate(
    `Monat hat nicht ${option} als Auswahl.`,
    (monat) => monat.gewaehlteOption === option,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Monat hat Option gewählt", async () => {
    const { Auswahloptionen, KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it.each(Auswahloptionen)(
      "is satisfied if %s is chosen and also expected",
      (option) => {
        const specification = MonatHatOptionGewaehlt(option);
        const monat = {
          gewaehlteOption: option,
          imMutterschutz: false as const,
        };

        expect(specification.asPredicate(monat)).toBe(true);
      },
    );

    it.each(Auswahloptionen)(
      "is unsatisfied if no Option is chosen, but %s is expected",
      (option) => {
        const specification = MonatHatOptionGewaehlt(option);
        const monat = {
          gewaehlteOption: undefined,
          imMutterschutz: false as const,
        };

        expect(specification.asPredicate(monat)).toBe(false);
      },
    );

    it.each([
      { gewaehlteOption: Variante.Basis, expectedOption: Variante.Plus },
      { gewaehlteOption: Variante.Plus, expectedOption: Variante.Bonus },
      { gewaehlteOption: KeinElterngeld, expectedOption: Variante.Bonus },
      { gewaehlteOption: Variante.Plus, expectedOption: KeinElterngeld },
    ])(
      "is unsatisfied if $gewaehlteOption is chosen, but $expectedOption was expected",
      ({ gewaehlteOption, expectedOption }) => {
        const specification = MonatHatOptionGewaehlt(expectedOption);
        const monat = {
          gewaehlteOption,
          imMutterschutz: false as const,
        };

        expect(specification.asPredicate(monat)).toBe(false);
      },
    );
  });
}
