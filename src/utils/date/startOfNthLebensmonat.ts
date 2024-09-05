import { addDays } from "./addDays";
import { endOfNthLebensmonat } from "./endOfNthLebensmonat";

export const startOfNthLebensmonat = (nth: number) => {
  return (geburtsdatum: Date) => {
    const endOfPreviousLebensmonat = endOfNthLebensmonat(nth - 1)(geburtsdatum);
    return addDays(1)(endOfPreviousLebensmonat);
  };
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it.each([
    [2, new Date("2000-01-01"), new Date("2000-02-01")],
    [2, new Date("2000-01-31"), new Date("2000-03-01")],
    [2, new Date("2000-12-12"), new Date("2001-01-12")],
  ])(
    "endOfNthLebensmonat(%i)(%i) -> %i",
    (nth, geburtsdatum, startOfLebensmonat) => {
      expect(startOfNthLebensmonat(nth)(geburtsdatum)).toStrictEqual(
        startOfLebensmonat,
      );
    },
  );
}
