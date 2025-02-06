import { addMonths, setDate, subDays } from "date-fns";

export function minusDays(date: Date, days: number) {
  return subDays(date, days);
}

export function plusMonths(date: Date, months: number) {
  return addMonths(date, months);
}

export function setDayOfMonth(date: Date, dayOfMonth: number) {
  return setDate(date, dayOfMonth);
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("date utilities", () => {
    describe.each([
      ["1995-02-24T03:24:00", 0, "1995-02-24T03:24:00"],
      ["1995-02-24T00:00:00", 3, "1995-02-21T00:00:00"],
      ["1995-02-24T13:22:33.001", -3, "1995-02-27T13:22:33.001"],
      ["2024-02-24T01:02:03", 63, "2023-12-23T01:02:03"],
    ])(
      "%s minus %s days result in %s",
      (date: string, day: number, dateResult: string) => {
        it("should subtract days from date", () => {
          // when
          const actual = minusDays(new Date(date), day);

          // then
          expect(actual.toISOString()).toBe(new Date(dateResult).toISOString());
        });
      },
    );

    describe.each([
      ["1995-02-24T03:24:00", 0, "1995-02-24T03:24:00"],
      ["1995-02-24T00:00:00", 3, "1995-05-24T00:00:00"],
      ["1995-02-24T13:22:33.001", -1, "1995-01-24T13:22:33.001"],
      ["2024-11-24T01:02:03", 63, "2030-02-24T01:02:03"],
    ])(
      "%s plus %s months result in %s",
      (dateSummand: string, daySummand: number, sum: string) => {
        it("should add months to date", () => {
          // when
          const actual = plusMonths(new Date(dateSummand), daySummand);

          // then
          expect(actual.toISOString()).toBe(new Date(sum).toISOString());
        });
      },
    );

    describe.each([
      ["1995-02-24T03:24:00", 1, "1995-02-01T03:24:00"],
      ["1995-02-24T00:00:00", 30, "1995-03-02T00:00:00"],
      ["1995-02-24T13:22:33.001", -3, "1995-01-28T13:22:33.001"],
      ["2024-02-24T01:02:03", 0, "2024-01-31T01:02:03"],
    ])(
      "%s set day %s of month result in %s",
      (date: string, dayOfMonth: number, dateResult: string) => {
        it("should set day of month", () => {
          // when
          const actual = setDayOfMonth(new Date(date), dayOfMonth);

          // then
          expect(actual.toISOString()).toBe(new Date(dateResult).toISOString());
        });
      },
    );
  });
}
