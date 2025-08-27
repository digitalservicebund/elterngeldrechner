import { getRecordEntriesWithStringKeys } from "@/application/utilities";
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
import { isAuswahloption } from "@/monatsplaner/Auswahloption";

export type Monatsverteilung = Partial<Record<Auswahloption, number>>;

export function errechneMonatsverteilung<E extends Elternteil>(
  lebensmonate: [Lebensmonatszahl, Lebensmonat<E>][],
  elternteil: E,
) {
  return lebensmonate
    .map(([_, lebensmonat]) => lebensmonat[elternteil].gewaehlteOption)
    .map((option) => (option === undefined ? KeinElterngeld : option))
    .reduce(
      (counts, key) => ((counts[key] = (counts[key] ?? 0) + 1), counts),
      {} as Monatsverteilung,
    );
}

export function summiereMonatsverteilung(monatsverteilung: Monatsverteilung) {
  return getRecordEntriesWithStringKeys(monatsverteilung, isAuswahloption)
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
      const monatsverteilung: Monatsverteilung = {
        [Variante.Basis]: 5,
        [KeinElterngeld]: 2,
      };

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

      expect(monatsverteilung).toEqual({ "kein Elterngeld": 1 });
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

      expect(monatsverteilung).toEqual({
        Basiselterngeld: 2,
        ElterngeldPlus: 3,
      });
    });
  });
}
