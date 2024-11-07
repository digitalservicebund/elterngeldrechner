import {
  Elternteil,
  KeinElterngeld,
  Monat,
  PlanMitBeliebigenElternteilen,
  Variante,
} from "@/features/planer/domain";

import { setTrackingVariable } from "@/user-tracking/data-layer";
import { MatomoTrackingMetrics } from "@/features/planer/domain/plan";

export function trackPlanung(
  plan: PlanMitBeliebigenElternteilen & MatomoTrackingMetrics,
) {
  setTrackingVariable("aenderungen-am-plan", plan.changes);

  setTrackingVariable("geplante-monate", countPlannedMonths(plan));

  setTrackingVariable(
    "geplante-monate-mit-einkommen",
    countPlannedMonthsWithIncome(plan),
  );
}

function countPlannedMonths(plan: PlanMitBeliebigenElternteilen) {
  return countMatchingMonate(plan, (monat) => {
    return !!monat.gewaehlteOption;
  });
}

function countPlannedMonthsWithIncome(plan: PlanMitBeliebigenElternteilen) {
  return countMatchingMonate(plan, (monat) => {
    return !!(
      monat.bruttoeinkommen &&
      monat.bruttoeinkommen > 0 &&
      monat.gewaehlteOption
    );
  });
}

function countMatchingMonate(
  plan: PlanMitBeliebigenElternteilen,
  predicate: (monat: Monat) => boolean,
) {
  return Object.values(plan.lebensmonate).filter((it) =>
    Object.values(it).some(predicate),
  ).length;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("tracking of the planung", () => {
    it("counts planned month per lebensmonate", () => {
      const plan = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "Joe",
          },
          geburtsdatumDesKindes: new Date(),
        },
        errechneteElterngeldbezuege: {} as never,
        lebensmonate: {
          1: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
          },
          2: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
          },
        },
        changes: 0,
      };

      expect(countPlannedMonths(plan)).toEqual(2);
    });

    it("counts month with income per lebensmonate", () => {
      const plan = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "Joe",
          },
          geburtsdatumDesKindes: new Date(),
        },
        errechneteElterngeldbezuege: {} as never,
        lebensmonate: {
          1: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
              bruttoeinkommen: 2000,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
              bruttoeinkommen: 2000,
            },
          },
          2: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
              bruttoeinkommen: 2000,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
          },
        },
        changes: 0,
      };

      expect(countPlannedMonthsWithIncome(plan)).toEqual(2);
    });

    it("treats 'kein Elterngeld' as a planned month", () => {
      const plan = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "Joe",
          },
          geburtsdatumDesKindes: new Date(),
        },
        errechneteElterngeldbezuege: {} as never,
        lebensmonate: {
          1: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
          },
          2: {
            [Elternteil.Eins]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: Variante.Plus,
              imMutterschutz: false as const,
            },
          },
          3: {
            [Elternteil.Eins]: {
              gewaehlteOption: KeinElterngeld,
              imMutterschutz: false as const,
            },
            [Elternteil.Zwei]: {
              gewaehlteOption: KeinElterngeld,
              imMutterschutz: false as const,
            },
          },
        },
        changes: 0,
      };

      expect(countPlannedMonths(plan)).toEqual(3);
    });
  });
}
