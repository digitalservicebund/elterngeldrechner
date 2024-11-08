import { erstelleInitialenLebensmonat } from "@/features/planer/domain/lebensmonat";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Plan } from "@/features/planer/domain/plan";
import { gebeEinkommenAn as gebeEinkommenInLebensmonatenAn } from "@/features/planer/domain/lebensmonate";

export function gebeEinkommenAn<A extends Ausgangslage>(
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  bruttoeinkommen: number,
): Plan<A> {
  const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
    plan.ausgangslage,
    lebensmonatszahl,
  );

  const lebensmonate = gebeEinkommenInLebensmonatenAn(
    plan.lebensmonate,
    lebensmonatszahl,
    elternteil,
    bruttoeinkommen,
    ungeplanterLebensmonat,
  );

  return { ...plan, lebensmonate };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("gebe Einkommen in Plan an", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");

    it("sets the Bruttoeinkommen for the correct Lebensmonat and Elternteil", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(100),
        },
        2: {
          [Elternteil.Eins]: monat(70),
          [Elternteil.Zwei]: monat(30),
        },
      };

      const planVorher = { ...ANY_PLAN, lebensmonate };

      const plan = gebeEinkommenAn(planVorher, 2, Elternteil.Eins, 317);

      expect(plan.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(100),
        },
        2: {
          [Elternteil.Eins]: monat(317),
          [Elternteil.Zwei]: monat(30),
        },
      });
    });

    function monat(bruttoeinkommen: number | undefined) {
      return {
        bruttoeinkommen,
        imMutterschutz: false as const,
      };
    }

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
}
