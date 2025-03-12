import { describe, expect, it, vi } from "vitest";
import { trackPlannedMonths, trackPlannedMonthsWithIncome } from "./planung";
import { setTrackingVariable } from "@/application/user-tracking/core";
import { KeinElterngeld, Variante } from "@/monatsplaner";

vi.mock(import("@/application/user-tracking/core/data-layer"));

describe("tracking of the planung", async () => {
  const { Elternteil } = await import("@/monatsplaner/Elternteil");

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

    expect(setTrackingVariable).toHaveBeenLastCalledWith("geplante-monate", 4);
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

    expect(setTrackingVariable).toHaveBeenLastCalledWith("geplante-monate", 6);
  });
});
