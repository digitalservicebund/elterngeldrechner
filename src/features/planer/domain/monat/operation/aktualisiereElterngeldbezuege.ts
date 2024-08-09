import type { Monat } from "@/features/planer/domain/monat/Monat";
import { KeinElterngeld } from "@/features/planer/domain/Auswahloption";
import type { ElterngeldbezugProVariante } from "@/features/planer/domain/Elterngeldbezuege";

export function aktualisiereElterngeldbezug(
  monat: Monat,
  elterngeldbezuege: ElterngeldbezugProVariante,
): Monat {
  const { imMutterschutz, gewaehlteOption } = monat;
  const hatKeinElterngeldbezug =
    imMutterschutz ||
    gewaehlteOption === undefined ||
    gewaehlteOption === KeinElterngeld;

  if (hatKeinElterngeldbezug) {
    return monat;
  } else {
    const elterngeldbezug = elterngeldbezuege[gewaehlteOption];
    return { ...monat, elterngeldbezug };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("aktualisiere Elterngeldbezüge im Monat", async () => {
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { MONAT_MIT_MUTTERSCHUTZ } = await import(
      "@/features/planer/domain/monat"
    );

    it("should leave Monat mit Mutterschutz untouched", () => {
      const monat = MONAT_MIT_MUTTERSCHUTZ;

      const aktualisierterMonat = aktualisiereElterngeldbezug(
        monat,
        ANY_ELTERNGELDBEZUEGE,
      );

      expect(aktualisierterMonat).toBe(monat);
    });

    it("should leave Monat without a gewählte Option untouched", () => {
      const monat = {
        gewaehlteOption: undefined,
        imMutterschutz: false as const,
        elterngeldbezug: undefined,
      };

      const aktualisierterMonat = aktualisiereElterngeldbezug(
        monat,
        ANY_ELTERNGELDBEZUEGE,
      );

      expect(aktualisierterMonat).toBe(monat);
    });

    it("should leave Monat with Kein Elterngeld as gewählte Option untouched", () => {
      const monat = {
        gewaehlteOption: KeinElterngeld,
        imMutterschutz: false as const,
        elterngeldbezug: null,
      };

      const aktualisierterMonat = aktualisiereElterngeldbezug(
        monat,
        ANY_ELTERNGELDBEZUEGE,
      );

      expect(aktualisierterMonat).toBe(monat);
    });

    it.each([
      { variante: Variante.Basis, elterngeldbezug: 10 },
      { variante: Variante.Plus, elterngeldbezug: 20 },
      { variante: Variante.Bonus, elterngeldbezug: 30 },
    ])(
      "updates the Elterngeldbezug of $elterngeldbezug for chosen Variante $variante correctly",
      ({ variante, elterngeldbezug }) => {
        const monatVorher = {
          gewaehlteOption: variante,
          imMutterschutz: false as const,
          elterngeldbezug: 0,
        };

        const elterngeldbezuege = {
          ...ANY_ELTERNGELDBEZUEGE,
          [variante]: elterngeldbezug,
        };

        const monat = aktualisiereElterngeldbezug(
          monatVorher,
          elterngeldbezuege,
        );

        expect(monat.elterngeldbezug).toEqual(elterngeldbezug);
      },
    );

    const ANY_ELTERNGELDBEZUEGE = {
      [Variante.Basis]: 0,
      [Variante.Plus]: 0,
      [Variante.Bonus]: 0,
      [KeinElterngeld]: 0,
    };
  });
}
