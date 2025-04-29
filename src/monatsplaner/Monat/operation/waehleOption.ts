import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Monat } from "@/monatsplaner/Monat";
import { Variante } from "@/monatsplaner/Variante";

export function waehleOption(
  monat: Monat,
  option: Auswahloption | undefined,
): Monat {
  if (monat.gewaehlteOption === option) {
    return monat;
  } else {
    return {
      ...monat,
      gewaehlteOption: option,
      elterngeldbezug: undefined, // Can't be known anymore and likely to change.
      bruttoeinkommen: option === undefined ? undefined : monat.bruttoeinkommen,
      imMutterschutz: false,
    };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("wähle Option in Monat", async () => {
    const { Auswahloptionen } = await import("@/monatsplaner/Auswahloption");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import("@/monatsplaner/Monat");

    it("keeps the Monat untouched if the Option to chose matches the already chosen Option", () => {
      const monatVorher = {
        gewaehlteOption: Variante.Plus,
        imMutterschutz: false as const,
      };

      const monat = waehleOption(monatVorher, Variante.Plus);

      expect(monat).toBe(monatVorher);
    });

    it("especially keeps the Monat untouched if it is a Monat mit Mutterschutz and Basiselterngeld gets chosen", () => {
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
        const monat = waehleOption(
          { gewaehlteOption: undefined, imMutterschutz: false },
          option,
        );

        expect(monat.gewaehlteOption).toBe(option);
      },
    );

    it("unsets the Elterngeldbezug when the Option changes", () => {
      const monat = waehleOption(
        {
          gewaehlteOption: Variante.Basis,
          elterngeldbezug: 100,
          imMutterschutz: false,
        },
        Variante.Plus,
      );

      expect(monat.elterngeldbezug).toBeUndefined();
    });

    it("keeps the Bruttoeinkommen when changing the Option", () => {
      const monat = waehleOption(
        {
          gewaehlteOption: Variante.Bonus,
          bruttoeinkommen: 100,
          imMutterschutz: false,
        },
        Variante.Plus,
      );

      expect(monat.bruttoeinkommen).toBe(100);
    });

    it("allows to reset any chosen Option completely, which also unset the Bruttoeinkommen", () => {
      const monat = waehleOption(
        {
          gewaehlteOption: Variante.Plus,
          bruttoeinkommen: 100,
          imMutterschutz: false,
        },
        undefined,
      );

      expect(monat).toStrictEqual({
        gewaehlteOption: undefined,
        bruttoeinkommen: undefined,
        imMutterschutz: false,
        elterngeldbezug: undefined,
      });
    });
  });
}
