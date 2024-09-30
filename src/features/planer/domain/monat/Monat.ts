import type { Einkommen } from "@/features/planer/domain/Einkommen";
import type { Auswahloption } from "@/features/planer/domain/Auswahloption";
import type { Elterngeldbezug } from "@/features/planer/domain/Elterngeldbezug";
import { Variante } from "@/features/planer/domain/Variante";

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
