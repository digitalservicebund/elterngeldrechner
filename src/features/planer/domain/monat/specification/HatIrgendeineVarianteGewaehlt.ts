import { isVariante } from "@/features/planer/domain/Variante";
import { Specification } from "@/features/planer/domain/common/specification";
import { Monat } from "@/features/planer/domain/monat/Monat";

export const HatIrgendeineVarianteGewaehlt = Specification.fromPredicate<Monat>(
  "Monat hat keine Option gewählt",
  (monat) => isVariante(monat.gewaehlteOption),
);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("hat irgendeine Variante gewählt", async () => {
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat/Monat"
    );
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is always satisfied for Monat im Mutterschutz", () => {
      expect(
        HatIrgendeineVarianteGewaehlt.asPredicate(MONAT_MIT_MUTTERSCHUTZ),
      ).toBe(true);
    });

    it.each(Object.values(Variante))(
      "it is satisfied if %s is chosen",
      (gewaehlteOption) => {
        const monat = { gewaehlteOption, imMutterschutz: false as const };

        expect(HatIrgendeineVarianteGewaehlt.asPredicate(monat)).toBe(true);
      },
    );

    it("is unsatisfied if Monat has chosen Kein Elterngeld", () => {
      const monat = {
        gewaehlteOption: KeinElterngeld,
        imMutterschutz: false as const,
      };

      expect(HatIrgendeineVarianteGewaehlt.asPredicate(monat)).toBe(false);
    });

    it("is unsatisfied if Monat has no Option chosen at all", () => {
      const monat = {
        gewaehlteOption: undefined,
        imMutterschutz: false as const,
      };

      expect(HatIrgendeineVarianteGewaehlt.asPredicate(monat)).toBe(false);
    });
  });
}
