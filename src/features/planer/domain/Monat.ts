import type { Auswahloption } from "./Auswahloption";
import type { Elterngeldbezug } from "./Elterngeldbezug";
import { Variante } from "./Variante";

export type Monat = MonatMitMutterschutz | MonatMitAuswahl;

interface MonatMitMutterschutz extends BasisMonat {
  imMutterschutz: true;
  gewaehlteOption: Variante.Basis;
  elterngeldbezug: null;
}

interface MonatMitAuswahl extends BasisMonat {
  imMutterschutz: false;
}

interface BasisMonat {
  readonly imMutterschutz: boolean;
  readonly gewaehlteOption?: Auswahloption;
  readonly elterngeldbezug?: Elterngeldbezug;
}
