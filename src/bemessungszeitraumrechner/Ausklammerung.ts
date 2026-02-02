import { Temporal } from "@js-temporal/polyfill";

export type Ausklammerung = {
  von: Temporal.PlainDate;
  bis: Temporal.PlainDate;
  beschreibung: string;
};
