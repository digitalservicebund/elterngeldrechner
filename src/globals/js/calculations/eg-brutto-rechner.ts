import Big from "big.js";
import { BIG_ZERO, greater, isEqual, round } from "./common/math-util";
import {
  ElternGeldArt,
  FinanzDaten,
  FinanzDatenBerechnet,
  PLANUNG_ANZAHL_MONATE,
  PlanungsDaten,
} from "./model";

/**
 * Methode zum Verteilen des Bruttoeinkommens (basierend auf Kalendermonaten) auf Lebensmonate des Kindes.
 * Unterschieden wird danach, ob im Lebensmonat Basiselterngeld oder Elterngeld Plus bezogen wird. Dies ist notwendig da
 * für beide Fälle ein durchschnittliches Bruttoeinkommen zu berechnen ist.
 *
 * Source: de.init.anton.plugins.egr.service.BruttoNettoRechner#bruttoEGPlusNeu
 *
 * @param {PlanungsDaten} planungsergebnis
 * @param {FinanzDaten} finanzDaten
 * @return {FinanzDatenBerechnet}
 */
export function bruttoEGPlusNeu(
  planungsergebnis: PlanungsDaten,
  finanzDaten: FinanzDaten,
): FinanzDatenBerechnet {
  const bruttoLM: Big[] = finanzDaten.bruttoLeistungsMonate();
  const brutto_LM_Plus: Big[] = finanzDaten.bruttoLeistungsMonateWithPlanung(
    true,
    planungsergebnis,
  );
  const brutto_LM_Basis: Big[] = finanzDaten.bruttoLeistungsMonateWithPlanung(
    false,
    planungsergebnis,
  );
  let lm_mit_et_basis: number = 0;
  let lm_mit_et_plus: number = 0;
  let summe_brutto_basis: Big = BIG_ZERO;
  let summe_brutto_plus: Big = BIG_ZERO;
  let brutto_basis: Big = BIG_ZERO;
  let brutto_plus: Big = BIG_ZERO;
  for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
    const brutto = bruttoLM[i] ?? BIG_ZERO;

    if (
      planungsergebnis.get(i) === ElternGeldArt.KEIN_BEZUG &&
      greater(brutto, BIG_ZERO)
    ) {
      // Logger.log("Es wurde Einkommen in Monaten ohne Bezug angegeben!");
      // Keine Fehlermeldung in GUI, da auch
      // in Berechnung des Einkommens nach
      // Kalendermonaten, die keine Rollte
      // spielte
    }

    const bruttoInLebensmonatenMitBasis = brutto_LM_Basis[i] ?? BIG_ZERO;

    if (
      !isEqual(bruttoInLebensmonatenMitBasis, BIG_ZERO) &&
      planungsergebnis.get(i) === ElternGeldArt.BASIS_ELTERNGELD
    ) {
      lm_mit_et_basis = lm_mit_et_basis + 1;
      summe_brutto_basis = summe_brutto_basis.add(
        bruttoInLebensmonatenMitBasis,
      );
    }

    const bruttoInLebensmonatenMitPlus = brutto_LM_Plus[i] ?? BIG_ZERO;

    if (
      (!isEqual(bruttoInLebensmonatenMitPlus, BIG_ZERO) &&
        planungsergebnis.get(i) === ElternGeldArt.ELTERNGELD_PLUS) ||
      planungsergebnis.get(i) === ElternGeldArt.PARTNERSCHAFTS_BONUS
    ) {
      lm_mit_et_plus = lm_mit_et_plus + 1;
      summe_brutto_plus = summe_brutto_plus.add(bruttoInLebensmonatenMitPlus);
    }
  }
  if (lm_mit_et_basis > 0) {
    brutto_basis = round(summe_brutto_basis.div(lm_mit_et_basis));
  }
  if (lm_mit_et_plus > 0) {
    brutto_plus = round(summe_brutto_plus.div(lm_mit_et_plus));
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
