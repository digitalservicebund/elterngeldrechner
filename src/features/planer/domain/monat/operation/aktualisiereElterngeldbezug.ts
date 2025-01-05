import { KeinElterngeld } from "@/features/planer/domain/Auswahloption";
import type { Elterngeldbezug } from "@/features/planer/domain/Elterngeldbezug";
import type { Monat } from "@/features/planer/domain/monat/Monat";

export function aktualisiereElterngeldbezug(
  monat: Monat,
  elterngeldbezug: Elterngeldbezug | undefined,
): Monat {
  const { imMutterschutz, gewaehlteOption } = monat;
  const hatKeinElterngeldbezug =
    imMutterschutz ||
    gewaehlteOption === undefined ||
    gewaehlteOption === KeinElterngeld;

  if (hatKeinElterngeldbezug) {
    return monat;
  } else {
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

      const aktualisierterMonat = aktualisiereElterngeldbezug(monat, 100);

      expect(aktualisierterMonat).toBe(monat);
    });

    it("should leave Monat without a gewählte Option untouched", () => {
      const monat = {
        gewaehlteOption: undefined,
        imMutterschutz: false as const,
        elterngeldbezug: undefined,
      };

      const aktualisierterMonat = aktualisiereElterngeldbezug(monat, 100);

      expect(aktualisierterMonat).toBe(monat);
    });

    it("should leave Monat with Kein Elterngeld as gewählte Option untouched", () => {
      const monat = {
        gewaehlteOption: KeinElterngeld,
        imMutterschutz: false as const,
        elterngeldbezug: null,
      };

      const aktualisierterMonat = aktualisiereElterngeldbezug(monat, 100);

      expect(aktualisierterMonat).toBe(monat);
    });

    it.each(Object.values(Variante))(
      "updates the Elterngeldbezug for chosen Variante $variante correctly",
      (variante) => {
        const monatVorher = {
          gewaehlteOption: variante,
          imMutterschutz: false as const,
          elterngeldbezug: 0,
        };

        const monat = aktualisiereElterngeldbezug(monatVorher, 100);

        expect(monat.elterngeldbezug).toEqual(100);
      },
    );

    it("can unset the Elterngeldbezug", () => {
      const monat = {
        gewaehlteOption: Variante.Basis,
        imMutterschutz: false as const,
        elterngeldbezug: 100,
      };

      const aktualisierterMonat = aktualisiereElterngeldbezug(monat, undefined);

      expect(aktualisierterMonat.elterngeldbezug).toBeUndefined();
    });
  });
}
