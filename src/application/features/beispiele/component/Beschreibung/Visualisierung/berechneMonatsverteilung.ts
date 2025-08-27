import { Lebensmonatszahl } from "@/lebensmonatrechner/Lebensmonatszahl";
import {
  AusgangslageFuerEinElternteil,
  Auswahloption,
  Elternteil,
  ElternteileByAusgangslage,
  KeinElterngeld,
  Lebensmonat,
  Lebensmonate,
  Variante,
  listeLebensmonateAuf,
} from "@/monatsplaner";

export type Monatsverteilung = [Auswahloption, number][];

/**
 * Computes a run-length encoding of the chosen options for the given array of Lebensmonate.
 *
 * For each Lebensmonat, the gewaehlteOption of the specified Elternteil is extracted. The
 * options defaults to KeinElterngeld if undefined.
 *
 * Consecutive identical options are then grouped together into tuples of the Lebensmonatszahl
 * and the count, where count represents the number of consecutive months with the same option.
 */
export function errechneMonatsverteilung<E extends Elternteil>(
  lebensmonate: [Lebensmonatszahl, Lebensmonat<E>][],
  elternteil: E,
): [Auswahloption, number][] {
  return lebensmonate
    .map(([_, lebensmonat]) => {
      return lebensmonat[elternteil].gewaehlteOption ?? KeinElterngeld;
    })
    .reduce<[Auswahloption, number][]>((acc, option) => {
      return acc.length === 0
        ? [[option, 1]]
        : acc[acc.length - 1]![0] === option
          ? [...acc.slice(0, -1), [option, acc[acc.length - 1]![1] + 1]]
          : [...acc, [option, 1]];
    }, []);
}

/**
 * Reduces the monatsverteilung back into the sum of all elements which are
 * valid options like Basis, Plus or Bonus.
 */
export function summiereMonatsverteilung(monatsverteilung: Monatsverteilung) {
  return monatsverteilung
    .filter(([variante, _]) => variante !== KeinElterngeld)
    .map(([_, anzahl]) => anzahl)
    .reduce((acc, curr) => acc + (curr ?? 0), 0);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  type LebensmonateEinElternteil = Lebensmonate<
    ElternteileByAusgangslage<AusgangslageFuerEinElternteil>
  >;

  describe("summiereMonatsverteilung", () => {
    it("ignoriert die option kein Elterngeld zur korrekten Summenbildung", () => {
      const monatsverteilung: Monatsverteilung = [
        [Variante.Basis, 5],
        [KeinElterngeld, 2],
      ];

      const summeGeplanteMonate = summiereMonatsverteilung(monatsverteilung);

      expect(summeGeplanteMonate).toEqual(5);
    });
  });

  describe("errechneMonatsverteilung", () => {
    it("ersetzt leere Monate mit kein Elterngeld fuer die Visualisierung", () => {
      const lebensmonate: LebensmonateEinElternteil = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: undefined,
            imMutterschutz: false,
          },
        },
      };

      const monatsverteilung = errechneMonatsverteilung(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(monatsverteilung).toEqual([["kein Elterngeld", 1]]);
    });

    it("errechnet die monatsverteilung nach option", () => {
      const lebensmonate: LebensmonateEinElternteil = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },
        2: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },

        3: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Plus,
            imMutterschutz: false,
          },
        },
        4: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Plus,
            imMutterschutz: false,
          },
        },
        5: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Plus,
            imMutterschutz: false,
          },
        },
      };

      const monatsverteilung = errechneMonatsverteilung(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(monatsverteilung).toEqual([
        [Variante.Basis, 2],
        [Variante.Plus, 3],
      ]);
    });

    it("geht korrekt mit pausen zwischen den monaten um", () => {
      const lebensmonate: LebensmonateEinElternteil = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },
        2: {
          [Elternteil.Eins]: {
            gewaehlteOption: KeinElterngeld,
            imMutterschutz: false,
          },
        },
        3: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },
        4: {
          [Elternteil.Eins]: {
            gewaehlteOption: KeinElterngeld,
            imMutterschutz: false,
          },
        },
        5: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false,
          },
        },
      };

      const monatsverteilung = errechneMonatsverteilung(
        listeLebensmonateAuf(lebensmonate),
        Elternteil.Eins,
      );

      expect(monatsverteilung).toEqual([
        [Variante.Basis, 1],
        [KeinElterngeld, 1],
        [Variante.Basis, 1],
        [KeinElterngeld, 1],
        [Variante.Basis, 1],
      ]);
    });
  });
}
