/**
 * Persönliche Angaben für die Berechnung des Elterngeldes.
 */
import { ErwerbsArt } from "./erwerbs-art";
import { Kind } from "./kind";
import { YesNo } from "./yes-no";

export class PersoenlicheDaten {
  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsDatum: Date;
  etVorGeburt: ErwerbsArt;
  etNachGeburt: YesNo;
  geschwister: Kind[] = [];

  constructor(wahrscheinlichesGeburtsDatum: Date) {
    this.wahrscheinlichesGeburtsDatum = wahrscheinlichesGeburtsDatum;
    this.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
    this.etNachGeburt = YesNo.NO;
    this.anzahlKuenftigerKinder = 1;
  }
}

export function persoenlicheDatenOf(source: PersoenlicheDaten) {
  const copy = new PersoenlicheDaten(source.wahrscheinlichesGeburtsDatum);
  Object.assign(copy, source);
  return copy;
}
