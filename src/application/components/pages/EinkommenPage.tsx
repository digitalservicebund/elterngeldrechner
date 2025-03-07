import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { Page } from "@/application/components/organisms";
import { EinkommenForm } from "@/application/features/abfrageteil";

export function EinkommenPage() {
  const navigate = useNavigate();

  const navigateToNextStep = useCallback(
    () => navigate(formSteps.elterngeldvarianten.route),
    [navigate],
  );

  return (
    <Page step={formSteps.einkommen}>
      <EinkommenForm onSubmit={navigateToNextStep} />
    </Page>
  );
}
