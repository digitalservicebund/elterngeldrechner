import Big from "big.js";
import { BIG_ZERO, greater } from "../common/math-util";
import { BruttoEinkommen } from "./einkommen-types";
import { KassenArt } from "./kassen-art";
import { KinderFreiBetrag } from "./kinder-frei-betrag";
import { SteuerKlasse } from "./steuer-klasse";
import { RentenArt } from "./renten-art";
import { YesNo } from "./yes-no";
import { MischEkTaetigkeit } from "./misch-ek-taetigkeit";
import { PLANUNG_ANZAHL_MONATE, PlanungsDaten } from "./planungs-daten";
import { ErwerbsZeitraumLebensMonat } from "./erwerbs-zeitraum-lebens-monat";
import { ElternGeldArt } from "./eltern-geld-art";
import { Einkommen } from "./einkommen";

/**
 * Angaben zum Einkommen für die Berechnung des Elterngeldes.
 */
export class FinanzDaten {
  bruttoEinkommen: BruttoEinkommen = new Einkommen(0);
  zahlenSieKirchenSteuer: YesNo = YesNo.NO;
  kinderFreiBetrag: KinderFreiBetrag = KinderFreiBetrag.ZKF0;
  steuerKlasse: SteuerKlasse = SteuerKlasse.SKL1;
  kassenArt: KassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  rentenVersicherung: RentenArt = RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  splittingFaktor: number = 1.0;
  mischEinkommenTaetigkeiten: MischEkTaetigkeit[] = [];
  erwerbsZeitraumLebensMonatList: ErwerbsZeitraumLebensMonat[] = [];

  /**
   * Zeigt an ob Daten für Mischeinkünfte vorliegen.
   * Wichtig: wenn keine Mischeinkommen berechnet werden soll, dann dürfen auch keine Werte da sein. Es reicht nicht,
   * die {@link PersoenlicheDaten#etVorGeburt} auf einen Wert anders als {@link ErwerbsArt#JA_MISCHEINKOMMEN} zu setzen
   *
   * @return true, wenn Daten für Mischeinkommen vorhanden sind.
   */
  isMischeinkommen() {
    return this.mischEinkommenTaetigkeiten.length > 0;
  }

  bruttoLeistungsMonate(): Big[] {
    // Im FIT Algorithmus sind die indizes immer Monats-basiert, d.h. der Index 0 bleibt leer.
    const bruttoLM = new Array<Big>(PLANUNG_ANZAHL_MONATE + 1).fill(BIG_ZERO);

    for (const erwerbszeitraum of this.erwerbsZeitraumLebensMonatList) {
      for (
        let lm: number = erwerbszeitraum.vonLebensMonat;
        lm <= erwerbszeitraum.bisLebensMonat;
        lm++
      ) {
        const bruttoProMonat: Big = erwerbszeitraum.bruttoProMonat.value;
        if (greater(bruttoProMonat, BIG_ZERO)) {
          bruttoLM[lm] = bruttoProMonat;
        }
      }
    }
    return bruttoLM;
  }

  bruttoLeistungsMonateWithPlanung(
    isPlus: boolean,
    planungsdaten: PlanungsDaten,
  ): Big[] {
    const bruttoLM = new Array<Big>(PLANUNG_ANZAHL_MONATE + 1).fill(BIG_ZERO);

    for (const erwerbszeitraum of this.erwerbsZeitraumLebensMonatList) {
      for (
        let lm: number = erwerbszeitraum.vonLebensMonat;
        lm <= erwerbszeitraum.bisLebensMonat;
        lm++
      ) {
        // simplify after java code migration and with new tests for this case
        const bruttoProMonat: Big = erwerbszeitraum.bruttoProMonat.value;
        if (greater(bruttoProMonat, BIG_ZERO)) {
          const elterngeldArt: ElternGeldArt = planungsdaten.planung[lm - 1];
          if (isPlus) {
            if (
              elterngeldArt === ElternGeldArt.PARTNERSCHAFTS_BONUS ||
              elterngeldArt === ElternGeldArt.ELTERNGELD_PLUS
            ) {
              bruttoLM[lm] = bruttoProMonat;
            }
          } else if (elterngeldArt === ElternGeldArt.BASIS_ELTERNGELD) {
            bruttoLM[lm] = bruttoProMonat;
          }
        }
      }
    }
    return bruttoLM;
  }
}

/**
 * Angaben zum Einkommen für die Berechnung des Elterngeldes.
 * Die Felder stammen aus der Java-Klasse FinanzDaten.
 */
export interface FinanzDatenBerechnet {
  bruttoEinkommenDurch: Big;
  bruttoEinkommenPlusDurch: Big;
  //nettoEinkommenDurch: de.init.anton.plugins.egr.beans.NettoEinkommen;
  //etAnfang: Array<DateTime>;
  //etEnde: Array<DateTime>;
  bruttoLMBasis: Big[];
  bruttoLMPlus: Big[];
  //anfangEGPeriode: Array<number>;
  //endeEGPeriode: Array<number>;
  lmMitETPlus: number;
  lmMitETBasis: number;
  summeBruttoBasis: Big;
  summeBruttoPlus: Big;
}

export function finanzDatenOf(source: FinanzDaten) {
  const copy = new FinanzDaten();
  Object.assign(copy, source);
  return copy;
}
