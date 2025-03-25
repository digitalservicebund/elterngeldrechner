import type { Ausgangslage } from "@/monatsplaner/Ausgangslage";
import type { Plan } from "@/monatsplaner/Plan";
import { FinalGueltigerPlan } from "@/monatsplaner/Plan/specification";
import { Result } from "@/monatsplaner/common/Result";
import { SpecificationViolation } from "@/monatsplaner/common/specification";

export function validierePlanFuerFinaleAbgabe<A extends Ausgangslage>(
  plan: Plan<A>,
): Result<void, SpecificationViolation[]> {
  return FinalGueltigerPlan<A>()
    .evaluate(plan)
    .mapOrElse(() => Result.ok(undefined), Result.error);
}

if (import.meta.vitest) {
  const { describe, it, expect, vi } = import.meta.vitest;

  describe("validiere Plan für finale Abgabe", async () => {
    const { Specification } = await import(
      "@/monatsplaner/common/specification"
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

    vi.mock(import("@/monatsplaner/Plan/specification/FinalGueltigerPlan"));

    const ANY_PLAN = {} as never; // TODO: Get test data factories!
  });
}
