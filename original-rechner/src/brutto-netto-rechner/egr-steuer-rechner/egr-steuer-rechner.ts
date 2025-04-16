import Big from "big.js";
import { errorOf } from "../../calculation-error-code";
import {
  berechneSteuerUndSozialabgaben,
  type Eingangsparameter,
} from "../steuer-und-sozialabgaben";
import {
  ErwerbsArt,
  FinanzDaten,
  KinderFreiBetrag,
  kinderFreiBetragToNumber,
  SteuerKlasse,
  steuerklasseToNumber,
  YesNo,
  UnterstuetzteLohnsteuerjahre,
  type Lohnsteuerjahr,
} from "../../model";
import { PAUSCH } from "../../model/egr-berechnung-param-id";

/**
 * EGR-Steuerrechner
 */
export class EgrSteuerRechner {
  static bestLohnSteuerJahrOf(
    wahrscheinlichesGeburtsDatum: Date,
  ): Lohnsteuerjahr {
    const geburtsDatumJahr = wahrscheinlichesGeburtsDatum.getFullYear();
    const jahrVorDerGeburt = geburtsDatumJahr - 1;

    if (
      UnterstuetzteLohnsteuerjahre.includes(jahrVorDerGeburt as Lohnsteuerjahr)
    ) {
      return jahrVorDerGeburt as Lohnsteuerjahr;
    }

    const minAvailableYear = Math.min(
      ...UnterstuetzteLohnsteuerjahre,
    ) as Lohnsteuerjahr;
    if (jahrVorDerGeburt < minAvailableYear) {
      return minAvailableYear;
    }

    const maxAvailableYear = Math.max(
      ...UnterstuetzteLohnsteuerjahre,
    ) as Lohnsteuerjahr;
    if (jahrVorDerGeburt > maxAvailableYear) {
      return maxAvailableYear;
    }

    throw errorOf("NichtUnterstuetztesLohnsteuerjahr");
  }

  /**
   * Ermittlung der Abgaben
   *
   * Source: de.init.anton.plugins.egr.service.BruttoNettoRechner.abgabenSteuern(...)
   *
   * @param {FinanzDaten} finanzDaten Angaben zum Einkommen.
   * @param {ErwerbsArt} erwerbsArt Art des Einkommens (selbstständig, angestellt, ...)
   * @param bruttoProMonat Steuerpflichtiger durchschnittlicher Arbeitslohn pro Monat für das angegebene Jahr.
   * @param lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   */
  abgabenSteuern(
    finanzDaten: FinanzDaten,
    erwerbsArt: ErwerbsArt,
    bruttoProMonat: Big,
    lohnSteuerJahr: Lohnsteuerjahr,
  ): { bk: Big; lstlzz: Big; solzlzz: Big } {
    if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF0;
    }

    let einkommenInCent: Big = bruttoProMonat.mul(Big(100));
    if (ErwerbsArt.JA_SELBSTSTAENDIG === erwerbsArt) {
      einkommenInCent = einkommenInCent.add(PAUSCH.mul(Big(100)));
    }

    const eingangsparameter: Eingangsparameter = {
      AF: finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR ? 1 : 0,
      F:
        finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR
          ? finanzDaten.splittingFaktor
          : 0,
      KRV: erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ? 2 : 0,
      KVZ: 1.6,
      LZZ: 2,
      LZZFREIB: 0,
      LZZHINZU: 0,
      PKPV: 0,
      PKV: 0,
      PVS: 0,
      PVZ: 0,
      R: finanzDaten.zahlenSieKirchenSteuer === YesNo.YES ? 1 : 0,
      RE4: einkommenInCent.toNumber(),
      STKL: steuerklasseToNumber(finanzDaten.steuerKlasse),
      VBEZ: 0,
      ZKF: kinderFreiBetragToNumber(finanzDaten.kinderFreiBetrag),
    };

    const { BK, LSTLZZ, SOLZLZZ } = berechneSteuerUndSozialabgaben(
      lohnSteuerJahr,
      eingangsparameter,
    );

    return {
      bk: Big(BK / 100),
      lstlzz: Big(LSTLZZ / 100),
      solzlzz: Big(SOLZLZZ / 100),
    };
  }
}
