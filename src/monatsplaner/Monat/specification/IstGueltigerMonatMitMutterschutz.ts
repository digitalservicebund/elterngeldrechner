import type { Monat } from "@/monatsplaner/Monat";
import { Variante } from "@/monatsplaner/Variante";
import { Specification } from "@/monatsplaner/common/specification";

export const IstGueltigerMonatMitMutterschutz =
  Specification.fromPredicate<Monat>(
    "Monate im Mutterschutz gelten grundsätzlich als Monate mit Basiselterngeld",
    (monat) => monat.imMutterschutz && monat.gewaehlteOption === Variante.Basis,
  );

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ist gültiger Monat im Mutterschut", async () => {
    const { Auswahloptionen } = await import("@/monatsplaner/Auswahloption");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import("@/monatsplaner/Monat");

    it("is satisfied if im Mutterschutz marker is true and chosen Option is Basiselterngeld", () => {
      const isSatisfied = IstGueltigerMonatMitMutterschutz.asPredicate(
        MONAT_MIT_MUTTERSCHUTZ,
      );

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
        } as never;

        const isSatisfied = IstGueltigerMonatMitMutterschutz.asPredicate(monat);

        expect(isSatisfied).toBe(false);
      },
    );
  });
}
