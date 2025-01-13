import { describe, expect, it, test } from "vitest";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import { Kind } from "./model";

describe("eg-zwischen-ergebnis-algorithmus", () => {
  describe("should calculate ende bonus u3", () => {
    it("ohne geschwister", () => {
      const geschwister: Kind[] = [];

      const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u3(
        geschwister,
      );

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
        const geschwister: Kind[] = [
          {
            geburtsdatum: geburtGeschw1,
            istBehindert: false,
          },
        ];

        const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u3(
          geschwister,
        );

        expect(date).toEqual(endeU3);
      },
    );

    test.each([
      [new Date("2020-02-14"), new Date("1999-02-14"), new Date("2023-02-13")],
      [new Date("1999-02-14"), new Date("2020-02-14"), new Date("2023-02-13")],
      [new Date("2020-02-14"), new Date("2020-02-14"), new Date("2023-02-13")],
      [new Date("2020-02-14"), new Date("2020-02-15"), new Date("2023-02-14")],
      [new Date("2020-02-14"), new Date("2020-03-14"), new Date("2023-03-13")],
    ])(
      "when geburt of child is %s, sister is %s and brother is %s, then ende u3 is %s",
      (geburtGeschw1: Date, geburtGeschw2: Date, endeU3: Date) => {
        const geschwister: Kind[] = [
          {
            geburtsdatum: geburtGeschw1,
            istBehindert: false,
          },
          {
            geburtsdatum: geburtGeschw2,
            istBehindert: false,
          },
        ];

        const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u3(
          geschwister,
        );

        expect(date).toEqual(endeU3);
      },
    );
  });

  describe("should calculate ende bonus u14", () => {
    it("ohne geschwister", () => {
      const geschwister: Kind[] = [];

      const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u14(
        geschwister,
      );

      expect(date).toBeUndefined();
    });

    it("is undefined if there is no Geschwisterkind with Behinderung", () => {
      const geschwister: Kind[] = [
        { geburtsdatum: new Date(), istBehindert: false },
        { geburtsdatum: new Date(), istBehindert: false },
      ];

      const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u14(
        geschwister,
      );

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

        const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u14(
          geschwister,
        );

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

        const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u14(
          geschwister,
        );

        expect(date).toEqual(endeU14);
      },
    );
  });

  describe("should calculate ende bonus u6", () => {
    it("ohne geschwister", () => {
      const geschwister: Kind[] = [];

      const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u6(
        geschwister,
      );

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
          {
            geburtsdatum: geburtGeschw1,
            istBehindert: false,
          },
          {
            geburtsdatum: geburtGeschw1,
            istBehindert: false,
          },
        ];

        const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u6(
          geschwister,
        );

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
          {
            geburtsdatum: geburtGeschw1,
            istBehindert: false,
          },
          {
            geburtsdatum: geburtGeschw2,
            istBehindert: false,
          },
          {
            geburtsdatum: geburtGeschw3,
            istBehindert: false,
          },
        ];

        const date = new EgZwischenErgebnisAlgorithmus().ende_bonus_u6(
          geschwister,
        );

        expect(date).toEqual(endeU6);
      },
    );
  });

  describe("determine deadline for Geschwisterbonus", () => {
    const algorithm = new EgZwischenErgebnisAlgorithmus();

    it("returns null if no Geschwister", () => {
      const geschwister: Kind[] = [];
      const geburtsdatum = new Date();

      const deadline = algorithm.determineDeadlineForGeschwisterbonus(
        geschwister,
        geburtsdatum,
      );

      expect(deadline).toBeNull();
    });

    it("returns null if all Geschwister are too old for any bonus", () => {
      const geschwister = [
        { geburtsdatum: new Date("2016-01-02"), istBehindert: false },
        { geburtsdatum: new Date("2013-01-02"), istBehindert: false },
        { geburtsdatum: new Date("2005-01-02"), istBehindert: true },
      ];
      const geburtsdatum = new Date("2020-01-01");

      const deadline = algorithm.determineDeadlineForGeschwisterbonus(
        geschwister,
        geburtsdatum,
      );

      expect(deadline).toBeNull();
    });

    it("uses the only deadline that ends after the Geburtstag", () => {
      const geschwister = [
        { geburtsdatum: new Date("2016-01-02"), istBehindert: false },
        { geburtsdatum: new Date("2015-01-02"), istBehindert: false },
        { geburtsdatum: new Date("2005-01-02"), istBehindert: true },
      ];
      const geburtsdatum = new Date("2020-01-01");

      const deadline = algorithm.determineDeadlineForGeschwisterbonus(
        geschwister,
        geburtsdatum,
      );

      expect(deadline).toEqual(new Date("2021-01-01"));
    });

    it("uses the latest deadline that lasts the longest", () => {
      const geschwister = [
        { geburtsdatum: new Date("2017-01-02"), istBehindert: false },
        { geburtsdatum: new Date("2015-01-02"), istBehindert: false },
        { geburtsdatum: new Date("2008-01-02"), istBehindert: true },
      ];
      const geburtsdatum = new Date("2020-01-01");

      const deadline = algorithm.determineDeadlineForGeschwisterbonus(
        geschwister,
        geburtsdatum,
      );

      expect(deadline).toEqual(new Date("2022-01-01"));
    });
  });
});
