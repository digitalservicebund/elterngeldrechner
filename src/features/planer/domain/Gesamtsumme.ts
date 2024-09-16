import type { Elternteil } from "./Elternteil";

export type Gesamtsumme<E extends Elternteil> = {
  readonly summe: number;
  readonly summeProElternteil: Record<E, SummeFuerElternteil>;
};

export type SummeFuerElternteil = {
  readonly anzahlMonateMitBezug: number;
  readonly totalerElterngeldbezug: number;
};
