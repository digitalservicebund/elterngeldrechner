import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import { Variante } from "@/features/planer/domain/Variante";
import type { VerfuegbaresKontingent } from "@/features/planer/domain/verfuegbares-kontingent/VerfuegbaresKontingent";

export function bestimmeVerfuegbaresKontingent(
  ausgangslage: Ausgangslage,
): VerfuegbaresKontingent {
  const { anzahlElternteile, istAlleinerziehend } = ausgangslage;
  const sindPartnermonateVerfuegbar =
    anzahlElternteile === 2 || istAlleinerziehend;

  const anzahlBasisMonate = sindPartnermonateVerfuegbar
    ? ANZAHL_BASIS_MIT_PARTNER_MONATEN
    : MINIMALE_ANZAHL_BASIS_MONATE;

  const anzahlPlusMonate =
    anzahlBasisMonate * ANZAHL_PLUS_MONATE_PRO_BASIS_MONAT;

  return {
    [Variante.Basis]: anzahlBasisMonate,
    [Variante.Plus]: anzahlPlusMonate,
    [Variante.Bonus]: ANZAHL_BONUS_LEBENSMONATE,
  };
}

const MINIMALE_ANZAHL_BASIS_MONATE = 12;
const ANZAHL_BASIS_MIT_PARTNER_MONATEN = 14;
const ANZAHL_BONUS_LEBENSMONATE = 4;
const ANZAHL_PLUS_MONATE_PRO_BASIS_MONAT = 2;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimme verfügbares Kontingent", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");

    it("has 12 Monate Basiselterngeld, 24 Monate ElterngeldPlus and 4 Lebensmonate Partnerschaftbonus for only one Elternteil", () => {
      const kontingent = bestimmeVerfuegbaresKontingent({
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_ONE_ELTERNTEIL,
      });

      expect(kontingent[Variante.Basis]).toBe(12);
      expect(kontingent[Variante.Plus]).toBe(24);
      expect(kontingent[Variante.Bonus]).toBe(4);
    });

    it("has 14 Monate Basiselterngeld, 28 Monate ElterngeldPlus and 4 Lebensmonate Partnerschaftbonus if there are two Elternteile", () => {
      const kontingent = bestimmeVerfuegbaresKontingent({
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
      });

      expect(kontingent[Variante.Basis]).toBe(14);
      expect(kontingent[Variante.Plus]).toBe(28);
      expect(kontingent[Variante.Bonus]).toBe(4);
    });

    it("has 14 Monate Basiselterngeld, 28 Monate ElterngeldPlus and 4 Lebensmonate Partnerschaftbonus if it is an alleinerzerziehendes Elternteil", () => {
      const kontingent = bestimmeVerfuegbaresKontingent({
        istAlleinerziehend: true,
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_ONE_ELTERNTEIL,
      });

      expect(kontingent[Variante.Basis]).toBe(14);
      expect(kontingent[Variante.Plus]).toBe(28);
      expect(kontingent[Variante.Bonus]).toBe(4);
    });

    const ANY_PSEUDONYME_ONE_ELTERNTEIL = {
      [Elternteil.Eins]: "Jane",
    };

    const ANY_PSEUDONYME_TWO_ELTERNTEILE = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };
  });
}
