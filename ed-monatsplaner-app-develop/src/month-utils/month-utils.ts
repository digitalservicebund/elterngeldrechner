import { ElterngeldType, Month } from "../elternteile";

export const firstIndexOfType = (months: readonly Month[], ...types: ElterngeldType[]): number => {
  return months.findIndex((month) => types.includes(month.type));
};

export const lastIndexOfType = (months: readonly Month[], ...types: ElterngeldType[]): number => {
  return months.reduceRight((lastIndex, month, index) => {
    if (lastIndex === -1 && types.includes(month.type)) {
      return index;
    }

    return lastIndex;
  }, -1);
};

const countMonthsByType =
  (type: ElterngeldType) =>
  (months: readonly Month[]): number => {
    return months.filter((month) => month.type === type).length;
  };

export const countBEGMonths = countMonthsByType("BEG");
export const countEGPlusMonths = countMonthsByType("EG+");
export const countPSBMonths = countMonthsByType("PSB");
export const countFilledMonths = (months: readonly Month[]): number => {
  return months.filter((month) => month.type !== "None").length;
};

export const hasContinuousMonthsOfType = (
  months: readonly Month[],
  startIndex: number,
  ...types: ElterngeldType[]
): boolean => {
  const endIndex = lastIndexOfType(months, ...types);

  return !months.slice(startIndex, endIndex + 1).some((month) => !types.includes(month.type));
};
