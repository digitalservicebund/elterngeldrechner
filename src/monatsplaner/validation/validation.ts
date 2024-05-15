import { allOf, ValidationResult, validationRule } from "./validation-result";
import {
  CreateElternteileSettings,
  Elternteile,
  Geburtstag,
  getFruehchen,
  Month,
} from "@/monatsplaner/elternteile";
import { minNumberOfElterngeld } from "@/monatsplaner/configuration";
import {
  countBEGMonths,
  countEGPlusMonths,
  countFilledMonths,
  hasContinuousMonthsOfType,
  lastIndexOfType,
} from "@/monatsplaner/month-utils";
import { getGeburtstagSettings } from "@/monatsplaner/elternteile/elternteile-setting";

const hasAnySelection = validationRule(
  "HasNoSelection",
  (elternteile: Elternteile) => {
    return (
      countFilledMonths(elternteile.ET1.months) > 0 ||
      countFilledMonths(elternteile.ET2.months) > 0
    );
  },
);

const hasNotTakenMoreThanTheAvailableBEGMonths = validationRule(
  "HasTakenMoreThanTheAvailableBEGMonths",
  (elternteile: Elternteile) => {
    return elternteile.remainingMonths.basiselterngeld >= 0;
  },
);

const hasAtLeast2EGMonthsOrNoneAtAll = validationRule(
  "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
  (elternteile: Elternteile) => {
    const begMonthsET1 = countBEGMonths(elternteile.ET1.months);
    const begMonthsET2 = countBEGMonths(elternteile.ET2.months);
    const egPlusMonthsET1 = countEGPlusMonths(elternteile.ET1.months);
    const egPlusMonthsET2 = countEGPlusMonths(elternteile.ET2.months);
    const egMonthsET1 = begMonthsET1 + egPlusMonthsET1;
    const egMonthsET2 = begMonthsET2 + egPlusMonthsET2;

    return (
      (egMonthsET1 === 0 || egMonthsET1 >= minNumberOfElterngeld) &&
      (egMonthsET2 === 0 || egMonthsET2 >= minNumberOfElterngeld)
    );
  },
);

const hasContinuousEGAfterBEGAnspruch = validationRule(
  "DoesNotHaveContinuousEGAfterBEGAnspruch",
  (elternteile: Elternteile, lastMonthBEGAnspruch: number) => {
    const monthOfBoth: Month[] = elternteile.ET1.months.map(
      (et1Month, index) => {
        if (et1Month.type === "None") {
          return elternteile.ET2.months[index];
        }
        return et1Month;
      },
    );
    const lastIndexOfEGOfBoth = lastIndexOfType(monthOfBoth, "EG+", "PSB");

    return (
      lastIndexOfEGOfBoth <= lastMonthBEGAnspruch ||
      hasContinuousMonthsOfType(monthOfBoth, lastMonthBEGAnspruch, "EG+", "PSB")
    );
  },
);

const hasNotTakenBEGAfterBEGAnspruch = validationRule(
  "HasTakenBEGAfterBEGAnspruch",
  (elternteile: Elternteile, lastMonthBEGAnspruch: number) => {
    return (
      lastIndexOfType(elternteile.ET1.months, "BEG") < lastMonthBEGAnspruch &&
      lastIndexOfType(elternteile.ET2.months, "BEG") < lastMonthBEGAnspruch
    );
  },
);

const getLastMonthOfBEGAnspruch = (geburtstag?: Geburtstag): number => {
  if (geburtstag) {
    switch (getFruehchen(geburtstag)) {
      case "16Weeks":
        return 18;
      case "12Weeks":
        return 17;
      case "8Weeks":
        return 16;
      case "6Weeks":
        return 15;
      case "NotAFruehchen":
        return 14;
    }
  }

  return 14;
};

const validateElternteile = (
  elternteile: Elternteile,
  settings?: CreateElternteileSettings,
): ValidationResult => {
  const lastMonthOfBEGAnspruch = getLastMonthOfBEGAnspruch(
    getGeburtstagSettings(settings),
  );
  return allOf(
    hasAnySelection(elternteile),
    hasNotTakenMoreThanTheAvailableBEGMonths(elternteile),
    hasAtLeast2EGMonthsOrNoneAtAll(elternteile),
    hasContinuousEGAfterBEGAnspruch(elternteile, lastMonthOfBEGAnspruch),
    hasNotTakenBEGAfterBEGAnspruch(elternteile, lastMonthOfBEGAnspruch),
  );
};

export default validateElternteile;
