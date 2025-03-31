import { useId } from "react";
import { useNavigate } from "react-router";
import { Page } from "./Page";
import { Button } from "@/application/components";
import { ErwerbstaetigkeitForm } from "@/application/features/abfrageteil";
import { formSteps } from "@/application/routing/formSteps";

export function ErwerbstaetigkeitPage() {
  const formIdentifier = useId();

  const navigate = useNavigate();
  const navigateToNachwuchsPage = () => navigate(formSteps.nachwuchs.route);
  const navigateToEinkommenPage = () => navigate(formSteps.einkommen.route);

  return (
    <Page step={formSteps.erwerbstaetigkeit}>
      <div className="flex flex-col gap-56">
        <ErwerbstaetigkeitForm
          id={formIdentifier}
          onSubmit={navigateToEinkommenPage}
          hideSubmitButton
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToNachwuchsPage}
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
