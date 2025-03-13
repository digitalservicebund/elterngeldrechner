import {
  getTrackingVariable,
  setTrackingVariable,
} from "@/application/user-tracking/core";
import { Monat, PlanMitBeliebigenElternteilen } from "@/monatsplaner";

enum Variables {
  Changes = "aenderungen-am-plan",
  PlannedMonths = "geplante-monate",
  PlannedMonthsWithIncome = "geplante-monate-mit-einkommen",
}

export function resetTrackingPlanung() {
  Object.values(Variables).forEach((key) => setTrackingVariable(key, 0));
}

export function trackChanges() {
  const newChanges = (getTrackingVariable<number>(Variables.Changes) || 0) + 1;

  setTrackingVariable(Variables.Changes, newChanges);
}

export function trackPlannedMonths(plan: PlanMitBeliebigenElternteilen) {
  const count = countMatchingMonate(plan, (monat) => {
    return !!monat.gewaehlteOption;
  });

  setTrackingVariable(Variables.PlannedMonths, count);
}

export function trackPlannedMonthsWithIncome(
  plan: PlanMitBeliebigenElternteilen,
) {
  const count = countMatchingMonate(plan, (monat) => {
    return !!(
      monat.bruttoeinkommen &&
      monat.bruttoeinkommen > 0 &&
      monat.gewaehlteOption
    );
  });

  setTrackingVariable(Variables.PlannedMonthsWithIncome, count);
}

function countMatchingMonate(
  plan: PlanMitBeliebigenElternteilen,
  predicate: (monat: Monat) => boolean,
) {
  return Object.values(plan.lebensmonate)
    .map((it) => Object.values(it).filter(predicate).length)
    .reduce((partialSum, a) => partialSum + a, 0);
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  vi.mock(import("@/application/user-tracking/core/data-layer"));

  describe("tracking of the planung", async () => {
    const { Elternteil, Variante, KeinElterngeld } = await import(
      "@/monatsplaner"
    );

    it("counts planned month per lebensmonate and elternteil", () => {
      const plan = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "Joe",
          },
          geburtsdatumDesKindes: new Date(),
        },
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
      };

      trackPlannedMonths(plan);

      expect(setTrackingVariable).toHaveBeenLastCalledWith(
        "geplante-monate",
        4,
      );
    });

    it("counts month with income per lebensmonate and elternteil", () => {
      const plan = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "Joe",
          },
          geburtsdatumDesKindes: new Date(),
        },
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
      };

      trackPlannedMonthsWithIncome(plan);

      expect(setTrackingVariable).toHaveBeenLastCalledWith(
        "geplante-monate-mit-einkommen",
        3,
      );
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
      };

      trackPlannedMonths(plan);

      expect(setTrackingVariable).toHaveBeenLastCalledWith(
        "geplante-monate",
        6,
      );
    });
  });
}
