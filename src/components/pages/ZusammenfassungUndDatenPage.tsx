import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms";
import { Planungsuebersicht } from "@/components/organisms/planungsuebersicht";
import { Page } from "@/components/organisms/page";
import { formSteps } from "@/utils/formSteps";

function ZusammenfassungUndDatenPage() {
  const descriptionIdentifier = useId();

  const navigate = useNavigate();
  const navigateToPreviousStep = () =>
    navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      <div className="flex flex-wrap justify-between gap-y-80">
        <section
          className="flex basis-full flex-col gap-24"
          aria-describedby={descriptionIdentifier}
        >
          <h3>Zusammenfassung</h3>

          <p id={descriptionIdentifier}>
            Hier finden sie eine Übersicht Ihrer Planung der Elterngeldmonate
          </p>

          <Planungsuebersicht />
        </section>

        <Button
          buttonStyle="secondary"
          label="Zurück"
          onClick={navigateToPreviousStep}
        />
      </div>
    </Page>
  );
}

export default ZusammenfassungUndDatenPage;
