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
  /** See {@link PredicateSpecification} */
  static fromPredicate<Instance>(
    violationMessage: string,
    predicate: (instance: Instance) => boolean,
  ) {
    return new PredicateSpecification(violationMessage, predicate);
  }

  /** See {@link PropertySpecification} */
  static forProperty<
    Instance extends Record<Key, unknown>,
    Key extends PropertyKey,
  >(
    key: Key,
    specificationForProperty: Specification<Instance[Key]>,
  ): Specification<Instance> {
    return new PropertySpecification(key, specificationForProperty);
  }

  abstract evaluate(instance: Instance): SpecificationResult;

  get asPredicate(): (instance: Instance) => boolean {
    return (instance: Instance) =>
      this.evaluate(instance).mapOrElse(
        () => true,
        () => false,
      );
  }

  /** See {@link AndSpecification} */
  and(other: Specification<Instance>): Specification<Instance> {
    return new AndSpecification(this, other);
  }

  /** See {@link OnlyWhenAlsoSatisfiedSpecification} */
  withPrecondition(
    precondition: Specification<Instance>,
  ): Specification<Instance> {
    return new PreconditionSpecification(this, precondition);
  }
}

/**
 * Can be used to simplify the creation of specifications without the need to
 * implements a whole class. Comes with the restriction of fixed and singular
 * violation (message).
 *
 * Example:
 * ```typescript
 * new PredicateSpecification("not even", (value) => value % 2 === 0).evaluate(2)
 * ```
 */
class PredicateSpecification<Instance> extends Specification<Instance> {
  /**
   * @param message to use for validation violation when unsatisfied
   * @param predicate determines if result is satisfied or unsatisfied
   */
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

/**
 * Can be used to "forward" a specification written for an instance type, that
 * matches the type of a property value on a higher level instance type.
 *
 * Example:
 * ```typescript
 * new PropertySpecification("count", isEvenNumber).evaluate({ count: 2 });
 * ```
 */
class PropertySpecification<
  Key extends PropertyKey,
  Instance extends Record<Key, ValueType>,
  ValueType,
> extends Specification<Instance> {
  /**
   * @param key of the property to validate for
   * @param specificationForProperty specification to evaluate on property value
   */
  constructor(
    private readonly key: Key,
    private readonly specificationForProperty: Specification<Instance[Key]>,
  ) {
    super();
  }

  evaluate(instance: Instance): SpecificationResult {
    const property = instance[this.key];
    return this.specificationForProperty.evaluate(property);
  }
}

/**
 * Evaluates an instance to be satisfied if all inner specifications are
 * satisfied. Else it is unsatisfied with the violations of all inner
 * specifications combined.
 *
 * Example:
 * ```typescript
 * new AndSpecification(isEvenNumber, isLessThanTen).evaluate(4);
 * ```
 */
class AndSpecification<Instance> extends Specification<Instance> {
  /**
   * @param left term of the result operation
   * @param right term of the result operation
   */
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

/**
 * Requires a specification as precondition to be satisfied to make the actual
 * specification being evaluated. If an instance does **NOT** satisfy the
 * precondition the result is always satisfied. It differs from the
 * {@link AndSpecification} in terms of that it never evaluates the actual
 * specification if the precondition is not satisfied and violations are not
 * combined.
 *
 * This can be used to resolve "raise conditions" between specifications to
 * avoid confusion in user facing violation messages. So when combining to
 * specifications, the second should not be unsatisifed if the first is already.
 *
 * Example:
 * ```typescript
 * isEvenNumber.and(isNumberTwo.withPrecondition(isEvenNumber)).evaluate(1);
 * ```
 */
class PreconditionSpecification<Instance> extends Specification<Instance> {
  /**
   * @param actual gets evaluated if precondition is satisfied
   * @param precondition conditions the actual specification
   */
  constructor(
    private readonly actual: Specification<Instance>,
    private readonly precondition: Specification<Instance>,
  ) {
    super();
  }

  evaluate(instance: Instance): SpecificationResult {
    const precondition = this.precondition.asPredicate(instance);

    return !precondition
      ? SpecificationResult.satisfied
      : this.actual.evaluate(instance);
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

    it("can be created for a property of a type", () => {
      const IsEvenNumber = Specification.fromPredicate<number>(
        "number is not even",
        (value) => value % 2 === 0,
      );
      const AgeIsEven = Specification.forProperty<{ age: number }, "age">(
        "age",
        IsEvenNumber,
      );

      expect(AgeIsEven.asPredicate({ age: 2 })).toBe(true);
      expect(AgeIsEven.asPredicate({ age: 3 })).toBe(false);
    });

    describe("connect two specifications with 'and'", () => {
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

      it("forwards the violation of the only unsatisfied specification", () => {
        const violations = Bottom.and(Top)
          .evaluate(null)
          .mapOrElse(
            () => [],
            (violations) => violations,
          );

        expect(violations).toStrictEqual([{ message: "bottom" }]);
      });

      const Top = Specification.fromPredicate("top", () => true);
      const Bottom = Specification.fromPredicate("bottom", () => false);
    });

    describe("with precondition", () => {
      it("evaluates to satisfied if precondition is satisfied and actual specification is satisfied", () => {
        expect(IsNumberTwo.withPrecondition(IsEvenNumber).asPredicate(2)).toBe(
          true,
        );
      });

      it("evaluates to unsatisfied if precondition is satisfied but actual specification is unsatisfied", () => {
        expect(IsNumberTwo.withPrecondition(IsEvenNumber).asPredicate(4)).toBe(
          false,
        );
      });

      it("evaluates to satisfied if actual specficiation is unsatisfied but the precondition is unsatified", () => {
        expect(IsNumberTwo.withPrecondition(IsEvenNumber).asPredicate(3)).toBe(
          true,
        );
      });

      it("evaluates to satisfied if actual specficiation is satisfied but precondition is unsatified", () => {
        expect(IsNumberTwo.withPrecondition(IsEvenNumber).asPredicate(3)).toBe(
          true,
        );
      });

      const IsNumberTwo = Specification.fromPredicate<number>(
        "not number two",
        (value) => value === 2,
      );

      const IsEvenNumber = Specification.fromPredicate<number>(
        "not even number",
        (value) => value % 2 === 0,
      );
    });
  });
}
