import type { Ausgangslage } from "@/features/planer/domain/Ausgangslage";
import { erstelleInitialeLebensmonate } from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan";

export function erstelleInitialenPlan<A extends Ausgangslage>(
  ausgangslage: A,
): Plan<A> {
  const lebensmonate = erstelleInitialeLebensmonate(ausgangslage);
  return { ausgangslage, lebensmonate };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle initialen Plan", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");

    it("maintains the original Ausgangslage for consitency in operation", () => {
      const ausgangslage = { anzahlElternteile: 1 as const };

      const plan = erstelleInitialenPlan(ausgangslage);

      expect(plan.ausgangslage).toBe(ausgangslage);
    });

    it("has an empty set of Lebensmonate if no Mutterschutz is configured", () => {
      const ausgangslage = {
        informationenZumMutterschutz: undefined,
        anzahlElternteile: 1 as const,
      };

      const plan = erstelleInitialenPlan(ausgangslage);

      expect(Object.entries(plan.lebensmonate)).toHaveLength(0);
    });

    it("has as many initial Lebensmonate as Monate of Mutterschutz configured", () => {
      const ausgangslage: Ausgangslage = {
        informationenZumMutterschutz: {
          letzterLebensmonatMitSchutz: 3,
          empfaenger: Elternteil.Eins,
        },
        anzahlElternteile: 1,
      };

      const plan = erstelleInitialenPlan(ausgangslage);

      expect(Object.entries(plan.lebensmonate)).toHaveLength(3);
    });

    it("any initial Monat for every Elternteil is either im Mutterschutz or unplanned", () => {
      const ausgangslage: Ausgangslage = {
        informationenZumMutterschutz: {
          letzterLebensmonatMitSchutz: 4,
          empfaenger: Elternteil.Zwei,
        },
        anzahlElternteile: 2,
      };

      const plan = erstelleInitialenPlan(ausgangslage);

      Object.values(plan.lebensmonate)
        .flatMap((lebensmonat) => Object.values(lebensmonat))
        .filter((monat) => monat.gewaehlteOption !== undefined)
        .forEach((monat) => {
          expect(monat.imMutterschutz).toBe(true);
          expect(monat.gewaehlteOption).toBe(Variante.Basis);
        });
    });
  });
}
