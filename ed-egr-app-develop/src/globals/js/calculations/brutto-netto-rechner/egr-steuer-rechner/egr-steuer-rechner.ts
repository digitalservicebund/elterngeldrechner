import Big from "big.js";
import { BmfAbgaben } from "./bmf-abgaben";
import {
  EgrBerechnungParamId,
  ErwerbsArt,
  FinanzDaten,
  KinderFreiBetrag,
  kinderFreiBetragToNumber,
  SteuerKlasse,
  steuerklasseToNumber,
  YesNo,
} from "../../model";
import {
  BmfSteuerRechner,
  BmfSteuerRechnerParameter,
} from "../bmf-steuer-rechner";
import { bmfAbgabenOf } from "./bmf-abgaben-factory";
import { errorOf } from "../../calculation-error-code";
import { Logger } from "../../common/logger";
import { bmfSteuerRechnerAvailableYears } from "../bmf-steuer-rechner/bmf-steuer-rechner-configuration";

/**
 * EGR-Steuerrechner. Wrapper for BMF Lohn- und Einkommensteuerrechner with EGR data model.
 */
export class EgrSteuerRechner {
  static bestLohnSteuerJahrOf(wahrscheinlichesGeburtsDatum: Date): number {
    const geburtsDatumJahr = wahrscheinlichesGeburtsDatum.getFullYear();

    const availableYears = bmfSteuerRechnerAvailableYears();
    if (availableYears.includes(geburtsDatumJahr)) {
      return geburtsDatumJahr;
    }

    const minAvailableYear = Math.min(...availableYears);
    if (geburtsDatumJahr < minAvailableYear) {
      return minAvailableYear;
    }

    const maxAvailableYear = Math.max(...availableYears);
    if (geburtsDatumJahr > maxAvailableYear) {
      return maxAvailableYear;
    }

    throw errorOf("BmfSteuerRechnerNotImplementedForLohnsteuerjahr");
  }

  /**
   * Ermittlung der Abgaben unter Nutzung der Schnittstelle des Brutto-Netto-Rechners des BMF.
   *
   * Source: de.init.anton.plugins.egr.service.BruttoNettoRechner.abgabenSteuern(...)
   *
   * @param {FinanzDaten} finanzDaten Angaben zum Einkommen.
   * @param {ErwerbsArt} erwerbsArt Art des Einkommens (selbstständig, angestellt, ...)
   * @param bruttoProMonat Steuerpflichtiger durchschnittlicher Arbeitslohn pro Monat für das angegebene Jahr.
   * @param lohnSteuerJahr Das Lohnsteuerjahr des angegebenen steuerpflichtigen Arbeitslohns.
   */
  async abgabenSteuern(
    finanzDaten: FinanzDaten,
    erwerbsArt: ErwerbsArt,
    bruttoProMonat: Big,
    lohnSteuerJahr: number,
  ): Promise<BmfAbgaben> {
    const parameter = new BmfSteuerRechnerParameter();
    if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
      finanzDaten.kinderFreiBetrag = KinderFreiBetrag.ZKF0;
    }
    // Zusatzbeitrag ist laut Herrn Klos jetzt immer 0,9
    parameter.KVZ = 0.9;
    parameter.ALTER1 = 0;
    if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR) {
      parameter.AF = 1;
      parameter.F = finanzDaten.splittingFaktor ?? 1.0;
    } else {
      parameter.AF = 0;
      parameter.F = 1.0;
    }
    const steuerklasseNumber = steuerklasseToNumber(finanzDaten.steuerKlasse);
    parameter.STKL = steuerklasseNumber === undefined ? 1 : steuerklasseNumber;
    parameter.ZKF = kinderFreiBetragToNumber(finanzDaten.kinderFreiBetrag);
    parameter.R = finanzDaten.zahlenSieKirchenSteuer === YesNo.NO ? 0 : 1;
    parameter.KRV = erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ? 2 : 0;
    parameter.LZZ = 2;

    let einkommenInCent: Big = bruttoProMonat.mul(Big(100));
    if (ErwerbsArt.JA_SELBSTSTAENDIG === erwerbsArt) {
      einkommenInCent = einkommenInCent.add(
        EgrBerechnungParamId.PAUSCH.mul(Big(100)),
      );
    }
    parameter.RE4 = einkommenInCent.round(0, Big.roundHalfUp).toNumber();

    try {
      const bmfResponse = await BmfSteuerRechner.call(
        lohnSteuerJahr,
        parameter,
      );
      return bmfAbgabenOf(bmfResponse);
    } catch (e) {
      Logger.log(e);
      throw errorOf("BmfSteuerRechnerCallFailed");
    }
  }
}
