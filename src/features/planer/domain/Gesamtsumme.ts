import type { Elternteil } from "./Elternteil";

export type Gesamtsumme<E extends Elternteil> = {
  summe: number;
  summeProElternteil: Record<E, SummeFuerElternteil>;
};

export type SummeFuerElternteil = {
  anzahlMonateMitBezug: number;
  totalerElterngeldbezug: number;
};
