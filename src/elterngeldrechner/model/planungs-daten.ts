import { ElternGeldArt } from "./eltern-geld-art";
import { MutterschaftsLeistung } from "./mutterschafts-leistung";

export const PLANUNG_ANZAHL_MONATE: number = 32;

export type PlanungsDaten = Readonly<{
  mutterschaftsLeistung: MutterschaftsLeistung;
  planung: ElternGeldArt[];
}>;
