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

export function erstelleMonatsverteilung<E extends Elternteil>(
  lebensmonate: [Lebensmonatszahl, Lebensmonat<E>][],
  elternteil: E,
) {
  const monatsverteilung = berrechneMonatsverteilung(lebensmonate, elternteil);
  const beschreibung = generiereMonatsverteilungBeschreibung(monatsverteilung);
  const summe = summiereMonatsverteilung(monatsverteilung);

  return { monatsverteilung, beschreibung, summe };
}

/**
 * Computes a run-length encoding of the chosen options for the given array of Lebensmonate.
 *
 * For each Lebensmonat, the gewaehlteOption of the specified Elternteil is extracted. The
 * options defaults to KeinElterngeld if undefined.
 *
 * Consecutive identical options are then grouped together into tuples of the Lebensmonatszahl
 * and the count, where count represents the number of consecutive months with the same option.
 */
function berrechneMonatsverteilung<E extends Elternteil>(
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
function summiereMonatsverteilung(monatsverteilung: Monatsverteilung) {
  return monatsverteilung
    .filter(([variante, _]) => variante !== KeinElterngeld)
    .map(([_, anzahl]) => anzahl)
    .reduce((acc, curr) => acc + (curr ?? 0), 0);
}

/**
 * Converts the given verteilung in a string that can be used for example
 * as aria description.
 */
function generiereMonatsverteilungBeschreibung(
  verteilung: [Auswahloption, number][],
): string {
  const { beschreibungen } = verteilung.reduce(
    (acc, [option, dauer]) => {
      const startMonat = acc.aktuellerMonat;
      const endMonat = startMonat + dauer - 1;

      const beschreibung =
        endMonat > startMonat
          ? `${option} Monat ${startMonat}-${endMonat}`
          : `${option} Monat ${startMonat}`;

      return {
        aktuellerMonat: endMonat + 1,
        beschreibungen: [...acc.beschreibungen, beschreibung],
      };
    },
    { aktuellerMonat: 1, beschreibungen: [] as string[] },
  );

  return beschreibungen.join(", ");
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  type LebensmonateEinElternteil = Lebensmonate<
    ElternteileByAusgangslage<AusgangslageFuerEinElternteil>
  >;

  describe("generiereMonatsverteilungBeschreibung", () => {
    it("generates beschreibung for a simple case of 12 monate basis straight", () => {
      const text = generiereMonatsverteilungBeschreibung([
        [Variante.Basis, 12],
      ]);

      expect(text).toEqual("Basiselterngeld Monat 1-12");
    });

    it("generates beschreibung for basis followed by no other planned months", () => {
      const text = generiereMonatsverteilungBeschreibung([
        [Variante.Basis, 6],
        [KeinElterngeld, 6],
      ]);

      expect(text).toEqual(
        "Basiselterngeld Monat 1-6, kein Elterngeld Monat 7-12",
      );
    });

    it("generates beschreibung for basis followed by a pause and ending with basis again", () => {
      const text = generiereMonatsverteilungBeschreibung([
        [Variante.Basis, 2],
        [KeinElterngeld, 10],
        [Variante.Basis, 2],
      ]);

      expect(text).toEqual(
        "Basiselterngeld Monat 1-2, kein Elterngeld Monat 3-12, Basiselterngeld Monat 13-14",
      );
    });

    it("generates a single number for a single monat", () => {
      const text = generiereMonatsverteilungBeschreibung([
        [Variante.Basis, 2],
        [KeinElterngeld, 10],
        [Variante.Basis, 1],
      ]);

      expect(text).toEqual(
        "Basiselterngeld Monat 1-2, kein Elterngeld Monat 3-12, Basiselterngeld Monat 13",
      );
    });
  });

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

      const monatsverteilung = berrechneMonatsverteilung(
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

      const monatsverteilung = berrechneMonatsverteilung(
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

      const monatsverteilung = berrechneMonatsverteilung(
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
