import {
  type Ausgangslage,
  AusgangslageFuerEinElternteil,
  AusgangslageFuerZweiElternteile,
  type Auswahloption,
  type BerechneElterngeldbezuegeCallback,
  Elternteil,
  type ElternteileByAusgangslage,
  type Lebensmonat,
  Lebensmonatszahlen,
  MONAT_MIT_MUTTERSCHUTZ,
  type Plan,
  Variante,
  aktualisiereElterngeldbezuege,
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
  abschnitte: Abschnitt<A>[],
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback | undefined,
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
        if (abschnitt.anzahl > 1) {
          relevantAbschnitte.unshift({
            ...abschnitt,
            anzahl: abschnitt.anzahl - 1,
          });
        }

        const lebensmonat = mergeLebensmonat(
          abschnitt.lebensmonat,
          lebensmonate[lebensmonatszahl],
        );

        return { ...lebensmonate, [lebensmonatszahl]: lebensmonat };
      }
    },
    initialeLebensmonate,
  );

  const plan = { ausgangslage, lebensmonate };

  if (berechneElterngeldbezuege) {
    return aktualisiereElterngeldbezuege(berechneElterngeldbezuege, plan);
  } else {
    return plan;
  }
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

type Abschnitt<A extends Ausgangslage> = {
  lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>>;
  anzahl: number;
};

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  // TODO: Make this a property test once generators are in place

  describe("erstelle Plan für ein Beispiel", async () => {
    const { getRecordEntriesWithIntegerKeys } = await import(
      "@/application/utilities"
    );

    const { KeinElterngeld, isLebensmonatszahl } = await import(
      "@/monatsplaner"
    );

    it("maintains the given Ausgangslage for the created Plan", () => {
      const berechneElterngeldbezuege = vi
        .fn()
        .mockImplementation(staticElterngeldbezuege);

      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 1,
        geburtsdatumDesKindes: new Date(),
      };

      const abschnitte: Abschnitt<AusgangslageFuerEinElternteil>[] = [];

      const plan = erstellePlanFuerEinBeispiel(
        ausgangslage,
        abschnitte,
        berechneElterngeldbezuege,
      );

      expect(plan.ausgangslage).toBe(ausgangslage);
    });

    it("repeats the Lebensmonat of each Abschnitt correctly", () => {
      const berechneElterngeldbezuege = vi
        .fn()
        .mockImplementation(staticElterngeldbezuege);

      const ausgangslage = {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: new Date(),
      };

      const abschnitte: Abschnitt<AusgangslageFuerEinElternteil>[] = [
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

      const plan = erstellePlanFuerEinBeispiel(
        ausgangslage,
        abschnitte,
        berechneElterngeldbezuege,
      );

      expect(plan.lebensmonate).toStrictEqual({
        1: { [Elternteil.Eins]: monat(Variante.Basis, 200) },
        2: { [Elternteil.Eins]: monat(Variante.Basis, 200) },
        3: { [Elternteil.Eins]: monat(Variante.Plus, 100) },
        4: { [Elternteil.Eins]: monat(Variante.Bonus, 50) },
        5: { [Elternteil.Eins]: monat(Variante.Bonus, 50) },
        6: { [Elternteil.Eins]: monat(Variante.Bonus, 50) },
      });
    });

    it("merges Lebensmonate of Abschnitte with the initial Lebensmonate of domain based on the Ausgangslage", () => {
      const berechneElterngeldbezuege = vi
        .fn()
        .mockImplementation(staticElterngeldbezuege);

      const ausgangslage: Ausgangslage = {
        anzahlElternteile: 2,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Zwei,
          letzterLebensmonatMitSchutz: 1,
        },
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      };

      const abschnitte: Abschnitt<AusgangslageFuerZweiElternteile>[] = [
        {
          lebensmonat: {
            [Elternteil.Eins]: monat(Variante.Plus),
            [Elternteil.Zwei]: monat(Variante.Plus),
          },
          anzahl: 2,
        },
      ];

      const plan = erstellePlanFuerEinBeispiel(
        ausgangslage,
        abschnitte,
        berechneElterngeldbezuege,
      );

      expect(plan.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Plus, 100),
          [Elternteil.Zwei]: MONAT_MIT_MUTTERSCHUTZ,
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Plus, 100),
          [Elternteil.Zwei]: monat(Variante.Plus, 100),
        },
      });
    });

    it("ignores Abschnitte with an Anzahl of 0", () => {
      const berechneElterngeldbezuege = vi
        .fn()
        .mockImplementation(staticElterngeldbezuege);

      const ausgangslage = {
        anzahlElternteile: 1 as const,
        geburtsdatumDesKindes: new Date(),
      };

      const abschnitte: Abschnitt<AusgangslageFuerEinElternteil>[] = [
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

      const plan = erstellePlanFuerEinBeispiel(
        ausgangslage,
        abschnitte,
        berechneElterngeldbezuege,
      );

      expect(plan.lebensmonate).toStrictEqual({
        1: { [Elternteil.Eins]: monat(Variante.Basis, 200) },
        2: { [Elternteil.Eins]: monat(Variante.Bonus, 50) },
      });
    });

    function monat(gewaehlteOption: Auswahloption, elterngeldbezug?: number) {
      return {
        gewaehlteOption,
        imMutterschutz: false as const,
        elterngeldbezug: elterngeldbezug ? elterngeldbezug : undefined,
      };
    }

    const staticElterngeldbezuege: BerechneElterngeldbezuegeCallback = (
      _,
      monate,
    ) => {
      const mockBetraege: Record<Auswahloption, number> = {
        [Variante.Basis]: 200,
        [Variante.Plus]: 100,
        [Variante.Bonus]: 50,
        [KeinElterngeld]: 0,
      };

      return Object.fromEntries(
        getRecordEntriesWithIntegerKeys(monate, isLebensmonatszahl)
          .filter(([_, monat]) => monat.gewaehlteOption !== undefined)
          .map(([lebensmonatszahl, monat]) => [
            lebensmonatszahl,
            mockBetraege[monat.gewaehlteOption!],
          ]),
      );
    };
  });
}
