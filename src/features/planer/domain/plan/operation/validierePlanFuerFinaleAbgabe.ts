import { vi } from "vitest";
import { FinalGueltigerPlan } from "@/features/planer/domain/plan/specification";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import { Result } from "@/features/planer/domain/common/Result";
import { SpecificationViolation } from "@/features/planer/domain/common/specification";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function validierePlanFuerFinaleAbgabe<A extends Ausgangslage>(
  plan: Plan<A>,
): Result<void, SpecificationViolation[]> {
  return FinalGueltigerPlan<A>()
    .evaluate(plan)
    .mapOrElse(() => Result.ok(undefined), Result.error);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("validiere Plan für finale Abgabe", async () => {
    const { Specification } = await import(
      "@/features/planer/domain/common/specification"
    );

    it("is ok with undefined value if given Plan satisfies specification", () => {
      vi.mocked(FinalGueltigerPlan).mockReturnValue(
        Specification.fromPredicate("", () => true),
      );

      const value = validierePlanFuerFinaleAbgabe(ANY_PLAN).unwrapOrElse(
        () => "error",
      );

      expect(value).toBeUndefined();
    });

    it("is an error with validation violations when given Plan does not satisfies specification", () => {
      vi.mocked(FinalGueltigerPlan).mockReturnValue(
        Specification.fromPredicate("ungültig", () => false),
      );

      const error = validierePlanFuerFinaleAbgabe(ANY_PLAN).unwrapOrElse(
        (violations) => violations,
      );

      expect(error).toEqual([{ message: "ungültig" }]);
    });

    vi.mock(
      import("@/features/planer/domain/plan/specification/FinalGueltigerPlan"),
    );

    const ANY_PLAN = {} as never; // TODO: Get test data factories!
  });
}
