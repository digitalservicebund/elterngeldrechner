import Big, { RoundingMode } from "big.js";

/**
 * Constants for Elterngeld calculation.
 *
 * Why a namespace? In Java it was an enum. IMHO are constants with namespace a good replacement.
 */
export namespace EgrBerechnungParamId {
  /**
   * Beitragsbemessungsgrenze Rentenversicherung grenze_rv_west
   */
  export const GRENZE_RV_WEST = Big(72600);

  /**
   * Beitragsbemessungsgrenze Rentenversicherung grenze_rv_ost
   */
  export const GRENZE_RV_OST = Big(62400);

  /**
   * F Faktor Gleitzone f_faktor
   */
  export const F_FAKTOR = Big(0.7509); // ab 2021 (vorher 0.7547)

  /*******************************************************
   * Pauschalbeträge des §2f BEEG
   ******************************************************/

  /**
   * satz_kvpv_beeg
   */
  export const SATZ_KVPV_BEEG = Big(0.09);
  /**
   * satz_rv_beeg
   */
  export const SATZ_RV_BEEG = Big(0.1);
  /**
   * satz_alv_beeg
   */
  export const SATZ_ALV_BEEG = Big(0.02);
  /**
   * Betrag_Mehrlingszuschlag
   */
  export const BETRAG_MEHRLINGSZUSCHLAG = Big(300);
  /**
   * Min_Geschwisterbonus
   */
  export const MIN_GESCHWISTERBONUS = Big(75);
  /**
   * Rate_bonus
   */
  export const RATE_BONUS = Big(0.1);
  /**
   * Ersatzrate1
   */
  export const ERSATZRATE1 = Big(0.67);
  /**
   * Ersatzrate2
   */
  export const ERSATZRATE2 = Big(0.65);
  /**
   * Höchstsatz
   */
  export const HOECHSTSATZ = Big(1800);
  /**
   * Mindestsatz
   */
  export const MINDESTSATZ = Big(300);
  /**
   * Grenze1
   */
  export const GRENZE1 = Big(1240);
  /**
   * Grenze2
   */
  export const GRENZE2 = Big(1200);
  /**
   * Grenze3
   */
  export const GRENZE3 = Big(1000);
  /**
   * Höchst_et
   */
  export const HOECHST_ET = Big(2770);
  /**
   * Grenze_Minijob_Midijob
   */
  export const GRENZE_MINI_MIDI = Big(520); // ab 01.10.2022 (vorher 450)
  /**
   * Grenze_Midijob_Max
   */
  export const GRENZE_MIDI_MAX = Big(1300); // vorher 850 // TODO: 2000 since 01.01.2023 ?

  /**
   * Wir benötigen den pauschbetrag pro Monat, deshalb wird in dieser Methode diese errechnet....
   * pausch
   *
   * Java Implementation for pausch are 'BigDecimal.valueOf(1000).divide(BigDecimal.valueOf(12), MathContext.DECIMAL128)'.
   *
   * DECIMAL128: A object with a precision setting matching the IEEE 754R Decimal128 format, 34 digits, and a
   * rounding mode of HALF_EVEN, the IEEE 754R default.
   *
   * @see setupCalculation()
   */
  export const PAUSCH = Big(1000)
    .div(Big(12))
    .prec(Big.DP, Big.RM as RoundingMode); // TODO: 1230 - when to change ?
  /**
   * Max Einkommensgrenze Bezug Elterngeld Alleinerziehende
   */
  export const MAX_EINKOMMEN_ALLEIN = 200_000;
  /**
   * Max Einkommensgrenze Bezug Elterngeld Paare
   */
  export const MAX_EINKOMMEN_BEIDE = 200_000;
}
