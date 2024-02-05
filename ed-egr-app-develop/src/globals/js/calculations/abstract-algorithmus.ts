import Big from "big.js";
import { EgrBerechnungParamId, Kind } from "./model";
import { MathUtil } from "./common/math-util";
import { KindUtil } from "./common/kind-util";

/**
 * Source: de.init.anton.plugins.egr.service.AbstractAlgorithmus
 */
export abstract class AbstractAlgorithmus {
  protected ersatzrate_eg(ek_vor_copy: Big): Big {
    const ek_vor: Big = ek_vor_copy;
    const ersatzrate1: Big = EgrBerechnungParamId.ERSATZRATE1;
    const ersatzrate2: Big = EgrBerechnungParamId.ERSATZRATE2;
    const grenze1: Big = EgrBerechnungParamId.GRENZE1;
    const grenze2: Big = EgrBerechnungParamId.GRENZE2;
    const grenze3: Big = EgrBerechnungParamId.GRENZE3;
    let ersatzrate_eg: Big = ersatzrate1;
    if (ek_vor.gt(grenze1)) {
      ersatzrate_eg = ersatzrate2;
    }
    if (ek_vor.gt(grenze2) && ek_vor.lte(grenze1)) {
      let y: Big = ek_vor.sub(grenze2);
      y = y.div(Big(2));
      y = MathUtil.floor(y);
      y = y.mul(Big(0.001));
      ersatzrate_eg = ersatzrate1.sub(y);
    }
    if (ek_vor.lt(grenze3)) {
      let y: Big = grenze3.sub(ek_vor);
      y = y.div(Big(2));
      y = MathUtil.floor(y);
      y = y.mul(Big(0.001));
      ersatzrate_eg = ersatzrate1.add(y);
      ersatzrate_eg = MathUtil.fMin(ersatzrate_eg, MathUtil.BIG_ONE);
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
    return KindUtil.findLastBornChild(kindList)?.geburtsdatum;
  }

  /**
   * Suche das Geburtsdatum des zweitjüngsten Kindes.
   *
   * @param kindList Eine Liste von {@link Kind}.
   * @return Das {@link Date} des zweitjüngsten Kindes oder undefined, wenn die Liste leer ist oder nur ein Kind enthält.
   */
  protected fktZweitMax(kindList: Kind[]): Date | undefined {
    return KindUtil.findSecondLastBornChild(kindList)?.geburtsdatum;
  }

  protected elterngeld_keine_et(ekVor: Big): Big {
    let ersatzrate: Big = EgrBerechnungParamId.ERSATZRATE1;
    let elterngeld_keine_et: Big = ekVor.mul(ersatzrate);
    if (ekVor.gt(EgrBerechnungParamId.GRENZE1)) {
      elterngeld_keine_et = MathUtil.fMin(
        EgrBerechnungParamId.ERSATZRATE2.mul(ekVor),
        EgrBerechnungParamId.HOECHSTSATZ,
      );
    }
    if (
      ekVor.gt(EgrBerechnungParamId.GRENZE2) &&
      ekVor.lte(EgrBerechnungParamId.GRENZE1)
    ) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.sub(
        MathUtil.floor(
          ekVor.sub(EgrBerechnungParamId.GRENZE2).div(Big(2.0)),
        ).mul(Big(0.001)),
      );
      elterngeld_keine_et = ekVor.mul(ersatzrate);
    }
    if (ekVor.lt(EgrBerechnungParamId.GRENZE3)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.add(
        MathUtil.floor(EgrBerechnungParamId.GRENZE3.sub(ekVor).div(Big(2))).mul(
          Big(0.001),
        ),
      );
      ersatzrate = MathUtil.fMin(ersatzrate, Big(1));
      elterngeld_keine_et = ekVor.mul(ersatzrate);
    }
    elterngeld_keine_et = MathUtil.fMax(
      elterngeld_keine_et,
      EgrBerechnungParamId.MINDESTSATZ,
    );
    return elterngeld_keine_et;
  }

  protected elterngeld_et(ekVor: Big, ekNach: Big): Big {
    let ersatzrate: Big = MathUtil.BIG_ZERO;
    const ek_diff: Big = MathUtil.fMax(
      MathUtil.fMin(ekVor, EgrBerechnungParamId.HOECHST_ET).sub(ekNach),
      MathUtil.BIG_ZERO,
    );
    let elterngeld_et: Big = ek_diff.mul(EgrBerechnungParamId.ERSATZRATE1);
    if (ekVor.gt(EgrBerechnungParamId.GRENZE1)) {
      elterngeld_et = MathUtil.fMin(
        EgrBerechnungParamId.ERSATZRATE2.mul(ek_diff),
        EgrBerechnungParamId.HOECHSTSATZ,
      );
    }
    if (
      ekVor.gt(EgrBerechnungParamId.GRENZE2) &&
      ekVor.lte(EgrBerechnungParamId.GRENZE1)
    ) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.sub(
        MathUtil.floor(
          ekVor.sub(EgrBerechnungParamId.GRENZE2).div(Big(2.0)),
        ).mul(Big(0.001)),
      );
      elterngeld_et = ek_diff.mul(ersatzrate);
    }
    if (ekVor.lt(EgrBerechnungParamId.GRENZE3)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.add(
        MathUtil.floor(EgrBerechnungParamId.GRENZE3.sub(ekVor).div(Big(2))).mul(
          Big(0.001),
        ),
      );
      ersatzrate = MathUtil.fMin(ersatzrate, Big(1));
      elterngeld_et = ek_diff.mul(ersatzrate);
    }
    elterngeld_et = MathUtil.fMax(
      elterngeld_et,
      EgrBerechnungParamId.MINDESTSATZ,
    );
    return elterngeld_et;
  }

  protected elterngeldplus_et(ekVor: Big, ekNach: Big): Big {
    let ersatzrate: Big = MathUtil.BIG_ZERO;
    const ek_diff: Big = MathUtil.fMax(
      MathUtil.fMin(ekVor, EgrBerechnungParamId.HOECHST_ET).sub(ekNach),
      MathUtil.BIG_ZERO,
    );
    let elterngeldplus_et: Big = ek_diff.mul(EgrBerechnungParamId.ERSATZRATE1);
    if (ekVor.gt(EgrBerechnungParamId.GRENZE1)) {
      elterngeldplus_et = MathUtil.fMin(
        EgrBerechnungParamId.ERSATZRATE2.mul(ek_diff),
        EgrBerechnungParamId.HOECHSTSATZ,
      );
    }
    if (
      ekVor.gt(EgrBerechnungParamId.GRENZE2) &&
      ekVor.lte(EgrBerechnungParamId.GRENZE1)
    ) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.sub(
        MathUtil.floor(
          ekVor.sub(EgrBerechnungParamId.GRENZE2).div(Big(2.0)),
        ).mul(Big(0.001)),
      );
      elterngeldplus_et = ek_diff.mul(ersatzrate);
    }
    if (ekVor.lt(EgrBerechnungParamId.GRENZE3)) {
      ersatzrate = EgrBerechnungParamId.ERSATZRATE1.add(
        MathUtil.floor(EgrBerechnungParamId.GRENZE3.sub(ekVor).div(Big(2))).mul(
          Big(0.001),
        ),
      );
      ersatzrate = MathUtil.fMin(ersatzrate, Big(1));
      elterngeldplus_et = ek_diff.mul(ersatzrate);
    }
    elterngeldplus_et = MathUtil.fMax(
      elterngeldplus_et,
      EgrBerechnungParamId.MINDESTSATZ.div(Big(2)),
    );
    if (elterngeldplus_et.gt(Big(900.0))) {
      elterngeldplus_et = Big(900.0);
    }
    return elterngeldplus_et;
  }
}
