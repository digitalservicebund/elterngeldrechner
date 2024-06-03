import { setTrackingVariable } from "./data-layer";
import { ElterngeldType } from "@/monatsplaner";

export function trackPartnerschaftlicheVerteilung(
  monthsET1: ElterngeldType[],
  monthsET2: ElterngeldType[],
  singleApplicant: boolean,
): void {
  if (!singleApplicant) {
    const verteilung = calculatePartnerschaftlichkeiteVerteilung(
      monthsET1,
      monthsET2,
    );
    setTrackingVariable(TRACKING_VARIABLE_NAME, verteilung);
  }
}

/**
 * This is a small algorithm which calculates a quotient of how well the planned
 * months are distributed between both partners. A quotient of `0` means no
 * distribution at all, while `1` means completely equal distribution. This takes
 * into account the different variants partners can choose from and assigns
 * balanced values to them.
 *
 * @returns quotient between 0 and 1 of the distribution
 */
function calculatePartnerschaftlichkeiteVerteilung(
  monthsET1: ElterngeldType[],
  monthsET2: ElterngeldType[],
): number | undefined {
  const valueET1 = calculateValueOfElternteil(monthsET1);
  const valueET2 = calculateValueOfElternteil(monthsET2);

  const smallerValue = Math.min(valueET1, valueET2);
  const biggerValue = Math.max(valueET1, valueET2);

  const hasNoPartnerschaftlichkeit = biggerValue === 0;
  const quotient = smallerValue / biggerValue;

  return hasNoPartnerschaftlichkeit ? 0 : quotient;
}

/**
 * The calculated "value" for a partner is a unit less numeric value that
 * represents the sum of all the months planned for this partner. Therefore,
 * each planned month get weighted based on the chosen variant.
 */
function calculateValueOfElternteil(months: ElterngeldType[]): number {
  return months
    .map((type) => ELTERNGELD_TYPE_TO_PARTNERSCHAFTLICHKEITS_VALUE[type])
    .reduce((sum, value) => sum + value, 0);
}

const ELTERNGELD_TYPE_TO_PARTNERSCHAFTLICHKEITS_VALUE: Record<
  ElterngeldType,
  number
> = {
  BEG: 1,
  "EG+": 0.5,
  PSB: 0.5,
  None: 0,
};

const TRACKING_VARIABLE_NAME = "partnerschaftlicheverteilung";
