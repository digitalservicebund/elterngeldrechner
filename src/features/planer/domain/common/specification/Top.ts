import { Specification } from "./Specification";

/**
 * In the boolean algebra Top is always true. So this specification is always
 * satisfied.
 * This specification is basically the identity/neutral element for the monoid
 * group of specification over the "and" operation. Use-case would be for
 * example a composition of a specification using the reduce functional pattern.
 * Type casting for the generic instance type will be necessary.
 */
export const Top = Specification.fromPredicate<unknown>(
  "", // this can never be unsatisfied
  () => true,
);
