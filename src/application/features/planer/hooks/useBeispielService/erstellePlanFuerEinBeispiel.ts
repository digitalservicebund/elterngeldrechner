import {
  type Ausgangslage,
  type Auswahloption,
  Elternteil,
  type ElternteileByAusgangslage,
  type Lebensmonat,
  Lebensmonatszahlen,
  MONAT_MIT_MUTTERSCHUTZ,
  type Plan,
  Variante,
  erstelleInitialeLebensmonate,
  listeMonateAuf,
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
    lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>>;
    anzahl: number;
  }>,
): Plan<A> {
  const initialeLebensmonate = erstelleInitialeLebensmonate(ausgangslage);
  const relevantAbschnitte = abschnitte.filter(
    (abschnitt) => abschnitt.anzahl > 0,
  );

  const lebensmonate = Lebensmonatszahlen.reduce(
    (lebensmonate, lebensmonatszahl) => {
      const abschnitt = relevantAbschnitte.shift();

      if (abschnitt === undefined) {
        return lebensmonate;
      } else {
        if (abschnitt.anzahl > 1)
          relevantAbschnitte.unshift({
            ...abschnitt,
            anzahl: abschnitt.anzahl - 1,
          });

        const lebensmonat = mergeLebensmonat(
          abschnitt.lebensmonat,
          lebensmonate[lebensmonatszahl],
        );

        return { ...lebensmonate, [lebensmonatszahl]: lebensmonat };
      }
    },
    initialeLebensmonate,
  );

  return { ausgangslage, lebensmonate };
}

/**
 * The "right" Lebensmonat has precedence for any Monats property.
 */
function mergeLebensmonat<E extends Elternteil>(
  left: Lebensmonat<E>,
  right: Lebensmonat<E> | undefined,
): Lebensmonat<E> {
  return listeMonateAuf(left).reduce(
    (lebensmonat, [elternteil]) => ({
      ...lebensmonat,
      [elternteil]: { ...left[elternteil], ...right?.[elternteil] },
    }),
    left,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle Plan für ein Beispiel", () => {
    // TODO: Make this a property test once generators are in place
    it("maintains the given Ausgangslage for the created Plan", () => {
      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 1,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM,
      };

      const plan = erstellePlanFuerEinBeispiel(ausgangslage, []);

      expect(plan.ausgangslage).toBe(ausgangslage);
    });

    it("repeats the Lebensmonat of each Abschnitt correctly", () => {
      const abschnitte = [
        {
          lebensmonat: { [Elternteil.Eins]: monat(Variante.Basis) },
          anzahl: 2,
        },
        {
          lebensmonat: { [Elternteil.Eins]: monat(Variante.Plus) },
          anzahl: 1,
        },
        {
          lebensmonat: { [Elternteil.Eins]: monat(Variante.Bonus) },
          anzahl: 3,
        },
      ];

      const plan = erstellePlanFuerEinBeispiel(ANY_AUSGANGSLAGE, abschnitte);

      expect(plan.lebensmonate).toStrictEqual({
        1: { [Elternteil.Eins]: monat(Variante.Basis) },
        2: { [Elternteil.Eins]: monat(Variante.Basis) },
        3: { [Elternteil.Eins]: monat(Variante.Plus) },
        4: { [Elternteil.Eins]: monat(Variante.Bonus) },
        5: { [Elternteil.Eins]: monat(Variante.Bonus) },
        6: { [Elternteil.Eins]: monat(Variante.Bonus) },
      });
    });

    it("merges Lebensmonate of Abschnitte with the initial Lebensmonate of domain based on the Ausgangslage", () => {
      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 2,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Zwei,
          letzterLebensmonatMitSchutz: 1,
        },
        pseudonymeDerElternteile: ANY_PSEUDONYME,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM,
      };

      const abschnitte = [
        {
          lebensmonat: {
            [Elternteil.Eins]: monat(Variante.Plus),
            [Elternteil.Zwei]: monat(Variante.Plus),
          },
          anzahl: 2,
        },
      ];

      const plan = erstellePlanFuerEinBeispiel(ausgangslage, abschnitte);

      expect(plan.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      });
    });

    it("ignores Abschnitte with an Anzahl of 0", () => {
      const abschnitte = [
        {
          lebensmonat: { [Elternteil.Eins]: monat(Variante.Basis) },
          anzahl: 1,
        },
        {
          lebensmonat: { [Elternteil.Eins]: monat(Variante.Plus) },
          anzahl: 0,
        },
        {
          lebensmonat: { [Elternteil.Eins]: monat(Variante.Bonus) },
          anzahl: 1,
        },
      ];

      const plan = erstellePlanFuerEinBeispiel(ANY_AUSGANGSLAGE, abschnitte);

      expect(plan.lebensmonate).toStrictEqual({
        1: { [Elternteil.Eins]: monat(Variante.Basis) },
        2: { [Elternteil.Eins]: monat(Variante.Bonus) },
      });
    });

    function monat(gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    }

    const ANY_GEBURTSDATUM = new Date();

    const ANY_PSEUDONYME = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const ANY_AUSGANGSLAGE = {
      anzahlElternteile: 1 as const,
      geburtsdatumDesKindes: ANY_GEBURTSDATUM,
    };
  });
}
