import Big from "big.js";

/**
 * Zwischenergebnis des Elterngeldrechners. Im Elterngeldrechner Plus dient das Zwischenergebnis v.a. zur Ermittlung des
 * Nettoeinkommens ohne Erwerbstätigkeit, des Basiselterngelds, sowie der Mehrlingszulage bzw. des Geschwisterbonus.
 */
export interface ZwischenErgebnis {
  elternGeld: Big;
  ersatzRate: Big;
  mehrlingsZulage: Big;
  geschwisterBonus: Big;
  nettoVorGeburt: Big;
  zeitraumGeschwisterBonus: Date | null;
}
