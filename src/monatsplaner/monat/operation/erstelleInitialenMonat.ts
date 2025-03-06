import { MONAT_MIT_MUTTERSCHUTZ, type Monat } from "@/monatsplaner/monat/Monat";

export function erstelleInitialenMonat(imMutterschutz: boolean): Monat {
  return imMutterschutz ? MONAT_MIT_MUTTERSCHUTZ : { imMutterschutz: false };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle initialen Monat", async () => {
    const { Variante } = await import("@/monatsplaner/Variante");

    it("creates fully set Monat mit Mutterschutz", () => {
      const monat = erstelleInitialenMonat(true);

      expect(monat.imMutterschutz).toBe(true);
      expect(monat.gewaehlteOption).toBe(Variante.Basis);
      expect(monat.elterngeldbezug).toBe(null);
    });

    it("creates Monat mit Auswahl with initially empty fields", () => {
      const monat = erstelleInitialenMonat(false);

      expect(monat.imMutterschutz).toBe(false);
      expect(monat.gewaehlteOption).toBeUndefined();
      expect(monat.elterngeldbezug).toBeUndefined();
    });
  });
}
