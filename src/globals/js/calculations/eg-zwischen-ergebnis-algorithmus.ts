import Big from "big.js";
import { DateTime } from "luxon";
import { AbstractAlgorithmus } from "./abstract-algorithmus";
import {
  Einkommen,
  ErwerbsArt,
  Kind,
  NettoEinkommen,
  PersoenlicheDaten,
  ZwischenErgebnis,
} from "./model";
import {
  dateWithoutTimeOf,
  daysBetween,
  plusDays,
  plusYears,
} from "@/globals/js/calculations/common/date-util";
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
    const geschw: Kind[] = persoenlicheDaten.geschwister ?? [];
    let ende: Date | undefined = undefined;
    const ind_geschw: boolean = geschw.length > 0;
    const no_kinder: number = persoenlicheDaten.anzahlKuenftigerKinder;
    const ek_vor: NettoEinkommen =
      ErwerbsArt.NEIN !== persoenlicheDaten.etVorGeburt
        ? nettoEinkommen
        : new Einkommen(0);
    let ek_vor_copy: Big = BIG_ZERO;
    ek_vor_copy = ek_vor_copy.add(ek_vor.value);
    const status_et: ErwerbsArt = persoenlicheDaten.etVorGeburt;
    let mehrlingszuschlag: Big;
    let ende_bonus_u2_final: Date;
    let ende_bonus_u14_final: Date;
    let ende_bonus_u6_final: Date;
    const pausch: Big = PAUSCH;
    let elterngeldbasis: Big;
    let ersatzrate_ausgabe: Big;
    const betrag_Mehrlingszuschlag: Big = BETRAG_MEHRLINGSZUSCHLAG;
    let geschwisterbonus: Big;
    const rate_bonus: Big = RATE_BONUS;
    const min_geschwisterbonus: Big = MIN_GESCHWISTERBONUS;
    if (ind_geschw) {
      ende_bonus_u2_final = dateWithoutTimeOf(
        this.ende_bonus_u2(geburt, geschw),
      );
      ende_bonus_u14_final = dateWithoutTimeOf(
        this.ende_bonus_u14(geburt, geschw),
      );
      ende_bonus_u6_final = dateWithoutTimeOf(
        this.ende_bonus_u6(geburt, geschw),
      );
      if (
        ende_bonus_u2_final >= ende_bonus_u14_final &&
        ende_bonus_u2_final >= ende_bonus_u6_final &&
        ende_bonus_u2_final >= geburt
      ) {
        ende = ende_bonus_u2_final;
      } else if (
        ende_bonus_u6_final >= ende_bonus_u2_final &&
        ende_bonus_u6_final >= ende_bonus_u14_final &&
        ende_bonus_u6_final >= geburt
      ) {
        ende = ende_bonus_u6_final;
      } else if (
        ende_bonus_u14_final >= ende_bonus_u2_final &&
        ende_bonus_u14_final >= ende_bonus_u6_final &&
        ende_bonus_u14_final >= geburt
      ) {
        ende = ende_bonus_u14_final;
      } else {
        ende = geburt;
      }
    }
    if (ende === undefined || ende < geburt) {
      ende = geburt;
    }
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
    if (ende !== undefined && ende > geburt) {
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
      zeitraumGeschwisterBonus: ende,
      nettoVorGeburt: nettoEinkommen.value,
    };
  }

  public ende_bonus_u6(geburt: Date, geschw: Kind[]): Date {
    const geschw_jung = this.fktZweitMax(
      this.onlyGeschwisterVorGeburt(geburt, geschw),
    );
    return this.ende_bonus(geburt, geschw_jung, 6);
  }

  public ende_bonus_u14(geburt: Date, geschw: Kind[]): Date {
    const geschw_b: Kind[] = [];
    geschw.forEach((act) => {
      if (act.istBehindert) {
        geschw_b.push(act);
      } else {
        geschw_b.push({
          geburtsdatum: new Date(1899, 11, 31),
          istBehindert: act.istBehindert,
        });
      }
    });
    // jüngstes Kind finden (ausser Neugeborenes)
    const geschw_jung = this.fktMax(
      this.onlyGeschwisterVorGeburt(geburt, geschw_b),
    );
    return this.ende_bonus(geburt, geschw_jung, 14);
  }

  /**
   * Geschwisterbonus wird bis zu dem Zeitpunkt gezahlt an dem ein Geschwisterkind 3 Jahre alt wird.
   * Der Zeitraum endet mit dem Ende des jeweiligen Lebensmonats des Kindes, für das Elterngeld bezogen wird.
   *
   * Public Function ende_bonus_u2(geburt, geschw)
   * geschw_jung = fktMax(geschw)
   * zweiter_geb_geschw_jung = DateSerial(Year(geschw_jung) + 3, Month(geschw_jung), Day(geschw_jung))
   * zeit_bis_ende_bonus_u2 = Max(zweiter_geb_geschw_jung - geburt, 0)
   * ende_bonus_u2 = DateSerial(Year(geburt), Month(geburt), Day(geburt) + zeit_bis_ende_bonus_u2)
   * zusatz = Day(DateSerial(Year(geburt), Month(geburt) + Dauer, Day(geburt))) - Day(ende_bonus_u2) - 1
   * If ende_bonus_u2 > geburt Then
   * If zusatz >= 0 Then
   * ende_bonus_u2 = DateSerial(Year(ende_bonus_u2), Month(ende_bonus_u2), Day(ende_bonus_u2) + zusatz)
   * ElseIf zusatz < 0 Then
   * ende_bonus_u2 = DateSerial(Year(ende_bonus_u2), Month(ende_bonus_u2) + 1, Day(ende_bonus_u2) + zusatz)
   * End If
   * End If
   * End Function
   *
   * @param {Date} geburt
   * @param {Kind[]} geschw
   * @return
   */
  public ende_bonus_u2(geburt: Date, geschw: Kind[]): Date {
    // jüngstes Kind finden (ausser Neugeborenes)
    const geschw_jung = this.fktMax(
      this.onlyGeschwisterVorGeburt(geburt, geschw),
    );

    return this.ende_bonus(geburt, geschw_jung, 3);
  }

  private onlyGeschwisterVorGeburt(geburt: Date, geschw: Kind[]): Kind[] {
    return geschw.filter((value) => {
      return value.geburtsdatum !== undefined && value.geburtsdatum < geburt;
    });
  }

  private ende_bonus(
    geburt: Date,
    geburtstag_geschw: Date | undefined,
    bonusYears: number,
  ): Date {
    let zeit_bis_ende_bonus_days: number = -1;
    if (geburtstag_geschw !== undefined) {
      const bonus_geb_geschw_jung = plusYears(geburtstag_geschw, bonusYears);
      if (bonus_geb_geschw_jung >= geburt) {
        zeit_bis_ende_bonus_days = daysBetween(geburt, bonus_geb_geschw_jung);
      }
    }

    let ende_bonus = plusDays(geburt, zeit_bis_ende_bonus_days);

    if (ende_bonus >= geburt) {
      // Ende LM berechnen
      if (geburt.getDate() <= 28) {
        ende_bonus = DateTime.fromJSDate(ende_bonus)
          .set({ day: geburt.getDate() })
          .plus({ month: 1 })
          .minus({ day: 1 })
          .toJSDate();
      } else {
        ende_bonus = DateTime.fromJSDate(ende_bonus)
          .set({ day: geburt.getDate() })
          .minus({ day: 1 })
          .plus({ month: 1 })
          .toJSDate();
      }
    }
    return ende_bonus;
  }
}
