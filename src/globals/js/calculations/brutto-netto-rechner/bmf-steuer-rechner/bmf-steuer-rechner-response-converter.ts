import Big from "big.js";
import { BmfSteuerRechnerResponse } from "./bmf-steuer-rechner-response";

export namespace BmfSteuerRechnerResponseConverter {
  export const convert = (lstOutput: {
    BK: number;
    BKS: number;
    BKV: number;
    LSTLZZ: number;
    SOLZLZZ: number;
    SOLZS: number;
    SOLZV: number;
    STS: number;
    STV: number;
    VKVLZZ: number;
    VKVSONST: number;
    VFRB: number;
    VFRBS1: number;
    VFRBS2: number;
    WVFRB: number;
    WVFRBO: number;
    WVFRBM: number;
  }): BmfSteuerRechnerResponse => ({
    BK: toBigEuro(lstOutput.BK),
    BKS: toBigEuro(lstOutput.BKS),
    BKV: toBigEuro(lstOutput.BKV),
    LSTLZZ: toBigEuro(lstOutput.LSTLZZ),
    SOLZLZZ: toBigEuro(lstOutput.SOLZLZZ),
    SOLZS: toBigEuro(lstOutput.SOLZS),
    SOLZV: toBigEuro(lstOutput.SOLZV),
    STS: toBigEuro(lstOutput.STS),
    STV: toBigEuro(lstOutput.STV),
    VKVLZZ: toBigEuro(lstOutput.VKVLZZ),
    VKVSONST: toBigEuro(lstOutput.VKVSONST),
  });

  const toBigEuro = (cent: number) => Big(cent).div(100);
}
