import { addMonths } from "./addMonths";
import { subDays } from "./subDays";

// reference: https://www.zbfs.bayern.de/familie/elterngeld/lebensmonatsrechner/index.php
export const endOfNthLebensmonat = (nth: number) => {
  return (geburtsdatum: Date) => {
    const monthsAdded = addMonths(nth)(geburtsdatum);

    if (monthsAdded.getUTCDate() === geburtsdatum.getUTCDate()) {
      return subDays(1)(monthsAdded);
    } else {
      return monthsAdded;
    }
  };
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  const toIso = (date: Date) => date.toISOString().slice(0, 10);

  it.each([
    [1, "2024-02-29", "2024-03-28"],
    [2, "2024-02-29", "2024-04-28"],
    [3, "2024-02-29", "2024-05-28"],
    [4, "2024-02-29", "2024-06-28"],
    [5, "2024-02-29", "2024-07-28"],
    [6, "2024-02-29", "2024-08-28"],
    [7, "2024-02-29", "2024-09-28"],
    [8, "2024-02-29", "2024-10-28"],
    [9, "2024-02-29", "2024-11-28"],
    [10, "2024-02-29", "2024-12-28"],
    [11, "2024-02-29", "2025-01-28"],
    [12, "2024-02-29", "2025-02-28"],
    [13, "2024-02-29", "2025-03-28"],
    [14, "2024-02-29", "2025-04-28"],
    [15, "2024-02-29", "2025-05-28"],
    [46, "2024-02-29", "2027-12-28"],
    [1, "2024-01-31", "2024-02-29"],
    [2, "2024-01-31", "2024-03-30"],
    [3, "2024-01-31", "2024-04-30"],
    [4, "2024-01-31", "2024-05-30"],
    [5, "2024-01-31", "2024-06-30"],
    [6, "2024-01-31", "2024-07-30"],
    [7, "2024-01-31", "2024-08-30"],
    [8, "2024-01-31", "2024-09-30"],
    [9, "2024-01-31", "2024-10-30"],
    [10, "2024-01-31", "2024-11-30"],
    [11, "2024-01-31", "2024-12-30"],
    [12, "2024-01-31", "2025-01-30"],
    [13, "2024-01-31", "2025-02-28"],
    [14, "2024-01-31", "2025-03-30"],
    [15, "2024-01-31", "2025-04-30"],
    [46, "2024-01-31", "2027-11-30"],
  ])(
    "endOfNthLebensmonat(%i)(%j) -> %j",
    (nth, geburtsdatum, endOfLebensmonat) => {
      expect(toIso(endOfNthLebensmonat(nth)(new Date(geburtsdatum)))).toBe(
        endOfLebensmonat,
      );
    },
  );
}
