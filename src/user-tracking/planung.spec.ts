import { setTrackingVariable } from "./data-layer";
import { Variante } from "@/features/planer";
import { KeinElterngeld } from "@/features/planer/domain";

import {
  trackPlannedMonths,
  trackPlannedMonthsWithIncome,
} from "@/user-tracking/planung";

vi.mock(import("./data-layer"));

describe("tracking of the planung", async () => {
  const { Elternteil } = await import("@/features/planer/domain/Elternteil");

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

    trackPlannedMonths(plan);

    expect(setTrackingVariable).toHaveBeenLastCalledWith("geplante-monate", 6);
  });
});
