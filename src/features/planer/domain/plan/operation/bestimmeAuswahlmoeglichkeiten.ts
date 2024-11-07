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
import type {
  MatomoTrackingMetrics,
  Plan,
} from "@/features/planer/domain/plan/Plan";

export function bestimmeAuswahlmoeglichkeiten<A extends Ausgangslage>(
  plan: Plan<A> & MatomoTrackingMetrics,
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
  plan: Plan<A> & MatomoTrackingMetrics,
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
    const { Result } = await import("@/features/planer/domain/common/Result");

    beforeEach(() => {
      vi.mocked(waehleOption).mockImplementation((plan) => Result.ok(plan));
    });

    it("picks up the correct Elterngeldbezug for each Auswahlmöglichkeit", () => {
      // related to test-generators
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errechneteElterngeldbezuege: any = {
        ...ANY_ELTERNGELDBEZUEGE,
        1: {
          [Elternteil.Eins]: bezuege(111, 112, 113),
          [Elternteil.Zwei]: bezuege(121, 122, 123),
        },
        2: {
          [Elternteil.Eins]: bezuege(211, 212, 213),
          [Elternteil.Zwei]: bezuege(221, 222, 223),
        },
      };

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
      vi.mocked(waehleOption).mockImplementation((plan, _, __, option) =>
        option === Variante.Basis
          ? Result.error([{ message: "ungültig" }])
          : Result.ok(plan),
      );

      const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(
        ANY_PLAN,
        2,
        Elternteil.Zwei,
      );

      expect(auswahlmoeglichkeiten[Variante.Basis].isDisabled).toBe(true);
      expect(auswahlmoeglichkeiten[Variante.Basis].hintWhyDisabled).toBe(
        "ungültig",
      );
      expect(auswahlmoeglichkeiten[Variante.Plus].isDisabled).toBe(false);
      expect(auswahlmoeglichkeiten[Variante.Bonus].isDisabled).toBe(false);
      expect(auswahlmoeglichkeiten[KeinElterngeld].isDisabled).toBe(false);
    });

    vi.mock(import("@/features/planer/domain/plan/operation/waehleOption"));

    function bezuege(basis: number, plus: number, bonus: number) {
      return {
        [Variante.Basis]: basis,
        [Variante.Plus]: plus,
        [Variante.Bonus]: bonus,
      };
    }

    const ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL = {
      [Elternteil.Eins]: bezuege(0, 0, 0),
      [Elternteil.Zwei]: bezuege(0, 0, 0),
    };

    // related to test-generators
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ANY_ELTERNGELDBEZUEGE: any = Object.fromEntries(
      Lebensmonatszahlen.map((lebensmonatszahl) => [
        lebensmonatszahl,
        ANY_ELTERNGELDBEZUEGE_PRO_ELTERNTEIL,
      ]),
    );

    const ANY_PLAN = {
      ausgangslage: {
        anzahlElternteile: 2 as const,
        pseudonymeDerElternteile: {
          [Elternteil.Eins]: "Jane",
          [Elternteil.Zwei]: "John",
        },
        geburtsdatumDesKindes: new Date(),
      },
      errechneteElterngeldbezuege: ANY_ELTERNGELDBEZUEGE,
      lebensmonate: {},
      changes: 0,
    };
  });
}
