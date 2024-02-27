import { createElternteile } from "./elternteile";
import { Elternteile, Geburtstag } from "./elternteile-types";
import { MutterschutzSettings } from "./elternteile-setting";
import changeMonth, { ChangeMonthSettings } from "./change-month";
import { DateTime } from "luxon";

describe("Change Month", () => {
  const initialElternteile = createElternteile();
  const initialElternteileWithPartnerMonate = createElternteile({
    mehrlinge: false,
    behindertesGeschwisterkind: false,
    partnerMonate: true,
  });

  it("should change the third Lebensmonat of ET1", () => {
    const elternteile: Elternteile = changeMonth(initialElternteile, {
      elternteil: "ET1",
      monthIndex: 2,
      targetType: "BEG",
    });

    expect(elternteile.ET1.months[2].type).toBe("BEG");
  });

  it("should change the third Lebensmonat of ET2", () => {
    const elternteile: Elternteile = changeMonth(initialElternteile, {
      elternteil: "ET2",
      monthIndex: 2,
      targetType: "BEG",
    });

    expect(elternteile.ET2.months[2].type).toBe("BEG");
  });

  it("should decrease the number of BEG for one Elternteil", () => {
    const elternteile: Elternteile = changeMonth(initialElternteile, {
      elternteil: "ET1",
      monthIndex: 2,
      targetType: "BEG",
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(11);
  });

  it("should return a negative number if one Elternteil uses more BEG than it is allowed to", () => {
    let elternteile: Elternteile = initialElternteile;
    for (let i = 0; i < 13; i++) {
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: i,
        targetType: "BEG",
      });
    }

    expect(elternteile.remainingMonths.basiselterngeld).toBe(-1);
  });

  it("should increase the number of BEG if a Lebensmonat with BEG is changed to not having any ElterngeldType", () => {
    let elternteile: Elternteile = initialElternteile;

    elternteile = changeMonth(elternteile, {
      elternteil: "ET1",
      monthIndex: 2,
      targetType: "BEG",
    });
    elternteile = changeMonth(elternteile, {
      elternteil: "ET1",
      monthIndex: 2,
      targetType: "None",
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(12);
  });

  it("should reduce the number of available Basiselterngeld only once", () => {
    let elternteile: Elternteile = initialElternteile;

    elternteile = changeMonth(elternteile, {
      elternteil: "ET1",
      monthIndex: 2,
      targetType: "BEG",
    });
    elternteile = changeMonth(elternteile, {
      elternteil: "ET1",
      monthIndex: 2,
      targetType: "BEG",
    });

    expect(elternteile.remainingMonths.basiselterngeld).toBe(11);
  });

  describe("Partnermonat", () => {
    it("should increase the allowed BEG months to 14 if partnerMonate are true", () => {
      const elternteileSettings = {
        partnerMonate: true,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      };
      let elternteile: Elternteile = initialElternteileWithPartnerMonate;

      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 1,
          targetType: "BEG",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 2,
          targetType: "BEG",
        },
        elternteileSettings,
      );

      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 2,
          targetType: "BEG",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 3,
          targetType: "BEG",
        },
        elternteileSettings,
      );

      // 14 month minus 4 month already taken
      expect(elternteile.remainingMonths.basiselterngeld).toBe(10);
    });

    it("should not increase the allowed BEG months to 14 if partnerMonate are false", () => {
      let elternteile: Elternteile = initialElternteile;

      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 1,
        targetType: "BEG",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 2,
        targetType: "BEG",
      });

      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 3,
        targetType: "BEG",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 4,
        targetType: "BEG",
      });

      // 12 month minus 4 month already taken
      expect(elternteile.remainingMonths.basiselterngeld).toBe(8);
    });

    it("should still have Partnermonate after setting one month to none", () => {
      const elternteileSettings = {
        partnerMonate: true,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      };
      let elternteile: Elternteile = initialElternteileWithPartnerMonate;

      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 1,
          targetType: "BEG",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 2,
          targetType: "BEG",
        },
        elternteileSettings,
      );

      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 2,
          targetType: "BEG",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 3,
          targetType: "BEG",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 4,
          targetType: "BEG",
        },
        elternteileSettings,
      );

      // change a month back to None
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 4,
          targetType: "None",
        },
        elternteileSettings,
      );

      // 14 month minus 4 month already taken
      expect(elternteile.remainingMonths.basiselterngeld).toBe(10);
    });

    it("should increase the BEG months by two if both Elternteile choose BEG and they have a Frühchen", () => {
      let elternteile: Elternteile = initialElternteileWithPartnerMonate;
      const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");
      const dateOfBirth = expectedDateOfBirth.minus({ weeks: 6 });
      const geburtstag: Geburtstag = {
        geburt: dateOfBirth.toISO() as string,
        errechnet: expectedDateOfBirth.toISO() as string,
      };
      const elternteileSettings = {
        partnerMonate: true,
        geburtstag,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      };

      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 1,
          targetType: "BEG",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 2,
          targetType: "BEG",
        },
        elternteileSettings,
      );

      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 1,
          targetType: "BEG",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 3,
          targetType: "BEG",
        },
        elternteileSettings,
      );

      //15 month minus 4 month already taken
      expect(elternteile.remainingMonths.basiselterngeld).toBe(11);
    });
  });

  describe("Sonderregelung Frühgeburt", () => {
    const expectedDateOfBirth = DateTime.fromISO("2022-03-04T00:00:00Z");

    it.each([
      { weeks: 3, allowedAmountOfBEGMonth: 12 }, // Kein Frühchen
      { weeks: 6, allowedAmountOfBEGMonth: 13 },
      { weeks: 8, allowedAmountOfBEGMonth: 14 },
      { weeks: 12, allowedAmountOfBEGMonth: 15 },
      { weeks: 16, allowedAmountOfBEGMonth: 16 },
    ])(
      "should allow $allowedAmountOfBEGMonth Month of BEG if the birth was at least $weeks weeks earlier than expected",
      ({ allowedAmountOfBEGMonth, weeks }) => {
        const dateOfBirth = expectedDateOfBirth.minus({ weeks });

        const elternteile = changeMonth(
          initialElternteile,
          {
            elternteil: "ET1",
            monthIndex: 2,
            targetType: "BEG",
          },
          {
            geburtstag: {
              geburt: dateOfBirth.toISO() as string,
              errechnet: expectedDateOfBirth.toISO() as string,
            },
            mehrlinge: false,
            behindertesGeschwisterkind: false,
          },
        );

        expect(elternteile.remainingMonths.basiselterngeld).toBe(
          allowedAmountOfBEGMonth - 1,
        );
      },
    );
  });

  describe("1 month of EG+ is equal to 2 month of BEG", () => {
    it("should reduce the amount of remaining EG+ month by two after changing one month to BEG", () => {
      const elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "BEG",
      });

      expect(elternteile.remainingMonths.elterngeldplus).toBe(
        initialElternteile.remainingMonths.elterngeldplus - 2,
      );
    });

    it("should not reduce the amount of remaining BEG month into negative if selecting EG+", () => {
      let elternteile = initialElternteile;
      for (let i = 0; i < 10; i++) {
        elternteile = changeMonth(elternteile, {
          elternteil: "ET1",
          monthIndex: i,
          targetType: "BEG",
        });
      }

      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 10,
        targetType: "EG+",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 11,
        targetType: "EG+",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 12,
        targetType: "EG+",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 13,
        targetType: "EG+",
      });

      expect(elternteile.remainingMonths.basiselterngeld).toBe(0);
      expect(elternteile.remainingMonths.elterngeldplus).toBe(0);
    });

    it("should reduce the amount of remaining BEG month by an divisible-by-two amount of EG+ months e.g taking 3 EG+ month will reduce BEG by 4", () => {
      let elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "EG+",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 1,
        targetType: "EG+",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 2,
        targetType: "EG+",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 3,
        targetType: "BEG",
      });

      // 12 month of BEG minus 2 from EG+ (4 month of EG+ rounded up from 3 is equivalent 2 month BEG) minus 1 month BEG
      const expectedBEGMonths = 9;
      expect(elternteile.remainingMonths.basiselterngeld).toBe(
        expectedBEGMonths,
      );
    });

    it("should allow double the amount of Partnermonate (4 months) if the other Elternteil also has some months selected", () => {
      const elternteileSettings = {
        partnerMonate: true,
        mehrlinge: false,
        behindertesGeschwisterkind: false,
      };
      let elternteile = initialElternteileWithPartnerMonate;

      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 0,
          targetType: "EG+",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET1",
          monthIndex: 1,
          targetType: "EG+",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 0,
          targetType: "EG+",
        },
        elternteileSettings,
      );
      elternteile = changeMonth(
        elternteile,
        {
          elternteil: "ET2",
          monthIndex: 1,
          targetType: "EG+",
        },
        elternteileSettings,
      );

      // double 14 BEG month - 4 month EG+
      expect(elternteile.remainingMonths.elterngeldplus).toBe(24);
    });
  });

  describe("Partnschaftsbonus", () => {
    it("should select at least two month for both Elternteile", () => {
      const elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 10,
        targetType: "PSB",
      });

      expect(elternteile.ET1.months[10].type).toBe("PSB");
      expect(elternteile.ET2.months[11].type).toBe("PSB");
      expect(elternteile.ET2.months[10].type).toBe("PSB");
      expect(elternteile.ET2.months[11].type).toBe("PSB");
    });

    it("should select the two last months if selecting the last month", () => {
      const elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 31,
        targetType: "PSB",
      });

      expect(elternteile.ET1.months[30].type).toBe("PSB");
      expect(elternteile.ET2.months[31].type).toBe("PSB");
      expect(elternteile.ET2.months[30].type).toBe("PSB");
      expect(elternteile.ET2.months[31].type).toBe("PSB");
    });

    it("should deselect both months if one of them was deselected", () => {
      let elternteile = changeMonth(initialElternteile, {
        elternteil: "ET2",
        monthIndex: 10,
        targetType: "PSB",
      });

      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 11,
        targetType: "None",
      });

      expect(elternteile.ET1.months[10].type).toBe("None");
      expect(elternteile.ET1.months[11].type).toBe("None");
      expect(elternteile.ET2.months[10].type).toBe("None");
      expect(elternteile.ET2.months[11].type).toBe("None");
    });

    it("should deselect only one month if more than two month are selected", () => {
      // select three months
      let elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "PSB",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 2,
        targetType: "PSB",
      });
      //deselect a month
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "None",
      });

      expect(elternteile.ET1.months[0].type).toBe("None");
      expect(elternteile.ET1.months[1].type).toBe("PSB");
      expect(elternteile.ET1.months[2].type).toBe("PSB");
    });

    it("should only select two month if no other PSB month is selected", () => {
      let elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "PSB",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 2,
        targetType: "PSB",
      });

      expect(elternteile.ET1.months[3].type).toBe("None");
    });

    it("should change the month for the other Elternteil to None if the current Elternteil chooses BEG for a Partnerschaftsbonus month", () => {
      let elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "PSB",
      });

      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "BEG",
      });

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("None");
    });

    describe("having two month selected", () => {
      it("should not allow to select a none adjacent month above the current selection", () => {
        let elternteile = changeMonth(initialElternteile, {
          elternteil: "ET1",
          monthIndex: 7,
          targetType: "PSB",
        });
        elternteile = changeMonth(elternteile, {
          elternteil: "ET1",
          monthIndex: 5,
          targetType: "PSB",
        });

        expect(elternteile.ET1.months[5].type).toBe("None");
      });

      it("should not allow to select a none adjacent month below the current selection", () => {
        let elternteile = changeMonth(initialElternteile, {
          elternteil: "ET1",
          monthIndex: 10,
          targetType: "PSB",
        });
        elternteile = changeMonth(elternteile, {
          elternteil: "ET1",
          monthIndex: 15,
          targetType: "PSB",
        });

        expect(elternteile.ET1.months[15].type).toBe("None");
      });

      it("should allow to select an adjacent month below the current selection", () => {
        let elternteile = changeMonth(initialElternteile, {
          elternteil: "ET1",
          monthIndex: 10,
          targetType: "PSB",
        });
        elternteile = changeMonth(elternteile, {
          elternteil: "ET1",
          monthIndex: 12,
          targetType: "PSB",
        });

        expect(elternteile.ET1.months[12].type).toBe("PSB");
      });

      it("should allow to select an adjacent month above the current selection", () => {
        let elternteile = changeMonth(initialElternteile, {
          elternteil: "ET1",
          monthIndex: 10,
          targetType: "PSB",
        });
        elternteile = changeMonth(elternteile, {
          elternteil: "ET1",
          monthIndex: 9,
          targetType: "PSB",
        });

        expect(elternteile.ET1.months[9].type).toBe("PSB");
      });

      it("should not allow to deselect a month in the middle", () => {
        let elternteile = changeMonth(initialElternteile, {
          elternteil: "ET1",
          monthIndex: 0,
          targetType: "PSB",
        });
        elternteile = changeMonth(elternteile, {
          elternteil: "ET1",
          monthIndex: 2,
          targetType: "PSB",
        });

        elternteile = changeMonth(elternteile, {
          elternteil: "ET1",
          monthIndex: 1,
          targetType: "None",
        });

        expect(elternteile.ET1.months[1].type).toBe("PSB");
      });
    });

    it("should not allow to select more than 4 PSB months", () => {
      let elternteile = changeMonth(initialElternteile, {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "PSB",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 2,
        targetType: "PSB",
      });
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 3,
        targetType: "PSB",
      });

      //try to select a fifth month
      elternteile = changeMonth(elternteile, {
        elternteil: "ET1",
        monthIndex: 4,
        targetType: "PSB",
      });

      expect(elternteile.ET1.months[4].type).toBe("None");
    });

    it("should not allow to select any PSB months if partner months are disabled", () => {
      let anyPSBChangeMonthSettings: ChangeMonthSettings = {
        elternteil: "ET1",
        monthIndex: 0,
        targetType: "PSB",
      };

      let elternteile = changeMonth(
        initialElternteile,
        anyPSBChangeMonthSettings,
        {
          partnerMonate: false,
          mehrlinge: false,
          behindertesGeschwisterkind: false,
        },
      );

      expect(elternteile).toStrictEqual(initialElternteile);
    });
  });

  describe("Months with Mutterschutz", () => {
    const numberOfMutterschutzMonths = 3;

    const geburtstag: Geburtstag = {
      geburt: "2022-03-04T00:00:00Z",
      errechnet: "2022-03-04T00:00:00Z",
    };
    const mutterschutz: MutterschutzSettings = {
      endDate: DateTime.fromISO(geburtstag.geburt)
        .plus({ month: numberOfMutterschutzMonths - 1 })
        .toISO() as string,
      elternteil: "ET1",
    };
    const elternteileSettings = {
      geburtstag,
      mutterschutz,
      mehrlinge: false,
      behindertesGeschwisterkind: false,
    };
    const elternteileWithMutterschutz = createElternteile(elternteileSettings);

    it("should not deselect the Mutterschutz months", () => {
      let elternteile = elternteileWithMutterschutz;
      for (
        let monthIndex = 0;
        monthIndex < numberOfMutterschutzMonths;
        monthIndex++
      ) {
        elternteile = changeMonth(
          elternteileWithMutterschutz,
          {
            monthIndex: monthIndex,
            targetType: "None",
            elternteil: mutterschutz.elternteil,
          },
          elternteileSettings,
        );
      }

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[1].type).toBe("BEG");
      expect(elternteile.ET1.months[2].type).toBe("BEG");
    });

    it("should change the month after the last Mutterschutz month", () => {
      const elternteile = changeMonth(
        elternteileWithMutterschutz,
        {
          monthIndex: 3,
          targetType: "EG+",
          elternteil: mutterschutz.elternteil,
        },
        elternteileSettings,
      );

      expect(elternteile.ET1.months[3].type).toBe("EG+");
    });

    it("should change the months for the other Elternteil", () => {
      const elternteile = changeMonth(
        elternteileWithMutterschutz,
        {
          monthIndex: 0,
          targetType: "EG+",
          elternteil: "ET2",
        },
        elternteileSettings,
      );

      expect(elternteile.ET2.months[0].type).toBe("EG+");
    });

    it("should not change any month to PSB", () => {
      const elternteile = changeMonth(
        elternteileWithMutterschutz,
        {
          monthIndex: 0,
          targetType: "PSB",
          elternteil: "ET2",
        },
        elternteileSettings,
      );

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("None");
    });
  });

  describe("limited number of simultaneous BEG months", () => {
    const firstTwelveMonthIndexes = Array.from(Array(12).keys());

    it.each(firstTwelveMonthIndexes)(
      "is possible to choose a single simultatnous BEG month within the first 12 months (month: '%s')",
      (monthIndex) => {
        const commonSettings = {
          targetType: "BEG",
          monthIndex,
        };
        let elternteile = { ...initialElternteile };

        elternteile = changeMonth(elternteile, {
          ...commonSettings,
          elternteil: "ET1",
        } as ChangeMonthSettings);
        elternteile = changeMonth(elternteile, {
          ...commonSettings,
          elternteil: "ET2",
        } as ChangeMonthSettings);

        expect(elternteile.ET1.months[monthIndex].type).toBe("BEG");
        expect(elternteile.ET2.months[monthIndex].type).toBe("BEG");
      },
    );

    // [[0, 1], [0, 2], ... [1, 0], [1, 2], ..., [11, 9], [11, 10] ]
    const pairsOfPossibleMonthCombinations = firstTwelveMonthIndexes.flatMap(
      (firstMonth) =>
        firstTwelveMonthIndexes
          .map((secondMonth) => [firstMonth, secondMonth])
          .filter(([firstMonth, secondMonth]) => firstMonth !== secondMonth),
    );

    it.each(pairsOfPossibleMonthCombinations)(
      "is not possible to select a second simultaneous BEG month within the first 12 months (months '%s' and '%s')",
      (firstMonth, secondMonth) => {
        let elternteile = { ...initialElternteile };
        elternteile = changeMonth(elternteile, {
          targetType: "BEG",
          monthIndex: firstMonth,
          elternteil: "ET1",
        });

        elternteile = changeMonth(elternteile, {
          targetType: "BEG",
          monthIndex: firstMonth,
          elternteil: "ET2",
        });

        elternteile = changeMonth(elternteile, {
          targetType: "BEG",
          monthIndex: secondMonth,
          elternteil: "ET1",
        });

        elternteile = changeMonth(elternteile, {
          targetType: "BEG",
          monthIndex: secondMonth,
          elternteil: "ET2",
        });

        expect(elternteile.ET1.months[firstMonth].type).toBe("BEG");
        expect(elternteile.ET2.months[firstMonth].type).toBe("BEG");
        expect(elternteile.ET1.months[secondMonth].type).toBe("BEG");
        expect(elternteile.ET2.months[secondMonth].type).not.toBe("BEG");
      },
    );

    it("is possible to select more than one simultaneous BEG months within the first 12 months if multiple kids are expected", () => {
      const elternteileSettings = {
        mehrlinge: true,
        behindertesGeschwisterkind: false,
        partnerMonate: false,
      };

      let elternteile = { ...initialElternteile };
      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 0,
          elternteil: "ET1",
        },
        elternteileSettings,
      );

      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 0,
          elternteil: "ET2",
        },
        elternteileSettings,
      );

      // Second month of ET2 to enable additional partner months (to get past
      // the twelve month)
      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 1,
          elternteil: "ET1",
        },
        elternteileSettings,
      );

      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 1,
          elternteil: "ET2",
        },
        elternteileSettings,
      );

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[1].type).toBe("BEG");
      expect(elternteile.ET2.months[1].type).toBe("BEG");
    });

    it("is possible to select more than one simultaneous BEG months within the first 12 months if there is a disabled sibling", () => {
      const elternteileSettings = {
        mehrlinge: false,
        behindertesGeschwisterkind: true,
        partnerMonate: false,
      };

      let elternteile = { ...initialElternteile };
      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 0,
          elternteil: "ET1",
        },
        elternteileSettings,
      );

      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 0,
          elternteil: "ET2",
        },
        elternteileSettings,
      );

      // Second month of ET2 to enable additional partner months (to get past
      // the twelve month)
      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 1,
          elternteil: "ET1",
        },
        elternteileSettings,
      );

      elternteile = changeMonth(
        elternteile,
        {
          targetType: "BEG",
          monthIndex: 1,
          elternteil: "ET2",
        },
        elternteileSettings,
      );

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[1].type).toBe("BEG");
      expect(elternteile.ET2.months[1].type).toBe("BEG");
    });

    it("is possible to select more simultaneous months after the twelve month", () => {
      let elternteile = { ...initialElternteile };
      elternteile = changeMonth(elternteile, {
        targetType: "BEG",
        monthIndex: 0,
        elternteil: "ET1",
      });

      elternteile = changeMonth(elternteile, {
        targetType: "BEG",
        monthIndex: 0,
        elternteil: "ET2",
      });

      // Second month of ET2 to enable additional partner months (to get past
      // the twelve month)
      elternteile = changeMonth(elternteile, {
        targetType: "BEG",
        monthIndex: 1,
        elternteil: "ET2",
      });

      elternteile = changeMonth(elternteile, {
        targetType: "BEG",
        monthIndex: 12,
        elternteil: "ET1",
      });

      elternteile = changeMonth(elternteile, {
        targetType: "BEG",
        monthIndex: 12,
        elternteil: "ET2",
      });

      elternteile = changeMonth(elternteile, {
        targetType: "BEG",
        monthIndex: 13,
        elternteil: "ET1",
      });

      elternteile = changeMonth(elternteile, {
        targetType: "BEG",
        monthIndex: 13,
        elternteil: "ET2",
      });

      expect(elternteile.ET1.months[0].type).toBe("BEG");
      expect(elternteile.ET2.months[0].type).toBe("BEG");
      expect(elternteile.ET1.months[12].type).toBe("BEG");
      expect(elternteile.ET2.months[12].type).toBe("BEG");
      expect(elternteile.ET1.months[13].type).toBe("BEG");
      expect(elternteile.ET2.months[13].type).toBe("BEG");
    });
  });
});
