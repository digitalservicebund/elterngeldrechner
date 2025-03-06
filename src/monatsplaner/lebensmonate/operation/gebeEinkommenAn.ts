import type { Elternteil } from "@/monatsplaner/Elternteil";
import type { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import type { Lebensmonat } from "@/monatsplaner/lebensmonat";
import type { Lebensmonate } from "@/monatsplaner/lebensmonate";
import { gebeEinkommenAn as gebeEinkommenFuerMonatAn } from "@/monatsplaner/monat";

export function gebeEinkommenAn<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: E,
  bruttoeinkommen: number,
  ungeplanterLebensmonat: Lebensmonat<E>,
): Lebensmonate<E> {
  const lebensmonat = lebensmonate[lebensmonatszahl] ?? ungeplanterLebensmonat;

  const angepassterLebensmonat = {
    ...lebensmonat,
    [elternteil]: gebeEinkommenFuerMonatAn(
      lebensmonat[elternteil],
      bruttoeinkommen,
    ),
  };

  return { ...lebensmonate, [lebensmonatszahl]: angepassterLebensmonat };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("gebe Einkommen in Lebensmonaten an", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");

    it("sets the Bruttoneinkommen for the correct Lebensmonat and Elternteil", () => {
      const ungeplanterLebensmonat = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(undefined),
      };

      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(11),
          [Elternteil.Zwei]: monat(12),
        },
        2: {
          [Elternteil.Eins]: monat(21),
          [Elternteil.Zwei]: monat(22),
        },
      };

      const lebensmonateNachher = gebeEinkommenAn(
        lebensmonateVorher,
        2,
        Elternteil.Eins,
        500,
        ungeplanterLebensmonat,
      );

      expect(lebensmonateNachher).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(11),
          [Elternteil.Zwei]: monat(12),
        },
        2: {
          [Elternteil.Eins]: monat(500),
          [Elternteil.Zwei]: monat(22),
        },
      });
    });

    it("can set the bruttoeinkommen for a not yet planned Lebensmonat", () => {
      const ungeplanterLebensmonat = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(undefined),
      };

      const lebensmonateVorher = {
        1: {
          [Elternteil.Eins]: monat(11),
          [Elternteil.Zwei]: monat(12),
        },
      };

      const lebensmonateNachher = gebeEinkommenAn(
        lebensmonateVorher,
        2,
        Elternteil.Eins,
        500,
        ungeplanterLebensmonat,
      );

      expect(lebensmonateNachher).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(11),
          [Elternteil.Zwei]: monat(12),
        },
        2: {
          [Elternteil.Eins]: monat(500),
          [Elternteil.Zwei]: monat(undefined),
        },
      });
    });

    it("can set the bruttoeinkommen for a empty Lebensmonate", () => {
      const ungeplanterLebensmonat = {
        [Elternteil.Eins]: monat(undefined),
        [Elternteil.Zwei]: monat(undefined),
      };
      const lebensmonateVorher = {};

      const lebensmonateNachher = gebeEinkommenAn(
        lebensmonateVorher,
        2,
        Elternteil.Eins,
        500,
        ungeplanterLebensmonat,
      );

      expect(lebensmonateNachher).toStrictEqual({
        2: {
          [Elternteil.Eins]: monat(500),
          [Elternteil.Zwei]: monat(undefined),
        },
      });
    });

    const monat = function (bruttoeinkommen: number | undefined) {
      return {
        bruttoeinkommen,
        imMutterschutz: false as const,
      };
    };
  });
}
