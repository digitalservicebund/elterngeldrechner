import {
  MUTTERSCHUTZ_DAUER_GESAMT_STANDARD,
  MUTTERSCHUTZ_TAGE_NACH_GEBURT_STANDARD,
  MUTTERSCHUTZ_TAGE_NACH_GEBURT_VERLAENGERT,
  MUTTERSCHUTZ_TAGE_VOR_GEBURT_STANDARD,
  TAGE_IN_MS,
} from "./constants";

export type Mutterschutz = {
  readonly startdatum: Date;
  readonly enddatum: Date;
};

export enum VerlaengerungsGrund {
  UNSPEZIFISCHER_VERLAENGERUNGSGRUND = "UNSPEZIFISCHER_VERLAENGERUNGSGRUND",
  FRUEHGEBURT = "FRUEHGEBURT",
  MEHRLINGE = "MEHRLINGE",
  BEHINDERUNG = "BEHINDERUNG",
}

/**
 * Berechnet den Beginn und das Ende der Mutterschutzfrist.
 *
 * @param {Date} errechneterGeburtstermin - Der errechnete Geburtstermin des Kindes.
 * @param {Date} [tatsaechlichesGeburtsdatum] - Für den Fall der erfolgten Geburt optional das tatsächliche Geburtsdatum.
 * @param {VerlaengerungsGrund} [hatVerlaengerungsGrund] - Optional ein Verlängerungsgrund für den Mutterschutz.
 * @returns {Mutterschutz} Ein Objekt, das das Start- (`startdatum`) und Enddatum (`enddatum`) des Mutterschutzes enthält.
 */
export function berechneMutterschutz(
  errechneterGeburtstermin: Date,
  tatsaechlichesGeburtsdatum?: Date,
  verlaengerungsGrund?: VerlaengerungsGrund,
): Mutterschutz {
  const startdatum = berechneterMutterschutzBeginn(errechneterGeburtstermin);
  const enddatum = berechnetesMutterschutzEnde(
    errechneterGeburtstermin,
    tatsaechlichesGeburtsdatum,
    startdatum,
    verlaengerungsGrund,
  );
  return { startdatum, enddatum };
}

/**
 * Berechnet den Startzeitpunkt des Mutterschutzes (6 Wochen vor dem errechneten Geburtstermin).
 */
const berechneterMutterschutzBeginn = (
  errechneterGeburtstermin: Date,
): Date => {
  const timestamp =
    errechneterGeburtstermin.getTime() -
    MUTTERSCHUTZ_TAGE_VOR_GEBURT_STANDARD * TAGE_IN_MS;
  return new Date(timestamp);
};

/**
 * Berechnet den Endzeitpunkt des Mutterschutzes (zwischen 8 und 12 Wochen).
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
    ? getVerlaengertesEnde(verwendetesGeburtsdatum)
    : getStandardEnde(verwendetesGeburtsdatum, startdatum);
};

/**
 * Berechnet den Standard-Endzeitpunkt (mindestens 8 Wochen nach Geburt und mindestens 14 Wochen nach Beginn des Mutterschutzes).
 */
const getStandardEnde = (
  geburtsdatum: Date,
  beginnMutterschutz: Date,
): Date => {
  const endFromBirth =
    geburtsdatum.getTime() +
    MUTTERSCHUTZ_TAGE_NACH_GEBURT_STANDARD * TAGE_IN_MS;
  const endFromStart =
    beginnMutterschutz.getTime() +
    MUTTERSCHUTZ_DAUER_GESAMT_STANDARD * TAGE_IN_MS;
  return new Date(Math.max(endFromBirth, endFromStart));
};

/**
 * Berechnet das verlängerte Ende des Mutterschutzes (12 Wochen nach Geburt).
 */
const getVerlaengertesEnde = (geburtsdatum: Date): Date => {
  const timestamp =
    geburtsdatum.getTime() +
    MUTTERSCHUTZ_TAGE_NACH_GEBURT_VERLAENGERT * TAGE_IN_MS;
  return new Date(timestamp);
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("berechneMutterschutz", () => {
    it("returns the standard Mutterschutz (42 days before, 56 days after) before the actual birth or when birthdate undefined", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2025-12-10T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });

    it("returns the standard start date and an end date of 56 days after birth when actual birthdate is known and after preliminary date", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");
      const tatsaechlichesGeburtsdatum = new Date("2025-10-16T00:00:00.000Z");

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2025-12-11T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });

    it("returns the standard start date and the a longer end date when actual birthdate is known and before preliminary date", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");
      const tatsaechlichesGeburtsdatum = new Date("2025-10-14T00:00:00.000Z");

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2025-12-10T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });

    it("returns the standard start date and the end date of the additonal mutterschutz when child is considered a frühgeburt", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");
      const tatsaechlichesGeburtsdatum = new Date("2025-10-14T00:00:00.000Z");
      const verlaengerungsGrund = VerlaengerungsGrund.FRUEHGEBURT;

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
        verlaengerungsGrund,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2026-01-06T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });

    it("returns the standard start date and the end date of the additonal mutterschutz when more than one child was born", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");
      const tatsaechlichesGeburtsdatum = new Date("2025-10-16T00:00:00.000Z");
      const verlaengerungsGrund = VerlaengerungsGrund.MEHRLINGE;

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
        verlaengerungsGrund,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2026-01-08T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });

    it("returns the standard start date and the end date of the additonal mutterschutz when more than one child will be born", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");
      const verlaengerungsGrund = VerlaengerungsGrund.MEHRLINGE;

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
        undefined,
        verlaengerungsGrund,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2026-01-07T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });

    it("returns the standard start date and the end date of the additonal mutterschutz when child has handicap", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");
      const tatsaechlichesGeburtsdatum = new Date("2025-10-15T00:00:00.000Z");
      const verlaengerungsGrund = VerlaengerungsGrund.BEHINDERUNG;

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
        verlaengerungsGrund,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2026-01-07T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });

    it("returns the standard start date and the end date of the additonal mutterschutz when reason for longer period is not specified", () => {
      const errechneterGeburtstermin = new Date("2025-10-15T00:00:00.000Z");
      const tatsaechlichesGeburtsdatum = new Date("2025-10-18T00:00:00.000Z");
      const verlaengerungsGrund =
        VerlaengerungsGrund.UNSPEZIFISCHER_VERLAENGERUNGSGRUND;

      const { startdatum, enddatum } = berechneMutterschutz(
        errechneterGeburtstermin,
        tatsaechlichesGeburtsdatum,
        verlaengerungsGrund,
      );

      const expectedFrom = new Date("2025-09-03T00:00:00.000Z");
      const expectedTo = new Date("2026-01-10T00:00:00.000Z");

      expect(startdatum).toEqual(expectedFrom);
      expect(enddatum).toEqual(expectedTo);
    });
  });
}
