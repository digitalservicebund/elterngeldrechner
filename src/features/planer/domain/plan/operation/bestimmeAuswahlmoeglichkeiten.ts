import { waehleOption } from "./waehleOption";
import type { SpecificationViolation } from "@/features/planer/domain/common/specification";
import type { Elterngeldbezug } from "@/features/planer/domain/Elterngeldbezug";
import {
  Auswahloptionen,
  KeinElterngeld,
  type Auswahloption,
} from "@/features/planer/domain/Auswahloption";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import type {
  Auswahlmoeglichkeit,
  Auswahlmoeglichkeiten,
} from "@/features/planer/domain/Auswahlmoeglichkeiten";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function bestimmeAuswahlmoeglichkeiten<A extends Ausgangslage>(
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
): Auswahlmoeglichkeiten {
  const elterngeldbezuege =
    plan.errechneteElterngeldbezuege[lebensmonatszahl][elternteil];

  return Object.fromEntries(
    Auswahloptionen.map((option) => {
      const elterngeldbezug =
        option === KeinElterngeld ? null : elterngeldbezuege[option];

      const auswahlmoeglichkeit = createAuswahlmoeglichkeit(
        plan,
        lebensmonatszahl,
        elternteil,
        option,
        elterngeldbezug,
      );

      return [option, auswahlmoeglichkeit];
    }),
  ) as Auswahlmoeglichkeiten;
}

function createAuswahlmoeglichkeit<A extends Ausgangslage>(
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  option: Auswahloption,
  elterngeldbezug: Elterngeldbezug,
): Auswahlmoeglichkeit {
  return waehleOption(plan, lebensmonatszahl, elternteil, option).mapOrElse(
    () => ({ isDisabled: false as const, elterngeldbezug }),
    (violations) => ({
      isDisabled: true as const,
      hintWhyDisabled: formatViolationsAsHint(violations),
      elterngeldbezug,
    }),
  );
}

function formatViolationsAsHint(violations: SpecificationViolation[]): string {
  return violations.map((violation) => violation.message).join("\n\n");
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("bestimmte Auswahlmöglichkeiten", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Lebensmonatszahlen } = await import(
      "@/features/planer/domain/Lebensmonatszahl"
    );
    const { Specification, Top } = await import(
      "@/features/planer/domain/common/specification"
    );

    it("picks up the correct Elterngeldbezug for each Auswahlmöglichkeit", () => {
      const errechneteElterngeldbezuege = {
        ...ANY_ELTERNGELDBEZUEGE,
        1: {
          [Elternteil.Eins]: bezuege(111, 112, 113),
          [Elternteil.Zwei]: bezuege(121, 122, 123),
        },
        2: {
          [Elternteil.Eins]: bezuege(211, 212, 213),
          [Elternteil.Zwei]: bezuege(221, 222, 223),
        },
      } as any;

      const plan = { ...ANY_PLAN, errechneteElterngeldbezuege };

      const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(
        plan,
        2,
        Elternteil.Zwei,
      );

      expect(auswahlmoeglichkeiten[Variante.Basis].elterngeldbezug).toBe(221);
      expect(auswahlmoeglichkeiten[Variante.Plus].elterngeldbezug).toBe(222);
      expect(auswahlmoeglichkeiten[Variante.Bonus].elterngeldbezug).toBe(223);
      expect(auswahlmoeglichkeiten[KeinElterngeld].elterngeldbezug).toBeNull();
    });

    it("creates a disabled Auswahlmöglichkeit including the violation as hint if the resulting Plan is ungültig for an Option", () => {
      const ungueltigIfBasis = Specification.fromPredicate<Plan<Ausgangslage>>(
        "Basiselterngeld kann nicht mehr ausgewählt werden.",
        (plan) =>
          plan.lebensmonate[2]?.[Elternteil.Zwei].gewaehlteOption !==
          Variante.Basis,
      );

      const plan = {
        ...ANY_PLAN,
        gueltigerPlan: ungueltigIfBasis,
        lebensmonate: {},
      };

      const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(
        plan,
        2,
        Elternteil.Zwei,
      );

      expect(auswahlmoeglichkeiten[Variante.Basis].isDisabled).toBe(true);
      expect(auswahlmoeglichkeiten[Variante.Basis].hintWhyDisabled).toBe(
        "Basiselterngeld kann nicht mehr ausgewählt werden.",
      );
      expect(auswahlmoeglichkeiten[Variante.Plus].isDisabled).toBe(false);
      expect(auswahlmoeglichkeiten[Variante.Bonus].isDisabled).toBe(false);
      expect(auswahlmoeglichkeiten[KeinElterngeld].isDisabled).toBe(false);
    });

    const bezuege = function (basis: number, plus: number, bonus: number) {
      return {
        [Variante.Basis]: basis,
        [Variante.Plus]: plus,
        [Variante.Bonus]: bonus,
      };
    };

    const ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL = {
      [Elternteil.Eins]: bezuege(0, 0, 0),
      [Elternteil.Zwei]: bezuege(0, 0, 0),
    };

    const ANY_ELTERNGELDBEZUEGE = Object.fromEntries(
      Lebensmonatszahlen.map((lebensmonatszahl) => [
        lebensmonatszahl,
        ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL,
      ]),
    ) as any;

    const ANY_PLAN = {
      ausgangslage: { anzahlElternteile: 2 as const },
      errechneteElterngeldbezuege: ANY_ELTERNGELDBEZUEGE,
      lebensmonate: {},
      gueltigerPlan: Top,
    };
  });
}
