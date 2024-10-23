import { teileLebensmonateBeiElternteileAuf } from "./teileLebensmonateBeiElternteileAuf";
import {
  erstelleInitialenLebensmonat,
  listeMonateAuf,
} from "@/features/planer/domain/lebensmonat";
import {
  listeLebensmonateAuf,
  type Lebensmonate,
} from "@/features/planer/domain/lebensmonate";
import {
  berechneZeitraumFuerLebensmonat,
  Zeitraum,
} from "@/features/planer/domain/zeitraum";
import {
  Lebensmonatszahl,
  Lebensmonatszahlen,
} from "@/features/planer/domain/Lebensmonatszahl";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import { isVariante, Variante } from "@/features/planer/domain/Variante";
import { mapRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import {
  isElternteil,
  type Elternteil,
} from "@/features/planer/domain/Elternteil";
import type { Monat } from "@/features/planer/domain/monat";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import type {
  Zusammenfassung,
  Planungsuebersicht,
  PlanungsuebersichtFuerElternteil,
  Bezug,
  Planungsdetails,
} from "@/features/planer/domain/Zusammenfassung";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";

export function fassePlanZusammen<A extends Ausgangslage>(
  plan: Plan<A>,
): Zusammenfassung<ElternteileByAusgangslage<A>> {
  const planungsuebersicht = erstellePlaungsuebersicht(plan);
  const planungsdetails = erstellePlanungsdetails(plan);
  return { planungsuebersicht, planungsdetails };
}

function erstellePlaungsuebersicht<A extends Ausgangslage>(
  plan: Plan<A>,
): Planungsuebersicht<ElternteileByAusgangslage<A>> {
  const { geburtsdatumDesKindes } = plan.ausgangslage;
  const lebensmonateProElternteil = teileLebensmonateBeiElternteileAuf(plan);

  return mapRecordEntriesWithStringKeys<
    ElternteileByAusgangslage<A>,
    Partial<Record<Lebensmonatszahl, Monat>>,
    PlanungsuebersichtFuerElternteil
  >(
    lebensmonateProElternteil,
    isElternteil,
    erstelleUebersichtFuerElternteil.bind({ geburtsdatumDesKindes }),
  );
}

function erstellePlanungsdetails<A extends Ausgangslage>(
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

function erstelleUebersichtFuerElternteil(
  this: { geburtsdatumDesKindes: Date },
  lebensmonate: Partial<Record<Lebensmonatszahl, Monat>>,
): PlanungsuebersichtFuerElternteil {
  const monate = Object.values(lebensmonate);
  const gesamtbezug = berrechneGesamtbezug(monate);
  const zeitraeumeMitDurchgaenigenBezug =
    bestimmeZeitraeumeMitDurchgaengigenBezug(
      lebensmonate,
      this.geburtsdatumDesKindes,
    );
  const bezuegeProVariante = fasseBezuegeAllerVariantenZusammen(monate);

  return { gesamtbezug, zeitraeumeMitDurchgaenigenBezug, bezuegeProVariante };
}

function berrechneGesamtbezug(monate: Monat[]): Bezug {
  const anzahlMonate = monate
    .map((monat) => monat.gewaehlteOption)
    .filter(isVariante).length;

  const elterngeld = summiereFeldAllerMonate(
    monate,
    (monat) => monat.elterngeldbezug ?? 0,
  );

  const bruttoeinkommen = summiereFeldAllerMonate(
    monate,
    (monat) => monat.bruttoeinkommen ?? 0,
  );

  return { anzahlMonate, elterngeld, bruttoeinkommen };
}

function bestimmeZeitraeumeMitDurchgaengigenBezug(
  lebensmonate: Partial<Record<Lebensmonatszahl, Monat>>,
  geburtsdatumDesKindes: Date,
): Zeitraum[] {
  const groupsOfLebensmonatszahlenMitDurchgaengigenBezug =
    Lebensmonatszahlen.reduce(
      (groups, lebensmonatszahl) => {
        const hatBezugImLebensmonat = isVariante(
          lebensmonate[lebensmonatszahl]?.gewaehlteOption,
        );

        if (hatBezugImLebensmonat) {
          const lastGroup = groups[groups.length - 1];
          lastGroup.push(lebensmonatszahl);
        } else {
          groups.push([]);
        }

        return groups;
      },
      [[]] as Lebensmonatszahl[][],
    ).filter((group) => group.length > 0);

  const zeitraeumeByLebensmonatszahlen =
    groupsOfLebensmonatszahlenMitDurchgaengigenBezug.map((group) => ({
      from: group[0],
      to: group[group.length - 1],
    }));

  return zeitraeumeByLebensmonatszahlen.map((zeitraum) => ({
    from: berechneZeitraumFuerLebensmonat(geburtsdatumDesKindes, zeitraum.from)
      .from,
    to: berechneZeitraumFuerLebensmonat(geburtsdatumDesKindes, zeitraum.to).to,
  }));
}

function fasseBezuegeAllerVariantenZusammen(
  monate: Monat[],
): Record<Variante, Bezug> {
  return Object.values(Variante).reduce(
    (zusammenfassung, variante) => ({
      ...zusammenfassung,
      [variante]: fasseBezugVonVarianteZusammen(monate, variante),
    }),
    {} as Record<Variante, Bezug>,
  );
}

function fasseBezugVonVarianteZusammen(
  monate: Monat[],
  variante: Variante,
): Bezug {
  const monateMitVariante = monate.filter(
    (monat) => monat.gewaehlteOption === variante,
  );

  const anzahlMonate = monateMitVariante.length;

  const elterngeld = summiereFeldAllerMonate(
    monateMitVariante,
    (monat) => monat.elterngeldbezug ?? 0,
  );

  const bruttoeinkommen = summiereFeldAllerMonate(
    monateMitVariante,
    (monat) => monat.bruttoeinkommen ?? 0,
  );

  return { anzahlMonate, elterngeld, bruttoeinkommen };
}

function findLastLebensmonatszahlWithPlannedMonat<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
): Lebensmonatszahl | undefined {
  return listeLebensmonateAuf(lebensmonate, true).findLast(([, lebensmonat]) =>
    listeMonateAuf(lebensmonat).some(([, monat]) =>
      isVariante(monat.gewaehlteOption),
    ),
  )?.[0];
}

const summiereFeldAllerMonate = (
  monate: Monat[],
  field: (monat: Monat) => number,
): number => {
  return monate
    .map((monat) => field(monat) ?? 0)
    .reduce((sum, fieldValue) => sum + fieldValue, 0);
};

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("fasse Plan zusammen", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    describe("Planungsübersicht", () => {
      it("can create an empty Zusammenfassung if nothing is planned", () => {
        const lebensmonate = {};
        const plan = { ...ANY_PLAN, lebensmonate };

        const { planungsuebersicht } = fassePlanZusammen(plan);

        expect(planungsuebersicht).toStrictEqual({
          [Elternteil.Eins]: {
            gesamtbezug: { anzahlMonate: 0, elterngeld: 0, bruttoeinkommen: 0 },
            zeitraeumeMitDurchgaenigenBezug: [],
            bezuegeProVariante: {
              [Variante.Basis]: {
                anzahlMonate: 0,
                elterngeld: 0,
                bruttoeinkommen: 0,
              },
              [Variante.Plus]: {
                anzahlMonate: 0,
                elterngeld: 0,
                bruttoeinkommen: 0,
              },
              [Variante.Bonus]: {
                anzahlMonate: 0,
                elterngeld: 0,
                bruttoeinkommen: 0,
              },
            },
          },
          [Elternteil.Zwei]: {
            gesamtbezug: { anzahlMonate: 0, elterngeld: 0, bruttoeinkommen: 0 },
            zeitraeumeMitDurchgaenigenBezug: [],
            bezuegeProVariante: {
              [Variante.Basis]: {
                anzahlMonate: 0,
                elterngeld: 0,
                bruttoeinkommen: 0,
              },
              [Variante.Plus]: {
                anzahlMonate: 0,
                elterngeld: 0,
                bruttoeinkommen: 0,
              },
              [Variante.Bonus]: {
                anzahlMonate: 0,
                elterngeld: 0,
                bruttoeinkommen: 0,
              },
            },
          },
        });
      });

      describe("Gesamtbezug", () => {
        it("counts all Monate with a Variante chosen", () => {
          const lebensmonate = {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis),
              [Elternteil.Zwei]: monat(undefined),
            },
            2: {
              [Elternteil.Eins]: monat(Variante.Basis),
              [Elternteil.Zwei]: monat(Variante.Basis),
            },
            8: {
              [Elternteil.Eins]: monat(KeinElterngeld),
              [Elternteil.Zwei]: monat(Variante.Plus),
            },
          };
          const plan = { ...ANY_PLAN, lebensmonate };

          const { planungsuebersicht } = fassePlanZusammen(plan);

          expect(
            planungsuebersicht[Elternteil.Eins].gesamtbezug.anzahlMonate,
          ).toBe(2);
          expect(
            planungsuebersicht[Elternteil.Zwei].gesamtbezug.anzahlMonate,
          ).toBe(2);
        });

        it("sums up all Elterngeldbezüge", () => {
          const lebensmonate = {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis, 1),
              [Elternteil.Zwei]: monat(undefined, undefined),
            },
            2: {
              [Elternteil.Eins]: monat(Variante.Basis, 2),
              [Elternteil.Zwei]: monat(Variante.Basis, 3),
            },
            8: {
              [Elternteil.Eins]: monat(KeinElterngeld, null),
              [Elternteil.Zwei]: monat(Variante.Plus, 4),
            },
          };
          const plan = { ...ANY_PLAN, lebensmonate };

          const { planungsuebersicht } = fassePlanZusammen(plan);

          expect(
            planungsuebersicht[Elternteil.Eins].gesamtbezug.elterngeld,
          ).toBe(3);

          expect(
            planungsuebersicht[Elternteil.Zwei].gesamtbezug.elterngeld,
          ).toBe(7);
        });
      });

      describe.skip("Zeiträume mit durchgängigen Bezug", () => {
        /*
         * FIXME:
         * It is currently not possible to mock the this without global side
         * effects on component tests.The tests themself work fine and can be
         * execute individually.There is an open GitHub discussion on GitHub
         * for this topic.
         */
        // vi.mock(
        //   "@/features/planer/domain/zeitraum/operation/berechneZeitraumFuerLebensmonat",
        // );

        beforeEach(() => {
          vi.mocked(berechneZeitraumFuerLebensmonat).mockReturnValue({
            from: new Date(),
            to: new Date(),
          });
        });

        it("composes Zeiträume for consecutive Monate with a Variante chosen", () => {
          vi.mocked(berechneZeitraumFuerLebensmonat).mockImplementation(
            (_, lebensmonatszahl) => {
              switch (lebensmonatszahl) {
                case 1:
                  return {
                    from: new Date(2013, 1, 2),
                    to: new Date(2013, 2, 1),
                  };
                case 2:
                  return {
                    from: new Date(2013, 2, 2),
                    to: new Date(2013, 3, 1),
                  };
                case 8:
                  return {
                    from: new Date(2013, 8, 2),
                    to: new Date(2013, 8, 1),
                  };
                default:
                  return {
                    from: new Date(9999, 9, 9),
                    to: new Date(9999, 9, 9),
                  };
              }
            },
          );

          const lebensmonate = {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis),
              [Elternteil.Zwei]: monat(Variante.Plus),
            },
            2: {
              [Elternteil.Eins]: monat(KeinElterngeld),
              [Elternteil.Zwei]: monat(Variante.Basis),
            },
            8: {
              [Elternteil.Eins]: monat(Variante.Basis),
              [Elternteil.Zwei]: monat(Variante.Plus),
            },
          };
          const plan = { ...ANY_PLAN, lebensmonate };

          const { planungsuebersicht } = fassePlanZusammen(plan);

          expect(
            planungsuebersicht[Elternteil.Eins].zeitraeumeMitDurchgaenigenBezug,
          ).toStrictEqual([
            { from: new Date(2013, 1, 2), to: new Date(2013, 2, 1) },
            { from: new Date(2013, 8, 2), to: new Date(2013, 8, 1) },
          ]);

          expect(
            planungsuebersicht[Elternteil.Zwei].zeitraeumeMitDurchgaenigenBezug,
          ).toStrictEqual([
            { from: new Date(2013, 1, 2), to: new Date(2013, 3, 1) },
            { from: new Date(2013, 8, 2), to: new Date(2013, 8, 1) },
          ]);
        });

        it("uses the correct geburtsdatum des Kindes for the calculation", () => {
          const ausgangslage = {
            ...ANY_AUSGANGSAGE,
            geburtsdatumDesKindes: new Date(2022, 8, 9),
          };
          const lebensmonate = {
            1: { [Elternteil.Eins]: monat(Variante.Basis) },
          };
          const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

          fassePlanZusammen(plan);

          expect(vi.mocked(berechneZeitraumFuerLebensmonat)).toHaveBeenCalled();
          expect(
            vi.mocked(berechneZeitraumFuerLebensmonat),
          ).toHaveBeenCalledWith(new Date(2022, 8, 9), expect.anything());
        });
      });

      describe("Bezüge pro Variante", () => {
        it("counts the Anzahl von Monaten per Variante correctly", () => {
          const lebensmonate = {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis),
              [Elternteil.Zwei]: monat(undefined),
            },
            2: {
              [Elternteil.Eins]: monat(Variante.Basis),
              [Elternteil.Zwei]: monat(Variante.Basis),
            },
            8: {
              [Elternteil.Eins]: monat(KeinElterngeld),
              [Elternteil.Zwei]: monat(Variante.Plus),
            },
            9: {
              [Elternteil.Eins]: monat(Variante.Bonus),
              [Elternteil.Zwei]: monat(Variante.Bonus),
            },
          };
          const plan = { ...ANY_PLAN, lebensmonate };

          const { planungsuebersicht } = fassePlanZusammen(plan);
          const bezuegeElternteilEins =
            planungsuebersicht[Elternteil.Eins].bezuegeProVariante;
          const bezuegeElternteilZwei =
            planungsuebersicht[Elternteil.Zwei].bezuegeProVariante;

          expect(bezuegeElternteilEins[Variante.Basis].anzahlMonate).toBe(2);
          expect(bezuegeElternteilEins[Variante.Plus].anzahlMonate).toBe(0);
          expect(bezuegeElternteilEins[Variante.Bonus].anzahlMonate).toBe(1);

          expect(bezuegeElternteilZwei[Variante.Basis].anzahlMonate).toBe(1);
          expect(bezuegeElternteilZwei[Variante.Plus].anzahlMonate).toBe(1);
          expect(bezuegeElternteilZwei[Variante.Bonus].anzahlMonate).toBe(1);
        });

        it("sums up the total Elterngeldbezug per Variante correctly", () => {
          const lebensmonate = {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis, 1),
              [Elternteil.Zwei]: monat(undefined),
            },
            2: {
              [Elternteil.Eins]: monat(Variante.Basis, 2),
              [Elternteil.Zwei]: monat(Variante.Plus, 3),
            },
            8: {
              [Elternteil.Eins]: monat(KeinElterngeld),
              [Elternteil.Zwei]: monat(Variante.Basis, 4),
            },
            9: {
              [Elternteil.Eins]: monat(Variante.Bonus, 5),
              [Elternteil.Zwei]: monat(Variante.Bonus, 6),
            },
            10: {
              [Elternteil.Eins]: monat(Variante.Bonus, 7),
              [Elternteil.Zwei]: monat(Variante.Bonus, 8),
            },
          };
          const plan = { ...ANY_PLAN, lebensmonate };

          const { planungsuebersicht } = fassePlanZusammen(plan);
          const bezuegeElternteilEins =
            planungsuebersicht[Elternteil.Eins].bezuegeProVariante;
          const bezuegeElternteilZwei =
            planungsuebersicht[Elternteil.Zwei].bezuegeProVariante;

          expect(bezuegeElternteilEins[Variante.Basis].elterngeld).toBe(3);
          expect(bezuegeElternteilEins[Variante.Plus].elterngeld).toBe(0);
          expect(bezuegeElternteilEins[Variante.Bonus].elterngeld).toBe(12);

          expect(bezuegeElternteilZwei[Variante.Basis].elterngeld).toBe(4);
          expect(bezuegeElternteilZwei[Variante.Plus].elterngeld).toBe(3);
          expect(bezuegeElternteilZwei[Variante.Bonus].elterngeld).toBe(14);
        });
      });

      describe("Planungsdetails", () => {
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

          const { planungsdetails } = fassePlanZusammen(plan);

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

          const { planungsdetails } = fassePlanZusammen(plan);

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

    const ANY_AUSGANGSAGE = {
      anzahlElternteile: 1 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
      },
      geburtsdatumDesKindes: new Date(),
    };

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      },
      errechneteElterngeldbezuege: {} as never,
      lebensmonate: {},
    };
  });
}
