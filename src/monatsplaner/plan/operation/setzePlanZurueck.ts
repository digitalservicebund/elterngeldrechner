import type { Ausgangslage } from "@/monatsplaner/ausgangslage";
import { erstelleInitialeLebensmonate } from "@/monatsplaner/lebensmonate";
import type { Plan } from "@/monatsplaner/plan/Plan";

export function setzePlanZurueck<A extends Ausgangslage>(
  plan: Plan<A>,
): Plan<A> {
  return {
    ...plan,
    lebensmonate: erstelleInitialeLebensmonate(plan.ausgangslage),
  };
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("setzte Plan zurück", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

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
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };
  });

  vi.mock(
    import(
      "@/monatsplaner/lebensmonate/operation/erstelleInitialeLebensmonate"
    ),
  );
}
