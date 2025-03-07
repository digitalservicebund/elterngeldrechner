import { useCallback } from "react";
import { useNavigate } from "react-router";
import { Page } from "./page";
import { ErwerbstaetigkeitForm } from "@/application/features/abfrageteil";
import { formSteps } from "@/application/routing/formSteps";

export function ErwerbstaetigkeitPage() {
  const navigate = useNavigate();

  const navigateToNextStep = useCallback(
    () => navigate(formSteps.einkommen.route),
    [navigate],
  );

  return (
    <Page step={formSteps.erwerbstaetigkeit}>
      <ErwerbstaetigkeitForm onSubmit={navigateToNextStep} />
    </Page>
  );
}
