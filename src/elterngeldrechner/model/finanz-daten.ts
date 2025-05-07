import { Steuerklasse } from "./Steuerklasse";
import { Einkommen } from "./einkommen";
import { ElternGeldArt } from "./eltern-geld-art";
import { ErwerbsZeitraumLebensMonat } from "./erwerbs-zeitraum-lebens-monat";
import { KassenArt } from "./kassen-art";
import { KinderFreiBetrag } from "./kinder-frei-betrag";
import { MischEkTaetigkeit } from "./misch-ek-taetigkeit";
import { PLANUNG_ANZAHL_MONATE, PlanungsDaten } from "./planungs-daten";
import { RentenArt } from "./renten-art";

// TODO: mark fully readonly
export type FinanzDaten = {
  readonly bruttoEinkommen: Einkommen;
  readonly istKirchensteuerpflichtig?: boolean;
  kinderFreiBetrag: KinderFreiBetrag;
  steuerklasse: Steuerklasse;
  kassenArt: KassenArt;
  rentenVersicherung: RentenArt;
  splittingFaktor: number;
  mischEinkommenTaetigkeiten: MischEkTaetigkeit[];
  erwerbsZeitraumLebensMonatList: ErwerbsZeitraumLebensMonat[];
};

export interface FinanzDatenBerechnet {
  bruttoEinkommenDurch: number;
  bruttoEinkommenPlusDurch: number;
  bruttoLMBasis: number[];
  bruttoLMPlus: number[];
  lmMitETPlus: number;
  lmMitETBasis: number;
  summeBruttoBasis: number;
  summeBruttoPlus: number;
}

export function bruttoLeistungsMonateWithPlanung(
  erwerbsZeitraumLebensMonatList: ErwerbsZeitraumLebensMonat[],
  isPlus: boolean,
  planungsdaten: PlanungsDaten,
): number[] {
  const bruttoLM = new Array<number>(PLANUNG_ANZAHL_MONATE + 1).fill(0);

  for (const erwerbszeitraum of erwerbsZeitraumLebensMonatList) {
    for (
      let lm: number = erwerbszeitraum.vonLebensMonat;
      lm <= erwerbszeitraum.bisLebensMonat;
      lm++
    ) {
      // simplify after java code migration and with new tests for this case
      const bruttoProMonat = erwerbszeitraum.bruttoProMonat.value;
      if (bruttoProMonat > 0) {
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
