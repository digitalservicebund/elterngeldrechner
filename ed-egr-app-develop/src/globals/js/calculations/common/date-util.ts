import { DateTime } from "luxon";

export namespace DateUtil {
  /**
   * Returns a new date without time.
   *
   * @param date Date with or without time.
   * @return A new date without time, created from incoming date.
   */
  export function dateWithoutTimeOf(date: Date) {
    return DateTime.fromJSDate(date)
      .set({ hour: 0 })
      .set({ minute: 0 })
      .set({ second: 0 })
      .set({ millisecond: 0 })
      .toJSDate();
  }
  /**
   * Returns a new utc date without time.
   *
   * @param date Date with or without time.
   * @return A new date without time and with zone utc, created from incoming date.
   */
  export function utcDateWithoutTimeOf(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const dayOfMonth = date.getDate().toString().padStart(2, "0");
    const isoDate = `${year}-${month}-${dayOfMonth}`;
    return DateTime.fromISO(isoDate, { zone: "utc" });
  }

  export function plusDays(date: Date, days: number) {
    return DateTime.fromJSDate(date).plus({ days: days }).toJSDate();
  }

  export function minusDays(date: Date, days: number) {
    return DateTime.fromJSDate(date).minus({ days: days }).toJSDate();
  }

  export function plusMonths(date: Date, months: number) {
    return DateTime.fromJSDate(date).plus({ months: months }).toJSDate();
  }

  export function plusYears(date: Date, years: number) {
    return DateTime.fromJSDate(date).plus({ years: years }).toJSDate();
  }

  export function daysBetween(date1: Date, date2: Date) {
    return DateUtil.utcDateWithoutTimeOf(date2)
      .diff(DateUtil.utcDateWithoutTimeOf(date1))
      .as("days");
  }

  export function setDayOfMonth(date: Date, dayOfMonth: number) {
    return DateTime.fromJSDate(date).set({ day: dayOfMonth }).toJSDate();
  }
}
