export enum Variante {
  Basis = "Basiselterngeld",
  Plus = "ElterngeldPlus",
  Bonus = "Partnerschaftsbonus",
}

export function isVariante(value: unknown): value is Variante {
  return (
    typeof value === "string" &&
    Object.values(Variante).includes(value as Variante)
  );
}

export function compareVarianten(left: Variante, right: Variante): number {
  return VARIANTE_SORT_RANKING[left] - VARIANTE_SORT_RANKING[right];
}

const VARIANTE_SORT_RANKING: Record<Variante, number> = {
  [Variante.Basis]: 1,
  [Variante.Plus]: 2,
  [Variante.Bonus]: 3,
};

if (import.meta.vitest) {
  const { test, expect, describe, it } = import.meta.vitest;

  describe("type guard", () => {
    it.each(["Basiselterngeld", "ElterngeldPlus", "Partnerschaftsbonus"])(
      "is satisfied by %s",
      (value) => {
        expect(isVariante(value)).toBe(true);
      },
    );

    it.each(["Basis", "Plus", "Bonus", "Partnerbonus", "Elterngeld", "None"])(
      "is unsatisfied by %s",
      (value) => {
        expect(isVariante(value)).toBe(false);
      },
    );
  });

  describe("compare function", () => {
    test.each([
      {
        unsorted: [Variante.Bonus, Variante.Plus, Variante.Basis],
        sorted: [Variante.Basis, Variante.Plus, Variante.Bonus],
      },
      {
        unsorted: [Variante.Basis, Variante.Plus, Variante.Bonus],
        sorted: [Variante.Basis, Variante.Plus, Variante.Bonus],
      },
    ])(
      "used for sorting, puts the Varianten in correct order ($unsorted)",
      ({ unsorted, sorted }) => {
        expect(unsorted.sort(compareVarianten)).toStrictEqual(sorted);
      },
    );
  });
}
