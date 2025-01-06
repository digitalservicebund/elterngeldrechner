import Big from "big.js";
import { BIG_ZERO } from "@/globals/js/calculations/common/math-util";

/**
 * Enthält die Daten zu einer Tätigkeit bei Mischeinkommen.
 */
export enum ErwerbsTaetigkeit {
  SELBSTSTAENDIG = "SELBSTSTAENDIG",
  NICHT_SELBSTSTAENDIG = "NICHT_SELBSTSTAENDIG",
  MINIJOB = "MINIJOB",
}

const ANZAHL_MONATE_PRO_JAHR: number = 12;

export class MischEkTaetigkeit {
  erwerbsTaetigkeit: ErwerbsTaetigkeit = ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG;
  bruttoEinkommenDurchschnitt: Big = BIG_ZERO;
  bruttoEinkommenDurchschnittMidi: Big = BIG_ZERO;
  bemessungsZeitraumMonate: boolean[] = [];
  istRentenVersicherungsPflichtig: boolean = true;
  istKrankenVersicherungsPflichtig: boolean = true;
  istArbeitslosenVersicherungsPflichtig: boolean = true;

  constructor(falseOrTrue: boolean = false) {
    this.bemessungsZeitraumMonate = new Array<boolean>(
      ANZAHL_MONATE_PRO_JAHR,
    ).fill(falseOrTrue);
  }

  getAnzahlBemessungsZeitraumMonate(): number {
    return this.bemessungsZeitraumMonate.filter((value) => value).length;
  }
}

export const createMischEkTaetigkeitOf = (
  erwerbsTaetigkeit: ErwerbsTaetigkeit,
  bruttoEinkommenDurchschnitt: Big,
  bemessungsZeitraumMonate: boolean[],
  istRentenVersicherungsPflichtig: boolean,
  istKrankenVersicherungsPflichtig: boolean,
  istArbeitslosenVersicherungsPflichtig: boolean,
) => {
  const m = new MischEkTaetigkeit(false);
  m.erwerbsTaetigkeit = erwerbsTaetigkeit;
  m.bruttoEinkommenDurchschnitt = bruttoEinkommenDurchschnitt;
  m.bemessungsZeitraumMonate = bemessungsZeitraumMonate;
  m.istRentenVersicherungsPflichtig = istRentenVersicherungsPflichtig;
  m.istKrankenVersicherungsPflichtig = istKrankenVersicherungsPflichtig;
  m.istArbeitslosenVersicherungsPflichtig =
    istArbeitslosenVersicherungsPflichtig;
  return m;
};
