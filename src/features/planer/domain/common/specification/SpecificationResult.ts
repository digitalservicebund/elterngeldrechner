import type { SpecificationViolation } from "./SpecificationViolation";

/**
 * Represents the evaluation result of a {@link Specification}. It can be either
 * satisfied or unsatisfied. In the latter case it will include a list of
 * violations why the specification was unsatisfied.
 *
 * Access to the result is given by methods that follow a functional monad
 * approach. Enforcing more involved inspection of the result. Further methods
 * will be added with further use-cases.
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
  });
}
