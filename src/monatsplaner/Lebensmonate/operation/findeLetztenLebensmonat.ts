import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import {
  type Lebensmonate,
  listeLebensmonateAuf,
} from "@/monatsplaner/Lebensmonate";
import { type Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";

export function findeLetztenLebensmonat<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
): Lebensmonatszahl {
  const lebensmonatsListe = listeLebensmonateAuf(lebensmonate);

  const [letzterLebensmonat] = lebensmonatsListe[
    lebensmonatsListe.length - 1
  ] ?? [1 as Lebensmonatszahl];

  return letzterLebensmonat;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("finde letzten lebensmonat", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const { KeinElterngeld } = await import("@/monatsplaner/Auswahloption");

    it("findet den 13. lebensmonat bei einer 12 + 1 planung", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        6: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        7: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        8: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        9: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        10: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        11: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        12: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        13: {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
      };

      const letzterLebensmonat = findeLetztenLebensmonat(lebensmonate);

      expect(letzterLebensmonat).toEqual(13);
    });

    it("findet den 1. lebensmonat bei einer leeren planung", () => {
      const lebensmonate = {};

      const letzterLebensmonat = findeLetztenLebensmonat(lebensmonate);

      expect(letzterLebensmonat).toEqual(1);
    });

    it("findet den 5. lebensmonat bei einer planung zwei Basis, zwei leere und ein Basismonat", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        3: {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        4: {
          [Elternteil.Eins]: monat(KeinElterngeld),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      const letzterLebensmonat = findeLetztenLebensmonat(lebensmonate);

      expect(letzterLebensmonat).toEqual(5);
    });

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };
  });
}
