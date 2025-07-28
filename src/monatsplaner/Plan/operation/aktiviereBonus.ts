import { aktualisiereElterngeldbezuege } from "./aktualisiereElterngeldbezuege";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/monatsplaner/Ausgangslage";
import {
  type Auswahloption,
  KeinElterngeld,
} from "@/monatsplaner/Auswahloption";
import type { BerechneElterngeldbezuegeCallback } from "@/monatsplaner/Elterngeldbezug";
import { Elternteil } from "@/monatsplaner/Elternteil";
import { erstelleInitialenLebensmonat } from "@/monatsplaner/Lebensmonat";
import { waehleOption as waehleOptionInLebensmonaten } from "@/monatsplaner/Lebensmonate";
import type { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import type { Plan } from "@/monatsplaner/Plan";
import { VorlaeufigGueltigerPlan } from "@/monatsplaner/Plan/specification";
import { Variante } from "@/monatsplaner/Variante";
import { Result } from "@/monatsplaner/common/Result";
import type { SpecificationViolation } from "@/monatsplaner/common/specification";

export function aktiviereBonus<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
): Result<Plan<A>, SpecificationViolation[]> {
  const ungeplanterLebensmonat = erstelleInitialenLebensmonat(
    plan.ausgangslage,
    (lebensmonatszahl + 1) as Lebensmonatszahl,
  );

  const erstenZweiBonusmonateHinzugefuegt = waehleOptionInLebensmonaten(
    plan.lebensmonate,
    (lebensmonatszahl + 1) as Lebensmonatszahl,
    Elternteil.Eins as ElternteileByAusgangslage<A>,
    Variante.Bonus,
    ungeplanterLebensmonat,
  );

  const dritterBonusmonatHinzugefuegt = waehleOptionInLebensmonaten(
    erstenZweiBonusmonateHinzugefuegt,
    (lebensmonatszahl + 3) as Lebensmonatszahl,
    Elternteil.Zwei as ElternteileByAusgangslage<A>,
    Variante.Bonus,
    ungeplanterLebensmonat,
  );

  const vierterBonusmonatHinzugefuegt = waehleOptionInLebensmonaten(
    dritterBonusmonatHinzugefuegt,
    (lebensmonatszahl + 4) as Lebensmonatszahl,
    Elternteil.Zwei as ElternteileByAusgangslage<A>,
    Variante.Bonus,
    ungeplanterLebensmonat,
  );

  const gewaehlterPlan: Plan<A> = {
    ...plan,
    lebensmonate: vierterBonusmonatHinzugefuegt,
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

  describe("aktiviere Partnerschaftsbonus", async () => {
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

    it("fügt Partnerschaftsmonate ans Ende einer initialen Planung", () => {
      const plan = {
        ausgangslage: {
          anzahlElternteile: 2 as const,
          pseudonymeDerElternteile: {
            [Elternteil.Eins]: "Jane",
            [Elternteil.Zwei]: "John",
          },
          geburtsdatumDesKindes: new Date(),
        },
        lebensmonate: {
          1: {
            [Elternteil.Eins]: monat(Variante.Basis),
            [Elternteil.Zwei]: monat(KeinElterngeld),
          },
          2: {
            [Elternteil.Eins]: monat(Variante.Basis),
            [Elternteil.Zwei]: monat(KeinElterngeld),
          },
          3: {
            [Elternteil.Eins]: monat(Variante.Basis),
            [Elternteil.Zwei]: monat(KeinElterngeld),
          },
          4: {
            [Elternteil.Eins]: monat(Variante.Basis),
            [Elternteil.Zwei]: monat(KeinElterngeld),
          },
        },
      };

      const planMitPartnerschaftsbonus = aktiviereBonus(
        () => ({}),
        plan,
        4,
      ).unwrapOrElse(() => plan);

      expect(planMitPartnerschaftsbonus.lebensmonate).toStrictEqual({
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        4: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(KeinElterngeld),
        },
        5: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        6: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        7: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
        },
        8: {
          [Elternteil.Eins]: monat(Variante.Bonus),
          [Elternteil.Zwei]: monat(Variante.Bonus),
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
  });
}
