import Big from "big.js";
import { floor } from "@/globals/js/calculations/common/math-util";
import {
  ERSATZRATE1,
  ERSATZRATE2,
  GRENZE1,
  GRENZE2,
  GRENZE3,
  HOECHSTSATZ,
  HOECHST_ET,
  MINDESTSATZ,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

/**
 * Source: de.init.anton.plugins.egr.service.AbstractAlgorithmus
 */
export abstract class AbstractAlgorithmus {
  protected ersatzrate_eg(ek_vor_copy: number): number {
    const ek_vor = ek_vor_copy;
    const ersatzrate1 = ERSATZRATE1;
    const ersatzrate2 = ERSATZRATE2;
    const grenze1 = GRENZE1;
    const grenze2 = GRENZE2;
    const grenze3 = GRENZE3;
    let ersatzrate_eg = ersatzrate1;
    if (ek_vor > grenze1) {
      ersatzrate_eg = ersatzrate2;
    }
    if (ek_vor > grenze2 && ek_vor <= grenze1) {
      let y = ek_vor - grenze2;
      y = y / 2;
      y = floor(Big(y)).toNumber();
      y = y * 0.001;
      ersatzrate_eg = ersatzrate1 - y;
    }
    if (ek_vor < grenze3) {
      let y = grenze3 - ek_vor;
      y = y / 2;
      y = floor(Big(y)).toNumber();
      y = y * 0.001;
      ersatzrate_eg = ersatzrate1 + y;
      ersatzrate_eg = Math.min(ersatzrate_eg, 1);
    }
    return ersatzrate_eg;
  }

  protected elterngeld_keine_et(ekVor: number): number {
    let ersatzrate = ERSATZRATE1;
    let elterngeld_keine_et = ekVor * ersatzrate;
    if (ekVor > GRENZE1) {
      elterngeld_keine_et = Math.min(ERSATZRATE2 * ekVor, HOECHSTSATZ);
    }
    if (ekVor > GRENZE2 && ekVor <= GRENZE1) {
      ersatzrate =
        ERSATZRATE1 - floor(Big((ekVor - GRENZE2) / 2)).toNumber() * 0.001;
      elterngeld_keine_et = ekVor * ersatzrate;
    }
    if (ekVor < GRENZE3) {
      ersatzrate =
        ERSATZRATE1 + floor(Big((GRENZE3 - ekVor) / 2)).toNumber() * 0.001;
      ersatzrate = Math.min(ersatzrate, 1);
      elterngeld_keine_et = ekVor * ersatzrate;
    }
    elterngeld_keine_et = Math.max(elterngeld_keine_et, MINDESTSATZ);
    return elterngeld_keine_et;
  }

  protected elterngeld_et(ekVor: number, ekNach: Big): number {
    let ersatzrate = 0;
    const ek_diff = Math.max(
      Math.min(ekVor, HOECHST_ET) - ekNach.toNumber(),
      0,
    );
    let elterngeld_et = ek_diff * ERSATZRATE1;
    if (ekVor > GRENZE1) {
      elterngeld_et = Math.min(ERSATZRATE2 * ek_diff, HOECHSTSATZ);
    }
    if (ekVor > GRENZE2 && ekVor <= GRENZE1) {
      ersatzrate =
        ERSATZRATE1 - floor(Big((ekVor - GRENZE2) / 2)).toNumber() * 0.001;
      elterngeld_et = ek_diff * ersatzrate;
    }
    if (ekVor < GRENZE3) {
      ersatzrate =
        ERSATZRATE1 +
        floor(Big(GRENZE3).sub(ekVor).div(Big(2))).toNumber() * 0.001;
      ersatzrate = Math.min(ersatzrate, 1);
      elterngeld_et = ek_diff * ersatzrate;
    }
    return Math.max(elterngeld_et, MINDESTSATZ);
  }

  protected elterngeldplus_et(ekVor: number, ekNach: Big): number {
    let ersatzrate = 0;
    const ek_diff = Math.max(
      Math.min(ekVor, HOECHST_ET) - ekNach.toNumber(),
      0,
    );
    let elterngeldplus_et = ek_diff * ERSATZRATE1;
    if (ekVor > GRENZE1) {
      elterngeldplus_et = Math.min(ERSATZRATE2 * ek_diff, HOECHSTSATZ);
    }
    if (ekVor > GRENZE2 && ekVor <= GRENZE1) {
      ersatzrate =
        ERSATZRATE1 - floor(Big((ekVor - GRENZE2) / 2)).toNumber() * 0.001;
      elterngeldplus_et = ek_diff * ersatzrate;
    }
    if (ekVor < GRENZE3) {
      ersatzrate =
        ERSATZRATE1 +
        floor(Big(GRENZE3).sub(ekVor).div(Big(2))).toNumber() * 0.001;
      ersatzrate = Math.min(ersatzrate, 1);
      elterngeldplus_et = ek_diff * ersatzrate;
    }
    elterngeldplus_et = Math.max(elterngeldplus_et, MINDESTSATZ / 2);
    if (elterngeldplus_et > 900.0) {
      elterngeldplus_et = 900.0;
    }
    return elterngeldplus_et;
  }
}
