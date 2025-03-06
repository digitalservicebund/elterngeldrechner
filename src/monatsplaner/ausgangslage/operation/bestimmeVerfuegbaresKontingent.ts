import { Variante } from "@/monatsplaner/Variante";
import type { Ausgangslage } from "@/monatsplaner/ausgangslage";
import type { VerfuegbaresKontingent } from "@/monatsplaner/verfuegbares-kontingent/VerfuegbaresKontingent";

export function bestimmeVerfuegbaresKontingent(
  ausgangslage: Ausgangslage,
): VerfuegbaresKontingent {
  const {
    anzahlElternteile,
    istAlleinerziehend,
    mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum,
  } = ausgangslage;

  const sindMehrereElternteile = anzahlElternteile > 1;

  const sindPartnermonateVerfuegbar =
    !!mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum &&
    (istAlleinerziehend || sindMehrereElternteile);

  const anzahlBasisMonate = sindPartnermonateVerfuegbar
    ? ANZAHL_BASIS_MIT_PARTNER_MONATEN
    : MINIMALE_ANZAHL_BASIS_MONATE;

  const anzahlPlusMonate =
    anzahlBasisMonate * ANZAHL_PLUS_MONATE_PRO_BASIS_MONAT;

  const anzahlBonusMonate =
    sindMehrereElternteile || istAlleinerziehend
      ? ANZAHL_BONUS_LEBENSMONATE
      : 0;

  return {
    [Variante.Basis]: anzahlBasisMonate,
    [Variante.Plus]: anzahlPlusMonate,
    [Variante.Bonus]: anzahlBonusMonate,
  };
}

const MINIMALE_ANZAHL_BASIS_MONATE = 12;
const ANZAHL_BASIS_MIT_PARTNER_MONATEN = 14;
const ANZAHL_BONUS_LEBENSMONATE = 4;
const ANZAHL_PLUS_MONATE_PRO_BASIS_MONAT = 2;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimme verfügbares Kontingent", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");

    // TODO: Property test case for plus always double basis
    // TODO: Property test for basis/plus ranging from 12/24 to 14/28.

    describe("for one Elternteil", () => {
      it.each([
        {
          alleinerziehend: false,
          erwerbstaetig: false,
          basis: 12,
          plus: 24,
          bonus: 0,
        },
        {
          alleinerziehend: false,
          erwerbstaetig: true,
          basis: 12,
          plus: 24,
          bonus: 0,
        },
        {
          alleinerziehend: true,
          erwerbstaetig: false,
          basis: 12,
          plus: 24,
          bonus: 4,
        },
        {
          alleinerziehend: true,
          erwerbstaetig: true,
          basis: 14,
          plus: 28,
          bonus: 4,
        },
      ])(
        "determines $basis Monate Basiselterngeld, $plus Monate ElterngeldPlus and $bonus Lebensmonate Partnerschaftsbonus, when alleinerziehend is '$alleinerziehend' and erwerbstätig im Bemessungszeitraum is '$erwerbstaetig'",
        ({ alleinerziehend, erwerbstaetig, basis, plus, bonus }) => {
          const ausgangslage = {
            anzahlElternteile: 1 as const,
            istAlleinerziehend: alleinerziehend,
            mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum:
              erwerbstaetig,
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          };

          const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

          expect(kontingent).toStrictEqual({
            [Variante.Basis]: basis,
            [Variante.Plus]: plus,
            [Variante.Bonus]: bonus,
          });
        },
      );
    });

    describe("for two Elternteile", () => {
      // TODO: Property test case for bonus always 4

      it.each([
        { erwerbstaetig: false, basis: 12, plus: 24 },
        { erwerbstaetig: true, basis: 14, plus: 28 },
      ])(
        "determines $basis Monate Basiselterngeld, $plus Monate ElterngeldPlus and 4 Lebensmonate Partnerschaftsbonus, when erwerbstätig im Bemessungszeitraum is '$erwerbstaetig'",
        ({ erwerbstaetig, basis, plus }) => {
          const ausgangslage = {
            anzahlElternteile: 2 as const,
            mindestensEinElternteilWarErwerbstaetigImBemessungszeitraum:
              erwerbstaetig,
            pseudonymeDerElternteile: ANY_PSEUDONYME,
            geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
          };

          const kontingent = bestimmeVerfuegbaresKontingent(ausgangslage);

          expect(kontingent).toStrictEqual({
            [Variante.Basis]: basis,
            [Variante.Plus]: plus,
            [Variante.Bonus]: 4,
          });
        },
      );
    });

    const ANY_PSEUDONYME = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();
  });
}
