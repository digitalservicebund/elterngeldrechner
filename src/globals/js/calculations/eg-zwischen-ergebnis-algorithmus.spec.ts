import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import { Kind } from "./model";

describe("eg-zwischen-ergebnis-algorithmus", () => {
  describe("should calculate ende bonus u2", () => {
    describe.each([
      ["2023-01-01", "2022-12-31"],
      ["2023-01-02", "2023-01-01"],
      ["2022-01-31", "2022-01-30"],
      ["2022-03-01", "2022-02-28"],
      ["2020-03-01", "2020-02-29"],
    ])(
      "when geburt of child is %p, then ende u2 is %p",
      (geburtIsoDate: string, endeU2IsoDate: string) => {
        it("ohne geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u2(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU2IsoDate);
        });
      },
    );

    describe.each([
      ["2023-01-01", "2020-01-14", "2023-01-31"],
      ["2023-01-05", "2020-01-14", "2023-02-04"],
      ["2023-01-01", "2020-01-03", "2023-01-31"],
      ["2023-01-01", "2020-01-02", "2023-01-31"],
      ["2023-01-01", "2020-01-01", "2023-01-31"],
      ["2023-01-01", "2019-12-31", "2022-12-31"],
      ["2023-01-01", "2019-12-30", "2022-12-31"],
      ["2023-01-31", "2019-12-30", "2023-01-30"],
      ["2023-01-28", "2020-01-28", "2023-02-27"],
      ["2023-01-29", "2020-01-29", "2023-02-28"],
      ["2023-01-30", "2020-01-30", "2023-02-28"],
      ["2023-01-31", "2020-01-31", "2023-02-28"],
      ["2024-01-31", "2021-01-31", "2024-02-29"],
      ["2023-02-28", "2020-02-28", "2023-03-27"],
      ["2024-02-29", "2021-02-28", "2024-02-28"],
      ["2023-01-05", "2023-01-14", "2023-01-04"],
      ["2023-01-01", "2020-12-31", "2023-12-31"],
      ["2023-01-01", "2022-06-01", "2025-06-30"],
      ["2023-02-01", "2022-07-01", "2025-07-31"],
      ["2023-03-01", "2022-08-01", "2025-08-31"],
      ["2023-01-30", "2022-01-30", "2025-02-28"],
      ["2023-01-30", "2021-01-30", "2024-02-29"],
    ])(
      "when geburt of child is %p and sister is %p, then ende u2 is %p",
      (
        geburtIsoDate: string,
        geburtGeschw1IsoDate: string,
        endeU2IsoDate: string,
      ) => {
        it("mit geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
            {
              nummer: 2,
              geburtsdatum: DateTime.fromISO(geburtGeschw1IsoDate).toJSDate(),
              istBehindert: false,
            },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u2(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU2IsoDate);
        });
      },
    );

    describe.each([
      ["2023-01-01", "2020-01-14", "2019-01-14", "2023-01-31"],
      ["2023-01-05", "2020-01-01", "2020-01-14", "2023-02-04"],
      ["2023-01-01", "2018-01-03", "2020-01-03", "2023-01-31"],
      ["2024-01-31", "2020-01-31", "2021-01-31", "2024-02-29"],
      ["2023-02-28", "2020-02-28", "1980-02-28", "2023-03-27"],
      ["2024-02-29", "2021-02-28", "2021-02-28", "2024-02-28"],
      ["2023-01-05", "2023-04-01", "2025-04-01", "2023-01-04"],
    ])(
      "when geburt of child is %p, sister is %p and brother is %p, then ende u2 is %p",
      (
        geburtIsoDate: string,
        geburtGeschw1IsoDate: string,
        geburtGeschw2IsoDate: string,
        endeU2IsoDate: string,
      ) => {
        it("mit geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
            {
              nummer: 2,
              geburtsdatum: DateTime.fromISO(geburtGeschw1IsoDate).toJSDate(),
              istBehindert: false,
            },
            {
              nummer: 3,
              geburtsdatum: DateTime.fromISO(geburtGeschw2IsoDate).toJSDate(),
              istBehindert: false,
            },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u2(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU2IsoDate);
        });
      },
    );
  });

  describe("should calculate ende bonus u14", () => {
    describe.each([
      ["2023-01-01", "2022-12-31"],
      ["2023-01-02", "2023-01-01"],
      ["2022-01-31", "2022-01-30"],
      ["2022-03-01", "2022-02-28"],
      ["2020-03-01", "2020-02-29"],
    ])(
      "when geburt of child is %p, then ende u14 is %p",
      (geburtIsoDate: string, endeU14IsoDate: string) => {
        it("ohne geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u14(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU14IsoDate);
        });
      },
    );

    describe.each([
      ["2023-01-01", "2009-01-14", true, "2023-01-31"],
      ["2023-01-05", "2009-01-14", true, "2023-02-04"],
      ["2023-01-01", "2009-01-03", true, "2023-01-31"],
      ["2023-01-01", "2009-01-02", true, "2023-01-31"],
      ["2023-01-01", "2009-01-01", true, "2023-01-31"],
      ["2023-01-01", "2009-01-01", false, "2022-12-31"],
      ["2023-01-01", "2008-12-31", true, "2022-12-31"],
      ["2023-01-01", "2008-12-30", true, "2022-12-31"],
      ["2023-01-31", "2008-12-30", true, "2023-01-30"],
      ["2023-01-28", "2009-01-28", true, "2023-02-27"],
      ["2023-01-29", "2009-01-29", true, "2023-02-28"],
      ["2023-01-30", "2009-01-30", true, "2023-02-28"],
      ["2023-01-31", "2009-01-31", true, "2023-02-28"],
      ["2023-01-31", "2009-01-31", false, "2023-01-30"],
      ["2024-01-31", "2010-01-31", true, "2024-02-29"],
      ["2023-02-28", "2009-02-28", true, "2023-03-27"],
      ["2024-02-29", "2010-02-28", true, "2024-02-28"],
      ["2023-01-01", "2024-01-03", true, "2022-12-31"],
    ])(
      "when geburt of child is %p and sister is %p and istBehindert: %p, then ende u14 is %p",
      (
        geburtIsoDate: string,
        geburtGeschw1IsoDate: string,
        istBehindert: boolean,
        endeU14IsoDate: string,
      ) => {
        it("mit geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
            {
              nummer: 2,
              geburtsdatum: DateTime.fromISO(geburtGeschw1IsoDate).toJSDate(),
              istBehindert: istBehindert,
            },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u14(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU14IsoDate);
        });
      },
    );

    describe.each([
      ["2023-01-01", "2009-01-14", true, "2008-01-14", true, "2023-01-31"],
      ["2023-01-01", "2009-01-14", true, "2009-01-14", false, "2023-01-31"],
      ["2023-01-01", "2009-01-14", false, "2009-01-14", false, "2022-12-31"],
      ["2023-01-05", "2009-01-01", true, "2009-01-14", true, "2023-02-04"],
      ["2023-01-01", "2007-01-03", true, "2009-01-03", true, "2023-01-31"],
      ["2024-01-31", "2009-01-31", true, "2010-01-31", true, "2024-02-29"],
      ["2023-02-28", "2009-02-28", true, "1980-02-28", true, "2023-03-27"],
      ["2024-02-29", "2010-02-28", true, "2010-02-28", true, "2024-02-28"],
    ])(
      "when geburt of child is %p, sister is %p and istBehindert: %p and brother is %p and istBehindert: %p, then ende u14 is %p",
      (
        geburtIsoDate: string,
        geburtGeschw1IsoDate: string,
        geschw1IstBehindert: boolean,
        geburtGeschw2IsoDate: string,
        geschw2IstBehindert: boolean,
        endeU14IsoDate: string,
      ) => {
        it("mit geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
            {
              nummer: 2,
              geburtsdatum: DateTime.fromISO(geburtGeschw1IsoDate).toJSDate(),
              istBehindert: geschw1IstBehindert,
            },
            {
              nummer: 3,
              geburtsdatum: DateTime.fromISO(geburtGeschw2IsoDate).toJSDate(),
              istBehindert: geschw2IstBehindert,
            },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u14(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU14IsoDate);
        });
      },
    );
  });

  describe("should calculate ende bonus u6", () => {
    describe.each([
      ["2023-01-01", "2022-12-31"],
      ["2023-01-02", "2023-01-01"],
      ["2022-01-31", "2022-01-30"],
      ["2022-03-01", "2022-02-28"],
      ["2020-03-01", "2020-02-29"],
    ])(
      "when geburt of child is %p, then ende u6 is %p",
      (geburtIsoDate: string, endeU2IsoDate: string) => {
        it("ohne geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u6(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU2IsoDate);
        });
      },
    );

    describe.each([
      ["2023-01-01", "2017-01-14", "2023-01-31"],
      ["2023-01-05", "2017-01-14", "2023-02-04"],
      ["2023-01-01", "2017-01-03", "2023-01-31"],
      ["2023-01-01", "2017-01-02", "2023-01-31"],
      ["2023-01-01", "2017-01-01", "2023-01-31"],
      ["2023-01-01", "2016-12-31", "2022-12-31"],
      ["2023-01-01", "2016-12-30", "2022-12-31"],
      ["2023-01-31", "2016-12-30", "2023-01-30"],
      ["2023-01-28", "2017-01-28", "2023-02-27"],
      ["2023-01-29", "2017-01-29", "2023-02-28"],
      ["2023-01-30", "2017-01-30", "2023-02-28"],
      ["2023-01-31", "2017-01-31", "2023-02-28"],
      ["2024-01-31", "2018-01-31", "2024-02-29"],
      ["2023-02-28", "2017-02-28", "2023-03-27"],
      ["2024-02-29", "1018-02-28", "2024-02-28"],
    ])(
      "when geburt of child is %p and sister is %p, then ende u6 is %p",
      (
        geburtIsoDate: string,
        geburtGeschw1IsoDate: string,
        endeU6IsoDate: string,
      ) => {
        it("mit geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
            {
              nummer: 2,
              geburtsdatum: DateTime.fromISO(geburtGeschw1IsoDate).toJSDate(),
              istBehindert: false,
            },
            {
              nummer: 3,
              geburtsdatum: DateTime.fromISO(geburtGeschw1IsoDate).toJSDate(),
              istBehindert: false,
            },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u6(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU6IsoDate);
        });
      },
    );

    describe.each([
      ["2023-01-01", "2017-01-14", "2017-01-14", "2016-01-14", "2023-01-31"],
      ["2023-01-05", "2017-01-01", "2017-01-14", "2017-01-14", "2023-02-04"],
      ["2023-01-01", "2015-01-03", "2017-01-03", "2017-01-03", "2023-01-31"],
      ["2023-01-01", "2015-01-03", "2015-01-03", "2017-01-03", "2022-12-31"],
      ["2024-01-31", "2017-01-31", "2018-01-31", "2018-01-31", "2024-02-29"],
      ["2023-02-28", "2017-02-28", "2017-02-28", "1980-02-28", "2023-03-27"],
      ["2024-02-29", "2018-02-28", "2018-02-28", "2018-02-28", "2024-02-28"],
      ["2023-01-01", "2024-01-03", "2026-01-03", "2027-01-03", "2022-12-31"],
    ])(
      "when geburt of child is %p, sisters are %p and %p and brother is %p, then ende u6 is %p",
      (
        geburtIsoDate: string,
        geburtGeschw1IsoDate: string,
        geburtGeschw2IsoDate: string,
        geburtGeschw3IsoDate: string,
        endeU6IsoDate: string,
      ) => {
        it("mit geschwister", () => {
          // given
          const geburt = DateTime.fromISO(geburtIsoDate).toJSDate();
          const geschwister: Kind[] = [
            { nummer: 1, geburtsdatum: undefined, istBehindert: false },
            {
              nummer: 2,
              geburtsdatum: DateTime.fromISO(geburtGeschw1IsoDate).toJSDate(),
              istBehindert: false,
            },
            {
              nummer: 3,
              geburtsdatum: DateTime.fromISO(geburtGeschw2IsoDate).toJSDate(),
              istBehindert: false,
            },
            {
              nummer: 4,
              geburtsdatum: DateTime.fromISO(geburtGeschw3IsoDate).toJSDate(),
              istBehindert: false,
            },
          ];

          // when
          const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u6(
            geburt,
            geschwister,
          );

          // then
          expect(date).not.toBeUndefined();
          expect(DateTime.fromJSDate(date).toISODate()).toBe(endeU6IsoDate);
        });
      },
    );
  });
});
