import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Monat } from "@/monatsplaner/Monat";
import { Variante } from "@/monatsplaner/Variante";
import { Specification } from "@/monatsplaner/common/specification";

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
      "@/monatsplaner/Auswahloption"
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
