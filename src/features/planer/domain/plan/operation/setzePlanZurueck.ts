import { erstelleInitialeLebensmonate } from "@/features/planer/domain/lebensmonate";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import type {
  MatomoTrackingMetrics,
  Plan,
} from "@/features/planer/domain/plan/Plan";

export function setzePlanZurueck<A extends Ausgangslage>(
  plan: Plan<A> & MatomoTrackingMetrics,
): Plan<A> & MatomoTrackingMetrics {
  return {
    ...plan,
    changes: 0,
    lebensmonate: erstelleInitialeLebensmonate(plan.ausgangslage),
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("setzte Plan zurück", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("sets the Lebensmonate back to the initial ones", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false as const,
          },
        },
      };

      const planVorher = { ...ANY_PLAN, lebensmonate, changes: 1 };
      vi.mocked(erstelleInitialeLebensmonate).mockReturnValue({});

      const plan = setzePlanZurueck(planVorher);

      expect(plan.lebensmonate).toStrictEqual({});
    });

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
        geburtsdatumDesKindes: new Date(),
      },
      errechneteElterngeldbezuege: {} as never,
      lebensmonate: {},
    };
  });

  vi.mock(
    import(
      "@/features/planer/domain/lebensmonate/operation/erstelleInitialeLebensmonate"
    ),
  );
}
