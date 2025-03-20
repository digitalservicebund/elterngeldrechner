import { aktualisiereElterngeldbezuege } from "./aktualisiereElterngeldbezuege";
import type { BerechneElterngeldbezuegeCallback } from "@/monatsplaner/Elterngeldbezug";
import type { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/monatsplaner/ausgangslage";
import { erstelleInitialenLebensmonat } from "@/monatsplaner/lebensmonat";
import { gebeEinkommenAn as gebeEinkommenInLebensmonatenAn } from "@/monatsplaner/lebensmonate";
import type { Plan } from "@/monatsplaner/plan";

export function gebeEinkommenAn<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  bruttoeinkommen: number,
): Plan<A> {
  const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
    plan.ausgangslage,
    lebensmonatszahl,
  );

  const lebensmonateMitNeuemEinkommen = gebeEinkommenInLebensmonatenAn(
    plan.lebensmonate,
    lebensmonatszahl,
    elternteil,
    bruttoeinkommen,
    ungeplanterLebensmonat,
  );

  const planMitNeuemEinkommen = {
    ...plan,
    lebensmonate: lebensmonateMitNeuemEinkommen,
  };

  return aktualisiereElterngeldbezuege(
    berechneElterngeldbezuege,
    planMitNeuemEinkommen,
    elternteil,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("gebe Einkommen in Plan an", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");

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

      const plan = gebeEinkommenAn(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        planVorher,
        2,
        Elternteil.Eins,
        317,
      );

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

    it("updates the Elterngeldbezüge of the Elternteil using the given callback", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(111, 112),
          [Elternteil.Zwei]: monat(121, 122),
        },
        3: {
          [Elternteil.Eins]: monat(311, 312),
          [Elternteil.Zwei]: monat(321, 322),
        },
      };
      const planVorher = { ...ANY_PLAN, lebensmonate };

      const berechneElterngeldbezuege = vi
        .fn()
        .mockReturnValue({ 1: 1000, 2: 2000, 3: 3000 });

      const plan = gebeEinkommenAn(
        berechneElterngeldbezuege,
        planVorher,
        1,
        Elternteil.Zwei,
        999,
      );

      expect(berechneElterngeldbezuege).toHaveBeenCalledOnce();
      expect(berechneElterngeldbezuege).toHaveBeenLastCalledWith(
        Elternteil.Zwei,
        {
          1: monat(999, 122),
          3: monat(321, 322),
        },
      );

      expect(plan.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(111, 112),
          [Elternteil.Zwei]: monat(999, 1000),
        },
        3: {
          [Elternteil.Eins]: monat(311, 312),
          [Elternteil.Zwei]: monat(321, 3000),
        },
      });
    });

    function monat(
      bruttoeinkommen: number | undefined,
      elterngeldbezug?: number,
    ) {
      return {
        bruttoeinkommen,
        elterngeldbezug,
        gewaehlteOption: Variante.Basis,
        imMutterschutz: false as const,
      };
    }

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      },
      lebensmonate: {},
    };

    const ANY_BERECHNE_ELTERNGELDBEZUEGE = () => ({});
  });
}
