import { LST_INPUT } from "@bmfin/steuerrechner/build/types/input";
import Big from "big.js";
import { BmfSteuerRechnerParameter } from "./bmf-steuer-rechner-parameter";

export namespace BmfSteuerRechnerParameterConverter {
  export const convert = (parameter: BmfSteuerRechnerParameter): LST_INPUT => ({
    LZZ: parameter.LZZ,
    RE4: Big(parameter.RE4),
    STKL: parameter.STKL,
    ZKF: Big(parameter.ZKF),
    R: parameter.R,
    PKV: parameter.PKV,
    KVZ: Big(parameter.KVZ),
    PVS: parameter.PVS === 1,
    PVZ: parameter.PVZ === 1,
    KRV: parameter.KRV,
    ALTER1: parameter.ALTER1 === 1,
    AF: parameter.AF === 1,
    F: Big(parameter.F),
  });
}
