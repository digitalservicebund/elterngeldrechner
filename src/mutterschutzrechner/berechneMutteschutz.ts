export type Mutterschutz = {
  readonly startdatum: Date;
  readonly enddatum: Date;
};

/**
 * Berechnet den Beginn und das Ende der Mutterschutzfrist.
 * Grundlage hierfür ist § 3 MuSchuG.
 *
 * @param {Date} errechneterGeburtstermin - Der errechnete Geburtstermin des Kindes.
 * @param {Date} [tatsaechlichesGeburtsdatum] - Für den Fall der erfolgten Geburt optional das tatsächliche Geburtsdatum.
 * @param {VerlaengerungsGrund} [hatVerlaengerungsGrund] - Optional, falls ein Verlängerungsgrund für den Mutterschutz vorliegt.
 * @returns {Mutterschutz} Ein Objekt, das das Start- (`startdatum`) und Enddatum (`enddatum`) des Mutterschutzes enthält.
 */
export function berechneMutterschutz(
  errechneterGeburtstermin: Date,
  tatsaechlichesGeburtsdatum?: Date,
  hatVerlaengerungsGrund?: boolean,
): Mutterschutz {
  const startdatum = berechneterMutterschutzBeginn(
    errechneterGeburtstermin,
    tatsaechlichesGeburtsdatum,
  );
  const enddatum = berechnetesMutterschutzEnde(
    errechneterGeburtstermin,
    tatsaechlichesGeburtsdatum,
    startdatum,
    hatVerlaengerungsGrund,
  );

  if (enddatum <= startdatum) throw new Error("Invalid Range");

  return { startdatum, enddatum };
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
    errechneterGeburtstermin.getTime() - weeks(6);
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
  hatVerlaengerungsGrund: boolean | undefined,
): Date => {
  const verwendetesGeburtsdatum =
    tatsaechlichesGeburtsdatum ?? errechneterGeburtstermin;

  return hatVerlaengerungsGrund
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
  const endFromBirth = geburtsdatum.getTime() + weeks(8);
  const endFromStart = beginnMutterschutz.getTime() + weeks(14);
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
  const endFromBirth = geburtsdatum.getTime() + weeks(12);
  const endFromStart = beginnMutterschutz.getTime() + weeks(18);
  return new Date(Math.max(endFromBirth, endFromStart));
};

const weeks = (value: number) => value * 7 * 24 * 60 * 60 * 1000;

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  describe("berechneMutterschutz", () => {
    test.each(mutterschutzTestfaelle)("$beschreibung", (testfall: Testfall) => {
      const {
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
        hatVerlaengerungsGrund,
        erwartetesStartdatum,
        erwartetesEnddatum,
      } = testfall;

      const { startdatum, enddatum } = berechneMutterschutz(
        createDate(errechneterGeburtstermin),
        createDate(tatsaechlichesGeburtsdatum),
        hatVerlaengerungsGrund,
      );

      expect(startdatum).toEqual(createDate(erwartetesStartdatum));
      expect(enddatum).toEqual(createDate(erwartetesEnddatum));
    });
  });

  const mutterschutzTestfaelle: Testfall[] = [
    {
      beschreibung:
        "Standard nach § 3 MuSchG (Ungeboren) - 6 Wochen vor ET / 8 Wochen nach ET",
      errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
      erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
      erwartetesEnddatum: "2025-12-10T00:00:00.000Z",
    },
    {
      beschreibung:
        "Standard nach § 3 Abs. 2 Satz 1 (Geburt nach ET) - Schutzfrist wird nach hinten verschoben",
      errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
      tatsaechlichesGeburtsdatum: "2025-10-16T00:00:00.000Z",
      erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
      erwartetesEnddatum: "2025-12-11T00:00:00.000Z",
    },
    {
      beschreibung:
        "Standard nach § 3 Abs. 2 Satz 3 (Geburt vor ET) - Gesamtdauer von 14 Wochen gilt",
      errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
      tatsaechlichesGeburtsdatum: "2025-10-14T00:00:00.000Z",
      erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
      erwartetesEnddatum: "2025-12-10T00:00:00.000Z",
    },
    {
      beschreibung:
        "Z.B. Frühgeburt nach § 3 Abs. 2 Satz 2 Nummer 1 MuSchG (Geburt mehr als 6 Wochen vor ET) - Startdatum entspricht Geburtsdatum und Gesamtdauer von 18 Wochen gilt",
      errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
      tatsaechlichesGeburtsdatum: "2025-09-02T00:00:00.000Z",
      hatVerlaengerungsGrund: true,
      erwartetesStartdatum: "2025-09-02T00:00:00.000Z",
      erwartetesEnddatum: "2026-01-06T00:00:00.000Z",
    },
    {
      beschreibung:
        "Z.B. Mehrlinge nach § 3 Abs. 2 Satz 2 Nummer 2 MuSchG (ungeboren) - Verlängerte Schutzfrist von 12 Wochen nach ET",
      errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
      hatVerlaengerungsGrund: true,
      erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
      erwartetesEnddatum: "2026-01-07T00:00:00.000Z",
    },
    {
      beschreibung:
        "Z.B. Mehrlinge nach § 3 Abs. 2 Satz 2 Nummer 2 MuSchG (Geburt vor ET) - Gesamtdauer von 18 Wochen gilt",
      errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
      tatsaechlichesGeburtsdatum: "2025-10-14T00:00:00.000Z",
      hatVerlaengerungsGrund: true,
      erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
      erwartetesEnddatum: "2026-01-07T00:00:00.000Z",
    },
    {
      beschreibung:
        "Z.B. Behinderung nach § 3 Abs. 2 Satz 2 Nummer 3 MuSchG (Geburt nach ET) - Verlängerte Schutzfrist wird nach hinten verschoben",
      errechneterGeburtstermin: "2025-10-15T00:00:00.000Z",
      tatsaechlichesGeburtsdatum: "2025-10-16T00:00:00.000Z",
      hatVerlaengerungsGrund: true,
      erwartetesStartdatum: "2025-09-03T00:00:00.000Z",
      erwartetesEnddatum: "2026-01-08T00:00:00.000Z",
    },
  ];

  type Testfall = {
    beschreibung: string;
    errechneterGeburtstermin: string;
    tatsaechlichesGeburtsdatum?: string;
    hatVerlaengerungsGrund?: boolean;
    erwartetesStartdatum: string;
    erwartetesEnddatum: string;
  };

  type NonUndefined<T> = T extends undefined ? never : T;

  const createDate = <T extends string | undefined>(
    datumsString: T,
  ): T extends undefined ? undefined : Date => {
    if (datumsString) {
      return new Date(datumsString as NonUndefined<T>) as T extends undefined
        ? undefined
        : Date;
    } else {
      return undefined as T extends undefined ? undefined : Date;
    }
  };
}
