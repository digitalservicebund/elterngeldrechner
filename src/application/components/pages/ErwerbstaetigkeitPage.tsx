import { useCallback } from "react";
import { useNavigate } from "react-router";
import { formSteps } from "./formSteps";
import { Page } from "@/application/components/organisms";
import { ErwerbstaetigkeitForm } from "@/application/features/abfrageteil";

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
