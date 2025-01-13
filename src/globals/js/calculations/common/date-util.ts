import { DateTime } from "luxon";

export function minusDays(date: Date, days: number) {
  return DateTime.fromJSDate(date).minus({ days: days }).toJSDate();
}

export function plusMonths(date: Date, months: number) {
  return DateTime.fromJSDate(date).plus({ months: months }).toJSDate();
}

export function setDayOfMonth(date: Date, dayOfMonth: number) {
  return DateTime.fromJSDate(date).set({ day: dayOfMonth }).toJSDate();
}
