import {
  type Ausgangslage,
  type Auswahloption,
  type Elternteil,
  type ElternteileByAusgangslage,
  type Lebensmonate,
  type Lebensmonatszahl,
  Lebensmonatszahlen,
  type Plan,
  compareLebensmonatszahlen,
  erstelleInitialenLebensmonat,
  isVariante,
  listeLebensmonateAuf,
  listeMonateAuf,
} from "@/monatsplaner";

export function erstellePlanungsdetails<A extends Ausgangslage>(
  plan: Plan<A>,
): Planungsdetails<ElternteileByAusgangslage<A>> {
  const geplanteLebensmonate = trimDownAndFillUpLebensmonate(plan);
  return { geplanteLebensmonate };
}

function trimDownAndFillUpLebensmonate<A extends Ausgangslage>(
  plan: Plan<A>,
): Lebensmonate<ElternteileByAusgangslage<A>> {
  const lastPlannedLebensmonat =
    findLastLebensmonatszahlWithPlannedMonat(plan.lebensmonate) ?? 0;

  return Lebensmonatszahlen.filter(
    (lebensmonatszahl) => lebensmonatszahl <= lastPlannedLebensmonat,
  ).reduce<Lebensmonate<ElternteileByAusgangslage<A>>>(
    (filledLebensmonate, lebensmonatszahl) => ({
      ...filledLebensmonate,
      [lebensmonatszahl]:
        plan.lebensmonate[lebensmonatszahl] ??
        erstelleInitialenLebensmonat(plan.ausgangslage, lebensmonatszahl),
    }),
    {},
  );
}

function findLastLebensmonatszahlWithPlannedMonat<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
): Lebensmonatszahl | undefined {
  return listeLebensmonateAuf(lebensmonate)
    .toSorted(([left], [right]) => compareLebensmonatszahlen(left, right))
    .findLast(([, lebensmonat]) =>
      listeMonateAuf(lebensmonat).some(([, monat]) =>
        isVariante(monat.gewaehlteOption),
      ),
    )?.[0];
}

type Planungsdetails<E extends Elternteil> = {
  readonly geplanteLebensmonate: Lebensmonate<E>;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle Planungsdetails", async () => {
    const { Elternteil, Variante, KeinElterngeld } = await import(
      "@/monatsplaner"
    );

    it("removes Lebensmonate without any chosen Option", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(undefined),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
        3: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const planungsdetails = erstellePlanungsdetails(plan);

      expect(planungsdetails.geplanteLebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(undefined),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      });
    });

    it("fills up gaps of unplanned Lebensmonate", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(undefined),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      const planungsdetails = erstellePlanungsdetails(plan);

      expect(planungsdetails.geplanteLebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(undefined),
        },
        2: {
          [Elternteil.Eins]: { imMutterschutz: false },
          [Elternteil.Zwei]: { imMutterschutz: false },
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      });
    });

    function monat(
      gewaehlteOption: Auswahloption | undefined,
      elterngeldbezug?: number | null,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    }

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };
  });
}
