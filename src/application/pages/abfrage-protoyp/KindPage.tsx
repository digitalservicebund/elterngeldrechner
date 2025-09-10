import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/application/components";
import { KindForm } from "@/application/features/abfrage-prototyp";
import { Page } from "@/application/pages/Page";
import { formSteps } from "@/application/routing/formSteps";

export function KindPage() {
  const formIdentifier = useId();

  const navigate = useNavigate();
  const navigateToEinfuehrungsPage = () =>
    navigate(formSteps.einfuehrung.route);
  const navigateToFamiliePage = () => navigate(formSteps.familie.route);

  return (
    <Page step={formSteps.kind}>
      <div className="flex flex-col gap-56">
        <KindForm
          id={formIdentifier}
          onSubmit={navigateToFamiliePage}
          hideSubmitButton
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToEinfuehrungsPage}
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
