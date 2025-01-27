import { DateTime } from "luxon";
import { AbstractAlgorithmus } from "./abstract-algorithmus";
import {
  Einkommen,
  ErwerbsArt,
  Kind,
  PersoenlicheDaten,
  ZwischenErgebnis,
} from "./model";
import { aufDenCentRunden } from "@/globals/js/calculations/common/math-util";
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
  public elterngeldZwischenergebnis(
    persoenlicheDaten: PersoenlicheDaten,
    nettoEinkommen: Einkommen,
  ): ZwischenErgebnis {
    if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
      throw new Error("wahrscheinlichesGeburtsDatum is undefined");
    }
    const geburt: Date = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
    const geschwister = persoenlicheDaten.geschwister ?? [];
    const no_kinder: number = persoenlicheDaten.anzahlKuenftigerKinder;
    const ek_vor: Einkommen =
      ErwerbsArt.NEIN !== persoenlicheDaten.etVorGeburt
        ? nettoEinkommen
        : new Einkommen(0);
    let ek_vor_copy = 0;
    ek_vor_copy = ek_vor_copy + ek_vor.value;
    const status_et: ErwerbsArt = persoenlicheDaten.etVorGeburt;
    let mehrlingszuschlag: number;
    const pausch = PAUSCH;
    let elterngeldbasis: number;
    let ersatzrate_ausgabe;
    const betrag_Mehrlingszuschlag = BETRAG_MEHRLINGSZUSCHLAG;
    let geschwisterbonus: number;
    const rate_bonus = RATE_BONUS;
    const min_geschwisterbonus = MIN_GESCHWISTERBONUS;

    const zeitraumGeschwisterBonus = this.determineDeadlineForGeschwisterbonus(
      geschwister,
      geburt,
    );

    if (
      status_et === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI ||
      status_et === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ||
      status_et === ErwerbsArt.JA_NICHT_SELBST_MINI
    ) {
      ek_vor_copy = Math.max(ek_vor_copy - pausch, 0);
    }
    elterngeldbasis = this.elterngeld_keine_et(ek_vor_copy);
    ersatzrate_ausgabe = this.ersatzrate_eg(ek_vor_copy);
    if (no_kinder > 1) {
      mehrlingszuschlag = betrag_Mehrlingszuschlag * (no_kinder - 1);
    } else {
      mehrlingszuschlag = 0;
    }
    if (zeitraumGeschwisterBonus !== null) {
      geschwisterbonus = Math.max(
        elterngeldbasis * rate_bonus,
        min_geschwisterbonus,
      );
    } else {
      geschwisterbonus = 0;
    }
    elterngeldbasis = aufDenCentRunden(elterngeldbasis);
    ersatzrate_ausgabe = aufDenCentRunden(ersatzrate_ausgabe);
    geschwisterbonus = aufDenCentRunden(geschwisterbonus);

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
    const zweitjuengstesGeschwisterkind = findNthLastBornChild(geschwister, 2);

    return zweitjuengstesGeschwisterkind
      ? this.ende_bonus(zweitjuengstesGeschwisterkind.geburtsdatum, 6)
      : undefined;
  }

  public ende_bonus_u14(geschwister: Kind[]): Date | undefined {
    const geschwisterMitBehinderung = geschwister.filter(
      (kind) => kind.istBehindert,
    );

    const juengstesGeschwisterkindMitBehinderung = findNthLastBornChild(
      geschwisterMitBehinderung,
      1,
    );

    return juengstesGeschwisterkindMitBehinderung
      ? this.ende_bonus(juengstesGeschwisterkindMitBehinderung.geburtsdatum, 14)
      : undefined;
  }

  public ende_bonus_u3(geschwister: Kind[]): Date | undefined {
    const juengstesGeschwisterkind = findNthLastBornChild(geschwister, 1);

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

/**
 * @param kinder
 * @param nth starting from number `1` (for readability purpose), `0` will
 * always result in `undefined`
 * @return nth last born child, `undefined` if there are "not enough" `kinder`
 */
function findNthLastBornChild(kinder: Kind[], nth: number): Kind | undefined {
  return kinder.toSorted(compareKinderByLatestGeburtsdatum)[nth - 1];
}

function compareDateByLatestOrder(left: Date, right: Date): number {
  return right.getTime() - left.getTime();
}

function compareKinderByLatestGeburtsdatum(left: Kind, right: Kind): number {
  return right.geburtsdatum.getTime() - left.geburtsdatum.getTime();
}

if (import.meta.vitest) {
  const { describe, test, expect } = import.meta.vitest;

  describe("Elterngeld-Zwischenergebnis-Algorithmus", () => {
    test.each<{ kinder: Kind[]; nth: number; nthLastBorn: Kind | undefined }>([
      {
        kinder: [],
        nth: 1,
        nthLastBorn: undefined,
      },
      {
        kinder: [{ geburtsdatum: new Date(2021, 1, 1) }],
        nth: 1,
        nthLastBorn: { geburtsdatum: new Date(2021, 1, 1) },
      },
      {
        kinder: [{ geburtsdatum: new Date(2021, 1, 1) }],
        nth: 2,
        nthLastBorn: undefined,
      },
      {
        kinder: [{ geburtsdatum: new Date(2021, 1, 1) }],
        nth: 0,
        nthLastBorn: undefined,
      },
      {
        kinder: [
          { geburtsdatum: new Date(2021, 1, 1), istBehindert: false },
          { geburtsdatum: new Date(2021, 1, 2), istBehindert: true },
        ],
        nth: 1,
        nthLastBorn: { geburtsdatum: new Date(2021, 1, 2), istBehindert: true },
      },
      {
        kinder: [
          { geburtsdatum: new Date(2021, 1, 1), istBehindert: false },
          { geburtsdatum: new Date(2021, 1, 2), istBehindert: true },
        ],
        nth: 2,
        nthLastBorn: {
          geburtsdatum: new Date(2021, 1, 1),
          istBehindert: false,
        },
      },
      {
        kinder: [
          { geburtsdatum: new Date(2021, 1, 1), istBehindert: false },
          { geburtsdatum: new Date(2020, 1, 1), istBehindert: true },
          { geburtsdatum: new Date(2021, 1, 2), istBehindert: false },
        ],
        nth: 3,
        nthLastBorn: { geburtsdatum: new Date(2020, 1, 1), istBehindert: true },
      },
    ])(
      "find nth last born child - case: #%#",
      ({ kinder, nth, nthLastBorn }) => {
        expect(findNthLastBornChild(kinder, nth)).toStrictEqual(nthLastBorn);
      },
    );
  });
}
