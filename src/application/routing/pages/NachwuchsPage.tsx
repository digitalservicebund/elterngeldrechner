import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./Page";
import { Button } from "@/application/components";
import { NachwuchsForm } from "@/application/features/abfrageteil";
import {
  StepNachwuchsState,
  parseGermanDateString,
} from "@/application/features/abfrageteil/state";
import { formSteps } from "@/application/routing/formSteps";
import { trackNutzergruppe } from "@/application/user-tracking";

export function NachwuchsPage() {
  const formIdentifier = useId();

  const navigate = useNavigate();
  const navigateToAllgemeineAngabenPage = () =>
    navigate(formSteps.allgemeinAngaben.route);

  const trackNutzergruppeAndNavigateToErwerbstaetigkeitPage = (
    values: StepNachwuchsState,
  ) => {
    const birthdate = parseGermanDateString(
      values.wahrscheinlichesGeburtsDatum,
    );

    trackNutzergruppe(birthdate);
    navigate(formSteps.erwerbstaetigkeit.route);
  };

  return (
    <Page step={formSteps.nachwuchs}>
      <div className="flex flex-col gap-56">
        <NachwuchsForm
          id={formIdentifier}
          onSubmit={trackNutzergruppeAndNavigateToErwerbstaetigkeitPage}
          hideSubmitButton
        />

        <div className="flex gap-16">
          <Button
            type="button"
            buttonStyle="secondary"
            onClick={navigateToAllgemeineAngabenPage}
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
