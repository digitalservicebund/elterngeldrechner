import Big from "big.js";
import { Einkommen } from "./einkommen";
import { ElternGeldArt } from "./eltern-geld-art";
import { ErwerbsZeitraumLebensMonat } from "./erwerbs-zeitraum-lebens-monat";
import { KassenArt } from "./kassen-art";
import { KinderFreiBetrag } from "./kinder-frei-betrag";
import { MischEkTaetigkeit } from "./misch-ek-taetigkeit";
import { PLANUNG_ANZAHL_MONATE, PlanungsDaten } from "./planungs-daten";
import { RentenArt } from "./renten-art";
import { SteuerKlasse } from "./steuer-klasse";
import { BIG_ZERO, greater } from "@/globals/js/calculations/common/math-util";

// TODO: mark fully readonly
export type FinanzDaten = {
  readonly bruttoEinkommen: Einkommen;
  readonly istKirchensteuerpflichtig?: boolean;
  kinderFreiBetrag: KinderFreiBetrag;
  steuerKlasse: SteuerKlasse;
  kassenArt: KassenArt;
  rentenVersicherung: RentenArt;
  splittingFaktor: number;
  mischEinkommenTaetigkeiten: MischEkTaetigkeit[];
  erwerbsZeitraumLebensMonatList: ErwerbsZeitraumLebensMonat[];
};

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
  lmMitETPlus: number;
  lmMitETBasis: number;
  summeBruttoBasis: Big;
  summeBruttoPlus: Big;
}

export function bruttoLeistungsMonateWithPlanung(
  erwerbsZeitraumLebensMonatList: ErwerbsZeitraumLebensMonat[],
  isPlus: boolean,
  planungsdaten: PlanungsDaten,
): Big[] {
  const bruttoLM = new Array<Big>(PLANUNG_ANZAHL_MONATE + 1).fill(BIG_ZERO);

  for (const erwerbszeitraum of erwerbsZeitraumLebensMonatList) {
    for (
      let lm: number = erwerbszeitraum.vonLebensMonat;
      lm <= erwerbszeitraum.bisLebensMonat;
      lm++
    ) {
      // simplify after java code migration and with new tests for this case
      const bruttoProMonat: Big = erwerbszeitraum.bruttoProMonat.value;
      if (greater(bruttoProMonat, BIG_ZERO)) {
        const elterngeldArt =
          planungsdaten.planung[lm - 1] ?? ElternGeldArt.KEIN_BEZUG;

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

export function finanzDatenOf(source: FinanzDaten) {
  const copy = { ...source };
  Object.assign(copy, source);
  return copy;
}
