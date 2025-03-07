import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./page";
import { EinkommenForm } from "@/application/features/abfrageteil";
import { formSteps } from "@/application/routing/formSteps";

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
