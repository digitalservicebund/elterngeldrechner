export const Lebensmonatszahlen = Object.freeze([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
] as const);

export type Lebensmonatszahl = (typeof Lebensmonatszahlen)[number];

export const LetzteLebensmonatszahl =
  Lebensmonatszahlen[Lebensmonatszahlen.length - 1];

export function isLebensmonatszahl(value: unknown): value is Lebensmonatszahl {
  return (
    typeof value === "number" &&
    Lebensmonatszahlen.includes(value as Lebensmonatszahl)
  );
}

export function compareLebensmonatszahlen(
  left: Lebensmonatszahl,
  right: Lebensmonatszahl,
): number {
  return left - right;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  describe("type guard", () => {
    it.each(Array.from({ length: 32 }, (_, index) => index + 1))(
      "is satisfied by %s",
      (value) => {
        expect(isLebensmonatszahl(value)).toBe(true);
      },
    );

    it.each([0, 33, 12345, "1", "2", "Eins", "One"])(
      "is unsatisfied by %s",
      (value) => {
        expect(isLebensmonatszahl(value)).toBe(false);
      },
    );
  });

  describe("compare function", () => {
    test.each<{ unsorted: Lebensmonatszahl[]; sorted: Lebensmonatszahl[] }>([
      { unsorted: [5, 4, 3, 2, 1], sorted: [1, 2, 3, 4, 5] },
      { unsorted: [1, 2, 3], sorted: [1, 2, 3] },
      { unsorted: [32, 1, 17, 8, 9, 10], sorted: [1, 8, 9, 10, 17, 32] },
    ])(
      "used for sorting, puts the Lebensmonatszahlen in correct order ($unsorted)",
      ({ unsorted, sorted }) => {
        expect(unsorted.sort(compareLebensmonatszahlen)).toStrictEqual(sorted);
      },
    );
  });
}
