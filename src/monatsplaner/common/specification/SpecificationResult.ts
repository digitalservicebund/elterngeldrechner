import type { SpecificationViolation } from "./SpecificationViolation";

/**
 * Represents the evaluation result of a {@link Specification}. It can be either
 * satisfied or unsatisfied. In the latter case it will include a list of
 * violations why the specification was unsatisfied.
 *
 * Access to the result is given by methods that follow a functional monad
 * approach. Enforcing more involved inspection of the result. Further methods
 * will be added with further use-cases.
 *
 * This can be seen as a use-case optimized version of the more generic
 * {@link Result} implementation.
 */
export class SpecificationResult {
  private constructor(private options: SpecificationResultOptions) {}

  static satisfied = new SpecificationResult({ isSatisfied: true });

  static unsatisfied(
    violation: SpecificationViolation,
    ...moreViolations: SpecificationViolation[]
  ) {
    return new SpecificationResult({
      isSatisfied: false,
      violations: [violation, ...moreViolations],
    });
  }

  static from(
    isSatisfied: boolean,
    violationMessage: string,
  ): SpecificationResult {
    return isSatisfied
      ? SpecificationResult.satisfied
      : SpecificationResult.unsatisfied({ message: violationMessage });
  }

  and(other: SpecificationResult): SpecificationResult {
    if (this.options.isSatisfied && other.options.isSatisfied) {
      return SpecificationResult.satisfied;
    } else {
      const violations = [
        ...(this.options.violations ?? []),
        ...(other.options.violations ?? []),
      ];
      return SpecificationResult.unsatisfied(
        violations[0]!, // TODO: Use proper type-diven design here.
        ...violations.splice(1),
      );
    }
  }

  mapOrElse<Output, MapOutput extends Output, OrElseOutput extends Output>(
    onSatisfied: () => MapOutput,
    onUnsatisfied: (violations: SpecificationViolation[]) => OrElseOutput,
  ): Output {
    return this.options.isSatisfied
      ? onSatisfied()
      : onUnsatisfied(this.options.violations);
  }
}

type SpecificationResultOptions<IsSatisfied extends boolean = boolean> =
  IsSatisfied extends true
    ? { isSatisfied: true; violations?: never }
    : { isSatisfied: false; violations: SpecificationViolation[] };

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  it("can use the satisfied result instance", () => {
    const result = SpecificationResult.satisfied;

    const isSatisfied = result.mapOrElse(
      () => true,
      () => false,
    );

    expect(isSatisfied).toBe(true);
  });

  it("can construct and use the unsatisfied result factory", () => {
    const result = SpecificationResult.unsatisfied(
      { message: "first violation" },
      { message: "second violation" },
    );

    const violations = result.mapOrElse(
      () => [],
      (violations) => violations,
    );

    expect(violations).toEqual([
      { message: "first violation" },
      { message: "second violation" },
    ]);
  });

  describe("specification result from boolean and message", () => {
    it("is satisfied if boolean is true", () => {
      const result = SpecificationResult.from(true, "test message");

      expect(result).toBe(SpecificationResult.satisfied);
    });

    it("is unsatisfied with the message as violation if the boolean is false", () => {
      const result = SpecificationResult.from(false, "test message");
      const violations = result.mapOrElse(
        () => [],
        (violations) => violations,
      );

      expect(violations).toEqual([{ message: "test message" }]);
    });

    describe("connect to result with 'and'", () => {
      it("is satisfied if lef and right are satisfied", () => {
        const result = SpecificationResult.satisfied.and(
          SpecificationResult.satisfied,
        );

        expect(result).toBe(SpecificationResult.satisfied);
      });

      it("is unsatisfied if left is satisfied, but right is unsatisfied", () => {
        const result = SpecificationResult.satisfied.and(
          SpecificationResult.unsatisfied({ message: "right unsatisfied" }),
        );

        const violations = getViolations(result);
        expect(violations).toEqual([{ message: "right unsatisfied" }]);
      });

      it("is unsatisfied if left is unsatisfied, but right is satisfied", () => {
        const result = SpecificationResult.unsatisfied({
          message: "left unsatisfied",
        }).and(SpecificationResult.satisfied);

        const violations = getViolations(result);
        expect(violations).toEqual([{ message: "left unsatisfied" }]);
      });

      it("is unsatisfied if left and right are unsatisfied", () => {
        const result = SpecificationResult.unsatisfied({
          message: "left unsatisfied",
        }).and(
          SpecificationResult.unsatisfied({ message: "right unsatisfied" }),
        );

        const violations = getViolations(result);
        expect(violations).toEqual([
          { message: "left unsatisfied" },
          { message: "right unsatisfied" },
        ]);
      });

      function getViolations(
        result: SpecificationResult,
      ): SpecificationViolation[] {
        return result.mapOrElse(
          () => [],
          (violations) => violations,
        );
      }
    });
  });
}
