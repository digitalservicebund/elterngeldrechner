import { ElternGeldArt } from "./eltern-geld-art";

export interface ElternGeldPlusErgebnis {
  elternGeldAusgabe: ElternGeldAusgabe[];
  ersatzRate: number;
  mehrlingsZulage: number;
  bruttoBasis: number;
  nettoBasis: number;
  elternGeldBasis: number;
  elternGeldErwBasis: number;
  bruttoPlus: number;
  nettoPlus: number;
  elternGeldEtPlus: number;
  elternGeldKeineEtPlus: number;
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
