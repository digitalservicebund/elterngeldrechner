import { useEffect } from "react";
import { createAppSelector, useAppSelector } from "@/redux/hooks";
import { trackPartnerschaftlicheVerteilung } from "@/user-tracking";

/**
 * Continuously calculates the quotient for the "Partnerschaftliche Verteilung"
 * of the current plan and pushes it as a variable to the data layer of the user
 * tracking integration. Thereby it can be read any time by any trigger of the
 * user tracking setup.
 */
export function usePartnerschaftlicheVerteilungTracking(): void {
  const calculationParameters = useAppSelector(calculationParameterSelector);

  useEffect(() => {
    const { monthsET1, monthsET2, singleApplicant } = calculationParameters;
    trackPartnerschaftlicheVerteilung(monthsET1, monthsET2, singleApplicant);
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
