import { aufDenCentRunden } from "./common/math-util";
import {
  ElternGeldArt,
  type ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  FinanzDatenBerechnet,
  PLANUNG_ANZAHL_MONATE,
  PlanungsDaten,
  bruttoLeistungsMonateWithPlanung,
} from "./model";

/**
 * Methode zum Verteilen des Bruttoeinkommens (basierend auf Kalendermonaten) auf Lebensmonate des Kindes.
 * Unterschieden wird danach, ob im Lebensmonat Basiselterngeld oder Elterngeld Plus bezogen wird. Dies ist notwendig da
 * für beide Fälle ein durchschnittliches Bruttoeinkommen zu berechnen ist.
 *
 * @param {PlanungsDaten} planungsergebnis
 * @param {FinanzDaten} finanzDaten
 * @return {FinanzDatenBerechnet}
 */
export function bruttoEGPlusNeu(
  planungsergebnis: PlanungsDaten,
  finanzDaten: FinanzDaten,
): FinanzDatenBerechnet {
  const { erwerbsZeitraumLebensMonatList } = finanzDaten;
  const bruttoLM = getBruttoLeistungsMonate(erwerbsZeitraumLebensMonatList);
  const brutto_LM_Plus = bruttoLeistungsMonateWithPlanung(
    erwerbsZeitraumLebensMonatList,
    true,
    planungsergebnis,
  );
  const brutto_LM_Basis = bruttoLeistungsMonateWithPlanung(
    erwerbsZeitraumLebensMonatList,
    false,
    planungsergebnis,
  );
  let lm_mit_et_basis: number = 0;
  let lm_mit_et_plus: number = 0;
  let summe_brutto_basis = 0;
  let summe_brutto_plus = 0;
  let brutto_basis = 0;
  let brutto_plus = 0;
  for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
    const brutto = bruttoLM[i] ?? 0;

    if (
      planungsergebnis.planung[i - 1] === ElternGeldArt.KEIN_BEZUG &&
      brutto > 0
    ) {
      // Logger.log("Es wurde Einkommen in Monaten ohne Bezug angegeben!");
      // Keine Fehlermeldung in GUI, da auch
      // in Berechnung des Einkommens nach
      // Kalendermonaten, die keine Rollte
      // spielte
    }

    const bruttoInLebensmonatenMitBasis = brutto_LM_Basis[i] ?? 0;

    if (
      bruttoInLebensmonatenMitBasis !== 0 &&
      planungsergebnis.planung[i - 1] === ElternGeldArt.BASIS_ELTERNGELD
    ) {
      lm_mit_et_basis = lm_mit_et_basis + 1;
      summe_brutto_basis = summe_brutto_basis + bruttoInLebensmonatenMitBasis;
    }

    const bruttoInLebensmonatenMitPlus = brutto_LM_Plus[i] ?? 0;

    if (
      (bruttoInLebensmonatenMitPlus !== 0 &&
        planungsergebnis.planung[i - 1] === ElternGeldArt.ELTERNGELD_PLUS) ||
      planungsergebnis.planung[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS
    ) {
      lm_mit_et_plus = lm_mit_et_plus + 1;
      summe_brutto_plus = summe_brutto_plus + bruttoInLebensmonatenMitPlus;
    }
  }
  if (lm_mit_et_basis > 0) {
    brutto_basis = aufDenCentRunden(summe_brutto_basis / lm_mit_et_basis);
  }
  if (lm_mit_et_plus > 0) {
    brutto_plus = aufDenCentRunden(summe_brutto_plus / lm_mit_et_plus);
  }
  return {
    summeBruttoBasis: summe_brutto_basis,
    summeBruttoPlus: summe_brutto_plus,
    bruttoLMBasis: brutto_LM_Basis,
    bruttoLMPlus: brutto_LM_Plus,
    bruttoEinkommenDurch: brutto_basis,
    bruttoEinkommenPlusDurch: brutto_plus,
    lmMitETBasis: lm_mit_et_basis,
    lmMitETPlus: lm_mit_et_plus,
  };
}

function getBruttoLeistungsMonate(
  erwerbsZeitraumLebensMonatList: ErwerbsZeitraumLebensMonat[],
): number[] {
  // Im FIT Algorithmus sind die indizes immer Monats-basiert, d.h. der Index 0 bleibt leer.
  const bruttoLM = new Array<number>(PLANUNG_ANZAHL_MONATE + 1).fill(0);

  for (const erwerbszeitraum of erwerbsZeitraumLebensMonatList) {
    for (
      let lm: number = erwerbszeitraum.vonLebensMonat;
      lm <= erwerbszeitraum.bisLebensMonat;
      lm++
    ) {
      const bruttoProMonat = erwerbszeitraum.bruttoProMonat.value;
      if (bruttoProMonat > 0) {
        bruttoLM[lm] = bruttoProMonat;
      }
    }
  }
  return bruttoLM;
}
