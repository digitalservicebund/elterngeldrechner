import { Specification } from "./Specification";

/**
 * In the boolean algebra Bottom is always false. So this specification is always
 * unsatisfied.
 */
export const Bottom = Specification.fromPredicate<unknown>(
  "bottom - always false",
  () => false,
);
