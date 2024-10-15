/**
 * Persönliche Angaben für die Berechnung des Elterngeldes.
 */
import { Kind } from "./kind";
import { YesNo } from "./yes-no";
import { ErwerbsArt } from "./erwerbs-art";
import { excludesFutureChildren } from "@/globals/js/calculations/common/kind-util";

export class PersoenlicheDaten {
  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsDatum: Date;
  sindSieAlleinerziehend: YesNo;
  etVorGeburt: ErwerbsArt;
  etNachGeburt: YesNo;
  anfangLM: Date[];
  endeLM: Date[];
  kinder: Kind[];

  constructor(wahrscheinlichesGeburtsDatum: Date) {
    this.wahrscheinlichesGeburtsDatum = wahrscheinlichesGeburtsDatum;
    this.sindSieAlleinerziehend = YesNo.NO;
    this.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
    this.etNachGeburt = YesNo.NO;
    this.anfangLM = [];
    this.endeLM = [];
    this.anzahlKuenftigerKinder = 1;
    this.kinder = [
      {
        nummer: 1,
        geburtsdatum: undefined,
        istBehindert: false,
      },
    ];
  }

  isETNachGeburt(): boolean {
    return this.etNachGeburt === YesNo.YES;
  }

  isETVorGeburt(): boolean {
    return this.etVorGeburt !== ErwerbsArt.NEIN;
  }

  isAlleinerziehend(): boolean {
    return this.sindSieAlleinerziehend === YesNo.YES;
  }

  isGeschwisterVorhanden() {
    return this.getAnzahlGeschwister() > 0;
  }

  getAnzahlGeschwister(): number {
    return excludesFutureChildren(this.kinder).length;
  }
}

export function persoenlicheDatenOf(source: PersoenlicheDaten) {
  const copy = new PersoenlicheDaten(source.wahrscheinlichesGeburtsDatum);
  Object.assign(copy, source);
  return copy;
}
