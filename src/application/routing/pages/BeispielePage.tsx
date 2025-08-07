import { useNavigate } from "react-router";
import { Page } from "./Page";
import { Button } from "@/application/components";
import { formSteps } from "@/application/routing/formSteps";

export function BeispielePage() {
  const navigate = useNavigate();
  const navigateToEinkommenPage = () => navigate(formSteps.einkommen.route);
  const navigateToRechnerUndPlanerPage = () =>
    navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.beispiele}>
      <div className="flex flex-col gap-56">
        <div></div>
        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToEinkommenPage}
          >
            Zurück
          </Button>

          <Button
            type="button"
            buttonStyle="primary"
            onClick={navigateToRechnerUndPlanerPage}
          >
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
