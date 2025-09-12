import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { FamilieForm } from "@/application/features/abfrage-prototyp";
import { Page } from "@/application/pages/Page";
import { formSteps } from "@/application/routing/formSteps";

export function FamiliePage() {
  const formIdentifier = useId();

  const navigate = useNavigate();
  const navigateToKindPage = () => navigate(formSteps.kind.route);
  const navigateToPersonPage = () => navigate(formSteps.person1.route);

  return (
    <Page step={formSteps.familie}>
      <div className="flex flex-col gap-56">
        <FamilieForm
          id={formIdentifier}
          onSubmit={navigateToPersonPage}
          hideSubmitButton
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToKindPage}
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
