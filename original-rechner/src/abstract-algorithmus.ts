import Big from "big.js";
import { findLastBornChild, findSecondLastBornChild } from "./common/kind-util";
import { BIG_ONE, BIG_ZERO, floor, fMax, fMin } from "./common/math-util";
import {
  ERSATZRATE1,
  ERSATZRATE2,
  GRENZE1,
  GRENZE2,
  GRENZE3,
  HOECHST_ET,
  HOECHSTSATZ,
  MINDESTSATZ,
} from "./model/egr-berechnung-param-id";
import { Kind } from "./model";

/**
 * Source: de.init.anton.plugins.egr.service.AbstractAlgorithmus
 */
export abstract class AbstractAlgorithmus {
  protected ersatzrate_eg(ek_vor_copy: Big): Big {
    const ek_vor: Big = ek_vor_copy;
    const ersatzrate1: Big = ERSATZRATE1;
    const ersatzrate2: Big = ERSATZRATE2;
    const grenze1: Big = GRENZE1;
    const grenze2: Big = GRENZE2;
    const grenze3: Big = GRENZE3;
    let ersatzrate_eg: Big = ersatzrate1;
    if (ek_vor.gt(grenze1)) {
      ersatzrate_eg = ersatzrate2;
    }
    if (ek_vor.gt(grenze2) && ek_vor.lte(grenze1)) {
      let y: Big = ek_vor.sub(grenze2);
      y = y.div(Big(2));
      y = floor(y);
      y = y.mul(Big(0.001));
      ersatzrate_eg = ersatzrate1.sub(y);
    }
    if (ek_vor.lt(grenze3)) {
      let y: Big = grenze3.sub(ek_vor);
      y = y.div(Big(2));
      y = floor(y);
      y = y.mul(Big(0.001));
      ersatzrate_eg = ersatzrate1.add(y);
      ersatzrate_eg = fMin(ersatzrate_eg, BIG_ONE);
    }
    return ersatzrate_eg;
  }

  /**
   * Suche das Geburtsdatum des jüngsten Kindes.
   *
   * @param kindList Eine Liste von {@link Kind}.
   * @return Das {@link Date} des jüngsten Kindes oder undefined, wenn die Liste leer ist.
   */
  protected fktMax(kindList: Kind[]): Date | undefined {
    return findLastBornChild(kindList)?.geburtsdatum;
  }

  /**
   * Suche das Geburtsdatum des zweitjüngsten Kindes.
   *
   * @param kindList Eine Liste von {@link Kind}.
   * @return Das {@link Date} des zweitjüngsten Kindes oder undefined, wenn die Liste leer ist oder nur ein Kind enthält.
   */
  protected fktZweitMax(kindList: Kind[]): Date | undefined {
    return findSecondLastBornChild(kindList)?.geburtsdatum;
  }

  protected elterngeld_keine_et(ekVor: Big): Big {
    let ersatzrate: Big = ERSATZRATE1;
    let elterngeld_keine_et: Big = ekVor.mul(ersatzrate);
    if (ekVor.gt(GRENZE1)) {
      elterngeld_keine_et = fMin(ERSATZRATE2.mul(ekVor), HOECHSTSATZ);
    }
    if (ekVor.gt(GRENZE2) && ekVor.lte(GRENZE1)) {
      ersatzrate = ERSATZRATE1.sub(
        floor(ekVor.sub(GRENZE2).div(Big(2.0))).mul(Big(0.001)),
      );
      elterngeld_keine_et = ekVor.mul(ersatzrate);
    }
    if (ekVor.lt(GRENZE3)) {
      ersatzrate = ERSATZRATE1.add(
        floor(GRENZE3.sub(ekVor).div(Big(2))).mul(Big(0.001)),
      );
      ersatzrate = fMin(ersatzrate, Big(1));
      elterngeld_keine_et = ekVor.mul(ersatzrate);
    }
    elterngeld_keine_et = fMax(elterngeld_keine_et, MINDESTSATZ);
    return elterngeld_keine_et;
  }

  protected elterngeld_et(ekVor: Big, ekNach: Big): Big {
    let ersatzrate: Big = BIG_ZERO;
    const ek_diff: Big = fMax(fMin(ekVor, HOECHST_ET).sub(ekNach), BIG_ZERO);
    let elterngeld_et: Big = ek_diff.mul(ERSATZRATE1);
    if (ekVor.gt(GRENZE1)) {
      elterngeld_et = fMin(ERSATZRATE2.mul(ek_diff), HOECHSTSATZ);
    }
    if (ekVor.gt(GRENZE2) && ekVor.lte(GRENZE1)) {
      ersatzrate = ERSATZRATE1.sub(
        floor(ekVor.sub(GRENZE2).div(Big(2.0))).mul(Big(0.001)),
      );
      elterngeld_et = ek_diff.mul(ersatzrate);
    }
    if (ekVor.lt(GRENZE3)) {
      ersatzrate = ERSATZRATE1.add(
        floor(GRENZE3.sub(ekVor).div(Big(2))).mul(Big(0.001)),
      );
      ersatzrate = fMin(ersatzrate, Big(1));
      elterngeld_et = ek_diff.mul(ersatzrate);
    }
    elterngeld_et = fMax(elterngeld_et, MINDESTSATZ);
    return elterngeld_et;
  }

  protected elterngeldplus_et(ekVor: Big, ekNach: Big): Big {
    let ersatzrate: Big = BIG_ZERO;
    const ek_diff: Big = fMax(fMin(ekVor, HOECHST_ET).sub(ekNach), BIG_ZERO);
    let elterngeldplus_et: Big = ek_diff.mul(ERSATZRATE1);
    if (ekVor.gt(GRENZE1)) {
      elterngeldplus_et = fMin(ERSATZRATE2.mul(ek_diff), HOECHSTSATZ);
    }
    if (ekVor.gt(GRENZE2) && ekVor.lte(GRENZE1)) {
      ersatzrate = ERSATZRATE1.sub(
        floor(ekVor.sub(GRENZE2).div(Big(2.0))).mul(Big(0.001)),
      );
      elterngeldplus_et = ek_diff.mul(ersatzrate);
    }
    if (ekVor.lt(GRENZE3)) {
      ersatzrate = ERSATZRATE1.add(
        floor(GRENZE3.sub(ekVor).div(Big(2))).mul(Big(0.001)),
      );
      ersatzrate = fMin(ersatzrate, Big(1));
      elterngeldplus_et = ek_diff.mul(ersatzrate);
    }
    elterngeldplus_et = fMax(elterngeldplus_et, MINDESTSATZ.div(Big(2)));
    if (elterngeldplus_et.gt(Big(900.0))) {
      elterngeldplus_et = Big(900.0);
    }
    return elterngeldplus_et;
  }
}
