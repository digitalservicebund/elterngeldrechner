import { DateTime } from "luxon";
import { numberOfLebensmonate } from "../configuration";

export interface Lebensmonat {
  readonly from: string;
  readonly to: string;
}

export type EmptyLebensmonat = Record<string, never>;

const lebensmonate: EmptyLebensmonat[] = Array.from({
  length: numberOfLebensmonate,
}).map(() => ({}));

const getLebensmonate = (geburtstag?: string): Lebensmonat[] | EmptyLebensmonat[] => {
  if (!geburtstag) {
    return lebensmonate;
  }

  return lebensmonate.map((_, index) => {
    const fromDate = DateTime.fromISO(geburtstag).plus({ months: index }).startOf("day");
    const toDate = fromDate.plus({ months: 1 }).minus({ day: 1 }).endOf("day");

    return {
      from: fromDate.toISO({ includeOffset: false }),
      to: toDate.toISO({ includeOffset: false }),
    };
  });
};

export default getLebensmonate;
