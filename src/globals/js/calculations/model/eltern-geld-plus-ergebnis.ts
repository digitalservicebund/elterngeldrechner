import { ElternGeldArt } from "./eltern-geld-art";

/**
 * Ergebnis der Elterngeld-Plus-Ermittlung.
 */
export interface ElternGeldPlusErgebnis {
  elternGeldAusgabe: ElternGeldAusgabe[];
  ersatzRate: number;
  geschwisterBonusDeadLine: Date | null;
  nettoNachGeburtDurch: number;
  geschwisterBonus: number;
  mehrlingsZulage: number;
  bruttoBasis: number;
  nettoBasis: number;
  elternGeldBasis: number;
  elternGeldErwBasis: number;
  bruttoPlus: number;
  nettoPlus: number;
  elternGeldEtPlus: number;
  elternGeldKeineEtPlus: number;
  message: string;
  hasPartnerBonusError: boolean;
  etVorGeburt: boolean;
}

export interface ElternGeldAusgabe {
  lebensMonat: number;
  elternGeld: number;
  mehrlingsZulage: number;
  geschwisterBonus: number;
  elterngeldArt: ElternGeldArt;
  mutterschaftsLeistungMonat: boolean;
}
