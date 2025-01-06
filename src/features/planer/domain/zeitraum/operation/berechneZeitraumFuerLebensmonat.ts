import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Zeitraum } from "@/features/planer/domain/zeitraum/Zeitraum";

export function berechneZeitraumFuerLebensmonat(
  geburtsdatumDesKindes: Date,
  lebensmonatszahl: Lebensmonatszahl,
): Zeitraum {
  const from = startOfNthLebensmonat(lebensmonatszahl)(geburtsdatumDesKindes);
  const to = endOfNthLebensmonat(lebensmonatszahl)(geburtsdatumDesKindes);
  return { from, to };
}

const startOfNthLebensmonat = (nth: number) => {
  return (geburtsdatum: Date) => {
    const endOfPreviousLebensmonat = endOfNthLebensmonat(nth - 1)(geburtsdatum);
    return addDays(1)(endOfPreviousLebensmonat);
  };
};

// reference: https://www.zbfs.bayern.de/familie/elterngeld/lebensmonatsrechner/index.php
const endOfNthLebensmonat = (nth: number) => {
  return (geburtsdatum: Date) => {
    const monthsAdded = addMonths(nth)(geburtsdatum);

    if (monthsAdded.getUTCDate() === geburtsdatum.getUTCDate()) {
      return subDays(1)(monthsAdded);
    } else {
      return monthsAdded;
    }
  };
};

const addMonths = (months: number) => {
  return (date: Date) => {
    const d = new Date(date.valueOf());
    const day = d.getDate();
    // updating month without causing an overflow
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() + months);

    if (day > lastDayOfMonth(d)) {
      d.setUTCDate(lastDayOfMonth(d));
    } else {
      d.setUTCDate(day);
    }
    return d;
  };
};

const addDays = (days: number) => {
  return (date: Date) => {
    const d = new Date(date.valueOf());
    d.setUTCDate(d.getUTCDate() + days);
    return d;
  };
};

const subDays = (days: number) => addDays(-1 * days);

const lastDayOfMonth = (date: Date) => {
  const months30 = [april, june, september, november];
  const month = date.getUTCMonth();

  if (month === february) return isLeapYear(date) ? 29 : 28;
  if (months30.includes(month)) return 30;
  return 31;
};

const february = 1;
const april = 3;
const june = 5;
const september = 8;
const november = 10;

const isLeapYear = (date: Date) => {
  const year = date.getUTCFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
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
            expect(startOfNthLebensmonat(nth)(geburtsdatum)).toStrictEqual(
              startOfLebensmonat,
            );
          },
        );
      });

      describe("end of n-th Lebensmonat", () => {
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
            expect(
              toIso(endOfNthLebensmonat(nth)(new Date(geburtsdatum))),
            ).toBe(endOfLebensmonat);
          },
        );

        const toIso = (date: Date) => date.toISOString().slice(0, 10);
      });

      describe("add months", () => {
        it("returns a new Date instance", () => {
          const givenDate = new Date("2024-08-18");
          const returnedDate = addMonths(2)(givenDate);
          expect(returnedDate).not.toBe(givenDate);
          expect(returnedDate.getMonth()).toEqual(9);
          expect(givenDate.getMonth()).toEqual(7);
        });

        it("adds months", () => {
          expect(addMonths(2)(new Date("2024-08-18"))).toStrictEqual(
            new Date("2024-10-18"),
          );
          expect(addMonths(14)(new Date("2024-08-18"))).toStrictEqual(
            new Date("2025-10-18"),
          );
          expect(addMonths(32)(new Date("2024-08-31"))).toStrictEqual(
            new Date("2027-04-30"),
          );
          expect(addMonths(32)(new Date("2024-09-29"))).toStrictEqual(
            new Date("2027-05-29"),
          );
        });

        describe("when the resulting month has not enough days", () => {
          it("January 30th -> February 28th", () => {
            expect(addMonths(1)(new Date("2023-01-30"))).toStrictEqual(
              new Date("2023-02-28"),
            );
          });
          it("January 31th -> February 28th", () => {
            expect(addMonths(1)(new Date("2023-01-31"))).toStrictEqual(
              new Date("2023-02-28"),
            );
          });
          it("January 31th -> February 29th in a leap year", () => {
            expect(addMonths(1)(new Date("2024-01-31"))).toStrictEqual(
              new Date("2024-02-29"),
            );
          });
          it("January 31th -> April 30th", () => {
            expect(addMonths(3)(new Date("2024-01-31"))).toStrictEqual(
              new Date("2024-04-30"),
            );
          });
        });
      });

      describe("add days", () => {
        it("returns a new Date instance", () => {
          const givenDate = new Date("2024-08-18");
          const returnedDate = addDays(2)(givenDate);
          expect(returnedDate).not.toBe(givenDate);
          expect(returnedDate.getDate()).toEqual(20);
          expect(givenDate.getDate()).toEqual(18);
        });

        it("adds days", () => {
          expect(addDays(2)(new Date("2024-08-18"))).toStrictEqual(
            new Date("2024-08-20"),
          );
          expect(addDays(30000)(new Date("2024-08-18"))).toStrictEqual(
            new Date("2106-10-08"),
          );
        });
      });

      describe("subtract days", () => {
        it("subtracts days", () => {
          expect(subDays(2)(new Date("2024-08-18"))).toStrictEqual(
            new Date("2024-08-16"),
          );
          expect(subDays(30000)(new Date("2024-08-18"))).toStrictEqual(
            new Date("1942-06-30"),
          );
        });
      });

      describe("last day of monath", () => {
        it("returns 28", () => {
          expect(lastDayOfMonth(new Date("2023-02-18"))).toBe(28);
        });
        it("returns 29", () => {
          expect(lastDayOfMonth(new Date("2024-02-18"))).toBe(29);
        });
        it("returns 30", () => {
          expect(lastDayOfMonth(new Date("2024-09-18"))).toBe(30);
        });
        it("returns 31", () => {
          expect(lastDayOfMonth(new Date("2024-08-18"))).toBe(31);
        });
      });

      describe("is leap year", () => {
        it.each([
          new Date("2000-01-01"),
          new Date("2024-01-01"),
          new Date("2028-01-01"),
          new Date("2032-01-01"),
        ])("isLeap(%i) -> true", (date) => {
          expect(isLeapYear(date)).toBe(true);
        });

        it.each([
          new Date("2001-01-01"),
          new Date("2023-01-01"),
          new Date("2025-01-01"),
          new Date("2031-01-01"),
        ])("isLeap(%i) -> false", (date) => {
          expect(isLeapYear(date)).toBe(false);
        });
      });
    });
  });
}
