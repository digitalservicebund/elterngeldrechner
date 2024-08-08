import type { ElterngeldbezugProVariante } from "@/features/planer/domain/Elterngeldbezuege";
import {
  Auswahloption,
  KeinElterngeld,
} from "@/features/planer/domain/Auswahloption";
import { Variante } from "@/features/planer/domain/Variante";
import { Monat } from "@/features/planer/domain/monat/Monat";

export function waehleOption(
  monat: Monat,
  option: Auswahloption,
  elterngeldbezuege: ElterngeldbezugProVariante,
): Monat {
  if (monat.imMutterschutz && option === Variante.Basis) {
    return monat;
  } else {
    const elterngeldbezug =
      option === KeinElterngeld ? null : elterngeldbezuege[option];

    return {
      gewaehlteOption: option,
      elterngeldbezug,
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
      const monat = waehleOption(
        MONAT_MIT_MUTTERSCHUTZ,
        Variante.Basis,
        ANY_ELTERNGELDBEZUEGE,
      );

      expect(monat).toBe(MONAT_MIT_MUTTERSCHUTZ);
    });

    it.each(Auswahloptionen.filter((option) => option !== Variante.Basis))(
      "changes Monat im Mutterschatz to not be im Mutterschutz if chosing %s",
      (option) => {
        const monat = waehleOption(
          MONAT_MIT_MUTTERSCHUTZ,
          option,
          ANY_ELTERNGELDBEZUEGE,
        );

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
          ANY_ELTERNGELDBEZUEGE,
        );

        expect(monat.gewaehlteOption).toBe(option);
      },
    );

    it.each([
      { variante: Variante.Basis, elterngeldbezug: 10 },
      { variante: Variante.Plus, elterngeldbezug: 20 },
      { variante: Variante.Bonus, elterngeldbezug: 30 },
    ])(
      "sets the Elterngeldbezug of $elterngeldbezug for chosen Variante $variante correctly",
      ({ variante, elterngeldbezug }) => {
        const elterngeldbezuege = {
          ...ANY_ELTERNGELDBEZUEGE,
          [variante]: elterngeldbezug,
        };

        const monat = waehleOption(
          { elterngeldbezug: undefined, imMutterschutz: false },
          variante,
          elterngeldbezuege,
        );

        expect(monat.elterngeldbezug).toBe(elterngeldbezug);
      },
    );

    it("sets the Elterngeldbezug to null if chosing Kein Elterngeld", () => {
      const monat = waehleOption(
        { elterngeldbezug: undefined, imMutterschutz: false },
        KeinElterngeld,
        ANY_ELTERNGELDBEZUEGE,
      );

      expect(monat.elterngeldbezug).toBeNull();
    });
  });

  const ANY_ELTERNGELDBEZUEGE = {
    [Variante.Basis]: 0,
    [Variante.Plus]: 0,
    [Variante.Bonus]: 0,
  };
}
