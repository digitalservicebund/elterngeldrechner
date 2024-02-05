import { DateTime } from "luxon";
import { Geburtstag } from "./elternteile-types";

// WARN: full month differences could result in one month to much because of luxon taking 30 days as one month
// WARN: wrong result could be provided in periods which have a greater count of month with 31 day (compared to months with less days)
// HINT: according to Elterngeld Digital specification one day of Mutterschutz should set the entire calendar month concerned as Mutterschutz Monat
// TODO: fix the behaviour describe above
export const getNumberOfMutterschutzMonths = (geburtstag: Geburtstag, mutterschutzEndDate: string): number => {
  return Math.ceil(DateTime.fromISO(mutterschutzEndDate).diff(DateTime.fromISO(geburtstag.geburt)).as("months"));
};
