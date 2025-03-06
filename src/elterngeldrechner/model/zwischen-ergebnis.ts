export interface ZwischenErgebnis {
  elternGeld: number;
  ersatzRate: number;
  mehrlingsZulage: number;
  geschwisterBonus: number;
  nettoVorGeburt: number;
  zeitraumGeschwisterBonus: Date | null;
}
