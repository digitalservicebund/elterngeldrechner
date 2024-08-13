import { SpecificationResult } from "./SpecificationResult";

/**
 * Basic implementation of the general design pattern of specifications. Used
 * primarily for in-memory validation and data retrieval. It helps to
 * encapsulates business logic in small, easy to test, composable and re-usable
 * code units.
 *
 * The interface is meant to allow for a good developer experience. Further
 * compositions and interactions will be added with the need by further
 * use-cases.
 */
export abstract class Specification<Instance> {
  static fromPredicate<Instance>(
    violationMessage: string,
    predicate: (instance: Instance) => boolean,
  ): Specification<Instance> {
    return new PredicateSpecification(violationMessage, predicate);
  }

  abstract evaluate(instance: Instance): SpecificationResult;

  get asPredicate(): (instance: Instance) => boolean {
    return (instance: Instance) =>
      this.evaluate(instance).mapOrElse(
        () => true,
        () => false,
      );
  }

  and(other: Specification<Instance>): Specification<Instance> {
    return new AndSpecification(this, other);
  }
}

class PredicateSpecification<Instance> extends Specification<Instance> {
  constructor(
    private readonly message: string,
    private readonly predicate: (instance: Instance) => boolean,
  ) {
    super();
  }

  public evaluate(instance: Instance): SpecificationResult {
    return SpecificationResult.from(this.predicate(instance), this.message);
  }
}

class AndSpecification<Instance> extends Specification<Instance> {
  constructor(
    private readonly left: Specification<Instance>,
    private readonly right: Specification<Instance>,
  ) {
    super();
  }

  evaluate(instance: Instance): SpecificationResult {
    return this.left.evaluate(instance).and(this.right.evaluate(instance));
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Specification", () => {
    it("can be created from a predicate and used as predicate", () => {
      const IsEvenNumber = Specification.fromPredicate<number>(
        "number is not even",
        (value) => value % 2 === 0,
      );

      expect(IsEvenNumber.asPredicate(2)).toBe(true);
      expect(IsEvenNumber.asPredicate(3)).toBe(false);
    });

    describe("connect two specifications with 'and'", async () => {
      const { Top, Bottom } = await import(
        "@/features/planer/domain/common/specification"
      );

      it("evaluates to satisfied if left and right are satisfied", () => {
        expect(Top.and(Top).asPredicate(null)).toBe(true);
      });

      it("evaluates to unsatisfied if left is satisfied, but right is unsatisfied", () => {
        expect(Top.and(Bottom).asPredicate(null)).toBe(false);
      });

      it("evaluates to unsatisfied if left is unsatisfied, but right is satisfied", () => {
        expect(Bottom.and(Top).asPredicate(null)).toBe(false);
      });

      it("evaluates to unsatisfied if left and right are unsatisfied", () => {
        expect(Bottom.and(Bottom).asPredicate(null)).toBe(false);
      });
    });
  });
}
