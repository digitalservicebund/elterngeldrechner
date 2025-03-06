import { utc } from "@date-fns/utc";
import { addDays, addMonths, subDays } from "date-fns";

import type { Lebensmonatszahl } from "@/monatsplaner/Lebensmonatszahl";
import type { Zeitraum } from "@/monatsplaner/zeitraum/Zeitraum";

export function berechneZeitraumFuerLebensmonat(
  geburtsdatumDesKindes: Date,
  lebensmonatszahl: Lebensmonatszahl,
): Zeitraum {
  const from = startOfNthLebensmonat(lebensmonatszahl)(geburtsdatumDesKindes);
  const to = endOfNthLebensmonat(lebensmonatszahl)(geburtsdatumDesKindes);
  return { from, to };
}

const startOfNthLebensmonat = (nth: number) => {
  return (geburtsdatum: Date): Date => {
    const endOfPreviousLebensmonat = endOfNthLebensmonat(nth - 1)(geburtsdatum);
    return addDays(endOfPreviousLebensmonat, 1, {
      in: utc,
    });
  };
};

// reference: https://www.zbfs.bayern.de/familie/elterngeld/lebensmonatsrechner/index.php
const endOfNthLebensmonat = (nth: number) => {
  return (geburtsdatum: Date): Date => {
    const monthsAdded = addMonths(geburtsdatum, nth, {
      in: utc,
    });

    if (monthsAdded.getUTCDate() === geburtsdatum.getUTCDate()) {
      return subDays(monthsAdded, 1, {
        in: utc,
      });
    } else {
      return monthsAdded;
    }
  };
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechne Zeitraum für Lebensmonat", () => {
    describe("date utilties", () => {
      describe("start of n-th Lebensmonat", () => {
        it.each([
          [2, new Date("2000-01-01"), new Date("2000-02-01")],
          [2, new Date("2000-01-31"), new Date("2000-03-01")],
          [2, new Date("2000-12-12"), new Date("2001-01-12")],

          [2, new Date("2020-10-20"), new Date("2020-11-20")],
          [2, new Date("2021-10-20"), new Date("2021-11-20")],
          [2, new Date("2022-10-20"), new Date("2022-11-20")],
          [2, new Date("2023-10-20"), new Date("2023-11-20")],
          [2, new Date("2024-10-20"), new Date("2024-11-20")],
          [2, new Date("2025-10-20"), new Date("2025-11-20")],
          [2, new Date("2026-10-20"), new Date("2026-11-20")],
          [2, new Date("2027-10-20"), new Date("2027-11-20")],
          [2, new Date("2028-10-20"), new Date("2028-11-20")],
          [2, new Date("2029-10-20"), new Date("2029-11-20")],

          [2, new Date("2020-10-29"), new Date("2020-11-29")],
          [2, new Date("2020-10-28"), new Date("2020-11-28")],
          [2, new Date("2021-10-29"), new Date("2021-11-29")],
          [2, new Date("2021-10-28"), new Date("2021-11-28")],
          [2, new Date("2022-10-29"), new Date("2022-11-29")],
          [2, new Date("2022-10-28"), new Date("2022-11-28")],
          [2, new Date("2023-10-29"), new Date("2023-11-29")],
          [2, new Date("2023-10-28"), new Date("2023-11-28")],
          [2, new Date("2024-10-29"), new Date("2024-11-29")],
          [2, new Date("2024-10-28"), new Date("2024-11-28")],
          [2, new Date("2025-10-29"), new Date("2025-11-29")],
          [2, new Date("2025-10-28"), new Date("2025-11-28")],
          [2, new Date("2026-10-29"), new Date("2026-11-29")],
          [2, new Date("2026-10-28"), new Date("2026-11-28")],
          [2, new Date("2027-10-29"), new Date("2027-11-29")],
          [2, new Date("2027-10-28"), new Date("2027-11-28")],
          [2, new Date("2028-10-29"), new Date("2028-11-29")],
          [2, new Date("2028-10-28"), new Date("2028-11-28")],
          [2, new Date("2029-10-29"), new Date("2029-11-29")],
          [2, new Date("2029-10-28"), new Date("2029-11-28")],
        ])(
          "endOfNthLebensmonat(%i)(%i) -> %i",
          (nth, geburtsdatum, startOfLebensmonat) => {
            expect(startOfNthLebensmonat(nth)(geburtsdatum)).toEqual(
              startOfLebensmonat,
            );
          },
        );
      });

      describe("end of n-th Lebensmonat", () => {
        it.each([
          [1, new Date("2024-02-29"), new Date("2024-03-28")],
          [2, new Date("2024-02-29"), new Date("2024-04-28")],
          [3, new Date("2024-02-29"), new Date("2024-05-28")],
          [5, new Date("2024-02-29"), new Date("2024-07-28")],
          [4, new Date("2024-02-29"), new Date("2024-06-28")],
          [6, new Date("2024-02-29"), new Date("2024-08-28")],
          [7, new Date("2024-02-29"), new Date("2024-09-28")],
          [8, new Date("2024-02-29"), new Date("2024-10-28")],
          [9, new Date("2024-02-29"), new Date("2024-11-28")],
          [10, new Date("2024-02-29"), new Date("2024-12-28")],
          [11, new Date("2024-02-29"), new Date("2025-01-28")],
          [12, new Date("2024-02-29"), new Date("2025-02-28")],
          [13, new Date("2024-02-29"), new Date("2025-03-28")],
          [14, new Date("2024-02-29"), new Date("2025-04-28")],
          [15, new Date("2024-02-29"), new Date("2025-05-28")],
          [46, new Date("2024-02-29"), new Date("2027-12-28")],
          [1, new Date("2024-01-31"), new Date("2024-02-29")],
          [2, new Date("2024-01-31"), new Date("2024-03-30")],
          [3, new Date("2024-01-31"), new Date("2024-04-30")],
          [4, new Date("2024-01-31"), new Date("2024-05-30")],
          [5, new Date("2024-01-31"), new Date("2024-06-30")],
          [6, new Date("2024-01-31"), new Date("2024-07-30")],
          [7, new Date("2024-01-31"), new Date("2024-08-30")],
          [8, new Date("2024-01-31"), new Date("2024-09-30")],
          [9, new Date("2024-01-31"), new Date("2024-10-30")],
          [10, new Date("2024-01-31"), new Date("2024-11-30")],
          [11, new Date("2024-01-31"), new Date("2024-12-30")],
          [12, new Date("2024-01-31"), new Date("2025-01-30")],
          [13, new Date("2024-01-31"), new Date("2025-02-28")],
          [14, new Date("2024-01-31"), new Date("2025-03-30")],
          [15, new Date("2024-01-31"), new Date("2025-04-30")],
          [46, new Date("2024-01-31"), new Date("2027-11-30")],
        ])(
          "endOfNthLebensmonat(%i)(%j) -> %j",
          (nth, geburtsdatum, endOfLebensmonat) => {
            expect(endOfNthLebensmonat(nth)(geburtsdatum)).toEqual(
              endOfLebensmonat,
            );
          },
        );
      });
    });
  });
}
