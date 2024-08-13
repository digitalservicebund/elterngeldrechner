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

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test.each(["Basiselterngeld", "ElterngeldPlus", "Partnerschaftsbonus"])(
    "type guard is satisfied by %s",
    (value) => {
      expect(isVariante(value)).toBe(true);
    },
  );

  test.each(["Basis", "Plus", "Bonus", "Partnerbonus", "Elterngeld", "None"])(
    "type guard is unsatisfied by %s",
    (value) => {
      expect(isVariante(value)).toBe(false);
    },
  );
}
