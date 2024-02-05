import Big from "big.js";
import { ElternGeldArt } from "./eltern-geld-art";

/**
 * Ergebnis der Elterngeld-Plus-Ermittlung.
 */
export interface ElternGeldPlusErgebnis {
  elternGeldAusgabe: ElternGeldAusgabe[];
  ersatzRate: Big;
  geschwisterBonusDeadLine: Date | null;
  nettoNachGeburtDurch: Big;
  geschwisterBonus: Big;
  mehrlingsZulage: Big;
  bruttoBasis: Big;
  nettoBasis: Big;
  elternGeldBasis: Big;
  elternGeldErwBasis: Big;
  bruttoPlus: Big;
  nettoPlus: Big;
  elternGeldEtPlus: Big;
  elternGeldKeineEtPlus: Big;
  anfangEGPeriode: number[];
  endeEGPeriode: number[];
  message: string;
  hasPartnerBonusError: boolean;
  etVorGeburt: boolean;
}

export interface ElternGeldAusgabe {
  lebensMonat: number;
  elternGeld: Big;
  mehrlingsZulage: Big;
  geschwisterBonus: Big;
  elterngeldArt: ElternGeldArt;
  mutterschaftsLeistungMonat: boolean;
}
