import {
  type Ausgangslage,
  Elternteil,
  type ElternteileByAusgangslage,
  type Lebensmonat,
  Lebensmonatszahlen,
  MONAT_MIT_MUTTERSCHUTZ,
  type Plan,
  Variante,
  erstelleInitialeLebensmonate,
} from "@/monatsplaner";

/**
 * A convenience function to simplify the creation of {@link Plan} for examples.
 *
 * It is based on the assumption that all example Plans are based on multiple
 * Abschnitte. Within each Abschnitt, the exact same choices for a Lebensmonat
 * apply. How many Lebensmonate an Abschnitt span might vary dynamically for
 * examples and it must be straight forward to define this as input.
 *
 * Moreover, it takes care to always apply the initial Lebensmonate based on the
 * domain logic. This takes care of Monate with Mutterschutz for example. It
 * must taken into account when creating examples that this might alternate the
 * resulting Plan.
 */
export function erstellePlanFuerEinBeispiel<A extends Ausgangslage>(
  ausgangslage: A,
  abschnitte: Array<{
    lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>> | undefined;
    anzahl: number;
  }>,
): Plan<A> {
  const relevantAbschnitte = abschnitte.filter(
    (abschnitt) => abschnitt.anzahl > 0,
  );

  const lebensmonateByAbschnitte = Lebensmonatszahlen.reduce(
    (lebensmonate, lebensmonatszahl) => {
      const { anzahl, lebensmonat } = relevantAbschnitte.shift() ?? {
        anzahl: 0,
      };

      if (anzahl > 1)
        relevantAbschnitte.unshift({ anzahl: anzahl - 1, lebensmonat });

      return lebensmonat !== undefined
        ? { ...lebensmonate, [lebensmonatszahl]: lebensmonat }
        : lebensmonate;
    },
    {},
  );

  return {
    ausgangslage,
    lebensmonate: {
      ...lebensmonateByAbschnitte,
      ...erstelleInitialeLebensmonate(ausgangslage),
    },
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle Plan für ein Beispiel", () => {
    // TODO: Make this a property test once generators are in place
    it("maintains the given Ausgangslage for the created Plan", () => {
      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 1,
        geburtsdatumDesKindes: new Date(),
      };

      const plan = erstellePlanFuerEinBeispiel(ausgangslage, []);

      expect(plan.ausgangslage).toBe(ausgangslage);
    });

    it("repeats the Lebensmonat of each Abschnitt correctly", () => {
      const abschnitte = [
        { lebensmonat: BASIS, anzahl: 2 },
        { lebensmonat: PLUS, anzahl: 1 },
        { lebensmonat: BONUS, anzahl: 3 },
      ];

      const plan = erstellePlanFuerEinBeispiel(ANY_AUSGANGSLAGE, abschnitte);

      expect(plan.lebensmonate).toStrictEqual({
        1: BASIS,
        2: BASIS,
        3: PLUS,
        4: BONUS,
        5: BONUS,
        6: BONUS,
      });
    });

    it("overwrites Lebensmonate of Abschnitte with the initial Lebensmonate of domain based on the Ausgangslage", () => {
      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 1,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Eins,
          letzterLebensmonatMitSchutz: 1,
        },
        geburtsdatumDesKindes: new Date(),
      };

      const abschnitte = [{ lebensmonat: PLUS, anzahl: 2 }];

      const plan = erstellePlanFuerEinBeispiel(ausgangslage, abschnitte);

      expect(plan.lebensmonate).toStrictEqual({
        1: { [Elternteil.Eins]: MONAT_MIT_MUTTERSCHUTZ },
        2: PLUS,
      });
    });

    it("ignores Abschnitte with an Anzahl of 0", () => {
      const abschnitte = [
        { lebensmonat: BASIS, anzahl: 1 },
        { lebensmonat: PLUS, anzahl: 0 },
        { lebensmonat: BONUS, anzahl: 1 },
      ];

      const plan = erstellePlanFuerEinBeispiel(ANY_AUSGANGSLAGE, abschnitte);

      expect(plan.lebensmonate).toStrictEqual({
        1: BASIS,
        2: BONUS,
      });
    });

    const ANY_AUSGANGSLAGE = {
      anzahlElternteile: 1 as const,
      geburtsdatumDesKindes: new Date(),
    };

    const BASIS = {
      [Elternteil.Eins]: {
        gewaehlteOption: Variante.Basis,
        imMutterschutz: false as const,
      },
    };

    const PLUS = {
      [Elternteil.Eins]: {
        gewaehlteOption: Variante.Plus,
        imMutterschutz: false as const,
      },
    };

    const BONUS = {
      [Elternteil.Eins]: {
        gewaehlteOption: Variante.Bonus,
        imMutterschutz: false as const,
      },
    };
  });
}
