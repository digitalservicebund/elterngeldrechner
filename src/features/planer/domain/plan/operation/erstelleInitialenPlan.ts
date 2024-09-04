import type { Elterngeldbezuege } from "@/features/planer/domain/Elterngeldbezuege";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import { erstelleInitialeLebensmonate } from "@/features/planer/domain/lebensmonate";
import { GueltigerPlan, Plan } from "@/features/planer/domain/plan";

export function erstelleInitialenPlan<A extends Ausgangslage>(
  ausgangslage: A,
  errechneteElterngeldbezuege: Elterngeldbezuege<ElternteileByAusgangslage<A>>,
): Plan<A> {
  const lebensmonate = erstelleInitialeLebensmonate(ausgangslage);
  const gueltigerPlan = GueltigerPlan<A>();
  return {
    ausgangslage,
    errechneteElterngeldbezuege,
    lebensmonate,
    gueltigerPlan,
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelle initialen Plan", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");

    it("maintains the original Ausgangslage and Elterngeldbezüge for consitency in operation", () => {
      const ausgangslage = {
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_ONE_ELTERNTEIL,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };
      const errechneteElterngeldbezuege = {
        1: { [Elternteil.Eins]: {} },
      } as any; // TODO: Start working with test data generators.

      const plan = erstelleInitialenPlan(
        ausgangslage,
        errechneteElterngeldbezuege,
      );

      expect(plan.ausgangslage).toBe(ausgangslage);
      expect(plan.errechneteElterngeldbezuege).toBe(
        errechneteElterngeldbezuege,
      );
    });

    it("has an empty set of Lebensmonate if no Mutterschutz is configured", () => {
      const ausgangslage = {
        informationenZumMutterschutz: undefined,
        anzahlElternteile: 1 as const,
        pseudonymeDerElternteile: ANY_PSEUDONYME_ONE_ELTERNTEIL,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const plan = erstelleInitialenPlan(ausgangslage, ANY_ELTERNGELDBEZUEGE);

      expect(Object.entries(plan.lebensmonate)).toHaveLength(0);
    });

    it("has as many initial Lebensmonate as Monate of Mutterschutz configured", () => {
      const ausgangslage: Ausgangslage = {
        informationenZumMutterschutz: {
          letzterLebensmonatMitSchutz: 3,
          empfaenger: Elternteil.Eins,
        },
        anzahlElternteile: 1,
        pseudonymeDerElternteile: ANY_PSEUDONYME_ONE_ELTERNTEIL,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const plan = erstelleInitialenPlan(ausgangslage, ANY_ELTERNGELDBEZUEGE);

      expect(Object.entries(plan.lebensmonate)).toHaveLength(3);
    });

    it("any initial Monat for every Elternteil is either im Mutterschutz or unplanned", () => {
      const ausgangslage: Ausgangslage = {
        informationenZumMutterschutz: {
          letzterLebensmonatMitSchutz: 4,
          empfaenger: Elternteil.Zwei,
        },
        anzahlElternteile: 2,
        pseudonymeDerElternteile: ANY_PSEUDONYME_TWO_ELTERNTEILE,
        geburtsdatumDesKindes: ANY_GEBURTSDATUM_DES_KINDES,
      };

      const plan = erstelleInitialenPlan(ausgangslage, ANY_ELTERNGELDBEZUEGE);

      Object.values(plan.lebensmonate)
        .flatMap((lebensmonat) => Object.values(lebensmonat))
        .filter((monat) => monat.gewaehlteOption !== undefined)
        .forEach((monat) => {
          expect(monat.imMutterschutz).toBe(true);
        });
    });

    const ANY_ELTERNGELDBEZUEGE = {} as any;
    const ANY_PSEUDONYME_ONE_ELTERNTEIL = {
      [Elternteil.Eins]: "Jane",
    };

    const ANY_PSEUDONYME_TWO_ELTERNTEILE = {
      [Elternteil.Eins]: "Jane",
      [Elternteil.Zwei]: "John",
    };

    const ANY_GEBURTSDATUM_DES_KINDES = new Date();
  });
}
