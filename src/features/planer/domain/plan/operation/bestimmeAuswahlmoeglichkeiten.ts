import { waehleOption } from "./waehleOption";
import type {
  Auswahlmoeglichkeit,
  Auswahlmoeglichkeiten,
} from "@/features/planer/domain/Auswahlmoeglichkeiten";
import {
  type Auswahloption,
  Auswahloptionen,
  KeinElterngeld,
} from "@/features/planer/domain/Auswahloption";
import type { BerechneElterngeldbezuegeCallback } from "@/features/planer/domain/Elterngeldbezug";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import type { SpecificationViolation } from "@/features/planer/domain/common/specification";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function bestimmeAuswahlmoeglichkeiten<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
): Auswahlmoeglichkeiten {
  return Object.fromEntries(
    Auswahloptionen.map((option) => [
      option,
      createAuswahlmoeglichkeit(
        berechneElterngeldbezuege,
        plan,
        lebensmonatszahl,
        elternteil,
        option,
      ),
    ]),
  ) as Auswahlmoeglichkeiten;
}

function createAuswahlmoeglichkeit<A extends Ausgangslage>(
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  plan: Plan<A>,
  lebensmonatszahl: Lebensmonatszahl,
  elternteil: ElternteileByAusgangslage<A>,
  option: Auswahloption,
): Auswahlmoeglichkeit {
  return waehleOption(
    berechneElterngeldbezuege,
    plan,
    lebensmonatszahl,
    elternteil,
    option,
  ).mapOrElse(
    (hypothenticalPlan) => ({
      istAuswaehlbar: true as const,
      elterngeldbezug:
        hypothenticalPlan.lebensmonate[lebensmonatszahl]?.[elternteil]
          .elterngeldbezug ?? null,
    }),
    (violations) => ({
      istAuswaehlbar: false as const,
      grundWiesoNichtAuswaehlbar: formatViolationsAsHint(violations),
      elterngeldbezug: null,
    }),
  );
}

function formatViolationsAsHint(violations: SpecificationViolation[]): string {
  return violations.map((violation) => violation.message).join("\n\n");
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach } = import.meta.vitest;

  describe("bestimmte Auswahlmöglichkeiten", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Result } = await import("@/features/planer/domain/common/Result");

    beforeEach(() => {
      vi.mocked(waehleOption).mockImplementation((_, plan) => Result.ok(plan));
    });

    it("creates a disabled Auswahlmöglichkeit including the violation as hint if the resulting Plan is ungültig for an Option", () => {
      vi.mocked(waehleOption).mockImplementation((_, plan, __, ___, option) =>
        option === Variante.Basis
          ? Result.error([{ message: "ungültig" }])
          : Result.ok(plan),
      );

      const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(
        ANY_BERECHNE_ELTERNGELDBEZUEGE,
        ANY_PLAN,
        2,
        Elternteil.Zwei,
      );

      expect(auswahlmoeglichkeiten[Variante.Basis].istAuswaehlbar).toBe(false);
      expect(
        auswahlmoeglichkeiten[Variante.Basis].grundWiesoNichtAuswaehlbar,
      ).toBe("ungültig");
      expect(auswahlmoeglichkeiten[Variante.Plus].istAuswaehlbar).toBe(true);
      expect(auswahlmoeglichkeiten[Variante.Bonus].istAuswaehlbar).toBe(true);
      expect(auswahlmoeglichkeiten[KeinElterngeld].istAuswaehlbar).toBe(true);
    });

    it("forwards the callback to calculate the Elterngeldbezuege and afterwards picks up the value from the hypothentical Plan", () => {
      vi.mocked(waehleOption).mockReturnValue(
        Result.ok({
          ausgangslage: ANY_AUSGANGSLAGE,
          lebensmonate: {
            1: {
              [Elternteil.Eins]: monat(11),
              [Elternteil.Zwei]: monat(12),
            },
            3: {
              [Elternteil.Eins]: monat(21),
              [Elternteil.Zwei]: monat(22),
            },
          },
        }),
      );

      const berechneElterngeldbezuege = () => ({});

      const auswahlmoeglichkeiten = bestimmeAuswahlmoeglichkeiten(
        berechneElterngeldbezuege,
        ANY_PLAN,
        3,
        Elternteil.Zwei,
      );

      expect(waehleOption).toHaveBeenCalledWith(
        berechneElterngeldbezuege,
        expect.anything(),
        3,
        Elternteil.Zwei,
        expect.anything(),
      );
      expect(auswahlmoeglichkeiten[Variante.Basis].elterngeldbezug).toBe(22);
    });

    vi.mock(import("@/features/planer/domain/plan/operation/waehleOption"));

    function monat(elterngeldbezug: number) {
      return {
        elterngeldbezug,
        imMutterschutz: false as const,
      };
    }

    const ANY_AUSGANGSLAGE = {
      anzahlElternteile: 2 as const,
      pseudonymeDerElternteile: {
        [Elternteil.Eins]: "Jane",
        [Elternteil.Zwei]: "John",
      },
      geburtsdatumDesKindes: new Date(),
    };

    const ANY_PLAN = {
      ausgangslage: ANY_AUSGANGSLAGE,
      lebensmonate: {},
    };

    const ANY_BERECHNE_ELTERNGELDBEZUEGE = () => ({});
  });
}
