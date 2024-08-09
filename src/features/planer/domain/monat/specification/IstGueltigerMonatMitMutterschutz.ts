import { Variante } from "@/features/planer/domain/Variante";
import { Specification } from "@/features/planer/domain/common/specification";
import type { Monat } from "@/features/planer/domain/monat";

export const IstGueltigerMonatMitMutterschutz =
  Specification.fromPredicate<Monat>(
    "Im Mutterschutz kann nur Basiselterngeld gewählt werden.",
    (monat) => monat.imMutterschutz && monat.gewaehlteOption === Variante.Basis,
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ist gültiger Monat im Mutterschut", async () => {
    const { Auswahloptionen } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is satisfied if im Mutterschutz marker is true and chosen Option is Basiselterngeld", () => {
      const monat: Monat = {
        imMutterschutz: true,
        gewaehlteOption: Variante.Basis,
        elterngeldbezug: null,
      };

      const isSatisfied = IstGueltigerMonatMitMutterschutz.asPredicate(monat);

      expect(isSatisfied).toBe(true);
    });

    it("is unsatisfied if im Mutterschutz marker is false", () => {
      const monat: Monat = { imMutterschutz: false };

      const isSatisfied = IstGueltigerMonatMitMutterschutz.asPredicate(monat);

      expect(isSatisfied).toBe(false);
    });

    it.each(Auswahloptionen.filter((option) => option !== Variante.Basis))(
      "is unsatisfied if im Mutterschutz marker is true but %s is chosen",
      (option) => {
        const monat = {
          imMutterschutz: true as const,
          gewaehlteOption: option,
        } as any;

        const isSatisfied = IstGueltigerMonatMitMutterschutz.asPredicate(monat);

        expect(isSatisfied).toBe(false);
      },
    );
  });
}
