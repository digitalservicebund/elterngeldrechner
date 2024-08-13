import { Variante } from "@/features/planer/domain/Variante";
import {
  LEERES_VERPLANTES_KONTINGENT,
  VerplantesKontingent,
} from "@/features/planer/domain/verplantes-kontingent";
import type { Monat } from "@/features/planer/domain/monat/Monat";
import { KeinElterngeld } from "@/features/planer/domain/Auswahloption";

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
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

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
