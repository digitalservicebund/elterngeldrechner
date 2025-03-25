import type { Auswahloption } from "@/monatsplaner/Auswahloption";
import type { Einkommen } from "@/monatsplaner/Einkommen";
import type { Elterngeldbezug } from "@/monatsplaner/Elterngeldbezug";
import { Variante } from "@/monatsplaner/Variante";

export type Monat = MonatMitMutterschutz | MonatMitAuswahl;

interface MonatMitMutterschutz extends BasisMonat {
  imMutterschutz: true;
  gewaehlteOption: Variante.Basis;
  elterngeldbezug: null;
  bruttoeinkommen: null;
}

export const MONAT_MIT_MUTTERSCHUTZ: MonatMitMutterschutz = Object.freeze({
  imMutterschutz: true,
  gewaehlteOption: Variante.Basis,
  elterngeldbezug: null,
  bruttoeinkommen: null,
});

interface MonatMitAuswahl extends BasisMonat {
  imMutterschutz: false;
}

interface BasisMonat {
  readonly imMutterschutz: boolean;
  readonly gewaehlteOption?: Auswahloption;
  readonly elterngeldbezug?: Elterngeldbezug;
  readonly bruttoeinkommen?: Einkommen;
}
