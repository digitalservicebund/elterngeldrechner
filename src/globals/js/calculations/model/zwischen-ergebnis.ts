/**
 * Zwischenergebnis des Elterngeldrechners. Im Elterngeldrechner Plus dient das Zwischenergebnis v.a. zur Ermittlung des
 * Nettoeinkommens ohne Erwerbstätigkeit, des Basiselterngelds, sowie der Mehrlingszulage bzw. des Geschwisterbonus.
 */
export interface ZwischenErgebnis {
  elternGeld: number;
  ersatzRate: number;
  mehrlingsZulage: number;
  geschwisterBonus: number;
  nettoVorGeburt: number;
  zeitraumGeschwisterBonus: Date | null;
}
