export enum KinderFreiBetrag {
  ZKF0 = "0",
  ZKF0_5 = "0,5",
  ZKF1 = "1",
  ZKF1_5 = "1,5",
  ZKF2 = "2",
  ZKF2_5 = "2,5",
  ZKF3 = "3",
  ZKF3_5 = "3,5",
  ZKF4 = "4",
  ZKF4_5 = "4,5",
  ZKF5 = "5",
}

/**
 * Returns number of Kinderfreibetrag enum.
 *
 * @param kinderFreiBetrag Kinderfreibetrag as enum.
 *
 * @return kinderFreiBetrag Kinderfreibetrag as number.
 */
export function kinderFreiBetragToNumber(
  kinderFreiBetrag: KinderFreiBetrag,
): number {
  return Number.parseFloat(kinderFreiBetrag.valueOf().replace(",", "."));
}

/**
 * Returns enum of Kinderfreibetrag number.
 *
 * @param kinderFreiBetrag Kinderfreibetrag as number.
 *
 * @return kinderFreiBetrag Kinderfreibetrag as enum.
 */
export function kinderFreiBetragOfNumber(kinderFreiBetrag: number) {
  switch (kinderFreiBetrag) {
    case 0:
      return KinderFreiBetrag.ZKF0;
    case 0.5:
      return KinderFreiBetrag.ZKF0_5;
    case 1:
      return KinderFreiBetrag.ZKF1;
    case 1.5:
      return KinderFreiBetrag.ZKF1_5;
    case 2:
      return KinderFreiBetrag.ZKF2;
    case 2.5:
      return KinderFreiBetrag.ZKF2_5;
    case 3:
      return KinderFreiBetrag.ZKF3;
    case 3.5:
      return KinderFreiBetrag.ZKF3_5;
    case 4:
      return KinderFreiBetrag.ZKF4;
    case 4.5:
      return KinderFreiBetrag.ZKF4_5;
    case 5:
      return KinderFreiBetrag.ZKF5;
    default:
      return undefined;
  }
}
