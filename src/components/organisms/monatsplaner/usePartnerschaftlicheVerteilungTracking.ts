import { useEffect } from "react";
import { calculatePartnerschaftlichkeiteVerteilung } from "@/monatsplaner/elternteile/partnerschaftlichkeit";
import { createAppSelector, useAppSelector } from "@/redux/hooks";
import { setTrackingVariable } from "@/user-tracking/data-layer";

/**
 * Continuously calculates the quotient for the "Partnerschaftliche Verteilung"
 * of the current plan and pushes it as a variable to the data layer of the user
 * tracking integration. Thereby it can be read any time by any trigger of the
 * user tracking setup.
 */
export function usePartnerschaftlicheVerteilungTracking(): void {
  const calculationParameters = useAppSelector(calculationParameterSelector);

  useEffect(() => {
    const quotient = calculatePartnerschaftlichkeiteVerteilung(
      calculationParameters.monthsET1,
      calculationParameters.monthsET2,
      calculationParameters.singleApplicant,
    );

    setTrackingVariable(TRACKING_VARIABLE_NAME, quotient);
  }, [calculationParameters]);
}

const calculationParameterSelector = createAppSelector(
  [
    (state) => state.monatsplaner.elternteile.ET1.months,
    (state) => state.monatsplaner.elternteile.ET2.months,
    (state) => state.stepAllgemeineAngaben.antragstellende,
  ],
  (monthsET1, monthsET2, antragstellende) => ({
    monthsET1: monthsET1.map((month) => month.type),
    monthsET2: monthsET2.map((month) => month.type),
    singleApplicant: antragstellende === "EinenElternteil",
  }),
);

const TRACKING_VARIABLE_NAME = "partnerschaftlicheverteilung";
