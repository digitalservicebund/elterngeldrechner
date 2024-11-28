import { BruttoEinkommen } from "./einkommen-types";
import { PLANUNG_ANZAHL_MONATE } from "./planungs-daten";

/**
 * Erwerbszeitraum für Einkommen NACH der Geburt.
 */
export class ErwerbsZeitraumLebensMonat {
  constructor(
    public vonLebensMonat: number,
    public bisLebensMonat: number,
    public bruttoProMonat: BruttoEinkommen,
  ) {}

  // TW prüfen, ob die Felder noch benötigt werden.
  // nettoProMonat: NettoEinkommen = new Einkommen(0);
  // endeEGPeriode: number | null = null;
  // anfangEGPeriode: number | null = null;

  getAnzahlMonate(): number {
    if (
      !this.isVonEqualOrLessBis() ||
      this.isLMTooHigh() ||
      this.isLMTooSmall()
    ) {
      return 0;
    }
    return this.bisLebensMonat - this.vonLebensMonat + 1;
  }

  getLebensMonateList(): number[] {
    if (
      !this.isVonEqualOrLessBis() ||
      this.isLMTooHigh() ||
      this.isLMTooSmall()
    ) {
      return [];
    }

    const lebensMonate = [];
    for (
      let lebensMonat = this.vonLebensMonat;
      lebensMonat <= this.bisLebensMonat;
      lebensMonat++
    ) {
      lebensMonate.push(lebensMonat);
    }
    return lebensMonate;
  }

  private isVonEqualOrLessBis(): boolean {
    return this.vonLebensMonat <= this.bisLebensMonat;
  }

  private isLMTooHigh(): boolean {
    return (
      this.vonLebensMonat > PLANUNG_ANZAHL_MONATE ||
      this.bisLebensMonat > PLANUNG_ANZAHL_MONATE
    );
  }

  private isLMTooSmall(): boolean {
    return this.vonLebensMonat <= 0 || this.bisLebensMonat <= 0;
  }
}

/**
 * Ermittelt aus einer Liste von Erwerbszeiträumen, die Gesamtzahl der Monate.
 *
 * @param {ErwerbsZeitraumLebensMonat[]} erwerbsZeitraeume
 * @return {number}
 */
export function zaehleMonateErwerbsTaetigkeit(
  erwerbsZeitraeume: ErwerbsZeitraumLebensMonat[],
): number {
  let anzahlMonate: number = 0;
  if (
    erwerbsZeitraeume == null ||
    erwerbsZeitraeume.length === 0 ||
    erwerbsZeitraeume[0].vonLebensMonat == null
  ) {
    return 0;
  }
  for (const curr of erwerbsZeitraeume) {
    anzahlMonate += curr.getAnzahlMonate();
  }
  return anzahlMonate;
}
