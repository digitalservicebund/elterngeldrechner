import type { Variante } from "./Variante";
import type { Elternteil } from "./Elternteil";
import type { Zeitraum } from "./zeitraum";
import type { Lebensmonate } from "./lebensmonate";

export type Zusammenfassung<E extends Elternteil> = {
  readonly planungsuebersicht: Planungsuebersicht<E>;
  readonly planungsdetails: Planungsdetails<E>;
};

export type Planungsuebersicht<E extends Elternteil> = Readonly<
  Record<E, PlanungsuebersichtFuerElternteil>
>;

export type PlanungsuebersichtFuerElternteil = {
  readonly gesamtbezug: Bezug;
  readonly zeitraeumeMitDurchgaenigenBezug: Zeitraum[];
  readonly bezuegeProVariante: Record<Variante, Bezug>;
};

export type Bezug = {
  readonly anzahlMonate: number;
  readonly elterngeld: number;
  readonly bruttoeinkommen: number;
};

export type Planungsdetails<E extends Elternteil> = {
  readonly geplanteLebensmonate: Lebensmonate<E>;
};
