import { KindUtil } from "./kind-util";

describe("kind-util", () => {
  describe.each([
    [[], undefined],
    [["", "", ""], undefined],
    [["1995-02-24T03:24:00"], "1995-02-24T03:24:00"],
    [["2006-09-08T10:37:00", "1995-02-24T03:24:00"], "2006-09-08T10:37:00"],
    [["2006-09-08T10:37:00", "", "1994-01-12T10:25:00"], "2006-09-08T10:37:00"],
    [["1994-09-08T10:37:00", "1995-02-24T03:24:00"], "1995-02-24T03:24:00"],
    [["1954-09-08T10:37:00", "1955-02-24T03:24:00"], "1955-02-24T03:24:00"],
    [
      [
        "1900-09-08T10:37:00",
        "1970-02-24T03:24:00",
        "1955-02-24T03:24:00",
        "2006-09-08T10:37:00",
      ],
      "2006-09-08T10:37:00",
    ],
  ])(
    "in %p found %p",
    (birthdayList: string[], birthday: string | undefined) => {
      it("should find last born child", () => {
        // given
        const kindList = birthdayList.map((value, index) => {
          return {
            nummer: index + 1,
            geburtsdatum: value === "" ? undefined : new Date(value),
            istBehindert: false,
          };
        });

        // when
        const actual = KindUtil.findLastBornChild(kindList);

        // then
        expect(actual?.geburtsdatum?.toISOString()).toBe(
          birthday === undefined ? undefined : new Date(birthday).toISOString(),
        );
      });
    },
  );

  describe.each([
    [[], undefined],
    [["", "", ""], undefined],
    [["1995-02-24T03:24:00"], undefined],
    [["2006-09-08T10:37:00", "1995-02-24T03:24:00"], "1995-02-24T03:24:00"],
    [
      ["2006-09-08T10:37:00", "1995-02-24T03:24:00", "1994-01-12T10:25:00"],
      "1995-02-24T03:24:00",
    ],
    [["2006-09-08T10:37:00", "", "1994-01-12T10:25:00"], "1994-01-12T10:25:00"],
    [
      [
        "2006-09-08T10:37:00",
        "1995-02-24T03:23:59",
        "",
        "1995-02-24T03:24:00",
        "1994-01-12T10:25:00",
      ],
      "1995-02-24T03:24:00",
    ],
  ])(
    "in %p found %p",
    (birthdayList: string[], birthday: string | undefined) => {
      it("should find second born child", () => {
        // given
        const kindList = birthdayList.map((value, index) => {
          return {
            nummer: index + 1,
            geburtsdatum: value === "" ? undefined : new Date(value),
            istBehindert: false,
          };
        });

        // when
        const actual = KindUtil.findSecondLastBornChild(kindList);

        // then
        expect(actual?.geburtsdatum?.toISOString()).toBe(
          birthday === undefined ? undefined : new Date(birthday).toISOString(),
        );
      });
    },
  );
});
