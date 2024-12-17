import { PersoenlicheDaten } from "./persoenliche-daten";
import { FinanzDaten } from "./finanz-daten";
import { PlanungsDaten } from "./planungs-daten";

export interface ElternGeldDaten {
  persoenlicheDaten: PersoenlicheDaten;
  finanzDaten: FinanzDaten;
  planungsDaten: PlanungsDaten;
}
