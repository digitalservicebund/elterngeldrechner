import { createElternteile } from "./elternteile";
import {
  ElterngeldType,
  Elternteil,
  Elternteile,
  Geburtstag,
  RemainingMonthByType,
} from "./elternteile-types";
import {
  CreateElternteileSettings,
  MutterschutzSettings,
} from "./elternteile-setting";
import changeMonth from "./change-month";
import { DateTime } from "luxon";

/**
 * The purpose of this class is to highly improve the readability of tests by
 * making their code more concise. It should make test cases shorter and help
 * the reader to grasp easily what this test is actually about.
 *
 * Therefore the following concepts have been used:
 *   - Allowing to easily chain calls to change months. Many scenarios require
 *     to change many months in a row with continuous variable re-assignment.
 *     Sometimes it might be still good to submit calls separated.
 *   - A flat list of named function parameters without the need to create
 *     objects that bloat up the code by formatting. IDE inlay hints help with
 *     the readability for names where needed.
 *   - Meaningful order of parameters like the natural description of such an
 *     action. Also helps to quickly grasp differences between the calls,
 *     formatted below each other.
 *   - Mixing the stateful approach of the source code with the Redux store
 *     and the functional domain logic behind it (i.e. no need to pass
 *     Elterngeld settings every time).
 *
 * This is only implemented in the tests to avoid a bigger refactoring of the
 * source code for now. But is is very important to have good tests in place.
 * Especially for this important part of the code base. Therefore this
 * compromise as it still puts a wrapper around the source code. Which should
 * not be necessary at best.
 *
 * The terminology remains basically untouched.
 *
 * The style to implement this as a class has been chosen for simplicity
 * reasons. The private data field with getters mimic the original data
 * structure is used to simplify usage and keep a strong interface.
 *
 * NOTE: This touched the topic of a weak domain model.
 */
class TestElternteile {
  private elternteile: Elternteile;
  private readonly settings: CreateElternteileSettings | undefined = undefined;

  constructor(settings?: CreateElternteileSettings) {
    this.elternteile = createElternteile(settings);
    this.settings = settings;
  }

  public get ET1(): Elternteil {
    return this.elternteile.ET1;
  }

  public get ET2(): Elternteil {
    return this.elternteile.ET2;
  }

  public get remainingMonths(): RemainingMonthByType {
    return this.elternteile.remainingMonths;
  }

  public changeMonth(
    elternteil: "ET1" | "ET2",
    monthIndex: number,
    targetType: ElterngeldType,
  ): this {
    this.elternteile = changeMonth(
      this.elternteile,
      {
        elternteil,
        monthIndex,
        targetType,
      },
      this.settings,
    );

    return this;
  }
}

function createElternteileWithPartnerMonate(): TestElternteile {
  return new TestElternteile({
    partnerMonate: true,
    mehrlinge: false,
    behindertesGeschwisterkind: false,
  });
}

function createElternteileWithFruehchen(
  weeksTooEarly = 6,
  partnerMonate = false,
): TestElternteile {
  const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");
  const dateOfBirth = expectedDateOfBirth.minus({ weeks: weeksTooEarly });
  const geburtstag: Geburtstag = {
    geburt: dateOfBirth.toISO() as string,
    errechnet: expectedDateOfBirth.toISO() as string,
  };

  return new TestElternteile({
    geburtstag,
    partnerMonate,
    mehrlinge: false,
    behindertesGeschwisterkind: false,
  });
}

function monthIndexRange(start: number, end: number): number[] {
  return Array.from(Array(end + 1).keys()).slice(start, end + 1);
}

describe("Change Month", () => {
  it("should change the third Lebensmonat of ET1", () => {
    const elternteile = new TestElternteile();

    elternteile.changeMonth("ET1", 2, "BEG");

    expect(elternteile.ET1.months[2].type).toBe("BEG");
  });

  it("should change the third Lebensmonat of ET2", () => {
    const elternteile = new TestElternteile();

    elternteile.changeMonth("ET2", 2, "BEG");

    expect(elternteile.ET2.months[2].type).toBe("BEG");
  });

  it("should decrease the number of BEG for one Elternteil", () => {
    const elternteile = new TestElternteile();

    elternteile.changeMonth("ET1", 2, "BEG");

    expect(elternteile.remainingMonths.basiselterngeld).toBe(11);
  });

  it("should return a negative number if one Elternteil uses more BEG than it is allowed to", () => {
    const elternteile = new TestElternteile();

    for (const monthIndex of monthIndexRange(0, 12)) {
      elternteile.changeMonth("ET1", monthIndex, "BEG");
    }

    expect(elternteile.remainingMonths.basiselterngeld).toBe(-1);
  });

  it("should increase the number of BEG if a Lebensmonat with BEG is changed to not having any ElterngeldType", () => {
    const elternteile = new TestElternteile();

    elternteile.changeMonth("ET1", 2, "BEG");
    elternteile.changeMonth("ET1", 2, "None");

    expect(elternteile.remainingMonths.basiselterngeld).toBe(12);
  });

  it("should reduce the number of available Basiselterngeld only once", () => {
    const elternteile = new TestElternteile();

    elternteile.changeMonth("ET1", 2, "BEG");
    elternteile.changeMonth("ET1", 2, "BEG");

    expect(elternteile.remainingMonths.basiselterngeld).toBe(11);
  });

  describe("Partnermonat", () => {
    it("should increase the allowed BEG months to 14 if partnerMonate are true", () => {
      const elternteile = createElternteileWithPartnerMonate();

      elternteile
        .changeMonth("ET1", 1, "BEG")
        .changeMonth("ET1", 2, "BEG")
        .changeMonth("ET2", 2, "BEG")
        .changeMonth("ET2", 3, "BEG");

      expect(elternteile.remainingMonths.basiselterngeld).toBe(14 - 4);
    });

    it("should not increase the allowed BEG months to 14 if partnerMonate are false", () => {
      const elternteile = new TestElternteile();

      elternteile
        .changeMonth("ET1", 1, "BEG")
        .changeMonth("ET1", 2, "BEG")
        .changeMonth("ET1", 3, "BEG")
        .changeMonth("ET1", 4, "BEG");

      expect(elternteile.remainingMonths.basiselterngeld).toBe(12 - 4);
    });

    it("should still have Partnermonate after setting one month to none", () => {
      const elternteile = createElternteileWithPartnerMonate();

      elternteile
        .changeMonth("ET1", 1, "BEG")
        .changeMonth("ET1", 2, "BEG")
        .changeMonth("ET2", 2, "BEG")
        .changeMonth("ET2", 3, "BEG")
        .changeMonth("ET2", 4, "BEG")
        .changeMonth("ET2", 4, "None");

      expect(elternteile.remainingMonths.basiselterngeld).toBe(14 - 4);
    });

    it("should increase the BEG months by two if both Elternteile choose BEG and they have a Frühchen", () => {
      const elternteile = createElternteileWithFruehchen(6, true);

      elternteile
        .changeMonth("ET1", 1, "BEG")
        .changeMonth("ET1", 2, "BEG")
        .changeMonth("ET2", 1, "BEG")
        .changeMonth("ET2", 3, "BEG");

      expect(elternteile.remainingMonths.basiselterngeld).toBe(15 - 4);
    });
  });

  describe("Sonderregelung Frühgeburt", () => {
    it.each([
      { weeksTooEarly: 3, expectedNumberOfBEGMonths: 12 }, // Kein Frühchen
      { weeksTooEarly: 6, expectedNumberOfBEGMonths: 13 },
      { weeksTooEarly: 8, expectedNumberOfBEGMonths: 14 },
      { weeksTooEarly: 12, expectedNumberOfBEGMonths: 15 },
      { weeksTooEarly: 16, expectedNumberOfBEGMonths: 16 },
    ])(
      "should allow $expectedNumberOfBEGMonths Month of BEG if the birth was at least $weeksTooEarly weeks earlier than expected",
      ({ weeksTooEarly, expectedNumberOfBEGMonths }) => {
        const elternteile = createElternteileWithFruehchen(weeksTooEarly);

        elternteile.changeMonth("ET1", 2, "BEG");

        expect(elternteile.remainingMonths.basiselterngeld).toBe(
          expectedNumberOfBEGMonths - 1,
        );
      },
    );
  });

  describe("1 month of EG+ is equal to 2 month of BEG", () => {
    it("should reduce the amount of remaining EG+ month by two after changing one month to BEG", () => {
      const elternteile = new TestElternteile();
      const initialElterngeldPlusMonths =
        elternteile.remainingMonths.elterngeldplus;

      elternteile.changeMonth("ET1", 0, "BEG");

      expect(elternteile.remainingMonths.elterngeldplus).toBe(
        initialElterngeldPlusMonths - 2,
      );
    });

    it("should not reduce the amount of remaining BEG month into negative if selecting EG+", () => {
      const elternteile = new TestElternteile();

      for (const monthIndex of monthIndexRange(0, 9)) {
        elternteile.changeMonth("ET1", monthIndex, "BEG");
      }

      elternteile
        .changeMonth("ET1", 10, "EG+")
        .changeMonth("ET1", 11, "EG+")
        .changeMonth("ET1", 12, "EG+")
        .changeMonth("ET1", 13, "EG+");

      expect(elternteile.remainingMonths.basiselterngeld).toBe(0);
      expect(elternteile.remainingMonths.elterngeldplus).toBe(0);
    });

    it("should reduce the amount of remaining BEG month by an divisible-by-two amount of EG+ months e.g taking 3 EG+ month will reduce BEG by 4", () => {
      const elternteile = new TestElternteile();

      elternteile
        .changeMonth("ET1", 0, "EG+")
        .changeMonth("ET1", 1, "EG+")
        .changeMonth("ET1", 2, "EG+")
        .changeMonth("ET1", 3, "BEG");

      // 12 month of BEG minus 2 from EG+ (4 month of EG+ rounded up from 3 is equivalent 2 month BEG) minus 1 month BEG
      expect(elternteile.remainingMonths.basiselterngeld).toBe(9);
    });

    it("should allow double the amount of Partnermonate (4 months) if the other Elternteil also has some months selected", () => {
      const elternteile = createElternteileWithPartnerMonate();

      elternteile
        .changeMonth("ET1", 0, "EG+")
        .changeMonth("ET1", 1, "EG+")
        .changeMonth("ET2", 0, "EG+")
        .changeMonth("ET2", 1, "EG+");

      // double 14 BEG month - 4 month EG+
      expect(elternteile.remainingMonths.elterngeldplus).toBe(24);
    });
  });

  describe("Partnschaftsbonus", () => {
    it("should select at least two month for both Elternteile", () => {
      const elternteile = new TestElternteile();

      elternteile.changeMonth("ET1", 10, "PSB");

      expect(elternteile.ET1.months[10].type).toBe("PSB");
      expect(elternteile.ET2.months[11].type).toBe("PSB");
      expect(elternteile.ET2.months[10].type).toBe("PSB");
      expect(elternteile.ET2.months[11].type).toBe("PSB");
    });

    it("should select the two last months if selecting the last month", () => {
      const elternteile = new TestElternteile();

      elternteile.changeMonth("ET1", 31, "PSB");

      expect(elternteile.ET1.months[30].type).toBe("PSB");
      expect(elternteile.ET2.months[31].type).toBe("PSB");
      expect(elternteile.ET2.months[30].type).toBe("PSB");
      expect(elternteile.ET2.months[31].type).toBe("PSB");
    });

    it("should deselect both months if one of them was deselected", () => {
      const elternteile = new TestElternteile();

      elternteile.changeMonth("ET2", 10, "PSB");
      elternteile.changeMonth("ET1", 11, "None");

      expect(elternteile.ET1.months[10].type).toBe("None");
      expect(elternteile.ET1.months[11].type).toBe("None");
      expect(elternteile.ET2.months[10].type).toBe("None");
      expect(elternteile.ET2.months[11].type).toBe("None");
    });

    it("should deselect only one month if more than two month are selected", () => {
      const elternteile = new TestElternteile();

      elternteile
        .changeMonth("ET1", 0, "PSB")
        .changeMonth("ET1", 2, "PSB")
        .changeMonth("ET1", 0, "None");

      expect(elternteile.ET1.months[0].type).toBe("None");
      expect(elternteile.ET1.months[1].type).toBe("PSB");
      expect(elternteile.ET1.months[2].type).toBe("PSB");
    });

    it("should only select two month if no other PSB month is selected", () => {
      const elternteile = new TestElternteile();

      elternteile.changeMonth("ET1", 0, "PSB");
      elternteile.changeMonth("ET1", 2, "PSB");

      expect(elternteile.ET1.months[3].type).toBe("None");
    });

    it("should change the month for the other Elternteil to None if the current Elternteil chooses BEG for a Partnerschaftsbonus month", () => {
      const elternteile = new TestElternteile();

      elternteile.changeMonth("ET1", 0, "PSB");
      elternteile.changeMonth("ET1", 0, "BEG");

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("None");
    });

    describe("having two month selected", () => {
      it("should not allow to select a none adjacent month above the current selection", () => {
        const elternteile = new TestElternteile();

        elternteile.changeMonth("ET1", 7, "PSB");
        elternteile.changeMonth("ET1", 5, "PSB");

        expect(elternteile.ET1.months[5].type).toBe("None");
      });

      it("should not allow to select a none adjacent month below the current selection", () => {
        const elternteile = new TestElternteile();

        elternteile.changeMonth("ET1", 10, "PSB");
        elternteile.changeMonth("ET1", 15, "PSB");

        expect(elternteile.ET1.months[15].type).toBe("None");
      });

      it("should allow to select an adjacent month below the current selection", () => {
        const elternteile = new TestElternteile();

        elternteile.changeMonth("ET1", 10, "PSB");
        elternteile.changeMonth("ET1", 12, "PSB");

        expect(elternteile.ET1.months[12].type).toBe("PSB");
      });

      it("should allow to select an adjacent month above the current selection", () => {
        const elternteile = new TestElternteile();

        elternteile.changeMonth("ET1", 10, "PSB");
        elternteile.changeMonth("ET1", 9, "PSB");

        expect(elternteile.ET1.months[9].type).toBe("PSB");
      });

      it("should not allow to deselect a month in the middle", () => {
        const elternteile = new TestElternteile();

        elternteile
          .changeMonth("ET1", 0, "PSB")
          .changeMonth("ET1", 2, "PSB")
          .changeMonth("ET1", 1, "None");

        expect(elternteile.ET1.months[1].type).toBe("PSB");
      });
    });

    it("should not allow to select more than 4 PSB months", () => {
      const elternteile = new TestElternteile();

      elternteile
        .changeMonth("ET1", 0, "PSB")
        .changeMonth("ET1", 2, "PSB")
        .changeMonth("ET1", 3, "PSB")
        .changeMonth("ET1", 4, "PSB");

      expect(elternteile.ET1.months[4].type).toBe("None");
    });

    it("should not allow to select any PSB months if partner months are disabled", () => {
      const elternteile = new TestElternteile({
        partnerMonate: false,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      });

      elternteile.changeMonth("ET1", 2, "PSB");

      expect(elternteile.ET1.months[2].type).toBe("None");
    });
  });

  describe("Months with Mutterschutz", () => {
    function createElternteileWithMutterschutz(
      elternteilWithMutterschutz: "ET1" | "ET2" = "ET1",
      numberOfMutterschutzMonths = 3,
    ): TestElternteile {
      const geburtstag: Geburtstag = {
        geburt: "2022-03-04T00:00:00Z",
        errechnet: "2022-03-04T00:00:00Z",
      };

      const mutterschutz: MutterschutzSettings = {
        endDate: DateTime.fromISO(geburtstag.geburt)
          .plus({ month: numberOfMutterschutzMonths - 1 })
          .toISO() as string,
        elternteil: elternteilWithMutterschutz,
      };

      return new TestElternteile({
        geburtstag,
        mutterschutz,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      });
    }

    it("should not deselect the Mutterschutz months", () => {
      const elternteile = createElternteileWithMutterschutz("ET1", 2);

      for (const monthIndex of monthIndexRange(0, 1)) {
        elternteile.changeMonth("ET1", monthIndex, "None");
      }

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[1].type).toBe("BEG");
    });

    it("should change the month after the last Mutterschutz month", () => {
      const elternteile = createElternteileWithMutterschutz("ET1", 2);

      elternteile.changeMonth("ET1", 2, "EG+");

      expect(elternteile.ET1.months[2].type).toBe("EG+");
    });

    it("should change the months for the other Elternteil", () => {
      const elternteile = createElternteileWithMutterschutz("ET1");

      elternteile.changeMonth("ET2", 0, "EG+");

      expect(elternteile.ET2.months[0].type).toBe("EG+");
    });

    it("should not change any month to PSB", () => {
      const elternteile = createElternteileWithMutterschutz("ET1");

      elternteile.changeMonth("ET2", 0, "PSB");

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("None");
    });
  });

  describe("limited number of simultaneous BEG months", () => {
    it.each(monthIndexRange(0, 11))(
      "is possible to choose a single simultatnous BEG month within the first 12 months (month: '%s')",
      (monthIndex) => {
        const elternteile = new TestElternteile();

        elternteile.changeMonth("ET1", monthIndex, "BEG");
        elternteile.changeMonth("ET2", monthIndex, "BEG");

        expect(elternteile.ET1.months[monthIndex].type).toBe("BEG");
        expect(elternteile.ET2.months[monthIndex].type).toBe("BEG");
      },
    );

    // [[0, 1], [0, 2], ... [1, 0], [1, 2], ..., [11, 9], [11, 10] ]
    const firstTwelveMonths = monthIndexRange(0, 11);
    const pairsOfPossibleMonthCombinations = firstTwelveMonths.flatMap(
      (firstMonth) =>
        firstTwelveMonths
          .map((secondMonth) => [firstMonth, secondMonth])
          .filter(([firstMonth, secondMonth]) => firstMonth !== secondMonth),
    );

    it.each(pairsOfPossibleMonthCombinations)(
      "is not possible to select a second simultaneous BEG month within the first 12 months (months '%s' and '%s')",
      (firstMonth, secondMonth) => {
        const elternteile = new TestElternteile();

        elternteile
          .changeMonth("ET1", firstMonth, "BEG")
          .changeMonth("ET2", firstMonth, "BEG")
          .changeMonth("ET1", secondMonth, "BEG")
          .changeMonth("ET2", secondMonth, "BEG");

        expect(elternteile.ET1.months[firstMonth].type).toBe("BEG");
        expect(elternteile.ET2.months[firstMonth].type).toBe("BEG");
        expect(elternteile.ET1.months[secondMonth].type).toBe("BEG");
        expect(elternteile.ET2.months[secondMonth].type).not.toBe("BEG");
      },
    );

    it("is possible to select more than one simultaneous BEG months within the first 12 months if multiple kids are expected", () => {
      const elternteile = new TestElternteile({
        mehrlinge: true,
        behindertesGeschwisterkind: false,
        partnerMonate: false,
      });

      elternteile
        .changeMonth("ET1", 0, "BEG")
        .changeMonth("ET2", 0, "BEG")
        .changeMonth("ET1", 1, "BEG")
        .changeMonth("ET2", 1, "BEG");

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[1].type).toBe("BEG");
      expect(elternteile.ET2.months[1].type).toBe("BEG");
    });

    it("is possible to select more than one simultaneous BEG months within the first 12 months if there is a disabled sibling", () => {
      const elternteile = new TestElternteile({
        behindertesGeschwisterkind: true,
        mehrlinge: false,
        partnerMonate: false,
      });

      elternteile
        .changeMonth("ET1", 0, "BEG")
        .changeMonth("ET2", 0, "BEG")
        .changeMonth("ET1", 1, "BEG")
        .changeMonth("ET2", 1, "BEG");

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[1].type).toBe("BEG");
      expect(elternteile.ET2.months[1].type).toBe("BEG");
    });

    it("is possible to select more simultaneous months after the twelve month", () => {
      const elternteile = new TestElternteile();

      elternteile
        .changeMonth("ET1", 0, "BEG")
        .changeMonth("ET2", 0, "BEG")
        .changeMonth("ET1", 12, "BEG")
        .changeMonth("ET2", 12, "BEG")
        .changeMonth("ET1", 13, "BEG")
        .changeMonth("ET2", 13, "BEG");

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[12].type).toBe("BEG");
      expect(elternteile.ET2.months[12].type).toBe("BEG");
      expect(elternteile.ET1.months[13].type).toBe("BEG");
      expect(elternteile.ET2.months[13].type).toBe("BEG");
    });
  });
});
