import {
  MONAT_MIT_MUTTERSCHUTZ,
  Monat,
} from "@/features/planer/domain/monat/Monat";

export function setzeOptionZurueck(monat: Monat): Monat {
  if (monat.imMutterschutz) {
    return monat;
  } else {
    const monatOhneOption = { ...monat };
    delete monatOhneOption.gewaehlteOption;
    delete monatOhneOption.elterngeldbezug;
    return monatOhneOption;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("setzte Option zurück", async () => {
    const { erstelleInitialenMonat } = await import("./erstelleInitialenMonat");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("keeps a Monat im Mutterschutz untouched", () => {
      const monat = setzeOptionZurueck(MONAT_MIT_MUTTERSCHUTZ);

      expect(monat).toBe(MONAT_MIT_MUTTERSCHUTZ);
    });

    it("keeps an ungeplanten Monat as is", () => {
      const ungeplanterMonat = erstelleInitialenMonat(false);
      const monat = setzeOptionZurueck(ungeplanterMonat);

      expect(monat).toStrictEqual(ungeplanterMonat);
    });

    it("unsets the chosen Option and related Elterngeldbezug for any Monat ohne Mutterschutz", () => {
      const monat = setzeOptionZurueck({
        gewaehlteOption: Variante.Basis,
        elterngeldbezug: 1,
        bruttoeinkommen: 2,
        imMutterschutz: false as const,
      });

      expect(monat.gewaehlteOption).toBeUndefined();
      expect(monat.elterngeldbezug).toBeUndefined();
      expect(monat.bruttoeinkommen).toBe(2);
    });
  });
}
