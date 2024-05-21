import { DateTime } from "luxon";
import validateElternteile from "./validation";
import { ErrorCode } from "./error-code";
import { InvalidValidationResult } from "./validation-result";
import {
  changeMonth,
  createElternteile,
  Geburtstag,
} from "@/monatsplaner/elternteile";

describe("Validation", () => {
  it("should not be valid if no month was selected", () => {
    const elternteile = createElternteile();

    const validationResult = validateElternteile(
      elternteile,
    ) as InvalidValidationResult;

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errorCodes).toContain<ErrorCode>("HasNoSelection");
  });

  describe("Basiselterngeld", () => {
    it("should not be valid to take more than the available 14 BEG months of Partnermonate for both Elternteile", () => {
      const elternteileSettings = {
        partnerMonate: true,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      };
      let elternteile = createElternteile();
      for (let i = 0; i < 10; i++) {
        elternteile = changeMonth(
          elternteile,
          {
            monthIndex: i,
            targetType: "BEG",
            elternteil: "ET1",
          },
          elternteileSettings,
        );
      }

      for (let i = 10; i <= 14; i++) {
        elternteile = changeMonth(
          elternteile,
          {
            monthIndex: i,
            targetType: "BEG",
            elternteil: "ET2",
          },
          elternteileSettings,
        );
      }

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorCodes).toContain<ErrorCode>(
        "HasTakenMoreThanTheAvailableBEGMonths",
      );
    });

    it("should not be allowed to choose BEG after Lebensmonat 14", () => {
      const elternteileSettings = {
        partnerMonate: true,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      };
      let elternteile = createElternteile();

      elternteile = changeMonth(
        elternteile,
        {
          monthIndex: 14,
          targetType: "BEG",
          elternteil: "ET1",
        },
        elternteileSettings,
      );

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.errorCodes).toContain<ErrorCode>(
        "HasTakenBEGAfterBEGAnspruch",
      );
    });

    it.each([
      { weeks: 3, lebensmonat: 14 }, // Kein Frühchen
      { weeks: 6, lebensmonat: 15 },
      { weeks: 8, lebensmonat: 16 },
      { weeks: 12, lebensmonat: 17 },
      { weeks: 16, lebensmonat: 18 },
    ])(
      "should be allowed to choose BEG up to Lebensmonat $lebensmonat for a Frühchen born $weeks weeks early",
      ({ weeks, lebensmonat }) => {
        const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");
        const dateOfBirth = expectedDateOfBirth.minus({ weeks });
        const geburtstag: Geburtstag = {
          geburt: dateOfBirth.toISO() as string,
          errechnet: expectedDateOfBirth.toISO() as string,
        };
        const elternteileSettings = {
          geburtstag,
          mehrlinge: false,
          behindertesGeschwisterkind: false,
        };
        let elternteile = createElternteile(elternteileSettings);

        elternteile = changeMonth(elternteile, {
          monthIndex: 0,
          targetType: "BEG",
          elternteil: "ET1",
        });
        elternteile = changeMonth(elternteile, {
          monthIndex: lebensmonat - 1,
          targetType: "BEG",
          elternteil: "ET1",
        });

        const validationResult = validateElternteile(
          elternteile,
          elternteileSettings,
        );

        expect(validationResult.isValid).toBe(true);
      },
    );
  });

  describe("at least 2 month of EG", () => {
    it("should be valid if at least 2 BEG months were taken for ET1", () => {
      const elternteile = createElternteile();
      const elternteileWithOneMonthBEG = changeMonth(elternteile, {
        monthIndex: 0,
        targetType: "BEG",
        elternteil: "ET1",
      });
      const elternteileWithTwoMonthsBEG = changeMonth(
        elternteileWithOneMonthBEG,
        {
          monthIndex: 1,
          targetType: "BEG",
          elternteil: "ET1",
        },
      );

      const validationResultWithOneMonth = validateElternteile(
        elternteileWithOneMonthBEG,
      ) as InvalidValidationResult;
      const validationResultWithTwoMonths = validateElternteile(
        elternteileWithTwoMonthsBEG,
      );

      expect(validationResultWithOneMonth.isValid).toBe(false);
      expect(validationResultWithOneMonth.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
      );
      expect(validationResultWithTwoMonths.isValid).toBe(true);
    });

    it("should be valid if at least 2 BEG months were taken for ET2", () => {
      const elternteile = createElternteile();
      const elternteileWithOneMonthBEG = changeMonth(elternteile, {
        monthIndex: 0,
        targetType: "BEG",
        elternteil: "ET2",
      });
      const elternteileWithTwoMonthsBEG = changeMonth(
        elternteileWithOneMonthBEG,
        {
          monthIndex: 1,
          targetType: "BEG",
          elternteil: "ET2",
        },
      );

      const validationResultWithOneMonth = validateElternteile(
        elternteileWithOneMonthBEG,
      ) as InvalidValidationResult;
      const validationResultWithTwoMonths = validateElternteile(
        elternteileWithTwoMonthsBEG,
      );

      expect(validationResultWithOneMonth.isValid).toBe(false);
      expect(validationResultWithOneMonth.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
      );
      expect(validationResultWithTwoMonths.isValid).toBe(true);
    });

    it("should not be valid if one Elternteil has taken one month and the other has taken 2 months", () => {
      let elternteile = createElternteile();
      elternteile = changeMonth(elternteile, {
        monthIndex: 0,
        targetType: "BEG",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 0,
        targetType: "BEG",
        elternteil: "ET2",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 1,
        targetType: "BEG",
        elternteil: "ET2",
      });

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
      );
    });

    it("should be valid if at least 2 month of EG+ were taken", () => {
      const elternteile = createElternteile();
      const elternteileWithOneMonthEGPlus = changeMonth(elternteile, {
        monthIndex: 0,
        targetType: "EG+",
        elternteil: "ET1",
      });
      const elternteileWithTwoMonthsEGPlus = changeMonth(
        elternteileWithOneMonthEGPlus,
        {
          monthIndex: 1,
          targetType: "EG+",
          elternteil: "ET1",
        },
      );

      const validationResultWithOneMonth = validateElternteile(
        elternteileWithOneMonthEGPlus,
      ) as InvalidValidationResult;
      const validationResultWithTwoMonths = validateElternteile(
        elternteileWithTwoMonthsEGPlus,
      );

      expect(validationResultWithOneMonth.isValid).toBe(false);
      expect(validationResultWithOneMonth.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
      );
      expect(validationResultWithTwoMonths.isValid).toBe(true);
    });

    it("should be not valid if no months were taken at all", () => {
      const elternteile = createElternteile();

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
    });

    it("should be not valid if a single month was taken", () => {
      let elternteile = createElternteile();

      elternteile = changeMonth(elternteile, {
        monthIndex: 1,
        targetType: "BEG",
        elternteil: "ET1",
      });

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
      );
    });
  });

  describe("Continuous EG after the BEG Anspruch", () => {
    it("should not be valid if one Elternteil did not take EG+ from the 15th month continuously", () => {
      let elternteile = createElternteile();
      elternteile = changeMonth(elternteile, {
        monthIndex: 14,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 15,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 17,
        targetType: "EG+",
        elternteil: "ET1",
      });

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveContinuousEGAfterBEGAnspruch",
      );
    });

    it("should not be valid if one Elternteil did take EG-Months before the 15th month but not after the 15th month continuously", () => {
      let elternteile = createElternteile();
      //two month BEG before the 15th month
      elternteile = changeMonth(elternteile, {
        monthIndex: 0,
        targetType: "BEG",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 1,
        targetType: "BEG",
        elternteil: "ET1",
      });
      //two month of EG+ after the 15th month
      elternteile = changeMonth(elternteile, {
        monthIndex: 16,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 17,
        targetType: "EG+",
        elternteil: "ET1",
      });

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveContinuousEGAfterBEGAnspruch",
      );
    });

    it("should not be valid if there is a gap between EG+-Months for ET1 and EG+-Months for ET2 after the 15th month", () => {
      let elternteile = createElternteile();
      elternteile = changeMonth(elternteile, {
        monthIndex: 14,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 16,
        targetType: "EG+",
        elternteil: "ET2",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 17,
        targetType: "EG+",
        elternteil: "ET2",
      });

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.errorCodes).toContain<ErrorCode>(
        "DoesNotHaveContinuousEGAfterBEGAnspruch",
      );
    });

    it("should be valid if one Elternteil did take EG+ from the 15th month continuously", () => {
      let elternteile = createElternteile();
      elternteile = changeMonth(elternteile, {
        monthIndex: 14,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 15,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 16,
        targetType: "EG+",
        elternteil: "ET1",
      });

      const validationResult = validateElternteile(elternteile);

      expect(validationResult.isValid).toBe(true);
    });

    it("should be valid if only one Elternteil did take EG+ from the 15th month continuously", () => {
      let elternteile = createElternteile();
      elternteile = changeMonth(elternteile, {
        monthIndex: 14,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 16,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 14,
        targetType: "EG+",
        elternteil: "ET2",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 15,
        targetType: "EG+",
        elternteil: "ET2",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 16,
        targetType: "EG+",
        elternteil: "ET2",
      });

      const validationResult = validateElternteile(elternteile);

      expect(validationResult.isValid).toBe(true);
    });

    it("should be valid if one Elternteil did take at least 2 month EG+ not continuously before the 15th month", () => {
      let elternteile = createElternteile();
      elternteile = changeMonth(elternteile, {
        monthIndex: 0,
        targetType: "EG+",
        elternteil: "ET1",
      });
      elternteile = changeMonth(elternteile, {
        monthIndex: 2,
        targetType: "EG+",
        elternteil: "ET1",
      });

      const validationResult = validateElternteile(elternteile);

      expect(validationResult.isValid).toBe(true);
    });

    it("should be valid if EG+-Month and PSB-Month are taken continuously", () => {
      let elternteile = createElternteile();
      elternteile = changeMonth(elternteile, {
        monthIndex: 14,
        targetType: "EG+",
        elternteil: "ET1",
      });
      for (let i = 0; i < 4; i++) {
        elternteile = changeMonth(elternteile, {
          monthIndex: 15 + i,
          targetType: "PSB",
          elternteil: "ET2",
        });
      }
      elternteile = changeMonth(elternteile, {
        monthIndex: 19,
        targetType: "EG+",
        elternteil: "ET1",
      });

      const validationResult = validateElternteile(elternteile);

      expect(validationResult.isValid).toBe(true);
    });

    it("should be invalid if EG+ is NOT taken continuously starting with 15th month", () => {
      let elternteile = createElternteile();
      for (let i = 0; i < 7; i++) {
        elternteile = changeMonth(elternteile, {
          monthIndex: i,
          targetType: "BEG",
          elternteil: "ET1",
        });
      }
      for (let i = 0; i < 2; i++) {
        elternteile = changeMonth(elternteile, {
          monthIndex: 13 + i,
          targetType: "EG+",
          elternteil: "ET1",
        });
      }
      elternteile = changeMonth(elternteile, {
        monthIndex: 16,
        targetType: "EG+",
        elternteil: "ET1",
      });

      const validationResult = validateElternteile(
        elternteile,
      ) as InvalidValidationResult;

      expect(validationResult.isValid).toBe(false);
    });

    describe("Frühchen", () => {
      const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");
      it.each([
        { weeks: 3, lebensmonat: 15 }, // Kein Frühchen
        { weeks: 6, lebensmonat: 16 },
        { weeks: 8, lebensmonat: 17 },
        { weeks: 12, lebensmonat: 18 },
        { weeks: 16, lebensmonat: 19 },
      ])(
        "should not be valid if one Elternteil did not take from $lebensmonat month continuously EG+ for a Frühchen born $weeks weeks early",
        ({ weeks, lebensmonat }) => {
          const dateOfBirth = expectedDateOfBirth.minus({ weeks });
          const monthIndex = lebensmonat - 1;

          const geburtstag: Geburtstag = {
            geburt: dateOfBirth.toISO() as string,
            errechnet: expectedDateOfBirth.toISO() as string,
          };

          let elternteile = createElternteile();
          elternteile = changeMonth(elternteile, {
            monthIndex: monthIndex,
            targetType: "EG+",
            elternteil: "ET1",
          });
          elternteile = changeMonth(elternteile, {
            monthIndex: monthIndex + 2,
            targetType: "EG+",
            elternteil: "ET1",
          });

          const validationResult = validateElternteile(elternteile, {
            geburtstag,
            mehrlinge: false,
            behindertesGeschwisterkind: false,
          }) as InvalidValidationResult;

          expect(validationResult.isValid).toBe(false);
          expect(validationResult.errorCodes).toContain<ErrorCode>(
            "DoesNotHaveContinuousEGAfterBEGAnspruch",
          );
        },
      );
    });
  });
});
