import { zaehleVerplantesKontingent } from "@/features/planer/domain/lebensmonate";
import { SpecificationResult } from "@/features/planer/domain/common/specification/SpecificationResult";
import {
  Ausgangslage,
  bestimmeVerfuegbaresKontingent,
} from "@/features/planer/domain/ausgangslage";
import {
  Specification,
  type SpecificationViolation,
} from "@/features/planer/domain/common/specification";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import { listeKontingentAuf } from "@/features/planer/domain/verfuegbares-kontingent";
import type { Variante } from "@/features/planer/domain/Variante";

export function KontingentWurdeEingehalten<A extends Ausgangslage>() {
  return new KontingentWurdeEingehaltenSpecification<A>();
}

class KontingentWurdeEingehaltenSpecification<
  A extends Ausgangslage,
> extends Specification<Plan<A>> {
  evaluate(plan: Plan<A>): SpecificationResult {
    const verfuegbar = bestimmeVerfuegbaresKontingent(plan.ausgangslage);
    const verplant = zaehleVerplantesKontingent(plan.lebensmonate);

    const violations = listeKontingentAuf(verfuegbar).reduce(
      (violations: SpecificationViolation[], [variante, maximum]) =>
        verplant[variante] > maximum
          ? [...violations, composeKontingentViolation(variante, maximum)]
          : violations,
      [],
    );

    return violations.length === 0
      ? SpecificationResult.satisfied
      : SpecificationResult.unsatisfied(violations[0], ...violations.splice(1));
  }
}

function composeKontingentViolation(
  variante: Variante,
  maximum: number,
): SpecificationViolation {
  return {
    message: `Ihre ${maximum} verfügbaren ${variante} Monate sind aufgebraucht.`,
  };
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Kontingent wurde eingehalten", async () => {
    const { Variante } = await import("@/features/planer/domain/Variante");
    const { KeinElterngeld } = await import(
      "@/features/planer/domain/Auswahloption"
    );

    it("is satisfied if verplantes Kontingent remains below verfügbares Kontingent", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        kontingent(2, 4, 3),
      );
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        kontingent(1.5, 3, 1),
      );

      expect(KontingentWurdeEingehalten().asPredicate(ANY_PLAN)).toBe(true);
    });

    it("is satisfied if verplantes Kontingent fully used verfügbares Kontingent", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        kontingent(2, 4, 3),
      );
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        kontingent(2, 4, 3),
      );

      expect(KontingentWurdeEingehalten().asPredicate(ANY_PLAN)).toBe(true);
    });

    it("is unsatisfied if verplantes Kontingent is above verfügbares Kontingent", () => {
      vi.mocked(bestimmeVerfuegbaresKontingent).mockReturnValue(
        kontingent(2, 4, 3),
      );
      vi.mocked(zaehleVerplantesKontingent).mockReturnValue(
        kontingent(3, 6, 4),
      );

      const violationMessages = KontingentWurdeEingehalten()
        .evaluate(ANY_PLAN)
        .mapOrElse(
          () => [],
          (violations) => violations.map(({ message }) => message),
        );

      expect(violationMessages).toHaveLength(3);
      expect(violationMessages).toEqual(
        expect.arrayContaining([
          "Ihre 2 verfügbaren Basiselterngeld Monate sind aufgebraucht.",
          "Ihre 4 verfügbaren ElterngeldPlus Monate sind aufgebraucht.",
          "Ihre 3 verfügbaren Partnerschaftsbonus Monate sind aufgebraucht.",
        ]),
      );
    });

    const kontingent = function (basis: number, plus: number, bonus: number) {
      return {
        [Variante.Basis]: basis,
        [Variante.Plus]: plus,
        [Variante.Bonus]: bonus,
        [KeinElterngeld]: 0,
      };
    };

    const ANY_PLAN = {} as any;

    vi.mock(
      "@/features/planer/domain/lebensmonate/operation/zaehleVerplantesKontingent",
    );
    vi.mock(
      "@/features/planer/domain/ausgangslage/operation/bestimmeVerfuegbaresKontingent",
    );
  });
}
