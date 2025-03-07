import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./page";
import { AllgemeineAngabenForm } from "@/application/features/abfrageteil";
import { formSteps } from "@/application/routing/formSteps";

export function AllgemeineAngabenPage() {
  const navigate = useNavigate();

  const navigateToNextStep = useCallback(
    () => navigate(formSteps.nachwuchs.route),
    [navigate],
  );

  return (
    <Page step={formSteps.allgemeinAngaben}>
      <AllgemeineAngabenForm onSubmit={navigateToNextStep} />
    </Page>
  );
}
