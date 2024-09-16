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

export function compareElternteile(
  left: Elternteil,
  right: Elternteil,
): number {
  return ELTERNTEIL_SORT_RANK[left] - ELTERNTEIL_SORT_RANK[right];
}

const ELTERNTEIL_SORT_RANK: Record<Elternteil, number> = {
  [Elternteil.Eins]: 1,
  [Elternteil.Zwei]: 2,
};

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  describe("type guard", () => {
    it.each(["Elternteil 1", "Elternteil 2"])("is satisfied by %s", (value) => {
      expect(isElternteil(value)).toBe(true);
    });

    it.each(["ET1", "Elternteil Eins", "Parent 1", 1])(
      "is unsatisfied by %s",
      (value) => {
        expect(isElternteil(value)).toBe(false);
      },
    );
  });

  describe("compare function", () => {
    test.each([
      {
        unsorted: [Elternteil.Eins, Elternteil.Zwei],
        sorted: [Elternteil.Eins, Elternteil.Zwei],
      },
      {
        unsorted: [Elternteil.Zwei, Elternteil.Eins],
        sorted: [Elternteil.Eins, Elternteil.Zwei],
      },
    ])(
      "used for sorting, puts the Elternteile in correct order ($unsorted)",
      ({ unsorted, sorted }) => {
        expect(unsorted.sort(compareElternteile)).toStrictEqual(sorted);
      },
    );
  });
}
