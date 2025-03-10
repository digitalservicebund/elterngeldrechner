import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./page";
import { Button } from "@/application/components";
import { EinkommenForm } from "@/application/features/abfrageteil";
import { formSteps } from "@/application/routing/formSteps";

export function EinkommenPage() {
  const formIdentifier = useId();

  const navigate = useNavigate();
  const navigateToErwerbstaetigkeitPage = () =>
    navigate(formSteps.erwerbstaetigkeit.route);
  const navigateToElterngeldvariantenPage = () =>
    navigate(formSteps.elterngeldvarianten.route);

  return (
    <Page step={formSteps.einkommen}>
      <div className="flex flex-col gap-56">
        <EinkommenForm
          id={formIdentifier}
          onSubmit={navigateToElterngeldvariantenPage}
          hideSubmitButton
        />

        <div className="flex justify-between">
          <Button
            label="Zurück"
            buttonStyle="secondary"
            onClick={navigateToErwerbstaetigkeitPage}
          />

          <Button label="Weiter" form={formIdentifier} isSubmitButton />
        </div>
      </div>
    </Page>
  );
}
