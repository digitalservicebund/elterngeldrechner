import {
  type Auswahloption,
  Elternteil,
  KeinElterngeld,
  type Lebensmonate,
  type Lebensmonatszahl,
  type Monat,
  Variante,
  listeLebensmonateAuf,
  listeMonateAuf,
} from "@/monatsplaner";

/**
 * @returns undefined if no Lebensmonat is considered as planned
 */
export function findeLetztenVerplantenLebensmonat<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
): Lebensmonatszahl | undefined {
  const lebensmonateMitPlanung = listeLebensmonateAuf(lebensmonate).filter(
    ([, lebensmonat]) =>
      listeMonateAuf(lebensmonat).some(([, monat]) =>
        istMonatMitPlanung(monat),
      ),
  );

  if (lebensmonateMitPlanung.length > 0) {
    return Math.max(
      ...lebensmonateMitPlanung.map(([lebensmonatszahl]) => lebensmonatszahl),
    ) as Lebensmonatszahl;
  } else {
    return undefined;
  }
}

function istMonatMitPlanung(monat: Monat): boolean {
  const { gewaehlteOption, bruttoeinkommen } = monat;
  return gewaehlteOption !== undefined || !!bruttoeinkommen;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("finde letzten verplanten Lebensmonat", () => {
    it("finds the last Monat with a chosen Option", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        3: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      const result = findeLetztenVerplantenLebensmonat(lebensmonate);

      expect(result).toEqual(2);
    });

    it("finds the last Monat even it has no Option chosen but Bruttoeinkommen", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        2: {
          [Elternteil.Eins]: monat(undefined, 100),
          [Elternteil.Zwei]: monat(undefined),
        },
        3: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined, 0),
        },
      };

      const result = findeLetztenVerplantenLebensmonat(lebensmonate);

      expect(result).toEqual(2);
    });

    it("finds the last month even with gaps", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };

      const result = findeLetztenVerplantenLebensmonat(lebensmonate);

      expect(result).toEqual(5);
    });

    it("returns undefined if no Lebensmonate is considered as planned", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined, 0),
        },
      };

      const result = findeLetztenVerplantenLebensmonat(lebensmonate);

      expect(result).toBeUndefined();
    });

    function monat(
      gewaehlteOption: Auswahloption | undefined,
      bruttoeinkommen?: number,
    ): Monat {
      return { gewaehlteOption, bruttoeinkommen, imMutterschutz: false };
    }
  });
}
