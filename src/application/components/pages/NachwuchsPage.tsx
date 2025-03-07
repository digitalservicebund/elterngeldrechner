import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { Page } from "@/application/components/organisms";
import { NachwuchsForm } from "@/application/features/abfrageteil";
import {
  StepNachwuchsState,
  parseGermanDateString,
} from "@/application/features/abfrageteil/state";
import { trackNutzergruppe } from "@/application/user-tracking";

export function NachwuchsPage() {
  const navigate = useNavigate();

  const trackNutzergruppeAndNavigateToNextStep = useCallback(
    (values: StepNachwuchsState) => {
      const birthdate = parseGermanDateString(
        values.wahrscheinlichesGeburtsDatum,
      );

      trackNutzergruppe(birthdate);
      navigate(formSteps.erwerbstaetigkeit.route);
    },
    [navigate],
  );

  return (
    <Page step={formSteps.nachwuchs}>
      <NachwuchsForm onSubmit={trackNutzergruppeAndNavigateToNextStep} />
    </Page>
  );
}
