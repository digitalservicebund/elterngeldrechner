/**
 * Datencontainer für das Zwischenergebnis bei Mischeinkommen.
 */
import Big from "big.js";
import { ErwerbsArt } from "./erwerbs-art";

export interface MischEkZwischenErgebnis {
  netto: Big;
  brutto: Big;
  steuern: Big;
  abgaben: Big;
  elterngeldbasis: Big;
  status: ErwerbsArt;
  rentenversicherungspflichtig: boolean;
  krankenversicherungspflichtig: boolean;
}
