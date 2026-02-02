import { Temporal } from "@js-temporal/polyfill";

export type Zeitraum = {
  von: Temporal.PlainYearMonth;
  bis: Temporal.PlainYearMonth;
};
