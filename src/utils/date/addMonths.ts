import { lastDayOfMonth } from "./lastDayOfMonth";

export const addMonths = (months: number) => {
  return (date: Date) => {
    const d = new Date(date.valueOf());
    const day = d.getDate();
    // updating month without causing an overflow
    d.setDate(1);
    d.setUTCMonth(d.getUTCMonth() + months);

    if (day > lastDayOfMonth(d)) {
      d.setDate(lastDayOfMonth(d));
    } else {
      d.setDate(day);
    }
    return d;
  };
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
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
}
