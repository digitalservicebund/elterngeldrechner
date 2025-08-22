import { aktualisiereElterngeldbezuege } from "./aktualisiereElterngeldbezuege";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/monatsplaner/Ausgangslage";
import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { BerechneElterngeldbezuegeByElternteilCallback } from "@/monatsplaner/Elterngeldbezug";
import type { Elternteil } from "@/monatsplaner/Elternteil";
import { erstelleInitialenLebensmonat } from "@/monatsplaner/Lebensmonat";
import { waehleOption as waehleOptionInLebensmonaten } from "@/monatsplaner/Lebensmonate";
import type { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import type { Plan } from "@/monatsplaner/Plan";
import { VorlaeufigGueltigerPlan } from "@/monatsplaner/Plan/specification";
import { Result } from "@/monatsplaner/common/Result";
import type { SpecificationViolation } from "@/monatsplaner/common/specification";

export function waehleOption<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeByElternteilCallback,
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  option: Auswahloption | undefined,
): Result<Plan<A>, SpecificationViolation[]> {
  const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
    plan.ausgangslage,
    lebensmonatszahl,
  );

  const gewaehlteLebensmonate = waehleOptionInLebensmonaten(
    plan.lebensmonate,
    lebensmonatszahl,
    elternteil,
    option,
    ungeplanterLebensmonat,
  );

  const gewaehlterPlan: Plan<A> = {
    ...plan,
    lebensmonate: gewaehlteLebensmonate,
  };

  return VorlaeufigGueltigerPlan<A>()
    .evaluate(gewaehlterPlan)
    .mapOrElse(
      () =>
        Result.ok(
          aktualisiereElterngeldbezuege(
            berechneElterngeldbezuege,
            gewaehlterPlan,
          ),
        ),
      (violations) => Result.error(violations),
    );
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  describe("wähle Option für Plan", async () => {
    const { Elternteil } = await import("@/monatsplaner/Elternteil");
    const { Variante } = await import("@/monatsplaner/Variante");
    const vorlaeufigGueltigerPlanModule = await import(
      "@/monatsplaner/Plan/specification/VorlaeufigGueltigerPlan"
    );
    const { Specification } = await import(
      "@/monatsplaner/common/specification"
    );

    beforeEach(() => {
      vi.spyOn(
        vorlaeufigGueltigerPlanModule,
        "VorlaeufigGueltigerPlan",
      ).mockReturnValue(Specification.fromPredicate("", () => true));
    });

    it("sets the Auswahloption for the correct Lebensmonat and Elternteil", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
        2: {
          [Elternteil.Eins]: monat(undefined),
          [Elternteil.Zwei]: monat(undefined),
        },
      };

      const planVorher = {
        ...ANY_PLAN,
        lebensmonate,
      };

      const plan = waehleOption(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        planVorher,
        1,
        Elternteil.Zwei,
        Variante.Plus,
      ).unwrapOrElse(() => planVorher);

      expectOption(plan, 1, Elternteil.Eins).toBeUndefined();
      expectOption(plan, 1, Elternteil.Zwei).toBe(Variante.Plus);
      expectOption(plan, 2, Elternteil.Eins).toBeUndefined();
      expectOption(plan, 2, Elternteil.Zwei).toBeUndefined();
    });

    it("can set the Auswahloption even for an empty plan", () => {
      const planVorher = {
        ...ANY_PLAN,
        lebensmonate: {},
      };

      const plan = waehleOption(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        planVorher,
        1,
        Elternteil.Eins,
        Variante.Basis,
      ).unwrapOrElse(() => planVorher);

      expectOption(plan, 1, Elternteil.Eins).toBe(Variante.Basis);
    });

    it("forwards the violations if the resulting Plan is not gültig", () => {
      vi.spyOn(
        vorlaeufigGueltigerPlanModule,
        "VorlaeufigGueltigerPlan",
      ).mockReturnValue(Specification.fromPredicate("ungültig", () => false));

      const violations = waehleOption(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        ANY_PLAN,
        ANY_LEBENSMONATSZAHL,
        ANY_ELTERNTEIL,
        ANY_AUSWAHLOPTION,
      ).mapOrElse(
        () => [],
        (violations) => violations,
      );

      expect(violations).toEqual([{ message: "ungültig" }]);
    });

    /*
     * The calculation of the Elterngeldbezüge depends on the planned Monate and
     * the Bruttoeinkommen. Some automation in the background when choosing an
     * Option can adapt the Plan for all Elternteile (e.g. Partnerschaftsbonus
     * automation). In result the Elterngeldbezüge of all Elternteile could have
     * changed due to this.
     */
    it("updates the Elterngeldbezüge of all Elternteile to address automation in changed Options", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Plus, 112, 114),
          [Elternteil.Zwei]: monat(Variante.Basis, 121, 124),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis, 311, 314),
          [Elternteil.Zwei]: monat(undefined, undefined, 324),
        },
      };
      const planVorher = { ...ANY_PLAN, lebensmonate };

      const berechneElterngeldbezuege = vi.fn((elternteil: Elternteil) => {
        switch (elternteil) {
          case Elternteil.Eins:
            return { 1: 1120, 2: 0, 3: 3110 };
          case Elternteil.Zwei:
            return { 1: 1210, 2: 0, 3: 3130 };
        }
      });

      const plan = waehleOption(
        berechneElterngeldbezuege,
        planVorher,
        3,
        Elternteil.Zwei,
        Variante.Plus,
      ).unwrapOrElse(() => planVorher);

      expect(berechneElterngeldbezuege).toHaveBeenCalledTimes(2);
      expect(berechneElterngeldbezuege).toHaveBeenCalledWith(Elternteil.Eins, {
        1: monat(Variante.Plus, 112, 114),
        3: monat(Variante.Basis, 311, 314),
      });

      expect(berechneElterngeldbezuege).toHaveBeenCalledWith(Elternteil.Zwei, {
        1: monat(Variante.Basis, 121, 124),
        3: monat(Variante.Plus, undefined, 324),
      });

      expect(plan.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Plus, 1120, 114),
          [Elternteil.Zwei]: monat(Variante.Basis, 1210, 124),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis, 3110, 314),
          [Elternteil.Zwei]: monat(Variante.Plus, 3130, 324),
        },
      });
    });

    function monat(
      gewaehlteOption: Auswahloption | undefined,
      elterngeldbezug?: number,
      bruttoeinkommen?: number,
    ) {
      return {
        gewaehlteOption,
        elterngeldbezug,
        bruttoeinkommen,
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

    const ANY_LEBENSMONATSZAHL = 1;
    const ANY_ELTERNTEIL = Elternteil.Eins;
    const ANY_AUSWAHLOPTION = Variante.Basis;
    const ANY_BERECHNE_ELTERNGELDBEZUEGE = () => ({});

    function expectOption<A extends Ausgangslage>(
      plan: Plan<A>,
      lebensmonatszahl: Lebensmonatszahl,
      elternteil: ElternteileByAusgangslage<A>,
    ) {
      return expect(
        plan.lebensmonate[lebensmonatszahl]?.[elternteil].gewaehlteOption,
      );
    }
  });
}
