import { BmfAbgaben } from "./bmf-abgaben";
import { BmfSteuerRechnerResponse } from "@/globals/js/calculations/brutto-netto-rechner/bmf-steuer-rechner";

export function bmfAbgabenOf(
  bmfResponse: BmfSteuerRechnerResponse,
): BmfAbgaben {
  const bmfAbgaben = new BmfAbgaben();

  bmfAbgaben.bk = bmfResponse.BK;
  bmfAbgaben.bks = bmfResponse.BKS;
  bmfAbgaben.bkv = bmfResponse.BKV;
  bmfAbgaben.lstlzz = bmfResponse.LSTLZZ;
  bmfAbgaben.solzlzz = bmfResponse.SOLZLZZ;
  bmfAbgaben.solzs = bmfResponse.SOLZS;
  bmfAbgaben.solzv = bmfResponse.SOLZV;
  bmfAbgaben.sts = bmfResponse.STS;
  bmfAbgaben.stv = bmfResponse.STV;

  return bmfAbgaben;
}
