import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type {
  Ausgangslage,
  AusgangslageFuerEinElternteil,
} from "@/features/planer/domain/Ausgangslage";
import { listeLebensmonateAuf } from "@/features/planer/domain/lebensmonate";
import { AlleElternteileHabenBasisGewaehlt } from "@/features/planer/domain/lebensmonat";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import { Specification } from "@/features/planer/domain/common/specification";

export function NurEinLebensmonatBasisParallel<A extends Ausgangslage>() {
  return Specification.fromPredicate<Plan<A>>(
    "Es kann maximal ein Monat parallel Basiselterngeld bezogen werden.",
    (plan) => {
      const {
        anzahlElternteile,
        hatBehindertesGeschwisterkind,
        sindMehrlinge,
      } = plan.ausgangslage;

      const canNotBeApplied = anzahlElternteile === 1;
      const istAusnahme = hatBehindertesGeschwisterkind || sindMehrlinge;

      if (canNotBeApplied || istAusnahme) {
        return true;
      } else {
        return (
          listeLebensmonateAuf(plan.lebensmonate)
            .map(([, lebensmonat]) => lebensmonat)
            .filter(AlleElternteileHabenBasisGewaehlt.asPredicate).length <= 1
        );
      }
    },
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Nur ein Lebensmonat Basiselterngeld parallel", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { Top } = await import(
      "@/features/planer/domain/common/specification"
    );

    it("is satisfied if all Elternteile took only a single Lebensmonat Basiselterngeld in parallel", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        3: {
          [Elternteil.Eins]: monat(Variante.Plus),
          [Elternteil.Zwei]: monat(Variante.Plus),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(true);
    });

    it("is not satisfied if all Elternteile took more than a single Lebensmonat Basiselterngeld in parallel", () => {
      const lebensmonate = {
        1: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
        2: {
          [Elternteil.Eins]: monat(Variante.Basis),
          [Elternteil.Zwei]: monat(Variante.Basis),
        },
      };
      const plan = { ...ANY_PLAN, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(false);
    });

    it("can never be unsatisfied if it only a single Elternteil", () => {
      const ausgangslage = { anzahlElternteile: 1 as const };
      const lebensmonate = {
        1: { [Elternteil.Eins]: monat(Variante.Basis) },
        2: { [Elternteil.Eins]: monat(Variante.Basis) },
      };
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(
        NurEinLebensmonatBasisParallel<AusgangslageFuerEinElternteil>().asPredicate(
          plan,
        ),
      ).toBe(true);
    });

    it("is always satisfied if there is a behindertes Geschwisterkind", () => {
      const ausgangslage = {
        hatBehindertesGeschwisterkind: true,
        anzahlElternteile: 2 as const,
      };
      const lebensmonate = LEBENSMONATE_WITH_MULITPLE_PARALLEL_BASIS;
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(true);
    });

    it("is always satisfied if there are Mehrline", () => {
      const ausgangslage = {
        sindMehrlinge: true,
        anzahlElternteile: 2 as const,
      };
      const lebensmonate = LEBENSMONATE_WITH_MULITPLE_PARALLEL_BASIS;
      const plan = { ...ANY_PLAN, ausgangslage, lebensmonate };

      expect(NurEinLebensmonatBasisParallel().asPredicate(plan)).toBe(true);
    });

    const monat = function (gewaehlteOption: Auswahloption) {
      return { gewaehlteOption, imMutterschutz: false as const };
    };

    const ANY_PLAN = {
      ausgangslage: { anzahlElternteile: 2 as const },
      lebensmonate: {},
      errechneteElterngeldbezuege: {} as any,
      gueltigerPlan: Top,
    };

    const LEBENSMONATE_WITH_MULITPLE_PARALLEL_BASIS = {
      1: {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      },
      2: {
        [Elternteil.Eins]: monat(Variante.Basis),
        [Elternteil.Zwei]: monat(Variante.Basis),
      },
    };
  });
}
