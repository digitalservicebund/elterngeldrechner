import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./Page";
import { Button } from "@/application/components";
import { AllgemeineAngabenForm } from "@/application/features/abfrageteil";
import { formSteps } from "@/application/routing/formSteps";

export function AllgemeineAngabenPage() {
  const formIdentifier = useId();

  const navigate = useNavigate();
  const navigateToNachwuchsPage = () => navigate(formSteps.nachwuchs.route);

  return (
    <Page step={formSteps.allgemeinAngaben}>
      <div className="flex flex-col gap-56">
        TEST
        <AllgemeineAngabenForm
          id={formIdentifier}
          onSubmit={navigateToNachwuchsPage}
          hideSubmitButton
        />
        <div>
          <Button type="submit" form={formIdentifier}>
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
