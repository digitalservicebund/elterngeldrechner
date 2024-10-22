import type { Elternteil } from "./Elternteil";

export type Gesamtsumme<E extends Elternteil> = {
  readonly elterngeldbezug: number;
  readonly proElternteil: Record<E, SummeFuerElternteil>;
};

export type SummeFuerElternteil = {
  readonly anzahlMonateMitBezug: number;
  readonly elterngeldbezug: number;
  readonly bruttoeinkommen: number;
};
