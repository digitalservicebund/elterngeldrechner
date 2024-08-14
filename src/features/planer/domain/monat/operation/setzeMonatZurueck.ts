import {
  MONAT_MIT_MUTTERSCHUTZ,
  Monat,
} from "@/features/planer/domain/monat/Monat";

export function setzeMonatZurueck(monat: Monat): Monat {
  return monat.imMutterschutz
    ? MONAT_MIT_MUTTERSCHUTZ
    : { imMutterschutz: false };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("setzte Monat zurück", async () => {
    const { erstelleInitialenMonat } = await import("./erstelleInitialenMonat");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("keeps a Monat im Mutterschutz untouched", () => {
      const monat = setzeMonatZurueck(MONAT_MIT_MUTTERSCHUTZ);

      expect(monat).toBe(MONAT_MIT_MUTTERSCHUTZ);
    });

    it("keeps an ungeplanten Monat as is", () => {
      const ungeplanterMonat = erstelleInitialenMonat(false);
      const monat = setzeMonatZurueck(ungeplanterMonat);

      expect(monat).toEqual(ungeplanterMonat);
    });

    it("turns any Monat ohne Mutterschutz into an ungeplanten Monat again", () => {
      const ungeplanterMonat = erstelleInitialenMonat(false);
      const monat = setzeMonatZurueck({
        gewaehlteOption: Variante.Plus,
        elterngeldbezug: 10,
        imMutterschutz: false as const,
      });

      expect(monat).toEqual(ungeplanterMonat);
    });
  });
}
