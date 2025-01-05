/**
 * Persönliche Angaben für die Berechnung des Elterngeldes.
 */
import { ErwerbsArt } from "./erwerbs-art";
import { Kind } from "./kind";
import { YesNo } from "./yes-no";
import { excludesFutureChildren } from "@/globals/js/calculations/common/kind-util";

export class PersoenlicheDaten {
  anzahlKuenftigerKinder: number;
  wahrscheinlichesGeburtsDatum: Date;
  etVorGeburt: ErwerbsArt;
  etNachGeburt: YesNo;
  kinder: Kind[];

  constructor(wahrscheinlichesGeburtsDatum: Date) {
    this.wahrscheinlichesGeburtsDatum = wahrscheinlichesGeburtsDatum;
    this.etVorGeburt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
    this.etNachGeburt = YesNo.NO;
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
