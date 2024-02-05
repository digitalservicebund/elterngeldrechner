import { countBEGMonths, countEGPlusMonths, countPSBMonths } from "../month-utils";
import { maxNumberOfPartnerschaftbonus } from "../configuration";
import { getModifiablePSBMonthIndices } from "./modifiable-psb-month";
import { ElterngeldType, Elternteil, Elternteile, Geburtstag, Month } from "./elternteile-types";
import { getNumberOfMutterschutzMonths } from "./mutterschutz-calculator";
import {
  CreateElternteileSettings,
  getGeburtstagSettings,
  getPartnerMonateSettings,
  hasMutterschutzSettings,
} from "./elternteile-setting";
import { getBEGAnspruch } from "./beg-anspruch";

export interface ChangeMonthSettings {
  readonly elternteil: "ET1" | "ET2";
  readonly monthIndex: number;
  readonly targetType: ElterngeldType;
}

const calculateBEGAnspruch = (
  currentElternteilMonths: readonly Month[],
  otherElternteilMonths: readonly Month[],
  partnerMonate: boolean,
  geburtstag?: Geburtstag,
): number => {
  let anspruch = getBEGAnspruch(geburtstag);

  if (partnerMonate) {
    anspruch += 2;
  }

  return anspruch;
};

const roundUp = (x: number): number => Math.ceil(x / 2);

const canNotBeChangedDueToMutterschutz = (
  { elternteil, monthIndex, targetType }: ChangeMonthSettings,
  settings: CreateElternteileSettings,
): boolean => {
  return (
    hasMutterschutzSettings(settings) &&
    (settings.mutterschutz.elternteil === elternteil || targetType === "PSB") &&
    monthIndex < getNumberOfMutterschutzMonths(settings.geburtstag, settings.mutterschutz.endDate)
  );
};

const canNotBeChangedDueToUnmodifiablePSB = (
  { elternteil, monthIndex, targetType }: ChangeMonthSettings,
  elternteile: Elternteile,
) => {
  const currentType = elternteile[elternteil].months[monthIndex].type;
  const { selectableIndices, deselectableIndices } = getModifiablePSBMonthIndices(
    elternteile[elternteil].months,
    elternteile.remainingMonths.partnerschaftsbonus,
  );

  return (
    (targetType === "PSB" && !selectableIndices.includes(monthIndex)) ||
    (targetType === "None" && currentType === "PSB" && !deselectableIndices.includes(monthIndex))
  );
};

const replaceMonthAtIndex = (replacement: Month, monthIndex: number, months: readonly Month[]): Month[] => {
  const modifiedMonths = [...months];
  modifiedMonths[monthIndex] = replacement;

  return modifiedMonths;
};

const changeMonth = (
  elternteile: Elternteile,
  changeMonthSettings: ChangeMonthSettings,
  elternteileSettings?: CreateElternteileSettings,
): Elternteile => {
  const { elternteil, monthIndex, targetType } = changeMonthSettings;
  const otherETKey = elternteil === "ET1" ? "ET2" : "ET1";
  const currentET = elternteile[elternteil];
  const otherET = elternteile[otherETKey];
  const currentType = currentET.months[monthIndex].type;

  if (currentET.months[monthIndex].type === targetType) {
    return elternteile;
  }

  if (elternteileSettings && canNotBeChangedDueToMutterschutz(changeMonthSettings, elternteileSettings)) {
    return elternteile;
  }

  if (canNotBeChangedDueToUnmodifiablePSB(changeMonthSettings, elternteile)) {
    return elternteile;
  }

  let currentMonths = replaceMonthAtIndex(
    { type: targetType, isMutterschutzMonth: false },
    monthIndex,
    currentET.months,
  );
  let otherMonths = otherET.months;

  // reset PSB of otherET for case that something else is selected
  if (currentET.months[monthIndex].type === "PSB") {
    otherMonths = replaceMonthAtIndex({ type: "None", isMutterschutzMonth: false }, monthIndex, otherMonths);
  }

  if (targetType === "PSB") {
    // PSB must always be set for both elternteile
    otherMonths = replaceMonthAtIndex({ type: targetType, isMutterschutzMonth: false }, monthIndex, otherMonths);
    //if there is no PSB Month, select two PSB months
    const hasAtLeastOnePSBMonth = currentET.months.some((month) => month.type === "PSB");
    if (!hasAtLeastOnePSBMonth) {
      const isLastMonthIndex = monthIndex === currentET.months.length - 1;
      const automaticallySelectedPSBMonthIndex = isLastMonthIndex ? monthIndex - 1 : monthIndex + 1;
      otherMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        automaticallySelectedPSBMonthIndex,
        otherMonths,
      );
      currentMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        automaticallySelectedPSBMonthIndex,
        currentMonths,
      );
    }
  }

  //deselect PSB months if only one is remaining
  if (targetType === "None" && currentType === "PSB") {
    const existingPSBIndices = currentMonths.flatMap((month, index) =>
      month.type === "PSB" && index !== monthIndex ? [index] : [],
    );
    if (existingPSBIndices.length === 1) {
      const existingPSBIndex = existingPSBIndices[0];
      otherMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        existingPSBIndex,
        otherMonths,
      );
      currentMonths = replaceMonthAtIndex(
        { type: targetType, isMutterschutzMonth: false },
        existingPSBIndex,
        currentMonths,
      );
    }
  }

  const anspruch = calculateBEGAnspruch(
    currentMonths,
    otherMonths,
    getPartnerMonateSettings(elternteileSettings),
    getGeburtstagSettings(elternteileSettings),
  );
  const begMonthsTakenByBoth = countBEGMonths(currentMonths) + countBEGMonths(otherMonths);
  const egPlusMonthsTakenByBoth = countEGPlusMonths(currentMonths) + countEGPlusMonths(otherMonths);
  let remainingMonthsBEG = anspruch - begMonthsTakenByBoth;
  if (remainingMonthsBEG > 0) {
    remainingMonthsBEG = Math.max(0, remainingMonthsBEG - roundUp(egPlusMonthsTakenByBoth));
  }
  const remainingMonthsEGPlus = 2 * (anspruch - begMonthsTakenByBoth) - egPlusMonthsTakenByBoth;
  const remainingPartnerschaftsbonus = maxNumberOfPartnerschaftbonus - countPSBMonths(currentMonths);

  const changedCurrentET: Elternteil = {
    ...currentET,
    months: currentMonths,
  };

  const changedOtherET: Elternteil = {
    ...otherET,
    months: otherMonths,
  };

  return {
    ...elternteile,
    remainingMonths: {
      basiselterngeld: remainingMonthsBEG,
      elterngeldplus: remainingMonthsEGPlus,
      partnerschaftsbonus: remainingPartnerschaftsbonus,
    },
    [elternteil]: changedCurrentET,
    [otherETKey]: changedOtherET,
  };
};

export default changeMonth;
