import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./page";
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
        <AllgemeineAngabenForm
          id={formIdentifier}
          onSubmit={navigateToNachwuchsPage}
          hideSubmitButton
        />

        <Button
          className="place-self-end"
          label="Weiter"
          form={formIdentifier}
          isSubmitButton
        />
      </div>
    </Page>
  );
}
