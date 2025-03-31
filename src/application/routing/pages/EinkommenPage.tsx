import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./Page";
import { Button } from "@/application/components";
import { EinkommenForm } from "@/application/features/abfrageteil";
import { formSteps } from "@/application/routing/formSteps";

export function EinkommenPage() {
  const formIdentifier = useId();

  const navigate = useNavigate();
  const navigateToErwerbstaetigkeitPage = () =>
    navigate(formSteps.erwerbstaetigkeit.route);
  const navigateToPlanerPage = () => navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.einkommen}>
      <div className="flex flex-col gap-56">
        <EinkommenForm
          id={formIdentifier}
          onSubmit={navigateToPlanerPage}
          hideSubmitButton
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToErwerbstaetigkeitPage}
          >
            Zurück
          </Button>

          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
