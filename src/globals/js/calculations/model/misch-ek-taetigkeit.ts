import Big from "big.js";
import { YesNo } from "./yes-no";
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
  rentenVersicherungsPflichtig: YesNo = YesNo.YES;
  krankenVersicherungsPflichtig: YesNo = YesNo.YES;
  arbeitslosenVersicherungsPflichtig: YesNo = YesNo.YES;

  constructor(falseOrTrue: boolean = false) {
    this.bemessungsZeitraumMonate = new Array(ANZAHL_MONATE_PRO_JAHR).fill(
      falseOrTrue,
    );
  }

  getAnzahlBemessungsZeitraumMonate(): number {
    return this.bemessungsZeitraumMonate.filter((value) => value).length;
  }
}

export const createMischEkTaetigkeitOf = (
  erwerbsTaetigkeit: ErwerbsTaetigkeit,
  bruttoEinkommenDurchschnitt: Big,
  bemessungsZeitraumMonate: boolean[],
  rentenVersicherungsPflichtig: YesNo,
  krankenVersicherungsPflichtig: YesNo,
  arbeitslosenVersicherungsPflichtig: YesNo,
) => {
  const m = new MischEkTaetigkeit(false);
  m.erwerbsTaetigkeit = erwerbsTaetigkeit;
  m.bruttoEinkommenDurchschnitt = bruttoEinkommenDurchschnitt;
  m.bemessungsZeitraumMonate = bemessungsZeitraumMonate;
  m.rentenVersicherungsPflichtig = rentenVersicherungsPflichtig;
  m.krankenVersicherungsPflichtig = krankenVersicherungsPflichtig;
  m.arbeitslosenVersicherungsPflichtig = arbeitslosenVersicherungsPflichtig;
  return m;
};
