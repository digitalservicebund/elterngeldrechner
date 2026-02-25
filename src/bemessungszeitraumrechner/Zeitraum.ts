import { Temporal } from "@js-temporal/polyfill";

export type Zeitraum<
  T extends Temporal.PlainYearMonth | Temporal.PlainDate =
    Temporal.PlainYearMonth,
> = {
  von: T;
  bis: T;
};
