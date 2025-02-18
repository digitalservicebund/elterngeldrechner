import { addYears, subDays } from "date-fns";
import { berechneBasiselterngeld } from "./einkommensersatzleistung";
import { bestimmeErsatzrate } from "./ersatzrate";
import {
  Einkommen,
  ErwerbsArt,
  Kind,
  PersoenlicheDaten,
  ZwischenErgebnis,
} from "./model";
import { bestimmeWerbekostenpauschale } from "./werbekostenpauschale";
import { aufDenCentRunden } from "@/globals/js/calculations/common/math-util";
import {
  BETRAG_MEHRLINGSZUSCHLAG,
  MIN_GESCHWISTERBONUS,
  RATE_BONUS,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

export function elterngeldZwischenergebnis(
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
  let elterngeldbasis: number;
  let ersatzrate_ausgabe;
  const betrag_Mehrlingszuschlag = BETRAG_MEHRLINGSZUSCHLAG;
  let geschwisterbonus: number;
  const rate_bonus = RATE_BONUS;
  const min_geschwisterbonus = MIN_GESCHWISTERBONUS;

  const zeitraumGeschwisterBonus = determineDeadlineForGeschwisterbonus(
    geschwister,
    geburt,
  );

  if (
    status_et === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI ||
    status_et === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ||
    status_et === ErwerbsArt.JA_NICHT_SELBST_MINI
  ) {
    const werbekostenpauschale = bestimmeWerbekostenpauschale(
      persoenlicheDaten.wahrscheinlichesGeburtsDatum,
    );
    ek_vor_copy = Math.max(ek_vor_copy - werbekostenpauschale, 0);
  }
  elterngeldbasis = berechneBasiselterngeld(ek_vor_copy);
  ersatzrate_ausgabe = bestimmeErsatzrate(ek_vor_copy);
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

function determineDeadlineForGeschwisterbonus(
  geschwister: Kind[],
  geburtsdatum: Date,
): Date | null {
  return (
    [
      ende_bonus_u3(geschwister),
      ende_bonus_u6(geschwister),
      ende_bonus_u14(geschwister),
    ]
      .filter((date) => date !== undefined)
      .filter((date) => date >= geburtsdatum)
      .toSorted(compareDateByLatestOrder)[0] ?? null
  );
}

function ende_bonus_u6(geschwister: Kind[]): Date | undefined {
  const zweitjuengstesGeschwisterkind = findNthLastBornChild(geschwister, 2);

  return zweitjuengstesGeschwisterkind
    ? ende_bonus(zweitjuengstesGeschwisterkind.geburtsdatum, 6)
    : undefined;
}

function ende_bonus_u14(geschwister: Kind[]): Date | undefined {
  const geschwisterMitBehinderung = geschwister.filter(
    (kind) => kind.istBehindert,
  );

  const juengstesGeschwisterkindMitBehinderung = findNthLastBornChild(
    geschwisterMitBehinderung,
    1,
  );

  return juengstesGeschwisterkindMitBehinderung
    ? ende_bonus(juengstesGeschwisterkindMitBehinderung.geburtsdatum, 14)
    : undefined;
}

function ende_bonus_u3(geschwister: Kind[]): Date | undefined {
  const juengstesGeschwisterkind = findNthLastBornChild(geschwister, 1);

  return juengstesGeschwisterkind
    ? ende_bonus(juengstesGeschwisterkind.geburtsdatum, 3)
    : undefined;
}

/**
 * The returned date is the day till which (inclusive) the bonus will be
 * payed. The bonus will be payed out till the Lebensmonat within which this
 * date is within. In practice, Elterngeld will be transferred somewhen within
 * a Lebensmonat.
 */
function ende_bonus(
  geburtstagDesGeschwisterkinds: Date,
  maximalesAlterInJahren: number,
): Date {
  return subDays(
    addYears(geburtstagDesGeschwisterkinds, maximalesAlterInJahren),
    1,
  );
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
  const { describe, it, test, expect } = import.meta.vitest;

  describe("Elterngeld-Zwischenergebnis-Algorithmus", () => {
    describe("should calculate ende bonus u3", () => {
      it("ohne geschwister", () => {
        const geschwister: Kind[] = [];

        const date = ende_bonus_u3(geschwister);

        expect(date).toBeUndefined();
      });

      test.each([
        [new Date("2020-02-14"), new Date("2023-02-13")],
        [new Date("2020-02-01"), new Date("2023-01-31")],
        [new Date("2020-01-01"), new Date("2022-12-31")],
        [new Date("2020-03-01"), new Date("2023-02-28")],
        [new Date("2021-03-01"), new Date("2024-02-29")],
      ])(
        "when geburt of sister is %s, then ende u3 is %s",
        (geburtGeschw1: Date, endeU3: Date) => {
          const geschwister: Kind[] = [{ geburtsdatum: geburtGeschw1 }];

          const date = ende_bonus_u3(geschwister);

          expect(date).toEqual(endeU3);
        },
      );

      test.each([
        [
          new Date("2020-02-14"),
          new Date("1999-02-14"),
          new Date("2023-02-13"),
        ],
        [
          new Date("1999-02-14"),
          new Date("2020-02-14"),
          new Date("2023-02-13"),
        ],
        [
          new Date("2020-02-14"),
          new Date("2020-02-14"),
          new Date("2023-02-13"),
        ],
        [
          new Date("2020-02-14"),
          new Date("2020-02-15"),
          new Date("2023-02-14"),
        ],
        [
          new Date("2020-02-14"),
          new Date("2020-03-14"),
          new Date("2023-03-13"),
        ],
      ])(
        "when geburt of child is %s, sister is %s and brother is %s, then ende u3 is %s",
        (geburtGeschw1: Date, geburtGeschw2: Date, endeU3: Date) => {
          const geschwister: Kind[] = [
            { geburtsdatum: geburtGeschw1 },
            { geburtsdatum: geburtGeschw2 },
          ];

          const date = ende_bonus_u3(geschwister);

          expect(date).toEqual(endeU3);
        },
      );
    });

    describe("should calculate ende bonus u14", () => {
      it("ohne geschwister", () => {
        const geschwister: Kind[] = [];

        const date = ende_bonus_u14(geschwister);

        expect(date).toBeUndefined();
      });

      it("is undefined if there is no Geschwisterkind with Behinderung", () => {
        const geschwister: Kind[] = [
          { geburtsdatum: new Date(), istBehindert: false },
          { geburtsdatum: new Date(), istBehindert: false },
        ];

        const date = ende_bonus_u14(geschwister);

        expect(date).toBeUndefined();
      });

      test.each([
        [new Date("2020-02-14"), new Date("2034-02-13")],
        [new Date("2020-02-01"), new Date("2034-01-31")],
        [new Date("2020-01-01"), new Date("2033-12-31")],
        [new Date("2020-03-01"), new Date("2034-02-28")],
        [new Date("2022-03-01"), new Date("2036-02-29")],
      ])(
        "when geburt of sister is %s and ist behindert, then ende u14 is %s",
        (geburtGeschw1: Date, endeU14: Date) => {
          const geschwister: Kind[] = [
            {
              geburtsdatum: geburtGeschw1,
              istBehindert: true,
            },
          ];

          const date = ende_bonus_u14(geschwister);

          expect(date).toEqual(endeU14);
        },
      );

      test.each([
        [
          new Date("2009-01-14"),
          true,
          new Date("2008-01-14"),
          true,
          new Date("2023-01-13"),
        ],
        [
          new Date("2009-01-14"),
          true,
          new Date("2009-01-14"),
          false,
          new Date("2023-01-13"),
        ],
        [
          new Date("2009-01-01"),
          true,
          new Date("2009-01-14"),
          true,
          new Date("2023-01-13"),
        ],
        [
          new Date("2007-01-03"),
          true,
          new Date("2009-01-03"),
          true,
          new Date("2023-01-02"),
        ],
        [
          new Date("2009-01-31"),
          true,
          new Date("2010-01-31"),
          true,
          new Date("2024-01-30"),
        ],
        [
          new Date("2009-02-28"),
          true,
          new Date("1980-02-28"),
          true,
          new Date("2023-02-27"),
        ],
        [
          new Date("2010-02-28"),
          true,
          new Date("2010-02-28"),
          true,
          new Date("2024-02-27"),
        ],
      ])(
        "when geburt of sister is %s and istBehindert: %s and brother is %s and istBehindert: %s, then ende u14 is %s",
        (
          geburtGeschw1: Date,
          geschw1IstBehindert: boolean,
          geburtGeschw2: Date,
          geschw2IstBehindert: boolean,
          endeU14: Date,
        ) => {
          const geschwister: Kind[] = [
            {
              geburtsdatum: geburtGeschw1,
              istBehindert: geschw1IstBehindert,
            },
            {
              geburtsdatum: geburtGeschw2,
              istBehindert: geschw2IstBehindert,
            },
          ];

          const date = ende_bonus_u14(geschwister);

          expect(date).toEqual(endeU14);
        },
      );
    });

    describe("should calculate ende bonus u6", () => {
      it("ohne geschwister", () => {
        const geschwister: Kind[] = [];

        const date = ende_bonus_u6(geschwister);

        expect(date).toBeUndefined();
      });

      test.each([
        [new Date("2020-02-14"), new Date("2026-02-13")],
        [new Date("2020-02-01"), new Date("2026-01-31")],
        [new Date("2020-01-01"), new Date("2025-12-31")],
        [new Date("2020-03-01"), new Date("2026-02-28")],
        [new Date("2022-03-01"), new Date("2028-02-29")],
      ])(
        "when geburt of sister is %s, then ende u6 is %s",
        (geburtGeschw1: Date, endeU6: Date) => {
          const geschwister: Kind[] = [
            { geburtsdatum: geburtGeschw1 },
            { geburtsdatum: geburtGeschw1 },
          ];

          const date = ende_bonus_u6(geschwister);

          expect(date).toEqual(endeU6);
        },
      );

      test.each([
        [
          new Date("2017-01-14"),
          new Date("2017-01-14"),
          new Date("2016-01-14"),
          new Date("2023-01-13"),
        ],
        [
          new Date("2017-01-01"),
          new Date("2017-01-14"),
          new Date("2017-01-14"),
          new Date("2023-01-13"),
        ],
        [
          new Date("2015-01-03"),
          new Date("2017-01-03"),
          new Date("2017-01-03"),
          new Date("2023-01-02"),
        ],
        [
          new Date("2015-01-03"),
          new Date("2015-01-03"),
          new Date("2017-01-03"),
          new Date("2021-01-02"),
        ],
        [
          new Date("2017-01-31"),
          new Date("2018-01-31"),
          new Date("2018-01-31"),
          new Date("2024-01-30"),
        ],
        [
          new Date("2017-02-28"),
          new Date("2017-02-28"),
          new Date("1980-02-28"),
          new Date("2023-02-27"),
        ],
        [
          new Date("2018-02-28"),
          new Date("2018-02-28"),
          new Date("2018-02-28"),
          new Date("2024-02-27"),
        ],
        [
          new Date("2024-01-03"),
          new Date("2026-01-03"),
          new Date("2027-01-03"),
          new Date("2032-01-02"),
        ],
      ])(
        "when geburt of sisters are %s and %s and brother is %s, then ende u6 is %s",
        (
          geburtGeschw1: Date,
          geburtGeschw2: Date,
          geburtGeschw3: Date,
          endeU6: Date,
        ) => {
          const geschwister: Kind[] = [
            { geburtsdatum: geburtGeschw1 },
            { geburtsdatum: geburtGeschw2 },
            { geburtsdatum: geburtGeschw3 },
          ];

          const date = ende_bonus_u6(geschwister);

          expect(date).toEqual(endeU6);
        },
      );
    });

    describe("determine deadline for Geschwisterbonus", () => {
      it("returns null if no Geschwister", () => {
        const geschwister: Kind[] = [];
        const geburtsdatum = new Date();

        const deadline = determineDeadlineForGeschwisterbonus(
          geschwister,
          geburtsdatum,
        );

        expect(deadline).toBeNull();
      });

      it("returns null if all Geschwister are too old for any bonus", () => {
        const geschwister = [
          { geburtsdatum: new Date("2016-01-02") },
          { geburtsdatum: new Date("2013-01-02") },
          { geburtsdatum: new Date("2005-01-02"), istBehindert: true },
        ];
        const geburtsdatum = new Date("2020-01-01");

        const deadline = determineDeadlineForGeschwisterbonus(
          geschwister,
          geburtsdatum,
        );

        expect(deadline).toBeNull();
      });

      it("uses the only deadline that ends after the Geburtstag", () => {
        const geschwister = [
          { geburtsdatum: new Date("2016-01-02") },
          { geburtsdatum: new Date("2015-01-02") },
          { geburtsdatum: new Date("2005-01-02"), istBehindert: true },
        ];
        const geburtsdatum = new Date("2020-01-01");

        const deadline = determineDeadlineForGeschwisterbonus(
          geschwister,
          geburtsdatum,
        );

        expect(deadline).toEqual(new Date("2021-01-01"));
      });

      it("uses the latest deadline that lasts the longest", () => {
        const geschwister = [
          { geburtsdatum: new Date("2017-01-02") },
          { geburtsdatum: new Date("2015-01-02") },
          { geburtsdatum: new Date("2008-01-02"), istBehindert: true },
        ];
        const geburtsdatum = new Date("2020-01-01");

        const deadline = determineDeadlineForGeschwisterbonus(
          geschwister,
          geburtsdatum,
        );

        expect(deadline).toEqual(new Date("2022-01-01"));
      });
    });

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
