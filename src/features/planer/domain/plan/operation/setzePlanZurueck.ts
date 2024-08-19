import { erstelleInitialeLebensmonate } from "@/features/planer/domain/lebensmonate";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function setzePlanZurueck<A extends Ausgangslage>(
  plan: Plan<A>,
): Plan<A> {
  return {
    ...plan,
    lebensmonate: erstelleInitialeLebensmonate(plan.ausgangslage),
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("setzte Plan zurück", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Top } = await import(
      "@/features/planer/domain/common/specification"
    );

    it("sets the Lebensmonate back to the initial ones", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: {
            gewaehlteOption: Variante.Basis,
            imMutterschutz: false as const,
          },
        },
      };

      const planVorher = { ...ANY_PLAN, lebensmonate };
      vi.mocked(erstelleInitialeLebensmonate).mockReturnValue({});

      const plan = setzePlanZurueck(planVorher);

      expect(plan.lebensmonate).toStrictEqual({});
    });

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: { [Elternteil.Eins]: "Jane" },
      },
      errechneteElterngeldbezuege: {} as any,
      lebensmonate: {},
      gueltigerPlan: Top,
    };
  });

  vi.mock(
    "@/features/planer/domain/lebensmonate/operation/erstelleInitialeLebensmonate",
  );
}
