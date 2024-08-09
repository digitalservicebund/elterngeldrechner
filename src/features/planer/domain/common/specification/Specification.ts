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

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("can be created from a predicate and used as predicate", () => {
    const IsEvenNumber = Specification.fromPredicate<number>(
      "number is not even",
      (value) => value % 2 === 0,
    );

    expect(IsEvenNumber.asPredicate(2)).toBe(true);
    expect(IsEvenNumber.asPredicate(3)).toBe(false);
  });
}
