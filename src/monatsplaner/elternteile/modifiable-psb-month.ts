import { Month } from "./elternteile-types";

export const getModifiablePSBMonthIndices = (
  months: readonly Month[],
  remainingMonthsPSB: number,
) => {
  const currentPSBIndices = months.flatMap((month, index) =>
    month.type === "PSB" ? [index] : [],
  );

  //no PSB selected, all months are selectable
  if (currentPSBIndices.length === 0) {
    return {
      selectableIndices: months.map((_, index) => index),
      deselectableIndices: [],
    };
  }

  const lowestIndex = currentPSBIndices[0];
  const highestIndex = currentPSBIndices[currentPSBIndices.length - 1];
  if (remainingMonthsPSB > 0) {
    // some PSB month are selected, only adjacent month are selectable and only outermost months can be deselected
    return {
      selectableIndices: [lowestIndex - 1, highestIndex + 1],
      deselectableIndices: [lowestIndex, highestIndex],
    };
  } else {
    // all PSB months are selected, nothing is selectable and only outermost months can be deselected
    return {
      selectableIndices: [],
      deselectableIndices: [lowestIndex, highestIndex],
    };
  }
};
