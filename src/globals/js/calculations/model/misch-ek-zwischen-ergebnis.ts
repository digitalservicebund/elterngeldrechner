/**
 * Datencontainer für das Zwischenergebnis bei Mischeinkommen.
 */
import { ErwerbsArt } from "./erwerbs-art";

export interface MischEkZwischenErgebnis {
  netto: number;
  brutto: number;
  steuern: number;
  abgaben: number;
  elterngeldbasis: number;
  status: ErwerbsArt;
  rentenversicherungspflichtig: boolean;
  krankenversicherungspflichtig: boolean;
}
