/**
 * Steuerklassen nach § 38b Absatz 1 des Einkommensteuergesetz (EStG).
 *
 * Ergänzend wird die Steuerklasse IV mit Faktor nach § 39f des EStG separat
 * aufgelistet, da Änderungen des Faktors gleichgestellt ist mit dem Wechsel
 * einer Steuerklasse (vergleiche § 39 Absatz 6 Satz 3 des EStG bzw. der
 * Lohnsteuer-Durchführungsverordnung (LStDV)).
 */
export enum Steuerklasse {
  I = "I",
  II = "II",
  III = "III",
  IV = "IV",
  IVMitFaktor = "IV mit Faktor",
  V = "V",
  VI = "VI",
}
