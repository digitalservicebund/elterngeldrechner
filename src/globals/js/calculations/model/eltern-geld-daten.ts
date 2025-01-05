import { FinanzDaten } from "./finanz-daten";
import { PersoenlicheDaten } from "./persoenliche-daten";
import { PlanungsDaten } from "./planungs-daten";

export interface ElternGeldDaten {
  persoenlicheDaten: PersoenlicheDaten;
  finanzDaten: FinanzDaten;
  planungsDaten: PlanungsDaten;
}
