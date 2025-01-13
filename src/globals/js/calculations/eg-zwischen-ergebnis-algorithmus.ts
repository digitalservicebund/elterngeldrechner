import Big from "big.js";
import { DateTime } from "luxon";
import { AbstractAlgorithmus } from "./abstract-algorithmus";
import { findLastBornChild, findSecondLastBornChild } from "./common/kind-util";
import {
  Einkommen,
  ErwerbsArt,
  Kind,
  NettoEinkommen,
  PersoenlicheDaten,
  ZwischenErgebnis,
} from "./model";
import {
  BIG_ZERO,
  fMax,
  round,
} from "@/globals/js/calculations/common/math-util";
import {
  BETRAG_MEHRLINGSZUSCHLAG,
  MIN_GESCHWISTERBONUS,
  PAUSCH,
  RATE_BONUS,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

/**
 * Algorithmus zur Berechnung des Zwischenergebnisses des Elterngeldrechners.
 *
 * Im Elterngeldrechner Plus dient das Zwischenergebnis u.a. zur Ermittlung
 * des Basiselterngelds, sowie der Mehrlingszulage bzw. des Geschwisterbonus.
 */
export class EgZwischenErgebnisAlgorithmus extends AbstractAlgorithmus {
  /**
   * Berechnet das Zwischenergebnis des Elterngeldrechners.
   *
   * @param {PersoenlicheDaten} persoenlicheDaten Die persönlichen Daten eines Elternteils.
   * @param {NettoEinkommen} nettoEinkommen Nettoeinkommen vor der Geburt.
   * @return {ZwischenErgebnis} Das Zwischenergebnis des Elterngeldrechners.
   */
  public elterngeldZwischenergebnis(
    persoenlicheDaten: PersoenlicheDaten,
    nettoEinkommen: NettoEinkommen,
  ): ZwischenErgebnis {
    if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
      throw new Error("wahrscheinlichesGeburtsDatum is undefined");
    }
    const geburt: Date = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
    const geschwister = persoenlicheDaten.geschwister ?? [];
    const no_kinder: number = persoenlicheDaten.anzahlKuenftigerKinder;
    const ek_vor: NettoEinkommen =
      ErwerbsArt.NEIN !== persoenlicheDaten.etVorGeburt
        ? nettoEinkommen
        : new Einkommen(0);
    let ek_vor_copy: Big = BIG_ZERO;
    ek_vor_copy = ek_vor_copy.add(ek_vor.value);
    const status_et: ErwerbsArt = persoenlicheDaten.etVorGeburt;
    let mehrlingszuschlag: Big;
    const pausch: Big = PAUSCH;
    let elterngeldbasis: Big;
    let ersatzrate_ausgabe: Big;
    const betrag_Mehrlingszuschlag: Big = BETRAG_MEHRLINGSZUSCHLAG;
    let geschwisterbonus: Big;
    const rate_bonus: Big = RATE_BONUS;
    const min_geschwisterbonus: Big = MIN_GESCHWISTERBONUS;

    const zeitraumGeschwisterBonus = this.determineDeadlineForGeschwisterbonus(
      geschwister,
      geburt,
    );

    if (
      status_et === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI ||
      status_et === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ||
      status_et === ErwerbsArt.JA_NICHT_SELBST_MINI
    ) {
      ek_vor_copy = fMax(ek_vor_copy.sub(pausch), BIG_ZERO);
    }
    elterngeldbasis = this.elterngeld_keine_et(ek_vor_copy);
    ersatzrate_ausgabe = this.ersatzrate_eg(ek_vor_copy);
    if (no_kinder > 1) {
      mehrlingszuschlag = betrag_Mehrlingszuschlag.mul(Big(no_kinder - 1));
    } else {
      mehrlingszuschlag = BIG_ZERO;
    }
    if (zeitraumGeschwisterBonus !== null) {
      geschwisterbonus = fMax(
        elterngeldbasis.mul(rate_bonus),
        min_geschwisterbonus,
      );
    } else {
      geschwisterbonus = BIG_ZERO;
    }
    elterngeldbasis = round(elterngeldbasis);
    ersatzrate_ausgabe = round(ersatzrate_ausgabe);
    geschwisterbonus = round(geschwisterbonus, 3);

    return {
      elternGeld: elterngeldbasis,
      ersatzRate: ersatzrate_ausgabe,
      geschwisterBonus: geschwisterbonus,
      mehrlingsZulage: mehrlingszuschlag,
      zeitraumGeschwisterBonus,
      nettoVorGeburt: nettoEinkommen.value,
    };
  }

  public determineDeadlineForGeschwisterbonus(
    geschwister: Kind[],
    geburtsdatum: Date,
  ): Date | null {
    return (
      [
        this.ende_bonus_u3(geschwister),
        this.ende_bonus_u6(geschwister),
        this.ende_bonus_u14(geschwister),
      ]
        .filter((date) => date !== undefined)
        .filter((date) => date >= geburtsdatum)
        .toSorted(compareDateByLatestOrder)[0] ?? null
    );
  }

  public ende_bonus_u6(geschwister: Kind[]): Date | undefined {
    const zweitjuengstesGeschwisterkind = findSecondLastBornChild(geschwister);

    return zweitjuengstesGeschwisterkind
      ? this.ende_bonus(zweitjuengstesGeschwisterkind.geburtsdatum, 6)
      : undefined;
  }

  public ende_bonus_u14(geschwister: Kind[]): Date | undefined {
    const geschwisterMitBehinderung = geschwister.filter(
      (kind) => kind.istBehindert,
    );

    const juengstesGeschwisterkindMitBehinderung = findLastBornChild(
      geschwisterMitBehinderung,
    );

    return juengstesGeschwisterkindMitBehinderung
      ? this.ende_bonus(juengstesGeschwisterkindMitBehinderung.geburtsdatum, 14)
      : undefined;
  }

  public ende_bonus_u3(geschwister: Kind[]): Date | undefined {
    const juengstesGeschwisterkind = findLastBornChild(geschwister);

    return juengstesGeschwisterkind
      ? this.ende_bonus(juengstesGeschwisterkind.geburtsdatum, 3)
      : undefined;
  }

  /**
   * The returned date is the day till which (inclusive) the bonus will be
   * payed. The bonus will be payed out till the Lebensmonat within which this
   * date is within. In practice, Elterngeld will be transferred somewhen within
   * a Lebensmonat.
   */
  private ende_bonus(
    geburtstagDesGeschwisterkinds: Date,
    maximalesAlterInJahren: number,
  ): Date {
    return DateTime.fromJSDate(geburtstagDesGeschwisterkinds)
      .plus({ years: maximalesAlterInJahren })
      .minus({ days: 1 })
      .toJSDate();
  }
}

function compareDateByLatestOrder(left: Date, right: Date): number {
  return right.getTime() - left.getTime();
}
