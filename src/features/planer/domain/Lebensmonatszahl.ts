export const Lebensmonatszahlen = Object.freeze([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
] as const);

export type Lebensmonatszahl = (typeof Lebensmonatszahlen)[number];

export function isLebensmonatszahl(value: unknown): value is Lebensmonatszahl {
  return (
    typeof value === "number" &&
    Lebensmonatszahlen.includes(value as Lebensmonatszahl)
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test.each(Array.from({ length: 32 }, (_, index) => index + 1))(
    "type guard is satisfied by %s",
    (value) => {
      expect(isLebensmonatszahl(value)).toBe(true);
    },
  );

  test.each([0, 33, 12345, "1", "2", "Eins", "One"])(
    "type guard unsatisfied by %s",
    (value) => {
      expect(isLebensmonatszahl(value)).toBe(false);
    },
  );
}
