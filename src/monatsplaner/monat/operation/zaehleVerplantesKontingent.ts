import { KeinElterngeld } from "@/monatsplaner/Auswahloption";
import { Variante } from "@/monatsplaner/Variante";
import type { Monat } from "@/monatsplaner/monat/Monat";
import {
  LEERES_VERPLANTES_KONTINGENT,
  VerplantesKontingent,
} from "@/monatsplaner/verplantes-kontingent";

export function zaehleVerplantesKontingent(monat: Monat): VerplantesKontingent {
  const { gewaehlteOption } = monat;
  const istBasis = gewaehlteOption === Variante.Basis;
  const istPlus = gewaehlteOption === Variante.Plus;
  const istBonus = gewaehlteOption === Variante.Bonus;
  const istKeinElterngeld = gewaehlteOption === KeinElterngeld;

  if (gewaehlteOption === undefined) {
    return LEERES_VERPLANTES_KONTINGENT;
  } else {
    return {
      [Variante.Basis]: istBasis ? 1 : istPlus ? 0.5 : 0,
      [Variante.Plus]: istPlus ? 1 : istBasis ? 2 : 0,
      [Variante.Bonus]: istBonus ? 1 : 0,
      [KeinElterngeld]: istKeinElterngeld ? 1 : 0,
    };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("zähle verplantes Kontingent in Monat", async () => {
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("counts Basiselterngeld also as double ElterngelddPlus", () => {
      const monat = {
        gewaehlteOption: Variante.Basis,
        imMutterschutz: false as const,
      };

      const kontingent = zaehleVerplantesKontingent(monat);

      expect(kontingent[Variante.Basis]).toBe(1);
      expect(kontingent[Variante.Plus]).toBe(2);
      expect(kontingent[Variante.Bonus]).toBe(0);
      expect(kontingent[KeinElterngeld]).toBe(0);
    });

    it("counts ElterngeldPlus also as half Basiselterngeld", () => {
      const monat = {
        gewaehlteOption: Variante.Plus,
        imMutterschutz: false as const,
      };

      const kontingent = zaehleVerplantesKontingent(monat);

      expect(kontingent[Variante.Basis]).toBe(0.5);
      expect(kontingent[Variante.Plus]).toBe(1);
      expect(kontingent[Variante.Bonus]).toBe(0);
      expect(kontingent[KeinElterngeld]).toBe(0);
    });

    it("counts Partnerschaftsbonus solely as one", () => {
      const monat = {
        gewaehlteOption: Variante.Bonus,
        imMutterschutz: false as const,
      };

      const kontingent = zaehleVerplantesKontingent(monat);

      expect(kontingent[Variante.Basis]).toBe(0);
      expect(kontingent[Variante.Plus]).toBe(0);
      expect(kontingent[Variante.Bonus]).toBe(1);
      expect(kontingent[KeinElterngeld]).toBe(0);
    });

    it("counts Kein Elterngeld solely as one", () => {
      const monat = {
        gewaehlteOption: KeinElterngeld,
        imMutterschutz: false as const,
      };

      const kontingent = zaehleVerplantesKontingent(monat);

      expect(kontingent[Variante.Basis]).toBe(0);
      expect(kontingent[Variante.Plus]).toBe(0);
      expect(kontingent[Variante.Bonus]).toBe(0);
      expect(kontingent[KeinElterngeld]).toBe(1);
    });
  });
}
