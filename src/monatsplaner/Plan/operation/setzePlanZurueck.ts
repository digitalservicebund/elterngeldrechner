import type { Ausgangslage } from "@/monatsplaner/Ausgangslage";
import { erstelleInitialeLebensmonate } from "@/monatsplaner/Lebensmonate";
import type { Plan } from "@/monatsplaner/Plan";

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

    it("sets the Lebensmonate back to the initial ones", async () => {
      vi.spyOn(
        await import("@/monatsplaner/Lebensmonate"),
        "erstelleInitialeLebensmonate",
      ).mockReturnValue({});

      const lebensmonate = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false as const,
          },
        },
      };

      const planVorher = { ...ANY_PLAN, lebensmonate, changes: 1 };

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
}
