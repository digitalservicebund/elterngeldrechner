import { DateUtil } from "./date-util";

describe("date-util", () => {
  describe.each([
    ["1995-02-24T03:24:00", "1995-02-24T00:00:00"],
    ["1995-02-24T00:00:00", "1995-02-24T00:00:00"],
    ["1995-02-24T00:00:00.001", "1995-02-24T00:00:00"],
    ["1995-02-24T23:59:59.999", "1995-02-24T00:00:00"],
  ])(
    "when remove time from %p results in %p",
    (dateWithTime: string, dateWithoutTime: string) => {
      it("should remove time from date", () => {
        // when
        const actual = DateUtil.dateWithoutTimeOf(new Date(dateWithTime));

        // then
        expect(actual.toISOString()).toBe(
          new Date(dateWithoutTime).toISOString(),
        );
      });
    },
  );

  describe.each([
    ["1995-02-24T03:24:00", 0, "1995-02-24T03:24:00"],
    ["1995-02-24T00:00:00", 3, "1995-02-27T00:00:00"],
    ["1995-02-24T13:22:33.001", -3, "1995-02-21T13:22:33.001"],
    ["2024-11-24T01:02:03", 63, "2025-01-26T01:02:03"],
  ])(
    "%p plus %p days result in %p",
    (dateSummand: string, daySummand: number, sum: string) => {
      it("should add days to date", () => {
        // when
        const actual = DateUtil.plusDays(new Date(dateSummand), daySummand);

        // then
        expect(actual.toISOString()).toBe(new Date(sum).toISOString());
      });
    },
  );

  describe.each([
    ["1995-02-24T03:24:00", 0, "1995-02-24T03:24:00"],
    ["1995-02-24T00:00:00", 3, "1995-02-21T00:00:00"],
    ["1995-02-24T13:22:33.001", -3, "1995-02-27T13:22:33.001"],
    ["2024-02-24T01:02:03", 63, "2023-12-23T01:02:03"],
  ])(
    "%p minus %p days result in %p",
    (date: string, day: number, dateResult: string) => {
      it("should subtract days from date", () => {
        // when
        const actual = DateUtil.minusDays(new Date(date), day);

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
    "%p plus %p months result in %p",
    (dateSummand: string, daySummand: number, sum: string) => {
      it("should add months to date", () => {
        // when
        const actual = DateUtil.plusMonths(new Date(dateSummand), daySummand);

        // then
        expect(actual.toISOString()).toBe(new Date(sum).toISOString());
      });
    },
  );

  describe.each([
    ["1995-02-24T03:24:00", 0, "1995-02-24T03:24:00"],
    ["1995-02-24T00:00:00", 3, "1998-02-24T00:00:00"],
    ["1995-02-24T13:22:33.001", -3, "1992-02-24T13:22:33.001"],
    ["2024-11-24T01:02:03", 63, "2087-11-24T01:02:03"],
  ])(
    "%p plus %p years result in %p",
    (dateSummand: string, daySummand: number, sum: string) => {
      it("should add years to date", () => {
        // when
        const actual = DateUtil.plusYears(new Date(dateSummand), daySummand);

        // then
        expect(actual.toISOString()).toBe(new Date(sum).toISOString());
      });
    },
  );

  describe.each([
    ["1995-02-24T03:24:00", "1995-02-24T03:24:00", 0],
    ["1995-02-24T00:00:00", "1995-02-27T00:00:00", 3],
    ["1995-02-24T13:22:33.001", "1995-02-21T13:22:33.001", -3],
    ["2024-11-24T01:02:03", "2025-01-26T01:02:03", 63],
  ])(
    "between %p and %p are %p days",
    (date1: string, date2: string, days: number) => {
      it("should calculate difference between dates", () => {
        // when
        const actual = DateUtil.daysBetween(new Date(date1), new Date(date2));

        // then
        expect(actual).toBe(days);
      });
    },
  );

  describe.each([
    ["1995-02-24T03:24:00", 1, "1995-02-01T03:24:00"],
    ["1995-02-24T00:00:00", 30, "1995-03-02T00:00:00"],
    ["1995-02-24T13:22:33.001", -3, "1995-01-28T13:22:33.001"],
    ["2024-02-24T01:02:03", 0, "2024-01-31T01:02:03"],
  ])(
    "%p set day %p of month result in %p",
    (date: string, dayOfMonth: number, dateResult: string) => {
      it("should set day of month", () => {
        // when
        const actual = DateUtil.setDayOfMonth(new Date(date), dayOfMonth);

        // then
        expect(actual.toISOString()).toBe(new Date(dateResult).toISOString());
      });
    },
  );
});
