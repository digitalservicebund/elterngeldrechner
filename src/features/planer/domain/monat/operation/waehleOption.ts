import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { Variante } from "@/features/planer/domain/Variante";
import { Monat } from "@/features/planer/domain/monat/Monat";

export function waehleOption(monat: Monat, option: Auswahloption): Monat {
  if (monat.imMutterschutz && option === Variante.Basis) {
    return monat;
  } else {
    return {
      ...monat,
      gewaehlteOption: option,
      imMutterschutz: false,
    };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Monat", async () => {
    const { Auswahloptionen } = await import(
      "@/features/planer/domain/Auswahloption"
    );
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat"
    );

    it("keeps the Monat untouched if it is a Monat mit Mutterschutz and Basiselterngeld is chosen", () => {
      const monat = waehleOption(MONAT_MIT_MUTTERSCHUTZ, Variante.Basis);

      expect(monat).toBe(MONAT_MIT_MUTTERSCHUTZ);
    });

    it.each(Auswahloptionen.filter((option) => option !== Variante.Basis))(
      "changes Monat im Mutterschatz to not be im Mutterschutz if chosing %s",
      (option) => {
        const monat = waehleOption(MONAT_MIT_MUTTERSCHUTZ, option);

        expect(monat).not.toBe(MONAT_MIT_MUTTERSCHUTZ);
        expect(monat.imMutterschutz).toBe(false);
      },
    );

    it.each(Auswahloptionen)(
      "sets the gewählte Option of the Monat to %s",
      (option) => {
        const monat = waehleOption(MONAT_MIT_MUTTERSCHUTZ, option);

        expect(monat.gewaehlteOption).toBe(option);
      },
    );
  });
}
