import {
  MUTTERSCHUTZ_DAUER_GESAMT_STANDARD,
  MUTTERSCHUTZ_DAUER_GESAMT_VERLAENGERT,
  MUTTERSCHUTZ_TAGE_NACH_GEBURT_STANDARD,
  MUTTERSCHUTZ_TAGE_NACH_GEBURT_VERLAENGERT,
  MUTTERSCHUTZ_TAGE_VOR_GEBURT_STANDARD,
  TAG_IN_MS,
} from "./constants";

export type Brand<K, T> = K & { readonly __brand: T };

export type Mutterschutz = Brand<
  {
    readonly startdatum: Date;
    readonly enddatum: Date;
  },
  "Mutterschutz"
>;

export enum VerlaengerungsGrund {
  UNSPEZIFISCHER_VERLAENGERUNGSGRUND = "UNSPEZIFISCHER_VERLAENGERUNGSGRUND",
  FRUEHGEBURT = "FRUEHGEBURT",
  MEHRLINGE = "MEHRLINGE",
  BEHINDERUNG = "BEHINDERUNG",
}

/**
 * Berechnet den Beginn und das Ende der Mutterschutzfrist.
 * Grundlage hierfür ist § 3 MuSchuG.
 *
 * @param {Date} errechneterGeburtstermin - Der errechnete Geburtstermin des Kindes.
 * @param {Date} [tatsaechlichesGeburtsdatum] - Für den Fall der erfolgten Geburt optional das tatsächliche Geburtsdatum.
 * @param {VerlaengerungsGrund} [verlaengerungsGrund] - Optional ein Verlängerungsgrund für den Mutterschutz.
 * @returns {Mutterschutz} Ein Objekt, das das Start- (`startdatum`) und Enddatum (`enddatum`) des Mutterschutzes enthält.
 */
export function berechneMutterschutz(
  errechneterGeburtstermin: Date,
  tatsaechlichesGeburtsdatum?: Date,
  verlaengerungsGrund?: VerlaengerungsGrund,
): Mutterschutz {
  const startdatum = berechneterMutterschutzBeginn(
    errechneterGeburtstermin,
    tatsaechlichesGeburtsdatum,
  );
  const enddatum = berechnetesMutterschutzEnde(
    errechneterGeburtstermin,
    tatsaechlichesGeburtsdatum,
    startdatum,
    verlaengerungsGrund,
  );

  if (enddatum <= startdatum) throw new Error("Invalid Range");

  return { startdatum, enddatum } as Mutterschutz;
}

/**
 * Berechnet den Startzeitpunkt des Mutterschutzes (6 Wochen vor dem errechneten Geburtstermin) oder tatsächliches Geburtsdatun, falls dieses vor dem errechneten Termin liegt.
 * Grundlage für den Beginn des Mutterschutzes ist § 3 Abs. 1 MuSchG.
 */
const berechneterMutterschutzBeginn = (
  errechneterGeburtstermin: Date,
  tatsaechlichesGeburtsdatum?: Date,
): Date => {
  const startFromCalculatedBirthdate =
    errechneterGeburtstermin.getTime() -
    MUTTERSCHUTZ_TAGE_VOR_GEBURT_STANDARD * TAG_IN_MS;
  return new Date(
    tatsaechlichesGeburtsdatum
      ? Math.min(
          startFromCalculatedBirthdate,
          tatsaechlichesGeburtsdatum.getTime(),
        )
      : startFromCalculatedBirthdate,
  );
};

/**
 * Berechnet den Endzeitpunkt des Mutterschutzes (zwischen 8 und 12 Wochen).
 * Grundlage für das Ende des Mutterschutzes ist § 3 Abs. 2 MuSchG.
 */
const berechnetesMutterschutzEnde = (
  errechneterGeburtstermin: Date,
  tatsaechlichesGeburtsdatum: Date | undefined,
  startdatum: Date,
  verlaengerungsGrund: VerlaengerungsGrund | undefined,
): Date => {
  const verwendetesGeburtsdatum =
    tatsaechlichesGeburtsdatum ?? errechneterGeburtstermin;

  return verlaengerungsGrund
    ? getVerlaengertesEnde(verwendetesGeburtsdatum, startdatum)
    : getStandardEnde(verwendetesGeburtsdatum, startdatum);
};

/**
 * Berechnet den Standard-Endzeitpunkt (mindestens 8 Wochen nach Geburt und mindestens 14 Wochen nach Beginn des Mutterschutzes).
 * Grundlage für das standardgemäße Ende des Mutterschutzes ist § 3 Abs. 2 Satz 1 MuSchG sowie
 * für die Verlängerung der Schutzfrist bei Geburten vor dem ET § 3 Abs. 2 Satz 3 MuSchG.
 */
const getStandardEnde = (
  geburtsdatum: Date,
  beginnMutterschutz: Date,
): Date => {
  const endFromBirth =
    geburtsdatum.getTime() + MUTTERSCHUTZ_TAGE_NACH_GEBURT_STANDARD * TAG_IN_MS;
  const endFromStart =
    beginnMutterschutz.getTime() +
    MUTTERSCHUTZ_DAUER_GESAMT_STANDARD * TAG_IN_MS;
  return new Date(Math.max(endFromBirth, endFromStart));
};

/**
 * Berechnet das verlängerte Ende des Mutterschutzes (12 Wochen nach Geburt).
 * Grundlage für das verlängerte Ende des Mutterschutzes sind die Verlängerungsgründe
 * in § 3 Abs. 2 Satz 2 MuSchG sowie für die Verlängerung der Schutzfrist bei Geburten
 * vor dem ET § 3 Abs. 2 Satz 3 MuSchG.
 */
const getVerlaengertesEnde = (
  geburtsdatum: Date,
  beginnMutterschutz: Date,
): Date => {
  const endFromBirth =
    geburtsdatum.getTime() +
    MUTTERSCHUTZ_TAGE_NACH_GEBURT_VERLAENGERT * TAG_IN_MS;
  const endFromStart =
    beginnMutterschutz.getTime() +
    MUTTERSCHUTZ_DAUER_GESAMT_VERLAENGERT * TAG_IN_MS;
  return new Date(Math.max(endFromBirth, endFromStart));
};

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  const createDate = (datumsString: string) => new Date(datumsString);

  describe("berechneMutterschutz", () => {
    test.each(mutterschutzTestfaelle)(
      "$testfall",
      ({
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
        verlaengerungsGrund,
        erwartetesStartdatum,
        erwartetesEnddatum,
      }) => {
        const { startdatum, enddatum } = berechneMutterschutz(
          createDate(errechneterGeburtstermin),
          tatsaechlichesGeburtsdatum
            ? createDate(tatsaechlichesGeburtsdatum)
            : undefined,
          verlaengerungsGrund,
        );

        expect(startdatum).toEqual(createDate(erwartetesStartdatum));
        expect(enddatum).toEqual(createDate(erwartetesEnddatum));
      },
    );
  });
}

interface MutterschutzTestfall {
  testfall: string;
  errechneterGeburtstermin: string;
  tatsaechlichesGeburtsdatum?: string;
  verlaengerungsGrund?: VerlaengerungsGrund;
  erwartetesStartdatum: string;
  erwartetesEnddatum: string;
}

const mutterschutzTestfaelle: MutterschutzTestfall[] = [
  {
    testfall:
      "Standard nach § 3 MuSchG (Ungeboren) - 6 Wochen vor ET / 8 Wochen nach ET",
    errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
    erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
    erwartetesEnddatum: "2025-12-10T00:00:00.000Z",
  },
  {
    testfall:
      "Standard nach § 3 Abs. 2 Satz 1 (Geburt nach ET) - Schutzfrist wird nach hinten verschoben",
    errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
    tatsaechlichesGeburtsdatum: "2025-10-16T00:00:00.000Z",
    erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
    erwartetesEnddatum: "2025-12-11T00:00:00.000Z",
  },
  {
    testfall:
      "Standard nach § 3 Abs. 2 Satz 3 (Geburt vor ET) - Gesamtdauer von 14 Wochen gilt",
    errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
    tatsaechlichesGeburtsdatum: "2025-10-14T00:00:00.000Z",
    erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
    erwartetesEnddatum: "2025-12-10T00:00:00.000Z",
  },
  {
    testfall:
      "Frühgeburt nach § 3 Abs. 2 Satz 2 Nummer 1 MuSchG (Geburt mehr als 6 Wochen vor ET) - Startdatum entspricht Geburtsdatum und Gesamtdauer von 18 Wochen gilt",
    errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
    tatsaechlichesGeburtsdatum: "2025-09-02T00:00:00.000Z",
    verlaengerungsGrund: VerlaengerungsGrund.FRUEHGEBURT,
    erwartetesStartdatum: "2025-09-02T00:00:00.000Z",
    erwartetesEnddatum: "2026-01-06T00:00:00.000Z",
  },
  {
    testfall:
      "Mehrlinge nach § 3 Abs. 2 Satz 2 Nummer 2 MuSchG (ungeboren) - Verlängerte Schutzfrist von 12 Wochen nach ET",
    errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
    verlaengerungsGrund: VerlaengerungsGrund.MEHRLINGE,
    erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
    erwartetesEnddatum: "2026-01-07T00:00:00.000Z",
  },
  {
    testfall:
      "Mehrlinge nach § 3 Abs. 2 Satz 2 Nummer 2 MuSchG (Geburt vor ET) - Gesamtdauer von 18 Wochen gilt",
    errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
    tatsaechlichesGeburtsdatum: "2025-10-14T00:00:00.000Z",
    verlaengerungsGrund: VerlaengerungsGrund.MEHRLINGE,
    erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
    erwartetesEnddatum: "2026-01-07T00:00:00.000Z",
  },
  {
    testfall:
      "Behinderung nach § 3 Abs. 2 Satz 2 Nummer 3 MuSchG (Geburt nach ET) - Verlängerte Schutzfrist wird nach hinten verschoben",
    errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
    tatsaechlichesGeburtsdatum: "2025-10-16T00:00:00.000Z",
    verlaengerungsGrund: VerlaengerungsGrund.BEHINDERUNG,
    erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
    erwartetesEnddatum: "2026-01-08T00:00:00.000Z",
  },
];
