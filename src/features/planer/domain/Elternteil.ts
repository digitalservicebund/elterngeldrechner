export enum Elternteil {
  Eins = "Elternteil 1",
  Zwei = "Elternteil 2",
}

/**
 * !!Careful!!
 * It can actually not be guaranteed that the generic part is true. In fact the
 * generic part is actually discarded as this information is not processable
 * during runtime. But it is needed to make it integrate into generic parts of
 * the domain.
 */
export function isElternteil<E>(value: unknown): value is E {
  return (
    typeof value === "string" &&
    Object.values(Elternteil).includes(value as Elternteil)
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test.each(["Elternteil 1", "Elternteil 2"])(
    "type guard is satisfied by %s",
    (value) => {
      expect(isElternteil(value)).toBe(true);
    },
  );

  test.each(["ET1", "Elternteil Eins", "Parent 1", 1])(
    "type guard unsatisfied by %s",
    (value) => {
      expect(isElternteil(value)).toBe(false);
    },
  );
}
