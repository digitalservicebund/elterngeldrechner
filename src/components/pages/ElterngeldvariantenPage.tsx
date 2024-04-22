import { useNavigate } from "react-router-dom";
import { formSteps } from "../../utils/formSteps";
import { Page } from "../organisms/page";
import { Button } from "../atoms";
import { ElterngeldvariantenDescriptions } from "../organisms/elterngeldvarianten";
import { ReactNode, useId } from "react";

export function ElterngeldvariantenPage(): ReactNode {
  const descriptionIdentifier = useId();

  const navigate = useNavigate();
  const navigateToPreviousStep = () => navigate(formSteps.einkommen.route);
  const navigateToNextStep = () => navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.elterngeldvarianten}>
      <div className="flex flex-wrap justify-between gap-y-80">
        <section
          className="flex basis-full flex-col gap-24"
          aria-describedby={descriptionIdentifier}
        >
          <p id={descriptionIdentifier}>
            Elterngeld gibt es in 3 Varianten.
            <br />
            Hier finden Sie eine Übersicht über die einzelnen
            Elterngeldoptionen. Diese können Sie im nächsten Schritt miteinander
            kombinieren.
          </p>

          <ElterngeldvariantenDescriptions />
        </section>

        <Button
          buttonStyle="secondary"
          label="zurück"
          onClick={navigateToPreviousStep}
        />

        <Button label="zum Monatsplaner" onClick={navigateToNextStep} />
      </div>
    </Page>
  );
}
