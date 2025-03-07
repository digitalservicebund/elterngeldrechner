import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { Page } from "./page";
import { AllgemeineAngabenForm } from "@/application/features/abfrageteil";

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
